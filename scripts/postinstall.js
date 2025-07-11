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

console.log("📦 Required peer dependencies detected!");
console.log("   Please install the following dependencies:\n");

const requiredDeps = [
  "@livekit/react-native@^2.7.6",
  "@livekit/react-native-webrtc@^125.0.11",
  "livekit-client@^2.9.8",
];

console.log("   npm install " + requiredDeps.join(" "));
console.log("   # or");
console.log("   yarn add " + requiredDeps.join(" "));

console.log("\n📱 Additional setup required:");
console.log("   • iOS: cd ios && pod install");
console.log("   • Add microphone permissions to your platform configs");
console.log("\n📖 For detailed setup instructions, see:");
console.log(
  "   https://github.com/your-repo/retell-client-rn-sdk/blob/main/INTEGRATION_GUIDE.md\n"
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
    console.log("✅ All required dependencies are already installed!\n");
  } else {
    console.log("⚠️  Missing dependencies: " + missingDeps.join(", ") + "\n");
  }
}
