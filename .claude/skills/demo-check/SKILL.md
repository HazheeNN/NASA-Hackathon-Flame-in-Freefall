---
name: demo-check
description: Pre-demo and pre-submission checklist for Flame in Freefall. Verifies the build, the deploy, the no-API fallback, the golden questions, screenshots and security. Use before the feature freeze, before recording the video, before submitting, and before the live pitch.
---

# Demo check

Go through it in order and report each item as ✅ / ❌ (with the problem) / ⏭ (not run, and why). Don't mark something ✅ you didn't actually check.

## Build and data
- [ ] `npm run check` green; `npm run data:validate` green; numbers match `docs/status.md`.
- [ ] `data/generated/insights.json` was built from the current findings (its `findingsHash` matches: rebuild if findings changed since).
- [ ] `scripts/security-scan.sh` and `npm audit` clean.

## Deploy
- [ ] Latest `main` is deployed to Production on Vercel; the URL opens on a phone and the demo laptop.
- [ ] No console errors on any page (check with Playwright or devtools).

## Demo flow (`docs/prd.md` › Flow 1)
- [ ] Overview → #1 insight → cited finding → NASA source link opens.
- [ ] Mission lens → Mars surface shows gaps.
- [ ] Ask: live answer streams with citations in < 3 s to first words.
- [ ] Same flow with `LIVE_SI=off` (or no key): suggested questions show pre-generated answers, labelled; nothing errors.
- [ ] Golden questions (`docs/ai.md`) ≥ 9/10 correct and cited.

## Look
- [ ] Screenshots of every page at 360 px and 1440 px; nothing overflows; empty and error states look intentional.
- [ ] Readable with screen brightness down (projector test); focus ring visible; reduced motion respected.
- [ ] No NASA logo anywhere; footer disclaimer present.

## Submission (`docs/submission.md`)
- [ ] Every claim in the video and slides is in the app with a source.
- [ ] Links work in a private browser window; video is public.
- [ ] Submitted ≥ 2 hours before the deadline.
