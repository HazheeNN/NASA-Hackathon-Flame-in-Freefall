# Status

Read this first. Update it at the end of every session (`handoff` skill). Newest log entry at the top.

## Now

| Who | Working on | Branch | Since |
|---|---|---|---|
| — | — | — | — |

## Next up (in order; take the top unclaimed one, write your name in "Now")

### 1. Must do first (the site is empty or fake without these)
- [ ] **Verify the base data** so the live site shows something (check against the NASA link, add the page `locator`, set `verified: true`; most values are already confirmed in `docs/verification/2026-11-14-nasa-data-check.md`):
  - [ ] 4 worlds (`data/worlds.json`)
  - [ ] 5 cabin airs (`data/atmospheres.json`)
  - [ ] 2 formulas (`data/formulas.json`)
  - [ ] FLEX Table IX: spot-check ~10 rows against PDF pp. 20–28 (`data/datasets/flex-table-ix.json`)
  - [ ] 14 experiments (`data/experiments.json`)
- [ ] **WP0: paste the official challenge page** into `docs/challenge.md` (objectives, NASA data list) and re-check the plan against it.
- [ ] **WP1: findings** (0 now, target 25–40): FLEX (report conclusions p. 17), BASS, Saffire, Moon-gravity flammability, airflow. Claude extracts (SI job 1, `si-run`), a teammate verifies.

### 2. The SI part (needs findings first)
- [ ] **SI job 2:** 8–15 ranked insights (replaces the sample cards, fills the confidence meters).
- [ ] **"What NASA should test next" (F18):** 3–6 SI-written proposals (add their schema next to insights in `generated/insights.json`).
- [ ] **Ask library:** write 20–30 questions incl. the 10 golden ones (`docs/ai.md`), then SI job 3 answers them with citations.
- [ ] Review all SI output with the checklist in `docs/ai.md`.

### 3. Website polish (feedback section by section)
- [ ] Review the Flame Lab on a laptop: flame look, layout, world cards, colours.
- [ ] Check on a real projector, in Safari and on a tablet (not tested yet).
- [ ] Add solids and gas flames (BASS, Saffire, ACME) to the fuel choices once their data is verified.
- [ ] Verify the 3 formulas on `/formulas` (FX-01–03), then add more (each needs where used, steps, a worked example and limits in `data/formulas.json`).
- [ ] Optional: real NASA flame photos inside the lab (FLEX droplet, Saffire), credited.

### 4. Deployment and housekeeping
- [ ] Put the live Vercel address in `CLAUDE.md`, `README.md` and `docs/submission.md`.
- [ ] Decide the product name and whether the repo is public at submission (`docs/decisions.md` › Open decisions).
- [ ] Back to the team rule: a teammate reviews every PR before merging.

### 5. Submission (Day 2)
- [ ] Feature freeze; rehearse the demo 3 times (once offline on a local build).
- [ ] Project page text with NASA data used and the AI-use disclosure (`docs/submission.md`).
- [ ] Demo video (~30 s) or slides (≤ 7); check the current limits.
- [ ] Check every link in a private window; submit at least 2 hours before the deadline.

### On hold / optional
- [ ] Globe of where NASA has burned things (Earth, ISS orbit, Moon; Mars all red).
- [ ] "Life of a Flame" scroll story (F21).
- [ ] Live AI chat (only with an API key, `docs/ai.md` › Mode B).

## Blocked / waiting

- Nothing yet.

## Numbers

| Experiments | Findings | Verified | Insights | Answers | Deployed |
|---|---|---|---|---|---|
| 20 (all verified) | 32 | 32 | 11 | 23 | Vercel previews |

Worlds: 4 · atmospheres: 7 · formulas: 2 · FLEX tests: 276 (all verified).

## Log

### 2026-11-14 · first findings proposed: FLEX report (Shera + Claude)
- Done: SI job 1 on NASA/TP—2015-216046 → 6 proposed findings (renumbered F-033…F-038 after #11; F-033 overlaps the verified F-001). Every quote checked word for word against the PDF by script. Review sheet: `docs/verification/2026-11-14-flex-findings-review.md`.
- Next: a teammate reviews each (keep / fix / drop); Claude then moves the kept ones into `data/findings.json` as verified.

### 2026-11-14 · Formulas page (Shera + Claude)
- Done: `/formulas` in the top navigation: every formula with what it tells you, the equation and symbols, how we use it step by step, a worked example, valid range and limits, where it appears on the site, and the NASA citation with page. The Flame Lab's calculated numbers now have "How is this calculated?" with the visitor's values plugged in. Added FX-03 forced stretch rate (Marcum, Olson, Ferkul 2016, p. 3; explained only). `Formula` schema gained `whereUsed`, `steps`, `example`, `limits`; a test recomputes every worked example.
- Not tested: real GPU/projector, Safari. FX-01 and FX-02 verified by the team (#11); FX-03 still `verified: false`.

### 2026-11-14 · full data pass (Hazheen + Claude)
- Done: fixed main (ISS locator); all experiments verified with corrections, 6 new experiments, 2 Apollo atmospheres, FLEX dataset verified; 32 verified findings with exact quotes checked against the sources; SI jobs 2 and 3 run (11 insights, 23 answers); citation chips inside SI text; full answers on /ask; phone overflow fix on /findings. Report: `docs/verification/2026-11-14-nasa-data-check.md` › Full pass.
- Tested: `npm run check` (15 tests, build of 52 pages), `data:validate` (no stale warning), every page at 360 and 1440 px: no console errors, no horizontal overflow.
- Not done: findings at Mars gravity or 34 % O₂ (no NASA data found), "what NASA should test next" proposals (F18) and their schema.
- Next: review the insight and answer wording as a team; F18 proposals; website polish.

### 2026-11-14 · to-do list (Shera + Claude)
- Done: "Next up" rewritten as one prioritized checklist (data verification, findings, SI runs, polish, deploy, submission); finished items removed.

### 2026-11-14 · new website: Flame Lab homepage (Shera + Claude)
- Done: redesign around NASA Horizon typefaces (DESIGN.md rewritten, lint clean); Flame Lab homepage with WebGL2 raymarched flame (0 g sphere, 1 g sooty teardrop, partial gravity in between, oxygen/pressure/airflow/fuel), cabin-air presets, sliders with tested range in blue and untested in red, "What NASA has measured" panel (FLEX coverage, nearest tests, d² law burn time, O₂ partial pressure), four world cards with real NASA photos and glow, background switch, fire-only mode (Esc), insights for the world with confidence meter; gaps map; insights with filters; findings explorer + FLEX table; Ask dialog (Ctrl/⌘ K) and page; sources & method; about. `data/formulas.json` (FX-01, FX-02, unverified); world photos in `public/worlds/`; visibility rule (live = verified only).
- Tested: typecheck, lint, 15 tests, build, data:validate, DESIGN.md lint; headless browser at 360 and 1440 px on every page: no console errors, no horizontal overflow.
- Not tested: on a real GPU/projector (headless used software WebGL), Safari, a production (VERCEL_ENV=production) deploy showing only verified data.

### 2026-11-14 · missing sources found (Hazheen + Claude)
- Done: FLEX-2, CFI, FLARE and Mir 1997 now cite NASA sources with pages; corrected CFI (droplet experiment, 2017), FLARE name and partners, Mir details, ACME years (2017–2022). Report: `docs/verification/2026-11-14-nasa-data-check.md` › Follow-up.
- Not confirmed: FLEX-2 fuels, FLARE flight dates (JAXA site not reachable from the cloud session). Nothing set to verified.
- Next: a teammate signs off; the 14 experiments now all have real sources.

### 2026-11-14 · data checked against NASA (Hazheen + Claude)
- Done: every table compared with its NASA source (`docs/verification/2026-11-14-nasa-data-check.md`). FLEX Table IX: all 276 rows match the PDF. Worlds and exploration atmospheres match. Fixed: Earth air values, 3 wrong source titles, SAME years, and 8 experiments now cite real NTRS papers instead of search links. Nothing set to verified.
- Not confirmed: FLEX-2, CFI, FLARE, Mir 1997 sources; a few experiment years; a Moon 0.16 g flammability source.
- Next: a teammate signs off the checked rows (`verified: true` + locator).

### 2026-11-14 · Agent Reach (Hazheen + Claude)
- Done: Agent Reach v1.6.1 added as an optional per-laptop tool: install steps in `docs/runbook.md`, project rules in the `web-research` skill, decision logged. Its skill passed `scripts/security-scan.sh skills`.
- Not tested: the tool itself (installing third-party programs was blocked in the cloud session). First teammate to install: run `agent-reach doctor --text` and note the result here.
- Next: Day 0 setup, then WP0/WP1.

### 2026-11-14 · FLEX Table IX in the repo (Shera + Claude)
- Done: `scripts/flex-table-ix.mts` (`npm run data:flex`) downloads NASA/TP—2015-216046 from NTRS and parses Table IX with `pdftotext`; `data/datasets/flex-table-ix.json` (276 tests, page per row, cleaning notes); `FlexDataset` schema, loaded as `flex` in `src/lib/data.ts`; checks for duplicates, mole-fraction sums and the report's counts; 2 tests; FLEX experiment now cites the report instead of a search link.
- Not tested: a human spot-check against the PDF (dataset `verified: false`); `npm run data:flex` on Windows (needs WSL or poppler).

### 2026-11-14 · data sources checked (Shera + Claude)
- Done: checked two other teams' repos (FLEX CSV real and matches NASA Table IX on all 276 rows; Fire-atlas data is dummy), api.nasa.gov (no combustion data; image library and TechPort only), NTRS API (works, has full-text downloads). Confirmed against NASA PDFs: exploration atmospheres (p. 11), Moon/Mars gravity (NSSDC), d² law definition (FLEX TP p. 19), stretch-rate formula (Olson 2016 p. 3). Added locators to `data/worlds.json` and `data/atmospheres.json` (still `verified: false` until a teammate checks). No-Chinese-data rule added. A personal cloud environment "NASA-Hackathon-Flame-in-Freefall" now allows NASA hosts for Claude sessions.
- Next: FLEX Table IX into `data/`.

### 2026-11-14 · WP3a app shell (Shera + Claude)
- Done: top bar with navigation (Overview, Insights, Four Worlds, Gaps map, Habitat, Findings, Sources), Ask button, phone menu below 1024 px, footer; shared components in `src/components/ui.tsx` (card, page header, risk badge, verified badge, theme and mission chips, citation chip, AI label, sample banner); `/insights` and `/insights/[id]` on `data/sample/` (placeholder text under a "Sample data" banner, shown only while there are no real insights); minimal `/findings/[id]` so citation chips open something; "coming next" pages for the other routes. Screenshots in `docs/screenshots/wp3a-*`.
- Not done: insight filters by mission/theme, confidence meter (F20), findings explorer (WP3b), real overview (WP3c). Not tested on a tablet width or a projector.
- Next: Vercel connect + layout feedback.

### 2026-11-14 · NASA formulas decision (Shera + Claude)
- Done: decided option C: explain with NASA formulas everywhere, compute only inside each formula's tested range, label computed values (`docs/decisions.md`, `CLAUDE.md` rule, `docs/data.md` › Formulas with rules, planned shape and 6 candidate formulas, PRD F22, plan WP9, `docs/science.md`).
- Not tested: no formula verified yet; the candidates come from web search (NASA hosts blocked). No code changed.
- Next: Next up item 7.

### 2026-11-14 · worlds and atmospheres schema (Shera + Claude)
- Done: `World` and `Atmosphere` in `src/lib/schema.ts`; seed `data/worlds.json` (Earth, ISS, Moon, Mars) and `data/atmospheres.json` (Earth sea level, ISS, exploration 8.2 psia / 34 %, EAWG 8.0 / 32 %, Shuttle 10.2 / 26.5 %); loaded in `src/lib/data.ts`; validator checks unknown atmosphere refs, duplicates and verified-without-locator; 2 new tests; `docs/data.md` updated.
- Not tested: the seed values against the papers (NASA hosts blocked): all `verified: false`. No page uses the data yet.
- Next: Next up items 5–7.

### 2026-11-14 · feature set decided (Shera + Claude)
- Done: decided the creative feature set (`docs/decisions.md` 2026-11-14): confidence meter (F20), gaps map (F16, now Must) + "What NASA should test next" (F18), Same Fire, Four Worlds (F8, replaces the mission lens, no simulator), Habitat Designer (F19, NASA-sourced presets, no risk score), Life of a Flame on hold (F21). Cut F15, F17; F12/F13/F14 folded in. Updated PRD, plan (WP5, WP6, cut lines), architecture routes, challenge, submission. Collected NASA sources for the new features in `docs/data.md`.
- Not tested: every link and number in the new sources section came from web search; the NASA hosts were blocked from this session. Verify on a laptop before use.
- Next: items 5–6 in Next up; nothing coded yet.

### 2026-11-13 · no-API-key plan (Hazheen + Claude)
- Done: switched the SI to mode A (Claude Code, no API key): shared instructions in `prompts/`, Ask becomes a prepared-answer library (`data/generated/answers.json`) with search, validation of inline citations, stale-output warning, docs and skills updated. API scripts kept as mode B.
- Not tested: an SI job run end to end (needs real findings first).
- Next: Day 0 setup, then WP0/WP1.

### 2026-11-13 · foundation (Hazheen + Claude)
- Done: repo foundation: `CLAUDE.md`, all docs, `DESIGN.md` (lint clean), app scaffold (Next.js 16, theme tokens, overview page with seed experiments), data schema + validation + tests, SI scripts (`fetch-ntrs`, `extract-findings`, `build-insights`), CI, PR/issue templates, project skills.
- Not tested: the SI scripts against the live Claude API (no key in that session) and the NTRS API (blocked there). First real run: check the output carefully.
- Half-done: nothing.
- Next: Day 0 setup, then WP0/WP1.
