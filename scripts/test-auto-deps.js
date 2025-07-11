#!/usr/bin/env node

/**
 * Test that SDK auto-installs dependencies correctly
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🧪 Testing automatic dependency installation...\n");

// Create a temporary test directory
const testDir = path.join(__dirname, "..", "test-install");
const testPackageJsonPath = path.join(testDir, "package.json");

try {
  // Clean up any existing test directory
  if (fs.existsSync(testDir)) {
    execSync(`rm -rf "${testDir}"`);
  }

  // Create test React Native project
  fs.mkdirSync(testDir, { recursive: true });

  const testPackageJson = {
    name: "test-rn-app",
    version: "1.0.0",
    dependencies: {
      react: "^18.0.0",
      "react-native": "^0.72.0",
    },
  };

  fs.writeFileSync(
    testPackageJsonPath,
    JSON.stringify(testPackageJson, null, 2)
  );
  console.log("✅ Created test React Native project");

  // Initialize npm in test directory
  execSync("npm init -y", { cwd: testDir, stdio: "ignore" });

  // Pack the current SDK
  console.log("📦 Packing SDK...");
  const packResult = execSync("npm pack", {
    cwd: path.join(__dirname, ".."),
    encoding: "utf8",
  });
  const sdkTarball = packResult.trim().split("\n").pop();

  // Install the packed SDK in test project
  console.log("⬇️  Installing SDK in test project...");
  execSync(`npm install "${path.join(__dirname, "..", sdkTarball)}"`, {
    cwd: testDir,
    stdio: "pipe",
  });

  // Check if all dependencies were installed
  console.log("🔍 Checking installed dependencies...");
  const installedPackageJson = JSON.parse(
    fs.readFileSync(testPackageJsonPath, "utf8")
  );

  const requiredDeps = [
    "@livekit/react-native",
    "@livekit/react-native-webrtc",
    "livekit-client",
    "eventemitter3",
  ];

  const nodeModulesPath = path.join(testDir, "node_modules");
  const missingDeps = [];

  for (const dep of requiredDeps) {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      console.log(`✅ ${dep}: Installed`);
    } else {
      console.log(`❌ ${dep}: Missing`);
      missingDeps.push(dep);
    }
  }

  // Clean up the tarball
  fs.unlinkSync(path.join(__dirname, "..", sdkTarball));

  if (missingDeps.length === 0) {
    console.log("\n🎉 SUCCESS! All dependencies auto-installed correctly!");
  } else {
    console.log(`\n❌ FAILED! Missing dependencies: ${missingDeps.join(", ")}`);
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
} finally {
  // Clean up test directory
  if (fs.existsSync(testDir)) {
    execSync(`rm -rf "${testDir}"`);
  }
}
