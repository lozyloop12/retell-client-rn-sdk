/**
 * Final SDK verification test
 * Tests the built SDK without importing React Native dependencies
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Final SDK Verification\n");

// Test 1: Check build files exist
const buildFiles = ["dist/index.js", "dist/index.d.ts", "dist/index.m.js"];

console.log("📁 Build files:");
buildFiles.forEach((file) => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? "✅" : "❌"} ${file}`);
});

// Test 2: Check exports in built file
console.log("\n📦 Exports verification:");
try {
  const builtCode = fs.readFileSync("dist/index.js", "utf8");

  // Check if RetellWebClient is exported
  if (builtCode.includes("RetellWebClient")) {
    console.log("✅ RetellWebClient export found");
  } else {
    console.log("❌ RetellWebClient export missing");
  }

  // Check if dependencies are properly bundled
  const dependencies = [
    "eventemitter3",
    "livekit-client",
    "@livekit/react-native",
  ];
  dependencies.forEach((dep) => {
    if (
      builtCode.includes(dep) ||
      builtCode.includes('require("' + dep + '")')
    ) {
      console.log(`✅ ${dep} dependency found`);
    } else {
      console.log(`⚠️  ${dep} dependency not found in bundle`);
    }
  });
} catch (error) {
  console.log("❌ Error reading built file:", error.message);
}

// Test 3: Check TypeScript definitions
console.log("\n🔤 TypeScript definitions:");
try {
  const dtsContent = fs.readFileSync("dist/index.d.ts", "utf8");

  if (dtsContent.includes("RetellWebClient")) {
    console.log("✅ RetellWebClient interface defined");
  }

  if (dtsContent.includes("StartCallConfig")) {
    console.log("✅ StartCallConfig interface defined");
  }
} catch (error) {
  console.log("❌ Error reading TypeScript definitions:", error.message);
}

// Test 4: Package.json verification
console.log("\n📋 Package configuration:");
try {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

  const checks = [
    ["main", pkg.main === "dist/index.js"],
    ["types", pkg.types === "dist/index.d.ts"],
    ["react-native", pkg["react-native"] === "dist/index.js"],
    ["exports defined", !!pkg.exports],
    ["dependencies", Object.keys(pkg.dependencies || {}).length > 0],
  ];

  checks.forEach(([name, condition]) => {
    console.log(`${condition ? "✅" : "❌"} ${name}`);
  });
} catch (error) {
  console.log("❌ Error reading package.json:", error.message);
}

console.log("\n🎉 SDK verification complete!");
console.log("\n📖 Usage in React Native:");
console.log('import { RetellWebClient } from "retell-client-rn-sdk";');
console.log("const client = new RetellWebClient();");
