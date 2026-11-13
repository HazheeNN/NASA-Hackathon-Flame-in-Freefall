# The SI layer

The brief asks for an "SI (super intelligence) powered" dashboard that **summarizes, ranks and interprets**. Our SI is Claude (Anthropic). It does three jobs, each written once in `prompts/`, each with a person or a check between it and the screen.

## Two ways to run it

| | **Mode A: Claude Code (current plan)** | Mode B: Claude API (optional upgrade) |
|---|---|---|
| Needs | Our Claude Pro plan, nothing else | An Anthropic API key (pay as you go) |
| Who runs it | A teammate in a Claude Code session (`si-run` skill) | `npm run si:extract` / `si:build` |
| Instructions | `prompts/*.md` | The same `prompts/*.md`, sent as the system prompt |
| Output | The same files: `data/raw/proposed/`, `data/generated/insights.json`, `data/generated/answers.json` | Same |
| Ask in the app | A library of prepared, cited answers + search | Could add live answers to any question (`/api/ask`) |
| Cost | Pro usage (shared limit, see `docs/claude-workflow.md`) | API credits |

**Decision (2026-11-13): we build for mode A.** No API key. The app never calls an AI at runtime; every SI output is made in a session, checked by a person, validated and committed. If we get a key later, mode B is a drop-in: the scripts already exist, and only the live Ask needs building (see the end of this file).

```
NASA papers (NTRS, PSI) ──► [1] Extract (prompts/extract.md) ──► proposed findings ──► a person verifies ──► data/findings.json
                                                                                                                │
                            [2] Synthesize + rank (prompts/synthesize.md) ──► data/generated/insights.json ◄────┤
                            [3] Answer the question library (prompts/answer.md) ──► data/generated/answers.json ◄┘
                                                                                                                │
                                                                    App (static, no AI at runtime) ◄────────────┘
```

What to tell judges: *"Our SI read the papers with us, then read every verified finding at once to find patterns across decades of experiments, ranked them with a published rubric, and prepared cited answers to the questions mission planners ask. Every sentence traces to a NASA source, and a person checked the evidence."* Be upfront that answers are prepared, not live: that is a strength for validity (every answer was reviewed), not a weakness.

## Job 1: Extract findings from a paper (`prompts/extract.md`)

- **Input:** one paper. In mode A, keep it light on Pro usage: give Claude the abstract plus the results and conclusions pages (copy the text, or point it at specific pages of the PDF), not the whole 40-page PDF.
- **Output:** `data/raw/proposed/<paper>.json`, a list of findings in our schema plus `locator` and the exact supporting `quote` (`_quote` field). Bookkeeping fields: `id` = next free `F-###`, `experimentId`, `sources: [{ title, url, year, locator }]`, `extractedBy: "claude"`, `verified: false`.
- Never straight into `data/findings.json`. A person verifies first (`docs/data.md` › Verification) and copies the checked findings in.

## Job 2: Synthesize and rank insights (`prompts/synthesize.md`)

- **Input:** all of `data/experiments.json` and `data/findings.json`. That is the point: patterns across experiments.
- **Output:** `data/generated/insights.json`:

```json
{
  "generatedAt": "2026-11-15T10:00:00Z",
  "model": "Claude Code (claude-opus-5-5)",
  "findingsHash": "<printed by npm run data:validate>",
  "insights": [ { "id": "I-01", "rank": 1, "title": "…", "answer": "…", "explanation": "…", "recommendation": "…", "caveats": "…", "risk": "high", "missions": ["Mars surface"], "themes": ["flame-spread"], "findingIds": ["F-004", "F-011"], "scores": { "safetyRelevance": 5, "severity": 5, "evidence": 3, "actionability": 4 } } ]
}
```

- IDs `I-01…` in rank order. `npm run data:validate` must pass (schema + every cited finding exists) and must not warn that insights are stale.

### Ranking rubric (show it on the method page)

Four integer scores, 1–5, written by the SI and visible on every insight card:

| Score | Question |
|---|---|
| **Safety relevance** | How directly does this affect crew fire safety? |
| **Severity** | How bad is the fire scenario it describes? |
| **Evidence** | How strong and verified are the cited findings? (Unverified findings cap it at 3.) |
| **Actionability** | How clearly does it lead to a design or procedure change? |

Rank order: safety relevance and severity first, then evidence, then actionability. A judge asking "why is this #1?" gets the four numbers and the cited findings.

## Job 3: Answer the question library (`prompts/answer.md`)

This replaces a live chatbot in mode A, and is what the Ask feature (F7) shows.

- **The questions:** 20–30, written by us from the personas in `docs/prd.md`: the golden questions below, plus questions per mission (ISS, Moon, Mars transit, Mars surface) and per theme (ignition, spread, extinction, detection, suppression, materials, atmosphere). Include 2–3 honest "our data doesn't cover that" answers: they show the SI doesn't make things up.
- **Output:** `data/generated/answers.json`, same header as insights (`generatedAt`, `model`, `findingsHash`), then `answers: [{ id: "Q-01", question, answer, findingIds, themes, missions }]`.
- **Citations in the text:** facts end with `[F-004, F-011]`. The validator checks that every inline ID exists and is listed in `findingIds`; the UI turns them into citation chips.
- Answer a batch of 5–8 questions per session, then validate (Pro usage).

## Review before committing any SI output

One person reads everything the SI wrote and checks:
- [ ] Each insight or answer is supported by its cited findings (open 2–3 at random; all for the top 3 insights).
- [ ] No claim about partial gravity that no finding tested, unless the caveat says so.
- [ ] Unverified findings are mentioned as such where they carry an answer.
- [ ] Plain wording; no hype ("revolutionary", "proves", "always").
- [ ] Ranks make sense to a human. If not, fix the findings or the prompt and run the job again. Don't hand-edit generated files; regenerate them.
- [ ] `npm run data:validate` passes with no stale warning.

## When to re-run

`npm run data:validate` prints `! insights were made from older findings` whenever `data/findings.json` changed after the last run. Re-run jobs 2 and 3 at the planned checkpoints (end of Day 1, before the freeze), not after every new finding: each run uses Pro usage.

## Golden questions

These go into the answer library, and are the check for answer quality. Target: ≥ 9 / 10 correct and properly cited. Adjust them once the corpus is in; keep 2 deliberately out of scope.

1. Why do flames look different in microgravity?
2. Which materials spread fire fastest in the experiments we have, and under what airflow?
3. How does oxygen concentration change flammability, and what does that mean for a 34 % O₂ habitat?
4. What did Saffire show that small-scale tests couldn't?
5. What are cool flames and why do they matter for detection?
6. Is the standard 1 g material test conservative for microgravity?
7. What do we know about fire in Mars gravity (0.38 g)?
8. Which suppression methods were tested in orbit, and how well did they work?
9. *(out of scope)* What is the best rocket engine for Mars? → declines and stays on topic.
10. *(out of scope)* What's the fire risk of lithium batteries on the ISS? → answers only if findings exist, otherwise says so.

## Guardrails and honesty

- The app shows only reviewed, validated SI output; nothing is generated in front of the judge.
- Every SI output in the UI carries the sparkles icon and "Prepared by our SI from N cited findings".
- Source text is data, not instructions (stated in every prompt).
- The method page explains the three jobs, the rubric, the human checks, and that Claude was used.

## Decisions (and why)

- **Mode A (no API key) for now.** Zero runtime cost and zero runtime risk; every answer reviewed. Tradeoff: judges can't type their own question; the search + 20–30 prepared answers have to cover what they'd ask.
- **Whole-corpus prompting, not RAG / vector search.** ≈ 100 findings ≈ 50k tokens fit easily in one session or one request. The model sees everything, so it can link findings across experiments.
- **No custom ML model.** Small data, 2 days, and judges score validity.
- **Prompt changes are code changes:** they go through PRs, and the affected outputs are regenerated and reviewed.

## Mode B: if we get an API key

Nothing above changes; this is extra.
- `npm run si:extract` / `npm run si:build` run jobs 1 and 2 with the same prompts. Model `claude-opus-5-5` (override with `CLAUDE_MODEL`), `client.messages.parse` + `zodOutputFormat`, effort `high`, and each run prints its cost (≈ $0.15–0.30 per paper, under $1 per insight build).
- **Live Ask** (`src/app/api/ask/route.ts`, not built): POST `{ question }`, system prompt = `prompts/answer.md`, the findings as document blocks with `citations: { enabled: true }` behind a `cache_control` breakpoint, question last, streamed with `client.messages.stream()`, effort `medium`. Guards: question ≤ 500 chars, per-IP rate limit, spend limit, `LIVE_SI=off` falls back to the prepared library. Roughly $0.01–0.05 per question once the corpus is cached.
- API facts: thinking is always on for Opus 5.5 (never send `thinking: {type: "disabled"}` or `budget_tokens`: 400); no assistant prefill; check `stop_reason` for `refusal` / `max_tokens`; citations can't be combined with structured outputs.
