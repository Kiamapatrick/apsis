const { compute, grossFromNet } = require("../../js/paye-calculator.js");

const TOLERANCE_GROSS = 0.011;
const TOLERANCE_NET = 0.011;

// Test grossFromNet(net) must be within 0.01 of these, and compute(result).net must be within 0.01 of the target net
const cases = [
  { net: 5000,     expectedGross: 5729.73 },
  { net: 10000,    expectedGross: 11142.06 },
  { net: 20000,    expectedGross: 22284.12 },
  { net: 35000,    expectedGross: 43586.71 },
  { net: 39029.15, expectedGross: 50000.00 },
  { net: 50000,    expectedGross: 67462.55 },
  { net: 80000,    expectedGross: 114762.18 },
  { net: 100000,   expectedGross: 144601.79 },
  { net: 250000,   expectedGross: 368398.88 },
  { net: 600000,   expectedGross: 906359.27 },
];

for (const c of cases) {
  const gross = grossFromNet(c.net);
  const diff = Math.abs(gross - c.expectedGross);
  if (diff > TOLERANCE_GROSS) {
    throw new Error(`grossFromNet(${c.net}): expected ${c.expectedGross}, got ${gross} (diff ${diff})`);
  }
  const r = compute(gross);
  const netDiff = Math.abs(r.net - c.net);
  if (netDiff > TOLERANCE_NET) {
    throw new Error(`compute(grossFromNet(${c.net})).net: expected ${c.net}, got ${r.net} (diff ${netDiff})`);
  }
}

// Also check that the HTML has the radio group and both labels
const fs = require("fs");
const html = fs.readFileSync("paye-calculator.html", "utf8");
if (!html.includes('name="mode"')) {
  throw new Error("HTML missing radio group with name='mode'");
}
if (!html.includes('value="gross"') || !html.includes('value="net"')) {
  throw new Error("HTML missing gross or net radio option");
}
if (!html.includes('Gross pay') || !html.includes('Take-home pay')) {
  throw new Error("HTML missing radio labels");
}

console.log("All Step 1 net-to-gross tests passed.");