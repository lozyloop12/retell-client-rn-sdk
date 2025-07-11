# Retell AI React Native SDK

A React Native SDK for integrating Retell AI's voice calling capabilities into your mobile applications.

## Installation

```bash
npm install retell-client-rn-sdk
# or
yarn add retell-client-rn-sdk
```

### Additional Dependencies

This SDK requires LiveKit React Native and client packages as peer dependencies:

```bash
npm install @livekit/react-native @livekit/react-native-webrtc livekit-client
# or
yarn add @livekit/react-native @livekit/react-native-webrtc livekit-client
```

### iOS Setup

For iOS, you need to add microphone permissions to your `ios/YourApp/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone for voice calls</string>
```

### Android Setup

For Android, add microphone permissions to your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

## Usage

```javascript
import { RetellWebClient } from "retell-client-rn-sdk";

const client = new RetellWebClient();

// Start a call
await client.startCall({
  accessToken: "your-access-token",
  sampleRate: 48000,
  emitRawAudioSamples: false,
});

// Listen for events
client.on("call_started", () => {
  console.log("Call started");
});

client.on("call_ended", () => {
  console.log("Call ended");
});

client.on("agent_start_talking", () => {
  console.log("Agent started talking");
});

client.on("agent_stop_talking", () => {
  console.log("Agent stopped talking");
});

// Control the call
client.mute();
client.unmute();
client.stopCall();
```

## API Reference

### RetellWebClient

#### Methods

- `startCall(config: StartCallConfig): Promise<void>` - Start a voice call
- `stopCall(): void` - End the current call
- `mute(): void` - Mute the microphone
- `unmute(): void` - Unmute the microphone
- `startAudioPlayback(): Promise<void>` - Start audio playback (may be required on some platforms)

#### Events

- `call_started` - Fired when the call has started
- `call_ended` - Fired when the call has ended
- `call_ready` - Fired when the agent is ready to receive audio
- `agent_start_talking` - Fired when the agent starts speaking
- `agent_stop_talking` - Fired when the agent stops speaking
- `update` - Fired when receiving updates from the server
- `metadata` - Fired when receiving metadata from the server
- `error` - Fired when an error occurs

#### StartCallConfig

```typescript
interface StartCallConfig {
  accessToken: string; // Required: Your Retell AI access token
  sampleRate?: number; // Optional: Audio sample rate (default: system default)
  captureDeviceId?: string; // Optional: Specific audio input device ID
  playbackDeviceId?: string; // Optional: Specific audio output device ID
  emitRawAudioSamples?: boolean; // Optional: Emit raw audio data for visualization
}
```

## React Native Considerations

This SDK is specifically adapted for React Native environments:

- Uses React Native compatible timer functions as fallbacks
- Handles platform-specific audio APIs
- Manages React Native lifecycle considerations
- Audio visualization features are limited compared to web browsers

For more information about Retell AI, visit [Retell AI Documentation](https://docs.retellai.com/).
