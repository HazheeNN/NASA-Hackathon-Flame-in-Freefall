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

## Blocked / waiting

- Nothing yet.

## Numbers

| Experiments | Findings | Verified | Insights | Answers | Deployed |
|---|---|---|---|---|---|
| 14 (0 verified) | 0 | 0 | 0 | 0 | no |

## Log

### 2026-11-13 · no-API-key plan (Hazheen + Claude)
- Done: switched the SI to mode A (Claude Code, no API key): shared instructions in `prompts/`, Ask becomes a prepared-answer library (`data/generated/answers.json`) with search, validation of inline citations, stale-output warning, docs and skills updated. API scripts kept as mode B.
- Not tested: an SI job run end to end (needs real findings first).
- Next: Day 0 setup, then WP0/WP1.

### 2026-11-13 · foundation (Hazheen + Claude)
- Done: repo foundation: `CLAUDE.md`, all docs, `DESIGN.md` (lint clean), app scaffold (Next.js 16, theme tokens, overview page with seed experiments), data schema + validation + tests, SI scripts (`fetch-ntrs`, `extract-findings`, `build-insights`), CI, PR/issue templates, project skills.
- Not tested: the SI scripts against the live Claude API (no key in that session) and the NTRS API (blocked there). First real run: check the output carefully.
- Half-done: nothing.
- Next: Day 0 setup, then WP0/WP1.
