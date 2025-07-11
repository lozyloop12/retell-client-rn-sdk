# Metro Configuration for Retell SDK

If you encounter module resolution issues with Metro bundler in React Native, you can add this configuration to your `metro.config.js`:

```javascript
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    alias: {
      // Ensure LiveKit packages are resolved correctly
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

This configuration helps Metro resolve the LiveKit dependencies correctly.
