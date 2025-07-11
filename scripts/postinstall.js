#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("\n🎤 Retell AI React Native SDK Installation");
console.log("==========================================\n");

// Check if we're in a React Native project
const isReactNativeProject =
  fs.existsSync(path.join(process.cwd(), "react-native.config.js")) ||
  fs.existsSync(path.join(process.cwd(), "metro.config.js")) ||
  (fs.existsSync(path.join(process.cwd(), "package.json")) &&
    JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
    ).dependencies?.["react-native"]);

if (!isReactNativeProject) {
  console.log("ℹ️  This SDK is designed for React Native projects.");
  console.log(
    "   If you're using this in a React Native project, you can ignore this message.\n"
  );
  return;
}

console.log("� CRITICAL: React Native requires additional setup!");
console.log("   The SDK won't work without these required packages:\n");

const requiredDeps = [
  "@livekit/react-native@^2.7.6",
  "@livekit/react-native-webrtc@^125.0.11",
  "livekit-client@^2.9.8",
];

console.log("   npm install " + requiredDeps.join(" "));
console.log("   # or");
console.log("   yarn add " + requiredDeps.join(" "));

console.log("\n📱 Additional setup required:");
console.log("   • iOS: cd ios && pod install (REQUIRED!)");
console.log("   • Add microphone permissions to your platform configs");
console.log("\n📖 COMPLETE SETUP GUIDE:");
console.log("   👉 See REACT_NATIVE_SETUP.md in the package folder");
console.log("   👉 Or troubleshooting: TROUBLESHOOTING.md\n");

console.log("🚨 COMMON ERROR: 'WebRTC native module not found'");
console.log(
  "   This means you haven't installed the required packages above!\n"
);

// Check if dependencies are already installed
const packageJsonPath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const missingDeps = requiredDeps.filter((dep) => {
    const depName =
      dep.split("@")[0] + (dep.split("@")[1] ? "@" + dep.split("@")[1] : "");
    const packageName = depName.split("@")[0];
    return !allDeps[packageName];
  });

  if (missingDeps.length === 0) {
    console.log("✅ All required dependencies are installed!");
    console.log("   Don't forget: cd ios && pod install\n");
  } else {
    console.log("❌ MISSING DEPENDENCIES: " + missingDeps.join(", "));
    console.log("   Install them now or the SDK won't work!\n");
  }
}
