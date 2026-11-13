---
name: build-slice
description: Build one feature slice of Flame in Freefall end to end (data, page, polish, screenshots, PR) following the project's rules. Use when implementing any feature from docs/prd.md (F1–F17) or a work package from the hackathon plan, e.g. "build the findings explorer", "do WP5", "add the mission lens".
---

# Build a slice

## 1. Spec (no code yet)
- Read the feature row in `docs/prd.md` (acceptance criteria), its work package in `docs/plans/2026-11-hackathon.md`, and the routes and rules in `docs/architecture.md`. For UI also read `DESIGN.md` (Components, Layout, Do's and Don'ts). For AI work read `docs/ai.md`.
- Write a short plan: files to add or change, components, data functions, what you'll verify. Wait for the user's OK if it's over an hour of work.

## 2. Build
- Server components by default; `"use client"` only for interactive parts (filters, charts, Ask), fed plain props.
- Data only through `src/lib/data.ts`; types from `src/lib/schema.ts`; filtering/sorting in small pure functions in `src/lib/` (add a Vitest test when not trivial).
- Styling only with theme tokens (`bg-surface`, `text-muted`, `border-line`, `text-primary`, `risk-*`, …). No raw hex, no `dark:`. Lucide icons per the `DESIGN.md` table, 20 px, stroke 1.75.
- Layout: 1 column on phones, 2 on tablets (`sm:`), 3 on wide desktops (`xl:`); nothing narrower than the screen allows.
- Every fact on screen shows its source (citation chip or source line); unverified data shows its badge; AI text shows the sparkles icon and "AI-generated from N cited findings".
- Units through `src/lib/format.ts`. Words from the `docs/science.md` glossary.
- No new dependency unless the plan says so (Recharts is pre-approved for charts).
- Next.js 16: `params`/`searchParams` are Promises; check `node_modules/next/dist/docs/` for anything you're unsure of.

## 3. Verify
- `npm run check` (typecheck, lint, tests, build) and `npm run data:validate`.
- Screenshots at 360 px and 1440 px (Playwright with `deviceScaleFactor: 1` for your own checks; 2 for ones the team will see). Look at them against `DESIGN.md`: spacing, hierarchy, contrast, empty states, long text.
- Check the empty state (no data) and the error state.

## 4. Ship
- Update the feature's status in `docs/prd.md`.
- Commit, push the branch, open a draft PR with the template: what changed, screenshots, what was and wasn't tested.
- Run the `handoff` skill if the session is ending.
