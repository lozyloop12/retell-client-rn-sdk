# Changelog

## [2.0.8] - Dependency Fix

### Fixed

- **Missing WebRTC Dependency**: Fixed "Unable to resolve module @livekit/react-native-webrtc" error by including `@livekit/react-native-webrtc` as a direct dependency
- **Simplified Installation**: Users now only need to run `npm install retell-client-rn-sdk` - all dependencies are included automatically
- **Updated Documentation**: Simplified installation instructions and added comprehensive troubleshooting guide

### Added

- **Troubleshooting Guide**: Added detailed troubleshooting documentation for common issues
- **Build Verification Test**: Added test script to verify SDK builds correctly
- **Enhanced Error Handling**: Better error messages for dependency-related issues

## [2.0.7] - React Native Support

### Added

- **React Native Compatibility**: Full React Native support with platform-specific adaptations
- **Cross-platform Timer Functions**: Compatible timer functions that work in both React Native and web environments
- **React Native Example**: Complete example implementation showing integration patterns
- **Enhanced Documentation**: Comprehensive setup guide and API documentation
- **Type Definitions**: Complete TypeScript type definitions for better development experience

### Changed

- **Package Dependencies**: Updated to use `livekit-react-native` instead of `livekit-client`
- **Audio Analysis**: Adapted audio analysis features for React Native limitations
- **Build Configuration**: Updated build process for React Native compatibility
- **Event Handling**: Improved event system compatibility across platforms

### Fixed

- **Timer Compatibility**: Fixed `requestAnimationFrame` and `cancelAnimationFrame` usage for React Native
- **Module Resolution**: Improved module resolution for React Native environments
- **Error Handling**: Enhanced error handling for mobile-specific scenarios

### Technical Changes

- Replaced web-specific `window` object usage with platform-aware alternatives
- Updated LiveKit dependency to React Native specific package
- Added proper peer dependencies for React and React Native
- Enhanced TypeScript configuration for better mobile development

### Migration from Web SDK

If migrating from the web version:

1. Update import statements to use `retell-client-rn-sdk`
2. Install `livekit-react-native` as a peer dependency
3. Add platform-specific permissions (microphone for iOS/Android)
4. Test audio functionality on physical devices (simulators have limitations)

### Known Limitations

- Audio visualization features are limited compared to web browsers
- Requires physical device testing (audio doesn't work in simulators)
- Platform-specific permission handling required

### Next Steps

- Audio visualization improvements for React Native
- Enhanced error reporting and diagnostics
- Performance optimizations for mobile environments
