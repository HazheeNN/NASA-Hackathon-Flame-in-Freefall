---
name: si-run
description: Run the SI pipeline for Flame in Freefall (rebuild ranked insights, or extract findings) safely, check the cost, and review the output before committing. Use when findings changed and insights need rebuilding, when tuning the SI prompts, or when the user says "run the AI", "rebuild insights", or "si:build".
---

# Run the SI

These scripts call the Claude API and cost real money (see `docs/ai.md` › Cost). Run them on purpose, once, and say what each run cost.

## Before
- `npm run data:validate` passes.
- `ANTHROPIC_API_KEY` is in `.env.local` (don't read the file; if the script says the key is missing, tell the user).
- While iterating on prompts, suggest `CLAUDE_MODEL=claude-sonnet-5-5 npm run si:build` (cheaper); do the final build on the default (`claude-opus-5-5`).

## Rebuild insights
1. `npm run si:build`. It prints tokens and cost, validates, and refuses to write on problems (a made-up finding ID, schema mismatch, refusal, cut-off output). If it refuses, read the error; fix the data or the prompt in `scripts/build-insights.mts`. Don't hand-edit the JSON.
2. Review with the user (`docs/ai.md` › Review): open 2–3 cited findings per top-5 insight and confirm support; partial-gravity claims carry caveats; plain wording; the ranking makes sense.
3. `git diff data/generated/insights.json`: summarise what moved (new insights, rank changes).
4. Commit: `si: rebuild insights (<N> findings, <model>, $<cost>)`.

## Prompt changes
- Prompts live in the scripts (and later `src/app/api/ask/route.ts`). A prompt change is a code change: PR, and re-run the golden questions in `docs/ai.md` for the advisor.
- Keep the stable parts (rules, corpus) first and the question last, so prompt caching works. Check `cache_read_input_tokens` on repeat runs.

## API facts (don't guess)
Model `claude-opus-5-5`; `output_config: { effort, format: zodOutputFormat(schema) }` with `client.messages.parse`; thinking is always on (never send `thinking: {type: "disabled"}` or `budget_tokens`: 400); no assistant prefill; check `stop_reason` for `refusal` / `max_tokens` before using output; citations can't be combined with structured outputs.
