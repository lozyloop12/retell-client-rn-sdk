#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🎤 Retell AI React Native SDK - Complete Setup");
console.log("===============================================\n");

function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: "inherit", cwd: process.cwd() });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function detectPackageManager() {
  if (fs.existsSync("yarn.lock")) {
    return "yarn";
  } else if (fs.existsSync("package-lock.json")) {
    return "npm";
  } else {
    return "npm"; // default
  }
}

async function main() {
  // Check if we're in a React Native project
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.log(
      "❌ No package.json found. Please run this from your React Native project root."
    );
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  if (!packageJson.dependencies?.["react-native"]) {
    console.log("⚠️  This doesn't appear to be a React Native project.");
    console.log("   Continuing anyway...\n");
  }

  const packageManager = detectPackageManager();
  console.log(`📋 Using package manager: ${packageManager}\n`);

  // Install dependencies
  const deps = [
    "retell-client-rn-sdk",
    "@livekit/react-native",
    "@livekit/react-native-webrtc",
    "livekit-client",
  ];

  let installCommand;
  if (packageManager === "yarn") {
    installCommand = `yarn add ${deps.join(" ")}`;
  } else {
    installCommand = `npm install ${deps.join(" ")}`;
  }

  const installSuccess = runCommand(
    installCommand,
    "Installing Retell SDK and dependencies"
  );

  if (!installSuccess) {
    console.log(
      "❌ Installation failed. Please check the error messages above."
    );
    process.exit(1);
  }

  // iOS pod install
  if (fs.existsSync("ios") && fs.existsSync("ios/Podfile")) {
    console.log("📱 iOS project detected");
    const podInstallSuccess = runCommand(
      "cd ios && pod install && cd ..",
      "Installing iOS pods"
    );

    if (!podInstallSuccess) {
      console.log("⚠️  Pod install failed. You may need to run it manually:");
      console.log("   cd ios && pod install\n");
    }
  }

  console.log("🎉 Installation completed!\n");

  console.log("📋 Next steps:");
  console.log("   1. Add platform permissions (see INTEGRATION_GUIDE.md)");
  console.log(
    '   2. Import the SDK: import { RetellWebClient } from "retell-client-rn-sdk"'
  );
  console.log("   3. Create and use the client in your app");

  console.log("\n🔍 To verify your setup, run:");
  console.log("   npx retell-client-rn-sdk verify-setup");

  console.log("\n📖 Documentation:");
  console.log(
    "   - Integration Guide: ./node_modules/retell-client-rn-sdk/INTEGRATION_GUIDE.md"
  );
  console.log(
    "   - Troubleshooting: ./node_modules/retell-client-rn-sdk/TROUBLESHOOTING.md"
  );
  console.log(
    "   - Example: ./node_modules/retell-client-rn-sdk/example/RetellCallExample.tsx\n"
  );
}

main().catch(console.error);
