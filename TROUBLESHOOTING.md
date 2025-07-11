# Troubleshooting Guide

## 🚨 MOST COMMON ISSUE: Missing WebRTC Native Modules

### ❌ `WebRTC native module not found` or `Cannot read property 'registerGlobals' of undefined`

**This is the #1 issue!** These errors mean you haven't installed the required native WebRTC modules **in your React Native project**.

#### ✅ SOLUTION: Complete Installation

**IMPORTANT:** Run these commands in your React Native project directory (where your `package.json` is), not in the SDK folder!

```bash
# 1. Navigate to YOUR React Native project
cd /path/to/your/react-native-project

# 2. Install ALL required packages (not just the SDK!)
npm install retell-client-rn-sdk @livekit/react-native @livekit/react-native-webrtc livekit-client

# 3. iOS: Install pods (REQUIRED for iOS)
cd ios && pod install && cd ..

# 4. Clean and rebuild your app
npx react-native clean
npx react-native run-ios  # or run-android
```

#### 🔍 Verify Installation

After installation, verify everything is working:

```bash
# Run this in YOUR React Native project directory
npx retell-diagnose  # Quick diagnosis tool
# or
npx retell-verify    # Detailed verification
```

**The diagnosis tool will tell you exactly what's missing and how to fix it!**

#### 📖 Full Setup Guide

👉 **Follow the complete guide**: [REACT_NATIVE_SETUP.md](./REACT_NATIVE_SETUP.md)

This guide covers:

- ✅ All required packages
- ✅ iOS pod installation
- ✅ Android configuration
- ✅ Permissions setup
- ✅ WebRTC initialization

---

## ⚡ QUICK FIX for Your Specific Errors

If you're seeing these exact errors:

1. **"WebRTC native module not found"**
2. **"Failed to register LiveKit globals. Ensure @livekit/react-native and @livekit/react-native-webrtc are installed"**

### 🚨 Step-by-Step Fix:

```bash
# 1. Go to YOUR React Native project directory (not the SDK folder!)
cd /path/to/your/react-native-app

# 2. Install all required dependencies
npm install @livekit/react-native @livekit/react-native-webrtc livekit-client

# 3. For iOS projects (if you're targeting iOS)
cd ios
pod install
cd ..

# 4. Clear Metro cache and rebuild
npx react-native start --reset-cache

# 5. In a new terminal, run your app
npx react-native run-ios  # or run-android
```

### 🔍 Verify It's Fixed:

After installation, test with this code:

```javascript
import { RetellWebClient } from "retell-client-rn-sdk";

const testSDK = async () => {
  try {
    await RetellWebClient.registerGlobals();
    console.log("✅ WebRTC globals registered successfully!");

    const client = new RetellWebClient();
    console.log("✅ RetellWebClient created successfully!");
  } catch (error) {
    console.error("❌ Still having issues:", error.message);
  }
};

testSDK();
```

---

## Other Issues

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

### ❌ `Property 'TextDecoder' doesn't exist`

**Problem:** React Native doesn't have the web `TextDecoder` API by default.

**Solution:** This is automatically handled by the SDK v2.1.1+. The SDK includes a React Native-compatible text decoder that:

1. Uses native `TextDecoder` if available
2. Falls back to `Buffer` polyfill if available
3. Includes manual UTF-8 decoding as final fallback

**No action needed** - this is resolved automatically in the latest SDK version.

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

#### ❌ `Only a void function can be called with the 'new' keyword`

This TypeScript error occurs when the module resolution can't find the proper type definitions.

**Solution:** Use the require syntax with type casting:

```typescript
// Instead of:
import { RetellWebClient } from "retell-client-rn-sdk";

// Use this pattern:
interface IRetellWebClient {
  on(event: string, callback: (...args: any[]) => void): void;
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

const { RetellWebClient } = require("retell-client-rn-sdk") as {
  RetellWebClient: RetellWebClientConstructor;
};

// Now you can use it properly:
const client = new RetellWebClient();
```

#### General TypeScript Setup

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "moduleResolution": "node"
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
