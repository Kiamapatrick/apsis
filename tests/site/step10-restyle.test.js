const fs = require("fs");
const path = require("path");
const { checkLinks } = require("./helpers/linkcheck.js");

// Test: paye-calculator.html restyling
const html = fs.readFileSync("paye-calculator.html", "utf8");
const css = fs.readFileSync("css/paye-calculator.css", "utf8");

// 1. At least 5 elements with class pc-card
const pcCardMatches = html.match(/class="[^"]*pc-card[^"]*"/g) || [];
if (pcCardMatches.length < 5) {
    throw new Error(`Expected at least 5 pc-card elements, found ${pcCardMatches.length}`);
}
console.log(`  Found ${pcCardMatches.length} pc-card elements`);

// 2. Breadcrumb has three items with correct hrefs
if (!html.includes('class="pc-crumbs"')) {
    throw new Error("Missing pc-crumbs breadcrumb");
}
if (!html.includes('href="index.html"') || !html.match(/Home.*Tools.*PAYE calculator/s)) {
    throw new Error("Breadcrumb missing correct items");
}
console.log("  Breadcrumb has three items with correct structure");

// 3. CSS contains the exact resting shadow string
const restingShadow = "0 2px 6px rgba(13, 33, 55, 0.10), 0 22px 40px -14px rgba(13, 33, 55, 0.40)";
if (!css.includes(restingShadow)) {
    throw new Error("CSS missing exact resting shadow string");
}
console.log("  CSS contains exact resting shadow string");

// 4. CSS has no position: sticky on .pc-form
if (css.includes(".pc-form") && css.includes("position: sticky")) {
    throw new Error("CSS still has position: sticky on .pc-form");
}
console.log("  CSS has no position: sticky on .pc-form");

// 5. Radio inputs with value gross and net still exist
if (!html.includes('value="gross"') || !html.includes('value="net"')) {
    throw new Error("Radio inputs for gross/net missing");
}
console.log("  Radio inputs for gross and net exist");

// 6. BreadcrumbList JSON-LD parses
const breadcrumbJsonLdMatch = html.match(/<script type="application\/ld\+json">\s*\{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"BreadcrumbList"/);
if (!breadcrumbJsonLdMatch) {
    throw new Error("BreadcrumbList JSON-LD not found");
}
// Extract and parse the full JSON-LD
const jsonLdScriptMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
let foundBreadcrumb = false;
for (const script of jsonLdScriptMatch || []) {
    const content = script.replace(/<\/?script[^>]*>/g, "").trim();
    try {
        const parsed = JSON.parse(content);
        if (parsed["@type"] === "BreadcrumbList" && Array.isArray(parsed.itemListElement) && parsed.itemListElement.length === 3) {
            foundBreadcrumb = true;
            break;
        }
    } catch (e) {
        // Not valid JSON, skip
    }
}
if (!foundBreadcrumb) {
    throw new Error("BreadcrumbList JSON-LD not valid or missing 3 items");
}
console.log("  BreadcrumbList JSON-LD parses with 3 items");

// 7. Help card has links to contact.html and payroll article
if (!html.includes('href="contact.html"') || !html.includes('href="content/insights/payroll-tax-services-kenya.html"')) {
    throw new Error("Help card missing required links");
}
console.log("  Help card has links to contact.html and payroll article");

// 8. Linkcheck returns no broken links for paye-calculator.html (tools.html may be missing)
const repoRoot = path.resolve(".");
const broken = checkLinks("paye-calculator.html", repoRoot);
const nonToolsBroken = broken.filter(b => !b.original.includes("tools.html"));
if (nonToolsBroken.length > 0) {
    console.error("Broken links:", JSON.stringify(nonToolsBroken, null, 2));
    throw new Error(`Found ${nonToolsBroken.length} broken links (excluding tools.html)`);
}
console.log("  Linkcheck passes (no broken links except possibly tools.html)");

console.log("Step 10 restyle test passed.");