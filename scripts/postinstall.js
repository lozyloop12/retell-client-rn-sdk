#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("\n🎤 Retell AI React Native SDK Installation");
console.log("==========================================\n");

// Check if we're in a React Native project by looking for React Native in parent directories
let projectRoot = process.cwd();
let isReactNativeProject = false;
let packageJson = {};

// Look up the directory tree to find the user's React Native project
for (let i = 0; i < 5; i++) {
  const packageJsonPath = path.join(projectRoot, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

      if (
        packageJson.dependencies?.["react-native"] ||
        packageJson.devDependencies?.["react-native"]
      ) {
        isReactNativeProject = true;
        break;
      }
    } catch (error) {
      // Continue searching
    }
  }

  const parentDir = path.dirname(projectRoot);
  if (parentDir === projectRoot) break; // Reached filesystem root
  projectRoot = parentDir;
}

if (!isReactNativeProject) {
  console.log("ℹ️  This SDK is designed for React Native projects.");
  console.log(
    "   If you're using this in a React Native project, you can ignore this message.\n"
  );
  return;
}

console.log("✅ React Native project detected!");
console.log(
  "✅ All required dependencies have been automatically installed!\n"
);

// Check if iOS directory exists
const iosDir = path.join(projectRoot, "ios");
if (fs.existsSync(iosDir)) {
  console.log("📱 iOS Setup Required:");
  console.log("   cd ios && pod install && cd ..");
  console.log("   This is REQUIRED for iOS to work!\n");
}

// Check if Android directory exists
const androidDir = path.join(projectRoot, "android");
if (fs.existsSync(androidDir)) {
  console.log("🤖 Android Setup:");
  console.log("   No additional setup needed for Android\n");
}

console.log("🔐 Permissions Required:");
console.log("   • iOS: Add NSMicrophoneUsageDescription to Info.plist");
console.log(
  "   • Android: Add RECORD_AUDIO permission to AndroidManifest.xml\n"
);

console.log("🚀 Quick Start:");
console.log("   import { RetellWebClient } from 'retell-client-rn-sdk';");
console.log("   await RetellWebClient.registerGlobals();");
console.log("   const client = new RetellWebClient();\n");

console.log("📖 Documentation:");
console.log("   • Complete Setup: REACT_NATIVE_SETUP.md");
console.log("   • Troubleshooting: TROUBLESHOOTING.md");
console.log("   • Examples: example/ folder\n");

console.log("🔍 Verify Installation:");
console.log("   npx retell-diagnose\n");

console.log("🎉 Installation complete! Happy coding! 🚀");
