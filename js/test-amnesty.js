"use strict";
const bot = require("./chat-widget.js");

let total = 0, failed = 0;
function check(ok, label, detail) {
    total++;
    if (!ok) { failed++; console.log("  FAIL  " + label + (detail ? "\n        " + detail : "")); }
}

// Mirrors reply(): topic router, then keyword KB, with live answers
function ask(q, when) {
    bot.routeReset();
    const vr = bot.routeReply(q);
    if (vr) return { id: "vat-topic", text: vr.text || "" };
    const res = bot.answer(q, null);
    if (!res) return { id: "fallback", text: "" };
    const e = res.entry;
    const text = typeof e.fn === "function" ? e.fn(q, when || new Date("2026-11-01T09:00:00Z")).text : e.a;
    return { id: e.id, text: text, hedged: bot.unsure ? bot.unsure(q, res) : false };
}

const MUST = ["31 December 2026", "100%", "1 January 2026", "iTax"];
const QUESTIONS = [
    "is there a tax amnesty",
    "tell me about the tax amnesty",
    "KRA amnesty deadline",
    "when does the amnesty end",
    "amnesty",
    "can I get my penalties waived",
    "is there a waiver on interest",
    "tax waiver",
    "I forgot to file, is there an amnesty?",
    "VAT amnesty",
    "how do I benefit from the 2026 amnesty",
];

console.log("== Amnesty questions: right entry, key facts present, no hedge");
QUESTIONS.forEach(function (q) {
    const r = ask(q);
    check(r.id === "amnesty", JSON.stringify(q) + " -> id", "got " + r.id);
    const miss = MUST.filter(function (s) { return r.text.indexOf(s) === -1; });
    check(!miss.length, JSON.stringify(q) + " -> content", "missing: " + miss.join(", "));
    check(!r.hedged, JSON.stringify(q) + " -> no hedge");
});

console.log("== After 31 December 2026 the bot must not claim the window is open");
const after = ask("is there a tax amnesty", new Date("2027-01-05T09:00:00Z"));
check(after.id === "amnesty", "still routes to amnesty");
check(after.text.indexOf("was scheduled to close") !== -1, "uses the cautious wording", after.text.slice(0, 80));
check(after.text.indexOf("+254 722 670 127") !== -1, "points to the team");

console.log("== Regressions: neighbours still behave");
[
    ["I missed my KRA filing deadline", "missed-deadline"],
    ["I forgot to file my returns", "missed-deadline"],
    ["kra penalities", "missed-deadline"],
    ["KRA sent me a demand notice", "demand-notice"],
    ["what is the penalty for late VAT", "vat-topic"],
].forEach(function (row) {
    const r = ask(row[0]);
    check(r.id === row[1], JSON.stringify(row[0]) + " -> " + row[1], "got " + r.id);
});

console.log("\n" + (total - failed) + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);