import { EventEmitter } from "eventemitter3";
import {
  DataPacket_Kind,
  RemoteAudioTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
  createAudioAnalyser,
} from "livekit-client";

// Initialize React Native globals for LiveKit if available
let livekitGlobalsRegistered = false;
// Note: We'll register globals when needed in startCall() for better error handling

// React Native compatible timer functions
const requestAnimationFrame = (callback: () => void): number => {
  if (typeof window !== "undefined" && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  // Fallback for React Native
  return setTimeout(callback, 16) as any; // ~60fps
};

const cancelAnimationFrame = (id: number): void => {
  if (typeof window !== "undefined" && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};

const hostUrl = "wss://retell-ai-4ihahnq7.livekit.cloud";

// React Native compatible text decoder
const createTextDecoder = () => {
  if (typeof TextDecoder !== "undefined") {
    return new TextDecoder();
  }

  // Fallback for React Native - proper UTF-8 decoding
  return {
    decode: (buffer: Uint8Array): string => {
      // Convert Uint8Array to string with proper UTF-8 handling
      try {
        // Try using Buffer if available (React Native has Buffer polyfill)
        if (typeof Buffer !== "undefined") {
          return Buffer.from(buffer).toString("utf8");
        }

        // Fallback: manual UTF-8 decoding
        let result = "";
        let i = 0;
        while (i < buffer.length) {
          let byte1 = buffer[i++];

          if (byte1 < 0x80) {
            // Single byte character
            result += String.fromCharCode(byte1);
          } else if ((byte1 & 0xe0) === 0xc0) {
            // Two byte character
            let byte2 = buffer[i++];
            result += String.fromCharCode(
              ((byte1 & 0x1f) << 6) | (byte2 & 0x3f)
            );
          } else if ((byte1 & 0xf0) === 0xe0) {
            // Three byte character
            let byte2 = buffer[i++];
            let byte3 = buffer[i++];
            result += String.fromCharCode(
              ((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f)
            );
          } else {
            // Skip invalid bytes
            result += String.fromCharCode(0xfffd); // Replacement character
          }
        }
        return result;
      } catch (error) {
        console.warn("Error decoding text:", error);
        // Last resort: simple conversion
        return String.fromCharCode.apply(null, Array.from(buffer));
      }
    },
  };
};

const decoder = createTextDecoder();

export interface StartCallConfig {
  accessToken: string;
  sampleRate?: number;
  captureDeviceId?: string; // specific sink id for audio capture device
  playbackDeviceId?: string; // specific sink id for audio playback device
  emitRawAudioSamples?: boolean; // receive raw float32 audio samples (ex. for animation). Default to false.
}

export class RetellWebClient extends EventEmitter {
  // Room related
  private room: Room;
  private connected: boolean = false;

  // Helper nodes and variables to analyze and animate based on audio
  public isAgentTalking: boolean = false;

  // Analyser node for agent audio, only available when
  // emitRawAudioSamples is true. Can directly use / modify this for visualization.
  // contains a calculateVolume helper method to get the current volume.
  public analyzerComponent?: {
    calculateVolume: () => number;
    analyser: AnalyserNode;
    cleanup: () => Promise<void>;
  };
  private captureAudioFrame?: number;

  /**
   * Manually register LiveKit globals for React Native
   * Call this before creating RetellWebClient if you encounter WebRTC issues
   */
  public static async registerGlobals(): Promise<void> {
    try {
      const { registerGlobals } = require("@livekit/react-native");
      await registerGlobals();
      livekitGlobalsRegistered = true;
      console.log("LiveKit globals registered manually");
    } catch (error) {
      throw new Error(
        "Failed to register LiveKit globals. Ensure @livekit/react-native and @livekit/react-native-webrtc are installed. " +
          "Error: " +
          error.message
      );
    }
  }

  constructor() {
    super();
  }

  private async ensureLiveKitGlobals(): Promise<void> {
    try {
      // Try to register globals if not already done
      if (!livekitGlobalsRegistered) {
        const { registerGlobals } = require("@livekit/react-native");
        await registerGlobals();
        livekitGlobalsRegistered = true;
        console.log("LiveKit globals registered successfully");
      }
    } catch (error) {
      console.error("Failed to register LiveKit globals:", error);
      throw new Error(
        "WebRTC isn't detected. Please ensure @livekit/react-native-webrtc is properly installed and linked. " +
          "For React Native 0.60+, run 'cd ios && pod install' for iOS. " +
          "Original error: " +
          error.message
      );
    }
  }

  public async startCall(startCallConfig: StartCallConfig): Promise<void> {
    try {
      // Ensure LiveKit globals are registered before creating Room
      await this.ensureLiveKitGlobals();

      // Room options
      this.room = new Room({
        audioCaptureDefaults: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1, // always mono for input
          deviceId: startCallConfig.captureDeviceId,
          sampleRate: startCallConfig.sampleRate,
        },
        audioOutput: {
          deviceId: startCallConfig.playbackDeviceId,
        },
      });

      // Register handlers
      this.handleRoomEvents();
      this.handleAudioEvents(startCallConfig);
      this.handleDataEvents();

      // Connect to room
      await this.room.connect(hostUrl, startCallConfig.accessToken);
      console.log("connected to room", this.room.name);

      // Turns microphone track on
      this.room.localParticipant.setMicrophoneEnabled(true);
      this.connected = true;
      this.emit("call_started");
    } catch (err) {
      // Provide more specific error information
      let errorMessage = "Error starting call";
      if (err.message && err.message.includes("WebRTC")) {
        errorMessage =
          "WebRTC initialization failed - ensure React Native WebRTC is properly set up";
      } else if (err.message && err.message.includes("registerGlobals")) {
        errorMessage =
          "LiveKit globals registration failed - check React Native setup";
      }

      this.emit("error", errorMessage);
      console.error("Error starting call", err);
      // Cleanup
      this.stopCall();
    }
  }

  // Optional.
  // Some browser does not support audio playback without user interaction
  // Call this function inside a click/tap handler to start audio playback
  public async startAudioPlayback() {
    await this.room.startAudio();
  }

  public stopCall(): void {
    if (!this.connected) return;
    // Cleanup variables and disconnect from room
    this.connected = false;
    this.emit("call_ended");
    this.room?.disconnect();

    this.isAgentTalking = false;
    delete this.room;

    if (this.analyzerComponent) {
      this.analyzerComponent.cleanup();
      delete this.analyzerComponent;
    }

    if (this.captureAudioFrame) {
      cancelAnimationFrame(this.captureAudioFrame);
      delete this.captureAudioFrame;
    }
  }

  public mute(): void {
    if (this.connected) this.room.localParticipant.setMicrophoneEnabled(false);
  }

  public unmute(): void {
    if (this.connected) this.room.localParticipant.setMicrophoneEnabled(true);
  }

  private captureAudioSamples() {
    if (!this.connected || !this.analyzerComponent) return;
    let bufferLength = this.analyzerComponent.analyser.fftSize;
    let dataArray = new Float32Array(bufferLength);
    this.analyzerComponent.analyser.getFloatTimeDomainData(dataArray);
    this.emit("audio", dataArray);
    this.captureAudioFrame = requestAnimationFrame(() =>
      this.captureAudioSamples()
    );
  }

  private handleRoomEvents(): void {
    this.room.on(
      RoomEvent.ParticipantDisconnected,
      (participant: RemoteParticipant) => {
        if (participant?.identity === "server") {
          // Agent hang up, wait 500ms to hangup call to avoid cutoff last bit of audio
          setTimeout(() => {
            this.stopCall();
          }, 500);
        }
      }
    );

    this.room.on(RoomEvent.Disconnected, () => {
      // room disconnected
      this.stopCall();
    });
  }

  private handleAudioEvents(startCallConfig: StartCallConfig): void {
    this.room.on(
      RoomEvent.TrackSubscribed,
      (
        track: RemoteTrack,
        publication: RemoteTrackPublication,
        participant: RemoteParticipant
      ) => {
        if (
          track.kind === Track.Kind.Audio &&
          track instanceof RemoteAudioTrack
        ) {
          if (publication.trackName === "agent_audio") {
            // this is where the agent can start playback
            // can be used to stop loading animation
            this.emit("call_ready");

            if (startCallConfig.emitRawAudioSamples) {
              try {
                this.analyzerComponent = createAudioAnalyser(track);
                this.captureAudioFrame = requestAnimationFrame(() =>
                  this.captureAudioSamples()
                );
              } catch (error) {
                console.warn(
                  "Audio analysis not supported in React Native:",
                  error
                );
              }
            }
          }

          // Start playing audio for subscribed tracks
          track.attach();
        }
      }
    );
  }

  private handleDataEvents(): void {
    this.room.on(
      RoomEvent.DataReceived,
      (
        payload: Uint8Array,
        participant?: RemoteParticipant,
        kind?: DataPacket_Kind,
        topic?: string
      ) => {
        try {
          // parse server data
          if (participant?.identity !== "server") return;

          let decodedData = decoder.decode(payload);
          let event = JSON.parse(decodedData);
          if (event.event_type === "update") {
            this.emit("update", event);
          } else if (event.event_type === "metadata") {
            this.emit("metadata", event);
          } else if (event.event_type === "agent_start_talking") {
            this.isAgentTalking = true;
            this.emit("agent_start_talking");
          } else if (event.event_type === "agent_stop_talking") {
            this.isAgentTalking = false;
            this.emit("agent_stop_talking");
          } else if (event.event_type === "node_transition") {
            this.emit("node_transition", event);
          }
        } catch (err) {
          console.error("Error decoding data received", err);
        }
      }
    );
  }
}

// Export the client for React Native usage
