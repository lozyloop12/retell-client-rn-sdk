# Retell AI React Native SDK

A React Native SDK for integrating Retell AI's voice calling capabilities into your mobile applications.

⚠️ **IMPORTANT**: For React Native projects, additional setup is required. See [React Native Setup Guide](./REACT_NATIVE_SETUP.md) for complete instructions.

## Quick Installation

### For React Native Projects (Automatic Setup)

```bash
# Install the SDK - all dependencies auto-install!
npm install retell-client-rn-sdk

# iOS: Install pods (still required)
cd ios && pod install && cd ..
```

✅ **That's it!** All required LiveKit dependencies (`@livekit/react-native`, `@livekit/react-native-webrtc`, `livekit-client`) are automatically installed.

### Manual Installation (if needed)

If you prefer to install manually or encounter issues:

```bash
# Install ALL required packages
npm install retell-client-rn-sdk @livekit/react-native @livekit/react-native-webrtc livekit-client

# iOS: Install pods
cd ios && pod install && cd ..
```

📖 **Complete Setup Guide**: [REACT_NATIVE_SETUP.md](./REACT_NATIVE_SETUP.md)

### For Testing/Web Projects Only

```bash
npm install retell-client-rn-sdk
```

### Verify Installation

After installation, you can verify everything is set up correctly:

```bash
npx retell-client-rn-sdk verify-rn
```

This will check that all dependencies are properly installed and accessible.

### iOS Setup (iOS only)

```bash
cd ios && pod install && cd ..
```

### Permissions

#### iOS Permissions

Add microphone permission to your `ios/YourApp/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone for voice calls</string>
```

#### Android Permissions

Add permissions to your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

## Quick Start

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
});

client.on("agent_stop_talking", () => {
  console.log("Agent stopped talking");
});

// Control the call
client.mute();
client.unmute();
client.stopCall();
```

## Troubleshooting

### "WebRTC isn't detected" Error

If you encounter the error "WebRTC isn't detected, have you called registerGlobals?", try these solutions:

#### Option 1: Manual Globals Registration (Recommended)

```javascript
import { RetellWebClient } from "retell-client-rn-sdk";

// Register globals manually before creating client
await RetellWebClient.registerGlobals();

const client = new RetellWebClient();
await client.startCall(config);
```

#### Option 2: Ensure Proper iOS Setup

Make sure you've run pod install:

```bash
cd ios && pod install && cd ..
```

#### Option 3: Check Dependencies

Verify all dependencies are installed:

```bash
npx retell-verify
```

#### Option 4: Metro Configuration

If you still have issues, add to your `metro.config.js`:

```javascript
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    alias: {
      "livekit-client": require.resolve("livekit-client"),
      "@livekit/react-native": require.resolve("@livekit/react-native"),
      "@livekit/react-native-webrtc": require.resolve(
        "@livekit/react-native-webrtc"
      ),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
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

## Troubleshooting

### Metro Bundler Issues

If you encounter Metro bundling errors, add this to your `metro.config.js`:

```javascript
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    resolver: {
      assetExts: [...assetExts, "bin"],
      sourceExts: [...sourceExts, "cjs"],
    },
  };
})();
```

### Common Issues

- **Audio not working**: Test on physical device (audio doesn't work in simulators)
- **Permission denied**: Ensure microphone permissions are properly configured
- **Build errors**: Clean and rebuild your project

## Documentation

- [Integration Guide](./INTEGRATION_GUIDE.md) - Step-by-step setup instructions
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
- [Example Implementation](./example/RetellCallExample.tsx) - Complete React Native component

For more information about Retell AI, visit [Retell AI Documentation](https://docs.retellai.com/).
