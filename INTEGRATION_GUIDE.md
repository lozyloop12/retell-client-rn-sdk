# React Native Integration Guide

## Step-by-Step Setup

### 1. Install Packages

```bash
# Step 1: Install the Retell SDK
npm install retell-client-rn-sdk

# Step 2: Install required peer dependencies
npm install @livekit/react-native @livekit/react-native-webrtc livekit-client

# Step 3: For iOS, install pods
cd ios && pod install && cd ..
```

**Alternative with yarn:**

```bash
yarn add retell-client-rn-sdk @livekit/react-native @livekit/react-native-webrtc livekit-client
cd ios && pod install && cd ..
```

### 2. Configure Permissions

**iOS (ios/YourApp/Info.plist):**

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for voice calls</string>
```

**Android (android/app/src/main/AndroidManifest.xml):**

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

### 3. Metro Configuration

If you encounter Metro bundling issues, add this to your `metro.config.js`:

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

### 4. Basic Implementation

```tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { RetellWebClient } from "retell-client-rn-sdk";

const VoiceCallScreen = () => {
  const [client] = useState(new RetellWebClient());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Request permissions on Android
    if (Platform.OS === "android") {
      requestPermissions();
    }

    // Setup event listeners
    client.on("call_started", () => setIsConnected(true));
    client.on("call_ended", () => setIsConnected(false));
    client.on("error", (error) => Alert.alert("Error", error));

    return () => {
      client.removeAllListeners();
      client.stopCall();
    };
  }, []);

  const requestPermissions = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    } catch (err) {
      console.warn(err);
    }
  };

  const startCall = async () => {
    try {
      await client.startCall({
        accessToken: "your-access-token",
        sampleRate: 48000,
      });
    } catch (error) {
      Alert.alert("Failed to start call", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button
        title={isConnected ? "End Call" : "Start Call"}
        onPress={isConnected ? () => client.stopCall() : startCall}
      />
    </View>
  );
};

export default VoiceCallScreen;
```

### 5. Advanced Usage

```tsx
// Full event handling
client.on("call_ready", () => {
  console.log("Agent is ready");
});

client.on("agent_start_talking", () => {
  console.log("Agent started speaking");
});

client.on("agent_stop_talking", () => {
  console.log("Agent stopped speaking");
});

client.on("update", (data) => {
  console.log("Received update:", data);
});

// Call controls
client.mute();
client.unmute();
client.startAudioPlayback(); // May be needed on some devices

// Audio visualization (limited support in RN)
await client.startCall({
  accessToken: "token",
  emitRawAudioSamples: true,
});

client.on("audio", (audioData) => {
  // Process Float32Array audio data for visualization
});
```

## Troubleshooting

### Common Issues

1. **Build Errors:**

   - Clean and rebuild: `npx react-native clean && npm install`
   - For iOS: `cd ios && pod install`

2. **Permission Denied:**

   - Check platform-specific permission setup
   - Test on physical device (not simulator)

3. **Audio Not Working:**

   - Ensure microphone permissions are granted
   - Call `startAudioPlayback()` after user interaction
   - Test on physical device

4. **Network Issues:**
   - Verify access token validity
   - Check network connectivity
   - Ensure WebRTC ports aren't blocked

### Testing Tips

- Always test on physical devices (audio doesn't work in simulators)
- Test different network conditions (WiFi, cellular, poor connection)
- Test permission flows (grant, deny, request again)
- Test background/foreground transitions

### Performance Tips

- Clean up event listeners properly
- Stop calls when app goes to background
- Handle memory management for long-running calls
- Monitor audio quality and connection status
