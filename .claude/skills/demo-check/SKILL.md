---
name: demo-check
description: Pre-demo and pre-submission checklist for Flame in Freefall. Verifies the build, the deploy, offline safety, the SI output freshness, the golden questions, screenshots and security. Use before the feature freeze, before recording the video, before submitting, and before the live pitch.
---

# Demo check

Go through it in order and report each item as ✅ / ❌ (with the problem) / ⏭ (not run, and why). Don't mark something ✅ you didn't actually check.

## Build and data
- [ ] `npm run check` green; `npm run data:validate` green; numbers match `docs/status.md`.
- [ ] `npm run data:validate` prints no stale warning (insights and answers were made from the current findings; otherwise run SI jobs 2 and 3).
- [ ] `scripts/security-scan.sh` and `npm audit` clean.

## Deploy
- [ ] Latest `main` is deployed to Production on Vercel; the URL opens on a phone and the demo laptop.
- [ ] No console errors on any page (check with Playwright or devtools).

## Demo flow (`docs/prd.md` › Flow 1)
- [ ] Overview → #1 insight → cited finding → NASA source link opens.
- [ ] Mission lens → Mars surface shows gaps.
- [ ] Ask: typing a few words of each golden question finds it; answers show citation chips that open findings; the "prepared by our SI" label is visible.
- [ ] Golden questions (`docs/ai.md`) ≥ 9/10 correct and cited.
- [ ] Local production build works with Wi-Fi off (`npm run build && npm start`).

## Look
- [ ] Screenshots of every page at 360 px and 1440 px; nothing overflows; empty and error states look intentional.
- [ ] Readable with screen brightness down (projector test); focus ring visible; reduced motion respected.
- [ ] No NASA logo anywhere; footer disclaimer present.

## Submission (`docs/submission.md`)
- [ ] Every claim in the video and slides is in the app with a source.
- [ ] Links work in a private browser window; video is public.
- [ ] Submitted ≥ 2 hours before the deadline.
