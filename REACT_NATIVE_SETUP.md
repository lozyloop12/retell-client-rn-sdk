# React Native WebRTC Setup Guide

## Critical: This guide MUST be followed for React Native projects

The Retell SDK requires native WebRTC modules that need special setup in React Native projects.

## Step 1: Install All Required Packages

```bash
# Install the Retell SDK and ALL required dependencies
npm install retell-client-rn-sdk @livekit/react-native @livekit/react-native-webrtc livekit-client

# OR with yarn
yarn add retell-client-rn-sdk @livekit/react-native @livekit/react-native-webrtc livekit-client
```

## Step 2: iOS Setup (REQUIRED for iOS)

```bash
# Navigate to iOS directory and install pods
cd ios
pod install
cd ..

# If you get pod install errors, try:
cd ios
pod deintegrate
pod clean
pod install
cd ..
```

## Step 3: Android Setup

### Add to `android/app/build.gradle`:

```gradle
dependencies {
    implementation project(':@livekit_react-native-webrtc')
    // ... other dependencies
}
```

### Add to `android/settings.gradle`:

```gradle
include ':@livekit_react-native-webrtc'
project(':@livekit_react-native-webrtc').projectDir = new File(rootProject.projectDir, '../node_modules/@livekit/react-native-webrtc/android')
```

## Step 4: Permissions

### iOS - Add to `Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for voice calls</string>
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for video calls</string>
```

### Android - Add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

## Step 5: Initialize WebRTC (CRITICAL)

### Option A: Automatic Initialization (Recommended)

```javascript
import { RetellWebClient } from "retell-client-rn-sdk";

const client = new RetellWebClient();
// WebRTC globals are automatically registered before startCall()
await client.startCall(config);
```

### Option B: Manual Initialization (For Better Control)

```javascript
import { RetellWebClient } from "retell-client-rn-sdk";

// Register WebRTC globals before creating client
try {
  await RetellWebClient.registerGlobals();
  console.log("WebRTC initialized successfully");
} catch (error) {
  console.error("WebRTC initialization failed:", error);
  // Handle error - maybe show user a message
  return;
}

const client = new RetellWebClient();
await client.startCall(config);
```

## Step 6: Metro Configuration (If Needed)

If you still get module resolution errors, add to `metro.config.js`:

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
    unstable_enablePackageExports: true,
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

## Step 7: Clean and Rebuild

```bash
# Clean everything
npx react-native-clean-project

# Rebuild
npx react-native run-ios
# OR
npx react-native run-android
```

## Verification

Run this to verify your setup:

```bash
npx retell-verify
```

## Common Issues

### "WebRTC native module not found"

- **Solution**: You skipped Step 1 - install ALL required packages
- **Fix**: Run the install command from Step 1

### "Cannot read property 'registerGlobals' of undefined"

- **Solution**: @livekit/react-native is not installed
- **Fix**: `npm install @livekit/react-native`

### iOS Build Errors

- **Solution**: Pods not installed or outdated
- **Fix**: `cd ios && pod install`

### Android Build Errors

- **Solution**: Missing gradle configuration
- **Fix**: Follow Step 3 exactly

## Still Having Issues?

1. Delete `node_modules` and reinstall:

   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clean React Native cache:

   ```bash
   npx react-native start --reset-cache
   ```

3. For iOS, clean Xcode build folder:

   - Open Xcode
   - Product > Clean Build Folder

4. Check our troubleshooting guide: `TROUBLESHOOTING.md`
