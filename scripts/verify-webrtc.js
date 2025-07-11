#!/usr/bin/env node

/**
 * Retell SDK Critical Dependency Checker
 * Specifically checks for WebRTC native module issues
 */

const fs = require("fs");
const path = require("path");

console.log("🚨 Retell SDK - WebRTC Dependency Checker");
console.log("==========================================\n");

function checkPackage(packageName, critical = false) {
  try {
    require.resolve(packageName);
    console.log(`✅ ${packageName} - Found`);
    return true;
  } catch (error) {
    const status = critical ? "🚨 CRITICAL MISSING" : "❌ Missing";
    console.log(`${status} ${packageName}`);
    return false;
  }
}

// Check if we're in a React Native project
const packageJsonPath = path.join(process.cwd(), "package.json");
if (!fs.existsSync(packageJsonPath)) {
  console.log("❌ Run this in your React Native project root directory");
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
console.log(`📦 Project: ${packageJson.name || "Unknown"}\n`);

console.log("🔍 Checking CRITICAL WebRTC dependencies...");
console.log('(These cause "WebRTC native module not found" errors)\n');

// Critical dependencies that MUST be present
const critical = [
  checkPackage("@livekit/react-native", true),
  checkPackage("@livekit/react-native-webrtc", true),
  checkPackage("livekit-client", true),
  checkPackage("retell-client-rn-sdk", true),
];

const allCriticalFound = critical.every((found) => found);

console.log("\n📱 Platform-specific checks...");

// iOS checks
if (fs.existsSync(path.join(process.cwd(), "ios"))) {
  const podfileLock = path.join(process.cwd(), "ios", "Podfile.lock");
  if (fs.existsSync(podfileLock)) {
    console.log("✅ iOS pods installed");
  } else {
    console.log('🚨 iOS pods NOT installed - run "cd ios && pod install"');
  }
} else {
  console.log("ℹ️  No iOS directory found");
}

// Android checks
if (fs.existsSync(path.join(process.cwd(), "android"))) {
  console.log("✅ Android directory found");
} else {
  console.log("ℹ️  No Android directory found");
}

console.log("\n" + "=".repeat(50));

if (allCriticalFound) {
  console.log("🎉 SUCCESS: All critical dependencies found!");
  console.log("\n📖 Next steps:");
  console.log(
    '1. Import: import { RetellWebClient } from "retell-client-rn-sdk"'
  );
  console.log("2. Register: await RetellWebClient.registerGlobals()");
  console.log("3. Create: const client = new RetellWebClient()");
  console.log("4. Use: await client.startCall(config)");
} else {
  console.log("🚨 FAILURE: Missing critical dependencies!");
  console.log('\n💡 To fix "WebRTC native module not found" error:');
  console.log("\n📦 Install missing packages:");
  console.log(
    "npm install @livekit/react-native @livekit/react-native-webrtc livekit-client"
  );
  console.log("\n🔨 Then rebuild:");
  console.log("cd ios && pod install && cd ..");
  console.log("npx react-native run-ios  # or run-android");
  console.log("\n📖 Full guide: REACT_NATIVE_SETUP.md");
}

console.log("\n🆘 Still having issues? Check TROUBLESHOOTING.md");
