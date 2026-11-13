# Product Requirements Document: Flame in Freefall

Status legend: ✅ shipped · 🔧 in progress · ⏳ planned · ✂️ cut. Update the status in the same PR that ships the feature.

## Product overview

**Vision:** An AI analyst that has read NASA's fire-in-space research, so anyone planning a crewed mission can see what matters most for fire safety, why, and how sure we are, in seconds, with a source on every claim.

**Target users:** hackathon judges first (they decide); mission fire-safety engineers and crew trainers as the story; students and the public as a bonus.

**Objectives:**
1. Win the challenge: answer every word of the brief (`docs/challenge.md`) visibly within the first minute of the demo.
2. Be trustworthy: every number and AI sentence traces to a NASA source.
3. Never fail on stage: the demo works with the API down.

**Success metrics (by submission):**
- ≥ 40 findings from ≥ 8 experiments, ≥ 75 % of them verified by a person.
- 8–15 ranked insights, each citing ≥ 2 findings, with 0 citations to missing findings (CI checks this).
- The advisor answers the 10 "golden questions" (`docs/ai.md` › Evaluation) with correct citations, 9 of 10 or better.
- The 3-minute demo runs 3 times in a row without a hitch, once with `LIVE_SI=off`.
- Lighthouse accessibility ≥ 95 on the overview; usable at 360 px.

## Personas

### 1. The judge (primary)
- **Who:** scientist, engineer or industry volunteer; scoring many projects; 3–5 minutes on ours; laptop or projector.
- **Goals:** understand the idea in 10 seconds; see real NASA data; see the AI do something non-trivial; judge validity.
- **Pain points:** generic chatbots with a space skin; claims with no source; demos that break.
- **Journey:** lands on the overview → reads the hero and the top 3 insights → opens one, sees cited findings and a NASA source → asks the advisor a question → sees the Mars lens → watches the video / reads the project page.

### 2. Maya, mission fire-safety engineer (story persona)
- **Who:** works on habitat and vehicle design for Artemis and Mars; expert reader; desktop.
- **Goals:** "Which findings change my material choices, ventilation design and detector placement for a 0.38 g habitat at 34 % O₂?"
- **Pain points:** results scattered over decades of reports (NTRS, PSI, journals); partial gravity barely tested; hard to compare conditions.
- **Journey:** picks the Mars-surface lens → sees ranked insights and the conditions they were tested under → filters findings by oxygen and gravity → asks the advisor to compare Saffire with BASS → copies the cited answer into a design review.

### 3. Sam, crew trainer
- **Who:** prepares astronauts for emergencies; tablet; plain language.
- **Goals:** what a fire in microgravity looks like (dim, blue, spherical; cool flames) and what that means for detection and response.
- **Journey:** reads the "How fire is different in space" explainer → watches the comparison chart → reads the high-risk insights.

### 4. Student / public (bonus)
- Phone; curiosity. The overview and explainer must read well at 360 px.

## Feature requirements

| # | Feature | Description | User story | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| F1 | **Verified corpus** | Experiments and findings in `data/`, each with a NASA source, conditions and evidence strength | As a judge, I want to see the AI works on real NASA data | Must | ≥ 40 findings, ≥ 8 experiments, every finding has a source URL and locator, ≥ 75 % verified, `data:validate` passes | 🔧 (14 seed experiments, unverified) |
| F2 | **SI pipeline: extraction** | Claude proposes findings from a NASA paper; a person verifies | As a teammate, I want to turn a 30-page paper into findings in minutes | Must | `si:extract` outputs schema-valid proposals with page locators and exact quotes; nothing reaches `findings.json` unverified-and-unlabelled | 🔧 script written, untested against the API |
| F3 | **SI pipeline: synthesis and ranking** | Claude links findings across experiments into ranked insights with 4 scores | As Maya, I want the most important fire risks first, and to know why they rank there | Must | 8–15 insights, each citing ≥ 2 findings, scores shown, validation passes, `generatedAt` and model recorded | 🔧 script written, untested |
| F4 | **Overview dashboard** | Hero, KPIs, top 3 insights, one hero chart, entry points | As a judge, I want the idea and the value in 10 seconds | Must | Above the fold at 1440 px: one-line pitch, KPIs, top insight; works at 360 px | 🔧 foundation version |
| F5 | **Ranked insights page + detail** | All insights by rank with risk badge, missions, scores; detail with answer → explanation → recommendation → caveats → cited findings | As Maya, I want to drill from an insight to the evidence | Must | Every citation chip opens its finding; risk is word + colour + icon; filter by mission and theme | ⏳ |
| F6 | **Findings explorer** | Search and filter findings by experiment, theme, gravity, O₂, platform, verified | As Maya, I want to find all results at high oxygen | Must | Filters combine; result count shown; URL keeps the filters (shareable); empty state explains | ⏳ |
| F7 | **Ask the advisor (live SI)** | Ask a question; Claude answers from the corpus only, streamed, with finding citations | As a judge, I want to test the AI myself | Must | First words < 3 s; every factual sentence cites ≥ 1 finding; "not in our data" when it isn't; 6 suggested questions; graceful fallback when `LIVE_SI=off` or on error | ⏳ |
| F8 | **Mission lens** | Pick ISS / Moon / Mars transit / Mars surface: shows its gravity, typical atmosphere, the insights that apply, and the gaps (untested conditions) | As Maya, I want to see what changes for Mars | Must | 4 lenses; each lists conditions with sources, filtered insights, and an "evidence gaps" panel | ⏳ |
| F9 | **Sources and method page** | Every NASA source we used; how the SI works; how ranking works; AI disclosure | As a judge, I want to judge validity | Must | Lists all sources from the data; explains the 3 SI layers and the rubric in plain words | ⏳ |
| F10 | **Demo fallback** | App works with no API key: pre-built insights + cached answers to the suggested questions | As the presenter, I want zero risk on stage | Must | With `LIVE_SI=off` every page works and suggested questions show cached answers labelled "pre-generated" | ⏳ |
| F11 | **Deployed** | Live on Vercel with a clean URL | As a judge, I want to open it myself | Must | Production URL in README and submission; preview per PR | ⏳ |
| F12 | **Microgravity vs 1 g comparison chart** | Same measure (e.g. flame spread rate or extinction O₂) at 0 g vs 1 g where findings have both | As Sam, I want to see how fire differs | Should | Only plots values from cited findings; source line under chart | ⏳ |
| F13 | **Flammability map** | Scatter: O₂ % vs airflow (or pressure), point = finding, shape = burned/extinguished, colour = gravity | As Maya, I want to see where materials stop burning | Should | Hover shows the finding; legend in words; no interpolation we can't cite | ⏳ |
| F14 | **"How fire is different in space" explainer** | Short visual explainer: buoyancy, the flame sphere, cool flames, ventilation | As Sam, I want the physics in 60 seconds | Should | 4–5 panels, each sourced; works on phone | ⏳ |
| F15 | **Compare two experiments** | Side-by-side conditions, findings and an SI-written comparison | As Maya, I want BASS vs Saffire | Could | Comparison cites both sides | ⏳ |
| F16 | **Evidence-gap view** | Which mission conditions (gravity × O₂ × pressure) have no data | As a planner, I want to know what NASA should test next | Could | Grid with counts per cell; links to findings | ⏳ |
| F17 | **Export one-pager** | Print/PDF of an insight with its citations | As Maya, I want to take it to a review | Could | Browser print stylesheet | ⏳ |
| — | User accounts, saved items | | | Won't | No logins in 2 days | ✂️ |
| — | Database | | | Won't | JSON in the repo is enough (`docs/decisions.md`) | ✂️ |
| — | Training our own ML model or a physics simulator | | | Won't | Not credible in 2 days; validity matters more | ✂️ |
| — | Light theme, other languages, native mobile app | | | Won't | Scope | ✂️ |
| — | Live ISS telemetry | | | Won't | No public fire telemetry; scope | ✂️ |

## User flows

### Flow 1: The 3-minute judge demo (the flow everything serves)
1. Overview: hero line + flame sphere; KPIs ("14 experiments · 52 findings · 81 % verified · 12 insights").
2. "Top fire risks for exploration": the #1 insight card, risk badge, missions, citation chips.
3. Click the insight: answer → explanation → recommendation → caveats → 3 cited findings; open one: conditions, numbers, NASA source link.
4. Mission lens → Mars surface: gravity 0.38 g, atmosphere, which insights apply, evidence gaps ("no flame-spread data at 0.38 g").
5. Ask: "Is a fire in a Mars habitat worse than on the ISS?" → streamed cited answer.
   - API slow or down → suggested question shows its cached answer, labelled pre-generated.
6. Sources & method: "Every claim traces to NASA. Here's how the AI ranks."

### Flow 2: Adding a paper to the corpus (team flow)
1. `npm run data:ntrs -- "<topic>"` → pick a relevant paper from `data/raw/ntrs/`.
2. Download the PDF to `data/raw/` → `npm run si:extract -- <experimentId> paper.pdf "<title>" <url> <year>`.
3. Open `data/raw/proposed/<paper>.json` next to the PDF; check every finding against its quote and page; fix, delete or keep.
4. Copy checked findings into `data/findings.json` with `verified: true` (drop `_quote`) → `npm run data:validate`.
   - Validation error → fix the record; never weaken the schema to pass.
5. When a batch is in: `npm run si:build` → review the insights (`docs/ai.md` › Review) → PR.

### Flow 3: Asking the advisor
1. Open Ask (button in the top bar, any page) → see 6 suggested questions.
2. Type a question (max 500 characters) → answer streams; citation chips appear inline.
3. Click a chip → the finding opens in a side panel, the answer stays.
   - Question outside the corpus → "Our NASA data doesn't cover that" + the closest findings.
   - Rate limit reached → plain message, try again in a minute.

## Non-functional requirements

### Performance
- Overview interactive < 2 s on broadband; pages are static (pre-rendered from JSON).
- Advisor: first token < 3 s (prompt caching on the corpus), full answer < 20 s.

### Reliability (demo safety)
- Every page works without an API key. The advisor falls back to cached answers.
- Feature freeze before the demo (`docs/plans/2026-11-hackathon.md`); after it, only fixes.

### Validity and honesty
- Every AI sentence that states a fact cites a finding; every finding cites a NASA source with a locator.
- Unverified content is labelled in words. Partial-gravity extrapolations are marked as such.
- AI use disclosed on the method page and the submission.

### Security (see `docs/security.md`)
- API key server-only, spend limit set in the Anthropic Console, `/api/ask` rate-limited and input-capped.
- No personal data collected. Security headers on all pages.

### Compatibility
- Desktop Chrome, Safari, Firefox, Edge (current); iOS Safari and Android Chrome; 360 px to 2560 px.

### Accessibility
- WCAG 2.1 AA contrast; focus ring on everything; risk, status and series never colour-only; charts have a text takeaway and source; `prefers-reduced-motion` respected.

### Localization
- English only. Units with a thin space; O₂ subscript; gravity in g; pressure in kPa; dates as "2016".

## Technical specifications

See `docs/architecture.md` and `docs/ai.md`. In short: Next.js 16 (App Router, React 19, TypeScript, Tailwind 4) on Vercel; JSON corpus in the repo validated with Zod; Claude API (`claude-opus-5-5`) for extraction, ranking and the live advisor; Recharts for charts; Vitest; GitHub Actions CI.

## Analytics and monitoring

None beyond Vercel's default logs: a 2-day demo for a few judges. The SI scripts print token use and cost per run; check the Anthropic Console usage page once per session.

## Release planning

| When | What |
|---|---|
| Day 0 (prep) | Foundation PR: docs, design system, schema, scripts, CI, seed experiments ✅ when merged |
| Day 1 | Corpus (F1–F2), insights (F3, F5), overview (F4), findings explorer (F6), deploy (F11) |
| Day 2 morning | Advisor (F7), mission lens (F8), fallback (F10), sources page (F9), charts (F12/F13) if on time |
| Day 2 freeze | Feature freeze → polish → video, slides, project page → submit with ≥ 2 h buffer |
| After | Should/Could features, public repo, write-up |

## Glossary

See `docs/science.md` › Glossary for the science words. Product words:
- **Experiment:** a NASA (or partner) experiment, facility or programme, e.g. BASS, Saffire, a drop tower.
- **Finding:** one claim from one source, with conditions and evidence (`F-001`).
- **Insight:** an SI-written, ranked conclusion linking several findings to a mission risk (`I-01`).
- **Mission lens:** the view of insights and gaps for one mission context.
- **Verified:** a teammate checked the finding against the source at the given page.
- **SI:** our name for the AI layer (Claude), as the brief calls it.

## Assumptions and open questions

| Question | Decides | Status |
|---|---|---|
| What exactly does the challenge page list as data and resources? | Team, Day 1 morning | Open (`docs/challenge.md`) |
| Can we get ≥ 40 verified findings in Day 1? If not, cut to 25 and say so. | Team at the Day 1 evening check | Open |
| Product name: keep "Flame in Freefall" or name the tool? | Team | Open |
| Public repo at submission? | Team | Open |

## AI conversation insights

- Whole-corpus prompting beats RAG at this size (≈ 100 findings fit easily in context; no vector DB to build or break). Accepted.
- Pre-generating insights at build time makes the demo fast and safe; live AI is reserved for the advisor. Accepted.
- Human verification gate on Claude-extracted findings: protects "Validity". Accepted.
- Training a custom model / building a flame simulator: rejected for scope and credibility.
