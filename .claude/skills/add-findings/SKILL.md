---
name: add-findings
description: Turn a NASA paper or report into verified findings in data/findings.json, following docs/data.md. Use when the user wants to add a paper, an experiment's results, or more findings to the corpus, or to verify proposed findings.
---

# Add findings

Validity is a judging criterion. A finding is worth adding only if a person can check it against its source in under 5 minutes.

1. **Pick the source.** If the user has none: `npm run data:ntrs -- "<experiment> <topic>"` and suggest 2–3 results with numbers and clear conclusions (prefer results papers and final reports). The user downloads the PDF to `data/raw/`.
2. **Experiment.** Make sure the `experimentId` exists in `data/experiments.json`; if not, add the experiment (with `verified: false` unless checked).
3. **Extract.** Run SI job 1 in this session (`si-run` skill › Job 1): ask the user for the abstract and the results/conclusions pages (not the whole PDF: Pro usage), follow `prompts/extract.md`, write `data/raw/proposed/<file>.json`. (With an API key, `npm run si:extract` does the same.)
4. **Verify with the user,** finding by finding, against the PDF at each `locator` (`docs/data.md` › Verification): the quote is really there; numbers, units and conditions match; the statement claims no more than the source; the implication is worded as an implication. Fix or drop. Never upgrade evidence strength without a second source.
5. **Add** the kept findings to `data/findings.json`: next free `F-###` IDs after pulling `main`, `verified: true` only for those the user actually checked, remove `_quote`.
6. `npm run data:validate`. Fix the data, never loosen the schema.
7. Commit per paper or per experiment: `data: <experiment> findings from <short title>`. Update the Numbers row in `docs/status.md`.
8. `npm run data:validate` will now warn that insights and answers are stale; that's expected. They get rebuilt at the planned checkpoints (`si-run` skill), not after every paper.

Never invent or "fill in" numbers, conditions or sources. Leave fields out instead.
