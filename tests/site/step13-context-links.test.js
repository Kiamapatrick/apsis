const fs = require("fs");
const path = require("path");
const { checkLinks } = require("./helpers/linkcheck.js");

// Test (a): in index.html the first element with class belt-card--deadline contains an anchor with href paye-calculator.html
const indexHtml = fs.readFileSync("index.html", "utf8");
const firstDeadlineCardMatch = indexHtml.match(/<article class="belt-card belt-card--deadline">[\s\S]*?<\/article>/);
if (!firstDeadlineCardMatch) {
    throw new Error("index.html: first belt-card--deadline not found");
}
const firstCard = firstDeadlineCardMatch[0];
if (!firstCard.includes('href="paye-calculator.html"')) {
    throw new Error('index.html: first belt-card--deadline missing anchor with href="paye-calculator.html"');
}
console.log("  index.html: first belt-card--deadline has PAYE calculator link");

// Test (b): in the payroll article the paye-explained section contains an anchor with href ../../paye-calculator.html, and the Related section contains another
const payrollHtml = fs.readFileSync("content/insights/payroll-tax-services-kenya.html", "utf8");

// Check paye-explained section
const payeExplainedMatch = payrollHtml.match(/id="paye-explained"[\s\S]*?<\/div>[\s\S]*?<h2 id="nssf-shif"/);
if (!payeExplainedMatch) {
    throw new Error("payroll article: paye-explained section not found");
}
const payeExplainedSection = payeExplainedMatch[0];
if (!payeExplainedSection.includes('href="../../paye-calculator.html"')) {
    throw new Error('payroll article: paye-explained section missing anchor with href="../../paye-calculator.html"');
}
console.log("  payroll article: paye-explained section has PAYE calculator link");

// Check Related Services & Insights section
const relatedMatch = payrollHtml.match(/Related Services & Insights[\s\S]*?<\/div>[\s\S]*?<\/section>/);
if (!relatedMatch) {
    throw new Error("payroll article: Related Services & Insights section not found");
}
const relatedSection = relatedMatch[0];
if (!relatedSection.includes('href="../../paye-calculator.html"')) {
    throw new Error('payroll article: Related Services section missing anchor with href="../../paye-calculator.html"');
}
console.log("  payroll article: Related Services section has PAYE calculator link");

// Test (c): services.html contains at least two anchors to paye-calculator.html (the footer one counts as one)
const servicesHtml = fs.readFileSync("services.html", "utf8");
const payeLinks = servicesHtml.match(/href="(?:paye-calculator\.html|\.\.\/paye-calculator\.html|\/paye-calculator\.html)"/g) || [];
if (payeLinks.length < 2) {
    throw new Error(`services.html: expected at least 2 anchors to paye-calculator.html, found ${payeLinks.length}`);
}
console.log(`  services.html: has ${payeLinks.length} anchors to paye-calculator.html`);

// Test (d): checkLinks shows no broken links in these three files
for (const file of ["index.html", "content/insights/payroll-tax-services-kenya.html", "services.html"]) {
    const broken = checkLinks(file, require("path").resolve("."));
    if (broken.length > 0) {
        throw new Error(`${file}: Broken links found: ${JSON.stringify(broken)}`);
    }
    console.log(`  ${file}: Linkcheck passes`);
}

console.log("Step 13 contextual links test passed.");