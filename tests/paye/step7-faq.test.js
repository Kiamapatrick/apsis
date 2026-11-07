const fs = require("fs");

// Test: JSON-LD parses as valid JSON, has 6 questions
const html = fs.readFileSync("paye-calculator.html", "utf8");
const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!jsonLdMatch) {
  throw new Error("HTML missing JSON-LD script");
}
const jsonLd = JSON.parse(jsonLdMatch[1]);
if (jsonLd["@context"] !== "https://schema.org") {
  throw new Error("JSON-LD missing @context");
}
if (jsonLd["@type"] !== "FAQPage") {
  throw new Error("JSON-LD missing @type FAQPage");
}
if (!Array.isArray(jsonLd.mainEntity) || jsonLd.mainEntity.length !== 6) {
  throw new Error("JSON-LD mainEntity must have 6 questions");
}

// Test: every question and answer string appears verbatim in the visible HTML
const questions = [
  {
    q: "Is PAYE charged on gross pay?",
    a: "No. NSSF, SHIF and the employee's housing levy are deducted first, and PAYE is charged on the pay that remains. This has applied since 27 December 2024."
  },
  {
    q: "Why is there no PAYE on the first KES 24,000 of taxable pay?",
    a: "Tax on the first KES 24,000 is KES 2,400 at 10%, which equals the monthly personal relief for residents. For an employee with only the standard deductions, PAYE starts at a gross pay of about KES 26,741."
  },
  {
    q: "What is the most NSSF an employee pays?",
    a: "KES 6,480 a month: 6% of pay up to KES 108,000, under the limits in force since February 2026. The employer pays the same amount."
  },
  {
    q: "Is SHIF capped?",
    a: "No. It is 2.75% of gross pay with a minimum of KES 300 and no upper limit."
  },
  {
    q: "How much is the housing levy and who pays it?",
    a: "1.5% of gross pay from the employee and 1.5% from the employer."
  },
  {
    q: "When must PAYE be paid?",
    a: "Employers must pay PAYE and file the return by the 9th of the following month."
  }
];

for (const qa of questions) {
  if (!html.includes(qa.q)) {
    throw new Error("HTML missing question: " + qa.q);
  }
  if (!html.includes(qa.a)) {
    throw new Error("HTML missing answer: " + qa.a);
  }
  // Also verify in JSON-LD
  const found = jsonLd.mainEntity.some(item => item.name === qa.q && item.acceptedAnswer.text === qa.a);
  if (!found) {
    throw new Error("JSON-LD missing question/answer: " + qa.q);
  }
}

// Test: sitemap.xml includes paye-calculator.html
const sitemap = fs.readFileSync("sitemap.xml", "utf8");
if (!sitemap.includes("paye-calculator.html")) {
  throw new Error("sitemap.xml missing paye-calculator.html");
}

console.log("All Step 7 FAQ tests passed.");