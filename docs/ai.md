# The SI layer

The brief asks for an "SI (super intelligence) powered" dashboard that **summarizes, ranks and interprets**. Our SI is Claude (Anthropic), used in three layers, each with a person or a check between it and the screen.

```
NASA papers (NTRS, PSI) ──► [1] Extraction ──► proposed findings ──► people verify ──► data/findings.json
                                (offline)                                                  │
                                                                                           ▼
                            [2] Synthesis + ranking (offline) ──► data/generated/insights.json ──► Insights, overview, mission lens
                                                                                           │
                            [3] Live advisor (runtime, /api/ask) ◄── corpus in a cached prompt ◄─┘ ──► Ask panel (streamed, cited)
```

What to tell judges: *"The SI read the papers with us, then read every verified finding at once to find patterns across 50 years of experiments, ranked them with a published rubric, and answers your questions only from that evidence, with citations."*

## Model and settings

- **Model:** `claude-opus-5-5` everywhere (Anthropic's current default Opus: 1M context, $4 / $20 per million input/output tokens, cache reads $0.20). Override per run with `CLAUDE_MODEL` (e.g. `claude-sonnet-5-5` at $2 / $10 while iterating on prompts, then rebuild the final insights on Opus).
- **Thinking:** Opus 5.5 always thinks adaptively. Control depth with `output_config.effort`: `high` for extraction and ranking (quality matters, runs are rare), `medium` for the advisor (speed). Don't send `thinking: {type: "disabled"}` or `budget_tokens`: both return 400 on this model.
- **Structured outputs:** `client.messages.parse()` with `output_config.format: zodOutputFormat(schema)`, using the schemas in `src/lib/schema.ts`. Check `stop_reason` (`refusal`, `max_tokens`) before using the output; `parsed_output` is null if parsing failed.
- **No assistant prefill** (400 on this model), no `temperature`.
- **Credentials:** `ANTHROPIC_API_KEY` from the Anthropic Console (pay as you go). A Claude Pro subscription does not include API access (`docs/runbook.md`).

## Layer 1: Extraction (`scripts/extract-findings.mts`)

- Input: one paper (PDF as a `document` block, or text). Output: proposed findings in our schema plus `locator` and the exact supporting `quote`.
- The prompt forbids outside knowledge and extrapolation, and allows 0 findings.
- Output goes to `data/raw/proposed/`, never into `findings.json`. A person verifies (`docs/data.md` › Verification).
- Cost: a 20-page paper is roughly 30–60k input tokens → about $0.15–0.30 on Opus 5.5. Budget ≈ $5–10 for the whole corpus.

## Layer 2: Synthesis and ranking (`scripts/build-insights.mts`)

- Sends **all** experiments and findings in one request (whole-corpus prompting; see Decisions) and gets back 8–15 insights matching `Insight` in the schema.
- Each insight: `title`, `answer` (one actionable sentence), `explanation`, `recommendation`, `caveats`, `risk`, `missions`, `themes`, `findingIds`, `scores`.
- The script validates the result (schema + every cited finding exists) and refuses to write on any problem. It records `model`, `generatedAt` and a hash of the findings it read.

### Ranking rubric (show it on the method page)

Four integer scores, 1–5, written by the SI and visible on every insight card:

| Score | Question |
|---|---|
| **Safety relevance** | How directly does this affect crew fire safety? |
| **Severity** | How bad is the fire scenario it describes? |
| **Evidence** | How strong and verified are the cited findings? (Unverified findings cap it at 3.) |
| **Actionability** | How clearly does it lead to a design or procedure change? |

Rank order: safety relevance and severity first, then evidence, then actionability. The SI writes the scores; the order is explainable and stable. A judge asking "why is this #1?" gets the four numbers and the cited findings.

### Review before committing insights

After every `si:build`, one person reads all insights and checks:
- [ ] Each `answer` is supported by its cited findings (open 2–3 at random).
- [ ] No insight claims something about partial gravity that no finding tested, unless the caveat says so.
- [ ] Wording is plain; no hype ("revolutionary", "proves").
- [ ] Ranks make sense to a human. If not, fix the findings or the prompt and rebuild. Never edit the JSON by hand.

## Layer 3: Live advisor (`/api/ask`, to build)

- Route handler (`src/app/api/ask/route.ts`), POST `{ question }`, streams the answer.
- **Prompt layout (for caching):** system prompt (stable rules) → corpus (all findings, each as its own document block with `citations: { enabled: true }`, plus the experiments) with `cache_control: { type: "ephemeral" }` → the question last. The corpus prefix is identical on every request, so after the first call it's read from cache (≈ 10× cheaper, much faster first token).
- **Citations:** use the API's citations feature on the finding documents, so the answer comes back with citation objects pointing at the exact finding. Render them as `F-012` chips. Citations can't be combined with structured outputs, so the advisor returns text + citations, not JSON.
- **Rules in the system prompt:** answer only from the findings; say "our NASA data doesn't cover that" when it doesn't, and name the closest findings; lead with the answer in one sentence; mark extrapolation to partial gravity; plain language; ≤ 200 words unless asked.
- **Effort** `medium`; `max_tokens` ≈ 4000; stream with `client.messages.stream()`.
- **Guards** (`docs/security.md`): question ≤ 500 characters, rate limit per IP (e.g. 10 per minute, in memory), `LIVE_SI=off` or no key → cached answers.
- **Fallback (F10):** the 6 suggested questions have pre-generated answers saved in `data/generated/answers.json` (made by a small script with the same prompt). Shown with a "pre-generated" label when live SI is off or fails.
- **Cost:** corpus ≈ 50–80k tokens. First call writes the cache (≈ $0.30), later calls read it (≈ $0.01–0.02) plus ≈ $0.02–0.05 output. A 2-day event with heavy testing: under $20.

## Evaluation: golden questions

Before the demo (and after any prompt change), ask the advisor these and check the citations by hand. Target ≥ 9 / 10 correct and cited. Adjust the questions once the corpus is in; keep 2 deliberately out of scope.

1. Why do flames look different in microgravity?
2. Which materials spread fire fastest in the experiments we have, and under what airflow?
3. How does oxygen concentration change flammability, and what does that mean for a 34 % O₂ habitat?
4. What did Saffire show that small-scale tests couldn't?
5. What are cool flames and why do they matter for detection?
6. Is the standard 1 g material test conservative for microgravity?
7. What do we know about fire in Mars gravity (0.38 g)?
8. Which suppression methods were tested in orbit, and how well did they work?
9. *(out of scope)* What is the best rocket engine for Mars? → should decline and stay on topic.
10. *(out of scope)* What's the fire risk of lithium batteries on the ISS? → answer only if findings exist, otherwise say so.

## Guardrails and honesty

- The SI never sees the internet at runtime; only our corpus.
- Source text is data, not instructions. The system prompt says so (papers won't attack us, but it's the right habit).
- Every SI output in the UI carries the sparkles icon and "AI-generated from N cited findings".
- The method page discloses the model, what it did, and what people checked.

## Decisions (and why)

- **Whole-corpus prompting, not RAG / vector search.** ≈ 100 findings ≈ 50k tokens: fits easily in Opus 5.5's 1M context. The model sees everything, so it can link findings across experiments (the point of "interpret"), and there's no embedding store to build or break.
- **Pre-built insights, not live.** Ranking happens once, gets reviewed, and is committed. Fast, free at demo time, reviewable, deterministic.
- **No custom ML model.** Small data, 2 days, and judges score validity; a fine-tuned or trained model would add risk, not credibility.
- **Prompt changes are code changes:** they go through PRs, and the golden questions are re-run after them.
