# Decisions

Newest first. Each entry: date, decision, why, who. Add one whenever you choose between real options, so the next person (or Claude) doesn't reopen it.

- **2026-11-13** **Collaborate in one repo, not forks** (proposed): teammates are added as collaborators on `HazheeNN/NASA-Hackathon-Flame-in-Freefall` and work on branches. A fork works too (PRs from the fork), but one repo means one CI, one Vercel project and no syncing. Confirm on Day 0.
- **2026-11-13** **Demo safety switch `LIVE_SI`**: `off` (or no API key) makes the app use only pre-built insights and cached answers. Why: a live API call on stage is the biggest single risk.
- **2026-11-13** **Human verification gate**: Claude-extracted findings land in `data/raw/proposed/` and reach `data/findings.json` only after a person checks them; `verified` is shown in the UI. Why: validity is a judging criterion, and AI extraction can be wrong.
- **2026-11-13** **Pre-built insights, committed to git**: ranking runs offline (`npm run si:build`) and the output is reviewed and committed. Live AI is only for the advisor. Why: fast, free at demo time, reviewable, can't fail on stage.
- **2026-11-13** **Whole-corpus prompting, no RAG / vector DB**: the corpus (≈ 100 findings) fits in one prompt; prompt caching makes repeats cheap. Why: simpler, nothing to break, and the model can link findings across experiments.
- **2026-11-13** **Claude Opus 5.5 (`claude-opus-5-5`) for all SI**, `CLAUDE_MODEL` to override while iterating. Why: the most capable default model, 1M context, cheaper than earlier Opus. Cost estimate under $40 for the event (`docs/ai.md`).
- **2026-11-13** **No database**: JSON in `data/`, validated with Zod at build. Why: tens to hundreds of read-only records; a DB adds setup, secrets and a failure point.
- **2026-11-13** **Stack: Next.js 16 + TypeScript + Tailwind 4 on Vercel**, Recharts for charts, Lucide icons. Why: most polished result in 2 days with the stack we already use (Deployment Report); static pages are fast and robust.
- **2026-11-13** **Dark theme only, English only, no accounts.** Why: scope. One theme done well beats two half done; check readability on a projector.
- **2026-11-13** **Design reference: mission-control console reading a NASA report, with the microgravity flame sphere as the brand.** IBM Plex Sans + Mono. Why: credible, distinctive, and the flame sphere tells the science story in one image (`DESIGN.md`).
- **2026-11-13** **No NASA insignia or logotype**, and a "not affiliated with or endorsed by NASA" line in the footer. Why: NASA doesn't permit their use on third-party projects.
- **2026-11-13** **Seed experiments are marked unverified**: the foundation was written without access to NASA sites, so every seed fact must be checked and its NTRS search link replaced with a real citation.

## Open decisions

| Question | Options | Decide by |
|---|---|---|
| Product name | Keep "Flame in Freefall" / name the tool (e.g. "Firesight") | Day 1 morning |
| Public repo at submission | Public (judges can read the code) / keep private and link the live site | Before submission |
| One Claude Pro account or two | See `docs/claude-workflow.md` | Day 0 |
| Licence if public | MIT / none | Before making it public |

## Parked

- Light theme, i18n, accounts, a database: after the hackathon, if ever.
- Fine-tuning or training models, physics simulation: out of scope (validity risk).
