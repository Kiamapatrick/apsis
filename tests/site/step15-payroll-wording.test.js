const fs = require("fs");
const path = require("path");
const { checkLinks } = require("./helpers/linkcheck.js");

// Test for COMMIT 1 and COMMIT 2 wording changes
const articlePath = "content/insights/payroll-tax-services-kenya.html";
const chatWidgetPath = "js/chat-widget.js";
const sitemapPath = "sitemap.xml";

const article = fs.readFileSync(articlePath, "utf8");
const chatWidget = fs.readFileSync(chatWidgetPath, "utf8");
const sitemap = fs.readFileSync(sitemapPath, "utf8");

const repoRoot = path.resolve(".");

// COMMIT 1: deductibility, SHIF, NSSF, housing levy
console.log("Testing COMMIT 1 wording changes...");

// Test 1a: article contains each new phrase
const requiredPhrases = [
    "SHIF and the levy have been deductible since 27 December 2024",
    "2.75% of gross salary",
    "KES 300",
    "by the 9th of the following month",
    "KES 6,480",
    "KES 108,000",
    "Affordable Housing Levy",
    "1.5% of the employee's gross monthly salary",
    "9 working days"
];

for (const phrase of requiredPhrases) {
    if (!article.includes(phrase)) {
        throw new Error(`Missing required phrase: "${phrase}"`);
    }
}
console.log("  All required phrases present");

// Test 1b: article no longer contains old phrases
const forbiddenPhrases = [
    "may also qualify as a deductible",
    "Both employer and employee contributions apply",
    "ongoing legal"
];

for (const phrase of forbiddenPhrases) {
    if (article.includes(phrase)) {
        throw new Error(`Forbidden phrase still present: "${phrase}"`);
    }
}
console.log("  Forbidden phrases removed");

// Test 1c: checkLinks reports no broken links for the article
const broken = checkLinks(articlePath, path.resolve("."));
if (broken.length > 0) {
    throw new Error(`Broken links in article: ${JSON.stringify(broken)}`);
}
console.log("  Article linkcheck passes");

// COMMIT 2: late PAYE penalties
console.log("Testing COMMIT 2 wording changes...");

// Test 2a: article no longer contains old penalty phrases
const forbiddenPenaltyPhrases = [
    "compounded monthly",
    "10,000 per month plus",
    "10,000 per return plus"
];

for (const phrase of forbiddenPenaltyPhrases) {
    if (article.includes(phrase)) {
        throw new Error(`Forbidden penalty phrase still present: "${phrase}"`);
    }
}
console.log("  Old penalty phrases removed");

// Test 2b: article contains new penalty phrasing
if (!article.includes("the higher of 25% of the tax due or Ksh 10,000")) {
    throw new Error('Missing new penalty phrase: "the higher of 25% of the tax due or Ksh 10,000"');
}
console.log("  New penalty phrasing present");

// Test 2c: chat-widget.js no longer contains old penalty text
if (chatWidget.includes("Ksh 10,000 plus 25%")) {
    throw new Error("chat-widget.js still contains old penalty text");
}
console.log("  chat-widget.js old penalty text removed");

// Test 2d: chat-widget.js contains new penalty text
if (!chatWidget.includes("the higher of 25% of the tax due")) {
    throw new Error('chat-widget.js missing new penalty text');
}
console.log("  chat-widget.js new penalty text present");

// Test 2e: chat-widget.js passes node --check
const { spawnSync } = require("child_process");
const checkResult = spawnSync("node", ["--check", "js/chat-widget.js"], { cwd: path.resolve(".") });
if (checkResult.status !== 0) {
    throw new Error(`js/chat-widget.js failed node --check: ${checkResult.stderr.toString()}`);
}
console.log("  chat-widget.js passes node --check");

// Test 2f: sitemap entry has lastmod 2026-11-09
if (!sitemap.includes('<loc>https://www.apsis.co.ke/content/insights/payroll-tax-services-kenya.html</loc>')) {
    throw new Error("Sitemap missing payroll article entry");
}
if (!sitemap.includes('<lastmod>2026-11-09</lastmod>')) {
    throw new Error("Sitemap missing lastmod 2026-11-09 for payroll article");
}
console.log("  Sitemap lastmod updated to 2026-11-09");

console.log("All step15 tests passed!");
console.log("Step 15 payroll wording test passed.");