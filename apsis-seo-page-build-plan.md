# APSIS SEO Page Build Plan

**Instructions for the build agent:** All pages are static HTML matching the existing site's structure, styling, and components (same header/nav, footer, CSS/JS includes as index.html and about.html). Do NOT invent facts — every claim, name, credential, address, phone number, and service description must come directly from the existing apsis.co.ke pages listed under "Source" for each section. If a detail isn't available on the live site, leave it out rather than making it up.

## Global rules (apply to every page below)

- **File location:** flat root folder, same directory as `index.html` (e.g. `apsis.co.ke/tax-advisors.html`) — do NOT create a subfolder. All relative paths (`img/...`, `content/blogs/...`) must resolve exactly as they do from index.html.
- **No duplicate content:** No paragraph should be copy-pasted identically across two or more of these 6 pages, or from about.html/services.html. Facts can repeat, wording must not.
- **Each page needs unique:** `<title>`, meta description, H1, and canonical tag (`https://www.apsis.co.ke/[filename]`, matching the site's existing www canonical convention).
- **Footer link:** add a new "Services" (or extend the existing "Quick Links") column in the site-wide footer linking to all 6 new pages. This must go into the shared footer partial/include so it updates site-wide in one place, not copy-pasted into every HTML file separately.
- **Internal linking:** each new page must link to: (a) the relevant blog posts under `/content/blogs/`, (b) `about.html`, (c) `contact.html`. Where two of the 6 pages are topically related (e.g. tax-advisors.html and vat-compliance-kenya.html), link them to each other.
- **Schema:** add `Service` JSON-LD schema on each page (service name, provider = APSIS Business Consulting Ltd, areaServed = Nairobi/Kenya, matching your existing `LocalBusiness`/geo meta pattern). Add `Person` JSON-LD for the featured team member on each page, using their exact bio text from about.html.
- **Length:** 500–800 words of real body content per page, not counting nav/footer.
- **Sitemap:** add all 6 URLs to `sitemap.xml` after the pages are live.
- **Fix before/while building:** resolve the inconsistency between about.html's meta description ("5+ years") and the individually stated 13–15 years experience of team members — pick accurate wording (e.g. "founded by professionals with 13+ years individual experience") and use it consistently everywhere it's referenced, including these new pages.

---

## Page 1: `accountants-in-nairobi.html`

- **Target keywords:** accountants in Nairobi, accountants in Kenya, accounting firm Nairobi
- **Featured team member:** Stephen Chege (Compliance & Business Advisory — CPA-K, IIA member, internal audit, organizational development)
- **Source content:** homepage services — Book Keeping, Financial Analysis, Regulatory Compliance; about.html "Sector-Specific Finance" bullet (manufacturing, retail, NGOs, government)
- **Content outline:**
  1. H1 + intro: what APSIS's accounting services cover, who they're for
  2. Core accounting services (bookkeeping, financial reporting, regulatory compliance) — pulled from services.html descriptions, rewritten
  3. Industries served (manufacturing, retail, NGOs, public sector) — from about.html
  4. Meet your accountant: Stephen Chege's real bio/credentials
  5. FAQ: "Do I need an accountant for a small business in Kenya?", "What's the difference between bookkeeping and accounting?"
  6. CTA with phone/email, link to contact.html

## Page 2: `tax-advisors.html`

- **Target keywords:** tax advisor Nairobi, tax consultant Kenya, KRA tax advisory
- **Featured team member:** Domisiano Wainaina (Director & Lead Consultant — CPA-K, MBA, Tax Strategy & Compliance)
- **Source content:** homepage services — Tax Advisories, Tax Planning, Tax Filing, Tax Preparation; existing blog posts (KRA filing deadline, KRA tax demand notice, business taxes in Kenya)
- **Content outline:**
  1. H1 + intro: navigating KRA compliance with APSIS
  2. Tax services breakdown (advisory, planning, filing, preparation) — rewritten from services.html
  3. Meet your tax lead: Domisiano's real bio/credentials
  4. Common KRA problems solved (link out to the 3 existing blog posts as supporting reading)
  5. FAQ: "How much does a tax consultant cost in Kenya?", "What happens if I miss a KRA deadline?"
  6. CTA

## Page 3: `financial-advisor.html`

- **Target keywords:** financial advisor Nairobi, financial consulting Kenya, financial planning for business Kenya
- **Featured team member:** Domisiano Wainaina (FP&A, Financial Modeling & Forecasting, Investment Appraisal, Budget Management)
- **Source content:** homepage services — Financial Consulting, Financial Analysis
- **Content outline:**
  1. H1 + intro: financial advisory for growing businesses
  2. Services (financial analysis, financial consulting, investment/budget strategy) — rewritten
  3. Who it's for: SMEs vs larger organizations
  4. Meet your advisor: Domisiano's bio (framed toward FP&A/modeling this time, distinct from Page 2's tax framing)
  5. FAQ: "When should a business hire a financial advisor?", "What's the difference between a financial advisor and an accountant?"
  6. CTA

## Page 4: `payroll-services-kenya.html`

- **Target keywords:** payroll services Kenya, payroll audit Nairobi, statutory payroll compliance Kenya
- **Featured team member:** Mwenda Mwongera (Finance & Systems Lead — statutory audits, automated workflows, bookkeeping/payroll systems, ICPAK member)
- **Source content:** homepage service — Payroll Audit
- **Content outline:**
  1. H1 + intro: payroll accuracy and compliance
  2. What payroll audit covers: statutory deductions (NSSF, SHIF, PAYE), employee records alignment — rewritten from services.html
  3. Meet your payroll lead: Mwenda's bio, emphasizing his systems/automation work
  4. FAQ: "What statutory deductions must Kenyan employers make?", "How often should payroll be audited?"
  5. CTA

## Page 5: `vat-compliance-kenya.html`

- **Target keywords:** VAT compliance Kenya, VAT filing Nairobi, VAT consultant Kenya
- **Featured team member:** Mwenda Mwongera (Data Analysis, Process Optimization, regional regulations across Kenya/Uganda/Tanzania/Rwanda/Zambia)
- **Source content:** VAT compliance from meta-keywords/homepage; Regulatory Compliance service
- **Content outline:**
  1. H1 + intro: staying VAT-compliant under KRA
  2. VAT filing process, common mistakes, eTIMS notes
  3. Meet your VAT lead: Mwenda's bio, framed toward regional/regulatory expertise
  4. FAQ: "Who needs to register for VAT in Kenya?", "What are the penalties for late VAT filing?"
  5. Link to vat/tax-related blog posts and to tax-advisors.html
  6. CTA

## Page 6: `import-export-tax-advisory.html`

- **Target keywords:** import export tax advisory Kenya, customs compliance Kenya, cross-border tax Kenya
- **Featured team member:** whichever of the three is most relevant to cross-border/customs work per about.html — confirm before writing; if none has explicit customs experience stated, keep this section general/firm-level rather than attributing to one person
- **Source content:** homepage services — Import & Export Reviews, Advance Rulings
- **Content outline:**
  1. H1 + intro: cross-border transaction compliance
  2. Import/export review services, advance tax rulings — rewritten from services.html
  3. Why this matters for Kenyan importers/exporters
  4. FAQ: "What is an advance tax ruling and when do I need one?"
  5. CTA

---

## After build: verification checklist (for me to run once pushed to GitHub)

- [ ] All 6 pages present at root, relative paths intact, no broken images/links
- [ ] Unique title/meta/H1 per page, no duplicate paragraphs across pages or vs. about.html/services.html
- [ ] Footer links present site-wide (check on index.html and at least 2 other pages, not just the new ones)
- [ ] Schema (Service + Person) present and valid JSON-LD on each page
- [ ] Team member facts match about.html exactly (names, credentials, years)
- [ ] "5+ years" vs "13–15 years" inconsistency resolved consistently across old and new pages
- [ ] Internal links to blog posts, about.html, contact.html present on each page
- [ ] sitemap.xml updated with all 6 new URLs
- [ ] NAP (address/phone/email) identical across all 6 new pages and existing contact.html
