/* APSIS FAQ assistant: free, runs entirely in the browser.
   No API, no backend, no cost. Answers come from the knowledge base (KB) below,
   which is taken from the public APSIS website pages.

   Install: put this file in /js/ and add before </body> on each page:
     <script src="/js/chat-widget.js" defer></script>
   To update an answer, edit the matching entry in KB.

   Apsi's face: animated SVG robot with five moods (happy, sad, angry, thinking,
   sleepy), eyes that follow the cursor, head tilt, blinking, and reactions to
   what visitors say. Each KB entry can set a `mood`; visitor tone (worried,
   happy, rude) can override it. Test a mood from the browser console with:
     ApsisChat.setMood("angry")   */
(function (root) {
  "use strict";

  var CONTACT =
    "Phone / WhatsApp: +254 722 670 127\n" +
    "Email: info@apsis.co.ke\n" +
    "Office: Noventra Suite, 3rd Floor, Crescent Business Centre, Westlands, Nairobi\n" +
    "Hours: Mon-Fri, 8:00 AM - 5:00 PM";

  var CAUTION = "Rates and rules change, so please confirm current figures with KRA or the APSIS team.";

  /* Each entry: id, q (sample question, also used for suggestion chips),
     k (keywords; multi-word phrases score higher), s (strong, topic-specific words),
     g (generic words that only count next to a strong word), x (words that belong
     to another topic), a (answer), link, more (extra links as [url, text] pairs),
     caution, mood, then, fn (builds the answer live, e.g. opening hours or the time) */
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
      k: ["team", "member", "members", "team member", "meet team", "our team", "colleague", "leadership", "management",
        "director", "consultant", "staff", "founder", "cpa", "qualification", "qualified", "domisiano", "stephen", "mwenda", "experts", "people"],
      a: "The core team is:\n" +
        "- Domisiano Wainaina, Director & Lead Consultant: 14+ years in finance and taxation, CPA-K, MBA\n" +
        "- Stephen Chege, Compliance & Business Advisory: 15+ years, CPA-K, member of the Institute of Internal Auditors\n" +
        "- Mwenda Mwongera, Finance & Systems Lead: 13+ years in finance and audit across East Africa, ICPAK member\n\n" +
        "Ask me about any of them by name for more detail.",
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

    /* ---- Team members: one entry per person, plus "who handles what" ---- */
    {
      id: "team-domisiano",
      q: "Who is Domisiano Wainaina?",
      s: ["domisiano", "wainaina"],
      k: ["lead consultant", "managing director", "mba", "financial planning", "investment appraisal"],
      a: "Domisiano Wainaina is the Director & Lead Consultant at APSIS. He has over 14 years in finance and taxation, with a focus on financial planning, financial modelling and regulatory compliance. He holds an MBA and a BA from the University of Nairobi, is CPA-K certified, and heads the FP&A, modelling and investment appraisal practice.",
      link: "/about.html", linkText: "Meet the team"
    },
    {
      id: "team-stephen",
      q: "Who is Stephen Chege?",
      s: ["stephen", "chege"],
      k: ["compliance advisory", "internal audit", "institute of internal auditors", "jkuat"],
      a: "Stephen Chege handles Compliance & Business Advisory at APSIS. He has over 15 years of post-qualification experience in financial services and public accounting, with a focus on internal audit and organisational development. He is CPA-K, a member of the Institute of Internal Auditors, holds a BA from the University of Nairobi, and is pursuing an MBA in Strategic Management at JKUAT.",
      link: "/about.html", linkText: "Meet the team"
    },
    {
      id: "team-mwenda",
      q: "Who is Mwenda Mwongera?",
      s: ["mwenda", "mwongera"],
      k: ["finance lead", "systems lead", "icpak", "bank reconciliation", "advanced excel", "saas"],
      a: "Mwenda Mwongera is APSIS's Finance & Systems Lead, with over 13 years in finance and audit across East Africa. He leads statutory and internal audits, strategic planning and tax compliance, including VAT compliance, eTIMS reconciliation and regional tax work. He also designs training on bank reconciliation and advanced Excel, and leads SaaS solutions for bookkeeping and multi-currency reporting. He is an ICPAK member and fluent in English and Swahili.",
      link: "/about.html", linkText: "Meet the team"
    },
    {
      id: "team-size",
      q: "How many people are on your team?",
      k: ["team size", "headcount", "many people", "many staff", "many employees"],
      a: "The APSIS website introduces three core team members: Domisiano Wainaina (Director & Lead Consultant), Stephen Chege (Compliance & Business Advisory) and Mwenda Mwongera (Finance & Systems Lead). On client work they are joined by tax advisors, customs specialists and systems experts, including CPA-K certified professionals. I don't have an exact headcount.",
      link: "/about.html", linkText: "Meet the team"
    },
    {
      id: "team-who",
      q: "Who should I speak to about my issue?",
      k: ["right person", "which consultant", "who handle", "who should i speak"],
      a: "Based on the APSIS website:\n" +
        "- Tax strategy, financial planning and modelling: Domisiano Wainaina\n" +
        "- Compliance, internal audit and business advisory: Stephen Chege\n" +
        "- VAT, eTIMS, audits, payroll and bookkeeping systems: Mwenda Mwongera\n\n" +
        "Not sure who fits? Call or WhatsApp +254 722 670 127 and the team will point you to the right person.",
      link: "/contact.html", linkText: "Contact page"
    },
    {
      id: "team-qualifications",
      q: "What qualifications does the team have?",
      k: ["qualifications", "certified", "certification", "credentials", "degree", "cpa-k", "cpak", "icpak", "professional body", "registered"],
      a: "Per the APSIS website:\n" +
        "- Domisiano Wainaina: CPA-K, MBA and BA from the University of Nairobi\n" +
        "- Stephen Chege: CPA-K, member of the Institute of Internal Auditors, BA from the University of Nairobi, pursuing an MBA in Strategic Management at JKUAT\n" +
        "- Mwenda Mwongera: ICPAK member\n\n" +
        "On client work they are joined by tax advisors, customs specialists and systems experts, including CPA-K certified professionals.",
      link: "/about.html", linkText: "Meet the team"
    },

    /* ---- Contact: specific questions, including live opening hours (Nairobi time) ---- */
    {
      id: "hours",
      q: "Are you open today?",
      k: ["hours"],
      fn: function (q, now) { return hoursAnswer(q, now); },
      a: "Our office hours are Monday to Friday, 8:00 AM to 5:00 PM (Nairobi time). Public holidays may differ, so call +254 722 670 127 to confirm.",
      link: "/contact.html", linkText: "Contact page"
    },
    {
      id: "phone",
      q: "What is your phone number?",
      s: ["phone", "telephone", "mobile", "landline", "cellphone"],
      k: ["number"],
      a: "You can call APSIS on +254 722 670 127, Monday to Friday, 8:00 AM to 5:00 PM (Nairobi time). The same number works on WhatsApp.",
      link: "tel:+254722670127", linkText: "Call +254 722 670 127"
    },
    {
      id: "email",
      q: "What is your email address?",
      s: ["email", "mail", "gmail"],
      a: "You can email APSIS at info@apsis.co.ke. Emails and messages sent through the website's contact form are answered within one business day.",
      link: "mailto:info@apsis.co.ke", linkText: "Email info@apsis.co.ke"
    },
    {
      id: "address",
      q: "Where is your office located?",
      s: ["address", "located", "location", "directions", "map", "crescent", "noventra", "westlands"],
      k: ["where", "find you", "building", "floor"],
      a: "APSIS is at Noventra Suite, 3rd Floor, Crescent Business Centre, Westlands, Nairobi. It's best to call ahead on +254 722 670 127 to arrange a visit so someone is available to meet you.",
      link: "https://www.google.com/maps/search/?api=1&query=Crescent+Business+Centre+Westlands+Nairobi", linkText: "Get directions on Google Maps"
    },
    {
      id: "whatsapp",
      q: "Do you have WhatsApp?",
      s: ["whatsapp"],
      k: ["sms", "text message"],
      a: "Yes! You can reach APSIS on WhatsApp at +254 722 670 127, the same number as the office phone. It's a handy way to start a conversation or send a quick question.",
      link: "https://wa.me/254722670127", linkText: "Chat on WhatsApp"
    },
    {
      id: "social",
      q: "Are you on LinkedIn or X?",
      s: ["linkedin", "twitter", "facebook", "instagram", "tiktok", "youtube", "social"],
      k: ["social media", "socials", "follow"],
      a: "You can find APSIS on LinkedIn and X (Twitter), the social profiles listed on the website:",
      link: "https://www.linkedin.com/company/apsis-business-consulting-ltd/", linkText: "APSIS on LinkedIn",
      more: [["https://x.com/ApsisBusinessKE", "APSIS on X (Twitter)"]]
    },
    {
      id: "response-time",
      q: "How quickly will you reply?",
      a: "Enquiries sent through the website are answered within one business day. For anything urgent, calling or WhatsApp on +254 722 670 127 is fastest (Monday to Friday, 8:00 AM to 5:00 PM, Nairobi time).",
      link: "/contact.html", linkText: "Contact page"
    },
    {
      id: "appointment",
      q: "Can I book a meeting?",
      s: ["appointment", "walk"],
      k: ["book", "meeting", "schedule", "meet"],
      a: "Yes! The first consultation is free and with no obligation. Call or WhatsApp +254 722 670 127 or email info@apsis.co.ke to arrange a time. Meetings can be remote, or in person when needed. If you'd like to visit the office, please call ahead so someone is available.",
      link: "/contact.html", linkText: "Contact page"
    },

    /* ---- Everyday questions ---- */
    {
      id: "time",
      q: "What time is it?",
      k: ["clock"],
      hidden: true,
      fn: function (q, now) { return clockAnswer(now); },
      a: "I can usually tell the time, but my clock needs a moment. Try asking again!"
    },
    {
      id: "date",
      q: "What's today's date?",
      hidden: true,
      fn: function (q, now) { return dateAnswer(now); },
      a: "I can usually tell the date, but my calendar needs a moment. Try asking again!"
    },
    {
      id: "languages",
      q: "Do you speak Swahili?",
      s: ["swahili", "kiswahili", "language", "languages"],
      hidden: true,
      a: "Kidogo! I can greet you with Jambo, Karibu, Asante and Kwaheri, but my answers are in English for now. For a conversation in Swahili, the APSIS team can help. Mwenda Mwongera, for one, is fluent in both English and Swahili."
    },
    {
      id: "age",
      q: "How old are you?",
      hidden: true,
      a: "I'm brand new, so I'm a baby in robot years. APSIS itself has been serving businesses since 2020."
    },
    {
      id: "home",
      q: "Where are you from?",
      hidden: true,
      a: "I live right here on the APSIS website. The team behind me is in Westlands, Nairobi."
    },
    {
      id: "weather",
      q: "What's the weather like?",
      s: ["weather", "rain", "raining", "sunny", "temperature"],
      hidden: true,
      a: "I can't see outside from in here, so a weather app will do better than me. If it's raining in Nairobi, though, it's the perfect time to get your tax returns filed indoors!"
    },

    /* ---- The developer ---- */
    {
      id: "developer",
      q: "Tell me about the developer",
      s: ["patrick", "kiama"],
      k: ["developer", "build website", "build chatbot", "make website", "website developer", "web developer", "app developer"],
      a: "Patrick Kiama is the developer behind me. He's a full-stack developer based in Nairobi who builds websites, web applications and chatbots like me, and he designed me to run free, right in your browser, with no backend. Want to connect or work with him? You'll find him on LinkedIn.",
      link: "https://www.linkedin.com/in/patrick-kiama-ba91103b9/", linkText: "Patrick Kiama on LinkedIn"
    },

    /* ---- Conversation hooks: emotion, urgency, trust, and personality ---- */
    {
      id: "worried",
      q: "I'm worried about KRA penalties",
      s: ["worried", "scared", "afraid", "panic", "overwhelmed", "anxious", "nervous", "stressed", "desperate"],
      k: ["worry", "stress", "in trouble"],
      mood: "sad",
      a: "That sounds stressful, and you're not alone. Most KRA problems can be fixed, and acting early stops penalties and interest from growing. A good first step is to check what iTax shows as outstanding, then get professional advice before paying, objecting or filing. The APSIS team can review your position: call or WhatsApp +254 722 670 127.",
      link: "/contact.html", linkText: "Contact the team", caution: true
    },
    {
      id: "frustrated",
      q: "KRA is so frustrating",
      s: ["frustrated", "frustrating", "frustration", "annoying", "annoyed", "nightmare", "headache", "ridiculous"],
      mood: "angry",
      a: "I'm on your side here. Tax admin can be a real headache. The good news is that most issues come down to a few things: a missing return, an unmatched payment, or an uncredited withholding tax certificate. Tell me what's happening (a notice, a deadline, a VAT problem) and I'll point you to the right steps.",
      hidden: true
    },
    {
      id: "urgent",
      q: "It's urgent, who can I talk to?",
      s: ["urgent", "urgently", "asap", "emergency", "immediately"],
      mood: "happy",
      a: "For anything urgent, calling or WhatsApp is fastest:\n" + CONTACT + "\n\nEnquiries sent through the site are answered within one business day.",
      link: "/contact.html", linkText: "Contact page"
    },
    {
      id: "why-apsis",
      q: "Why choose APSIS?",
      s: ["choose"],
      k: ["why apsis", "trust", "reliable", "experienced", "experience", "different", "better"],
      mood: "happy",
      a: "A few reasons, per the APSIS website:\n" +
        "- Serving businesses since 2020 across manufacturing, retail, NGOs and the public sector\n" +
        "- A CPA-K qualified team with 13 to 15+ years of experience each\n" +
        "- A free, no-obligation first consultation and an itemised proforma invoice\n" +
        "- Remote delivery, with in-person meetings when needed",
      link: "/about.html", linkText: "About APSIS"
    },
    {
      id: "privacy",
      q: "Do you save my chat?",
      k: ["save chat", "store chat", "my data", "recorded", "tracking", "chat saved", "log chat", "data privacy"],
      mood: "thinking",
      a: "I run entirely in your browser. I don't send your messages anywhere, and the conversation disappears when you close or reload the page. Please don't type sensitive details such as PINs or passwords here.",
      hidden: true
    },
    {
      id: "creator",
      q: "Who built you?",
      s: ["built", "creator", "programmed", "developer"],
      mood: "happy",
      a: "I was built by Patrick Kiama, a full-stack developer based in Nairobi. I'm a simple FAQ assistant built for the APSIS website. Everything I say comes from the APSIS site pages, and I run free in your browser with no backend behind me. Fun fact: Patrick gave me my blinking eyes, and I'm very attached to them.",
      link: "https://www.linkedin.com/in/patrick-kiama-ba91103b9/", linkText: "Connect with Patrick on LinkedIn",
      hidden: true
    },
    {
      id: "joke",
      q: "Tell me a joke",
      s: ["joke", "funny", "laugh", "riddle"],
      mood: "happy",
      a: "Why did the accountant bring a ladder to work? To reach the high-level reports. Okay, I'll stay in my lane. Ask me about tax instead!",
      hidden: true
    },
    {
      id: "awake",
      q: "Are you there?",
      k: ["awake", "asleep", "wake"],
      mood: "happy",
      a: "I'm here! Just resting my eyes for a second. What can I help you with?",
      hidden: true
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
      k: ["thanks", "thank", "thx", "asante", "cheers", "appreciate", "great", "awesome", "amazing", "brilliant", "impressive", "cool", "nice"],
      a: "Karibu! If you'd like to speak to the team, call or WhatsApp +254 722 670 127 or email info@apsis.co.ke.",
      hidden: true
    },
    {
      id: "rude",
      q: "You are stupid",
      k: ["insult"],
      a: "Ouch, that stings a little! I'm a simple FAQ bot doing my best, so let's keep it friendly. If I couldn't help, our team certainly can: call or WhatsApp +254 722 670 127.",
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
        "- Fees, how to get started, and how to reach us\n" +
        "- Our team, opening hours, today's date and the time, and who built me\n\n" +
        "Just type your question or pick a topic below.",
      hidden: true
    }
  ];

  /* ---------- VAT topic (pilot) ----------
   One topic, four facts. Every wording of a fact carries the SAME verified
   numbers; only the sentence style changes. {next} is replaced later with the
   fact's `next` label. */
  var VAT_TOPIC = {
    id: "vat",
    words: ["vat"],                               // a message containing one of these words is about this topic
    phrase: /value[- ]added/,                     // optional: an extra pattern that also means this topic
    stepAside: ["etims", "tims", "etr", "cuin", "invoice", "paye", "payroll", "nssf", "shif", "nhif", "helb", "salary", "import", "export", "customs", "tariff"],
    feeExempt: "penalty",                         // price words go to the Fees answer, unless this fact was asked for
    vague: ["deadline", "registration", "penalty"],   // the buttons shown when the question is too vague
    canYou: "overview",                           // "Do you handle VAT?" gets this fact
    missed: {                                     // "I missed my VAT deadline": this fact, then a push to contact APSIS
      re: /\bmiss(ed)?\b|\bforgot(ten)?\b|\boverdue\b|\b(past|after) (the |my )?(due|deadline)\b|\b(haven'?t|have not|hasn'?t|has not|didn'?t|did not|never|failed to) (yet )?(filed?|submit(ted)?|paid?)\b|\bnot (yet )?(filed|submitted|paid)\b|\b(filed|submitted|paid)\b.{0,15}\blate\b/,
      example: "I missed my VAT deadline",
      fact: "penalty",
      unless: "registration",                      // "I forgot to register" is not a late-filing question
      contact: [
        "Because interest on unpaid VAT builds up monthly, it's best to act early. Call or WhatsApp APSIS on +254 722 670 127, or email info@apsis.co.ke, and the team can review your position and help you get compliant.",
        "The sooner this is looked at, the better. Contact APSIS on +254 722 670 127 (call or WhatsApp) or info@apsis.co.ke and a consultant can review your VAT position.",
        "Not sure where you stand? Reach the APSIS team on +254 722 670 127 (call or WhatsApp) or at info@apsis.co.ke and they'll go through your VAT position with you."
      ]
    },

    openers: [
      "Good question. ",
      "Sure, here's what I have. ",
      "Happy to help with that. ",
      "Here's the short version. ",
      "Of course. "
    ],

    closers: [
      "Want to know about {next} too?",
      "I can also cover {next} if that helps.",
      "Anything else on VAT? I can explain {next}.",
      "Next up, {next}? Just ask.",
      "Need anything else on VAT?"
    ],

    // asked when the visitor says only "VAT" / "VAT problem"
    clarify: [
      "Happy to help with VAT. Is your question about the filing deadline, registration, or penalties?",
      "VAT covers a few things. Which one do you need: deadline, registration, or penalties?",
      "Sure! Are you after the VAT deadline, how to register, or the late-filing penalties?"
    ],

    // asked when two facts match, e.g. "VAT deadline and penalty"
    clarifyMulti: [
      "I can cover {a} and {b}. Together, or one at a time?",
      "Both are covered: {a} and {b}. Want them together, or one at a time?"
    ],

    facts: [
      {
        id: "overview", label: "the VAT services", next: "the filing deadline",
        nextId: "deadline", button: "VAT services",
        s: ["service", "cycle", "compliance"],
        w: ["handle", "help", "offer", "provide", "about", "audit", "health", "check", "cross", "border", "input", "recovery"],
        must: ["iTax"],
        wordings: [
          "APSIS handles the full VAT cycle: monthly return filing on iTax (nil returns included), eTIMS invoice reconciliation, input tax recovery and validation, KRA VAT audit support, VAT health checks and registration, and cross-border VAT advice.",
          "On VAT, APSIS covers the whole cycle. That means filing monthly returns on iTax (including nil returns), reconciling eTIMS invoices, recovering and validating input tax, supporting you through KRA VAT audits, running VAT health checks, handling registration and advising on cross-border VAT.",
          "Here's what APSIS does on VAT:\n- Monthly return filing on iTax, including nil returns\n- eTIMS invoice reconciliation\n- Input tax recovery and validation\n- KRA VAT audit support\n- VAT health checks and registration\n- Cross-border VAT advice",
          "VAT is something APSIS looks after end to end: from filing your monthly iTax returns (nil returns too) and reconciling eTIMS invoices, to input tax recovery, VAT audit support, health checks, registration and cross-border advice."
        ],
        link: "/vat-compliance-kenya.html", linkText: "VAT compliance"
      },
      {
        id: "deadline", label: "the filing deadline", next: "the late-filing penalties",
        nextId: "penalty", button: "Filing deadline",
        s: ["deadline", "due", "20th"],
        w: ["monthly", "file", "return", "date", "nil"],
        must: ["20th"],
        wordings: [
          "According to APSIS, VAT returns are due on iTax by the 20th of every month, including nil returns.",
          "Mark the 20th: per APSIS, your VAT return goes on iTax by the 20th of each month, and that includes nil returns.",
          "Monthly, by the 20th. Per APSIS, VAT returns are filed on iTax by that date, even when there is nothing to declare (a nil return).",
          "Per APSIS, the VAT deadline is the 20th of every month on iTax. Nil returns must be filed too."
        ],
        link: "/vat-compliance-kenya.html", linkText: "VAT compliance"
      },
      {
        id: "registration", label: "registration", next: "the filing deadline",
        nextId: "deadline", button: "Registration",
        s: ["register", "registration", "threshold", "turnover", "voluntary"],
        w: ["number", "million", "certificate"],
        must: ["5 million", "30 days"],
        wordings: [
          "Per APSIS, a business with annual taxable turnover of Ksh 5 million or more must register for VAT within 30 days of reaching it. Voluntary registration is possible below the threshold, and importers of taxable goods or businesses supplying government entities may need to register regardless of turnover. APSIS can handle the registration on iTax.",
          "The VAT registration threshold is Ksh 5 million in annual taxable turnover, per APSIS, and you register within 30 days of reaching it. Below that you can register voluntarily. Importers of taxable goods and businesses supplying government entities may need to register whatever their turnover. APSIS can do the iTax registration for you.",
          "VAT registration, per APSIS:\n- Required at annual taxable turnover of Ksh 5 million or more, within 30 days of reaching it\n- Voluntary below the threshold\n- May apply regardless of turnover to importers of taxable goods and businesses supplying government entities\n- APSIS can handle it on iTax",
          "Reached Ksh 5 million in annual taxable turnover? Per APSIS, you must register for VAT within 30 days. You can also register voluntarily below that, and importers of taxable goods or government suppliers may need to register regardless of turnover. APSIS can take care of it on iTax."
        ],
        link: "/content/insights/vat-registration-kenya.html", linkText: "VAT registration guide", caution: true
      },
      {
        id: "penalty", label: "the late-filing penalties", next: "how to register",
        nextId: "registration", button: "Penalties", mood: "sad",
        s: ["penalty", "late", "levy", "seizure", "fine"],
        w: ["interest", "unpaid", "enforcement"],
        must: ["10,000", "1%"],
        wordings: [
          "Per APSIS, a late VAT return carries a minimum penalty of Ksh 10,000 per return, and unpaid VAT attracts interest of 1% per month, compounded from the due date. Persistent non-compliance can lead to enforcement such as bank levies and asset seizure.",
          "Filing VAT late costs money. Per APSIS: a minimum penalty of Ksh 10,000 per return, plus interest of 1% per month on unpaid VAT, compounded from the due date. If non-compliance persists, enforcement such as bank levies and asset seizure can follow.",
          "Late VAT, per APSIS:\n- Minimum penalty of Ksh 10,000 per late return\n- Interest of 1% per month on unpaid VAT, compounded from the due date\n- Persistent non-compliance can lead to bank levies and asset seizure",
          "Late VAT gets costly, according to APSIS: Ksh 10,000 minimum per late return, 1% monthly interest on unpaid VAT (compounded from the due date), and, for persistent non-compliance, possible bank levies and asset seizure."
        ],
        link: "/vat-compliance-kenya.html", linkText: "VAT compliance", caution: true
      }
    ]
  };

  /* ---------- Payroll topic ----------
     Drafted ONLY from what the KB "payroll" entry already says. It is switched OFF:
     the addTopic(PAYROLL_TOPIC) line in the topic engine below is commented out.
     Do not switch it on until every figure has been checked against the APSIS pages. */
  var PAYROLL_TOPIC = {
    id: "payroll",
    words: ["payroll", "paye", "nssf", "shif", "nhif", "helb", "payslip", "p9"],
    stepAside: ["etims", "tims", "etr", "cuin", "invoice", "import", "export", "customs", "tariff"],
    feeExempt: "penalty",
    vague: ["deadlines", "penalty", "liability"],
    canYou: "overview",
    missed: {                                     // same rule as VAT: the penalty facts, then a push to contact APSIS
      re: VAT_TOPIC.missed.re,
      example: "I missed my PAYE deadline",
      fact: "penalty",
      contact: [
        "Because late PAYE attracts monthly interest, it's best to act early. Call or WhatsApp APSIS on +254 722 670 127, or email info@apsis.co.ke, and the team can review your position and help you get compliant.",
        "The sooner this is looked at, the better. Contact APSIS on +254 722 670 127 (call or WhatsApp) or info@apsis.co.ke and a consultant can review your payroll position.",
        "Not sure where you stand? Reach the APSIS team on +254 722 670 127 (call or WhatsApp) or at info@apsis.co.ke and they'll go through your payroll position with you."
      ]
    },

    openers: [
      "Good question. ",
      "Sure, here's what I have. ",
      "Happy to help with that. ",
      "Here's the short version. ",
      "Of course. "
    ],

    closers: [
      "Want to know about {next} too?",
      "I can also cover {next} if that helps.",
      "Anything else on payroll? I can explain {next}.",
      "Next up, {next}? Just ask.",
      "Need anything else on payroll?"
    ],

    clarify: [
      "Happy to help with payroll. Is your question about the deadlines, the late PAYE penalties, or director liability?",
      "Payroll covers a few things. Which one do you need: deadlines, late penalties, or director liability?",
      "Sure! Are you after the payroll deadlines, the late PAYE penalties, or director liability?"
    ],

    clarifyMulti: [
      "I can cover {a} and {b}. Together, or one at a time?",
      "Both are covered: {a} and {b}. Want them together, or one at a time?"
    ],

    facts: [
      {
        id: "overview", label: "the payroll services", next: "the payroll deadlines",
        nextId: "deadlines", button: "Payroll services",
        s: ["service", "payslip", "p9"],
        w: ["handle", "help", "offer", "provide", "about", "audit", "salary", "employee", "employer"],
        must: ["P9"],
        wordings: [
          "APSIS handles monthly payroll computation, PAYE filing, NSSF and SHIF remittances, HELB deductions, payslips and annual P9 forms, plus KRA payroll audit support.",
          "On payroll, APSIS covers the monthly computation, PAYE filing, NSSF and SHIF remittances, HELB deductions, payslips and the annual P9 forms. It also supports you through KRA payroll audits.",
          "Here's what APSIS does on payroll:\n- Monthly payroll computation\n- PAYE filing\n- NSSF and SHIF remittances\n- HELB deductions\n- Payslips and annual P9 forms\n- KRA payroll audit support"
        ],
        link: "/content/insights/payroll-tax-services-kenya.html", linkText: "Payroll services"
      },
      {
        id: "deadlines", label: "the payroll deadlines", next: "the late PAYE penalties",
        nextId: "penalty", button: "Payroll deadlines",
        s: ["deadline", "due", "9th", "15th"],
        w: ["monthly", "file", "date"],
        must: ["9th", "15th"],
        wordings: [
          "Per APSIS: PAYE is filed and remitted by the 9th of the following month, and NSSF is remitted by the 15th of the following month. SHIF is remitted monthly.",
          "Payroll deadlines, per APSIS:\n- PAYE: filed and remitted by the 9th of the following month\n- NSSF: remitted by the 15th of the following month\n- SHIF: remitted monthly",
          "Two dates to remember, per APSIS: the 9th of the following month for PAYE (filing and remitting), and the 15th of the following month for NSSF. SHIF is remitted monthly too."
        ],
        link: "/content/insights/payroll-tax-services-kenya.html", linkText: "Payroll services", caution: true
      },
      {
        id: "shif", label: "SHIF", next: "the payroll deadlines",
        nextId: "deadlines", button: "SHIF",
        s: ["shif", "nhif"],
        w: [],
        must: ["October 2024"],
        wordings: [
          "Per APSIS, SHIF replaced NHIF from October 2024 and is remitted monthly.",
          "From October 2024, per APSIS, SHIF replaced NHIF. It is remitted monthly.",
          "NHIF has been replaced by SHIF from October 2024, per APSIS, and SHIF is remitted monthly."
        ],
        link: "/content/insights/payroll-tax-services-kenya.html", linkText: "Payroll services", caution: true
      },
      {
        id: "penalty", label: "the late PAYE penalties", next: "director liability",
        nextId: "liability", button: "Late penalties", mood: "sad",
        s: ["penalty", "late", "fine"],
        w: ["interest"],
        must: ["10,000", "25%", "1%"],
        wordings: [
          "Late PAYE, per APSIS: Ksh 10,000 plus 25% of the PAYE not paid on time, with 1% monthly interest.",
          "Per APSIS, paying PAYE late means Ksh 10,000 plus 25% of the PAYE not paid on time, with 1% monthly interest.",
          "Late PAYE, per APSIS:\n- Ksh 10,000\n- Plus 25% of the PAYE not paid on time\n- With 1% monthly interest"
        ],
        link: "/content/insights/payroll-tax-services-kenya.html", linkText: "Payroll services", caution: true
      },
      {
        id: "liability", label: "director liability", next: "the payroll deadlines",
        nextId: "deadlines", button: "Director liability",
        s: ["director", "liable", "liability", "personally"],
        w: ["deduct"],
        must: ["PAYE"],
        wordings: [
          "Directors can be personally liable for PAYE deducted but not remitted.",
          "Per APSIS, directors can be personally liable for PAYE that was deducted but not remitted.",
          "A point worth knowing, per APSIS: PAYE deducted but not remitted can make directors personally liable."
        ],
        link: "/content/insights/payroll-tax-services-kenya.html", linkText: "Payroll services", caution: true
      }
    ]
  };

  /* ---------- Step 2: the picker ---------- */
  var rng = Math.random;           // tests can swap this for a fixed sequence
  var lastPick = {};               // pool name -> index used last time

  // Random item from a list, never the same one twice in a row
  function pick(pool, list) {
    if (!list || !list.length) return { i: -1, v: "" };
    var i = Math.floor(rng() * list.length);
    if (list.length > 1 && i === lastPick[pool]) {
      i = (i + 1 + Math.floor(rng() * (list.length - 1))) % list.length;
    }
    lastPick[pool] = i;
    return { i: i, v: list[i] };
  }

  // Build one answer for a fact: [opener] + wording + [closer]
  function compose(factId, topic) {
    topic = topic || VAT_TOPIC;
    var f = topic.facts.filter(function (x) { return x.id === factId; })[0];
    if (!f) return null;
    var w = pick(topic.id + ":" + f.id, f.wordings);
    var text = w.v;
    if (rng() < 0.6) text = pick(topic.id + ":openers", topic.openers).v + text;
    var offer = false;                       // true only when the closer really offers the next topic
    if (rng() < 0.7) {
      var c = pick(topic.id + ":closers", topic.closers).v;
      offer = c.indexOf("{next}") !== -1;
      text += "\n\n" + c.replace("{next}", f.next);
    }
    return { text: text, link: f.link, linkText: f.linkText, caution: !!f.caution, picked: w.i, offer: offer };
  }

  // Question for a vague message ("VAT")
  function clarify(topic) {
    topic = topic || VAT_TOPIC;
    return pick(topic.id + ":clarify", topic.clarify).v;
  }

  // Question when two facts match; a and b are fact labels
  function clarifyMulti(a, b, topic) {
    topic = topic || VAT_TOPIC;
    return pick(topic.id + ":multi", topic.clarifyMulti).v.replace("{a}", a).replace("{b}", b);
  }

  // Phrases made only of common words (who are you, how are you...) that keyword matching would skip
  var PATTERNS = [
    [/^(?!.*\b(vat|paye|payroll|nssf|shif|nhif|etims)\b).*\b(forgot|forgotten|forget|neglected|overlooked|failed to|fail to|didn'?t|did not|haven'?t|have not|hasn'?t|has not)\b.{0,14}\b(file|filed|filing|submit|submitted|submitting|lodge|lodged|returns?|pay|paid)\b/, "missed-deadline"],
    [/\b(you|u|ur|you're|youre)\b.{0,20}\b(stupid|idiot|dumb|useless|rubbish|worthless|garbage|moron)\b|\b(stupid|useless|dumb|rubbish) (bot|robot|chatbot)\b|\b(shut up|hate you)\b/, "rude"],
    [/\b(who|what) are you\b|\bare you (a |an )?(robot|bot|human|real|person|ai|machine|chatbot)\b|\byour name\b|\bwho am i (talking|chatting)\b/, "identity"],
    [/\bare you (still )?(there|awake|asleep|sleeping|alive)\b|\bwake up\b|\banyone (there|home)\b/, "awake"],
    [/\bhow are you\b|\bhow('s| is) it going\b|\bhow do you do\b/, "smalltalk"],
    [/^\s*(what (can|do) you (do|know|help( me)?( with)?)|how can you help( me)?|what can i ask( you)?|help)\s*[?!.]*\s*$/, "help"],
    // opening hours: "are you open today", "what time do you close", "open on saturday"...
    [/\b(are|is|do|does|will|when|what time)\b.{0,14}\b(you|u|apsis|your office|the office)\b.{0,14}\b(open|close|closing|closed)\b|\bopen\s+(now|today|tomorrow|tonight|on|at|this|late|early|still)\b|\b(opening|closing|working|office|business|operating) (hours|times?)\b|\bhours of operation\b|\bdo you (work|operate)\b.{0,15}\b(weekends?|saturdays?|sundays?|holidays?|today|tomorrow|late)\b/, "hours"],
    // time and date (anchored so "what is the time limit..." or "the date for filing..." don't match)
    [/\bwhat time is it\b|\bwhat('s| is) the (current |local )?time( now| right now| there| in nairobi| please)?\s*[?!.]*\s*$|\bcurrent (local )?time\b|\btime (is it )?(now|right now)\b|\b(got|have|know) the time\b/, "time"],
    [/\bwhat('s| is) (the )?(today'?s? )?date( today)?\s*[?!.]*\s*$|\btoday'?s date\b|\bwhat day (is it|is today|of the week)\b|\bwhich day (is it|is today)\b|\bwhat('s| is) today\s*[?!.]*\s*$|\bwhat (year|month) is it\b|\bdate today\b|\bis it (the )?weekend\b/, "date"],
    // the developer
    [/\bwho\b.{0,12}\b(built|made|created|developed|designed|programmed|coded|wrote|engineered|invented)\b.{0,20}\b(you|this|apsi|bot|chatbot|assistant|chat|widget)\b|\bwho('s| is| are| was)?( your| the| this| apsi'?s?)? (developer|creator|maker|programmer|builder|coder|engineer|author)\b|\bwho\b.{0,6}\bbehind (you|this|apsi)\b/, "creator"],
    [/\b(patrick|kiama)\b|\b(contact|reach|hire|email|message|connect with|talk to|speak to)\b.{0,20}\b(developer|creator|programmer|coder|builder)\b|\b(developer|creator|programmer)('s|s)? (contact|linkedin|email|profile|portfolio|github|details|info)\b|\bthe (developer|creator|programmer)\b/, "developer"],
    [/\bget in touch\b|\bcontact (details|info|information|us)\b|\b(contact|reach|call|phone|email|message|whatsapp|talk to|speak to)\b.{0,20}\b(you|u|apsis|someone|the team|a consultant|staff|the office)\b/, "contact"],
    // the team
    [/\bwho('s| is| are)?( the| your| apsis'?s?)? (director|boss|ceo|managing director|lead consultant)\b|\bwho (runs|leads|heads|manages) (apsis|the (firm|company|business)|this (firm|company))\b|\bwho('s| is) in charge\b/, "team-domisiano"],
    [/\bhow many (people|staff|employees|consultants|members|team members|accountants|advisors|advisers|directors|partners)\b|\bteam size\b|\bsize of (the |your )?team\b|\bhow big is (the |your )?(team|firm|company)\b/, "team-size"],
    [/\bwho (handles|handle|deals with|looks after|is responsible for)\b|\bwho should i (speak|talk) (to|with)\b|\bwhich (consultant|advisor|adviser|person|team member)\b/, "team-who"],
    [/\b(team|staff|firm'?s?) members?\b|\bmembers? of (the |your )?(team|firm|apsis|staff)\b|\bwho('s| is| are)?\b.{0,20}\b(members?|people|staff|consultants|accountants|advisors|advisers)\b|\bwho works (at|for|with|in)\b|\bmeet (the|your|our) (team|people|staff)\b|\bthe people behind\b/, "team"],
    // directions
    [/\bhow (do|can|should) (i|we) (get|find|come|go|travel)\b.{0,20}\b(office|apsis|you|there)\b|\bwhere('s| is| are)\b.{0,15}\b(office|apsis|located|based)\b|\bwhere (can i|do i) find you\b/, "address"],
    // contact extras and small talk
    [/\bhow (fast|quickly|soon|long)\b.{0,25}\b(reply|respond|response|get back|answer)\b|\b(response|reply) time\b|\bwhen will you (reply|respond|get back)\b|\bget back to me\b/, "response-time"],
    [/\bhow old are you\b|\bwhen were you (born|made|created)\b|\byour age\b/, "age"],
    [/\bwhere (are you from|do you (live|come from|stay))\b|\bwhere you from\b/, "home"]
  ];

  var STOP = {};
  ("a an the is are was were be been am do does did i you we my me to of for in on and or can could would should will how what whats your yours it its with at if our us please tell some any there this that when who which have has had get got from as by just need want like know").split(" ")
    .forEach(function (w) { STOP[w] = true; });

  // Keys are STEMMED forms. Both the KB keywords and the visitor's words pass through this,
  // so every word listed here is treated as the canonical one on both sides.
  var SYN = {
    fil: "file", submit: "file", submitt: "file", lodg: "file", lodge: "file",
    forgot: "miss", forget: "miss", forgett: "miss", forgotten: "miss",
    overlook: "miss", neglect: "miss"
    // add more as you see real questions, e.g. fine: "penalty"
  };
  function canon(t) { return Object.prototype.hasOwnProperty.call(SYN, t) ? SYN[t] : t; }

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
      .map(function (w) { return canon(stem(w)); });
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
    (e.k || []).forEach(function (kw) {
      var t = tokens(kw);
      if (!t.length) return;
      if (t.length === 1) e._single[t[0]] = true;
      else e._phrases.push(" " + t.join(" ") + " ");
    });
  });

  // Build vocabulary of every keyword stem in the KB for typo tolerance
  var VOCAB = Object.create(null), VOCAB_LIST = [];
  KB.forEach(function (e) {
    [e._single, e._strong, e._gen].forEach(function (m) {
      Object.keys(m).forEach(function (t) { VOCAB[t] = true; });
    });
    e._phrases.forEach(function (ph) {
      ph.trim().split(" ").forEach(function (t) { VOCAB[t] = true; });
    });
  });
  VOCAB_LIST = Object.keys(VOCAB);

  function within(a, b, max) {            // edit distance <= max ?
    if (Math.abs(a.length - b.length) > max) return false;
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length] <= max;
  }

  function snap(t) {                       // "etms" -> "etims", "vatt" -> "vat", "penalities" -> "penalty"
    if (VOCAB[t] || t.length < 4 || /\d/.test(t)) return t;
    var max = t.length >= 8 ? 2 : 1;
    for (var i = 0; i < VOCAB_LIST.length; i++) {
      var v = VOCAB_LIST[i];
      if (v[0] === t[0] && v.length >= 3 && within(t, v, max)) return v;   // same first letter: typos rarely change it
    }
    return t;
  }

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

  function rank(qt) {
    var padded = " " + qt.join(" ") + " ";
    return KB.map(function (e, i) { return { e: e, s: score(e, qt, padded), i: i }; })
      .filter(function (r) { return r.s >= 2; })
      .sort(function (a, b) { return b.s - a.s || a.i - b.i; });
  }

  function answer(query, prev) {
    // phone keyboards type curly apostrophes (didn't), which the patterns would miss
    var raw = String(query).toLowerCase().replace(/[\u2018\u2019]/g, "'");
    for (var p = 0; p < PATTERNS.length; p++) {
      if (PATTERNS[p][0].test(raw)) return { entry: byId(PATTERNS[p][1]), related: [], score: 99 };
    }
    var qt = tokens(query).map(snap);
    if (!qt.length) return null;
    var ranked = rank(qt);

    // Follow-up ("and the penalty?"): weak on its own -> borrow the previous topic's strong words
    if (prev && qt.length <= 4 && !(ranked.length && ranked[0].e.hidden) && (!ranked.length || ranked[0].s < 5)) {
      var prevWords = Object.keys(prev._strong);
      if (prevWords.length) {
        var again = rank(prevWords.concat(qt));
        if (again.length && again[0].s >= 7) ranked = again;
      }
    }

    if (!ranked.length) return null;
    var top = ranked[0];
    var related = ranked.slice(1).filter(function (r) { return !r.e.hidden && r.e.id !== top.e.id; })
      .slice(0, 2).map(function (r) { return r.e; });
    return { entry: top.e, related: related, score: top.s };
  }

  var SUGGESTIONS = ["services", "missed-deadline", "payroll", "fees", "contact"];

  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  /* ---------- Moods ----------
     Every entry gets a mood. Default is happy; these entries differ. */
  var MOOD = {
    "missed-deadline": "sad", "demand-notice": "sad",
    audit: "thinking", "advance-ruling": "thinking", "health-check": "thinking",
    rude: "angry"
  };
  KB.forEach(function (e) { e.mood = e.mood || MOOD[e.id] || "happy"; });
  byId("farewell").then = { mood: "sleepy", after: 5000 };   // drifts off after a goodbye

  // Visitor tone: react to how someone sounds, not only to what they ask
  var NEG = /\b(worried|worry|scared|afraid|stress(ed)?|panic\w*|overwhelm\w*|anxious|nervous|desperate|upset|frustrat\w*|annoy\w*|nightmare)\b/;
  var POS = /\b(love|loved|great|awesome|amazing|wonderful|perfect|brilliant|helpful|fantastic|excellent)\b/;
  function tone(q) {
    q = String(q).toLowerCase();
    return NEG.test(q) ? "neg" : POS.test(q) ? "pos" : null;
  }

  /* ---------- Live answers: time, date and opening hours ----------
     Nairobi is UTC+3 all year (Kenya has no daylight saving), so the clock is computed
     from UTC and works the same in every visitor's browser, wherever they are. */
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var OPEN_MIN = 8 * 60, CLOSE_MIN = 17 * 60;   // office hours: Monday to Friday, 8:00 AM to 5:00 PM

  function eat(date) {
    var t = new Date((date || new Date()).getTime() + 3 * 3600 * 1000);
    return {
      dow: t.getUTCDay(), mins: t.getUTCHours() * 60 + t.getUTCMinutes(),
      day: t.getUTCDate(), month: t.getUTCMonth(), year: t.getUTCFullYear()
    };
  }

  function fmt(mins) {
    var h = Math.floor(mins / 60) % 24, m = mins % 60;
    return ((h % 12) || 12) + ":" + (m < 10 ? "0" : "") + m + " " + (h >= 12 ? "PM" : "AM");
  }

  function span(mins) {
    var h = Math.floor(mins / 60), m = mins % 60, parts = [];
    if (h) parts.push(h + (h === 1 ? " hour" : " hours"));
    if (m || !h) parts.push(m + (m === 1 ? " minute" : " minutes"));
    return parts.join(" and ");
  }

  function isWorkday(dow) { return dow >= 1 && dow <= 5; }

  function hoursAnswer(query, date) {
    var q = String(query || "").toLowerCase(), n = eat(date);
    var hrs = fmt(OPEN_MIN) + " to " + fmt(CLOSE_MIN);
    var week = "Our office hours are Monday to Friday, " + hrs + " (Nairobi time).";
    var mail = " You can email info@apsis.co.ke any time and we'll reply within one business day.";
    var hol = " Public holidays may differ, so please call to confirm.";

    // which day is the visitor asking about? default is today
    var tomorrow = /\btomorrow\b/.test(q), target = null;
    if (tomorrow) target = (n.dow + 1) % 7;
    else DAYS.forEach(function (d, i) {
      var low = d.toLowerCase();
      if (new RegExp("\\b" + low.slice(0, 3) + "(" + low.slice(3) + ")?s?\\b").test(q)) target = i;
    });

    if (target === null && /\bweekends?\b/.test(q)) {
      return { mood: "sad", text: "We're closed on weekends (Saturday and Sunday). " + week + mail };
    }

    if (target !== null && target !== n.dow) {
      var when = tomorrow ? "tomorrow (" + DAYS[target] + ")" : "on " + DAYS[target] + "s";
      if (isWorkday(target)) return { mood: "happy", text: "Yes, we're open " + when + ", " + hrs + " (Nairobi time)." + hol };
      return { mood: "sad", text: "No, we're closed " + when + ". " + week + " We open again on Monday at " + fmt(OPEN_MIN) + "." + mail };
    }

    // today
    if (isWorkday(n.dow)) {
      if (n.mins >= OPEN_MIN && n.mins < CLOSE_MIN) {
        return { mood: "happy", text: "Yes, we're open right now! Today's hours are " + hrs + " (Nairobi time), so we close in " + span(CLOSE_MIN - n.mins) + ". Call or WhatsApp +254 722 670 127." + hol };
      }
      if (n.mins < OPEN_MIN) {
        return { mood: "sad", text: "Not yet. We open today at " + fmt(OPEN_MIN) + " (Nairobi time), in " + span(OPEN_MIN - n.mins) + "." + mail };
      }
      return { mood: "sad", text: "We've closed for today (office hours end at " + fmt(CLOSE_MIN) + " Nairobi time). We open again " + (n.dow === 5 ? "on Monday" : "tomorrow") + " at " + fmt(OPEN_MIN) + "." + mail };
    }
    return { mood: "sad", text: "We're closed today (" + DAYS[n.dow] + "). " + week + " We open again on Monday at " + fmt(OPEN_MIN) + "." + mail };
  }

  function clockAnswer(date) {
    var d = date || new Date(), n = eat(d);
    var text = "It's " + fmt(n.mins) + " in Nairobi (EAT) right now.";
    if (d.getTimezoneOffset() !== -180) text += " Your device's clock shows " + fmt(d.getHours() * 60 + d.getMinutes()) + ".";
    return { mood: "happy", text: text };
  }

  function dateAnswer(date) {
    var n = eat(date);
    var text = "Today is " + DAYS[n.dow] + ", " + n.day + " " + MONTHS[n.month] + " " + n.year + " (Nairobi time).";
    text += isWorkday(n.dow)
      ? " It's a weekday, so our office is open " + fmt(OPEN_MIN) + " to " + fmt(CLOSE_MIN) + "."
      : " It's the weekend, so our office is closed until Monday at " + fmt(OPEN_MIN) + ".";
    return { mood: "happy", text: text };
  }

  /* ---------- Step 6: the topic engine ----------
     A topic is plain data (see VAT_TOPIC). To add one: write its data block, call
     addTopic(...) below, run the tests. There is no router code to change. */
  var TOPICS = [];

  var FEE_WORDS = ["price", "cost", "fee", "charge", "quote", "much", "pricing", "cheap", "affordable"];
  var SEQ_LINES = ["Shall I go on to {x}?", "Want {x} next?", "Ready for {x}?"];
  var DONE_LINES = ["No problem! Ask me anything else about our services whenever you like.", "Sure thing. I'm here if you have more questions."];
  var YES_NO = [
    { label: "Yes", send: "Yes", mood: "happy" },
    { label: "No thanks", send: "No thanks", mood: "sad" }
  ];
  var CAN_YOU = /\b(can|could|will|do|does)\s+(you|u|apsis)\b/;

  function wordSet(words) {
    var o = {};
    words.forEach(function (w) { tokens(w).forEach(function (t) { o[t] = true; }); });
    return o;
  }
  var FEES = wordSet(FEE_WORDS);

  function addVocab(t) { if (!VOCAB[t]) { VOCAB[t] = true; VOCAB_LIST.push(t); } }   // teaches the typo-snapper

  function addTopic(t) {
    t._words = wordSet(t.words);
    t._aside = wordSet(t.stepAside || []);
    Object.keys(t._words).forEach(addVocab);
    t.facts.forEach(function (f) {
      f._s = wordSet(f.s || []);
      f._w = wordSet(f.w || []);
      Object.keys(f._s).concat(Object.keys(f._w)).forEach(addVocab);
    });
    TOPICS.push(t);
  }
  addTopic(VAT_TOPIC);
  // addTopic(PAYROLL_TOPIC);   // OFF until every payroll figure is verified against the APSIS pages

  // What the engine remembers between messages (a question lives for one turn only)
  var ctx = { topic: null, pending: null };
  function routeReset() { ctx.topic = null; ctx.pending = null; }

  function factOf(t, id) { return t.facts.filter(function (f) { return f.id === id; })[0]; }

  function mentions(t, qt, raw) {
    return qt.some(function (x) { return t._words[x]; }) || !!(t.phrase && t.phrase.test(raw));
  }

  function hitsFor(t, qt) {
    var h = { s: {}, w: {}, strongIds: [] };
    t.facts.forEach(function (f) {
      var seen = {}, s = 0, w = 0;
      qt.forEach(function (x) {
        if (seen[x]) return;
        seen[x] = true;
        if (f._s[x]) s++; else if (f._w[x]) w++;
      });
      h.s[f.id] = s; h.w[f.id] = w;
      if (s) h.strongIds.push(f.id);
    });
    return h;
  }

  function bestWeak(h) {
    var max = 0, ids = [];
    Object.keys(h.w).forEach(function (id) {
      if (h.w[id] > max) { max = h.w[id]; ids = [id]; }
      else if (h.w[id] === max && max > 0) ids.push(id);
    });
    return ids;
  }

  // Several facts in one reply: [opener] + wording + wording... (no closer)
  function multiAnswer(t, ids) {
    var parts = [], seen = {}, links = [], caution = false;
    ids.forEach(function (id) {
      var f = factOf(t, id);
      parts.push(pick(t.id + ":" + id, f.wordings).v);
      if (!seen[f.link]) { seen[f.link] = true; links.push([f.link, f.linkText]); }
      if (f.caution) caution = true;
    });
    var text = parts.join("\n\n");
    if (rng() < 0.6) text = pick(t.id + ":openers", t.openers).v + text;
    return { text: text, link: links[0][0], linkText: links[0][1], more: links.slice(1), caution: caution };
  }

  function answerFacts(t, ids, then) {
    var out = (ids.length === 1 && !then) ? compose(ids[0], t) : multiAnswer(t, ids);
    out.more = out.more || [];
    var first = factOf(t, ids[0]);
    if (then && then.length) {                         // "one at a time": offer the next one
      out.text += "\n\n" + pick(t.id + ":seq", SEQ_LINES).v.replace("{x}", factOf(t, then[0]).label);
      ctx.pending = { topic: t, type: "next", options: [then[0]] };
      out.options = YES_NO;
    } else if (ids.length === 1 && first.nextId) {
      ctx.pending = { topic: t, type: "next", options: [first.nextId] };   // a typed "yes" always works
      if (out.offer) out.options = YES_NO;                                  // buttons only when an offer was made
    }
    ctx.topic = t;
    out.kind = "answer";
    out.mood = ids.some(function (id) { return factOf(t, id).mood === "sad"; }) ? "sad" : "happy";
    return out;
  }

  // "I missed my deadline": the fact, then a push to contact APSIS
  function missedAnswer(t) {
    var m = t.missed, f = factOf(t, m.fact);
    ctx.topic = t;
    return {
      kind: "answer", mood: "sad", caution: true,
      text: pick(t.id + ":" + f.id, f.wordings).v + "\n\n" + pick(t.id + ":contact", m.contact).v,
      link: "/contact.html", linkText: "Contact the APSIS team",
      more: [[f.link, f.linkText]]
    };
  }

  function askFor(t, kind, ids) {
    var text = kind === "multi"
      ? clarifyMulti(factOf(t, ids[0]).label, factOf(t, ids[1]).label, t)
      : clarify(t);
    ctx.pending = { topic: t, type: kind, options: ids };
    ctx.topic = t;
    // each button's `send` text is understood by resolve(), exactly as if the visitor typed it
    var options = kind === "multi"
      ? [{ label: "Both together", send: "Both together" }, { label: "One at a time", send: "One at a time" }]
      : ids.map(function (id) { var b = factOf(t, id).button; return { label: b, send: b }; });
    return { kind: "ask", mood: "thinking", text: text, options: options };
  }

  // Did the visitor's message answer the question Apsi just asked?
  function resolve(t, raw, qt, pending) {
    var opts = pending.options;
    if (pending.type === "next") {
      if (/^\s*(yes|yeah|yep|yup|sure|ok|okay|please|go ahead|go on|y|sounds good|why not|definitely)\b/.test(raw)) return { ids: opts };
      if (/^\s*(no|nope|nah|no thanks|no thank you|not now|that'?s all|i'?m good|im good)\s*[.!]*\s*$/.test(raw)) return { done: true };
      return null;
    }
    if (/\bone (at a time|by one)\b|\bseparately\b|\bstep by step\b/.test(raw)) return { ids: [opts[0]], then: opts.slice(1) };
    if (/\b(both|together|everything|all of (them|it)|all three)\b/.test(raw)) return { ids: opts };
    if (/\b(first|1st)\b|^\s*1\s*$/.test(raw)) return { ids: [opts[0]] };
    if ((/\b(second|2nd)\b|^\s*2\s*$/.test(raw)) && opts[1]) return { ids: [opts[1]] };
    if ((/\b(third|3rd)\b|^\s*3\s*$/.test(raw)) && opts[2]) return { ids: [opts[2]] };
    if (/\blast\b/.test(raw)) return { ids: [opts[opts.length - 1]] };
    var h = hitsFor(t, qt);
    var picks = opts.filter(function (id) { return h.s[id] > 0 || h.w[id] > 0; });
    return picks.length ? { ids: picks } : null;
  }

  // The router. Returns null when the message is not for any topic.
  function routeReply(query) {
    var raw = String(query).toLowerCase().replace(/[\u2018\u2019]/g, "'");
    var qt = tokens(raw).map(snap);
    var pending = ctx.pending;
    ctx.pending = null;

    if (pending) {
      var r = resolve(pending.topic, raw, qt, pending);
      if (r && r.done) return { kind: "text", mood: "happy", text: pick(pending.topic.id + ":done", DONE_LINES).v };
      if (r && r.ids) return answerFacts(pending.topic, r.ids, r.then);
    }

    var named = TOPICS.filter(function (t) { return mentions(t, qt, raw); });
    if (named.length > 1) { ctx.topic = null; return null; }      // two topics in one message: the old system handles it
    var t = named[0] || null, explicit = !!t;
    if (!t && ctx.topic) {                                        // "and the penalty?" right after an answer
      var h0 = hitsFor(ctx.topic, qt);
      if (qt.length > 0 && qt.length <= 4 && (h0.strongIds.length || bestWeak(h0).length)) t = ctx.topic;
    }
    if (!t) { ctx.topic = null; return null; }

    var h = hitsFor(t, qt), weak = bestWeak(h);
    var aside = qt.some(function (x) { return t._aside[x]; });
    var fees = qt.some(function (x) { return FEES[x]; }) && !(t.feeExempt && h.s[t.feeExempt]);
    if (aside || fees) { ctx.topic = null; return null; }         // the older KB entries answer these better

    var m = t.missed;
    if (explicit && m && m.re.test(raw) && !(m.unless && h.s[m.unless])) return missedAnswer(t);

    var sIds = h.strongIds;
    if (sIds.length === 1) return answerFacts(t, sIds);
    if (sIds.length === 2) return askFor(t, "multi", sIds);
    if (sIds.length >= 3) return askFor(t, "vague", t.vague);
    if (t.canYou && CAN_YOU.test(raw)) return answerFacts(t, [t.canYou]);
    if (weak.length === 1) return answerFacts(t, weak);
    return askFor(t, "vague", t.vague);
  }

  /* ---------- Step 5: streaming plan (pure, so it can be tested in Node) ---------- */
  var STREAM_MAX = 3000;     // a reply never takes longer than this (ms)
  var STREAM_UNIT = 45;      // ms per word on short replies

  // How long to pause after this chunk (1 = a normal word)
  function chunkWeight(c, next) {
    var w = 1;
    if (/[.!?]["')\]]?$/.test(c)) w += 3;            // end of a sentence
    else if (/[,;:]$/.test(c)) w += 1.2;             // comma, semicolon, colon
    if (next && /^\s*\n\s*\n/.test(next)) w += 2.5;  // paragraph break comes next
    else if (next && /^\s*\n/.test(next)) w += 1;    // line break comes next
    return w;
  }

  // Splits a reply into word chunks (keeping spaces and line breaks) and
  // decides when each chunk appears, in ms from the start.
  function streamPlan(text, jitter) {
    jitter = jitter || function () { return 0.8 + Math.random() * 0.4; };
    text = String(text);
    var chunks = text.match(/\s*\S+/g) || [text];
    var joined = chunks.join("");
    if (joined.length < text.length) chunks[chunks.length - 1] += text.slice(joined.length);

    var weights = chunks.map(function (c, i) { return chunkWeight(c, chunks[i + 1]); });
    var total = weights.reduce(function (a, b) { return a + b; }, 0);
    var unit = Math.min(STREAM_UNIT, STREAM_MAX / total);

    var times = [], acc = 0;
    weights.forEach(function (w) { times.push(acc); acc += unit * w * jitter(); });
    var last = times[times.length - 1];
    if (last > STREAM_MAX) {                          // jitter pushed it over: squeeze back to the cap
      var k = STREAM_MAX / last;
      times = times.map(function (x) { return x * k; });
    }
    return { chunks: chunks, times: times };
  }

  // Expose the engine for testing (Node) and stop if there is no page
  var api = {
    KB: KB, answer: answer, tokens: tokens, tone: tone,
    hoursAnswer: hoursAnswer, clockAnswer: clockAnswer, dateAnswer: dateAnswer,
    VAT_TOPIC: VAT_TOPIC, PAYROLL_TOPIC: PAYROLL_TOPIC, compose: compose, clarify: clarify, clarifyMulti: clarifyMulti,
    TOPICS: TOPICS, addTopic: addTopic, routeReply: routeReply, routeReset: routeReset,
    vatReply: routeReply, vatReset: routeReset,       // the old names, so your earlier tests keep working
    streamPlan: streamPlan
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  /* ---------- Face ---------- */
  var reduceMotion = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);

  var FACE =
    '<svg class="apsis-face" viewBox="0 0 48 48" aria-hidden="true" focusable="false" data-mood="happy">' +
    '<g class="zz"><text x="36" y="11">z</text><text x="40.5" y="7">Z</text></g>' +
    '<g class="dots"><circle cx="39" cy="8" r="1.3"/><circle cx="42" cy="5.5" r="1.3"/><circle cx="45" cy="3" r="1.3"/></g>' +
    '<g class="head">' +
    '<line x1="24" y1="4" x2="24" y2="11" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' +
    '<circle class="bulb" cx="24" cy="4" r="2.8"/>' +
    '<rect x="3" y="21" width="5" height="11" rx="2.5" fill="#fff"/>' +
    '<rect x="40" y="21" width="5" height="11" rx="2.5" fill="#fff"/>' +
    '<rect class="shell" x="8" y="11" width="32" height="28" rx="10" fill="#fff"/>' +
    '<rect x="12" y="16" width="24" height="18" rx="7" fill="#0d2137"/>' +
    '<circle class="blush" cx="14.8" cy="28.8" r="1.7"/><circle class="blush" cx="33.2" cy="28.8" r="1.7"/>' +
    '<line class="brow bl" x1="15.5" y1="18.7" x2="22.5" y2="18.7"/>' +
    '<line class="brow br" x1="25.5" y1="18.7" x2="32.5" y2="18.7"/>' +
    '<g class="eyes">' +
    '<g class="blinker"><circle class="eye" cx="19" cy="24" r="3.2"/><circle class="eye" cx="29" cy="24" r="3.2"/></g>' +
    '<rect class="lid" x="15.2" y="20.4" width="7.6" height="0" fill="#0d2137"/>' +
    '<rect class="lid" x="25.2" y="20.4" width="7.6" height="0" fill="#0d2137"/>' +
    '</g>' +
    '<path class="mouth m-happy" d="M18.5 29 Q24 34.5 29.5 29"/>' +
    '<path class="mouth m-sad" d="M19 32 Q24 28.4 29 32"/>' +
    '<path class="mouth m-angry" d="M19 31 L21.5 29.6 L24 31 L26.5 29.6 L29 31"/>' +
    '<path class="mouth m-think" d="M20 30.6 Q22 29 24 30.6 T28 30.6"/>' +
    '<ellipse class="mouth m-sleepy" cx="24" cy="30.8" rx="1.9" ry="2.2"/>' +
    '<path class="tear" d="M31.6 27.4 Q30.2 29.4 31.6 30.4 Q33 29.4 31.6 27.4Z"/>' +
    '</g>' +
    '<rect x="16" y="41" width="16" height="4.5" rx="2.25" fill="#fff" opacity=".85"/>' +
    '</svg>';

  // Per-mood pose: eyelid closure (0-1), head tilt in degrees, head drop
  var POSE = {
    happy: { lid: 0, tilt: 0, drop: 0 },
    sad: { lid: 0.28, tilt: -7, drop: 0.8 },
    angry: { lid: 0.3, tilt: 3, drop: 0 },
    thinking: { lid: 0.05, tilt: 7, drop: 0 },
    sleepy: { lid: 0.62, tilt: 9, drop: 1.6 }
  };

  var css = [
    "#apsis-chat,#apsis-chat-btn,#apsis-teaser{--a-navy:#0d2137;--a-navy2:#17426f;--a-cyan:#5fd0ff;font-family:inherit}",
    "#apsis-chat-btn{position:fixed;right:20px;bottom:20px;width:64px;height:64px;border-radius:50%;border:0;padding:0;background:linear-gradient(145deg,var(--a-navy2),var(--a-navy));cursor:pointer;box-shadow:0 6px 20px rgba(13,33,55,.45);z-index:9998;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .35s}",
    "#apsis-chat-btn:hover{transform:scale(1.07)}",
    "#apsis-chat-btn svg{width:42px;height:42px}",
    "#apsis-chat-btn[data-mood=happy]{box-shadow:0 6px 22px rgba(95,208,255,.45)}",
    "#apsis-chat-btn[data-mood=sad]{box-shadow:0 6px 22px rgba(127,168,255,.5)}",
    "#apsis-chat-btn[data-mood=angry]{box-shadow:0 6px 22px rgba(255,107,95,.55)}",
    "#apsis-chat-btn[data-mood=thinking]{box-shadow:0 6px 22px rgba(255,209,102,.5)}",
    "#apsis-chat-btn::after{content:'';position:absolute;inset:0;border-radius:50%;border:2px solid var(--a-cyan);opacity:0;animation:apsis-pulse 3s ease-out 2s 3}",
    "@keyframes apsis-pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.55);opacity:0}}",
    "@keyframes apsis-pop{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}",
    "@keyframes apsis-dot{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-4px);opacity:1}}",

    /* face */
    ".apsis-face{color:#5fd0ff;transition:color .3s;overflow:visible}",
    ".apsis-face[data-mood=sad]{color:#7fa8ff}",
    ".apsis-face[data-mood=angry]{color:#ff6b5f}",
    ".apsis-face[data-mood=thinking]{color:#ffd166}",
    ".apsis-face[data-mood=sleepy]{color:#8fb4d9}",
    ".apsis-face .eye,.apsis-face .bulb{fill:currentColor}",
    ".apsis-face .shell{transition:fill .35s}",
    ".apsis-face[data-mood=sad] .shell{fill:#e4eefc}",
    ".apsis-face[data-mood=angry] .shell{fill:#ffe3df}",
    ".apsis-face[data-mood=sleepy] .shell{fill:#eef2f7}",
    ".apsis-face .blinker{transform-box:fill-box;transform-origin:center}",
    ".apsis-face .blinker.blink{animation:apsis-blinkk .18s ease-in-out}",
    ".apsis-face .blinker.blink.slow{animation-duration:.7s}",
    "@keyframes apsis-blinkk{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.08)}}",
    ".apsis-face .mouth{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:0;transition:opacity .25s}",
    ".apsis-face[data-mood=happy] .m-happy,.apsis-face[data-mood=sad] .m-sad,.apsis-face[data-mood=angry] .m-angry,.apsis-face[data-mood=thinking] .m-think,.apsis-face[data-mood=sleepy] .m-sleepy{opacity:1}",
    ".apsis-face .brow{stroke:currentColor;stroke-width:1.8;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:center;transition:transform .35s,opacity .3s}",
    ".apsis-face[data-mood=angry] .bl{opacity:1;transform:rotate(18deg)}",
    ".apsis-face[data-mood=angry] .br{opacity:1;transform:rotate(-18deg)}",
    ".apsis-face[data-mood=sad] .bl{opacity:1;transform:rotate(-16deg)}",
    ".apsis-face[data-mood=sad] .br{opacity:1;transform:rotate(16deg)}",
    ".apsis-face[data-mood=thinking] .br{opacity:1;transform:translateY(-1.6px) rotate(-6deg)}",
    ".apsis-face .blush{fill:#ff9fb0;opacity:0;transition:opacity .3s}",
    ".apsis-face[data-mood=happy] .blush{opacity:.5}",
    ".apsis-face .bulb{animation:apsis-glow 2.6s ease-in-out infinite}",
    ".apsis-face[data-mood=thinking] .bulb{animation-duration:.7s}",
    ".apsis-face[data-mood=sleepy] .bulb{animation:none;opacity:.35}",
    "@keyframes apsis-glow{0%,100%{opacity:.65}50%{opacity:1}}",
    ".apsis-face .zz text{font:700 6px Arial,sans-serif;fill:#fff;opacity:0}",
    ".apsis-face[data-mood=sleepy] .zz text{animation:apsis-z 2.4s ease-out infinite}",
    ".apsis-face[data-mood=sleepy] .zz text:nth-child(2){animation-delay:1.2s}",
    "@keyframes apsis-z{0%{opacity:0;transform:translate(0,2px)}30%{opacity:.9}100%{opacity:0;transform:translate(4px,-5px)}}",
    ".apsis-face .dots circle{fill:#fff;opacity:0}",
    ".apsis-face[data-mood=thinking] .dots circle{animation:apsis-dots 1.2s ease-in-out infinite}",
    ".apsis-face[data-mood=thinking] .dots circle:nth-child(2){animation-delay:.2s}",
    ".apsis-face[data-mood=thinking] .dots circle:nth-child(3){animation-delay:.4s}",
    "@keyframes apsis-dots{0%,100%{opacity:.2}50%{opacity:1}}",
    ".apsis-face .tear{fill:#8ecbff;opacity:0}",
    ".apsis-face[data-mood=sad] .tear{animation:apsis-tear 2.6s ease-in infinite}",
    "@keyframes apsis-tear{0%{opacity:0;transform:translateY(0)}20%{opacity:.9}100%{opacity:0;transform:translateY(4px)}}",
    ".apsis-face[data-mood=sleepy] .m-sleepy{transform-box:fill-box;transform-origin:center;animation:apsis-breathe 3s ease-in-out infinite}",
    "@keyframes apsis-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.35)}}",
    ".apsis-face.fx-bounce{animation:apsis-bounce .55s ease}",
    ".apsis-face.fx-shake{animation:apsis-shake .42s ease}",
    "@keyframes apsis-bounce{0%,100%{transform:translateY(0)}35%{transform:translateY(-4px)}65%{transform:translateY(0)}80%{transform:translateY(-1.5px)}}",
    "@keyframes apsis-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-2.5px)}40%{transform:translateX(2.5px)}60%{transform:translateX(-2px)}80%{transform:translateX(1.5px)}}",

    /* teaser + panel */
    "#apsis-teaser{position:fixed;right:20px;bottom:94px;max-width:240px;background:#fff;color:#1a1a1a;border-radius:14px 14px 4px 14px;box-shadow:0 6px 24px rgba(0,0,0,.2);padding:11px 30px 11px 13px;font-size:14px;line-height:1.4;cursor:pointer;z-index:9997;display:none;animation:apsis-pop .35s ease}",
    "#apsis-teaser.show{display:block}",
    "#apsis-teaser button{position:absolute;top:3px;right:6px;border:0;background:none;font-size:18px;color:#778;cursor:pointer;line-height:1}",
    "#apsis-chat{position:fixed;right:20px;bottom:96px;width:360px;max-width:calc(100vw - 24px);height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:18px;box-shadow:0 12px 40px rgba(13,33,55,.35);display:none;flex-direction:column;overflow:hidden;z-index:9999}",
    "#apsis-chat.open{display:flex;animation:apsis-pop .25s ease}",
    "#apsis-chat header{background:linear-gradient(135deg,var(--a-navy2),var(--a-navy));color:#fff;padding:12px 14px;display:flex;align-items:center;gap:11px}",
    ".apsis-av{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;flex:none}",
    ".apsis-av svg{width:32px;height:32px}",
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
    ".apsis-opts{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}",
    ".apsis-opts button{border:1px solid var(--a-navy2);background:#fff;color:var(--a-navy);border-radius:16px;padding:7px 13px;font-size:13px;cursor:pointer;font-family:inherit;transition:background .15s,color .15s}",
    ".apsis-opts button:hover,.apsis-opts button:focus-visible{background:var(--a-navy);color:#fff}",
    "#apsis-note{font-size:11px;color:#667;padding:6px 12px;background:#fff;border-top:1px solid #e3e8ef}",
    "#apsis-form{display:flex;border-top:1px solid #e3e8ef;background:#fff}",
    "#apsis-input{flex:1;border:0;padding:14px;font-size:14px;outline:none;font-family:inherit;background:transparent}",
    "#apsis-form button{border:0;background:var(--a-navy);color:#fff;padding:0 18px;cursor:pointer;font-weight:600;font-family:inherit}",
    "#apsis-form button:hover{background:var(--a-navy2)}",
    "#apsis-chat button:focus-visible,#apsis-chat-btn:focus-visible,#apsis-input:focus-visible{outline:2px solid var(--a-cyan);outline-offset:-2px}",
    "@media (max-width:480px),(max-height:520px){" +
    "#apsis-chat{left:0;right:0;width:100%;max-width:100%;border-radius:0;top:var(--apsis-top,0px);bottom:auto;height:var(--apsis-h,100dvh);max-height:none}" +
    "#apsis-chat.open ~ #apsis-chat-btn,#apsis-chat-btn.apsis-hide{display:none}" +
    "#apsis-chat header{padding:calc(12px + env(safe-area-inset-top,0px)) 14px 12px}" +
    "#apsis-chat header button{font-size:30px;padding:6px 12px}" +
    "#apsis-msgs{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}" +
    "#apsis-input{font-size:16px}" +
    "#apsis-form{padding-bottom:env(safe-area-inset-bottom,0px)}" +
    "#apsis-form button{padding:0 22px}" +
    "#apsis-teaser{right:12px;bottom:92px;max-width:calc(100vw - 90px)}" +
    "}",
    "@media (prefers-reduced-motion:reduce){#apsis-chat-btn::after,.apsis-m,#apsis-chat.open,#apsis-teaser{animation:none}.apsis-typing i{animation:none;opacity:.7}.apsis-face,.apsis-face *{animation:none!important;transition:none!important}.apsis-face[data-mood=sleepy] .zz text,.apsis-face[data-mood=thinking] .dots circle,.apsis-face[data-mood=sad] .tear{opacity:.9}}"
  ].join("\n");

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.id = "apsis-chat-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Chat with Apsi, the APSIS virtual assistant");

  var teaser = document.createElement("div");
  teaser.id = "apsis-teaser";
  teaser.innerHTML = '<span>Hi, I’m Apsi! Ask me about KRA, VAT or payroll.</span><button type="button" aria-label="Dismiss">&times;</button>';

  var panel = document.createElement("div");
  panel.id = "apsis-chat";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat with Apsi");
  panel.innerHTML =
    '<header><div class="apsis-av"></div>' +
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
  var lastEntry = null;
  var rudeN = 0;

  /* ---------- Face controller ---------- */
  var faces = [];
  var mood = "happy";
  var sleepSource = null;          // "idle" wakes on any movement; "bye" only when the visitor engages
  var mx = null, my = null, lastMove = 0;
  var lastActive = performance.now();
  var typing_ = false, typingT = null, settleT = null;
  var wander = { x: 0, y: 0, next: 0 };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function mountFace(host, isHeader) {
    host.innerHTML = FACE;
    var svg = host.firstChild;
    var f = {
      host: host, svg: svg, isHeader: isHeader,
      head: svg.querySelector(".head"),
      eyes: svg.querySelector(".eyes"),
      blinker: svg.querySelector(".blinker"),
      lids: svg.querySelectorAll(".lid"),
      gx: 0, gy: 0, tilt: 0, drop: 0, lid: 0, widen: 1,
      sE: "", sH: "", sL: ""
    };
    f.blinker.addEventListener("animationend", function () { f.blinker.classList.remove("blink", "slow"); });
    faces.push(f);
    scheduleBlink(f);
    return f;
  }

  function fx(f, cls) {
    if (reduceMotion) return;
    f.svg.classList.remove("fx-bounce", "fx-shake");
    void f.svg.getBoundingClientRect();
    f.svg.classList.add(cls);
  }

  function blink(f, slow) {
    if (reduceMotion) return;
    var b = f.blinker;
    b.classList.remove("blink", "slow");
    void b.getBoundingClientRect();
    b.classList.add("blink");
    if (slow) b.classList.add("slow");
  }

  function scheduleBlink(f) {
    var sleepy = mood === "sleepy";
    setTimeout(function () {
      var s = mood === "sleepy";
      blink(f, s);
      if (!s && Math.random() < 0.2) setTimeout(function () { blink(f, false); }, 260);
      scheduleBlink(f);
    }, sleepy ? rnd(1500, 3300) : rnd(2200, 5700));
  }

  function setMood(m, source) {
    if (!POSE[m]) m = "happy";
    var changed = m !== mood;
    mood = m;
    sleepSource = m === "sleepy" ? (source || "idle") : null;
    faces.forEach(function (f) {
      f.svg.setAttribute("data-mood", m);
      if (changed) {
        if (m === "angry") fx(f, "fx-shake");
        else if (m === "happy") fx(f, "fx-bounce");
      }
    });
    btn.setAttribute("data-mood", m);
  }

  function wake() { if (mood === "sleepy") setMood("happy"); }

  // Called on any visitor activity. kind "direct" = they engaged with Apsi itself.
  function activity(kind) {
    lastActive = performance.now();
    if (mood === "sleepy" && (sleepSource === "idle" || kind === "direct")) wake();
  }

  function frame(t) {
    if (!reduceMotion && t > wander.next) {
      wander.x = rnd(-1.6, 1.6);
      wander.y = rnd(-1, 1);
      wander.next = t + rnd(2200, 5200);
    }
    var P = POSE[mood];
    var panelOpen = panel.classList.contains("open");

    faces.forEach(function (f) {
      if (f.isHeader && !panelOpen) return;
      var tgx = 0, tgy = 0, tilt = P.tilt, widen = 1;

      if (!reduceMotion) {
        var r = f.host.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var haveCursor = mx !== null && (t - lastMove) < 6000;

        if (mood === "thinking") {            // glances up and around while "thinking"
          tgx = Math.sin(t / 650) * 2.2; tgy = -1.5;
        } else if (mood === "sleepy") {       // eyes drift lazily
          tgx = Math.sin(t / 2200) * 0.6; tgy = 1.3;
        } else if (typing_ && f.isHeader) {   // looks down at the visitor's message box
          tgx = 0; tgy = 1.7;
        } else if (haveCursor) {              // follows the cursor
          var dx = mx - cx, dy = my - cy;
          var d = Math.hypot(dx, dy) || 1;
          var n = Math.min(1, d / 200);
          tgx = dx / d * n * 2.6;
          tgy = dy / d * n * 1.7;
          tilt += clamp(dx / 320, -1, 1) * 5;  // head leans toward the cursor
          if (!f.isHeader && d < 90) widen = 1.18; // eyes widen when the cursor is close
        } else {                              // cursor idle or away: look around
          tgx = wander.x; tgy = wander.y;
        }
      }

      var k = 0.14;
      f.gx += (tgx - f.gx) * k;
      f.gy += (tgy - f.gy) * k;
      f.tilt += (tilt - f.tilt) * 0.1;
      f.drop += (P.drop - f.drop) * 0.1;
      f.lid += (P.lid - f.lid) * 0.15;
      f.widen += (widen - f.widen) * 0.2;

      var sE = "translate(" + f.gx.toFixed(2) + " " + f.gy.toFixed(2) + ") translate(24 24) scale(" + f.widen.toFixed(3) + ") translate(-24 -24)";
      if (sE !== f.sE) { f.eyes.setAttribute("transform", sE); f.sE = sE; }
      var sH = "translate(0 " + f.drop.toFixed(2) + ") rotate(" + f.tilt.toFixed(2) + " 24 40)";
      if (sH !== f.sH) { f.head.setAttribute("transform", sH); f.sH = sH; }
      var sL = (f.lid * 7.2).toFixed(2);
      if (sL !== f.sL) { f.lids[0].setAttribute("height", sL); f.lids[1].setAttribute("height", sL); f.sL = sL; }
    });
    root.requestAnimationFrame(frame);
  }

  var btnFace = mountFace(btn, false);
  var headFace = mountFace(panel.querySelector(".apsis-av"), true);
  btn.setAttribute("data-mood", "happy");
  // Keep the panel inside the visible area (address bar, keyboard) on phones
  if (root.visualViewport) {
    var vv = root.visualViewport;
    var fit = function () {
      panel.style.setProperty("--apsis-h", vv.height + "px");
      panel.style.setProperty("--apsis-top", vv.offsetTop + "px");
      if (panel.classList.contains("open")) scroll();
    };
    vv.addEventListener("resize", fit);
    vv.addEventListener("scroll", fit);
    fit();
  }

  document.addEventListener("mousemove", function (e) {
    mx = e.clientX; my = e.clientY; lastMove = performance.now();
    activity("move");
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", function () { mx = null; });
  ["keydown", "scroll", "touchstart", "pointerdown"].forEach(function (ev) {
    document.addEventListener(ev, function () { activity("move"); }, { passive: true, capture: true });
  });
  btn.addEventListener("pointerenter", function () {
    activity("direct");
    if (mood === "happy") fx(btnFace, "fx-bounce");
  });
  panel.addEventListener("pointerdown", function () { activity("direct"); });
  panel.addEventListener("keydown", function () { activity("direct"); });

  input.addEventListener("input", function () {
    activity("direct");
    typing_ = true;
    clearTimeout(typingT);
    typingT = setTimeout(function () { typing_ = false; }, 1400);
  });

  // Falls asleep after a while with no activity
  setInterval(function () {
    if (mood !== "sleepy" && !busy && performance.now() - lastActive > 40000) setMood("sleepy", "idle");
  }, 2000);

  // Wakes up with a stretch on page load
  if (!reduceMotion) {
    setMood("sleepy", "idle");
    setTimeout(function () { if (mood === "sleepy" && sleepSource === "idle") setMood("happy"); }, 1300);
  }
  if (!reduceMotion) root.requestAnimationFrame(frame);
  else frame(0);

  /* ---------- Chat UI ---------- */
  function scroll() { msgs.scrollTop = msgs.scrollHeight; }

  function timeGreeting() {
    var h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  }

  var LEADS = ["Happy to help! ", "Good question. ", "Sure thing. ", "Of course! "];
  function lead(entry) {
    if (entry.hidden || entry.caution || entry.fn || entry.id === "contact") return "";
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
    return;
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

  /* ---------- Step 4: tappable replies ---------- */
  var optsEl = null;

  function clearOptions() {
    if (optsEl && optsEl.parentNode) optsEl.parentNode.removeChild(optsEl);
    optsEl = null;
  }

  function addOptions(options) {
    clearOptions();
    var wrap = document.createElement("div");
    wrap.className = "apsis-opts";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Quick replies");
    var wait = "thinking";                            // Apsi's face while waiting for a choice
    function preview(m) { if (optsEl === wrap) setMood(m); }
    options.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = o.label;
      if (o.mood) {                                   // Yes / No change her face as you aim at them
        b.addEventListener("pointerenter", function () { preview(o.mood); });
        b.addEventListener("focus", function () { preview(o.mood); });
        b.addEventListener("pointerleave", function () { preview(wait); });
        b.addEventListener("blur", function () { preview(wait); });
      }
      b.addEventListener("click", function () {
        if (busy) return;
        ask(o.send, o.mood);
        if (!root.matchMedia("(pointer:coarse)").matches) input.focus();
      });
      wrap.appendChild(b);
    });
    msgs.appendChild(wrap);
    optsEl = wrap;
    scroll();
  }

  // Adds the caution line and link buttons under a bot message
  function decorate(d, opts) {
    if (opts.caution) {
      var c = document.createElement("span");
      c.className = "apsis-c";
      c.textContent = CAUTION;
      d.appendChild(c);
    }
    var links = [];
    if (opts.link) links.push([opts.link, opts.linkText]);
    (opts.more || []).forEach(function (l) { links.push(l); });
    links.forEach(function (l) {
      d.appendChild(document.createElement("br"));
      var a = document.createElement("a");
      a.href = l[0];
      if (/^https?:/i.test(l[0])) { a.target = "_blank"; a.rel = "noopener noreferrer"; }  // external links open in a new tab
      a.textContent = (l[1] || "Read more") + " →";
      d.appendChild(a);
    });
  }

  // Shows a message all at once (used for the opening greeting)
  function addBot(text, opts) {
    opts = opts || {};
    var d = document.createElement("div");
    d.className = "apsis-m bot";
    d.appendChild(document.createTextNode(text));
    decorate(d, opts);
    msgs.appendChild(d);
    scroll();
  }

  var skipStream = null;     // set while a reply is streaming; calling it shows the full reply

  // Shows a reply word by word, then adds the caution line and links
  function streamBot(text, opts, onStart, onDone) {
    opts = opts || {};
    var d = document.createElement("div");
    d.className = "apsis-m bot";
    var node = document.createTextNode("");
    d.appendChild(node);
    msgs.appendChild(d);
    msgs.setAttribute("aria-busy", "true");          // screen readers wait, then read the whole reply once

    var plan = streamPlan(text);
    var shown = 0, started = false, finished = false, timer = null;
    var t0 = performance.now();

    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      skipStream = null;
      d.style.cursor = "";
      d.removeEventListener("click", finish);
      node.nodeValue = text;
      if (!started) { started = true; onStart(); }
      decorate(d, opts);
      msgs.removeAttribute("aria-busy");
      scroll();
      onDone();
    }

    function tick() {
      if (finished) return;
      var el = performance.now() - t0, upto = shown;
      while (upto < plan.chunks.length && plan.times[upto] <= el) upto++;
      if (upto > shown) {
        var stick = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 60;   // only follow if already at the bottom
        node.nodeValue += plan.chunks.slice(shown, upto).join("");
        shown = upto;
        if (stick) scroll();
        if (!started) { started = true; onStart(); }
      }
      if (shown >= plan.chunks.length) finish(); else timer = setTimeout(tick, 16);
    }

    if (reduceMotion) { finish(); return; }          // "reduce motion": show the reply instantly
    skipStream = finish;
    d.style.cursor = "pointer";                      // click the message to skip the typing
    d.addEventListener("click", finish);
    tick();
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
    var vr = routeReply(query);
    if (vr) {
      lastEntry = null;
      var vtext = vr.text, vmood = vr.mood;
      if (vr.kind === "answer" && tone(query) === "neg") { vtext = "Sorry you're dealing with that. " + vtext; vmood = "sad"; }
      return { mood: vmood, text: vtext, link: vr.link, linkText: vr.linkText, more: vr.more, caution: vr.caution, chips: [], options: vr.options };
    }
    var res = answer(query, lastEntry), t = tone(query);
    if (!res) {
      lastEntry = null;
      return {
        mood: "sad",
        text: "Hmm, I'm not sure I have that one. I'm a simple FAQ assistant, so for anything specific our team is your best bet:\n\n" +
          CONTACT,
        chips: SUGGESTIONS.map(byId)
      };
    }
    var e = res.entry, text = e.a, m = e.mood;
    if (!e.hidden) lastEntry = e;
    if (typeof e.fn === "function") {              // live answers (time, date, opening hours)
      var live = e.fn(query, new Date());
      text = live.text;
      if (live.mood) m = live.mood;
    }
    if (e.id === "greeting") {
      var sw = /\b(jambo|habari|sasa|mambo|hujambo)\b/i.test(query);
      text = (sw ? "Jambo! " : timeGreeting() + "! ") +
        "I'm Apsi, the virtual assistant for APSIS Business Consulting. Karibu! Ask me about our services, KRA and VAT basics, payroll deadlines or how to work with us.";
      return { mood: m, text: text, chips: SUGGESTIONS.map(byId) };
    }
    if (e.id === "rude") {
      rudeN++;
      if (rudeN > 1) {
        text = "Alright, I'll keep my cool. I know I'm only a simple bot, but I do want to help. Our team is on +254 722 670 127 if you'd rather speak to a person.";
        m = "sad";
      }
    }
    if (e.id === "help" || e.id === "identity" || e.id === "smalltalk") {
      return { mood: m, text: text, chips: SUGGESTIONS.map(byId) };
    }
    var prefix = lead(e);
    if (res.score < 4 && !e.hidden && !e.fn && tokens(query).length > 1) prefix = "I'm not completely sure I understood, but this may help. ";
    if (t === "neg" && !/^(worried|frustrated|rude)$/.test(e.id)) {
      prefix = "Sorry you're dealing with that. ";
      m = "sad";
    } else if (t === "pos" && e.id !== "rude") {
      m = "happy";
    }
    return { mood: m, then: e.then, text: prefix + text, link: e.link, linkText: e.linkText, more: e.more, caution: e.caution, chips: res.related };
  }

  function ask(text, reaction) {
    if (busy) return;
    busy = true;
    lastActive = performance.now();
    clearTimeout(settleT);
    clearOptions();                                   // old buttons disappear once anything is sent
    addUser(text);
    setMood(reaction || "thinking");                  // Yes -> happy, No -> sad while she "types"
    var t = typing();
    var r = reply(text);
    var beat = reduceMotion ? 100 : rnd(420, 640);    // a short pause before the words start
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
      streamBot(r.text, { link: r.link, linkText: r.linkText, more: r.more, caution: r.caution },
        function () { setMood(r.mood || "happy"); },  // her face changes as the first word appears
        function () {                                 // everything below waits until the text is complete
          lastActive = performance.now();
          addChips(r.chips || []);
          if (r.options && r.options.length) {
            addOptions(r.options);
            var shown = optsEl;
            if (r.mood && r.mood !== "thinking") {    // react to the answer first, then wait for the choice
              setTimeout(function () { if (optsEl === shown && mood === r.mood) setMood("thinking"); }, 1300);
            }
          } else if (r.then) {
            setTimeout(function () { if (mood === r.mood) setMood(r.then.mood, "bye"); }, r.then.after);
          } else if (r.mood === "sad" || r.mood === "angry" || r.mood === "thinking") {
            settleT = setTimeout(function () { if (mood === r.mood) setMood("happy"); }, 14000);
          }
          busy = false;
        });
    }, beat);
  }

  addBot(timeGreeting() + "! I'm Apsi, the virtual assistant for APSIS Business Consulting. Karibu! Ask me about our services, KRA and VAT basics, payroll deadlines or how to work with us.");

  function store(key, val) { try { sessionStorage.setItem(key, val); } catch (e) { /* storage may be blocked */ } }
  function stored(key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } }

  function hideTeaser() { teaser.classList.remove("show"); store("apsis-teaser", "1"); }

  function toggle(open) {
    panel.classList.toggle("open", open);
    btn.classList.toggle("apsis-hide", open);
    if (root.matchMedia("(max-width:480px)").matches) document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      hideTeaser();
      if (!root.matchMedia("(pointer:coarse)").matches) setTimeout(function () { input.focus(); }, 0);
    }
  }

  btn.addEventListener("click", function () { toggle(!panel.classList.contains("open")); });
  panel.querySelector("header button").addEventListener("click", function () { toggle(false); btn.focus(); });
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") { toggle(false); btn.focus(); } });
  teaser.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") hideTeaser(); else toggle(true);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (busy) { if (skipStream) skipStream(); return; }   // Send while she is typing = show the full reply, keep your text
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    typing_ = false;
    ask(text);
  });

  // Enter while she is typing also skips (even with an empty box)
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && skipStream) { e.preventDefault(); skipStream(); }
  });

  // Friendly nudge once per visit, a few seconds after the page loads
  if (!stored("apsis-teaser")) {
    setTimeout(function () {
      if (!panel.classList.contains("open")) {
        teaser.classList.add("show");
        if (mood === "happy") fx(btnFace, "fx-bounce");
      }
    }, 4500);
  }

  // Small public handle for testing moods from the console: ApsisChat.setMood("angry")
  root.ApsisChat = { setMood: setMood };
})(typeof window !== "undefined" ? window : this);