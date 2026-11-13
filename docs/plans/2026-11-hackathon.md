# The 2-day plan

Fill in the real dates and times on Day 0. Times below assume the event runs 09:00 Day 1 to ≈ 17:00 Day 2; shift them to the actual schedule. Owners: write your name on a work package (WP) in `docs/status.md` when you take it.

**Principle:** a polished, honest, working core beats many half features. Every WP ends merged, deployed and screenshotted. Cut from the bottom of each list first.

## Day 0: tonight / before the start (≈ 1–2 h)

- [ ] Everyone: `docs/runbook.md` › Day 0 (clone, `npm ci`, `npm run dev` works).
- [ ] Owner: add teammates as collaborators; merge the foundation PR.
- [ ] Owner: Vercel project + first deploy (no env vars needed).
- [ ] Everyone: PSI account. Read `CLAUDE.md`, `docs/challenge.md`, `docs/prd.md` (20 min).
- [ ] Decide: one Claude account or two; who presents; product name (or keep).

## Day 1

| Time | Corpus (person A) | SI + data (person B) | UI (person C) |
|---|---|---|---|
| 09:00–09:30 | **All:** kickoff, paste the challenge page (WP0), adjust this plan, assign WPs | | |
| 09:30–12:30 | WP1: verify seed experiments; papers for BASS, Saffire, FLEX → first 15 findings | WP2: run `data:ntrs`; SI job 1 (Claude Code) on 2–3 papers' key pages → proposals to A; write the question list for job 3 | WP3a: app shell (top bar, nav, footer, Ask button placeholder), card + badge + citation-chip components; insights pages on a **sample** insights file |
| 12:30 | **Check-in 1** (status.md), lunch | | |
| 13:00–16:00 | WP1: SoFIE, ACME, CFI, SAME, FLARE → 30 findings | WP2: SI job 1 on more papers (abstract + results pages only, to save Pro usage); first trial of job 2 on ~20 findings; tune `prompts/` | WP3b: findings explorer + detail; overview with real KPIs |
| 16:00 | **Check-in 2:** corpus on track for 40? If not, set 25 as the target | | |
| 16:00–20:00 | WP1: to 40+ findings, verification pass | WP4: Ask page/panel: question library UI, search over questions and findings, citation chips (on sample answers first) | WP3c: insight detail polish; first chart (WP6) if data allows |
| 20:00 | **Check-in 3:** SI jobs 2 + 3 on the full corpus (B), review, deploy, everyone clicks through | | |
| Evening | Stagger sleep. Optional: more questions answered (job 3), golden-question check | | |

## Day 2

| Time | Person A | Person B | Person C |
|---|---|---|---|
| 08:00–11:00 | WP7: sources & method page | WP5: mission lens (4 lenses, gaps panel) | WP6: charts (1 g vs 0 g, flammability map); mobile pass |
| 11:00 | **Check-in 4.** Golden questions ≥ 9/10? Search finds them? Final SI run if findings changed (no stale warning). | | |
| 11:00–13:00 | WP8: video script, slides draft | WP4b: remaining answers, empty/no-match states | Polish pass with design skills; 360 px + 1440 px screenshots of every page |
| **13:00** | **FEATURE FREEZE.** Only fixes from here. | | |
| 13:00–15:00 | Record + edit video | Project page text; AI disclosure; data list | Final QA, Lighthouse, demo rehearsals × 3 (one offline on a local build) |
| **15:00** | **SUBMIT** (≥ 2 h before the deadline). Then rehearse the live pitch. | | |

## Work packages

### WP0: Brief and rules (all, 30 min) → `docs/challenge.md`
Paste the full challenge page; list its NASA resources; fill the rules checklist and `docs/submission.md` limits. Adjust this plan if the resources point at specific datasets.

### WP1: Corpus (F1) → `data/`, `docs/data.md`
1. Verify the 14 seed experiments; replace search links with real citations.
2. Findings: BASS, Saffire, FLEX first (most fire-safety relevant), then SoFIE, ACME, CFI, SAME, FLARE, drop-tower classics.
3. Verification pass on everything Claude proposed.
- **Done:** ≥ 40 findings (min 25), ≥ 8 experiments, ≥ 75 % verified, `data:validate` green.

### WP2: SI jobs (F2, F3, F7 content) → `prompts/`, `data/`, `docs/ai.md`
Run in Claude Code sessions (mode A, `si-run` skill); no API key.
1. Check `npm run data:ntrs` against a real NTRS response (untested so far). Job 1 on the key pages of each chosen paper.
2. Write the 20–30 questions for the Ask library (golden questions + per mission + per theme + 2–3 out of scope).
3. Trial of job 2 on ~20 findings; tune `prompts/synthesize.md` until the review checklist passes.
4. At check-in 3 and before the freeze: jobs 2 and 3 on the full corpus; review; commit.
- **Done:** 8–15 insights and 20–30 answers pass review; `data:validate` green with no stale warning.

### WP3: Core pages (F4, F5, F6) → `src/app`
a. Shell and components · b. findings explorer + detail · c. insights list + detail, overview with top 3.
- **Done:** acceptance criteria in `docs/prd.md`; screenshots at 360 / 1440 px.

### WP4: Ask (F7)
Ask panel or page: featured questions, questions grouped by mission and theme, client-side search over questions and findings, answer view with citation chips that open findings, "prepared by our SI" label, no-match state.
- **Done:** golden questions ≥ 9/10 correct and findable by search; works offline.

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

**Never cut:** citations, verified badges, the Ask library, the deploy, the video.
