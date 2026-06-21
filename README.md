<div align="center">

# 🌱 CarbonTrace

### Measure. Reduce. Offset.

**A production-grade carbon footprint tracker that turns everyday choices into measurable climate action.**

Track lifestyle emissions across transport, energy, food, shopping & waste — get **AI-powered insights from Groq**, hit reduction goals, and offset the rest with verified projects. Wrapped in a dark, premium, motion-rich SaaS interface.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/AI-Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

[**Live AI demo**](#-ai-insights-powered-by-groq) · [**Quick start**](#-quick-start) · [**Architecture**](#-architecture) · [**Deploy**](#-deploy-to-vercel) · [**Roadmap**](#-roadmap)

</div>

---

## ✨ Overview

CarbonTrace makes a famously invisible number — your carbon footprint — **visible, trustworthy, and reducible**. It pairs a credible emissions methodology with a genuinely delightful product experience: oversized editorial typography, marquee tickers, animated counters, smooth scroll, and an interactive AI advisor that ranks your highest-impact actions in seconds.

> **Build status — Milestone 1 of 7.** This repo ships the production scaffold, the complete fully-animated marketing site, **and a working Groq-powered AI insights engine**. Auth, database, the full emissions engine, dashboard, gamification, Stripe offsets, reports and teams arrive in later milestones. Every external service is wired behind a **graceful adapter** that runs with zero keys.

---

## 🚀 Highlights

| | |
|---|---|
| 🤖 **AI insights, live** | A real, working footprint advisor powered by **Groq** (`llama-3.3-70b-versatile`). Describe your lifestyle → get an estimated annual footprint + ranked, actionable recommendations with per-action CO₂e savings. |
| 🎨 **Premium, motion-rich UI** | Dark editorial design system: oversized display type, eyebrow labels, `/0x` numbered blocks, infinite marquees, count-up stats, arrow-nav carousel, accordion FAQ — all with Lenis smooth scroll and Framer Motion reveals. |
| 🔌 **Zero-backend, zero-keys dev** | Every integration (AI, email, …) sits behind a graceful adapter. The app runs end-to-end locally with **no database and no API keys** — add real keys via `.env` to go live. |
| 🔒 **Secure by construction** | API keys stay server-side in Route Handlers. Strict TypeScript, Zod-validated I/O, a consistent `{ data, error }` envelope, and hardening headers in `next.config.ts`. |
| ♿ **Accessible & fast** | Keyboard navigable, WCAG-AA contrast, `prefers-reduced-motion` honored throughout, fully responsive mobile→desktop. |
| ✅ **CI-ready** | Vitest component tests, ESLint, Prettier, `tsc --noEmit`, and a clean production build. |

---

## 🤖 AI insights, powered by Groq

All AI operations in CarbonTrace run on **Groq's** ultra-low-latency, OpenAI-compatible inference.

```
Browser (form)  ──►  POST /api/insights  ──►  lib/ai/insights.ts  ──►  Groq Chat Completions
                          (Zod-validated)        (server-only key)        llama-3.3-70b-versatile
   ◄── ranked recommendations + estimated annual footprint (strict JSON) ──┘
```

- **Real calls, no backend server.** The model is called from a Next.js Route Handler, so the key never touches the client and you don't need any separate infrastructure.
- **Graceful by default.** Without `GROQ_API_KEY`, the endpoint returns deterministic sample insights so the demo always works; with the key, it returns live, personalised analysis (badged **“Live · Groq”** in the UI).
- **Structured output.** The model is constrained to strict JSON and re-validated server-side with Zod (`lib/validations/insights.ts`).

```bash
# .env.local
GROQ_API_KEY=your_groq_key      # https://console.groq.com/keys
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## 🧱 Tech stack

- **Framework** — Next.js 15 (App Router) · React 19 · TypeScript (strict, `noUncheckedIndexedAccess`)
- **Styling** — Tailwind CSS v4 (CSS-first `@theme` tokens) · shadcn / Radix primitives
- **Motion** — Framer Motion (reveals, counters, carousel) · Lenis smooth scroll
- **AI** — Groq (all AI operations) via server Route Handlers
- **Forms & validation** — react-hook-form · Zod (shared client/server schemas)
- **Email** — Resend adapter (graceful stub)
- **Testing & tooling** — Vitest · Testing Library · ESLint · Prettier
- **Deploy** — Vercel, zero extra infra

---

## ⚡ Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

No `.env` is required to explore the app. To enable live AI + email:

```bash
cp .env.example .env.local
# set GROQ_API_KEY (live AI insights) and optionally RESEND_API_KEY (contact email)
```

### Scripts

| Command          | Purpose                              |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start the dev server                 |
| `pnpm build`     | Production build                     |
| `pnpm start`     | Run the production build             |
| `pnpm lint`      | ESLint (core-web-vitals + ts)        |
| `pnpm typecheck` | `tsc --noEmit`                       |
| `pnpm test`      | Vitest unit/component tests          |
| `pnpm format`    | Prettier write                       |

---

## 🏛 Architecture

```
app/
  (marketing)/        landing + features · pricing · about · methodology · contact · legal
  (auth)/             login · signup            (placeholders → Milestone 2)
  app/                product dashboard          (placeholder → Milestone 3)
  admin/              admin                      (placeholder)
  api/
    insights/         Groq-powered AI insights (Zod-validated)
    contact/          contact form → email adapter
  robots.ts · sitemap.ts · layout.tsx · globals.css
components/
  ui/                 button · badge · accordion (shadcn/Radix)
  marketing/          Hero · Marquee · StatCounter · Carousel · AiInsightsDemo · cards · Navbar · Footer
  motion/             Reveal / RevealGroup scroll primitives
lib/
  ai/                 groq.ts (adapter) · insights.ts (generator + graceful stub)
  email/              Resend adapter (graceful stub)
  adapters/           adapter-pattern docs for future services
  validations/        shared Zod schemas (contact, insights)
  landing-content.ts · site.ts · utils.ts · api.ts
tests/                Vitest setup + Marquee / StatCounter tests
```

### The adapter pattern

Every external service follows one shape — **real client when configured, safe stub otherwise** — so the app is always runnable and new providers plug in without touching call sites:

```ts
const client = process.env.SERVICE_KEY ? new RealClient(key) : null;
export async function doThing(input) {
  if (!client) return stub(input);   // graceful, observable in dev
  return client.call(input);         // real provider when configured
}
```

See [`lib/adapters/README.md`](lib/adapters/README.md).

---

## 🎨 Design system

Tokens live in `app/globals.css` under Tailwind v4 `@theme`:

| Token | Value |
|---|---|
| `--color-bg` | `#0A0B0A` (near-black) |
| `--color-surface` | `#121413` |
| `--color-text` | `#F4F5F2` |
| `--color-accent` | `#A8FF53` (lime) |
| `--radius-card` | `1.5rem` |

Display type **Space Grotesk**, body **Inter**, indices **JetBrains Mono**. Dot-grid backgrounds, accent glow, and a shared `cubic-bezier(0.22, 1, 0.36, 1)` reveal easing. All motion respects `prefers-reduced-motion`.

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** (framework auto-detected as Next.js).
3. Add environment variables from [`.env.example`](.env.example). For live AI, set `GROQ_API_KEY`. None are required for the marketing site.
4. **Deploy.** `vercel.json` is present for framework config and future cron schedules.

```bash
pnpm dlx vercel        # preview
pnpm dlx vercel --prod # production
```

---

## 🗺 Roadmap

- [x] **1 · Scaffold + landing** — design system, full animated marketing site, **Groq AI insights**
- [ ] **2 · Auth & DB** — Prisma schema, Auth.js (credentials + Google + GitHub), onboarding wizard
- [ ] **3 · Core product** — emissions engine, activity logging, dashboard, trends, goals
- [ ] **4 · Engagement** — expanded AI insights, gamification (streaks/badges/challenges), notifications + cron
- [ ] **5 · Monetization** — Stripe subscriptions + offset marketplace + certificates + PDF reports
- [ ] **6 · Integrations & teams** — utility/bank/vehicle adapters, org features, public API
- [ ] **7 · Hardening** — rate limits, e2e tests, a11y/perf passes, Sentry, admin dashboard

---

<div align="center">

**Built with credible science, real AI, and a lot of care for the planet.** 🌍

<sub>CO₂e factors reference DEFRA/BEIS, US EPA, IPCC AR6 and Our World in Data. Offsets via Gold Standard & Verra.</sub>

</div>
