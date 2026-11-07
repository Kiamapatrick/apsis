const fs = require("fs");
const path = require("path");
const { checkLinks } = require("./helpers/linkcheck.js");

// Test: tools.html hub page
const html = fs.readFileSync("tools.html", "utf8");

// 1. Canonical is the www URL
if (!html.includes('<link rel="canonical" href="https://www.apsis.co.ke/tools.html">')) {
    throw new Error("Canonical URL incorrect");
}
console.log("  Canonical is correct");

// 2. Breadcrumb has Home and Tools (current page)
if (!html.includes('href="index.html"') || !html.includes('aria-current="page"') || !html.includes("Tools")) {
    throw new Error("Breadcrumb incorrect");
}
// Card hrefs are right
if (!html.includes('href="paye-calculator.html"') || !html.includes('href="contact.html"')) {
    throw new Error("Card hrefs incorrect");
}
console.log("  Breadcrumb and card hrefs correct");

// 3. Sitemap contains the URL
const sitemap = fs.readFileSync("sitemap.xml", "utf8");
if (!sitemap.includes("https://www.apsis.co.ke/tools.html")) {
    throw new Error("Sitemap missing tools.html");
}
console.log("  Sitemap contains tools.html");

// 4. Linkcheck on tools.html shows no broken links
const repoRoot = path.resolve(".");
const broken = checkLinks("tools.html", repoRoot);
if (broken.length > 0) {
    console.error("Broken links:", JSON.stringify(broken, null, 2));
    throw new Error(`Found ${broken.length} broken links on tools.html`);
}
console.log("  Linkcheck passes on tools.html");

// 5. h1 text matches
if (!html.includes("<h1>Tax and payroll tools</h1>")) {
    throw new Error("h1 text incorrect");
}
console.log("  h1 text matches");

console.log("Step 11 tools hub test passed.");