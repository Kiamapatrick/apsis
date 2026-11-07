const fs = require("fs");

// Test: HTML has the button
const html = fs.readFileSync("paye-calculator.html", "utf8");
if (!html.includes('id="pcPrintBtn"') || !html.includes('Print or save as PDF')) {
  throw new Error("HTML missing print button");
}
if (!html.includes('id="pcPrintDate"')) {
  throw new Error("HTML missing print date element");
}

// Test: CSS has a print block hiding the form and the button
const css = fs.readFileSync("css/paye-calculator.css", "utf8");
if (!css.includes("@media print")) {
  throw new Error("CSS missing @media print block");
}
if (!css.includes(".pc-form") || !css.includes("display: none")) {
  throw new Error("CSS print block missing form hiding");
}
if (!css.includes(".pc-print-btn") || !css.includes("display: none")) {
  throw new Error("CSS print block missing button hiding");
}
if (!css.includes("page-break-inside: avoid")) {
  throw new Error("CSS print block missing page-break-inside: avoid for tables");
}

// Test: JS contains the print-line code
const js = fs.readFileSync("js/paye-calculator.js", "utf8");
if (!js.includes("pcPrintBtn") || !js.includes("pcPrintDate")) {
  throw new Error("JS missing print button or date element references");
}
if (!js.includes("window.print")) {
  throw new Error("JS missing window.print() call");
}
if (!js.includes("Estimate calculated on")) {
  throw new Error("JS missing print date line code");
}

console.log("All Step 6 print tests passed.");