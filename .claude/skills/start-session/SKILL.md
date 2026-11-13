---
name: start-session
description: Begin any work session on Flame in Freefall. Reads docs/status.md, syncs git, and picks up or claims the next task. Use at the start of every session, or when the user says "let's start", "what's next", "continue", or "where were we".
---

# Start a session

The team is 3 people (and maybe one shared Claude account) working in turns over a 2-day hackathon. Starting warm saves an hour.

1. Read `docs/status.md`: Now, Next up, Blocked, Numbers, and the newest log entry.
2. Sync git:
   - `git status`: if there are uncommitted changes, stop and ask the user what they are before touching anything.
   - `git fetch origin && git switch main && git pull --ff-only` (or stay on the user's branch if they're mid-task, then `git merge origin/main` only if they agree).
3. Work out the task:
   - The user named one → use it.
   - Status shows the user's task in progress → resume it; read its handoff notes.
   - Otherwise → propose the top unclaimed item in "Next up", with its work package in `docs/plans/2026-11-hackathon.md` and feature row in `docs/prd.md`.
4. Read only the docs the task needs (the table in `CLAUDE.md` says which). Don't read everything.
5. Reply in 5 lines or fewer: the task, its acceptance criteria, the files you expect to touch, the branch name (`<name>/<task>`), and anything blocked. For anything over an hour, wait for the user's OK before building.
6. Once agreed: create the branch, and add the user to `docs/status.md` › Now (commit that line with the first real change, not on its own).
