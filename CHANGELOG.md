# Changelog

## [2.1.1] - WebRTC Globals Fix

### Fixed

- **WebRTC Registration Issue**: Fixed "WebRTC isn't detected, have you called registerGlobals?" error
- **Improved Error Handling**: Better error messages for WebRTC initialization failures
- **Automatic Globals Registration**: SDK now registers LiveKit globals automatically before starting calls

### Added

- **Manual Globals Registration**: Added `RetellWebClient.registerGlobals()` static method for manual setup
- **Enhanced Documentation**: Added comprehensive WebRTC troubleshooting guide
- **Better Error Messages**: More specific error messages for different failure scenarios
- **Complete Demo Example**: Added RetellCallDemo.tsx showing proper usage with WebRTC setup

### Changed

- **Initialization Strategy**: Changed from module-load-time to call-time globals registration
- **Error Handling**: Improved error handling with specific WebRTC-related error messages

## [2.1.0] - Final React Native Optimization

### Fixed

- **Complete Resolution of Module Errors**: Finally resolved all "Unable to resolve module" errors for LiveKit dependencies
- **Build Process**: Fixed build process to properly include all required dependencies
- **Runtime Resolution**: Ensured all modules are properly resolved at runtime
- **React Native Globals**: Improved LiveKit globals registration with better error handling
- **Module Import Strategy**: Updated to use dynamic imports for better React Native compatibility

### Added

- **Enhanced Package Exports**: Added proper exports field for better module resolution
- **Installation Verification Script**: Added `npx retell-verify` command to verify installation
- **Metro Configuration Guide**: Added METRO_CONFIG.md for bundler configuration help
- **Comprehensive Testing**: Added final verification tests for build integrity

### Changed

- **Simplified Installation**: Now just `npm install retell-client-rn-sdk` - everything works out of the box
- **Dependency Management**: Moved all LiveKit dependencies back to regular dependencies for reliable resolution
- **Build Configuration**: Optimized build process for React Native compatibility

### Removed

- **Complex Setup Scripts**: No longer needed - installation is now straightforward
- **Peer Dependency Confusion**: Simplified to avoid module resolution issues

## [2.0.9] - Complete Dependency Management Solution

### Fixed

- **Resolved WebRTC Dependency Error**: Completely fixed "Unable to resolve module @livekit/react-native-webrtc" by properly managing peer dependencies
- **Clear Installation Process**: Restructured dependencies to use proper peerDependencies configuration
- **Enhanced Error Messages**: Better guidance when dependencies are missing

### Added

- **Automatic Setup Script**: `npx retell-client-rn-sdk setup` - one command installation
- **Setup Verification Tool**: `npx retell-client-rn-sdk verify` - check installation status
- **Interactive Postinstall Guide**: Automatic guidance after installation
- **Comprehensive Documentation**: Updated all guides with clear installation steps

### Changed

- **Dependency Structure**: Moved LiveKit packages to peerDependencies for proper resolution
- **Installation Flow**: Simplified to use automated scripts or clear manual steps
- **Documentation**: Complete rewrite of installation and troubleshooting guides

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
