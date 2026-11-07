const { compute, employerCost } = require("../../js/paye-calculator.js");

const TOLERANCE = 0.01;

// Test employerCost
const cases = [
  { gross: 50000,  employerNssf: 3000, employerLevy: 750, nita: 50, total: 53800 },
  { gross: 100000, employerNssf: 6000, employerLevy: 1500, nita: 50, total: 107550 },
  { gross: 200000, employerNssf: 6480, employerLevy: 3000, nita: 50, total: 209530 },
];

for (const c of cases) {
  const ec = employerCost(c.gross);
  if (Math.abs(ec.employerNssf - c.employerNssf) > TOLERANCE) {
    throw new Error(`gross ${c.gross} employerNssf: expected ${c.employerNssf}, got ${ec.employerNssf}`);
  }
  if (Math.abs(ec.employerLevy - c.employerLevy) > TOLERANCE) {
    throw new Error(`gross ${c.gross} employerLevy: expected ${c.employerLevy}, got ${ec.employerLevy}`);
  }
  if (Math.abs(ec.nita - c.nita) > TOLERANCE) {
    throw new Error(`gross ${c.gross} nita: expected ${c.nita}, got ${ec.nita}`);
  }
  if (Math.abs(ec.total - c.total) > TOLERANCE) {
    throw new Error(`gross ${c.gross} total: expected ${c.total}, got ${ec.total}`);
  }
}

// Also check that the HTML has the employer cost details/summary
const fs = require("fs");
const html = fs.readFileSync("paye-calculator.html", "utf8");
if (!html.includes("Cost to the employer")) {
  throw new Error("HTML missing employer cost details/summary");
}
if (!html.includes("pcEmpGross") || !html.includes("pcEmpNssf") || !html.includes("pcEmpLevy") || !html.includes("pcEmpNita") || !html.includes("pcEmpTotal")) {
  throw new Error("HTML missing employer cost table cells");
}
if (!html.includes("nita.go.ke/our-services/levy-inspectorate.html")) {
  throw new Error("HTML missing NITA source link");
}

console.log("All Step 2 employer cost tests passed.");