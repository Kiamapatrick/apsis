# APSIS Business Consulting Website

Static website for **APSIS Business Consulting Ltd**, a Nairobi-based accounting and tax consulting firm serving businesses since 2020 across manufacturing, retail, NGOs, and the public sector.

## Features

- **Multi-page site**: Home, Services, About, Contact, Blog/Insights, Legal pages
- **Animated chat widget** (`js/chat-widget.js`): Browser-based FAQ assistant ("Apsi") with:
  - SVG robot face with 5 moods (happy, sad, angry, thinking, sleepy)
  - Eyes that follow cursor, blinking, head tilt, breathing animation
  - Topic-based answers (VAT, Payroll, etc.) with verified figures
  - Streaming replies with natural typing cadence
  - Zero backend — runs entirely in the browser
- **Responsive design**: Mobile-first, works on all screen sizes
- **Content-driven**: Blog posts and service insights pulled from APSIS website content
- **No build step**: Pure HTML/CSS/JS, deploy anywhere static hosting is supported

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Homepage with hero, services overview, team intro, testimonials |
| `about.html` | Company history, team bios (Domisiano, Stephen, Mwenda), mission |
| `services.html` | Three service groups: Tax, Accounting, Advisory |
| `contact.html` | Contact form, office location (Westlands, Nairobi), hours, WhatsApp/phone/email |
| `workwithus.html` | Engagement process, fee structure, onboarding steps |
| `accountants-in-nairobi.html` | Bookkeeping & accounting services |
| `financial-advisor.html` | Financial advisory & fractional CFO services |
| `import-export-tax-advisory.html` | Customs, duties, advance rulings, EAC/COMESA |
| `vat-compliance-kenya.html` | VAT registration, filing, penalties, eTIMS reconciliation |
| `content/insights/*.html` | 6 detailed service insight articles |
| `content/blogs/*.html` | 4 blog posts on KRA compliance, tax deadlines, demand notices |
| Legal pages | `privacy.html`, `terms.html`, `404.html` |

## Chat Widget (`js/chat-widget.js`)

The widget is a self-contained IIFE that exposes `ApsisChat` on `window`. Key components:

### Knowledge Base (KB)
- 50+ entries covering services, team, contact, tax topics, payroll, VAT, eTIMS, etc.
- Each entry has: `id`, `q` (sample question), `k` (keywords), `s` (strong words), `g` (generic words), `x` (exclusions), `a` (answer), `link`, `mood`, optional `fn` (live answers for time/date/hours)

### Topic Engine (Step 6)
- Generic router `routeReply(query)` — no VAT-specific code
- Topics defined as data objects (`VAT_TOPIC`, `PAYROLL_TOPIC`) with:
  - `words`, `phrase`, `stepAside`, `feeExempt`, `vague`, `canYou`, `missed`
  - `openers`, `closers`, `clarify`, `clarifyMulti`
  - `facts[]` with `id`, `label`, `next`, `nextId`, `button`, `s`, `w`, `must`, `wordings[]`, `link`, `linkText`, `caution`, `mood`
- Verified figures via `must` arrays — every wording must contain each required string
- Context tracking for follow-ups ("and the penalty?"), one-at-a-time flow, missed-deadline detection

### Face Animation
- SVG with CSS animations for moods, blinking, cursor following, head tilt
- Respects `prefers-reduced-motion`
- Mood reacts to visitor tone (worried → sad, positive → happy)

### Streaming Replies
- `streamPlan(text)` splits into word chunks with weighted delays
- Sentence ends, commas, paragraph breaks add pause weight
- Max 3s total, click to skip, `reduce-motion` shows instantly

### Integration
```html
<script src="/js/chat-widget.js" defer></script>
```
Auto-initializes on `DOMContentLoaded`. Button appears bottom-right.

## CSS Organization

| File | Scope |
|------|-------|
| `css/style-v2.css` | Global layout, header, footer, typography, utilities |
| `css/services.css` | Services page grid, cards, hover effects |
| `css/about.css` | Team bios, timeline, mission section |
| `css/contact.css` | Form, map embed, office hours card |
| `css/workwithus.css` | Process steps, fee table, CTA |
| `css/service-pages.css` | Shared styles for VAT, payroll, import-export, financial advisor |
| `css/preloader.css` | Page load spinner |
| `css/legal-pages.css` | Privacy, terms, 404 |
| `content/insights/css/service.css` | Insight article layout |

## JavaScript Modules

| File | Purpose |
|------|---------|
| `js/chat-widget.js` | Chat widget (exported as `ApsisChat`) |
| `js/main-v2.js` | Mobile nav, smooth scroll, scroll animations, FAQ accordions |
| `js/services.js` | Service card interactions, filter tabs |
| `js/about.js` | Team carousel, counter animation |
| `js/contact.js` | Form validation, map init, WhatsApp click tracking |
| `js/workwithus.js` | Step navigator, fee calculator placeholder |
| `js/service-pages.js` | Shared: table of contents, scroll spy, copy code blocks |
| `js/legal-pages.js` | Anchor scroll, print styles |
| `content/js/content.js` | Blog/insight listing, category filter, search |

## Project Structure

```
├── index.html
├── about.html
├── services.html
├── contact.html
├── workwithus.html
├── accountants-in-nairobi.html
├── financial-advisor.html
├── import-export-tax-advisory.html
├── vat-compliance-kenya.html
├── privacy.html
├── terms.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico + favicon-*.png
├── css/
│   ├── style-v2.css
│   ├── services.css
│   ├── about.css
│   ├── contact.css
│   ├── workwithus.css
│   ├── service-pages.css
│   ├── preloader.css
│   └── legal-pages.css
├── js/
│   ├── chat-widget.js
│   ├── main-v2.js
│   ├── services.js
│   ├── about.js
│   ├── contact.js
│   ├── workwithus.js
│   ├── service-pages.js
│   └── legal-pages.js
├── content/
│   ├── index.html
│   ├── insights/
│   │   ├── index.html
│   │   ├── vat-registration-kenya.html
│   │   ├── etims-consultant-kenya.html
│   │   ├── payroll-tax-services-kenya.html
│   │   ├── kra-tax-consultant-kenya.html
│   │   ├── kra-audit-support.html
│   │   ├── tax-compliance-services-kenya.html
│   │   └── css/service.css
│   ├── blogs/
│   │   ├── index.html
│   │   ├── kra-filing-deadline-kenya.html
│   │   ├── kra-tax-demand-notice-kenya.html
│   │   ├── business-taxes-in-kenya.html
│   │   └── hire-accountant-vs-diy-kenya.html
│   ├── js/content.js
│   └── css/content.css
└── img/
    ├── logo.jpg, logo2.jpg
    ├── domisiano.jpg, stephen.jpg, mwenda.jpg
    ├── hero-texture-sm.webp
    ├── preloader.png
    └── favicon-*.png
```

## Quick Start

```bash
# Serve locally (any static server)
npx serve .
```

Open `http://localhost:3000` (or whatever port the server uses).

## Deploy

Static hosting — no build step required.

- **Netlify/Vercel/GitHub Pages**: Connect repo, publish directory = root
- **cPanel/Apache/Nginx**: Upload all files to `public_html` or document root
- **Cloudflare Pages**: Connect GitHub, build command = none, output = `/`

Ensure your server serves `.html` without extension (clean URLs) or configure rewrites.

## Browser Support

Modern browsers (last 2 versions). Uses:
- ES5-compatible JS (IIFE, no modules)
- CSS custom properties, flexbox, grid
- `IntersectionObserver` for scroll animations
- `visualViewport` API for mobile keyboard handling

## License

Proprietary — APSIS Business Consulting Ltd. All rights reserved.