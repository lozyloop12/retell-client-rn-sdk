#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔍 Retell SDK Installation Verification");
console.log("======================================\n");

function checkDependency(packageName, packageJson) {
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  };

  if (allDeps[packageName]) {
    console.log(`✅ ${packageName}: ${allDeps[packageName]}`);
    return true;
  } else {
    console.log(`❌ ${packageName}: Missing`);
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description}: Not found`);
    return false;
  }
}

// Check if we're in a React Native project
const packageJsonPath = path.join(process.cwd(), "package.json");

if (!fs.existsSync(packageJsonPath)) {
  console.log(
    "❌ No package.json found. Please run this from your React Native project root."
  );
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

console.log("📦 Checking Dependencies:");
console.log("-------------------------");

const requiredDeps = [
  "retell-client-rn-sdk",
  "@livekit/react-native",
  "@livekit/react-native-webrtc",
  "livekit-client",
  "react-native",
];

let allDepsInstalled = true;
requiredDeps.forEach((dep) => {
  if (!checkDependency(dep, packageJson)) {
    allDepsInstalled = false;
  }
});

console.log("\n🏗️  Checking Project Structure:");
console.log("-------------------------------");

const isAndroid = checkFile("android", "Android project folder");
const isIos = checkFile("ios", "iOS project folder");

if (isIos) {
  checkFile("ios/Podfile", "iOS Podfile");
  checkFile("ios/Pods", "iOS Pods installed");
}

if (isAndroid) {
  checkFile("android/app/src/main/AndroidManifest.xml", "Android Manifest");
}

console.log("\n🎯 Checking Permissions:");
console.log("------------------------");

if (isIos) {
  const infoPlistPath = fs
    .readdirSync("ios")
    .find((file) => file.endsWith(".xcodeproj"));
  if (infoPlistPath) {
    const projectName = infoPlistPath.replace(".xcodeproj", "");
    const plistPath = path.join("ios", projectName, "Info.plist");
    if (fs.existsSync(plistPath)) {
      const plistContent = fs.readFileSync(plistPath, "utf8");
      if (plistContent.includes("NSMicrophoneUsageDescription")) {
        console.log("✅ iOS microphone permission configured");
      } else {
        console.log("⚠️  iOS microphone permission not found in Info.plist");
      }
    }
  }
}

if (isAndroid) {
  const manifestPath = "android/app/src/main/AndroidManifest.xml";
  if (fs.existsSync(manifestPath)) {
    const manifestContent = fs.readFileSync(manifestPath, "utf8");
    if (manifestContent.includes("android.permission.RECORD_AUDIO")) {
      console.log("✅ Android RECORD_AUDIO permission configured");
    } else {
      console.log("⚠️  Android RECORD_AUDIO permission not found");
    }
  }
}

console.log("\n📋 Summary:");
console.log("-----------");

if (allDepsInstalled) {
  console.log("✅ All required dependencies are installed");
} else {
  console.log("❌ Some dependencies are missing. Install them with:");
  console.log(
    "   npm install @livekit/react-native @livekit/react-native-webrtc livekit-client"
  );
}

if (isIos && !fs.existsSync("ios/Pods")) {
  console.log("⚠️  iOS pods not installed. Run: cd ios && pod install");
}

console.log("\n🚀 Next steps:");
console.log(
  '   1. Import: import { RetellWebClient } from "retell-client-rn-sdk"'
);
console.log("   2. Create client: const client = new RetellWebClient()");
console.log('   3. Start call: await client.startCall({ accessToken: "..." })');
console.log(
  "\n📖 For detailed examples, see: ./node_modules/retell-client-rn-sdk/INTEGRATION_GUIDE.md"
);
