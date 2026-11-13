# Data

The corpus is the product. The SI is only as good as the findings it reads, and the judges score validity. Quality over quantity: 40 verified findings beat 200 unchecked ones.

## Sources

| Source | What it has | Access | How we use it |
|---|---|---|---|
| **NASA Technical Reports Server (NTRS)**, ntrs.nasa.gov | Papers, conference papers, technical memos for every experiment we cover | Public; JSON search API at `https://ntrs.nasa.gov/api/citations/search?q=…`; citation pages at `https://ntrs.nasa.gov/citations/<id>` | Main source of findings. `npm run data:ntrs` searches it |
| **NASA Physical Sciences Informatics (PSI)**, psi.nasa.gov | Raw data and documentation from ISS physical-science experiments, including combustion (FLEX, ACME, BASS, …) | Free account needed (register on Day 0) | Real measurements for charts (F12/F13); cite the dataset |
| **The challenge page's "NASA Data & Resources"** | Whatever the organisers list | Public | First priority on Day 1 (`docs/challenge.md`). Use every listed resource at least once if it fits |
| **NASA Space Station Research Explorer** and NASA Glenn combustion pages | Plain-language experiment summaries, dates, facilities | Public | Experiment summaries, dates and facility facts |
| **Partner agencies** (JAXA, ESA, CSA, …) | e.g. JAXA FLARE results | Public | Only if listed in the challenge or clearly relevant |
| **Peer-reviewed journals** (Combustion and Flame, Proceedings of the Combustion Institute, Microgravity Science and Technology, …) | The detailed versions of many results | Often paywalled | Cite them when that's where the finding is; use the NTRS copy when one exists |

**Licensing:** NASA-authored works are generally not under copyright in the US, but journal versions may be. We store only short quotes, numbers and links, never whole papers, in the repo. Raw downloads live in `data/raw/` (git-ignored).

⚠ The NTRS and PSI hosts were blocked from the cloud session that wrote this. The scripts are written to the documented API but untested: check `scripts/fetch-ntrs.mts` against one real response on your laptop first.

## Files

| File | Who writes it | Committed |
|---|---|---|
| `data/experiments.json` | People (seed list from the foundation PR, all `verified: false`) | Yes |
| `data/findings.json` | People, after verifying (Claude proposals copied in by hand) | Yes |
| `data/generated/insights.json` | `npm run si:build` only | Yes (so the demo needs no API) |
| `data/raw/ntrs/*.json` | `npm run data:ntrs` | No |
| `data/raw/proposed/*.json` | `npm run si:extract` | No |
| `data/raw/*.pdf` | You, downloading papers | No |

The shape of every record is in `src/lib/schema.ts` (Zod). The app parses the files at build time, so bad data fails the build, not the demo.

## Schema in plain words

**Experiment:** `id` (kebab-case, e.g. `bass`), `name`, `acronym`, `agency`, `platform` (ISS, Crewed spacecraft, Uncrewed spacecraft, Drop tower, Parabolic flight, Sounding rocket, Ground (1 g)), `facility`, `years` (free text), `fuels`, `summary` (2–3 plain sentences), `themes`, `sources`, `verified`.

**Finding:** one claim from one source.
- `id`: `F-001`, `F-002`, … never reused, never renumbered (insights cite them).
- `experimentId`: must exist in `experiments.json`.
- `title` (≤ 120 chars), `statement` (1–2 plain sentences: what was observed).
- `conditions`: `gravityG`, `oxygenPercent`, `pressureKPa`, `flowCmPerS`, `fuel`, `material`, only what the source states.
- `measurements`: `[{ quantity, value, unit }]`, numbers exactly as reported.
- `safetyImplication`: one sentence, "why a crew should care", worded as an implication.
- `themes`: from the fixed list (ignition, flame-spread, extinction, flammability-limits, cool-flames, soot-radiation, smoke-detection, suppression, materials, partial-gravity, spacecraft-atmosphere, incidents).
- `evidence.kind`: measured | modelled | review | incident-report. `evidence.strength`: 1 single test · 2 repeated or peer-reviewed · 3 repeated across experiments.
- `sources`: `[{ title, url, year, ntrsId, locator }]`; `locator` = page, section or figure.
- `extractedBy`: human | claude. `verified`: see below.

**Example (format only; not a real finding):**

```json
{
  "id": "F-001",
  "experimentId": "bass",
  "title": "Example: flame spread rate on thin fabric at low airflow",
  "statement": "Example statement of what the paper measured, in plain words.",
  "conditions": { "gravityG": 0, "oxygenPercent": 21, "pressureKPa": 101.3, "flowCmPerS": 10, "material": "cotton-fiberglass fabric" },
  "measurements": [{ "quantity": "flame spread rate", "value": 1.0, "unit": "mm/s" }],
  "safetyImplication": "Example implication for a crewed cabin.",
  "themes": ["flame-spread", "materials"],
  "evidence": { "kind": "measured", "strength": 2 },
  "sources": [{ "title": "Paper title", "url": "https://ntrs.nasa.gov/citations/00000000", "year": 2014, "locator": "p. 6, Fig. 4" }],
  "extractedBy": "claude",
  "verified": true
}
```

## Workflow: from paper to finding

1. **Find papers.** `npm run data:ntrs -- "BASS flame spread" "Saffire flame growth"` → read titles and abstracts in `data/raw/ntrs/`. Pick papers with numbers and clear conclusions. Prefer results papers and final reports over proposals.
2. **Download** the PDF into `data/raw/`.
3. **Extract.** `npm run si:extract -- bass data/raw/paper.pdf "Exact paper title" https://ntrs.nasa.gov/citations/<id> 2014` → `data/raw/proposed/paper.json`. It prints the cost (typically a few cents per paper).
4. **Verify** (the step that makes us credible; see below).
5. **Add** the checked findings to `data/findings.json`: next free IDs, `verified: true`, remove `_quote`.
6. `npm run data:validate`, then commit in small batches (one paper or one experiment per commit).
7. When a batch is in, rebuild insights (`docs/ai.md` › Pipeline).

You can also write findings by hand (`extractedBy: "human"`) from a summary page or a paper you've read.

## Verification

A finding may be `verified: true` only if a teammate:
1. opened the source at the `locator` and found the supporting text or figure;
2. checked every number, unit and condition against it;
3. checked the `statement` doesn't claim more than the source (no "always", no extrapolation);
4. checked `safetyImplication` reads as an implication, not a result.

The validator refuses a verified finding without a locator. If you can't verify something in 5 minutes, leave it `verified: false` (the UI labels it) or delete it.

## Targets and priorities

- **Day 1 target:** ≥ 40 findings across ≥ 8 experiments, ≥ 75 % verified. Minimum to ship: 25.
- **Coverage first:** a few findings from each experiment family (droplets, gases, solids, large-scale, detection) beat many from one.
- **Themes the insights need most:** flame spread and materials (Saffire, BASS, SoFIE), flammability limits vs oxygen and flow, extinction and suppression, cool flames and detection, partial gravity (even "no data" is useful).
- **Experiments:** also verify the 14 seed experiments (dates, facility, summary) and replace their NTRS search links with real citation links.

## Rules

- Never change an existing finding ID. To retire a finding, delete it and rebuild insights.
- Never invent numbers or conditions; leave a field out instead.
- One source per finding unless two sources state the same result (then `strength` may go up).
- Don't commit PDFs or large dumps.
