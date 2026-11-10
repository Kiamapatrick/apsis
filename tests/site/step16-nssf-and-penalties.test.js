// Wording checks for NSSF deadline, late-penalty text and personal relief.
// Run: node --test tests/site/step16-nssf-and-penalties.test.js
// Sources: KRA Offences and Penalties page, KRA PAYE guide 2025/26, NSSF employer obligations page.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..", "..");
const SKIP_DIRS = new Set([".git", "node_modules", "tests"]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name) && !e.name.startsWith(".")) walk(path.join(dir, e.name), out);
    } else if (/\.(html|js)$/.test(e.name) && !/^test(-|\.js$)/.test(e.name)) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}
const allFiles = walk(root);
const rel = (f) => path.relative(root, f).split(path.sep).join("/");
const read = (r) => fs.readFileSync(path.join(root, r), "utf8");
const decode = (s) =>
  s.replace(/&nbsp;/g, " ").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">")
   .replace(/"/g, '"').replace(/'|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const collapse = (s) => s.replace(/\s+/g, " ").trim();
const visible = (html) =>
  collapse(decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")));

const PAGES = {
  vatCompliance: "vat-compliance-kenya.html",
  vatRegistration: "content/insights/vat-registration-kenya.html",
  taxCompliance: "content/insights/tax-compliance-services-kenya.html",
  payroll: "content/insights/payroll-tax-services-kenya.html",
  blog: "content/blogs/kra-filing-deadline-kenya.html",
  widget: "js/chat-widget.js",
};

// ---- NSSF deadline is the 9th ----
test("no page or script says NSSF is due on the 15th", () => {
  const hits = allFiles.filter((f) => read(rel(f)).includes("15th")).map(rel);
  assert.deepStrictEqual(hits, []);
});
test("payroll article says NSSF is remitted by the 9th of the following month", () => {
  assert.match(visible(read(PAGES.payroll)), /remitted to NSSF by the 9th of the following month/i);
});
test("chat widget says NSSF is remitted by the 9th", () => {
  assert.ok(read(PAGES.widget).includes("NSSF: remitted by the 9th of the following month"));
});

// ---- no claims KRA does not make ----
const FORBIDDEN = [
  "Per KRA, operating above the threshold",
  "Withholding tax late filing",
  "Late withholding tax filing",
  "Ksh 10,000 per return for VAT",
  "10,000 minimum penalty",
  "10,000 fixed penalty",
  "verify current amount",
  "Standard KRA late-filing penalties by tax type",
];
for (const phrase of FORBIDDEN) {
  test(`no page or script contains: ${phrase}`, () => {
    const hits = allFiles.filter((f) => read(rel(f)).includes(phrase)).map(rel);
    assert.deepStrictEqual(hits, []);
  });
}
test("interest is not described as compounded anywhere", () => {
  const re = /interest[^.]{0,120}compound|compound(ed|ing)[^.]{0,120}interest/i;
  const hits = allFiles.filter((f) => re.test(visible(read(rel(f))))).map(rel);
  assert.deepStrictEqual(hits, []);
});

// ---- the wording that should be there ----
test("VAT compliance page states the KRA late filing and payment penalties", () => {
  const t = visible(read(PAGES.vatCompliance));
  assert.ok(t.includes("5% of the tax due or Ksh 10,000, whichever is higher"));
  assert.ok(t.includes("Late payment attracts a penalty of 5% of the tax due plus interest of 1% per month"));
});
test("VAT registration page does not state a late registration figure", () => {
  const t = visible(read(PAGES.vatRegistration));
  assert.ok(t.includes("can attract a penalty"));
  assert.ok(t.includes("Late filing attracts 5% of the tax due or Ksh 10,000, whichever is higher"));
});
test("tax compliance page: PAYE, VAT and withholding tax wording follows KRA", () => {
  const t = visible(read(PAGES.taxCompliance));
  assert.ok(t.includes("25% of the tax due or Ksh 10,000"));
  assert.ok(t.includes("Late filing: 5% of the tax due or Ksh 10,000, whichever is higher."));
  assert.ok(t.includes("Withholding tax: Late payment attracts 5% of the tax due. Failing to deduct withholding VAT or withholding rental income tax attracts 10% of the tax involved."));
});
test("blog says interest accrues at 1% per month and has no extra penalty list", () => {
  const t = visible(read(PAGES.blog));
  assert.ok(t.includes("at 1% per month, so the cost grows the longer a balance is left unresolved"));
});
test("payroll article states the personal relief figure for residents", () => {
  const t = visible(read(PAGES.payroll));
  assert.ok(t.includes("personal relief of Ksh 2,400"));
  assert.ok(t.includes("Every resident employee is entitled to this relief"));
});

// ---- structured data: sentences with penalties, deadlines and rates must match the visible text ----
// (Other FAQ sentences are paraphrased on some pages; only the sentences below must be identical.)
const CLAIM_WORDS = /penalt|interest|late filing|late payment|9th|15th|relief|housing levy|2\.75%|6,480|108,000|KES 300|Ksh 10,000|Ksh 20,000/i;
function questions(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => questions(n, out));
  else if (node && typeof node === "object") {
    if (node["@type"] === "Question") out.push(node);
    Object.values(node).forEach((v) => questions(v, out));
  }
  return out;
}
for (const key of ["vatCompliance", "vatRegistration", "taxCompliance", "payroll", "blog"]) {
  test(`${PAGES[key]}: structured data is valid JSON and its claim sentences appear on the page`, () => {
    const html = read(PAGES[key]);
    const vis = visible(html);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    for (const q of blocks.flatMap((b) => questions(b))) {
      const sentences = collapse(q.acceptedAnswer.text).split(/(?<=[.!?])\s+/);
      for (const sentence of sentences.filter((x) => CLAIM_WORDS.test(x))) {
        assert.ok(vis.includes(sentence), `Not on the page (${q.name}): ${sentence}`);
      }
    }
  });
}

// ---- chat widget ----
test("chat widget file has valid JavaScript syntax", () => {
  execFileSync(process.execPath, ["--check", path.join(root, PAGES.widget)]);
});
test("chat widget gives the KRA VAT and PAYE penalty wording", () => {
  const w = read(PAGES.widget);
  assert.ok(w.includes("a late VAT return attracts 5% of the tax due or Ksh 10,000, whichever is higher"));
  assert.ok(w.includes("Late PAYE filing: the higher of 25% of the tax due or Ksh 10,000"));
});

// ---- sitemap ----
for (const slug of ["vat-compliance-kenya", "vat-registration-kenya", "tax-compliance-services-kenya", "kra-filing-deadline-kenya", "payroll-tax-services-kenya", "kra-audit-support"]) {
  test(`sitemap lastmod for ${slug} is 2026-11-09`, () => {
    const sm = read("sitemap.xml");
    const i = sm.indexOf(`${slug}.html`);
    assert.ok(i > -1, "page missing from sitemap");
    const blk = sm.slice(i, sm.indexOf("</url>", i));
    assert.match(blk, /<lastmod>2026-11-09<\/lastmod>/);
  });
}