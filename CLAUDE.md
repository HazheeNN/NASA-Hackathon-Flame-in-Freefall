@AGENTS.md

# Flame in Freefall

Our entry for the **NASA Space Apps Challenge, "Flame in Freefall"**: an interactive, AI-powered ("SI", super-intelligence) dashboard that **summarizes, ranks and interprets** decades of NASA microgravity combustion findings into **fire safety insights for crewed missions** (ISS, Moon, Mars). Judges see it on a laptop or projector for a few minutes; it must look polished, be honest about its evidence, and never break during the demo. A 2-day event, 3 teammates who all do everything, English only, dark theme only, no accounts, no database, no money.

**Live:** not deployed yet (Vercel, `*.vercel.app`; rebuilds on every push to `main` once connected)
**Repo:** github.com/HazheeNN/NASA-Hackathon-Flame-in-Freefall

## Start and end every session

1. **Start:** read `docs/status.md` (what's done, what's next, who is on what), then `git pull`. Use the `start-session` skill.
2. **End:** update `docs/status.md` with what you did, what's half-done and what's next, then commit. Use the `handoff` skill. Three people (and possibly one shared Claude account) work in turns, so a missing handoff costs the next person an hour.

## Where the context lives

| What | Where |
|---|---|
| Live status and handoff log: read first | `docs/status.md` |
| The challenge text, what it asks, how it's judged, rules | `docs/challenge.md` |
| Product requirements: personas, features + status, flows, NFRs, scope | `docs/prd.md` |
| The 2-day plan: work packages, hour-by-hour, cut lines | `docs/plans/2026-11-hackathon.md` |
| Fire-in-microgravity primer and glossary (read before writing any science text) | `docs/science.md` |
| Data: NASA sources, schema, how a finding gets in, verification rules | `docs/data.md` |
| The SI layer: extraction, ranking rubric, live advisor, prompts, cost, guardrails | `docs/ai.md` |
| Architecture: stack, folders, routes, data flow, deploy | `docs/architecture.md` |
| Design system (google-labs DESIGN.md format; `npx @google/design.md lint DESIGN.md`) | `DESIGN.md` |
| Decisions and why | `docs/decisions.md` |
| How the 3 of us work together | `docs/team.md` |
| Working with Claude on limited Pro usage | `docs/claude-workflow.md` |
| Security and open owner actions | `docs/security.md` |
| Setup steps (API key, Vercel, NASA accounts), demo-day steps | `docs/runbook.md` |
| Submission: project page text, video script, slides, checklist | `docs/submission.md` |

Read the matching doc before changing anything non-trivial; they record decisions the code can't explain.

## Structure

`src/app` routes (server components; read data from `src/lib/data.ts`) · `src/components` · `src/lib` (`schema.ts` the one data shape, `data.ts` loads and validates the JSON, `claude.ts` the app's Claude client, `validate.ts` cross-record checks, `format.ts` units) · `data/` the corpus (`experiments.json`, `findings.json` hand-verified; `generated/insights.json` made by the SI pipeline; `raw/` git-ignored downloads) · `scripts/` data and SI scripts run with `tsx` · `tests/` Vitest.

## Non-obvious rules

- **Every claim has a source.** Every finding cites a NASA (or partner agency) source with a page/section; every AI insight and advisor answer cites finding IDs (`F-012`). No source, no claim. This is our credibility and our pitch.
- **Unverified is labelled, never hidden.** `verified: false` until a teammate checked the finding against the paper (`docs/data.md` › Verification). Claude-extracted findings start unverified. The UI always shows the badge.
- **The SI writes to files, people check, the app reads files.** Insights come only from `npm run si:build` into `data/generated/insights.json` (committed). Never hand-edit generated files and never invent insight text in components. The demo must work with no API key (`LIVE_SI=off`).
- **One data shape:** `src/lib/schema.ts`. Change it there, update `docs/data.md`, run `npm run data:validate`. Bad data fails the build on purpose.
- **Claude API:** only through `src/lib/claude.ts` (app) or `scripts/si.mts` (scripts). Default model `claude-opus-5-5`, override with `CLAUDE_MODEL`. Structured outputs via `client.messages.parse` + `zodOutputFormat`; long answers stream. Read `docs/ai.md` before touching prompts. The SI scripts cost real API money: don't run them in a loop, and say how much a run cost.
- **Science text:** use the words in the `docs/science.md` glossary, units with a thin space (`src/lib/format.ts`), O₂ with the subscript. Never state physics we can't cite. "Unknown in partial gravity" is a valid answer.
- **Use the screen fully** on every device: card grids 1 column on phones, 2 on tablets, 3 on wide desktops; panels side by side where they fit. Check 360 px, tablet and 1440 px before calling a page done.
- **Colour only via theme tokens** from `src/app/globals.css` (mirrors `DESIGN.md`): `bg-page`, `bg-surface`, `bg-raised`, `text-fg`, `text-muted`, `border-line`, `text-primary`, `bg-primary-soft`, `text-ember`, `risk-*`, `verified`/`unverified`, `series-1…6`. No raw hex, no `dark:` (ESLint fails on both). One dark theme.
- **Icons:** Lucide only, 20 px, stroke 1.75, same meaning → same icon (table in `DESIGN.md`). The flame sphere is ours (`src/components/flame-mark.tsx`). **Never the NASA logo** or anything implying NASA endorsement.
- **Next.js 16:** middleware is `proxy.ts`, request APIs (`cookies()`, `headers()`, `params`) are async. Check `node_modules/next/dist/docs/` before using an API from memory.
- **Secrets:** never in git, never in chat. `.env.example` has the names. `ANTHROPIC_API_KEY` is server-only: never `NEXT_PUBLIC_`, never sent to the browser.

## Commands

```bash
npm run dev              # local app (works without an API key; Ask needs one)
npm run check            # typecheck + lint + tests + build: run before every PR
npm run data:validate    # data/ against the schema and cross-record rules
npm run data:ntrs -- "flame spread microgravity"   # search NASA reports → data/raw/ntrs/
npm run si:extract -- <experimentId> <paper.pdf> "<title>" <url> [year]   # Claude proposes findings → data/raw/proposed/
npm run si:build         # Claude ranks and interprets findings → data/generated/insights.json (costs money)
npx @google/design.md lint DESIGN.md
```

## Environments

Local `.env.local` (your own copy, never committed) and Vercel (Production + a Preview per PR). One Anthropic API key with a spend limit, shared by the team through those two places only (`docs/runbook.md`). No database. CI runs `npm run check`, `data:validate` and the DESIGN.md lint on every PR; it never calls the Claude API.

## Working style the team expects

- **Plan first for anything over an hour:** say what, why and which files, get a teammate's 👍 (or the user's), then build. Small fixes: just do them.
- **Small PRs into `main`, each reviewed by one other teammate.** Never push to `main` directly; never merge without a teammate's OK and green CI. Feature freeze and deadlines are in the plan.
- **Show results, not process:** screenshots (360 px phone and 1440 px desktop) or numbers, then the decision needed.
- **The lazy solution that works.** It's a 2-day hackathon: no speculative abstractions, no new dependency for what a few lines can do, cut scope before cutting quality. Current deps beyond the framework: `@anthropic-ai/sdk`, `zod`, `lucide-react` (+ `tsx` for scripts). Planned: `recharts` when the first chart lands.
- **Say plainly what was tested and what wasn't** (e.g. "SI script not run: no API key in this session").
- **Mind the Claude budget** (`docs/claude-workflow.md`): one task per session, point to docs instead of pasting them, `/clear` between tasks, write the handoff.
