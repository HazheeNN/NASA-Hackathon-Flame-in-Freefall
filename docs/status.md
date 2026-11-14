# Status

Read this first. Update it at the end of every session (`handoff` skill). Newest log entry at the top.

## Now

| Who | Working on | Branch | Since |
|---|---|---|---|
| — | — | — | — |

## Next up (in order; take the top unclaimed one)

1. **Day 0:** everyone through `docs/runbook.md` › Day 0; owner sets up Vercel (no API key: SI runs in Claude Code, decision 2026-11-13); decide one Claude account or two (`docs/claude-workflow.md`).
2. **WP0:** paste the full challenge page into `docs/challenge.md`; re-check the plan against its data list.
3. **WP1:** verify the 14 seed experiments; first findings from BASS, Saffire, FLEX.
4. **WP3a:** app shell + insights pages with sample data (can start before real insights exist).
5. **WP5 step 1:** open the links in `docs/data.md` › Sources for Four Worlds… on a laptop (NASA sites were blocked from the cloud session), verify the world and atmosphere values, and start findings on partial gravity, 8.2 psia / 34 % O₂ and ventilation flow.
6. **Verify `data/worlds.json` and `data/atmospheres.json`** (4 worlds, 5 atmospheres, all unverified seeds) against their links; add a `locator` and set `verified: true`. Add credited NASA flame images (`image`) where they exist.
7. **Schema for the test-next proposals (F18):** add when WP6 starts (an optional list next to insights in `generated/insights.json`, written by SI job 2).

## Blocked / waiting

- Nothing yet.

## Numbers

| Experiments | Findings | Verified | Insights | Answers | Deployed |
|---|---|---|---|---|---|
| 14 (0 verified) | 0 | 0 | 0 | 0 | no |

Worlds: 4 · atmospheres: 5 (all unverified seeds).

## Log

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
