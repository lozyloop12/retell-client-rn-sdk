# Retell AI React Native SDK - Setup Guide

## Quick Start

1. **Install the package:**

   ```bash
   npm install retell-client-rn-sdk @livekit/react-native
   ```

2. **iOS Setup:**

   - Add microphone permissions to `ios/YourApp/Info.plist`:

   ```xml
   <key>NSMicrophoneUsageDescription</key>
   <string>This app needs access to microphone for voice calls</string>
   ```

3. **Android Setup:**

   - Add permissions to `android/app/src/main/AndroidManifest.xml`:

   ```xml
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
   <uses-permission android:name="android.permission.INTERNET" />
   ```

4. **Install additional dependencies for LiveKit (if needed):**

   ```bash
   # For iOS
   cd ios && pod install

   # For React Native 0.60+, most linking is automatic
   # For older versions, you may need to manually link native dependencies
   ```

## Basic Usage

```javascript
import { RetellWebClient } from "retell-client-rn-sdk";

const client = new RetellWebClient();

// Start a call
const startCall = async () => {
  await client.startCall({
    accessToken: "your-access-token-here",
    sampleRate: 48000,
  });
};

// Listen for events
client.on("call_started", () => console.log("Call started"));
client.on("call_ended", () => console.log("Call ended"));
client.on("agent_start_talking", () => console.log("Agent speaking"));
client.on("agent_stop_talking", () => console.log("Agent stopped"));

// Control the call
client.mute();
client.unmute();
client.stopCall();
```

## Common Issues & Solutions

### 1. Permission Issues

- **Android:** Make sure RECORD_AUDIO permission is granted
- **iOS:** Ensure Info.plist has NSMicrophoneUsageDescription

### 2. Audio Not Working

- Call `client.startAudioPlayback()` after user interaction
- Check device audio settings and permissions

### 3. Connection Issues

- Verify your access token is valid
- Check network connectivity
- Ensure proper SSL/TLS configuration

### 4. Build Issues

- Clean and rebuild your project
- Ensure all native dependencies are properly linked
- For iOS: run `pod install` in the ios directory

## Advanced Configuration

### Custom Audio Settings

```javascript
await client.startCall({
  accessToken: "your-token",
  sampleRate: 48000, // Higher quality audio
  emitRawAudioSamples: true, // For audio visualization
  captureDeviceId: "device-id", // Specific microphone
  playbackDeviceId: "device-id", // Specific speaker
});
```

### Event Handling

```javascript
client.on("update", (data) => {
  // Handle real-time updates
});

client.on("metadata", (data) => {
  // Handle metadata from the AI agent
});

client.on("error", (error) => {
  // Handle errors
});
```

## Testing

1. **Simulator Testing:**

   - Audio features won't work in simulators
   - Use physical devices for testing

2. **Network Testing:**

   - Test on different network conditions
   - Verify WebRTC connectivity

3. **Permission Testing:**
   - Test first-time permission requests
   - Test denied permission scenarios

## Support

For issues and questions:

- Check the [Retell AI Documentation](https://docs.retellai.com/)
- Review the example implementation in the `example/` directory
- File issues on the project repository
