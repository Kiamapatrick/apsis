// Test: verify all getElementById IDs in JS exist in HTML
// Run: node --test tests/paye/*.test.js

const fs = require("fs");

const js = fs.readFileSync("js/paye-calculator.js", "utf8");
const html = fs.readFileSync("paye-calculator.html", "utf8");

// Extract all getElementById("id") calls from JS
const getElementByIdRegex = /getElementById\(["']([^"']+)["']\)/g;
const jsIds = new Set();
let match;
while ((match = getElementByIdRegex.exec(js)) !== null) {
  jsIds.add(match[1]);
}

// Extract all id="id" from HTML
const idRegex = /id=["']([^"']+)["']/g;
const htmlIds = new Set();
while ((match = idRegex.exec(html)) !== null) {
  htmlIds.add(match[1]);
}

// Find missing IDs
const missing = [];
for (const id of jsIds) {
  if (!htmlIds.has(id)) {
    missing.push(id);
  }
}

if (missing.length > 0) {
  console.error("Missing IDs in HTML:", missing.join(", "));
  throw new Error("DOM ID mismatch: " + missing.join(", "));
}

console.log("All getElementById IDs found in HTML:", [...jsIds].sort().join(", "));
console.log("Step 8 DOM IDs test passed.");