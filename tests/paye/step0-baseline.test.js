const { compute, RATES, taxOnTaxable } = require("../../js/paye-calculator.js");

const TOLERANCE = 0.005;

function assertClose(actual, expected, label) {
  const diff = Math.abs(actual - expected);
  if (diff > TOLERANCE) {
    throw new Error(`${label}: expected ${expected}, got ${actual} (diff ${diff})`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

// Test compute(gross) returns [nssf, shif, levy, taxable, paye, net]
const computeCases = [
  { gross: 10000,  nssf: 600,     shif: 300,     levy: 150,    taxable: 8950,     paye: 0,        net: 8950 },
  { gross: 20000,  nssf: 1200,    shif: 550,     levy: 300,    taxable: 17950,    paye: 0,        net: 17950 },
  { gross: 30000,  nssf: 1800,    shif: 825,     levy: 450,    taxable: 26925,    paye: 731.25,   net: 26193.75 },
  { gross: 40000,  nssf: 2400,    shif: 1100,    levy: 600,    taxable: 35900,    paye: 3153.35,  net: 32746.65 },
  { gross: 50000,  nssf: 3000,    shif: 1375,    levy: 750,    taxable: 44875,    paye: 5845.85,  net: 39029.15 },
  { gross: 75000,  nssf: 4500,    shif: 2062.5,  levy: 1125,   taxable: 67312.5,  paye: 12577.10, net: 54735.40 },
  { gross: 100000, nssf: 6000,    shif: 2750,    levy: 1500,   taxable: 89750,    paye: 19308.35, net: 70441.65 },
  { gross: 108000, nssf: 6480,    shif: 2970,    levy: 1620,   taxable: 96930,    paye: 21462.35, net: 75467.65 },
  { gross: 150000, nssf: 6480,    shif: 4125,    levy: 2250,   taxable: 137145,   paye: 33526.85, net: 103618.15 },
  { gross: 200000, nssf: 6480,    shif: 5500,    levy: 3000,   taxable: 185020,   paye: 47889.35, net: 137130.65 },
  { gross: 300000, nssf: 6480,    shif: 8250,    levy: 4500,   taxable: 280770,   paye: 76614.35, net: 204155.65 },
  { gross: 500000, nssf: 6480,    shif: 13750,   levy: 7500,   taxable: 472270,   paye: 134064.35, net: 338205.65 },
  { gross: 1000000, nssf: 6480,   shif: 27500,   levy: 15000,  taxable: 951020,   paye: 292740.35, net: 658279.65 },
];

for (const c of computeCases) {
  const r = compute(c.gross);
  assertClose(r.nssf, c.nssf, `gross ${c.gross} nssf`);
  assertClose(r.shif, c.shif, `gross ${c.gross} shif`);
  assertClose(r.levy, c.levy, `gross ${c.gross} levy`);
  assertClose(r.taxable, c.taxable, `gross ${c.gross} taxable`);
  assertClose(r.paye, c.paye, `gross ${c.gross} paye`);
  assertClose(r.net, c.net, `gross ${c.gross} net`);
}

// Test taxOnTaxable(x).taxBefore
const taxCases = [
  { taxable: 24000,   taxBefore: 2400 },
  { taxable: 32333,   taxBefore: 4483.25 },
  { taxable: 500000,  taxBefore: 144783.35 },
  { taxable: 800000,  taxBefore: 242283.35 },
  { taxable: 95000,   taxBefore: 23283.35 },
  { taxable: 100000,  taxBefore: 24783.35 },
];

for (const c of taxCases) {
  const r = taxOnTaxable(c.taxable);
  assertClose(r.taxBefore, c.taxBefore, `taxOnTaxable(${c.taxable}) taxBefore`);
  // Also check bands structure
  if (!Array.isArray(r.bands)) {
    throw new Error(`taxOnTaxable(${c.taxable}) bands is not an array`);
  }
}

// Test net pay never decreases as gross increases (sample every 50 from 0 to 1,500,000)
let lastNet = null;
for (let gross = 0; gross <= 1500000; gross += 50) {
  const r = compute(gross);
  if (lastNet !== null && r.net < lastNet - TOLERANCE) {
    throw new Error(`Net pay decreases at gross ${gross}: ${lastNet} -> ${r.net}`);
  }
  lastNet = r.net;
}

console.log("All Step 0 baseline tests passed.");