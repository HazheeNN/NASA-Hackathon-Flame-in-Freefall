# The 2-day plan

Fill in the real dates and times on Day 0. Times below assume the event runs 09:00 Day 1 to ≈ 17:00 Day 2; shift them to the actual schedule. Owners: write your name on a work package (WP) in `docs/status.md` when you take it.

**Principle:** a polished, honest, working core beats many half features. Every WP ends merged, deployed and screenshotted. Cut from the bottom of each list first.

## Day 0: tonight / before the start (≈ 1–2 h)

- [ ] Everyone: `docs/runbook.md` › Day 0 (clone, `npm ci`, `npm run dev` works).
- [ ] Owner: add teammates as collaborators; merge the foundation PR.
- [ ] Owner: Anthropic API key + spend limit; Vercel project with the key; first deploy.
- [ ] Everyone: PSI account. Read `CLAUDE.md`, `docs/challenge.md`, `docs/prd.md` (20 min).
- [ ] Decide: one Claude account or two; who presents; product name (or keep).

## Day 1

| Time | Corpus (person A) | SI + data (person B) | UI (person C) |
|---|---|---|---|
| 09:00–09:30 | **All:** kickoff, paste the challenge page (WP0), adjust this plan, assign WPs | | |
| 09:30–12:30 | WP1: verify seed experiments; papers for BASS, Saffire, FLEX → first 15 findings | WP2: run `data:ntrs` + `si:extract` on 2 papers, fix scripts against real responses; hand proposals to A | WP3a: app shell (top bar, nav, footer, Ask button placeholder), card + badge + citation-chip components; insights pages on a **sample** insights file |
| 12:30 | **Check-in 1** (status.md), lunch | | |
| 13:00–16:00 | WP1: SoFIE, ACME, CFI, SAME, FLARE → 30 findings | WP2: first `si:build` on what's there; review; tune prompt | WP3b: findings explorer + detail; overview with real KPIs |
| 16:00 | **Check-in 2:** corpus on track for 40? If not, set 25 as the target | | |
| 16:00–20:00 | WP1: to 40+ findings, verification pass | WP4: `/api/ask` route + Ask panel, streaming, citations, guards | WP3c: insight detail polish; first chart (WP6) if data allows |
| 20:00 | **Check-in 3:** rebuild insights on the full corpus (B), deploy, everyone clicks through | | |
| Evening | Stagger sleep. Optional: fallback answers file, golden-question list tuned to the corpus | | |

## Day 2

| Time | Person A | Person B | Person C |
|---|---|---|---|
| 08:00–11:00 | WP7: sources & method page | WP5: mission lens (4 lenses, gaps panel) | WP6: charts (1 g vs 0 g, flammability map); mobile pass |
| 11:00 | **Check-in 4.** Fallback (`LIVE_SI=off`) works? Golden questions ≥ 9/10? | | |
| 11:00–13:00 | WP8: video script, slides draft | WP4b: fallback answers, error states | Polish pass with design skills; 360 px + 1440 px screenshots of every page |
| **13:00** | **FEATURE FREEZE.** Only fixes from here. | | |
| 13:00–15:00 | Record + edit video | Project page text; AI disclosure; data list | Final QA, Lighthouse, demo rehearsals × 3 (one with `LIVE_SI=off`) |
| **15:00** | **SUBMIT** (≥ 2 h before the deadline). Then rehearse the live pitch. | | |

## Work packages

### WP0: Brief and rules (all, 30 min) → `docs/challenge.md`
Paste the full challenge page; list its NASA resources; fill the rules checklist and `docs/submission.md` limits. Adjust this plan if the resources point at specific datasets.

### WP1: Corpus (F1) → `data/`, `docs/data.md`
1. Verify the 14 seed experiments; replace search links with real citations.
2. Findings: BASS, Saffire, FLEX first (most fire-safety relevant), then SoFIE, ACME, CFI, SAME, FLARE, drop-tower classics.
3. Verification pass on everything Claude proposed.
- **Done:** ≥ 40 findings (min 25), ≥ 8 experiments, ≥ 75 % verified, `data:validate` green.

### WP2: SI pipeline (F2, F3) → `scripts/`, `docs/ai.md`
1. Run the scripts against real NTRS and Claude; fix what breaks (untested so far).
2. First `si:build`, review checklist, prompt tuning (try `CLAUDE_MODEL=claude-sonnet-5-5` while iterating).
3. Final build on Opus 5.5 after the corpus is complete; commit.
- **Done:** 8–15 insights pass review; each cites ≥ 2 findings.

### WP3: Core pages (F4, F5, F6) → `src/app`
a. Shell and components · b. findings explorer + detail · c. insights list + detail, overview with top 3.
- **Done:** acceptance criteria in `docs/prd.md`; screenshots at 360 / 1440 px.

### WP4: Ask the advisor (F7, F10)
Route handler with cached corpus + citations + streaming; Ask panel; suggested questions; rate limit; fallback answers file.
- **Done:** golden questions ≥ 9/10; works with `LIVE_SI=off`.

### WP5: Mission lens (F8)
4 lenses: gravity, atmosphere (sourced), applicable insights, evidence gaps.

### WP6: Charts (F12, F13): cut first if late
Only plot values from findings. One clear takeaway title + source line per chart.

### WP7: Sources and method (F9)
All sources from the data; the SI diagram; the ranking rubric; AI disclosure.

### WP8: Submission (`docs/submission.md`)
Project page, video, slides, links; checked in a private window.

## Cut lines (in this order, when behind)

1. F15–F17 (compare, gaps grid, export)
2. F13 flammability map
3. F14 explainer → a short paragraph on the overview
4. F12 comparison chart
5. Mission lens down to 2 lenses (ISS, Mars surface)
6. Corpus target 40 → 25

**Never cut:** citations, verified badges, the fallback, the deploy, the video.
