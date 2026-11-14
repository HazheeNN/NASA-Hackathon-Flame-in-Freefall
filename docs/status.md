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
6. **Schema (small, before WP5/WP6 code):** add world and atmosphere-preset records (gravity, pressure, O₂, source) and the test-next proposals to `src/lib/schema.ts` + `docs/data.md`; the `missions` values stay as they are.

## Blocked / waiting

- Nothing yet.

## Numbers

| Experiments | Findings | Verified | Insights | Answers | Deployed |
|---|---|---|---|---|---|
| 14 (0 verified) | 0 | 0 | 0 | 0 | no |

## Log

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
