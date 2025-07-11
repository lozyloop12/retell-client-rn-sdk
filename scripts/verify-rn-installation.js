#!/usr/bin/env node

/**
 * Retell SDK Installation Verification Script
 * Run this in your React Native project after installing retell-client-rn-sdk
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Verifying Retell SDK installation...\n");

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description} - File not found: ${filePath}`);
    return false;
  }
}

function checkPackage(packageName) {
  try {
    const packagePath = require.resolve(packageName);
    console.log(`✅ ${packageName} resolved at ${packagePath}`);
    return true;
  } catch (error) {
    console.log(`❌ ${packageName} not found: ${error.message}`);
    return false;
  }
}

// Check if we're in a React Native project
const packageJsonPath = path.join(process.cwd(), "package.json");
if (!fs.existsSync(packageJsonPath)) {
  console.log(
    "❌ No package.json found. Please run this script in your React Native project root."
  );
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
console.log(`📦 Project: ${packageJson.name || "Unknown"}`);

// Check if React Native is installed
const hasReactNative =
  packageJson.dependencies?.["react-native"] ||
  packageJson.devDependencies?.["react-native"];
if (!hasReactNative) {
  console.log("⚠️  This doesn't appear to be a React Native project.");
}

console.log("\n📋 Checking dependencies...");

// Check main dependencies
const checks = [
  () => checkPackage("retell-client-rn-sdk"),
  () => checkPackage("@livekit/react-native"),
  () => checkPackage("@livekit/react-native-webrtc"),
  () => checkPackage("livekit-client"),
  () => checkPackage("eventemitter3"),
];

const results = checks.map((check) => check());
const allPassed = results.every((result) => result === true);

console.log("\n📱 React Native specific checks...");

// Check for common React Native files
checkFile(path.join(process.cwd(), "android"), "Android project directory");
checkFile(path.join(process.cwd(), "ios"), "iOS project directory");

// Check Metro config
const metroConfigExists = fs.existsSync(
  path.join(process.cwd(), "metro.config.js")
);
if (metroConfigExists) {
  console.log("✅ Metro config found");
} else {
  console.log(
    "ℹ️  No metro.config.js found - this might be needed for module resolution"
  );
}

console.log("\n🎉 Installation verification complete!");

if (allPassed) {
  console.log("✅ All dependencies are properly installed.");
  console.log("\n📖 Next steps:");
  console.log(
    '1. Import the SDK: import { RetellWebClient } from "retell-client-rn-sdk";'
  );
  console.log("2. Create a client: const client = new RetellWebClient();");
  console.log(
    '3. Start a call: await client.startCall({ accessToken: "your-token" });'
  );
} else {
  console.log("❌ Some dependencies are missing. Please run:");
  console.log("npm install retell-client-rn-sdk");
  console.log("# or");
  console.log("yarn add retell-client-rn-sdk");
}

console.log(
  "\n🆘 If you encounter issues, check TROUBLESHOOTING.md for common solutions."
);
