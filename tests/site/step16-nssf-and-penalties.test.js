const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(".");

function findFiles(dir, ext) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "tests" && entry.name !== "node_modules") {
      files.push(...findFiles(fullPath, ext));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = findFiles(repoRoot, ".html");
const jsFiles = findFiles(repoRoot, ".js");

console.log("Test group 1: NSSF deadline is the 9th");

// 1. No file contains "15th" (excluding test files and js/test*.js files)
let has15th = false;
for (const file of [...htmlFiles, ...jsFiles]) {
  // Normalize path separators for consistent matching
  const normalizedFile = file.replace(/\\/g, "/");
  if (normalizedFile.includes("tests/") || normalizedFile.includes("js/test")) continue;
  const content = fs.readFileSync(file, "utf8");
  if (content.includes("15th")) {
    console.error(`Found "15th" in ${file}`);
    has15th = true;
  }
}
if (has15th) {
  throw new Error("Found '15th' in non-test files");
}
console.log("  No '15th' found in non-test files");

// 2. Widget deadline answers contain "9th"
const chatWidget = fs.readFileSync("js/chat-widget.js", "utf8");
if (!chatWidget.includes("9th")) {
  throw new Error("Widget does not contain '9th'");
}
console.log("  Widget contains '9th'");

// 3. Article contains "by the 9th of the following month" next to NSSF
const payrollArticle = fs.readFileSync("content/insights/payroll-tax-services-kenya.html", "utf8");
const nssfSection = payrollArticle.substring(
  payrollArticle.indexOf("NSSF (National Social Security Fund)"),
  payrollArticle.indexOf("NSSF (National Social Security Fund)") + 1000
);
// Strip HTML tags, then normalize whitespace
const nssfText = nssfSection.replace(/<[^>]*>/g, "").replace(/\s+/g, " ");
if (!nssfText.includes("by the 9th of the following month")) {
  throw new Error("Article NSSF section does not contain 'by the 9th of the following month'");
}
console.log("  Article contains 'by the 9th of the following month' next to NSSF");

// 4. Chat widget deadline answers contain "9th"
if (!chatWidget.includes("9th")) {
  throw new Error("Chat widget does not contain '9th' in deadline answers");
}
console.log("  Widget deadline answers contain '9th'");

// 5. Chat widget no longer has "15th" in deadlines group
if (chatWidget.includes("15th")) {
  throw new Error("Chat widget still contains '15th'");
}
console.log("  Chat widget no longer has '15th' in deadlines group");

console.log("All test group 1 tests passed.");

// Test group 2: VAT and late-penalty wording
console.log("\nTest group 2: VAT and late-penalty wording");

// 1. vat-compliance-kenya.html card text
const vatCompliance = fs.readFileSync("vat-compliance-kenya.html", "utf8");
if (!vatCompliance.includes("A late VAT return costs 5% of the tax due or Ksh 10,000, whichever is higher")) {
  throw new Error("vat-compliance-kenya.html missing new card text");
}
if (!vatCompliance.includes("Unpaid VAT adds a 5% penalty and 1% monthly interest")) {
  throw new Error("vat-compliance-kenya.html missing penalty/interest text");
}
if (!vatCompliance.includes("Six missed returns cost at least Ksh 60,000")) {
  throw new Error("vat-compliance-kenya.html missing six missed returns text");
}
if (vatCompliance.includes("Ksh 10,000 minimum per late return + 1% monthly interest on unpaid VAT. Six missed returns = Ksh 60,000+ before interest")) {
  throw new Error("vat-compliance-kenya.html still has old card text");
}
console.log("  vat-compliance-kenya.html card text updated");

// 2. vat-compliance-kenya.html FAQ
if (!vatCompliance.includes("Per KRA, late filing of a VAT return attracts 5% of the tax due or Ksh 10,000, whichever is higher")) {
  throw new Error("vat-compliance-kenya.html FAQ missing new late filing penalty");
}
if (!vatCompliance.includes("Late payment attracts a penalty of 5% of the tax due plus interest of 1% per month")) {
  throw new Error("vat-compliance-kenya.html FAQ missing new late payment penalty");
}
if (vatCompliance.includes("Late filing attracts a minimum penalty of Ksh 10,000 per return. Late payment incurs interest of 1% per month on the outstanding VAT, compounded from the due date. Persistent non-compliance can lead to KRA enforcement action including bank levies and asset seizure")) {
  throw new Error("vat-compliance-kenya.html FAQ still has old text");
}
console.log("  vat-compliance-kenya.html FAQ updated");

// 3. content/insights/vat-registration-kenya.html
const vatRegistration = fs.readFileSync("content/insights/vat-registration-kenya.html", "utf8");
if (!vatRegistration.includes("Per KRA, operating above the threshold without registering attracts 5% of the tax due or Ksh 10,000, whichever is higher, for late registration")) {
  throw new Error("vat-registration-kenya.html missing new late registration penalty");
}
if (!vatRegistration.includes("Unpaid VAT attracts a 5% penalty and 1% monthly interest")) {
  throw new Error("vat-registration-kenya.html missing penalty/interest text");
}
if (vatRegistration.includes("Operating above the Ksh 5 million threshold without registering for VAT exposes a business to back-payment of all VAT that should have been collected, plus a late registration penalty of Ksh 10,000 and interest of 1% per month on the unpaid tax")) {
  throw new Error("vat-registration-kenya.html still has old penalty text");
}
console.log("  vat-registration-kenya.html penalties updated");

// 4. content/insights/vat-registration-kenya.html FAQ "Do I need to file VAT returns every month in Kenya?"
if (!vatRegistration.includes("Late filing attracts a penalty of 5% of the tax due or Ksh 10,000, whichever is higher")) {
  throw new Error("vat-registration-kenya.html missing updated monthly filing penalty");
}
if (vatRegistration.includes("Late filing attracts a minimum penalty of Ksh 10,000 per return")) {
  throw new Error("vat-registration-kenya.html still has old monthly filing penalty");
}
console.log("  vat-registration-kenya.html monthly filing penalty updated");

// 5. content/insights/tax-compliance-services-kenya.html
const taxCompliance = fs.readFileSync("content/insights/tax-compliance-services-kenya.html", "utf8");
if (!taxCompliance.includes("A late VAT return costs 5% of the tax due or Ksh 10,000, whichever is higher. Six missed returns cost at least Ksh 60,000.")) {
  throw new Error("tax-compliance-services-kenya.html missing updated VAT penalty text");
}
if (taxCompliance.includes("Each missed VAT return is Ksh 10,000. Miss six in a year and you have spent Ksh 60,000 in avoidable penalties before a single shilling of interest is counted")) {
  throw new Error("tax-compliance-services-kenya.html still has old VAT penalty text");
}
console.log("  tax-compliance-services-kenya.html VAT penalty text updated");

// 6. tax-compliance-services-kenya.html penalty list
if (!taxCompliance.includes("Late filing of a VAT return attracts 5% of the tax due or Ksh 10,000, whichever is higher")) {
  throw new Error("tax-compliance-services-kenya.html missing updated VAT late filing penalty");
}
if (!taxCompliance.includes("Late PAYE filing incurs the higher of 25% of the tax due or Ksh 10,000")) {
  throw new Error("tax-compliance-services-kenya.html missing updated PAYE penalty");
}
if (!taxCompliance.includes("Late withholding tax filing incurs 5% of the tax due or Ksh 10,000, whichever is higher")) {
  throw new Error("tax-compliance-services-kenya.html missing withholding tax penalty");
}
if (taxCompliance.includes("Late filing penalties in Kenya are Ksh 10,000 per return for VAT, PAYE, and withholding tax. For corporate income tax, the penalty is 5% of the tax due or Ksh 20,000, whichever is higher. Interest of 1% per month also applies to any unpaid tax balance from the original due date")) {
  throw new Error("tax-compliance-services-kenya.html still has old penalty text");
}
console.log("  tax-compliance-services-kenya.html penalty list updated");

// 7. content/blogs/kra-filing-deadline-kenya.html
const kraFiling = fs.readFileSync("content/blogs/kra-filing-deadline-kenya.html", "utf8");
if (!kraFiling.includes("VAT: 5% of tax due or Ksh 10,000; PAYE: 25% of tax due or Ksh 10,000; Income tax: 5% of tax due or Ksh 20,000; Withholding tax: 5% of tax due or Ksh 10,000")) {
  throw new Error("kra-filing-deadline-kenya.html missing updated penalty list");
}
console.log("  kra-filing-deadline-kenya.html penalty list updated");

// 8. js/chat-widget.js VAT topic penalty fact
if (!chatWidget.includes("5% of the tax due or Ksh 10,000")) {
  throw new Error("chat-widget.js VAT topic missing new penalty wording");
}
console.log("  chat-widget.js VAT penalty updated");

// 9. sitemap.xml updated lastmod for changed pages
const sitemap = fs.readFileSync("sitemap.xml", "utf8");
const requiredLastmod = [
  "vat-compliance-kenya.html",
  "content/insights/vat-registration-kenya.html",
  "content/insights/tax-compliance-services-kenya.html",
  "content/blogs/kra-filing-deadline-kenya.html"
];
for (const page of requiredLastmod) {
  const urlPattern = `<loc>https://www.apsis.co.ke/${page}</loc>`;
  const urlIndex = sitemap.indexOf(urlPattern);
  if (urlIndex === -1) {
    throw new Error(`sitemap.xml missing entry for ${page}`);
  }
  const lastmodIndex = sitemap.indexOf("<lastmod>", urlIndex);
  if (lastmodIndex === -1 || lastmodIndex > sitemap.indexOf("</url>", urlIndex)) {
    throw new Error(`sitemap.xml missing lastmod for ${page}`);
  }
  // <lastmod> is 8 chars, date starts at index 9 (after >), so use +9 to +19
  const lastmodValue = sitemap.substring(lastmodIndex + 9, lastmodIndex + 19);
  if (lastmodValue !== "2026-11-09") {
    throw new Error(`sitemap.xml ${page} has lastmod ${lastmodValue}, expected 2026-11-09`);
  }
}
console.log("  sitemap.xml lastmod updated to 2026-11-09");

console.log("\nAll test group 2 tests passed.");

console.log("\nTest group 3: Personal relief wording (COMMIT B)");
if (!payrollArticle.includes("personal relief of Ksh 2,400")) {
  throw new Error("Payroll article missing 'personal relief of Ksh 2,400'");
}
if (!payrollArticle.includes("Every resident employee is entitled to this relief")) {
  throw new Error("Payroll article missing 'Every resident employee is entitled to this relief'");
}
console.log("  Payroll article has correct personal relief wording");

console.log("\nAll tests passed!");