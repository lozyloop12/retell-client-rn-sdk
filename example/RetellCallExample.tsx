import { useEffect, useState } from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Type declarations for the RetellWebClient
interface IRetellWebClient {
  on(event: string, callback: (...args: any[]) => void): void;
  removeAllListeners(): void;
  startCall(config: {
    accessToken: string;
    sampleRate?: number;
    emitRawAudioSamples?: boolean;
  }): Promise<void>;
  stopCall(): void;
  mute(): void;
  unmute(): void;
}

interface RetellWebClientConstructor {
  new (): IRetellWebClient;
  registerGlobals(): Promise<void>;
}

// Import the actual class (using require to avoid TypeScript module resolution issues)
const { RetellWebClient } = require("retell-client-rn-sdk") as {
  RetellWebClient: RetellWebClientConstructor;
};

const RetellCallExample = () => {
  const [client, setClient] = useState<IRetellWebClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentTalking, setIsAgentTalking] = useState(false);
  const [callStatus, setCallStatus] = useState("Initializing...");

  useEffect(() => {
    initializeWebRTC();

    // Request microphone permission on Android
    if (Platform.OS === "android") {
      requestMicrophonePermission();
    }

    return () => {
      // Cleanup
      if (client) {
        client.removeAllListeners();
        if (isConnected) {
          client.stopCall();
        }
      }
    };
  }, [client, isConnected]);

  const initializeWebRTC = async () => {
    try {
      setCallStatus("Initializing WebRTC...");

      // CRITICAL: Register WebRTC globals BEFORE creating the client
      await RetellWebClient.registerGlobals();
      console.log("WebRTC globals registered successfully");

      // Now create the client
      const retellClient = new RetellWebClient();

      // Set up event listeners
      retellClient.on("call_started", () => {
        setIsConnected(true);
        setCallStatus("Connected");
      });

      retellClient.on("call_ended", () => {
        setIsConnected(false);
        setIsMuted(false);
        setIsAgentTalking(false);
        setCallStatus("Disconnected");
      });

      retellClient.on("call_ready", () => {
        setCallStatus("Ready");
      });

      retellClient.on("agent_start_talking", () => {
        setIsAgentTalking(true);
      });

      retellClient.on("agent_stop_talking", () => {
        setIsAgentTalking(false);
      });

      retellClient.on("error", (error: string) => {
        Alert.alert("Call Error", error);
        setCallStatus("Error");
      });

      setClient(retellClient);
      setCallStatus("Ready to call");
    } catch (error: any) {
      console.error("Failed to initialize WebRTC:", error);
      Alert.alert(
        "WebRTC Initialization Failed",
        `Please ensure all required packages are installed:\n\n` +
          `npm install @livekit/react-native @livekit/react-native-webrtc livekit-client\n\n` +
          `For iOS: cd ios && pod install\n\n` +
          `Error: ${error.message}`
      );
      setCallStatus("WebRTC Error");
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message: "This app needs access to your microphone for voice calls.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          "Permission Denied",
          "Microphone permission is required for voice calls."
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const startCall = async () => {
    if (!client) {
      Alert.alert("Error", "WebRTC not initialized. Please restart the app.");
      return;
    }

    try {
      setCallStatus("Connecting...");

      // Replace with your actual access token
      const accessToken = "your-retell-access-token-here";

      await client.startCall({
        accessToken,
        sampleRate: 48000,
        emitRawAudioSamples: false,
      });
    } catch (error: any) {
      Alert.alert("Failed to start call", error.message);
      setCallStatus("Error");
    }
  };

  const endCall = () => {
    if (client) {
      client.stopCall();
    }
  };

  const toggleMute = () => {
    if (!client) return;

    if (isMuted) {
      client.unmute();
      setIsMuted(false);
    } else {
      client.mute();
      setIsMuted(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retell AI Voice Call</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[styles.statusText, getStatusColor(callStatus)]}>
          {callStatus}
        </Text>
      </View>

      {isAgentTalking && (
        <View style={styles.talkingIndicator}>
          <Text style={styles.talkingText}>🤖 Agent is speaking...</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!client ? (
          <View style={styles.initializingContainer}>
            <Text style={styles.initializingText}>
              {callStatus === "WebRTC Error"
                ? "⚠️ Setup Required"
                : "🔄 Initializing..."}
            </Text>
            {callStatus === "WebRTC Error" && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={initializeWebRTC}
              >
                <Text style={styles.buttonText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : !isConnected ? (
          <TouchableOpacity
            style={[
              styles.startButton,
              callStatus === "Initializing WebRTC..." && styles.disabledButton,
            ]}
            onPress={startCall}
            disabled={callStatus === "Initializing WebRTC..."}
          >
            <Text style={styles.buttonText}>Start Call</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.muteButton, isMuted && styles.mutedButton]}
              onPress={toggleMute}
            >
              <Text style={styles.buttonText}>
                {isMuted ? "Unmute" : "Mute"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endButton} onPress={endCall}>
              <Text style={styles.buttonText}>End Call</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Connected":
    case "Ready":
    case "Ready to call":
      return { color: "#4CAF50" };
    case "Connecting...":
    case "Initializing...":
    case "Initializing WebRTC...":
      return { color: "#FF9800" };
    case "Error":
    case "WebRTC Error":
      return { color: "#F44336" };
    default:
      return { color: "#757575" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
    color: "#666",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  talkingIndicator: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  talkingText: {
    fontSize: 16,
    color: "#1976D2",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
  },
  initializingContainer: {
    alignItems: "center",
    padding: 20,
  },
  initializingText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    elevation: 0,
    shadowOpacity: 0,
  },
  muteButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mutedButton: {
    backgroundColor: "#757575",
  },
  endButton: {
    backgroundColor: "#F44336",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RetellCallExample;
