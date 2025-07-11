#!/usr/bin/env node

/**
 * Test script to verify auto-installation works
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🧪 Testing auto-installation...\n");

// Create a test React Native project structure
const testDir = path.join(__dirname, "test-rn-project");

try {
  // Clean up any existing test directory
  if (fs.existsSync(testDir)) {
    execSync(`rm -rf ${testDir}`);
  }

  // Create test project
  fs.mkdirSync(testDir);

  // Create a minimal package.json for React Native project
  const packageJson = {
    name: "test-rn-app",
    version: "1.0.0",
    dependencies: {
      "react-native": "^0.72.0",
    },
  };

  fs.writeFileSync(
    path.join(testDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  console.log("✅ Created test React Native project");

  // Test the postinstall script
  console.log("🔧 Testing postinstall script...");

  // Copy and run the postinstall script
  const postinstallPath = path.join(__dirname, "postinstall.js");

  execSync(`cd ${testDir} && node ${postinstallPath}`, {
    stdio: "inherit",
  });

  console.log("✅ Postinstall script completed successfully!");
} catch (error) {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
} finally {
  // Clean up
  if (fs.existsSync(testDir)) {
    execSync(`rm -rf ${testDir}`);
  }
}

console.log("\n🎉 Auto-installation test passed!");
