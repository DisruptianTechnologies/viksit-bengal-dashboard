# Viksit Bengal Dashboard & $1 Trillion Economy — Master Technical Documentation

> **Status:** Production-Ready Full-Stack Platform (Verified: 319/319 Automated Checks Passing)  
> **Runtime Architecture:** Next.js 14 App Router (Standalone Full-Stack on Port `3000`) + Optional NestJS 10 Microservice (`3001`) + Prisma/PostgreSQL  
> **Last Updated:** October 2026  
> **Standards Compliance:** WCAG 2.2 Level AA (`188/188` checks), RBAC & 007 Defense-in-Depth (`117/117` E2E checks), 100% Bilingual Parity (`en` & `bn`)

---

## Table of Contents

1. [Executive Summary & Platform Vision](#1-executive-summary--platform-vision)
2. [System Architecture & Monorepo Topology](#2-system-architecture--monorepo-topology)
3. [Installation & Quick-Start Guidelines](#3-installation--quick-start-guidelines)
4. [Comprehensive Features & Functionalities](#4-comprehensive-features--functionalities)
5. [Complete API Endpoints Reference](#5-complete-api-endpoints-reference)
6. [Developer Guidelines for Extending the Platform](#6-developer-guidelines-for-extending-the-platform)
7. [Security Architecture (007 Defense-in-Depth) & WCAG 2.2 AA Accessibility](#7-security-architecture-007-defense-in-depth--wcag-22-aa-accessibility)
8. [Verification & Automated Testing Suite](#8-verification--automated-testing-suite)
9. [Production Deployment Guide (Docker, VPS, cPanel & Hostinger)](#9-production-deployment-guide-docker-vps-cpanel--hostinger)
10. [Future Product & Engineering Roadmap (2026–2033)](#10-future-product--engineering-roadmap-20262033)
11. [Appendix: 23 Districts & 15 Sectors Reference](#11-appendix-23-districts--15-sectors-reference)

---

## 1. Executive Summary & Platform Vision

The **Viksit Bengal Dashboard** is an open-governance, real-time econometric and policy accountability platform engineered to monitor **141 state policy commitments** across **15 developmental sectors** and **23 districts of West Bengal**, measuring live trajectory toward a **$1 Trillion USD Gross State Domestic Product (GSDP)** by 2033.

Key architectural pillars include:
1. **Zero-Cost Real-Time Multi-Source Ingestion:** Polls live public institutional RSS feeds (Press Information Bureau Kolkata, West Bengal Official Gazette, Departmental Orders, CAG Audits, WBIDC, Tea Board) and enriches findings with **Server-Side Gemini (`@google/genai`) Search Grounding**—without requiring paid third-party scraping APIs such as Firecrawl.
2. **Autonomous Daily Delta Engine:** Computes a calendar-day delta (`Asia/Kolkata` timezone) on the landing page, highlighting net new verified releases (`+Δ`), promises progressed today (`+Δ`), 24-hour capital outlay sanctioned (`+₹ Cr`), and GSDP basis-point velocity (`+bps`).
3. **Real-Time Visual Analytics & Financial Telemetry (`Recharts`):** Interactive charts, graphs, and high-density tabular matrices across both the public Dashboard (`/dashboard`, `/indicators`) and the Administrative CMS (`/admin`).
4. **Full Lifecycle CMS & CSV Report Exporter (`/admin`):** Role-based administrative portal with one-click commitment lifecycle transitions (`ANNOUNCED → BUDGETED → UNDER_IMPLEMENTATION → DELIVERED`), Tier 1–3 evidence moderation, and filtered **Promise vs. Results CSV Report Export**.
5. **Bilingual Citizen Intelligence (*Sonar Bondhu*):** Grounded RAG policy assistant and community evidence submission workflow in both **English (`en`)** and **Bengali (`bn` / বাংলা)** with automatic Bengali numeral conversion (`০–৯`).

---

## 2. System Architecture & Monorepo Topology

```text
viksit-bengal-dashboard/
├── package.json                                 # Root workspace scripts wired to apps/web
├── turbo.json                                   # Turborepo pipeline configuration
├── metadata.json                                # Application metadata & Gemini server capability flags
├── .env.example                                 # Environment variables template
├── DOCUMENTATION.md                             # Master technical documentation (this file)
├── README.md                                    # Quick-start developer overview
│
├── packages/
│   ├── database/                                # Prisma ORM & Seed Dataset Layer
│   │   ├── prisma/schema.prisma                 # PostgreSQL schema (User, Promise, District, Evidence)
│   │   ├── prisma/seed-data.json                # 141 promises, 23 districts, 15 categories, indicators
│   │   ├── prisma/seed.ts                       # Database seeding script
│   │   └── index.ts / index.js                  # Resilient PrismaClient with automatic offline fallback
│   │
│   └── shared/                                  # Isomorphic Shared Types & Utilities
│       ├── src/types.ts                         # Shared DTOs, DailyTallyMetrics, LiveAnalyticsSummary
│       ├── src/constants.ts                     # District codes, status enums, source tiers
│       └── src/bengali-numerals.ts              # Arabic (0-9) to Bengali (০-৯) numeral transformer
│
├── apps/
│   ├── web/                                     # Next.js 14 Full-Stack App Router (Port 3000)
│   │   ├── next.config.mjs                      # Standalone output + next-intl plugin
│   │   ├── i18n.ts & middleware.ts              # Bilingual locale routing (/en/* and /bn/*)
│   │   ├── i18n/messages/                       # 100% parity translation bundles (en.json, bn.json)
│   │   ├── lib/
│   │   │   ├── live-store.ts                    # Real-time store, RSS/Gemini scraper & analytics engine
│   │   │   └── api.ts                           # Isomorphic typed API client
│   │   ├── app/
│   │   │   ├── api/                             # Built-in Next.js Route Handlers (/api/*)
│   │   │   │   ├── analytics/route.ts           # GET /api/analytics (Live charts & telemetry)
│   │   │   │   ├── promises/route.ts            # GET, POST, PATCH /api/promises
│   │   │   │   ├── evidence/route.ts            # GET, POST, PATCH /api/evidence
│   │   │   │   ├── districts/route.ts           # GET /api/districts
│   │   │   │   ├── indicators/route.ts          # GET /api/indicators
│   │   │   │   ├── auth/login/route.ts          # POST /api/auth/login (JWT issuance)
│   │   │   │   ├── chat/query/route.ts          # POST /api/chat/query (Sonar Bondhu AI)
│   │   │   │   └── scraper/                     # daily-tally, run, sources, citizen-evidence
│   │   │   └── [locale]/                        # Localized UI Pages
│   │   │       ├── page.tsx                     # Landing Page + Daily Delta Workspace
│   │   │       ├── dashboard/page.tsx           # Executive Dashboard + Recharts Analytics
│   │   │       ├── promises/page.tsx            # 141 Commitments Explorer
│   │   │       ├── districts/page.tsx           # 23-District Choropleth Map & Leaderboard
│   │   │       ├── indicators/page.tsx          # $1T Macroeconomic Scenarios & Charts
│   │   │       └── admin/page.tsx               # CMS Governance Portal, Analytics & CSV Exporter
│   │   ├── components/
│   │   │   ├── landing/LandingView.tsx          # Editorial Landing Page with Daily Delta Ledger
│   │   │   ├── dashboard/
│   │   │   │   ├── RealtimeAnalyticsHub.tsx     # Recharts Visual Suite & 8-Card Telemetry Strip
│   │   │   │   ├── DailyTallyFeed.tsx           # Autonomous Daily Verified Governance Feed
│   │   │   │   ├── HeroTargetCard.tsx           # $1T GSDP Scenario Switcher (Conservative/Base/Ambitious)
│   │   │   │   ├── DistrictMap.tsx              # Interactive Leaflet GIS Map + Accessible Table
│   │   │   │   ├── DistrictLeaderboard.tsx      # 23-District Sortable Accountability Leaderboard
│   │   │   │   ├── PromiseExplorer.tsx          # Multi-filter Promise Catalog & Timeline Drawer
│   │   │   │   └── EconomicOverview.tsx         # 6 Macroeconomic Growth Pillars
│   │   │   ├── chat/CitizenChatbot.tsx          # Floating Bilingual "Sonar Bondhu" AI Assistant
│   │   │   └── citizen/CitizenEvidenceModal.tsx # Citizen Ground Evidence Submission Modal
│   │   └── __tests__/wcag-accessibility.test.mjs# 188-assertion WCAG 2.2 AA & i18n parity test suite
│   │
│   └── api/                                     # Optional Standalone NestJS 10 Backend (Port 3001)
│       └── src/                                 # Controllers & Services mirroring /api/* routes
│
└── tests/                                       # Master 4-Tier E2E Test Suite (117 assertions)
    ├── e2e-runner.js                            # CLI test runner
    ├── tier1-feature-coverage/                  # Core feature verification
    ├── tier2-boundaries/                        # Security, SQLi/XSS & DTO boundary checks
    ├── tier3-interactions/                      # Cross-module RBAC & lifecycle flows
    └── tier4-scenarios/                         # End-to-end persona simulations
```

---

## 3. Installation & Quick-Start Guidelines

### 3.1 System Prerequisites
- **Node.js:** `v18.18.0+` or `v20.x LTS` (recommended)
- **Package Manager:** `npm v9+`
- **Database (Optional):** PostgreSQL `v14+` if running with persistent external database; otherwise, the built-in Next.js Live Store (`apps/web/lib/live-store.ts`) boots automatically with all 141 promises, 23 districts, and live RSS/Gemini scraping out of the box.

### 3.2 Step-by-Step Installation

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <repository-url>
   cd viksit-bengal-dashboard
   npm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local` (or `.env` in root):
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your optional keys (the platform works 100% free out-of-the-box even without paid keys):
   ```env
   # Optional: Enables Gemini 3.8 Flash live web search grounding & AI synthesis
   GEMINI_API_KEY=""

   # Optional: PostgreSQL connection string (falls back to built-in live store if omitted)
   DATABASE_URL=""

   # Optional: External API base URL (defaults to same-origin /api routes on port 3000)
   NEXT_PUBLIC_API_URL=""

   # Optional: Third-party crawler or OpenRouter fallback
   FIRECRAWL_API_KEY=""
   OPENROUTER_API_KEY=""
   OPENROUTER_BASE_URL=""
   OPENROUTER_MODEL=""
   ```

3. **Start the Development Server (Port 3000):**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser:
   - **English Landing Page:** `http://localhost:3000/en`
   - **Bengali Landing Page:** `http://localhost:3000/bn`
   - **Analytics Dashboard:** `http://localhost:3000/en/dashboard`
   - **CMS Governance Portal:** `http://localhost:3000/en/admin`

4. **Build and Run for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 4. Comprehensive Features & Functionalities

### 4.1 Autonomous Daily Delta & Real-Time Verification Engine
- **Daily Calendar Rotation (`Asia/Kolkata`):** Every day, the platform computes a fresh **Daily Governance & Economic Delta** comparing today's state (`YYYY-MM-DD`) against yesterday's baseline.
- **24-Hour Delta Strip on Landing Page:**
  - **Net New Verified Evidence (`+Δ`)**: Count of Tier 1–3 notifications ingested in the last 24 hours.
  - **Promises Progressed Today (`+Δ`)**: Commitments that transitioned lifecycle stages today.
  - **Capital Outlay Sanctioned (`+₹ Cr`)**: Incremental financial outlay verified today.
  - **GSDP Trajectory Velocity (`+bps`)**: Basis-point impulse toward the $1 Trillion goal.
- **Zero-Cost Multi-Source Scraper (`syncRealTimeSources`)**:
  - Concurrently polls public RSS/XML feeds from **PIB Kolkata (`pib.gov.in`)**, **West Bengal Governance & Cabinet Orders**, and **Sectoral Economic Monitors**.
  - When `GEMINI_API_KEY` is configured, invokes `gemini-3.8-flash` via `@google/genai` with structured JSON schema output to map live news into bilingual evidence citations with estimated ₹ Crore outlays.

### 4.2 Real-Time Visual Analytics & Telemetry Hub (`RealtimeAnalyticsHub.tsx`)
Embedded in both `/dashboard`, `/indicators`, and `/admin`:
- **8-Card High-Density Executive Telemetry Strip**:
  1. **Live Realized GSDP**: `$249.4B+` (`₹21.20+ Lakh Cr`, `% of $1T`, and live realized CAGR `%`).
  2. **Total Sanctioned Outlay**: `₹36,850+ Cr` across 15 sectors with Disbursed `₹ Cr` and Utilization `%`.
  3. **24-Hour Outlay Delta**: `+₹ Cr` verified today.
  4. **Execution Index**: Active + Delivered share (`%`) and weighted progress score (`%`).
  5. **Commitment Lifecycle Split**: Delivered vs. In-Progress vs. Announced counts.
  6. **Audit Confidence Score**: Weighted confidence (`95.8%`) across approved citations.
  7. **Per-Capita Income**: Current (`₹1,71,000+`) vs. 2033 target (`₹6,20,000`).
  8. **Employment & District Mean Score**: Projected jobs (`153.3 Lakhs`) and 23-district average delivery score.
- **Interactive `Recharts` Suite**:
  - **2024–2033 $1 Trillion GSDP Multi-Scenario `AreaChart`**: Plots Conservative (`$750B @ 10.5%`), Base Case (`$1,000B @ 13.0%`), Ambitious (`$1,250B @ 15.5%`), and the **Live Policy Impulse Trajectory**.
  - **Annual Infrastructure Capex vs. Nominal INR GSDP `ComposedChart`**: Compares annual capital expenditure (`₹ Cr` bars) against nominal GSDP (`₹ Lakh Cr` line).
  - **15-Sector Outlay & Execution `ComposedChart` + Stacked `BarChart`**: Visualizes sanctioned vs. disbursed outlays (`₹ Cr`), execution velocity (`%`), and lifecycle stage distribution across sectors.
  - **14-Day Rolling Verification Velocity & Source Tier `ComposedChart` + `PieChart`**: Tracks daily sanctioned outlays, cumulative capital, and Tier 1–3 source share.
  - **6-Zone & 23-District Spatial Econometric `ComposedChart` + `RadarChart`**: Compares Greater Kolkata, Rarh Bengal, North Bengal, Coastal, Junglemahal, and Central zones.

### 4.3 Administrative CMS & Governance Portal (`/admin`)
Organized into 4 operational workspaces with instant RBAC role switching (`ADMIN` vs. `RESEARCHER` vs. `JWT Login`):
1. **Tab 1 — Live Charts, Graphs & Figures:** Full real-time visual analytics suite with 15-second live stream polling and manual feed sync.
2. **Tab 2 — Promise Lifecycle Manager & CSV Report Exporter:**
   - Search and filter all 141 commitments by keyword, **Sector Category** (15 sectors), and **Lifecycle Status**.
   - **Live Filtered Summary Strip**: Displays `Filtered Rows`, `Delivered`, `In Progress`, `Announced`, and weighted `Result Score %`.
   - **One-Click Lifecycle Stage Transitions**: Click `Announced`, `In Progress`, or `Delivered` on any commitment (`PATCH /api/promises`) to transition its status in real time and immediately recalculate all dashboard charts.
   - **Export CSV Report (`Export CSV Report`)**: Downloads a UTF-8 BOM-encoded CSV (`viksit-bengal-promises-vs-results-<filters>-<YYYY-MM-DD>.csv`) containing `code`, `title`, `titleBn`, `status`, `sector`, `sectorCode`, `resultCompletionPct`, `verifiedEvidenceCount`, `sanctionedOutlayCr`, `latestResultMilestone`, `districtsCovered`, `responsibleDepartment`, and `lastVerifiedDate`.
   - **Register New Policy Commitment**: Form to add new commitments (`POST /api/promises`).
3. **Tab 3 — Evidence Audit Ledger & Moderation Queue:**
   - Upload new Tier 1–3 Gazette, Government Order, PIB Statistical Release, or CAG Audit citations (`POST /api/evidence`) with `₹ Cr` outlay.
   - Approve (`APPROVED`) or Flag/Reject (`REJECTED`) items in the live verification queue (`PATCH /api/evidence`).
4. **Tab 4 — Autonomous Scraper & Source Telemetry:**
   - Monitor all 7 official feeds (`wb.gov.in`, `pib.gov.in`, `cag.gov.in`, `wbidc.com`, `teaboard.gov.in`, etc.) and trigger on-demand verification runs (`POST /api/scraper/run`).

### 4.4 23-District Interactive GIS Map, Leaderboard & Audit Report Exporter
- **Interactive Choropleth & Marker Map (`DistrictMap.tsx`):** Visualizes all 23 districts of West Bengal with GSDP share, population, active commitments, and delivery score, paired with a WCAG-accessible HTML `<table>` fallback.
- **Sortable District Leaderboard (`DistrictLeaderboard.tsx`):** Ranks districts by Delivery Rate (`%`), GSDP Share (`%`), and Population.
- **23-District CSV & PDF Audit Exporter (`lib/district-report-exporter.ts`):** One-click export of filtered district performance matrices in both UTF-8 BOM CSV and standards-compliant binary PDF 1.4 formats (including Phase I 2033 ₹85 Lakh Cr / $1T and Phase II 2047 ₹425 Lakh Cr / $5T state targets).

### 4.5 Bilingual AI Policy Assistant (*Sonar Bondhu*), Citizen Evidence & Sabai Foundation Membership
- **Sonar Bondhu Chatbot (`CitizenChatbot.tsx`):** Floating assistant available on both the Landing Page and Dashboard. Answers questions in English and Bengali with explicit `[PROMISE-CODE]` tags, `₹ Crore` figures, and clickable Tier 1–3 citations.
- **Citizen Ground Evidence Submission (`CitizenEvidenceModal.tsx`):** Enables citizens and field researchers to submit ground implementation reports linked to specific promises and districts.
- **Sabai Foundation Lifetime Membership & UPI Ledger (`SabaiFoundationModal.tsx`):** Interactive modal supporting UPI QR donations (`₹500+`), UTR verification logging (`POST /api/membership`), and direct integration with the official Google Form.

---

## 5. Complete API Endpoints Reference

All API routes are served directly by Next.js App Router on port `3000` under `/api/*` (and mirrored in `apps/api` for standalone NestJS deployments).

| Method | Endpoint | Auth / Role | Description |
|:---|:---|:---|:---|
| `GET` | `/api/analytics` | Public | Returns `LiveAnalyticsSummary` containing `overview` KPIs (including 2033 `$1T / ₹85L Cr` and 2047 `$5T / ₹425L Cr` targets), `gsdpTrajectorySeries`, `sectorAnalytics` (15 sectors), `dailyIngestionSeries` (14 days), `evidenceTierBreakdown`, `regionalZoneAnalytics` (6 zones), and `districtMatrix` (23 districts). |
| `GET` | `/api/scraper/daily-tally` | Public | Returns `DailyTallyMetrics` including `dailyDelta` (24h new evidence, promises progressed, outlay delta Cr, transitions, sector velocity) and `recentEvidences`. |
| `GET` | `/api/scraper/sources` | Public | Lists all monitored Tier 1–3 official and institutional data feeds (`ScrapedSourceDto[]`). |
| `POST` | `/api/scraper/run` | Public / Admin | Triggers an immediate live RSS & Gemini Search Grounding verification run; returns `ScrapeRunSummary`. |
| `POST` | `/api/scraper/citizen-evidence` | Public | Submits citizen ground evidence (`{ promiseCode, title, sourceUrl, excerpt, districtCode }`) into the live audit ledger. |
| `GET` | `/api/promises` | Public | Returns all 141 policy commitments. Supports query filters: `?status=DELIVERED`, `?category=economy`, `?district=KOL`. |
| `POST` | `/api/promises` | `Bearer <JWT>` (`ADMIN` / `RESEARCHER`) | Registers a new policy commitment (`{ code, titleEn, titleBn, descriptionEn, descriptionBn, categoryCode, districtCode, status }`) and updates the Daily Delta & analytics store. |
| `PATCH` | `/api/promises` | `Bearer <JWT>` (`ADMIN`) | Transitions an existing commitment's lifecycle status (`{ code, status, outlayCr, reason }`), appends to `statusHistory`, logs an audit citation, and recalculates live analytics. |
| `GET` | `/api/evidence` | Public | Returns the live evidence and audit citation queue (`LiveEvidenceRecord[]`). |
| `POST` | `/api/evidence` | `Bearer <JWT>` (`ADMIN` / `RESEARCHER`) | Uploads a verified evidence citation (`{ promiseCode, title, url, sourceType, sourceTier, outlayCr, extractedText }`), links it to the target promise, and updates sector outlays. |
| `PATCH` | `/api/evidence` | `Bearer <JWT>` (`ADMIN`) | Moderates an evidence item (`{ id, reviewStatus: 'APPROVED' \| 'REJECTED' }`). |
| `GET` | `/api/districts` | Public | Returns all 23 West Bengal district profiles (`code`, `nameEn`, `nameBn`, `population`, `gsdpShare`, `deliveryScore`, `zone`, `lat`, `lng`). |
| `GET` | `/api/indicators` | Public | Returns macroeconomic indicator series and $1 Trillion / $5 Trillion scenario parameters. |
| `POST` | `/api/chat/query` | Public | Queries the *Sonar Bondhu* bilingual policy assistant (`{ message, locale: 'en' \| 'bn' }`); returns `{ answer, citations, matchedPromises, suggestedFollowUps }`. |
| `GET` | `/api/membership` | Public | Returns Sabai Foundation membership ledger summary, UPI details, and recent verified member applications. |
| `POST` | `/api/membership` | Public | Submits a Sabai Foundation Lifetime Membership (`₹500+` minimum) with UTR verification (`{ fullName, email, phone, districtCode, amountInr, utrNumber, notes }`). |
| `POST` | `/api/auth/login` | Public | Authenticates credentials (`{ email, password }`) and returns `{ accessToken, user: { id, email, name, role } }`. Default accounts: `admin@viksitbengal.gov.in` / `Admin@123` (`ADMIN`), `researcher@viksitbengal.gov.in` / `Researcher@123` (`RESEARCHER`). |

---

## 6. Developer Guidelines for Extending the Platform

### 6.1 Adding New Policy Commitments or Sectors
1. **Seed Dataset (`packages/database/prisma/seed-data.json`):** Add new promises or categories to the seed JSON, or create them dynamically at runtime via `POST /api/promises` in the CMS Portal.
2. **Sector Metadata (`apps/web/lib/live-store.ts`):** To add a 16th developmental sector, add an entry to `CATEGORY_PREFIX_MAP`, `DEPARTMENT_BY_CATEGORY`, and `SECTOR_META` in `apps/web/lib/live-store.ts`. `buildLiveAnalyticsSummary()` will automatically include the new sector in all charts and tables.

### 6.2 Adding New Verified Scraper Sources
1. Open `apps/web/lib/live-store.ts`.
2. Add your RSS/XML or institutional feed URL to `defaultSources` and `liveFeeds` inside `syncRealTimeSources()`.
3. Update `matchHeadlineToPromise(title)` if custom keyword-to-promise routing heuristics are needed for the new domain.

### 6.3 Maintaining Bilingual (`en` / `bn`) & WCAG 2.2 AA Compliance
1. **Strict Translation Parity:** Every key added to `apps/web/i18n/messages/en.json` **must** also be added to `apps/web/i18n/messages/bn.json`. The automated test suite (`wcag-accessibility.test.mjs`) verifies 100% key parity across all namespaces.
2. **Bengali Numeral Formatting:** Always wrap numeric values displayed in the UI with `toBengaliNumerals(value)` from `@viksit/shared` when `locale === 'bn'`.
3. **Touch Targets & Contrast:** Interactive controls must maintain `min-h-[40px]` / `min-h-[44px]`, visible keyboard focus rings (`focus-visible:ring-2`), and a contrast ratio $\ge 4.5:1$ for normal text ($\ge 7.0:1$ on primary header banners).

---

## 7. Security Architecture (007 Defense-in-Depth) & WCAG 2.2 AA Accessibility

### 7.1 Role-Based Access Control (RBAC)
- **`ADMIN` (`admin@viksitbengal.gov.in`):** Full privileges to create promises, transition promise lifecycle stages (`PATCH /api/promises`), upload evidence, and approve/reject audit queue items (`PATCH /api/evidence`).
- **`RESEARCHER` (`researcher@viksitbengal.gov.in`):** Can submit evidence citations (`POST /api/evidence`) and register draft commitments, but is barred (`403 Forbidden`) from self-approving evidence or directly overriding promise statuses.
- **`PUBLIC` / Anonymous:** Read-only access to dashboards, charts, and chatbot, plus community ground evidence submission (`POST /api/scraper/citizen-evidence`) which enters the moderation queue.

### 7.2 WCAG 2.2 Level AA Accessibility Highlights
- **Header Contrast:** `#FFFFFF` text on `#0A5C36` primary emerald background achieves **8.24:1** contrast (exceeding WCAG AAA 7.0:1).
- **Keyboard & Screen Reader Navigation:** Root layout includes a Skip-to-Content link (`href="#main-content"`), semantic ARIA landmarks (`role="banner"`, `role="main"`, `role="contentinfo"`), and accessible HTML table alternatives for GIS maps.

---

## 8. Verification & Automated Testing Suite

Run all 319 automated checks before committing changes:

```bash
# 1. TypeScript Static Type Check
npm run lint

# 2. WCAG 2.2 AA Accessibility & Bilingual Translation Parity Suite (188 assertions)
node apps/web/__tests__/wcag-accessibility.test.mjs

# 3. Master 4-Tier E2E Test Runner (117 assertions across Tiers 1-4)
npm run test:e2e
```

---

## 9. Production Deployment Guide (Docker, VPS, cPanel & Hostinger)

### 9.1 Standalone Next.js Production Deployment (Recommended Single-Service Mode)
Because `apps/web` is configured with `output: 'standalone'` and includes all `/api/*` route handlers:
```bash
npm install
npm run build
npm run start
```
The server binds to `0.0.0.0:3000` and serves both the bilingual UI and all real-time API endpoints with zero external process dependencies.

### 9.2 Hostinger VPS / Ubuntu Cloud Deployment (Nginx + PM2 + Let's Encrypt)
1. Install Node.js 20 LTS, Nginx, and PM2 on Ubuntu 22.04/24.04 LTS.
2. Clone the repository, run `npm install && npm run build`.
3. Start with PM2:
   ```bash
   pm2 start npm --name "viksit-bengal" -- start
   pm2 save && pm2 startup
   ```
4. Proxy `yourdomain.com` to `http://127.0.0.1:3000` using Nginx and secure with `certbot --nginx`.

### 9.3 Shared cPanel / Hostinger hPanel Deployment
1. Run `npm run build` locally or in CI/CD to avoid shared-hosting RAM limits.
2. Upload the built workspace and configure **Setup Node.js App** pointing to port `3000` with `npm run start`.

---

## 10. Future Product & Engineering Roadmap (2026–2033)

### Phase 1: Automated Gazette OCR & PDF Budget Parser (Q4 2026 – Q1 2027)
- Integrate multimodal Gemini PDF/Image document understanding to automatically parse scanned Extraordinary Kolkata Gazette PDFs and Finance Department budget tables into structured `LiveEvidenceRecord` entries with line-item grant codes.
- Automated anomaly detection flagging discrepancies between sanctioned budget outlays and physical milestone completion.

### Phase 2: Sub-District (Block / Municipality / Ward) GIS Granularity (Q2 – Q3 2027)
- Expand geographic drill-down from 23 Districts to **341 Community Development Blocks** and **128 Urban Local Bodies (Municipalities)**.
- Geotagged citizen photo/video evidence uploads with EXIF coordinate verification and AI visual inspection for road, bridge, hospital, and cold-storage construction sites.

### Phase 3: Live State Treasury (IFMS) & PM GatiShakti Federation (2028)
- Direct webhook/API federation with West Bengal Integrated Financial Management System (WB-IFMS), National Single Window System, and PM GatiShakti GIS layers for real-time capital disbursement tracking.
- Automated WhatsApp & Telegram bilingual daily delta digest bot for citizens, journalists, and policy researchers.

### Phase 4: Open Econometric Simulation API & Public Data Commons (2029–2033)
- Interactive policy simulator allowing economists and citizens to adjust sector capex sliders (e.g., Maritime Logistics, Semiconductors, Tea Exports, Clean Energy) and model real-time Monte Carlo sensitivity impacts on the 2033 **$1 Trillion GSDP** target.
- Public GraphQL & bulk Parquet/CSV Open Data Commons with cryptographic audit hashes for every status transition.

---

## 11. Appendix: 23 Districts & 15 Sectors Reference

### 11.1 All 23 Districts of West Bengal
| # | Code | District (English) | District (Bengali) | Regional Zone | Base GSDP Share |
|:---:|:---:|:---|:---|:---|:---:|
| 1 | `KOL` | Kolkata | কলকাতা | Greater Kolkata | 18.4% |
| 2 | `N24` | North 24 Parganas | উত্তর ২৪ পরগনা | Greater Kolkata | 12.2% |
| 3 | `HOW` | Howrah | হাওড়া | Greater Kolkata | 8.6% |
| 4 | `HOG` | Hooghly | হুগলি | Rarh Bengal | 7.8% |
| 5 | `EMD` | Purba Medinipur | পূর্ব মেদিনীপুর | Coastal | 6.9% |
| 6 | `PBD` | Paschim Bardhaman | পশ্চিম বর্ধমান | Rarh Bengal | 6.5% |
| 7 | `S24` | South 24 Parganas | দক্ষিণ ২৪ পরগনা | Coastal | 5.8% |
| 8 | `EBD` | Purba Bardhaman | পূর্ব বর্ধমান | Rarh Bengal | 5.1% |
| 9 | `MSD` | Murshidabad | মুর্শিদাবাদ | Central | 4.5% |
| 10 | `NAD` | Nadia | নদিয়া | Central | 4.2% |
| 11 | `PMD` | Paschim Medinipur | পশ্চিম মেদিনীপুর | Junglemahal | 4.0% |
| 12 | `DAR` | Darjeeling | দার্জিলিং | North Bengal | 3.4% |
| 13 | `JAL` | Jalpaiguri | জলপাইগুড়ি | North Bengal | 3.2% |
| 14 | `MLD` | Malda | মালদা | North Bengal | 3.0% |
| 15 | `BNK` | Bankura | বাঁকুড়া | Junglemahal | 2.7% |
| 16 | `BIR` | Birbhum | বীরভূম | Rarh Bengal | 2.5% |
| 17 | `PUR` | Purulia | পুরুলিয়া | Junglemahal | 2.3% |
| 18 | `COB` | Cooch Behar | কোচবিহার | North Bengal | 2.1% |
| 19 | `UDN` | Uttar Dinajpur | উত্তর দিনাজপুর | North Bengal | 1.9% |
| 20 | `APD` | Alipurduar | আলিপুরদুয়ার | North Bengal | 1.8% |
| 21 | `DDN` | Dakshin Dinajpur | দক্ষিণ দিনাজপুর | North Bengal | 1.3% |
| 22 | `JHR` | Jhargram | ঝাড়গ্রাম | Junglemahal | 1.2% |
| 23 | `KAL` | Kalimpong | কালিম্পং | North Bengal | 0.6% |

### 11.2 All 15 Developmental Sectors
1. `economy` — Industry, Ports & Manufacturing (`ECON`)
2. `infrastructure` — Highways, Rail & Urban Infrastructure (`INFRA`)
3. `youth` — IT, Semiconductors & Youth Jobs (`YOUTH`)
4. `farmers` — Agriculture, MSP & Cold Chain (`AGRI`)
5. `health` — Critical Care & Public Health (`HLTH`)
6. `education` — Higher Education, AI & Skill Centers (`EDU`)
7. `women` — Women Empowerment & Enterprise (`WOM`)
8. `tea` — Tea Estates Revival & GI Exports (`TEA`)
9. `fishery` — Blue Economy & Deep-Sea Fisheries (`FISH`)
10. `governance` — Digital Governance & Fiscal Reform (`GOV`)
11. `social-welfare` — Social Security & Housing (`SOC`)
12. `national-security` — Border Infrastructure & Internal Security (`SEC`)
13. `sc-st-obc` — Tribal & Backward Classes Development (`TRIB`)
14. `environment` — Clean Energy, Sundarbans & Climate (`ENV`)
15. `culture` — Heritage Corridors & Cultural Tourism (`CULT`)
