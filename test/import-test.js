// Basic test to verify the SDK builds and exports correctly
console.log("Testing SDK build output...");

try {
  const fs = require("fs");
  const path = require("path");

  // Check if dist files exist
  const distPath = path.join(__dirname, "../dist");
  const files = ["index.js", "index.d.ts", "index.m.js"];

  files.forEach((file) => {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      throw new Error(`❌ ${file} is missing`);
    }
  });

  // Check if main export exists
  const indexContent = fs.readFileSync(path.join(distPath, "index.js"), "utf8");
  if (indexContent.includes("RetellWebClient")) {
    console.log("✅ RetellWebClient export found in build");
  } else {
    throw new Error("❌ RetellWebClient export not found");
  }

  console.log("✅ All build verification tests passed");
  console.log(
    "📝 Note: Full functionality testing requires React Native environment"
  );
} catch (error) {
  console.error("❌ Build verification failed:", error.message);
  process.exit(1);
}
