---
name: handoff
description: End a work session on Flame in Freefall cleanly. Updates docs/status.md (done, half-done, next, numbers), commits and pushes the branch. Use when the user says "wrap up", "handoff", "I'm stopping", "save progress", or when the session or usage limit is about to run out.
---

# Hand off

Someone else (or a fresh session with no memory) continues from what you write here.

1. Run `npm run check` (or at least `npm run typecheck && npm run data:validate` if time is short). Note what passed and what didn't; don't hide failures.
2. Update `docs/status.md`:
   - **Now:** remove or update the user's row.
   - **Next up:** reorder if priorities changed; add newly discovered tasks.
   - **Blocked:** anything waiting on a person, a key or a decision.
   - **Numbers:** experiments, findings, verified, insights (from `npm run data:validate` output and `data/generated/insights.json`), deployed yes/no.
   - **Log:** a new entry at the top: date, who, done, not tested, half-done (with file names and what's left), next.
3. If a decision was made, add it to `docs/decisions.md`. If a feature shipped, update its status in `docs/prd.md`.
4. Commit with a clear message and push the branch (`git push -u origin <branch>`). Never push to `main`.
5. If the work is ready for review, open a draft PR using `.github/pull_request_template.md`, with screenshots if UI changed.
6. Tell the user in 3 lines: what's saved, the PR link if any, what the next person should do first.
