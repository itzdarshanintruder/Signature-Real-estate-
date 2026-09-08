# SIGNATURE CITY — PROJECT FOUNDATION & ARCHITECTURE

> **Phase:** 1 — Foundation & Architecture (Planning)
> **Status:** Draft for approval. No implementation yet.
> **Project:** Signature City — Premium DTCP Approved Residential Plot Developer
> **Goal:** A luxury, world-class, production-ready real estate platform.

---

## Table of Contents

1. [Product Overview & Goals](#1-product-overview--goals)
2. [Technology Stack](#2-technology-stack)
3. [Folder Structure](#3-folder-structure)
4. [Naming Conventions](#4-naming-conventions)
5. [Design System](#5-design-system)
6. [Theme Guidelines](#6-theme-guidelines)
7. [Responsive Strategy](#7-responsive-strategy)
8. [Animation Guidelines](#8-animation-guidelines)
9. [Performance Strategy](#9-performance-strategy)
10. [Coding Standards](#10-coding-standards)
11. [Component Architecture](#11-component-architecture)
12. [Page Architecture](#12-page-architecture)
13. [Routing & Navigation](#13-routing--navigation)
14. [State Management & Data Flow](#14-state-management--data-flow)
15. [Backend Readiness & Xano Integration Plan](#15-backend-readiness--xano-integration-plan)
16. [Admin Dashboard Planning](#16-admin-dashboard-planning)
17. [Error Handling, Monitoring & Security](#17-error-handling-monitoring--security)
18. [Deployment & CI/CD](#18-deployment--cicd)
19. [Architectural Decisions & Rationale](#19-architectural-decisions--rationale)
20. [Phased Implementation Roadmap](#20-phased-implementation-roadmap)
21. [Approval Checklist](#21-approval-checklist)

---

## 1. Product Overview & Goals

### 1.1 What we are building

A **luxury real estate marketing and lead-generation platform** for Signature City, a premium DTCP-approved residential plot developer. The site is the digital flagship of the brand — it must *feel* expensive before a single word is read.

### 1.2 Business objectives

- Position Signature City as a **premium, trustworthy, DTCP-approved** plot developer.
- Convert visitors into **qualified leads** (enquiry form, WhatsApp, phone, EMI/RERA info requests).
- Serve four audiences:
  | Audience | Primary need |
  |---|---|
  | Families | Safety, amenities, community, schools/hospitals nearby |
  | Investors | Appreciation, ROI, legal clarity (DTCP/RERA) |
  | NRIs | Distant purchase experience, verified approvals, easy contact |
  | Premium buyers | Larger plots, premium blocks, exclusivity |

### 1.3 Non-functional goals

- **Load:** first meaningful paint < 2s on mid-range mobile (4G).
- **Lighthouse targets:** Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95.
- **Responsive:** pixel-perfect from 320px to 1920px, zero horizontal scroll.
- **Scalable:** backend-ready for Xano; content, projects, and leads all data-driven.
- **Maintainable:** clean architecture, strict TypeScript, full component reuse.

---

## 2. Technology Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 19** + **TypeScript (strict)** | Industry standard, huge ecosystem, best DX for component systems, typed contracts ready for Xano. |
| Build tool | **Vite 7** | Instant HMR, fastest production builds, native ESM, first-class SWC/lightningcss support. |
| Styling | **Tailwind CSS v4** (+ `@theme` design tokens) | Design tokens live in CSS, zero-config, purges unused CSS, ideal for a strict design system. |
| Routing | **React Router v7** (library mode) | Declarative, lazy-loadable routes, nested layouts, SEO-friendly route meta. |
| Server state | **TanStack Query v5** | Caching, retries, optimistic updates, perfect fit for Xano REST APIs. |
| Client state | **Zustand v5** | Tiny, minimal boilerplate for UI state only (modals, theme, filters). |
| Forms | **React Hook Form + Zod v4** | Performant uncontrolled forms, schema validation shared with the API layer. |
| Animations | **CSS transitions + `motion` (framer-motion)** | 90% of animation is CSS (GPU-friendly). `motion` reserved for scroll reveals and micro-interactions. |
| Icons | **lucide-react** | One consistent, elegant stroke icon set; tree-shakeable. |
| Images | **Cloudinary** | Auto format/quality/resize (`f_auto`, `q_auto`, `w_*`), CDN, transformations, eager + lazy loading. |
| SEO | **Pre-rendering + per-route meta + JSON-LD** | Public marketing pages get pre-rendered HTML (SSG-style) for crawlers; dynamic content client-rendered. |
| Backend | **Xano** (headless backend) | No-code/semi-code scalable backend: DB, REST APIs, auth, workflows, rate limiting. |
| Hosting | **Netlify** | Global CDN, atomic deploys, preview deploys, forms/edge functions, free TLS. |
| Env secrets | **Vite env + Zod validation** | Fail-fast if required env vars are missing at build. |
| Linting | **ESLint 9** + **typescript-eslint** + **eslint-plugin-react-hooks** | Strict rules, consistent code. |
| Formatting | **Prettier** + simple-import-sort | Uniform codebase, no import bikeshedding. |
| Testing | **Vitest + React Testing Library** (unit), **Playwright** (e2e + viewport matrix) | Real confidence at every breakpoint. |
| Monitoring | **Sentry** (optional) | Error tracking in production. |
| Analytics | **Privacy-friendly** (Plausible or GA4) | Understand conversions without hurting performance. |

> **Stack rule:** no new library enters without (a) proven need, (b) bundle cost review, (c) typed API surface.

---

## 3. Folder Structure

```
signature-city/
├── public/                      # Static, non-processed assets
│   ├── favicon.ico / *.svg      # Brand icons
│   ├── robots.txt               # Crawler rules
│   ├── sitemap.xml              # Generated for marketing pages
│   └── og-default.jpg           # Fallback social share image
│
├── src/
│   ├── app/                     # App composition root (providers, router)
│   │   ├── App.tsx
│   │   ├── router.tsx           # Route table (lazy)
│   │   └── providers.tsx        # QueryClient, Theme, Toaster, Auth (later)
│   │
│   ├── assets/                  # Locally bundled fonts, static images, svg
│   │   ├── fonts/
│   │   └── images/
│   │
│   ├── components/              # THE component library (see §11)
│   │   ├── ui/                  # Primitives: Button, Input, Card, Modal…
│   │   ├── layout/              # Container, Section, Navbar, Footer
│   │   └── sections/            # Composite blocks: Hero, Amenities, Stats…
│   │
│   ├── layouts/                 # Page-level layout templates
│   │   ├── PublicLayout.tsx     # Navbar + Footer + Outlet
│   │   └── AdminLayout.tsx      # Sidebar shell (future)
│   │
│   ├── pages/                   # One folder per route
│   │   ├── home/
│   │   ├── projects/
│   │   ├── project-details/
│   │   ├── gallery/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── legal/               # privacy, terms
│   │   └── not-found/
│   │
│   ├── hooks/                   # Shared custom hooks (useMediaQuery, useScrollReveal…)
│   ├── services/                # API layer — the ONLY place that talks to the network
│   │   ├── api-client.ts        # fetch wrapper (base URL, auth, retries, timeout)
│   │   ├── projects.api.ts
│   │   ├── gallery.api.ts
│   │   ├── leads.api.ts
│   │   └── site-content.api.ts  # CMS/content endpoints
│   │
│   ├── store/                   # Zustand stores (UI state only)
│   │   ├── ui-store.ts          # modal, mobile nav, filters
│   │   └── theme-store.ts       # theme preference
│   │
│   ├── types/                   # Global TS contracts (mirror Xano tables)
│   │   ├── api.ts               # ApiResponse<T>, pagination, error shape
│   │   ├── project.ts
│   │   ├── lead.ts
│   │   └── content.ts
│   │
│   ├── constants/               # Static config values
│   │   ├── nav.ts               # navigation items
│   │   ├── breakpoints.ts
│   │   └── site.ts              # brand name, contact, socials
│   │
│   ├── config/                  # Env-driven config (validated)
│   │   └── env.ts               # Zod-validated env schema
│   │
│   ├── lib/                     # Pure helpers (no React, no network)
│   │   ├── cn.ts                # className merge
│   │   ├── formatters.ts        # INR currency, phone, date
│   │   └── seo.ts               # meta + JSON-LD builders
│   │
│   ├── providers/               # Context providers
│   │   ├── query-provider.tsx
│   │   └── seo-provider.tsx
│   │
│   ├── styles/
│   │   ├── tokens.css           # @theme design tokens (color, type, space)
│   │   └── base.css             # base layer, resets, utilities
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── netlify/
│   ├── functions/               # Edge/serverless helpers (proxy, forms relay)
│   │   └── contact-relay.ts     # Optional server-side lead relay (spam-safe)
│   └── netlify.toml             # Redirects, headers, caching
│
├── tests/
│   ├── unit/                    # Vitest specs co-located by mirroring src/
│   └── e2e/                     # Playwright viewport matrix tests
│
├── .github/workflows/           # CI (lint, typecheck, test, preview)
├── docs/                        # This and future documents
│   └── PROJECT_FOUNDATION.md
│
├── .env.example                 # Documented env template (no secrets)
├── .eslintrc / eslint.config.js
├── .prettierrc
├── index.html                   # Root HTML (fonts, meta, preconnects)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

**Folder responsibility rules**

| Folder | Owns | Never contains |
|---|---|---|
| `components/ui` | Stateless primitives | Business logic, API calls |
| `components/sections` | Composite marketing blocks | Router usage |
| `pages` | Route composition only | Raw API calls (goes through hooks/services) |
| `services` | All network I/O | JSX |
| `hooks` | Shared behavioral logic | Presentation |
| `lib` | Pure functions | Side effects |
| `types` | Shared contracts | Implementation |

---

## 4. Naming Conventions

### 4.1 Files & folders

| Item | Rule | Example |
|---|---|---|
| Components | `PascalCase.tsx` | `ProjectCard.tsx` |
| Hooks | `useCamelCase.ts` | `useMediaQuery.ts` |
| Services/APIs | `kebab-case.api.ts` | `site-content.api.ts` |
| Types | `PascalCase` files | `project.ts` |
| Constants | `kebab-case` | `breakpoints.ts` |
| Tests | `name.test.tsx` | `Button.test.tsx` |

### 4.2 Code identifiers

| Item | Rule | Example |
|---|---|---|
| Components & types | `PascalCase` | `AmenityCard`, `ProjectStatus` |
| Functions/variables | `camelCase` | `getProjectBySlug` |
| Constants | `SCREAMING_SNAKE` (top-level) | `SITE_CONTACT` |
| Booleans | `is*` / `has*` / `can*` | `isLoading`, `hasError` |
| Event handlers | `handle*` | `handleSubmit` |
| CSS custom props | `kebab-case` | `--color-gold-500` |
| React keys/ids | `kebab-case` | `project-card-{id}` |
| API fields | `camelCase` (frontend) mapped from Xano snake_case | DTO mapper |

### 4.3 Component naming pattern

```
[Aspect][Context]?[Element]? = ProjectCard, HeroSection, ContactForm, PrimaryButton
```

Expose one component per file. Export default for pages only.

---

## 5. Design System

### 5.1 Design principles

1. **Luxury = restraint.** Generous white space, one accent color, limited type scale.
2. **Gold is a seasoning, not a filling.** Use on CTAs, dividers, highlights, and hover states — never on 50% of the page.
3. **Black and white do the work; gold does the talking.**
4. **Consistency over novelty.** Every size/color/radius is a token, never a literal.

### 5.2 Color palette (Tailwind `@theme` tokens)

```css
@theme {
  /* Champagne Gold — primary accent */
  --color-gold-50:  #FBF7EF;
  --color-gold-100: #F3EAD8;
  --color-gold-200: #E6D4AC;
  --color-gold-300: #D9BE80;
  --color-gold-400: #CDA75F;
  --color-gold-500: #C6A15B;   /* PRIMARY gold */
  --color-gold-600: #A98445;
  --color-gold-700: #86693A;
  --color-gold-800: #5C4A2B;
  --color-gold-900: #3B2F1E;

  /* Warm Ink — near-black neutral */
  --color-ink-50:  #F6F6F5;
  --color-ink-100: #E8E8E6;
  --color-ink-200: #CFCFCB;
  --color-ink-300: #A9A9A4;
  --color-ink-400: #7D7D78;
  --color-ink-500: #5C5C57;
  --color-ink-600: #3F3F3B;
  --color-ink-700: #2C2C29;
  --color-ink-800: #1A1A18;
  --color-ink-900: #0B0B0A;    /* PRIMARY black */

  /* Warm Off-White — surface */
  --color-cream-50:  #FDFCFA;
  --color-cream-100: #F8F5F0;  /* PRIMARY light surface */
  --color-cream-200: #F0EBE1;
  --color-cream-300: #E4DCCD;
}
```

**Semantic roles**

| Token | Usage |
|---|---|
| `--color-gold-500` | Primary CTA, active nav, focus rings, key dividers, icons |
| `--color-gold-600` | Hover state of gold elements |
| `--color-ink-900` | Dark sections, footer, hero overlay, primary text on light |
| `--color-cream-100` | Page background (softer than pure white = luxury warmth) |
| `--color-white` | Cards on cream, text on dark |
| `--color-ink-500/600` | Secondary text |
| `--color-gold-100` | Soft gold tints for badges/section backgrounds |

**Contrast (WCAG AA)** — verified tokens:
- Text on white/cream: `ink-800` (#1A1A18) → contrast ≥ 12:1 ✅
- Text on ink-900: `cream-100` (#F8F5F0) → contrast ≥ 15:1 ✅
- Gold-500 on white: used for large text/icons only; text on gold uses `ink-900` ✅
- Focus ring: gold-600 with 2px offset on all focusable elements ✅

### 5.3 Typography

**Font pairing (luxury editorial):**

| Role | Font | Weights | Fallback |
|---|---|---|---|
| Display / Headings | **Cormorant Garamond** | 400, 500, 600, 700 (+italic) | Georgia, serif |
| Body / UI | **Manrope** | 400, 500, 600, 700 | system-ui, sans-serif |

- Headings: serif, elegant, tight letter-spacing on large sizes, tracked on small.
- Body: Manrope at 16px, `line-height 1.7`.
- Numerals/statistics: Manrope 600 with tabular figures (`font-variant-numeric: tabular-nums`) so animated counters don't shift.
- Uppercase eyebrows/labels: Manrope 500, `letter-spacing 0.2em`, gold or muted — the signature luxury motif.

**Type scale (fluid with `clamp()`):**

```css
--text-display: clamp(2.75rem, 6vw, 5rem);   /* hero H1 */
--text-h1:      clamp(2.25rem, 4vw, 3.5rem);
--text-h2:      clamp(1.875rem, 3vw, 2.75rem);
--text-h3:      clamp(1.5rem, 2vw, 2rem);
--text-h4:      1.25rem;
--text-body:    1rem;
--text-sm:      0.875rem;
--text-xs:      0.75rem;
--text-eyebrow: 0.8125rem;  /* + 0.2em letter-spacing, uppercase */
```

### 5.4 Spacing system

- **4px base grid.** Tailwind default scale: `px-1..px-20` + named layout steps.
- Section rhythm (always from tokens):
  | Breakpoint | Section padding |
  |---|---|
  | Mobile (<768) | `py-16` |
  | Tablet+ | `py-24` |
  | Desktop (≥1280) | `py-28` |
- Container: `max-w-7xl (1280px)` + `px-4 sm:px-6 lg:px-8`, centered.
- Component internal padding: cards `p-6 md:p-8`.

### 5.5 Border radius

Luxury minimal = **sharp-to-slight**:

```
--radius-none: 0px;      /* default card, buttons, inputs — editorial sharpness */
--radius-sm:   2px;      /* small elements */
--radius-md:   4px;      /* chips, inputs (optional) */
--radius-lg:   8px;      /* image cards that need softness */
--radius-full: 9999px;   /* pills, avatars, counters */
```

Primary decision: **buttons and cards use `0–2px`** for a bespoke, non-template look; imagery cards may use 8px for refinement.

### 5.6 Shadows

Soft, barely-there elevation — luxury never looks "boxy":

```
--shadow-xs: 0 1px 2px rgb(11 11 10 / 0.05);
--shadow-sm: 0 2px 6px rgb(11 11 10 / 0.06);
--shadow-md: 0 8px 24px rgb(11 11 10 / 0.08);
--shadow-lg: 0 16px 40px rgb(11 11 10 / 0.12);
--shadow-gold: 0 8px 24px rgb(198 161 91 / 0.35);   /* CTA glow */
```

Prefer **1px hairline borders** (`ink-200`/`ink-800`) over heavy shadows.

### 5.7 Buttons

| Variant | Style |
|---|---|
| **Primary** | Gold-500 bg, ink-900 text, 0 radius, `py-3 px-8`, hover gold-600 + translateY(-1px), focus ring |
| **Secondary** | Transparent, 1px ink-300 border, ink-900 text (or cream text on dark), hover border-gold |
| **Ghost** | No bg/border, text + arrow icon, hover gold text, underline slide |
| **Dark** | Ink-900 bg, cream text (on light sections) |
| **Icon** | 44×44 touch target, focus ring |

Sizes: `sm (py-2 px-4)`, `md (py-3 px-6)`, `lg (py-4 px-10)`.
States: `hover / active / focus-visible (gold ring) / disabled (60% opacity, no pointer)`.

### 5.8 Inputs

- 1px border `ink-300`, radius 0, `py-3 px-4`, cream-50 bg.
- Focus: 1px `gold-600` border + 2px offset gold ring.
- Label: Manrope 500 sm, eyebrow style. Placeholder: `ink-400`.
- Error: 1px red border + helper text `red-600` with `aria-describedby`.
- Textarea min-height 120px. All inputs `h-12` minimum for touch.

### 5.9 Cards

- **Info card:** cream/white bg, 0 radius, hairline border `ink-200`, `p-6 md:p-8`, `--shadow-sm` on hover.
- **Project/Gallery card:** image with `aspect-ratio` (no CLS), gradient overlay on hover, gold hairline reveal, caption panel below/overlay.
- **Amenity card:** icon (gold), title, one-line copy, subtle top-border hover slide.

### 5.10 Icons

- `lucide-react`, stroke `1.5`, size tokens `16/20/24/32`.
- Decorative icons: `aria-hidden="true"`. Meaningful icons paired with text/label.

### 5.11 Badges

- **Approved badge** (DTCP/RERA): green dot + "DTCP Approved" — trust signal.
- **Status badge:** gold pill for "Launching Soon / Available / Sold Out / Premium".
- Pill shape, `px-3 py-1`, Manrope 600 sm, uppercase eyebrow optional.

### 5.12 Alerts

- `role="alert"` for blocking errors, `role="status"` for success.
- Icon + title + message + optional action. Variants: success (green), error (red), info (ink), gold (brand highlight).

### 5.13 Tables

- Only in **admin dashboard** (future). Style: hairline rows, sticky header, `tabular-nums`, zebra on hover, sortable column headers with aria.

### 5.14 Forms

- **Contact / enquiry form:** full accessibility (labels, fieldset, autocomplete, validation, honeypot, server relay), success toast + confirmation state, no data loss on error.
- RHF + Zod schema mirrors the `Lead` type so the same payload is sent to Xano.

### 5.15 Modals

- Focus trap, `role="dialog"`, `aria-modal`, ESC closes, backdrop click closes, `body` scroll lock, close button `aria-label`.
- Used sparingly on a luxury site: image lightbox, "Download Brochure" gate, "Schedule a Site Visit".

### 5.16 Toasts

- Top-right, `role="status"`, auto-dismiss 5s, pause on hover, exit animation transform+opacity only.

---

## 6. Theme Guidelines

### 6.1 Luxury Black

```
ink-900  #0B0B0A  → Hero, Footer, dark CTA sections, image overlays
```

- Used as a *stage*, not a default. Dark + gold = signature combo.
- Overlay gradient for images: `linear-gradient(180deg, transparent 0%, rgba(11,11,10,.72) 100%)`.

### 6.2 White / Cream

```
cream-100 #F8F5F0 → page background
white            → cards on cream, text on ink
```

### 6.3 Soft Gold

- **20% coverage rule:** gold appears on primary CTA, one divider per section, eyebrow labels, hover states, badge accents, and the brand mark. Nothing more.

### 6.4 Anti-template rules

- No gradient-heavy buttons, no purple/blue SaaS hues, no glossy 3D, no emoji in UI.
- No rounded-card-everything. Sharpness + serif + whitespace = bespoke.
- Every image treated (color grade warm, consistent crop) via Cloudinary transforms.
- Typography hierarchy strictly enforced; no arbitrary font sizes.

---

## 7. Responsive Strategy

### 7.1 Approach

- **Mobile-first** authored, `sm md lg xl 2xl` used to *enhance*.
- **Fluid type** with `clamp()` — text scales continuously, no jump cutoffs.
- **No fixed widths** anywhere except tiny icons. Use `min-w-0` on flex children to prevent overflow; `overflow-x-hidden` only as a last-resort safety net (we audit to make it unnecessary).
- Container padding fluid: `px-4 sm:px-6 lg:px-8`.
- Grids: auto-fit/minmax for gallery cards; explicit breakpoints for hero and stats.

### 7.2 Breakpoint matrix (must-pass checklist)

| Device class | Width | Verification checks |
|---|---|---|
| Small phone | 320, 360 | Nav collapses to hamburger; hero text ≤ 45ch; no horizontal scroll; touch targets ≥44px |
| Standard phone | 375, 390, 430 | Form full-width; 1-col grids; sticky CTA bar appears |
| Large phone | 480, 576 | 2-col for amenity/stat cards |
| Tablet | 768, 992 | Nav switches to full links; hero 2-col; project cards 2–3 col |
| Small laptop | 1024, 1280 | 3-col projects; sidebar-less content |
| Laptop | 1366, 1440 | Container maxed; galleries 4-col |
| Desktop+ | 1600, 1920 | Content stays centered, max-w-7xl; hero stays composed |

### 7.3 High-risk components (audited every viewport)

- Navbar (sticky, transparent-to-solid transition, mobile drawer with scroll lock)
- Hero (image + headline stacking, no text overlap)
- Stats counters (no wrap issues, tabular-nums)
- Project & gallery grids (image aspect-ratio, `object-cover`)
- Tables of legal/fee info → render as definition lists on mobile
- Forms (single column, full-bleed inputs)
- Footer (4-col → stacked)

### 7.4 Implementation guardrails

- `<picture>`/Cloudinary responsive `srcset` with `sizes`.
- All images carry `width`/`height` or CSS `aspect-ratio` (zero CLS).
- Test matrix automated in **Playwright** at 320/375/768/1024/1440/1920 in CI.

---

## 8. Animation Guidelines

### 8.1 Principles

Smooth. Elegant. GPU-accelerated. Subtle. Fast.

### 8.2 Allowed techniques (compositor-only: `transform`, `opacity`)

| Effect | Where | Detail |
|---|---|---|
| Fade / slide reveal | Sections on scroll | One `IntersectionObserver` hook, `translateY(24px)→0`, 500ms, cubic-bezier(0.22,1,0.36,1) |
| Scale on hover | Cards, images, CTAs | `scale(1.02–1.03)` on image, 300ms |
| Hairline reveal | Project cards | Gold border animates in via transform scaleX, 400ms |
| Count-up | Stats | Triggered once on view, 900ms, eased; tabular-nums prevents layout shift |
| Light parallax | Hero image | `transform: translateY` ±20px max, disabled on mobile & reduced-motion |
| Smooth scroll | Anchor navigation | CSS `scroll-behavior: smooth` + scroll-padding-top for sticky header |
| Navbar | Scroll behavior | Background fades in (opacity), 200ms |

### 8.3 Forbidden

- Animating `width`, `height`, `top/left`, `margin`, `box-shadow` (layout thrash).
- Looping/pulsing effects, confetti, bouncy springs, infinite spinners in marketing UI.
- Scroll-jacking, autoplaying heavy carousels, marquees.
- Any animation not approved via these tokens.

### 8.4 Reduced motion

- Global `prefers-reduced-motion` → disable parallax, reveals render visible instantly, transitions shortened.
- All animation durations come from CSS variables so they can be globally overridden.

### 8.5 Motion library usage

`motion` used **only** for scroll-linked reveals and lightbox transitions. Hovers are pure CSS. This keeps bundle small and main-thread free.

---

## 9. Performance Strategy

Target: Lighthouse **Perf/A11y/SEO/Best Practices ≥ 95**, LCP < 2.0s, CLS < 0.05.

| Area | Strategy |
|---|---|
| **Images** | 100% Cloudinary `f_auto,q_auto,w_<sizes>`, AVIF/WebP, responsive `srcset`, lazy-load below fold (`loading="lazy"`), `decoding="async"`, explicit dimensions. Heroes use `fetchpriority="high"`. |
| **Fonts** | Google Fonts with `preconnect`, `font-display: swap`, self-host + `subset` for the two families, `font-optical-sizing` off. Only 3–4 weight styles loaded. |
| **JS** | Route-level code splitting (`React.lazy`), no giant vendor chunks, `lucide-react` tree-shaken, dayjs-less (native Intl), keep main bundle < 100 KB gz. |
| **CSS** | Tailwind purges unused classes. Design tokens only. No CSS-in-JS runtime. |
| **Render blocking** | Inline critical CSS for above-the-fold; defer non-critical CSS. |
| **CLS** | `aspect-ratio` boxes for all media, `reserve-space` for skeletons, `font-size-adjust`-friendly fallbacks, no late-injected layout. |
| **Caching** | Netlify headers: immutable cache for hashed assets, `stale-while-revalidate` for HTML, CDN for images. |
| **Animations** | Compositor-only (see §8) — zero main-thread jank. |
| **Bundle analysis** | `vite-bundle-visualizer` in CI; dependency budget enforced. |
| **Skeletons** | Route-level skeletons during data fetch (replaces spinners for layout stability). |
| **Analytics** | Loaded after `idle` via `requestIdleCallback`, non-blocking. |

---

## 10. Coding Standards

1. **TypeScript strict** — no `any` (except vetted boundaries), `noUncheckedIndexedAccess` on, explicit returns on exported functions.
2. **No `any`, no `@ts-ignore`** without a documented `// eslint-disable-next-line` reason.
3. **Imports** — grouped & sorted (simple-import-sort): react → packages → alias → relative.
4. **Functions** — prefer small pure functions; co-locate test with logic in `lib/`.
5. **Components** — one concern each; props typed via `interface`; no prop-drilling beyond 2 levels (context/store otherwise).
6. **No magic numbers/strings** — tokens, constants, enums/const objects.
7. **All user-facing text** centralized (constants or i18n-ready structure) to enable translation/CRM later.
8. **No dead code** — ESLint `no-unused-vars` fails CI; removed branches deleted, not commented.
9. **Accessibility-first** — build every component with a11y check (see §17.3).
10. **Conventional commits** — `feat:`, `fix:`, `perf:`, `a11y:`, `chore:`, `docs:`.
11. **PR rules** — CI must pass (lint, typecheck, unit, e2e on changed viewports) before merge; preview URL required.

---

## 11. Component Architecture

### 11.1 Layer model

```
┌──────────────────────────────────────────────┐
│  PAGES        route composition              │
├──────────────────────────────────────────────┤
│  SECTIONS     composite blocks + data hooks  │
├──────────────────────────────────────────────┤
│  LAYOUT       Container, Section, Nav, Footer│
├──────────────────────────────────────────────┤
│  UI           stateless primitives           │
├──────────────────────────────────────────────┤
│  TOKENS       @theme colors/type/space       │
└──────────────────────────────────────────────┘
```

Dependencies point **downward only**. `ui` never imports `sections`; `pages` never call services directly (they use hooks/services).

### 11.2 Reusable component inventory

**UI primitives (`components/ui`)**

```
Button, IconButton, Link (styled anchor), Input, Textarea, Select, Checkbox,
RadioGroup, Label, FieldError, Form (wrapper), Card, Badge, Alert, Table,
Modal, Toast, Toaster (provider), Accordion, Skeleton, Spinner (aria-hidden),
Divider, SectionHeading (eyebrow + title + subtitle), Counter (stat number),
Rating, Chip, Tooltip (non-blocking), Breadcrumb, Pagination, EmptyState
```

**Layout (`components/layout`)**

```
Container, Section, Navbar, MobileDrawer, Footer, StickyCTABar,
ScrollToTop (route change), SkipLink, CookieBanner
```

**Composite sections (`components/sections`)**

```
Hero, StatsStrip, TrustBar (DTCP/RERA/approvals), LocationHighlights,
ProjectsGrid, ProjectCard, ProjectDetailsSections, PremiumPlots,
AmenitiesGrid, AmenityCard, InvestmentSection, Testimonials,
GalleryGrid, GalleryCard, FAQSection, ContactSection, ContactForm,
WhatsAppFloat, CTABand
```

**Rule:** a section that renders a data list receives data via a hook (`useProjects`) — never hardcoded arrays in JSX.

---

## 12. Page Architecture

| Route | Page | Key sections |
|---|---|---|
| `/` | Home | Hero, TrustBar, Stats, Projects preview, Location Highlights, Premium Plots, Amenities, Investment, Testimonials, FAQ preview, CTA, Contact |
| `/projects` | Projects | Filterable grid (status, type, size), sorting |
| `/projects/:slug` | Project Details | Gallery, highlights, plot/price table, amenities, location map embed, RERA/DTCP info, enquiry CTA, related projects |
| `/gallery` | Gallery | Filterable masonry (Cloudinary), lightbox |
| `/about` | About | Story, values, journey timeline, approvals, leadership |
| `/contact` | Contact | Contact form, map, office info, WhatsApp/Call CTAs |
| `/faq` | FAQ | Accessible accordions (SEO-friendly Q&A) |
| `/privacy` · `/terms` | Legal | Plain-language legal pages |
| `*` | 404 | Branded not-found + links |

**Future (planned, not built now):**
- `/invest` (investor landing)
- `/blog` + `/blog/:slug` (SEO content engine, CMS-driven)
- `/admin` (separate shell, §16)

**SEO per page:** title, description, canonical, OG/Twitter, JSON-LD (`RealEstateListing`/`Organization`/`FAQPage`/`BreadcrumbList`), semantic `<main>`, single H1.

---

## 13. Routing & Navigation

### 13.1 Routing

- React Router v7, lazy-loaded routes (`React.lazy`) for code splitting.
- Nested route via `PublicLayout` (Navbar/Footer/SkipLink).
- Scroll restoration on navigation.
- Public marketing pages **pre-rendered** at build (via prerender plugin) so crawlers get full HTML; dynamic content (projects from Xano) hydrates client-side with skeletons.

### 13.2 Navigation model

- Primary nav (≤6 items): Home, Projects, Gallery, About, FAQ, Contact.
- Sticky navbar: transparent over hero → solid ink-900 on scroll.
- Mobile: hamburger → full-screen/overlay drawer with scroll lock + focus management.
- Sticky "Enquire" CTA appears mobile after scroll (one per view, doesn't obscure content).
- Footer: 4 columns (Brand+trust, Explore, Resources, Contact+socials).

---

## 14. State Management & Data Flow

### 14.1 Two-layer state

| Layer | Tool | Scope |
|---|---|---|
| **Server state** | TanStack Query | Projects, gallery, content, leads POST |
| **Client/UI state** | Zustand + local | Modal open, mobile drawer, filters, theme |

### 14.2 Data flow

```
Page → Hook (useProjects) → Query (cache, retry, staleTime)
                              ↓
                     services/projects.api.ts → api-client → Xano (or env backend)
```

- The **only** place aware of Xano is `services/*`.
- DTO mappers in `services` convert Xano fields → typed frontend models, so swapping backends never touches components.
- All queries have `staleTime`, error boundaries per query, and skeletons.
- No global mutable caches; Query invalidates lead form on success.

---

## 15. Backend Readiness & Xano Integration Plan

### 15.1 Why this frontend is ready today

- **Contract-first:** `types/` mirror Xano schemas (`projects`, `leads`, `gallery`, `site_content`).
- **Seamless swap:** `services/` is the single integration point. Today it can serve static data or a mock; tomorrow it points at Xano by env.
- **Env-driven:** `VITE_API_URL` + Zod validation. No URLs hardcoded.
- **Auth-ready:** `api-client` has an `Authorization` injection point for JWT (Xano auth) without UI changes.

### 15.2 Xano API surface (planned)

| Endpoint | Purpose | Frontend consumer |
|---|---|---|
| `GET /projects` (+ filters/pagination) | Project listings | Projects page, Home |
| `GET /projects/:slug` | Project detail | Project Details |
| `GET /gallery` | Gallery images | Gallery |
| `GET /site_content` (by key) | Hero, stats, amenities, testimonials copy | All pages (CMS) |
| `POST /leads` | Enquiry/brochure/site-visit | Contact form, CTA band |
| `GET /faq` | FAQ items | FAQ page |

### 15.3 Contract examples

```ts
// types/project.ts
interface Project {
  id: string;
  slug: string;
  title: string;
  status: "available" | "premium" | "launching" | "sold-out";
  plotSizes: string[];        // "12x24", "12x30"…
  startingPriceInr: number;   // 0 = contact us
  images: CloudinaryImage[];
  amenities: string[];
  location: { lat: number; lng: number; mapQuery: string };
  approvals: string[];        // ["DTCP", "RERA"]
  isFeatured: boolean;
}

// types/lead.ts
interface Lead {
  name: string;
  phone: string;
  email?: string;
  interest: "site-visit" | "brochure" | "invest" | "general";
  projectSlug?: string;
  budget?: string;
  message?: string;
  consent: boolean;
  source: string;             // utm / page, set server-side or client
}
```

### 15.4 Integration phases

1. **Now (Phase 2–3):** UI against a typed **mock service layer** (or Vite dev proxy to Xano). Zero UI rewrites later.
2. **Phase 4:** Point `services` at Xano; add pagination, server-side filtering, image CDN wiring.
3. **Phase 5 (auth):** `POST /leads` with Xano rate limiting, honeypot, server relay via Netlify Function (optional but recommended to protect the endpoint).
4. **Phase 6 (admin):** Admin-only routes + Xano auth (JWT) + role-based views.

### 15.5 Anti-hardcode rules

- Zero URLs, phone numbers, or pricing in component code — all from `constants/site.ts` or API.
- Content that marketing will edit (hero copy, stats, amenities, testimonials, FAQ) lives behind `site_content` — not in JSX.
- All lists render from data, never from hand-typed `<div>` repetitions.

---

## 16. Admin Dashboard Planning

**Planned architecture only — no implementation in this phase.**

### 16.1 Shape

- Separate route group under `/admin`, protected by **route guard + role-based gate** (Xano auth).
- `AdminLayout` (sidebar shell) — distinct but on-brand (ink-900 sidebar, gold active states).
- Deployed under the same app; guarded purely client-side + server-authoritative in Xano (frontend never trusted).

### 16.2 Modules (future)

| Module | CRUD targets |
|---|---|
| Projects | Create/edit/delete, status, images (Cloudinary upload), featured flag |
| Gallery | Upload, reorder, tags |
| Leads | List, filter, export CSV, status workflow |
| Site Content | Edit hero/stats/amenities copy per key |
| FAQ | CRUD |
| Analytics | Read-only dashboards (conversions) |

### 16.3 Prepared frontend contracts

- `useAuth()` hook + `AuthProvider` (later) — isolated in `services`, no UI coupling.
- Tables use the tokenized `Table` component (§5.13) so admin tables inherit style for free.
- All admin mutations go through TanStack Query mutations with optimistic updates + toast.

---

## 17. Error Handling, Monitoring & Security

### 17.1 Errors

- Global `ErrorBoundary` per route (friendly branded fallback, reload CTA).
- API errors normalized to a typed `ApiError` shape; UI shows contextual alerts, never raw exceptions.
- Form submissions: inline validation + server-error surface; **never** lose user input on failure.

### 17.2 Monitoring (production)

- Sentry (frontend) optional but recommended for the lead pipeline.
- Netlify function + Xano error logging for `POST /leads`.

### 17.3 Security baseline

- **Forms:** RHF + Zod validation on client; **honeypot field**; optional Netlify server relay; Xano rate limiting; `consent` required; no PII logged.
- **XSS:** React auto-escaping; no `dangerouslySetInnerHTML` without sanitization; JSON-LD and meta strings escaped.
- **Secrets:** nothing sensitive in client code; all keys server-side (Netlify env / Xano). `.env.example` only; `.env` gitignored.
- **Headers:** strict CSP, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`, HSTS via Netlify headers.
- **Auth (future):** JWT in memory (not localStorage), short-lived tokens, refresh rotation, RBAC server-enforced.
- **CLS/UX security:** no clickjacking surface (CSP frame-ancestors), no open redirects.

### 17.4 Accessibility checklist (build-in, not bolted-on)

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section aria-labelledby>`.
- Strict heading hierarchy: exactly one H1 per page, no skipped levels.
- All interactive elements keyboard-accessible, visible `:focus-visible` gold rings.
- Skip link, ARIA on drawer/modal/accordion/toast, labels on every input.
- Alt text meaningful; decorative images `alt=""`.
- Contrast verified in §5.2; automated axe checks in CI + manual keyboard pass in QA.

---

## 18. Deployment & CI/CD

### 18.1 Netlify

- CI: GitHub Actions → lint, typecheck, unit, build, e2e (viewport matrix) → preview deploy.
- Production deploy on main merge (atomic).
- Headers: immutable hashed assets, SWR HTML, image CDN cache, security headers.
- Redirects: trailing slash, `www`→apex, 404 SPA fallback for client routes.

### 18.2 Environments

```
dev   → local (Vite dev, mock/Xano dev proxy)
preview → PR preview (staging Xano)
prod  → production Xano + analytics + Sentry
```

Env-driven config validates at boot; missing vars fail loudly in CI.

---

## 19. Architectural Decisions & Rationale

| # | Decision | WHY |
|---|---|---|
| D1 | React + TypeScript + Vite | Best ecosystem for a componentized luxury site; typed contracts are the foundation for Xano; Vite is the fastest modern build tool. |
| D2 | Tailwind v4 design tokens | Single source of truth for the design system in CSS; tree-shaken output; theming without CSS-in-JS runtime cost. |
| D3 | Services layer as sole network boundary | Enables the mock→Xano→future-CMS journey with zero UI rewrites; testable; swap-proof. |
| D4 | TanStack Query for server state | Solves caching/retries/refetch for APIs; turns every page into a data-driven surface. |
| D5 | `motion` only for reveals, CSS for hovers | 90% of motion is GPU-cheap CSS; keeps bundle tiny and main thread free (Lighthouse 95+). |
| D6 | Cloudinary for all imagery | Responsive AVIF/WebP, transformations, CDN, eager optimization — image is the #1 perf lever on a real-estate site. |
| D7 | Prerender marketing pages | SEO ≥95 on a React SPA requires crawlable HTML; prerendering gives SSG benefits without a server runtime. |
| D8 | Sharp radius + serif/sans pairing | Differentiator from template real-estate sites; reads bespoke and expensive. |
| D9 | Strict mobile-first, fluid type, aspect-ratio media | Eliminates the entire class of responsive/CLS bugs before they exist. |
| D10 | Honeypot + server relay for leads | Real-estate lead forms are spam magnets; defense-in-depth protects the client's lead quality and Xano usage. |
| D11 | One `components/ui` library | Every new page reuses tokens; no drift, no duplicated CSS/JSX. |
| D12 | Env-driven config with Zod | Fail-fast builds prevent "works on my machine" and accidental prod-key leakage. |
| D13 | Admin as guarded route group, not separate codebase | One codebase, one deploy pipeline; frontend claims are fine because Xano is the security authority. |
| D14 | i18n-ready text structure | Audience includes NRIs; centralizing copy makes a future multilingual release cheap. |

---

## 20. Phased Implementation Roadmap

> **Gate rule:** each phase ends with approval + Lighthouse/e2e green.

- **Phase 1 (this doc):** Foundation approved.
- **Phase 2 — Scaffold & tokens:** Vite + React + TS + Tailwind v4; tokens; layout primitives (Container, Section, Navbar, Footer, SkipLink); CI.
- **Phase 3 — Design system components:** `ui/*` library + stories + a11y + unit tests.
- **Phase 4 — Public pages (static data layer):** Home, Projects, Gallery, About, Contact, FAQ, Legal; sections inventory; responsive matrix e2e; SEO meta + JSON-LD; prerendering.
- **Phase 5 — Xano integration:** services wiring, pagination, lead submission + validation + spam protection, error states.
- **Phase 6 — Admin:** auth, `/admin`, projects/gallery/leads/content CRUD.
- **Phase 7 — Hardening:** Sentry, analytics, CSP review, Lighthouse final pass, load test.

---

## 21. Approval Checklist

Confirm the following before implementation begins:

- [ ] Tech stack approved (§2)
- [ ] Folder structure approved (§3)
- [ ] Design tokens approved (§5) — colors, type, spacing, radius, shadows
- [ ] Button/input/card/modal specifications approved (§5.7–5.16)
- [ ] Theme direction approved (§6)
- [ ] Responsive matrix approved (§7)
- [ ] Animation rules approved (§8)
- [ ] Performance targets approved (§9)
- [ ] Component inventory approved (§11)
- [ ] Page inventory & navigation approved (§12–13)
- [ ] Backend/Xano plan approved (§15)
- [ ] Admin scope approved (§16)
- [ ] Security & accessibility baselines approved (§17)

---

*End of Project Foundation document. Next action: review, amend, approve — then begin Phase 2 (scaffold).*
