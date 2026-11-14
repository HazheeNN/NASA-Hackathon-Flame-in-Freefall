# Product Requirements Document: Flame in Freefall

Status legend: ✅ shipped · 🔧 in progress · ⏳ planned · ✂️ cut. Update the status in the same PR that ships the feature.

## Product overview

**Vision:** An AI analyst that has read NASA's fire-in-space research, so anyone planning a crewed mission can see what matters most for fire safety, why, and how sure we are, in seconds, with a source on every claim.

**Target users:** hackathon judges first (they decide); mission fire-safety engineers and crew trainers as the story; students and the public as a bonus.

**Objectives:**
1. Win the challenge: answer every word of the brief (`docs/challenge.md`) visibly within the first minute of the demo.
2. Be trustworthy: every number and AI sentence traces to a NASA source.
3. Never fail on stage: the app makes no AI or network calls at runtime; everything shown was prepared and reviewed.

**Success metrics (by submission):**
- ≥ 40 findings from ≥ 8 experiments, ≥ 75 % of them verified by a person.
- 8–15 ranked insights, each citing ≥ 2 findings, with 0 citations to missing findings (CI checks this).
- 20–30 prepared answers in the Ask library; the 10 golden questions (`docs/ai.md`) answered with correct citations, 9 of 10 or better.
- The 3-minute demo runs 3 times in a row without a hitch, once with the laptop offline (local build).
- Lighthouse accessibility ≥ 95 on the overview; usable at 360 px.

## Personas

### 1. The judge (primary)
- **Who:** scientist, engineer or industry volunteer; scoring many projects; 3–5 minutes on ours; laptop or projector.
- **Goals:** understand the idea in 10 seconds; see real NASA data; see the AI do something non-trivial; judge validity.
- **Pain points:** generic chatbots with a space skin; claims with no source; demos that break.
- **Journey:** lands on the overview → reads the hero and the top 3 insights → opens one, sees cited findings and a NASA source → searches Ask for a question and opens its cited answer → sees Mars in Same Fire, Four Worlds and its empty spot on the gaps map → watches the video / reads the project page.

### 2. Maya, mission fire-safety engineer (story persona)
- **Who:** works on habitat and vehicle design for Artemis and Mars; expert reader; desktop.
- **Goals:** "Which findings change my material choices, ventilation design and detector placement for a 0.38 g habitat at 34 % O₂?"
- **Pain points:** results scattered over decades of reports (NTRS, PSI, journals); partial gravity barely tested; hard to compare conditions.
- **Journey:** sets up a Mars habitat at 34 % O₂ in the Habitat Designer → sees the nearest tested findings, the insights that apply and what was never tested → filters findings by oxygen and gravity → opens the Ask answer comparing Saffire with BASS → copies the cited answer into a design review.

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
| F2 | **SI job 1: extraction** | Claude (in a Claude Code session) proposes findings from a NASA paper per `prompts/extract.md`; a person verifies | As a teammate, I want to turn a 30-page paper into findings in minutes | Must | Schema-valid proposals in `data/raw/proposed/` with page locators and exact quotes; nothing reaches `findings.json` unverified-and-unlabelled | 🔧 prompt + workflow ready |
| F3 | **SI job 2: synthesis and ranking** | Claude links findings across experiments into ranked insights with 4 scores (`prompts/synthesize.md`) | As Maya, I want the most important fire risks first, and to know why they rank there | Must | 8–15 insights, each citing ≥ 2 findings, scores shown, `data:validate` passes with no stale warning, `generatedAt`/model/`findingsHash` recorded | 🔧 prompt ready |
| F4 | **Overview dashboard** | Hero, KPIs, top 3 insights, one hero chart, entry points | As a judge, I want the idea and the value in 10 seconds | Must | Above the fold at 1440 px: one-line pitch, KPIs, top insight; works at 360 px | ✂️ replaced by the Flame Lab homepage (2026-11-14) |
| F5 | **Ranked insights page + detail** | All insights by rank with risk badge, missions, scores; detail with answer → explanation → recommendation → caveats → cited findings | As Maya, I want to drill from an insight to the evidence | Must | Every citation chip opens its finding; risk is word + colour + icon; filter by mission and theme; the confidence meter (F20) on every insight | 🔧 list (mission and risk filters) + detail with confidence meter; on sample data until the first SI run |
| F6 | **Findings explorer** | Search and filter findings by experiment, theme, gravity, O₂, platform, verified | As Maya, I want to find all results at high oxygen | Must | Filters combine; result count shown; URL keeps the filters (shareable); empty state explains | 🔧 explorer + FLEX dataset table; empty until findings are verified |
| F7 | **Ask: the question library** | 20–30 questions mission planners and judges ask, with SI-prepared, reviewed, cited answers (`prompts/answer.md`, `data/generated/answers.json`); a search box that matches questions and findings as you type | As a judge, I want to test the AI's knowledge myself | Must | Search finds a relevant question or finding for each golden question's wording; every factual sentence carries citation chips; 2–3 honest "our data doesn't cover that" answers; labelled "Prepared by our SI from N cited findings" | 🔧 search page + Ctrl/⌘ K dialog over answers and sources; answers come with the SI run |
| F8 | **Same Fire, Four Worlds** (replaces the mission lens) | Earth, ISS, Moon and Mars side by side: each world's gravity and cabin atmosphere (sourced), how fire differs there (from findings), real NASA flame images where they exist, the insights that apply, and what was never tested. No simulator: only what sources state | As a judge, I want to see in 10 seconds why fire is different on each world; as Maya, I want what changes for Mars | Must | 4 worlds; every number and sentence cites a finding or source; images credited; worlds with no data say so ("never tested at 0.38 g"); clicking a world opens its spot on the gaps map (F16); works at 360 px (worlds stack) | ✅ in the Flame Lab: 4 world cards with real NASA photos, hover glow, background switch |
| F9 | **Sources and method page** | Every NASA source we used; how the SI works; how ranking works; AI disclosure | As a judge, I want to judge validity | Must | Lists all sources from the data; explains the 3 SI layers and the rubric in plain words | ✅ /sources (method, rubric, formulas, datasets, cabin air, experiments, images) and /about |
| F10 | **Offline-safe demo** | Nothing at runtime depends on an AI or external API | As the presenter, I want zero risk on stage | Must | A local production build works with Wi-Fi off; the deployed site works on a phone | ✅ by design (keep it that way) |
| F11 | **Deployed** | Live on Vercel with a clean URL | As a judge, I want to open it myself | Must | Production URL in README and submission; preview per PR | ⏳ |
| F12 | ~~Microgravity vs 1 g comparison chart~~ | Folded into Four Worlds (F8) as a small comparison where findings have both values | | ✂️ | | ✂️ merged into F8 |
| F13 | ~~Flammability map~~ | Folded into the gaps map (F16): the tested points are the findings | | ✂️ | | ✂️ merged into F16 |
| F14 | ~~"How fire is different in space" explainer~~ | Folded into Four Worlds (F8); a longer scroll story is F21 (on hold) | | ✂️ | | ✂️ merged into F8 |
| F15 | ~~Compare two experiments~~ | | | Won't | Cut 2026-11-14 to make room | ✂️ |
| F16 | **Where NASA has never burned: the gaps map** | A map of the condition space (gravity × O₂, with pressure and airflow as filters): each finding is a point (burned / went out), each world and habitat atmosphere is a marked spot, empty regions are highlighted as untested | As a planner, I want to know what NASA should test next; as a judge, I want honesty about how thin the data is | **Must** | Points only from findings with those conditions; hover/tap shows the finding; legend in words; no interpolation; the four worlds and the 8.2 psia / 34 % O₂ habitat marked; a count of findings per region; works with keyboard and at 360 px (list fallback) | ✅ /gaps: 276 FLEX tests, untested regions in red, cabin-air markers, gravity tabs |
| F17 | **Export one-pager** | Print/PDF of an insight with its citations | As Maya, I want to take it to a review | Won't | Cut 2026-11-14 to make room | ✂️ |
| F18 | **What NASA should test next** | Next to the gaps map: a short ranked list of proposed experiments, written by the SI (job 2), each citing the empty region and the closest findings | As NASA, I want to know which test would close the biggest safety gap | Must | 3–6 proposals; each cites ≥ 1 finding and names the untested conditions; ranked with the same rubric; labelled "prepared by our SI, reviewed by the team" | 🔧 computed list of untested habitat atmospheres; SI-written proposals pending |
| F19 | **Habitat Designer** | Pick a world, a cabin atmosphere (sourced presets: ISS 101.3 kPa / 21 % O₂, exploration 56.5 kPa / 34 % O₂, Shuttle staged 70.3 kPa / 26.5 % O₂; or custom), a material and a ventilation level; see which findings were tested nearest those conditions, which insights apply, and what was never tested. Not a risk calculator | As Maya, I want to see the evidence for my habitat's conditions and the trade-off (more O₂ for breathing vs more fire risk) | Must | Presets cite NASA sources (`docs/data.md` › Sources for Four Worlds…); results are findings filtered by condition distance, never a computed risk score; empty results say "never tested" and point to the gaps map; the setup is kept in the URL (shareable) | ✅ merged into the Flame Lab controls (cabin-air presets, O₂, pressure, airflow, fuel) |
| F20 | **Confidence meter ("How sure are we?")** | A designed meter on every insight and answer: number of findings, how many experiments, how many verified, evidence strength, whether it's tested at the mission's gravity or extrapolated | As a judge, I want to see how sure the AI is and why | Must | Computed from the data (no hand-set values); shown in words + shape, not colour alone; explains itself on hover/tap | ✅ on every insight card and detail, computed from cited findings |
| F22 | **NASA formulas (explain + compute in range)** | Each feature shows the NASA equations behind it, with source, variables and validity range; the Habitat Designer and Four Worlds compute values with them only when every input is inside the tested range | As a judge, I want to see the physics is NASA's, and that the tool knows its limits | Must | Every formula cites a NASA page and lists its range; computed values labelled "calculated from a NASA formula"; outside the range shows "outside tested conditions" and no number; one test per formula reproduces a worked example from its source; 3–4 verified formulas minimum (`docs/data.md` › Formulas) | 🔧 FX-01 pO₂ and FX-02 d² law in the lab and on /sources (unverified) |
| F21 | **Life of a Flame** scroll story | A match on Earth to a flame on Mars, with findings as checkpoints | As Sam, I want the physics as a story | On hold | Decided 2026-11-14: build only if everything Must is done | ⏸ |
| — | User accounts, saved items | | | Won't | No logins in 2 days | ✂️ |
| — | Database | | | Won't | JSON in the repo is enough (`docs/decisions.md`) | ✂️ |
| — | Training our own ML model or a physics simulator | | | Won't | Not credible in 2 days; validity matters more | ✂️ |
| — | Light theme, other languages, native mobile app | | | Won't | Scope | ✂️ |
| — | Live ISS telemetry | | | Won't | No public fire telemetry; scope | ✂️ |

## The Flame Lab homepage (decision 2026-11-14)

Home is where judges do most things: set the cabin air (presets or your own O₂, pressure, airflow) and the fuel, watch a WebGL flame change (an illustration), pick one of four worlds (Earth, ISS, Moon, Mars: real NASA photo cards with a soft glow in the world's colour; clicking one switches the page background), read "What NASA has measured" (tested in blue, never tested in red, nearest FLEX tests, NASA formulas in range), and see the top insights for that world. "Fire only" hides everything but the flame and the background. Four Worlds (F8) and the Habitat Designer (F19) live here.

## One condition space (design principle, 2026-11-14)

Four Worlds (F8), the gaps map (F16), the test-next list (F18) and the Habitat Designer (F19) all place things on the same four measures: **gravity, O₂ %, pressure, airflow** (`Conditions` in `src/lib/schema.ts`, already on every finding). One data shape, one set of filters, one visual language; a world or a habitat setup is just a point in that space, so every feature links to the others (click Mars in Four Worlds → its spot on the gaps map; a habitat setup → where it sits on the map).

## User flows

### Flow 1: The 3-minute judge demo (the flow everything serves)
1. Overview: hero line + flame sphere; KPIs ("14 experiments · 52 findings · 81 % verified · 12 insights").
2. "Top fire risks for exploration": the #1 insight card, risk badge, missions, citation chips.
3. Click the insight: answer → explanation → recommendation → caveats → 3 cited findings; open one: conditions, numbers, NASA source link.
4. Same Fire, Four Worlds → Mars: 0.38 g, the 8.2 psia / 34 % O₂ habitat air, how fire differs, "never tested at 0.38 g".
5. Gaps map: Mars sits in an empty region; "What NASA should test next" lists the proposal that would fill it.
6. Habitat Designer: Mars + 34 % O₂ + cabin fabric → the nearest tested findings, the insights that apply, the confidence meter.
7. Ask: type "mars habitat fire" → the search shows "Is a fire in a Mars habitat worse than on the ISS?" → open it → cited answer; click a chip → the finding.
8. Sources & method: "Every claim traces to NASA. Here's how the AI ranks."

### Flow 2: Adding a paper to the corpus (team flow)
1. `npm run data:ntrs -- "<topic>"` → pick a relevant paper from `data/raw/ntrs/`.
2. Download the PDF to `data/raw/` → in a Claude Code session, run SI job 1 on its abstract + results pages (`si-run` skill) → `data/raw/proposed/<paper>.json`.
3. Open `data/raw/proposed/<paper>.json` next to the PDF; check every finding against its quote and page; fix, delete or keep.
4. Copy checked findings into `data/findings.json` with `verified: true` (drop `_quote`) → `npm run data:validate`.
   - Validation error → fix the record; never weaken the schema to pass.
5. At a checkpoint: run SI jobs 2 and 3 (`si-run` skill) → review (`docs/ai.md` › Review) → PR.

### Flow 3: Asking
1. Open Ask (button in the top bar, any page) → questions grouped by mission and theme, 6 featured at the top.
2. Type words → matching questions and findings filter as you type.
3. Open a question → the prepared answer with citation chips, its missions and themes.
4. Click a chip → the finding opens in a side panel, the answer stays.
   - Nothing matches → "No prepared answer for that yet" + the closest findings by keyword.
   - The page says plainly that answers were prepared by our SI and reviewed by the team, with the date.

## Non-functional requirements

### Performance
- Overview interactive < 2 s on broadband; pages are static (pre-rendered from JSON).
- Ask search: results update within 100 ms as you type (client-side, a few hundred records).

### Reliability (demo safety)
- No AI or external API calls at runtime: every page is static or client-side.
- Feature freeze before the demo (`docs/plans/2026-11-hackathon.md`); after it, only fixes.

### Validity and honesty
- Every AI sentence that states a fact cites a finding; every finding cites a NASA source with a locator.
- Unverified content is labelled in words. Partial-gravity extrapolations are marked as such.
- AI use disclosed on the method page and the submission.

### Security (see `docs/security.md`)
- No secrets in the app at all (no API key in mode A).
- No personal data collected. Security headers on all pages.

### Compatibility
- Desktop Chrome, Safari, Firefox, Edge (current); iOS Safari and Android Chrome; 360 px to 2560 px.

### Accessibility
- WCAG 2.1 AA contrast; focus ring on everything; risk, status and series never colour-only; charts have a text takeaway and source; `prefers-reduced-motion` respected.

### Localization
- English only. Units with a thin space; O₂ subscript; gravity in g; pressure in kPa; dates as "2016".

## Technical specifications

See `docs/architecture.md` and `docs/ai.md`. In short: Next.js 16 (App Router, React 19, TypeScript, Tailwind 4) on Vercel; JSON corpus in the repo validated with Zod; Claude (Claude Code on our Pro plan, Opus 5.5) runs the SI jobs offline; API mode optional later; Recharts for charts; Vitest; GitHub Actions CI.

## Analytics and monitoring

None beyond Vercel's default logs: a 2-day demo for a few judges. SI runs use Pro usage: watch the limit (`docs/claude-workflow.md`).

## Release planning

| When | What |
|---|---|
| Day 0 (prep) | Foundation PR: docs, design system, schema, scripts, CI, seed experiments ✅ when merged |
| Day 1 | Corpus (F1–F2), insights (F3, F5), overview (F4), findings explorer (F6), deploy (F11) |
| Day 1 evening | Gaps map (F16) on the first findings; confidence meter (F20) |
| Day 2 morning | Ask library (F7), Four Worlds (F8), Habitat Designer (F19), test-next list (F18), sources page (F9) |
| Day 2 freeze | Feature freeze → polish → video, slides, project page → submit with ≥ 2 h buffer |
| After | Should/Could features, public repo, write-up |

## Glossary

See `docs/science.md` › Glossary for the science words. Product words:
- **Experiment:** a NASA (or partner) experiment, facility or programme, e.g. BASS, Saffire, a drop tower.
- **Finding:** one claim from one source, with conditions and evidence (`F-001`).
- **Insight:** an SI-written, ranked conclusion linking several findings to a mission risk (`I-01`).
- **World:** one of Earth (1 g), ISS (≈ 0 g; also stands for Mars transit), Moon (≈ 0.16 g), Mars (0.38 g), each with its cabin atmosphere. Replaces "mission lens".
- **Condition space:** gravity, O₂ %, pressure and airflow, the four measures every finding, world, habitat and gap is placed on.
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
- Pre-generating insights and answers makes the demo fast and safe. Accepted; no API key for now, so no live AI at all (2026-11-13). Revisit if we get a key.
- Human verification gate on Claude-extracted findings: protects "Validity". Accepted.
- Training a custom model / building a flame simulator: rejected for scope and credibility.
