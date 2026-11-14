# Submission

⚠ Fill the exact requirements from the event site on Day 1 (format, lengths, deadline and time zone). What follows is our draft, based on how Space Apps submissions have usually worked.

## Checklist

- [ ] Deadline: `____` (time zone: `____`). Our internal deadline: 2 hours earlier.
- [ ] Team page complete: all 3 members.
- [ ] Project title and one-line summary.
- [ ] Project page text (below), with the NASA data and resources used and the AI disclosure.
- [ ] Demo: video (length limit: `____`) and/or slides (max `____`), uploaded and publicly viewable link checked in a private browser window.
- [ ] Link to the live app (Vercel) and the repo (if public).
- [ ] Final production deploy checked on a phone and a laptop.
- [ ] Every claim in the video and slides exists in the app with a source.

## Project page (draft, rewrite with real numbers)

**Title:** Flame in Freefall

**High-level summary (≈ 100 words):**
Fire is one of the most dangerous emergencies a crew can face, and in microgravity it behaves in ways our Earth instincts get wrong. NASA has studied it for decades, from drop towers to the space station to full-scale fires inside empty cargo ships, but the results are spread across hundreds of reports. Flame in Freefall is an AI-powered dashboard that reads that research, verifies findings with people in the loop, ranks the fire safety insights that matter most for the Moon and Mars with a transparent rubric, and answers questions with a NASA source behind every claim.

**What it does / how it works:**
1. Corpus: N findings from M NASA experiments (list), each with conditions, numbers and a cited source; X % checked by a person.
2. SI layer (Claude by Anthropic): extracts findings from papers, links them across experiments into ranked insights (safety relevance, severity, evidence, actionability), and prepares cited answers to the questions mission planners ask, all reviewed by the team.
3. Same Fire, Four Worlds and the gaps map: how fire differs on Earth, the ISS, the Moon and Mars, where NASA has never burned anything, and the experiments our SI proposes next. The Habitat Designer shows the evidence for a habitat's air.

**Benefits:** faster, evidence-backed fire safety decisions for habitat and vehicle design; a map of evidence gaps for future experiments; a clear explainer for crews and the public.

**NASA data and resources used:** (list every source with a link: NTRS reports, PSI datasets, the challenge's listed resources.)

**Space agency partner resources used:** (if any, e.g. JAXA FLARE.)

**Tools and technologies:** Next.js, TypeScript, Tailwind CSS, Recharts, Vercel; Claude (Anthropic, Opus 5.5, via Claude Code) for analysis.

**Use of AI:** Claude (Anthropic) is our analysis engine: it extracted findings from NASA papers (each verified by a person), ranked them into insights with a published rubric, and prepared cited answers, always from the NASA findings only. All AI output was reviewed before publishing; the app makes no live AI calls. We also used Claude Code as a coding assistant. No AI-generated images; no NASA logos.

**References:** link to the Sources page in the app.

## Demo video script (fit to the limit; this is ≈ 30 s)

| Time | Screen | Voice-over |
|---|---|---|
| 0–4 s | Flame sphere, title | "In space, fire doesn't rise. It spreads in ways we don't expect." |
| 4–10 s | Overview KPIs | "NASA has decades of experiments. We put them in one place: N findings, all sourced." |
| 10–18 s | #1 insight → cited findings | "Our AI ranks what matters most for crew safety and shows the evidence behind every claim." |
| 18–25 s | Four Worlds → Mars gap, Ask search → answer | "Planning a Mars habitat? Ask, and get a cited answer in seconds." |
| 25–30 s | Evidence gaps, URL | "And see what NASA still needs to test. Flame in Freefall." |

Recording: screen capture at 1920×1080 (OBS or QuickTime), browser at 100 % zoom, voice recorded separately in a quiet room, captions burned in, no music with lyrics.

## Slides outline (if slides are used; 7 max)

1. **Title:** flame sphere, name, one-line pitch, team.
2. **Problem:** fire in microgravity is different; results scattered across decades and reports; Moon and Mars raise the stakes (more O₂, partial gravity).
3. **Solution:** the dashboard in one screenshot.
4. **How the SI works:** extract → verify → rank → interpret → ask (the diagram from `docs/ai.md`).
5. **Top insights:** 2–3 real ranked insights with their citations.
6. **Validity:** sources, verification %, rubric, evidence gaps.
7. **Impact and next steps:** for mission planners; more data (PSI), partial-gravity gaps; links.

## Live demo (3 minutes)

Follow `docs/prd.md` › Flow 1. Rehearse it 3 times; once offline on a local build. Have the video ready as a backup.

## Likely judge questions (prepare answers)

- How do you know the AI isn't making things up? → citations, verification gate, validation in CI, golden questions.
- Why is insight #1 ranked first? → the four scores and the rubric.
- What data did you use? → Sources page.
- What would you do with more time? → more PSI raw data, partial-gravity gap analysis, NASA-STD-6001 comparison.
- How much does it cost to run? → nothing at runtime: it's a static site; the AI work happens offline and is reviewed.
- Why not a live chatbot? → every answer is reviewed and cited before anyone sees it; live answers are a small upgrade (`docs/ai.md` › Mode B) once validity is proven.
- Is the AI really doing the work? → show `prompts/`, a proposed-vs-verified finding, and the rubric scores.
