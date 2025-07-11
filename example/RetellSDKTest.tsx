import { useEffect } from "react";
import { Alert } from "react-native";
import { getRetellWebClient } from "./types";

// Simple test component to verify SDK works
export const RetellSDKTest = () => {
  useEffect(() => {
    testSDK();
  }, []);

  const testSDK = async () => {
    try {
      const RetellWebClient = getRetellWebClient();
      
      console.log("🔍 Testing SDK initialization...");
      
      // Test 1: Register globals
      await RetellWebClient.registerGlobals();
      console.log("✅ WebRTC globals registered successfully!");
      
      // Test 2: Create client
      const client = new RetellWebClient();
      console.log("✅ RetellWebClient created successfully!");
      
      // Test 3: Check methods exist
      console.log("✅ Client methods available:", {
        startCall: typeof client.startCall === 'function',
        stopCall: typeof client.stopCall === 'function',
        mute: typeof client.mute === 'function',
        on: typeof client.on === 'function'
      });
      
      Alert.alert("Success! 🎉", "SDK is working properly. Your demo should work!");
      
    } catch (error) {
      console.error("❌ SDK Test Failed:", error);
      Alert.alert(
        "SDK Test Failed", 
        `Error: ${error.message}\n\nCheck console for details.`
      );
    }
  };

  return null;
};

export default RetellSDKTest;
