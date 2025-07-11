# Quick Reference

## ⚡ One-Line Installation

```bash
npm install retell-client-rn-sdk
```

That's it! All dependencies are included automatically.

## 📱 Platform Setup

### iOS

```bash
cd ios && pod install && cd ..
```

Add to `ios/YourApp/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Microphone access for voice calls</string>
```

### Android

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

## 🚀 Basic Usage

```javascript
import { RetellWebClient } from "retell-client-rn-sdk";

const client = new RetellWebClient();

// Start call
await client.startCall({ accessToken: "your-token" });

// Events
client.on("call_started", () => console.log("Call started"));
client.on("agent_start_talking", () => console.log("Agent talking"));

// Controls
client.mute();
client.unmute();
client.stopCall();
```

## 🔧 Common Issues

**Metro errors?** Add to `metro.config.js`:

```javascript
module.exports = {
  resolver: {
    assetExts: ["bin"],
    sourceExts: ["js", "json", "ts", "tsx", "cjs"],
  },
};
```

**Audio not working?** Test on physical device (simulators don't support audio).

## 📚 More Help

- [Complete Guide](./INTEGRATION_GUIDE.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Example App](./example/RetellCallExample.tsx)
