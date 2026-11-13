# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router), React 19, TypeScript (strict) | Same stack as our other project; server components make a fast, polished static dashboard; route handlers give us a safe server for the Claude key |
| Styling | **Tailwind CSS 4** with theme tokens from `DESIGN.md` (`src/app/globals.css`) | Fast to build, consistent; tokens keep it on-brand |
| Fonts | IBM Plex Sans + IBM Plex Mono via `next/font` | Technical-report feel; self-hosted at build |
| Icons | `lucide-react` | One icon set, mapped in `DESIGN.md` |
| Charts | **Recharts** (add with the first chart) | Quick, good-looking, accessible enough; SVG |
| Data | JSON in `data/`, validated with **Zod** (`src/lib/schema.ts`) | Small corpus; no database to set up or break |
| AI | **Claude API**, `@anthropic-ai/sdk`, model `claude-opus-5-5` | See `docs/ai.md` |
| Scripts | `tsx` (TypeScript scripts in `scripts/*.mts`) | Same types and schema as the app |
| Tests | **Vitest** (data integrity, pure functions) | Fast; CI-friendly |
| Hosting | **Vercel** (Hobby/free) | Preview per PR, zero config for Next.js |
| CI | GitHub Actions: typecheck, lint, tests, data validation, build, DESIGN.md lint | Every PR checked; no API key in CI |

## Shape of the system

```
                    ┌───────────────── build time (your laptop / Vercel build) ─────────────────┐
 NASA NTRS / PSI ──►│ scripts/fetch-ntrs ─► scripts/extract-findings ─► people verify ─► data/*.json │
                    │                                   scripts/build-insights ─► data/generated/*  │
                    └───────────────────────────────────────────┬──────────────────────────────────┘
                                                                │ imported + Zod-validated (src/lib/data.ts)
                                                                ▼
 Browser ◄── static pages (server components, pre-rendered) ◄── Next.js on Vercel
    │                                                            │
    └── Ask panel (client) ── POST /api/ask ── route handler ── Claude API (streamed, corpus cached)
```

- **Everything except Ask is static:** pages are pre-rendered from the JSON at build time. Fast, cheap, and they can't fail at runtime.
- **The only runtime dependency is the Claude API**, used by `/api/ask` only, with a fallback to pre-generated answers.

## Folders

```
src/
  app/
    layout.tsx            app shell: fonts, top bar, footer
    page.tsx              overview (F4)
    insights/             ranked insights (F5) + [id] detail          (to build)
    findings/             explorer (F6) + [id] detail                 (to build)
    missions/[mission]/   mission lens (F8)                           (to build)
    sources/              sources and method (F9)                     (to build)
    api/ask/route.ts      live advisor (F7), streaming                (to build)
    globals.css           theme tokens (mirrors DESIGN.md)
  components/             shared UI: flame-mark, cards, badges, citation chip, charts
  lib/
    schema.ts             the one data shape (Zod) + types
    data.ts               loads and validates data/*.json (server only)
    validate.ts           cross-record checks (used by scripts, tests)
    claude.ts             the app's Claude client and model (server only)
    format.ts             units and numbers
data/
  experiments.json  findings.json  generated/insights.json  raw/ (git-ignored)
scripts/            si.mts (shared) · fetch-ntrs · extract-findings · build-insights · validate-data
tests/              Vitest
docs/               everything a teammate or Claude needs (start at CLAUDE.md)
.claude/            settings (deny rules for secrets) + skills
```

## Routes (planned)

| Route | Feature | Rendering |
|---|---|---|
| `/` | Overview: hero, KPIs, top insights, hero chart | Static |
| `/insights` | All insights by rank; filter by mission, theme, risk (URL search params) | Static shell + client filters |
| `/insights/[id]` | Insight detail with cited findings | Static (`generateStaticParams`) |
| `/findings` | Explorer: search + filters in the URL | Static shell + client filters |
| `/findings/[id]` | Finding detail: conditions, numbers, sources | Static |
| `/missions/[mission]` | Mission lens: `iss`, `moon`, `mars-transit`, `mars-surface` | Static |
| `/sources` | Sources, method, ranking rubric, AI disclosure | Static |
| `/api/ask` | POST `{ question }` → streamed text + citations | Dynamic (Node runtime) |

The Ask panel is a client component opened from the top bar on any page.

Next.js 16 notes: `params` and `searchParams` are Promises (`await` them); middleware is `proxy.ts`. Check `node_modules/next/dist/docs/` before using anything from memory.

## Rules the code follows

- **Server first.** Pages are server components that read from `src/lib/data.ts`. Client components (`"use client"`) only for filters, charts, and the Ask panel; pass them plain data as props.
- **One data shape.** Types come from `src/lib/schema.ts` (`z.infer`). No duplicate interfaces.
- **No business logic in components:** filtering, sorting and grouping live in small pure functions in `src/lib/` with a unit test when they're not trivial.
- **Secrets stay on the server.** `src/lib/claude.ts` and `src/lib/data.ts` import `server-only`.
- **Tokens and icons** per `DESIGN.md`; ESLint enforces no raw hex and no `dark:`.
- **Responsive:** grids 1 / 2 / 3 columns (`sm:grid-cols-2 xl:grid-cols-3`), no fixed widths that break at 360 px.

## Testing

| What | How | When |
|---|---|---|
| Data integrity | `tests/data.test.ts` + `npm run data:validate` | CI, and after every data change |
| Pure functions (filters, ranking helpers, formatting) | Vitest unit tests | When written |
| Pages | `npm run build` (pre-renders every page with the real data) | CI |
| Look and feel | Screenshots at 360 px and 1440 px (Playwright, or by hand) | Before each UI PR |
| SI quality | Golden questions (`docs/ai.md`) | After prompt changes, before the demo |
| Demo safety | Full demo with `LIVE_SI=off` | Before freeze and before submitting |

## Deploy

- Vercel project linked to the GitHub repo; Production = `main`, a Preview for every PR.
- Env vars in Vercel: `ANTHROPIC_API_KEY` (Production and Preview), optional `CLAUDE_MODEL`, `LIVE_SI`.
- Steps in `docs/runbook.md`.
