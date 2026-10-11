/* APSIS FAQ assistant: free, runs entirely in the browser.
   No API, no backend, no cost. Answers come from the knowledge base (KB) below,
   which is taken from the public APSIS website pages.

   Install: put this file in /js/ and add before </body> on each page:
     <script src="/js/chat-widget.js" defer></script>
   To update an answer, edit the matching entry in KB. */
(function (root) {
  "use strict";

  var CONTACT =
    "Phone / WhatsApp: +254 722 670 127\n" +
    "Email: info@apsis.co.ke\n" +
    "Office: Noventra Suite, 3rd Floor, Crescent Business Centre, Westlands, Nairobi\n" +
    "Hours: Mon-Fri, 8:00 AM - 5:00 PM";

  var CAUTION = "Rates and rules change, so please confirm current figures with KRA or the APSIS team.";

  /* Each entry: id, q (sample question, also used for suggestion chips),
     k (keywords; multi-word phrases score higher), a (answer), link, caution */
  var KB = [
    {
      id: "services",
      q: "What services do you offer?",
      k: ["service", "offer", "provide", "specialise", "specialize", "offering"],
      a: "APSIS offers three groups of services:\n" +
        "- Tax: advisory, planning, filing, preparation and regulatory compliance (KRA)\n" +
        "- Accounting: bookkeeping and payroll audit\n" +
        "- Advisory: financial analysis, financial consulting, import/export reviews and advance rulings",
      link: "/services.html", linkText: "See all services"
    },
    {
      id: "about",
      q: "Tell me about APSIS",
      k: ["about apsis", "apsis consulting", "founded", "since", "history", "background", "established"],
      a: "APSIS Business Consulting Ltd is a Nairobi-based accounting and tax consulting firm, serving businesses since 2020. It helps clients manage KRA requirements and financial reporting, with experience across sectors such as manufacturing, retail, NGOs and the public sector.",
      link: "/about.html", linkText: "About APSIS"
    },
    {
      id: "team",
      q: "Who is on your team?",
      k: ["team", "director", "consultant", "staff", "founder", "cpa", "qualification", "qualified", "domisiano", "stephen", "mwenda", "experts", "people"],
      a: "The core team is:\n" +
        "- Domisiano Wainaina, Director & Lead Consultant: 14+ years in finance and taxation, CPA-K, MBA\n" +
        "- Stephen Chege, Compliance & Business Advisory: 15+ years, CPA-K, member of the Institute of Internal Auditors\n" +
        "- Mwenda Mwongera, Finance & Systems Lead: 13+ years in finance and audit across East Africa, ICPAK member",
      link: "/about.html", linkText: "Meet the team"
    },
    {
      id: "contact",
      q: "How do I contact you?",
      k: ["contact", "phone", "call", "email", "address", "location", "office", "reach", "whatsapp", "talk", "speak", "visit", "direction", "westlands", "hour", "open", "opening", "reply", "respond", "response", "number", "where"],
      a: CONTACT + "\n\nEnquiries through the site are answered within one business day.",
      link: "/contact.html", linkText: "Contact page"
    },
    {
      id: "fees",
      q: "How much do your services cost?",
      k: ["price", "cost", "fee", "charge", "quote", "much", "deposit", "proforma", "cheap", "affordable", "rate card", "pricing", "free consultation"],
      a: "Fees aren't published because they depend on the scope of the work. After a free, no-obligation initial consultation you receive an itemised proforma invoice. A 50% deposit is due when the agreement is signed and the balance when the assignment concludes.",
      link: "/workwithus.html", linkText: "How we work"
    },
    {
      id: "onboarding",
      q: "How do I start working with APSIS?",
      k: ["start", "begin", "engage", "onboarding", "hire", "process", "step", "start work", "become client", "get started", "engagement", "proposal"],
      a: "Getting started takes five steps:\n" +
        "1. Initial consultation about your needs\n" +
        "2. Scope and proposal, with a proforma invoice\n" +
        "3. Agreement signed and 50% deposit received\n" +
        "4. Delivery, with check-ins at each milestone, and the balance settled on completion\n" +
        "5. Ongoing support for follow-up questions\n\n" +
        "You can begin by phone, WhatsApp or email.",
      link: "/workwithus.html", linkText: "Work with us"
    },
    {
      id: "vat",
      q: "Tell me about VAT compliance",
      s: ["vat"],
      k: ["value added", "vat service"],
      a: "APSIS handles the full VAT cycle: monthly VAT return filing on iTax (including nil returns), eTIMS invoice reconciliation, input tax recovery and validation, KRA VAT audit support, VAT health checks and registration, and cross-border VAT advice.",
      link: "/vat-compliance-kenya.html", linkText: "VAT compliance"
    },
    {
      id: "vat-deadline",
      q: "When are VAT returns due?",
      s: ["vat"],
      k: ["vat deadline", "vat due", "20th", "monthly vat"],
      g: ["file", "filing", "deadline", "due"],
      a: "According to APSIS, VAT returns are due on iTax by the 20th of every month, including nil returns.",
      link: "/vat-compliance-kenya.html", linkText: "VAT compliance"
    },
    {
      id: "vat-registration",
      q: "When must I register for VAT?",
      s: ["vat"],
      k: ["vat register", "vat registration", "vat number", "threshold", "million"],
      g: ["register", "registration", "turnover", "voluntary"],
      a: "Per APSIS, a business with annual taxable turnover of Ksh 5 million or more must register for VAT within 30 days of reaching it. Voluntary registration is possible below the threshold, and importers of taxable goods or businesses supplying government entities may need to register regardless of turnover. APSIS can handle the registration on iTax.",
      link: "/content/insights/vat-registration-kenya.html", linkText: "VAT registration guide", caution: true
    },
    {
      id: "vat-penalty",
      q: "What are the VAT late filing penalties?",
      s: ["vat"],
      k: ["vat penalty", "vat late", "bank levy"],
      g: ["penalty", "late", "interest", "fine", "levy", "late filing"],
      a: "Per APSIS, a late VAT return carries a minimum penalty of Ksh 10,000 per return, and unpaid VAT attracts interest of 1% per month, compounded from the due date. Persistent non-compliance can lead to enforcement such as bank levies and asset seizure.",
      link: "/vat-compliance-kenya.html", linkText: "VAT compliance", caution: true
    },
    {
      id: "etims",
      q: "What is eTIMS and do I need it?",
      s: ["etims", "tims", "etr", "cuin"],
      k: ["invoic", "invoice", "e invoic", "integration", "quickbooks", "sage", "erp"],
      a: "eTIMS is KRA's cloud-based electronic tax invoicing system, which replaced the ETR device. Per APSIS, it applies to all VAT-registered businesses and to non-VAT businesses with turnover above Ksh 1 million. Customers can't claim input VAT on non-eTIMS invoices. APSIS sets up iTax activation, configuration and testing, trains staff, and reconciles eTIMS data with your VAT returns each month.",
      link: "/content/insights/etims-consultant-kenya.html", linkText: "eTIMS guide", caution: true
    },
    {
      id: "missed-deadline",
      q: "I missed my KRA filing deadline, what now?",
      x: ["vat", "paye", "payroll", "nssf", "shif", "nhif", "etims", "import", "export", "ruling"],
      k: ["miss", "missed", "late filing", "filing deadline", "deadline", "overdue", "late", "penalty", "penalties", "fine", "itax", "kra deadline"],
      a: "Don't ignore it, because penalties and interest keep building. Per APSIS:\n" +
        "1. Log in to iTax and find the late return and its period\n" +
        "2. Check earlier returns for errors\n" +
        "3. File the outstanding return as soon as possible, since a late return is better than none\n" +
        "4. Pay what is due, even partially, to reduce interest\n" +
        "5. Get a professional review if anything is unclear\n\n" +
        "Late interest is 1% per month, and the estimated minimum late filing penalty is Ksh 10,000.",
      link: "/content/blogs/kra-filing-deadline-kenya.html", linkText: "Read the full guide", caution: true
    },
    {
      id: "demand-notice",
      q: "KRA says I owe tax and I don't understand why",
      k: ["demand", "notice", "owe", "assessment", "objection", "object", "disagree", "dispute", "balance", "ledger", "appeal", "demand notice", "kra demand"],
      a: "Per APSIS, a KRA balance usually comes from an unfiled or incorrectly filed return, unreconciled payments, unclaimed withholding tax credits, or an audit assessment. Steps:\n" +
        "1. Get the notice from iTax (Correspondence or Notices)\n" +
        "2. Identify the tax type and period\n" +
        "3. Compare it with your returns and payment receipts\n" +
        "4. Check your clients' WHT certificates were credited\n" +
        "5. Note the objection deadline: KRA's formal window is 30 days from the date of assessment\n" +
        "6. Get professional advice before paying, objecting or filing\n\n" +
        "Ignoring a notice is the riskiest option.",
      link: "/content/blogs/kra-tax-demand-notice-kenya.html", linkText: "Read the full guide", caution: true
    },
    {
      id: "audit",
      q: "Can you help with a KRA audit?",
      k: ["audit", "kra audit", "audit support", "defence", "defense", "representation", "represent", "agent", "authorised", "authorized", "post clearance"],
      a: "Yes. APSIS can act as your authorised representative with KRA: preparing responses, organising documentation and negotiating with KRA officers during tax audits, VAT audits and objections. Engaging early reduces exposure.",
      link: "/content/insights/kra-audit-support.html", linkText: "KRA audit support"
    },
    {
      id: "payroll",
      q: "What payroll services and deadlines apply?",
      s: ["payroll", "paye", "nssf", "shif", "nhif", "helb", "payslip", "p9"],
      k: ["payroll audit", "salary", "salaries", "employee", "employer", "housing levy"],
      g: ["deadline", "due"],
      a: "APSIS handles monthly payroll computation, PAYE filing, NSSF and SHIF remittances, HELB deductions, payslips and annual P9 forms, plus KRA payroll audit support.\n" +
        "- PAYE: filed and remitted by the 9th of the following month\n" +
        "- NSSF: remitted by the 15th of the following month\n" +
        "- SHIF replaced NHIF from October 2024 and is remitted monthly\n" +
        "- Late PAYE: Ksh 10,000 plus 25% of the PAYE not paid on time, with 1% monthly interest\n\n" +
        "Directors can be personally liable for PAYE deducted but not remitted.",
      link: "/content/insights/payroll-tax-services-kenya.html", linkText: "Payroll services", caution: true
    },
    {
      id: "business-taxes",
      q: "What taxes does my business need to pay?",
      k: ["tax", "taxes", "corporate", "cit", "income tax", "withholding", "wht", "turnover tax", "tot", "instalment", "installment", "which tax", "types"],
      a: "Per APSIS's guide, businesses in Kenya typically deal with:\n" +
        "- Corporate income tax: 30% for resident companies\n" +
        "- VAT: 16% standard rate, for turnover above Ksh 5 million\n" +
        "- PAYE: remitted by the 9th of each month\n" +
        "- Withholding tax: typically 5% to 20% depending on the payment\n" +
        "- Turnover tax: 3% of gross turnover, for turnover between Ksh 1 million and Ksh 50 million\n" +
        "- Instalment tax, if expected annual income tax is above Ksh 40,000\n" +
        "- Housing levy: 1.5% of gross salary",
      link: "/content/blogs/business-taxes-in-kenya.html", linkText: "Read the full guide", caution: true
    },
    {
      id: "tax-filing",
      q: "Can you file my tax returns?",
      k: ["file", "filing", "return", "preparation", "prepare", "submit", "tax return", "tax filing"],
      a: "Yes. APSIS prepares and submits your tax returns accurately and on time to reduce penalties and compliance risk, and prepares the supporting tax documentation.",
      link: "/services.html", linkText: "Our services"
    },
    {
      id: "tax-planning",
      q: "Can you help me reduce my tax legally?",
      k: ["planning", "reduce", "minimise", "minimize", "deduction", "allowance", "relief", "capital allowance", "save", "saving", "optimise", "optimize", "strategy", "legally", "reduce tax", "pay less", "less tax", "tax saving", "tax advisor", "tax advice", "tax advisory"],
      a: "Yes. APSIS develops tax strategies to reduce your liability while staying fully compliant with KRA rules. Areas include capital allowances, investment deductions, documented business expenses, export reliefs, double taxation agreements, business structure and timing of income and expenses.",
      link: "/content/insights/kra-tax-consultant-kenya.html", linkText: "KRA tax consultant services"
    },
    {
      id: "health-check",
      q: "What is a tax health check?",
      k: ["health check", "compliance review", "tcc", "certificate", "tender", "tenders", "gap", "review", "tax compliance"],
      a: "A tax health check reviews your iTax account, a sample of past VAT, PAYE and income tax returns, and reconciles your KRA ledger with your records. You get compliance gaps ranked by risk and a written action plan with estimated remediation costs. A Tax Compliance Certificate is also needed for government tenders.",
      link: "/content/insights/kra-tax-consultant-kenya.html", linkText: "Tax consultant services"
    },
    {
      id: "bookkeeping",
      q: "Do you offer bookkeeping and accounting?",
      s: ["bookkeeping", "accountant", "ifrs"],
      k: ["book keeping", "accounting", "books", "records", "statements", "software", "xero", "reconcile", "ledger", "financial statement", "reporting"],
      a: "Yes. APSIS provides bookkeeping with audit-ready records, financial statement preparation under IFRS and Kenyan standards, financial reporting and analysis, and regulatory compliance. It also helps select, set up and train staff on software such as QuickBooks, Sage and Xero, and migrate from manual systems.",
      link: "/accountants-in-nairobi.html", linkText: "Accountants in Nairobi"
    },
    {
      id: "financial-advisory",
      q: "Do you offer financial advisory and CFO services?",
      s: ["cfo", "modelling", "modeling", "valuation", "forecast", "fundraising"],
      k: ["financial advisor", "financial advisory", "model", "budget", "investment", "capital", "financial analysis", "financial consulting", "cash flow"],
      a: "Yes. The advisory side covers financial analysis, planning and budgeting, financial modelling, investment appraisal (NPV, IRR, payback), cost control, capital structure and fractional CFO support. It also helps businesses preparing for investment or exit with due-diligence-ready models and valuation support.",
      link: "/financial-advisor.html", linkText: "Financial advisor"
    },
    {
      id: "import-export",
      q: "Do you help with import and export tax?",
      s: ["import", "export", "customs", "tariff", "comesa", "afcfta"],
      k: ["duty", "hs code", "eac", "cross border", "shipment", "clearance"],
      a: "Yes. APSIS reviews customs valuation and HS code classification, checks shipping documents, looks for duty exemptions and preferential rates under EAC and COMESA, supports post-clearance audits, and handles advance tax rulings.",
      link: "/import-export-tax-advisory.html", linkText: "Import/export tax advisory"
    },
    {
      id: "advance-ruling",
      q: "What is an advance tax ruling and how long does it take?",
      s: ["ruling"],
      k: ["advance ruling", "advance tax ruling", "binding", "60 days", "advance"],
      a: "An advance tax ruling is a binding written KRA opinion on how tax law applies to a proposed transaction. Per APSIS, KRA typically issues rulings within 60 days of a complete application, and complex cases such as transfer pricing may take longer. Acting in line with a ruling protects you from penalties even if KRA later changes its interpretation.",
      link: "/import-export-tax-advisory.html", linkText: "Import/export tax advisory", caution: true
    },
    {
      id: "industries",
      q: "Which industries do you serve?",
      k: ["industry", "industries", "sector", "ngo", "nonprofit", "non profit", "manufacturing", "retail", "wholesale", "public sector", "government", "sme", "startup", "start up"],
      a: "APSIS serves businesses across sectors: manufacturing (cost accounting and inventory valuation), retail and wholesale (POS reconciliation and multi-location reporting), NGOs and non-profits (donor and grant reporting) and the public sector (IPSAS compliance and audit readiness).",
      link: "/accountants-in-nairobi.html", linkText: "Accountants in Nairobi"
    },
    {
      id: "remote",
      q: "Do you work with clients outside Nairobi?",
      k: ["remote", "online", "outside", "outside nairobi", "town", "nationwide", "confidential", "confidentiality", "privacy", "secure", "virtual", "mombasa", "kisumu", "nakuru", "eldoret", "county", "upcountry"],
      a: "Yes. Services are delivered remotely, with in-person meetings when needed, and clients are in several Kenyan towns. Information is kept confidential under professional ethical standards.",
      link: "/content/insights/kra-tax-consultant-kenya.html", linkText: "KRA tax consultant services"
    },
    {
      id: "greeting",
      q: "Hello",
      k: ["hello", "hi", "hey", "greetings", "morning", "afternoon", "evening", "jambo", "habari"],
      a: "Hello! I can answer questions about APSIS's services, KRA and VAT basics, payroll deadlines and how to work with us. What would you like to know?",
      hidden: true
    },
    {
      id: "thanks",
      q: "Thank you",
      k: ["thanks", "thank", "thx", "asante", "cheers", "appreciate"],
      a: "Karibu! If you'd like to speak to the team, call or WhatsApp +254 722 670 127 or email info@apsis.co.ke.",
      hidden: true
    },
    {
      id: "farewell",
      q: "Goodbye",
      k: ["bye", "goodbye", "farewell", "later"],
      a: "Kwaheri, and thanks for stopping by! Whenever you need us, call or WhatsApp +254 722 670 127.",
      hidden: true
    },
    {
      id: "identity",
      q: "Are you a robot?",
      k: ["robot", "chatbot", "human", "real person", "your name", "apsi"],
      a: "I'm Apsi, the virtual assistant for APSIS Business Consulting. I'm an automated assistant, not a person: I answer common questions using information from the APSIS website. For anything specific to your situation, our consultants are a call away on +254 722 670 127.",
      hidden: true
    },
    {
      id: "smalltalk",
      q: "How are you?",
      k: ["doing", "feeling"],
      a: "Doing great, thanks for asking! I'm ready to help with questions about tax, VAT, payroll or working with APSIS. What would you like to know?",
      hidden: true
    },
    {
      id: "help",
      q: "What can you help me with?",
      k: ["help", "assist", "menu", "topic", "option"],
      a: "Here's what I can help with:\n" +
        "- Our services (tax, accounting, advisory)\n" +
        "- VAT: deadlines, registration, penalties\n" +
        "- KRA: missed deadlines, demand notices, audits\n" +
        "- Payroll: PAYE, NSSF and SHIF deadlines\n" +
        "- Fees, how to get started, and how to reach us\n\n" +
        "Just type your question or pick a topic below.",
      hidden: true
    }
  ];

  // Phrases made only of common words (who are you, how are you...) that keyword matching would skip
  var PATTERNS = [
    [/\b(who|what) are you\b|\bare you (a |an )?(robot|bot|human|real|person|ai|machine|chatbot)\b|\byour name\b|\bwho am i (talking|chatting)\b/, "identity"],
    [/\bhow are you\b|\bhow('s| is) it going\b|\bhow do you do\b/, "smalltalk"],
    [/^\s*(what (can|do) you (do|know|help( me)?( with)?)|how can you help( me)?|what can i ask( you)?|help)\s*[?!.]*\s*$/, "help"]
  ];

  var STOP = {};
  ("a an the is are was were be been am do does did i you we my me to of for in on and or can could would should will how what whats your yours it its with at if our us please tell some any there this that when who which have has had get got from as by just need want like know").split(" ")
    .forEach(function (w) { STOP[w] = true; });

  function stem(w) {
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + "y";
    if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 4 && /ed$/.test(w)) return w.slice(0, -2);
    if (w.length > 4 && /(xes|ches|shes|sses)$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
    return w;
  }

  function tokens(text) {
    return String(text).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
      .filter(function (w) { return w && !STOP[w] && (w.length > 1 || /\d/.test(w)); })
      .map(stem);
  }

  // Pre-compute each entry's keyword stems once
  KB.forEach(function (e) {
    e._single = {};
    e._strong = {};
    e._gen = {};
    e._excl = {};
    (e.g || []).forEach(function (kw) { tokens(kw).forEach(function (t) { e._gen[t] = true; }); });
    e._phrases = [];
    (e.s || []).forEach(function (kw) { tokens(kw).forEach(function (t) { e._strong[t] = true; }); });
    (e.x || []).forEach(function (kw) { tokens(kw).forEach(function (t) { e._excl[t] = true; }); });
    e.k.forEach(function (kw) {
      var t = tokens(kw);
      if (!t.length) return;
      if (t.length === 1) e._single[t[0]] = true;
      else e._phrases.push(" " + t.join(" ") + " ");
    });
  });

  function score(entry, qTokens, qPadded) {
    var s = 0, seen = {}, strongHit = false;
    qTokens.forEach(function (t) {
      if (seen[t]) return;
      seen[t] = true;
      if (entry._strong[t]) { s += 5; strongHit = true; }   // topic-specific word
      else if (entry._single[t]) s += 2;                    // ordinary keyword
      if (entry._excl[t]) s -= 6;                           // word that belongs to another topic
    });
    if (strongHit) {                                        // generic words only count next to a topic word
      Object.keys(seen).forEach(function (t) {
        if (entry._gen[t] && !entry._strong[t] && !entry._single[t]) s += 2;
      });
    }
    entry._phrases.forEach(function (p) { if (qPadded.indexOf(p) !== -1) s += 4; });
    return s;
  }

  function answer(query) {
    var raw = String(query).toLowerCase();
    for (var p = 0; p < PATTERNS.length; p++) {
      if (PATTERNS[p][0].test(raw)) return { entry: byId(PATTERNS[p][1]), related: [], score: 99 };
    }
    var qt = tokens(query);
    if (!qt.length) return null;
    var qPadded = " " + qt.join(" ") + " ";
    var ranked = KB.map(function (e, i) { return { e: e, s: score(e, qt, qPadded), i: i }; })
      .filter(function (r) { return r.s >= 2; })
      .sort(function (a, b) { return b.s - a.s || a.i - b.i; });
    if (!ranked.length) return null;
    var top = ranked[0];
    var related = ranked.slice(1).filter(function (r) { return !r.e.hidden && r.e.id !== top.e.id; })
      .slice(0, 2).map(function (r) { return r.e; });
    return { entry: top.e, related: related, score: top.s };
  }

  var SUGGESTIONS = ["services", "vat-deadline", "missed-deadline", "payroll", "fees", "contact"];

  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  // Expose the engine for testing (Node) and stop if there is no page
  var api = { KB: KB, answer: answer, tokens: tokens };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  /* ---------- UI ---------- */
  var ROBOT =
    '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
    '<line x1="24" y1="4" x2="24" y2="11" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' +
    '<circle cx="24" cy="4" r="2.8" fill="#5fd0ff"/>' +
    '<rect x="3" y="21" width="5" height="11" rx="2.5" fill="#fff"/>' +
    '<rect x="40" y="21" width="5" height="11" rx="2.5" fill="#fff"/>' +
    '<rect x="8" y="11" width="32" height="28" rx="10" fill="#fff"/>' +
    '<rect x="12" y="16" width="24" height="18" rx="7" fill="#0d2137"/>' +
    '<circle class="apsis-eye" cx="19" cy="24" r="3.2" fill="#5fd0ff"/>' +
    '<circle class="apsis-eye" cx="29" cy="24" r="3.2" fill="#5fd0ff"/>' +
    '<path d="M20 30 q4 3.2 8 0" stroke="#5fd0ff" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<rect x="16" y="41" width="16" height="4.5" rx="2.25" fill="#fff" opacity=".85"/>' +
    '</svg>';

  var css = [
    "#apsis-chat,#apsis-chat-btn,#apsis-teaser{--a-navy:#0d2137;--a-navy2:#17426f;--a-cyan:#5fd0ff;font-family:inherit}",
    "#apsis-chat-btn{position:fixed;right:20px;bottom:20px;width:62px;height:62px;border-radius:50%;border:0;padding:0;background:linear-gradient(145deg,var(--a-navy2),var(--a-navy));cursor:pointer;box-shadow:0 6px 20px rgba(13,33,55,.45);z-index:9998;display:flex;align-items:center;justify-content:center;transition:transform .2s}",
    "#apsis-chat-btn:hover{transform:scale(1.07)}",
    "#apsis-chat-btn svg{width:36px;height:36px}",
    "#apsis-chat-btn::after{content:'';position:absolute;inset:0;border-radius:50%;border:2px solid var(--a-cyan);opacity:0;animation:apsis-pulse 3s ease-out 2s 3}",
    ".apsis-eye{transform-box:fill-box;transform-origin:center;animation:apsis-blink 5s infinite}",
    "@keyframes apsis-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}",
    "@keyframes apsis-pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.55);opacity:0}}",
    "@keyframes apsis-pop{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}",
    "@keyframes apsis-dot{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-4px);opacity:1}}",
    "#apsis-teaser{position:fixed;right:20px;bottom:94px;max-width:240px;background:#fff;color:#1a1a1a;border-radius:14px 14px 4px 14px;box-shadow:0 6px 24px rgba(0,0,0,.2);padding:11px 30px 11px 13px;font-size:14px;line-height:1.4;cursor:pointer;z-index:9997;display:none;animation:apsis-pop .35s ease}",
    "#apsis-teaser.show{display:block}",
    "#apsis-teaser button{position:absolute;top:3px;right:6px;border:0;background:none;font-size:18px;color:#778;cursor:pointer;line-height:1}",
    "#apsis-chat{position:fixed;right:20px;bottom:96px;width:360px;max-width:calc(100vw - 24px);height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:18px;box-shadow:0 12px 40px rgba(13,33,55,.35);display:none;flex-direction:column;overflow:hidden;z-index:9999}",
    "#apsis-chat.open{display:flex;animation:apsis-pop .25s ease}",
    "#apsis-chat header{background:linear-gradient(135deg,var(--a-navy2),var(--a-navy));color:#fff;padding:12px 14px;display:flex;align-items:center;gap:11px}",
    ".apsis-av{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;flex:none}",
    ".apsis-av svg{width:26px;height:26px}",
    ".apsis-ht{flex:1;min-width:0;line-height:1.25}",
    ".apsis-ht strong{display:block;font-size:15px}",
    ".apsis-ht span{font-size:12px;opacity:.85;display:flex;align-items:center;gap:5px}",
    ".apsis-ht span::before{content:'';width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block}",
    "#apsis-chat header button{background:none;border:0;color:#fff;font-size:24px;cursor:pointer;line-height:1;padding:2px 6px}",
    "#apsis-msgs{flex:1;overflow-y:auto;padding:14px 12px 6px;background:#f3f6fa;font-size:14px;line-height:1.5}",
    ".apsis-m{max-width:88%;padding:9px 12px;border-radius:14px;margin-bottom:9px;white-space:pre-wrap;word-wrap:break-word;animation:apsis-pop .25s ease}",
    ".apsis-m.bot{background:#fff;color:#1a1a1a;border:1px solid #e3e8ef;border-bottom-left-radius:4px;box-shadow:0 1px 2px rgba(13,33,55,.06)}",
    ".apsis-m.user{background:var(--a-navy);color:#fff;margin-left:auto;border-bottom-right-radius:4px}",
    ".apsis-m a{color:#0d5fa8;font-weight:600;text-decoration:underline}",
    ".apsis-m .apsis-c{display:block;margin-top:7px;font-size:12px;color:#667}",
    ".apsis-typing{display:inline-flex;gap:4px;padding:12px 14px}",
    ".apsis-typing i{width:7px;height:7px;border-radius:50%;background:#778;animation:apsis-dot 1.1s infinite}",
    ".apsis-typing i:nth-child(2){animation-delay:.15s}.apsis-typing i:nth-child(3){animation-delay:.3s}",
    ".apsis-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}",
    ".apsis-chips button{border:1px solid var(--a-navy2);background:#fff;color:var(--a-navy);border-radius:16px;padding:6px 11px;font-size:13px;cursor:pointer;font-family:inherit;transition:background .15s,color .15s}",
    ".apsis-chips button:hover{background:var(--a-navy);color:#fff}",
    "#apsis-note{font-size:11px;color:#667;padding:6px 12px;background:#fff;border-top:1px solid #e3e8ef}",
    "#apsis-form{display:flex;border-top:1px solid #e3e8ef;background:#fff}",
    "#apsis-input{flex:1;border:0;padding:14px;font-size:14px;outline:none;font-family:inherit;background:transparent}",
    "#apsis-form button{border:0;background:var(--a-navy);color:#fff;padding:0 18px;cursor:pointer;font-weight:600;font-family:inherit}",
    "#apsis-form button:hover{background:var(--a-navy2)}",
    "#apsis-chat button:focus-visible,#apsis-chat-btn:focus-visible,#apsis-input:focus-visible{outline:2px solid var(--a-cyan);outline-offset:-2px}",
    "@media (max-width:480px){#apsis-chat{right:12px;left:12px;width:auto;bottom:90px;height:min(560px,calc(100vh - 110px))}#apsis-teaser{right:12px}}",
    "@media (prefers-reduced-motion:reduce){#apsis-chat-btn::after,.apsis-eye,.apsis-m,#apsis-chat.open,#apsis-teaser{animation:none}.apsis-typing i{animation:none;opacity:.7}}"
  ].join("\n");

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.id = "apsis-chat-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Chat with Apsi, the APSIS virtual assistant");
  btn.innerHTML = ROBOT;

  var teaser = document.createElement("div");
  teaser.id = "apsis-teaser";
  teaser.innerHTML = '<span>Hi, I’m Apsi! Ask me about KRA, VAT or payroll.</span><button type="button" aria-label="Dismiss">&times;</button>';

  var panel = document.createElement("div");
  panel.id = "apsis-chat";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat with Apsi");
  panel.innerHTML =
    '<header><div class="apsis-av">' + ROBOT + '</div>' +
    '<div class="apsis-ht"><strong>Apsi</strong><span>APSIS virtual assistant</span></div>' +
    '<button type="button" aria-label="Close chat">&times;</button></header>' +
    '<div id="apsis-msgs" aria-live="polite"></div>' +
    '<div id="apsis-note">Automated assistant. General information from our website, not formal tax advice. For your situation, contact our team.</div>' +
    '<form id="apsis-form"><input id="apsis-input" type="text" maxlength="200" placeholder="Ask about tax, VAT, payroll..." autocomplete="off" aria-label="Your question" required><button type="submit">Send</button></form>';

  document.body.appendChild(teaser);
  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var msgs = panel.querySelector("#apsis-msgs");
  var form = panel.querySelector("#apsis-form");
  var input = panel.querySelector("#apsis-input");
  var busy = false;
  var leadN = 0;

  function scroll() { msgs.scrollTop = msgs.scrollHeight; }

  function timeGreeting() {
    var h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  }

  var LEADS = ["Happy to help! ", "Good question. ", "Sure thing. ", "Of course! "];
  function lead(entry) {
    if (entry.hidden || entry.caution || entry.id === "contact") return "";
    leadN++;
    return leadN % 2 ? LEADS[(leadN >> 1) % LEADS.length] : "";
  }

  function addUser(text) {
    var d = document.createElement("div");
    d.className = "apsis-m user";
    d.textContent = text;
    msgs.appendChild(d);
    scroll();
  }

  function addChips(entries) {
    if (!entries.length) return;
    var wrap = document.createElement("div");
    wrap.className = "apsis-chips";
    entries.forEach(function (e) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = e.q;
      b.addEventListener("click", function () { ask(e.q); });
      wrap.appendChild(b);
    });
    msgs.appendChild(wrap);
    scroll();
  }

  function addBot(text, opts) {
    opts = opts || {};
    var d = document.createElement("div");
    d.className = "apsis-m bot";
    d.appendChild(document.createTextNode(text));
    if (opts.caution) {
      var c = document.createElement("span");
      c.className = "apsis-c";
      c.textContent = CAUTION;
      d.appendChild(c);
    }
    if (opts.link) {
      d.appendChild(document.createElement("br"));
      var a = document.createElement("a");
      a.href = opts.link;
      a.textContent = (opts.linkText || "Read more") + " →";
      d.appendChild(a);
    }
    msgs.appendChild(d);
    scroll();
  }

  function typing() {
    var d = document.createElement("div");
    d.className = "apsis-m bot apsis-typing";
    d.setAttribute("aria-label", "Apsi is typing");
    d.innerHTML = "<i></i><i></i><i></i>";
    msgs.appendChild(d);
    scroll();
    return d;
  }

  function reply(query) {
    var res = answer(query);
    if (!res) {
      return {
        text: "Hmm, I'm not sure I have that one. I'm a simple FAQ assistant, so for anything specific our team is your best bet:\n\n" +
          CONTACT + "\n\nOr pick a topic:",
        chips: SUGGESTIONS.map(byId)
      };
    }
    var e = res.entry, text = e.a;
    if (e.id === "greeting") {
      var sw = /\b(jambo|habari|sasa|mambo|hujambo)\b/i.test(query);
      text = (sw ? "Jambo! " : timeGreeting() + "! ") +
        "I'm Apsi, the virtual assistant for APSIS Business Consulting. Karibu! Ask me about our services, KRA and VAT basics, payroll deadlines or how to work with us.";
      return { text: text, chips: SUGGESTIONS.map(byId) };
    }
    if (e.id === "help" || e.id === "identity" || e.id === "smalltalk") {
      return { text: text, chips: SUGGESTIONS.map(byId) };
    }
    return { text: lead(e) + text, link: e.link, linkText: e.linkText, caution: e.caution, chips: res.related };
  }

  function ask(text) {
    if (busy) return;
    busy = true;
    addUser(text);
    var t = typing();
    var r = reply(text);
    var delay = Math.min(900, 380 + r.text.length * 3);
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
      addBot(r.text, { link: r.link, linkText: r.linkText, caution: r.caution });
      addChips(r.chips || []);
      busy = false;
    }, delay);
  }

  addBot(timeGreeting() + "! I'm Apsi, the virtual assistant for APSIS Business Consulting. Karibu! Ask me about our services, KRA and VAT basics, payroll deadlines or how to work with us.");
  addChips(SUGGESTIONS.map(byId));

  function store(key, val) { try { sessionStorage.setItem(key, val); } catch (e) { /* storage may be blocked */ } }
  function stored(key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } }

  function hideTeaser() { teaser.classList.remove("show"); store("apsis-teaser", "1"); }

  function toggle(open) {
    panel.classList.toggle("open", open);
    if (open) { hideTeaser(); setTimeout(function () { input.focus(); }, 0); }
  }

  btn.addEventListener("click", function () { toggle(!panel.classList.contains("open")); });
  panel.querySelector("header button").addEventListener("click", function () { toggle(false); btn.focus(); });
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") { toggle(false); btn.focus(); } });
  teaser.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") hideTeaser(); else toggle(true);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    ask(text);
  });

  // Friendly nudge once per visit, a few seconds after the page loads
  if (!stored("apsis-teaser")) {
    setTimeout(function () {
      if (!panel.classList.contains("open")) teaser.classList.add("show");
    }, 4500);
  }
})(typeof window !== "undefined" ? window : this);