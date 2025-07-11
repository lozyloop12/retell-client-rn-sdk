/**
 * Comprehensive compatibility test for React Native environments
 */

// Set up mock environment first
require("./mock-rn-env");

console.log("🔍 Testing React Native SDK compatibility...\n");

// Test 1: Basic import
try {
  const { RetellWebClient } = require("../dist/index.js");
  console.log("✅ Basic import successful");

  // Test 2: Instance creation
  const client = new RetellWebClient();
  console.log("✅ RetellWebClient instance created");

  // Test 3: Check if EventEmitter methods are available
  if (typeof client.on === "function" && typeof client.emit === "function") {
    console.log("✅ EventEmitter interface available");
  } else {
    console.log("❌ EventEmitter interface missing");
  }

  // Test 4: Check if main methods are available
  const requiredMethods = ["startCall", "stopCall", "mute", "unmute"];
  const missingMethods = requiredMethods.filter(
    (method) => typeof client[method] !== "function"
  );

  if (missingMethods.length === 0) {
    console.log("✅ All required methods available");
  } else {
    console.log("❌ Missing methods:", missingMethods);
  }

  // Test 5: Check LiveKit dependencies
  try {
    const livekit = require("livekit-client");
    console.log("✅ livekit-client dependency resolved");

    // Check if required LiveKit exports are available
    const requiredExports = ["Room", "RoomEvent", "Track", "RemoteAudioTrack"];
    const missingExports = requiredExports.filter((exp) => !livekit[exp]);

    if (missingExports.length === 0) {
      console.log("✅ All required LiveKit exports available");
    } else {
      console.log("❌ Missing LiveKit exports:", missingExports);
    }
  } catch (error) {
    console.log("❌ livekit-client dependency error:", error.message);
  }

  // Test 6: Check React Native LiveKit dependency
  try {
    const rnLivekit = require("@livekit/react-native");
    console.log("✅ @livekit/react-native dependency resolved");

    if (typeof rnLivekit.registerGlobals === "function") {
      console.log("✅ registerGlobals function available");
    } else {
      console.log("❌ registerGlobals function missing");
    }
  } catch (error) {
    console.log("❌ @livekit/react-native dependency error:", error.message);
  }

  // Test 7: Check WebRTC dependency
  try {
    const webrtc = require("@livekit/react-native-webrtc");
    console.log("✅ @livekit/react-native-webrtc dependency resolved");
  } catch (error) {
    console.log(
      "❌ @livekit/react-native-webrtc dependency error:",
      error.message
    );
  }

  console.log("\n🎉 Compatibility test completed");
} catch (error) {
  console.log("❌ SDK import failed:", error.message);
  console.log("Stack trace:", error.stack);
  process.exit(1);
}
