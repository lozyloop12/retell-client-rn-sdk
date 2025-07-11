#!/usr/bin/env node

/**
 * Quick Diagnosis Script for Retell SDK Issues
 * Run this in your React Native project directory
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Retell SDK Quick Diagnosis\n");

// Check if this is a React Native project
const packageJsonPath = path.join(process.cwd(), "package.json");
if (!fs.existsSync(packageJsonPath)) {
  console.log(
    "❌ No package.json found. Are you in your React Native project directory?"
  );
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

console.log(`📦 Project: ${packageJson.name || "Unknown"}`);

// Check if it's a React Native project
if (!dependencies["react-native"]) {
  console.log(
    "❌ This doesn't appear to be a React Native project (no react-native dependency)"
  );
  console.log(
    "   Make sure you're running this in your React Native app directory."
  );
  process.exit(1);
}

console.log("✅ React Native project detected\n");

// Check required dependencies
const requiredDeps = {
  "retell-client-rn-sdk": "Retell SDK",
  "@livekit/react-native": "LiveKit React Native",
  "@livekit/react-native-webrtc": "LiveKit WebRTC",
  "livekit-client": "LiveKit Client",
};

console.log("📋 Checking required dependencies...");
let missingDeps = [];

for (const [dep, name] of Object.entries(requiredDeps)) {
  if (dependencies[dep]) {
    console.log(`✅ ${name}: ${dependencies[dep]}`);
  } else {
    console.log(`❌ ${name}: NOT INSTALLED`);
    missingDeps.push(dep);
  }
}

// Check platform-specific files
console.log("\n📱 Checking platform setup...");

const iosDir = path.join(process.cwd(), "ios");
const androidDir = path.join(process.cwd(), "android");

if (fs.existsSync(iosDir)) {
  console.log("✅ iOS project directory found");

  const podfileLock = path.join(iosDir, "Podfile.lock");
  if (fs.existsSync(podfileLock)) {
    console.log("✅ Podfile.lock exists (pods have been installed)");
  } else {
    console.log(
      '❌ Podfile.lock missing - you need to run "cd ios && pod install"'
    );
  }
} else {
  console.log("ℹ️  No iOS directory found");
}

if (fs.existsSync(androidDir)) {
  console.log("✅ Android project directory found");
} else {
  console.log("ℹ️  No Android directory found");
}

// Provide specific fix instructions
console.log("\n🔧 DIAGNOSIS RESULTS:\n");

if (missingDeps.length > 0) {
  console.log("❌ MISSING DEPENDENCIES - This is likely your issue!");
  console.log("\n💡 FIX: Run this command in your project directory:");
  console.log(`npm install ${missingDeps.join(" ")}`);

  if (fs.existsSync(iosDir)) {
    console.log("\nThen for iOS:");
    console.log("cd ios && pod install && cd ..");
  }

  console.log("\nThen rebuild your app:");
  console.log("npx react-native run-ios  # or run-android");
} else {
  console.log("✅ All dependencies are installed!");

  if (
    fs.existsSync(iosDir) &&
    !fs.existsSync(path.join(iosDir, "Podfile.lock"))
  ) {
    console.log("\n⚠️  iOS pods need to be installed:");
    console.log("cd ios && pod install && cd ..");
  }

  console.log("\n📖 If you're still having issues:");
  console.log("1. Try: npx react-native clean");
  console.log("2. Restart Metro: npx react-native start --reset-cache");
  console.log("3. Check TROUBLESHOOTING.md for more solutions");
}

console.log(
  "\n📖 For more help, see: https://github.com/your-repo/TROUBLESHOOTING.md"
);
