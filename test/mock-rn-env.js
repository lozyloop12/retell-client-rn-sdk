/**
 * Mock React Native environment for testing
 */

// Mock React Native modules to avoid import errors during testing
const mockReactNative = {
  Platform: {
    OS: "ios",
    Version: "14.0",
  },
  NativeModules: {},
  NativeEventEmitter: class MockNativeEventEmitter {},
  DeviceEventEmitter: {
    addListener: () => {},
    removeListener: () => {},
  },
};

const mockWebRTC = {
  RTCPeerConnection: class MockRTCPeerConnection {},
  RTCSessionDescription: class MockRTCSessionDescription {},
  RTCIceCandidate: class MockRTCIceCandidate {},
  MediaStream: class MockMediaStream {},
  MediaStreamTrack: class MockMediaStreamTrack {},
};

const mockLiveKitRN = {
  registerGlobals: () => {
    console.log("Mock: registerGlobals called");
  },
};

// Set up mocks before any imports
const Module = require("module");
const originalRequire = Module.prototype.require;

Module.prototype.require = function (...args) {
  const moduleName = args[0];

  if (moduleName === "react-native") {
    return mockReactNative;
  }

  if (moduleName === "@livekit/react-native-webrtc") {
    return mockWebRTC;
  }

  if (moduleName === "@livekit/react-native") {
    return mockLiveKitRN;
  }

  return originalRequire.apply(this, args);
};

module.exports = {
  mockReactNative,
  mockWebRTC,
  mockLiveKitRN,
};
