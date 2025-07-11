// Test import of RetellWebClient
const { RetellWebClient } = require("./dist/index.js");

console.log("RetellWebClient type:", typeof RetellWebClient);
console.log("Is constructor?:", typeof RetellWebClient === "function");

try {
  const client = new RetellWebClient();
  console.log("Constructor works!", typeof client);
  console.log(
    "Has registerGlobals?:",
    typeof RetellWebClient.registerGlobals === "function"
  );
} catch (error) {
  console.error("Constructor error:", error.message);
}
