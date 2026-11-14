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
| AI | **Claude, offline:** the SI jobs in `prompts/` run in Claude Code sessions and write JSON (mode A). `@anthropic-ai/sdk` scripts kept for an optional API mode (B) | See `docs/ai.md` |
| Scripts | `tsx` (TypeScript scripts in `scripts/*.mts`) | Same types and schema as the app |
| Tests | **Vitest** (data integrity, pure functions) | Fast; CI-friendly |
| Hosting | **Vercel** (Hobby/free) | Preview per PR, zero config for Next.js |
| CI | GitHub Actions: typecheck, lint, tests, data validation, build, DESIGN.md lint | Every PR checked; no secrets anywhere |

## Shape of the system

```
                    ┌──────────────── before the build (our laptops + Claude Code) ──────────────┐
 NASA NTRS / PSI ──►│ scripts/fetch-ntrs ─► SI job 1: extract ─► people verify ─► data/findings.json │
                    │      SI jobs (prompts/, in Claude Code) ─► data/generated/insights, answers   │
                    └───────────────────────────────────────────┬──────────────────────────────────┘
                                                                │ imported + Zod-validated (src/lib/data.ts)
                                                                ▼
 Browser ◄── static pages (server components, pre-rendered) ◄── Next.js on Vercel
    └── Ask panel and filters (client components, search in the browser, no network calls)
```

- **Everything is static:** pages are pre-rendered from the JSON at build time; filters and Ask search run in the browser. Fast, free, and nothing can fail at runtime.
- **No runtime dependencies** (mode A). Mode B would add one route, `/api/ask` (`docs/ai.md` › Mode B), not planned.

## Folders

```
src/
  app/
    layout.tsx            app shell: fonts, top bar, footer
    page.tsx              overview (F4)
    insights/             ranked insights (F5) + [id] detail          (to build)
    findings/             explorer (F6) + [id] detail                 (to build)
    worlds/               Same Fire, Four Worlds (F8) + [world]        (to build)
    gaps/                 gaps map (F16) + test-next list (F18)        (to build)
    habitat/              Habitat Designer (F19)                       (to build)
    sources/              sources and method (F9)                     (to build)
    ask/                  Ask: question library + search (F7)          (to build)
    globals.css           theme tokens (mirrors DESIGN.md)
  components/             shared UI: flame-mark, cards, badges, citation chip, charts
  lib/
    schema.ts             the one data shape (Zod) + types
    data.ts               loads and validates data/*.json (server only)
    validate.ts           cross-record checks, findings hash, stale check (scripts, tests)
    claude.ts             Claude API client: mode B only, unused today
    format.ts             units and numbers
data/
  experiments.json  findings.json  generated/{insights,answers}.json  raw/ (git-ignored)
prompts/            the SI instructions: extract.md · synthesize.md · answer.md
scripts/            validate-data · fetch-ntrs · (mode B) si.mts · extract-findings · build-insights
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
| `/worlds` | Same Fire, Four Worlds side by side; `/worlds/[world]` (`earth`, `iss`, `moon`, `mars`) for one world | Static |
| `/gaps` | Gaps map + What NASA should test next; `?world=` / `?o2=` highlight a spot | Static shell + client filters |
| `/habitat` | Habitat Designer; the setup lives in the URL (`?world=mars&atm=exploration&material=…&flow=…`) | Static shell + client filters |
| `/ask` | Question library + search; `?q=` keeps the search, `/ask/[id]` opens an answer | Static shell + client search |
| `/sources` | Sources, method, ranking rubric, AI disclosure | Static |

The Ask button in the top bar opens `/ask` (or a panel with the same content) from any page.

Next.js 16 notes: `params` and `searchParams` are Promises (`await` them); middleware is `proxy.ts`. Check `node_modules/next/dist/docs/` before using anything from memory.

## Rules the code follows

- **Server first.** Pages are server components that read from `src/lib/data.ts`. Client components (`"use client"`) only for filters, charts, and the Ask panel; pass them plain data as props.
- **One data shape.** Types come from `src/lib/schema.ts` (`z.infer`). No duplicate interfaces.
- **No business logic in components:** filtering, sorting and grouping live in small pure functions in `src/lib/` with a unit test when they're not trivial.
- **Server-only data loading.** `src/lib/data.ts` (and the dormant `claude.ts`) import `server-only`. The app has no secrets today.
- **Tokens and icons** per `DESIGN.md`; ESLint enforces no raw hex and no `dark:`.
- **Responsive:** grids 1 / 2 / 3 columns (`sm:grid-cols-2 xl:grid-cols-3`), no fixed widths that break at 360 px.

## Testing

| What | How | When |
|---|---|---|
| Data integrity | `tests/data.test.ts` + `npm run data:validate` | CI, and after every data change |
| Pure functions (filters, ranking helpers, formatting) | Vitest unit tests | When written |
| Pages | `npm run build` (pre-renders every page with the real data) | CI |
| Look and feel | Screenshots at 360 px and 1440 px (Playwright, or by hand) | Before each UI PR |
| SI quality | Review checklist + golden questions (`docs/ai.md`) | After every SI run |
| Demo safety | Full demo on a local production build with Wi-Fi off | Before freeze and before submitting |

## Deploy

- Vercel project linked to the GitHub repo; Production = `main`, a Preview for every PR.
- No env vars needed (mode A). Mode B would add `ANTHROPIC_API_KEY` (Production and Preview).
- Steps in `docs/runbook.md`.
