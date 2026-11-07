const { compute, grossFromNet } = require("../../js/paye-calculator.js");

const TOLERANCE = 0.01;

function assertClose(actual, expected, label) {
  const diff = Math.abs(actual - expected);
  if (diff > TOLERANCE) {
    throw new Error(`${label}: expected ${expected}, got ${actual} (diff ${diff})`);
  }
}

// All tests for gross 100000
// Expected [taxable, taxBefore, paye, net]

// baseline
let r = compute(100000);
assertClose(r.taxable, 89750, "baseline taxable");
assertClose(r.taxBefore, 21708.35, "baseline taxBefore");
assertClose(r.paye, 19308.35, "baseline paye");
assertClose(r.net, 70441.65, "baseline net");

// mortgageInterest 20000
r = compute(100000, { mortgageInterest: 20000 });
assertClose(r.taxable, 69750, "mortgage 20000 taxable");
assertClose(r.taxBefore, 15708.35, "mortgage 20000 taxBefore");
assertClose(r.paye, 13308.35, "mortgage 20000 paye");
assertClose(r.net, 76441.65, "mortgage 20000 net");

// mortgageInterest 40000 (capped at 30000)
r = compute(100000, { mortgageInterest: 40000 });
assertClose(r.taxable, 59750, "mortgage 40000 taxable");
assertClose(r.taxBefore, 12708.35, "mortgage 40000 taxBefore");
assertClose(r.paye, 10308.35, "mortgage 40000 paye");
assertClose(r.net, 79441.65, "mortgage 40000 net");

// insurancePremium 10000 (relief 1500)
r = compute(100000, { insurancePremium: 10000 });
assertClose(r.taxable, 89750, "insurance 10000 taxable");
assertClose(r.taxBefore, 21708.35, "insurance 10000 taxBefore");
assertClose(r.paye, 17808.35, "insurance 10000 paye");
assertClose(r.net, 71941.65, "insurance 10000 net");

// insurancePremium 50000 (relief capped at 5000)
r = compute(100000, { insurancePremium: 50000 });
assertClose(r.taxable, 89750, "insurance 50000 taxable");
assertClose(r.taxBefore, 21708.35, "insurance 50000 taxBefore");
assertClose(r.paye, 14308.35, "insurance 50000 paye");
assertClose(r.net, 75441.65, "insurance 50000 net");

// extraPension 10000
r = compute(100000, { extraPension: 10000 });
assertClose(r.taxable, 79750, "extraPension 10000 taxable");
assertClose(r.taxBefore, 18708.35, "extraPension 10000 taxBefore");
assertClose(r.paye, 16308.35, "extraPension 10000 paye");
assertClose(r.net, 63441.65, "extraPension 10000 net");

// extraPension 40000 (deduction capped at 30000, NSSF=6000, so extra=24000 max)
r = compute(100000, { extraPension: 40000 });
assertClose(r.taxable, 65750, "extraPension 40000 taxable");
assertClose(r.taxBefore, 14508.35, "extraPension 40000 taxBefore");
assertClose(r.paye, 12108.35, "extraPension 40000 paye");
assertClose(r.net, 37641.65, "extraPension 40000 net");

// prmf 10000
r = compute(100000, { prmf: 10000 });
assertClose(r.taxable, 79750, "prmf 10000 taxable");
assertClose(r.taxBefore, 18708.35, "prmf 10000 taxBefore");
assertClose(r.paye, 16308.35, "prmf 10000 paye");
assertClose(r.net, 63441.65, "prmf 10000 net");

// prmf 20000 (deduction capped at 15000)
r = compute(100000, { prmf: 20000 });
assertClose(r.taxable, 74750, "prmf 20000 taxable");
assertClose(r.taxBefore, 17208.35, "prmf 20000 taxBefore");
assertClose(r.paye, 14808.35, "prmf 20000 paye");
assertClose(r.net, 54941.65, "prmf 20000 net");

// Combined at gross 150000 with extraPension 15000, prmf 5000, mortgageInterest 25000, insurancePremium 8000
r = compute(150000, { extraPension: 15000, prmf: 5000, mortgageInterest: 25000, insurancePremium: 8000 });
assertClose(r.taxable, 92145, "combined taxable");
assertClose(r.taxBefore, 22426.85, "combined taxBefore");
assertClose(r.insuranceRelief, 1200, "combined insuranceRelief");
assertClose(r.paye, 18826.85, "combined paye");
assertClose(r.net, 98318.15, "combined net");

// Gross 30000 with insurancePremium 10000: paye 0 (never negative)
r = compute(30000, { insurancePremium: 10000 });
assertClose(r.paye, 0, "low gross with insurance paye");

// Also: grossFromNet round-trips for the combined case
const options = { extraPension: 15000, prmf: 5000, mortgageInterest: 25000, insurancePremium: 8000 };
const gross = 150000;
const r0 = compute(gross, options);
const net = r0.net;
const gross2 = grossFromNet(net, options);
const r2 = compute(gross2, options);
assertClose(r2.net, net, "grossFromNet round-trip net");

// Check HTML has the four fields
const fs = require("fs");
const html = fs.readFileSync("paye-calculator.html", "utf8");
const requiredIds = ["pcExtraPension", "pcPrmf", "pcMortgage", "pcInsurance"];
for (const id of requiredIds) {
  if (!html.includes(id)) {
    throw new Error(`HTML missing field ${id}`);
  }
}
if (!html.includes("The disability exemption is not included")) {
  throw new Error("HTML missing disability exemption note");
}

console.log("All Step 3 other deductions tests passed.");