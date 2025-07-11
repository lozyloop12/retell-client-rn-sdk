# Troubleshooting Guide

## Critical WebRTC Error

### ❌ `WebRTC isn't detected, have you called registerGlobals?`

**This is the most common error.** It occurs when LiveKit's WebRTC globals are not properly initialized.

#### ✅ Solution 1: Manual Globals Registration (Recommended)

Add this to your code before creating the RetellWebClient:

```javascript
import { RetellWebClient } from "retell-client-rn-sdk";

// Register globals manually before using the client
try {
  await RetellWebClient.registerGlobals();
  console.log("WebRTC globals registered successfully");
} catch (error) {
  console.error("Failed to register WebRTC globals:", error);
}

const client = new RetellWebClient();
await client.startCall(config);
```

#### ✅ Solution 2: iOS Pod Installation

Make sure you've installed iOS pods:

```bash
cd ios && pod install && cd ..
```

Then rebuild your app:

```bash
npx react-native run-ios
# or
npx react-native run-android
```

#### ✅ Solution 3: Verify Dependencies

Run the verification script:

```bash
npx retell-verify
```

This will check if all required dependencies are properly installed.

## Other Common Issues

### 1. `@livekit/react-native-webrtc could not be found`

**Problem:** This error occurs when the required LiveKit dependencies are not installed in your React Native project.

**Solution:** Install all required peer dependencies:

```bash
# Install the SDK
npm install retell-client-rn-sdk

# Install required peer dependencies
npm install @livekit/react-native @livekit/react-native-webrtc livekit-client

# For iOS, install pods
cd ios && pod install && cd ..
```

**Alternative with yarn:**

```bash
yarn add retell-client-rn-sdk @livekit/react-native @livekit/react-native-webrtc livekit-client
cd ios && pod install && cd ..
```

### 2. Metro Bundling Issues

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

### 3. iOS Build Issues

**Clear and rebuild:**

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native clean
npx react-native run-ios
```

### 4. Android Build Issues

**Clear and rebuild:**

```bash
cd android
./gradlew clean
cd ..
npx react-native clean
npx react-native run-android
```

### 5. Permission Issues

**iOS:** Ensure `Info.plist` contains:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for voice calls</string>
```

**Android:** Ensure `AndroidManifest.xml` contains:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

### 6. Audio Not Working

- **Test on physical device** (audio doesn't work in simulators)
- Ensure permissions are granted
- Call `startAudioPlayback()` after user interaction
- Check if device is muted or volume is down

### 7. Connection Issues

- Verify your access token is valid
- Check network connectivity
- Ensure WebRTC ports aren't blocked by firewall
- Test with different network conditions

### 8. Version Conflicts

If you have version conflicts, try:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 9. TypeScript Errors

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true
  }
}
```

## Getting Help

If you continue to experience issues:

1. Check if you're using the latest version: `npm update retell-client-rn-sdk`
2. Review the [Integration Guide](./INTEGRATION_GUIDE.md)
3. Test the [Example Implementation](./example/RetellCallExample.tsx)
4. Open an issue with:
   - React Native version
   - Platform (iOS/Android)
   - Error messages
   - Steps to reproduce
