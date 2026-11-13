# The challenge

## Brief (verbatim, as given to the team)

> **Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data**
>
> **About the Challenge**
> For decades, NASA has studied how flames and fire behave in microgravity, gathering a trove of experimental data along the way. That knowledge matters more than ever as humans gear up to return to the Moon and press on to Mars, yet the volume of results makes them hard to find, compare, and understand. Your challenge is to create an interactive, super intelligence (SI) powered dashboard that summarizes, ranks, and interprets those findings to deliver fire safety insights for human space exploration.
>
> **About the Team:** Small Team working on Flame in Freefall.

⚠ The challenge page on spaceappschallenge.org usually also lists **Objectives, Potential Considerations, NASA Data & Resources, Space Agency Partner Resources and References**. We didn't have them when this file was written (the site was blocked from the cloud session). **First job on Day 1: paste those sections in below, verbatim, and check the plan against them.** The NASA data list there beats anything in `docs/data.md`.

<!-- Paste the rest of the challenge page here: Objectives, Potential Considerations, NASA Data & Resources (with links), Space Agency Partner Resources, References. -->

## What each word asks of us

| Words in the brief | What we must show | Where in the product |
|---|---|---|
| "decades… trove of experimental data" | Real NASA experiments across eras and platforms (drop towers → ISS → Saffire) | Corpus: `data/experiments.json`, `data/findings.json`; Sources page |
| "hard to find, compare, and understand" | Search, filter and side-by-side comparison; plain-language summaries | Findings explorer, compare view, glossary tooltips |
| "interactive" | People click, filter, ask; not a static report | Filters, mission lens, Ask the advisor, chart interactions |
| "super intelligence (SI) powered" | AI that does real analytic work: reads papers, links findings across experiments, ranks, explains, answers questions with citations | SI pipeline (`docs/ai.md`): extraction, synthesis/ranking, live advisor |
| "dashboard" | One glanceable overview, then drill-down | Overview page: KPIs, top insights, hero chart |
| "summarizes" | A short, plain summary per finding, experiment and insight | `statement`, `answer`, experiment `summary` |
| "ranks" | An explicit, explainable ordering of what matters most for safety | Ranked insights with 4 visible scores and "How we rank" |
| "interprets" | "So what for a crew?" in every insight: implication, recommendation, caveats | Insight cards and the advisor |
| "fire safety insights for human space exploration" | Tie everything to missions: ISS, Artemis (Moon, 0.17 g), Mars transit (0 g), Mars surface (0.38 g) | Mission lens |

**Our one-line pitch (draft):** *"An AI analyst that has read NASA's fire-in-space research, so a mission planner can ask what's dangerous on the way to Mars and get a ranked, cited answer in seconds."*

## How Space Apps is judged

⚠ Check the current rules page; this is what Space Apps has used in recent years and may have changed.

Global judging has usually scored projects on five criteria, roughly equally:

| Criterion | What it means for us |
|---|---|
| **Impact / Influence** | Could this help NASA mission planners or crew-safety engineers? Make the mission lens and recommendations concrete. |
| **Creativity** | The SI layer that ranks and links findings across experiments, the microgravity-vs-1 g framing, the flame-sphere identity. |
| **Validity** | Scientifically sound and honest: sources on every claim, verified badges, caveats, no invented physics. |
| **Relevance** | Directly answers the brief: summarizes, ranks, interprets, interactive, fire safety, exploration. |
| **Presentation** | The demo video/slides and the project page: clear story in the first 10 seconds, polished UI. |

Submissions have usually needed: a project page (title, summary, details, how NASA data was used, tools and AI used), a **demo** (a short video, recently up to 30 seconds, or a small slide deck, recently up to 7 slides), and a link to the project (repo and/or live site). Exact limits and deadline: ⚠ verify on the event site and put them in `docs/submission.md`.

## Rules to check on Day 1

- [ ] Submission deadline (time zone!) and the exact demo format and length.
- [ ] Use of NASA data is required: list every NASA source we used on the project page.
- [ ] AI tools: Space Apps asks teams to disclose AI use. We disclose Claude (Anthropic) for code assistance and as the app's analysis engine.
- [ ] NASA logo and branding may not be used. We don't (`DESIGN.md`).
- [ ] Team registration: all 3 of us on the team page.
- [ ] Whether the repo must be public at submission (decide in `docs/decisions.md`).
- [ ] Local event rules (venue hours, mentors, local judging round).

## Open questions

- Which datasets does the challenge page list? If it links specific PSI datasets (raw ISS experiment data), we should show at least one real-data chart from them.
- Does the event provide API credits (sponsors sometimes do)?
