# SI instructions

The three jobs our SI (Claude) does, written once. Both ways of running the SI follow these files word for word:

- **Mode A, default (no API key):** Claude Code does the job inside a session, following the file (`si-run` skill).
- **Mode B, optional (API key):** the scripts in `scripts/` send the same file as the system prompt.

| File | Job | Output |
|---|---|---|
| `extract.md` | Read one NASA paper, propose findings | `data/raw/proposed/<paper>.json` (a person verifies before anything reaches `data/findings.json`) |
| `synthesize.md` | Read all findings, write ranked insights | `data/generated/insights.json` |
| `answer.md` | Answer one question from the findings, with citations | an entry in `data/generated/answers.json` |

A change here is a code change: PR, then re-run the job and review the output (`docs/ai.md` › Review).
