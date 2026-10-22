# APSIS Business Consulting Website

Static website for **APSIS Business Consulting Ltd**, a Nairobi-based accounting and tax consulting firm.

## Features

- **Multi-page site**: Services, About, Contact, Blog/Insights, Legal pages
- **Animated chat widget** (`js/chat-widget.js`): Browser-based FAQ assistant ("Apsi") with:
  - SVG robot face with 5 moods (happy, sad, angry, thinking, sleepy)
  - Eyes that follow cursor, blinking, head tilt
  - Topic-based answers (VAT, Payroll, etc.) with verified figures
  - Streaming replies with natural typing cadence
  - Zero backend — runs entirely in the browser

## Chat Widget Architecture

- **KB-driven**: Answers sourced from APSIS website content
- **Topic engine**: Generic router (`routeReply`) handles any topic defined as data (VAT, Payroll)
- **Verified figures**: Each fact has a `must` array; tests fail if any wording drops a required number
- **Test suite**: `node js/test-*.js` (step3–step6, payroll, main)

## Quick Start

```bash
# Serve locally (any static server)
npx serve .
```

## Project Structure

```
├── index.html              # Homepage
├── *.html                  # Static pages
├── css/                    # Stylesheets
├── js/
│   ├── chat-widget.js      # Main chat widget (exported as `ApsisChat`)
│   ├── main-v2.js          # Site interactions
│   └── test-*.js           # Test suites (not deployed)
├── content/                # Blog & Insights articles
└── img/                    # Images & favicons
```

## Deploy

Static hosting (Netlify, Vercel, GitHub Pages, cPanel, etc.) — no build step required.