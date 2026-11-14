# Data

The corpus is the product. The SI is only as good as the findings it reads, and the judges score validity. Quality over quantity: 40 verified findings beat 200 unchecked ones.

## Sources

| Source | What it has | Access | How we use it |
|---|---|---|---|
| **NASA Technical Reports Server (NTRS)**, ntrs.nasa.gov | Papers, conference papers, technical memos for every experiment we cover | Public; JSON search API at `https://ntrs.nasa.gov/api/citations/search?q=…`; citation pages at `https://ntrs.nasa.gov/citations/<id>` | Main source of findings. `npm run data:ntrs` searches it |
| **NASA Physical Sciences Informatics (PSI)**, psi.nasa.gov | Raw data and documentation from ISS physical-science experiments, including combustion (FLEX, ACME, BASS, …) | Free account needed (register on Day 0) | Real measurements for Four Worlds and the gaps map (F8, F16); cite the dataset |
| **The challenge page's "NASA Data & Resources"** | Whatever the organisers list | Public | First priority on Day 1 (`docs/challenge.md`). Use every listed resource at least once if it fits |
| **NASA Space Station Research Explorer** and NASA Glenn combustion pages | Plain-language experiment summaries, dates, facilities | Public | Experiment summaries, dates and facility facts |
| **Partner agencies** (JAXA, ESA, CSA, …) | e.g. JAXA FLARE results | Public | Only if listed in the challenge or clearly relevant |
| **Peer-reviewed journals** (Combustion and Flame, Proceedings of the Combustion Institute, Microgravity Science and Technology, …) | The detailed versions of many results | Often paywalled | Cite them when that's where the finding is; use the NTRS copy when one exists |

**Licensing:** NASA-authored works are generally not under copyright in the US, but journal versions may be. We store only short quotes, numbers and links, never whole papers, in the repo. Raw downloads live in `data/raw/` (git-ignored).

⚠ The NTRS and PSI hosts were blocked from the cloud session that wrote this. The scripts are written to the documented API but untested: check `scripts/fetch-ntrs.mts` against one real response on your laptop first.

## Sources for Four Worlds, the gaps map and the Habitat Designer (to collect)

Decided 2026-11-14 (`docs/decisions.md`). These features need **world and atmosphere facts** (gravity, cabin pressure and O₂) and **findings at the conditions habitats will use** (partial gravity, low pressure, high O₂). Every value below still goes through the normal workflow: a finding or experiment record with a source and locator, verified by a teammate. Found by web search on 2026-11-14 from a session where the NASA hosts were blocked: **open each link on a laptop and check the page/number before using it.**

### 1. The four worlds: gravity and cabin atmosphere

| What we need | Value to check | Where to get it |
|---|---|---|
| Gravity of each world | Earth 1 g, ISS ≈ 0 g (microgravity), Moon ≈ 0.16–0.17 g, Mars ≈ 0.38 g | The partial-gravity flammability report at [ntrs.nasa.gov/citations/20010074098](https://ntrs.nasa.gov/citations/20010074098) states 0.38 g Mars and 0.16 g Moon; NASA planetary fact sheets for exact values |
| ISS cabin air | ≈ 101.3 kPa (14.7 psia), ≈ 21 % O₂ (sea-level-like) | NASA ECLSS papers, e.g. ICES 2024 at [ntrs.nasa.gov/api/citations/20240005117/…](https://ntrs.nasa.gov/api/citations/20240005117/downloads/ICES-2024-128-Final%20Manuscript-No%20Tracked%20Changes.pdf) |
| Exploration atmosphere (Moon/Mars habitats, landers) | 56.5 kPa (8.2 psia), 34 % O₂; earlier 8.0 psia / 32 % | Norcross et al., evidence report [ntrs.nasa.gov/citations/20150021491](https://ntrs.nasa.gov/citations/20150021491); [ntrs.nasa.gov/citations/20130013505](https://ntrs.nasa.gov/citations/20130013505); exploration-atmosphere slides [ntrs.nasa.gov/citations/20220015741](https://ntrs.nasa.gov/citations/20220015741), [20220005716](https://ntrs.nasa.gov/api/citations/20220005716/downloads/AsMA%202022%20-%20Garbino%20-%20Exploration%20Atmospheres%20v2.pdf) |
| Shuttle staged-decompression atmosphere (comparison point) | 70.3 kPa (10.2 psia), 26.5 % O₂ | Same 2013 paper (20130013505) |
| Why the trade-off exists | Lower pressure needs more O₂ to breathe; more O₂ raises fire risk; 34 % trades decompression-sickness risk against fire risk | IAF 2014 paper [iafastro.directory … IAC-14/A1/P/22666](https://iafastro.directory/iac/archive/browse/IAC-14/A1/P/22666/); the 2015 evidence report |
| Gateway, Orion, Artemis lander exact atmospheres | Not found yet | Search NTRS for "Gateway cabin atmosphere", "HLS atmosphere"; only use what a NASA source states |

### 2. Fire behaviour at those conditions (findings for the gaps map and the designer)

| What we need | What the sources say (to verify) | Where |
|---|---|---|
| Partial gravity is not "in between" | Lunar gravity may be close to the most flammable condition: O₂ needed to burn reaches a minimum and flame spread peaks near lunar g | Ferkul, LPSC 2026 [20260001966](https://ntrs.nasa.gov/api/citations/20260001966/downloads/Ferkul-Lunar%20and%20Planetary%20Science%20Conf%202026%20v2.pdf), [20260000646](https://ntrs.nasa.gov/api/citations/20260000646/downloads/Ferkul-Lunar%20and%20Planetary%20Science%20Conference%202026.pdf); "Fire on the Moon" overview [ntrs.nasa.gov/citations/20210020516](https://ntrs.nasa.gov/citations/20210020516) |
| Lunar-gravity flight tests | First extended (> 25 s) burns in simulated lunar gravity; a follow-on for burns on the lunar surface planned to launch late 2026 | [ntrs.nasa.gov/citations/20250010653](https://ntrs.nasa.gov/citations/20250010653) |
| Older partial-gravity work | Gravity and O₂ as independent variables to simulate Moon and Mars; few materials truly fire resistant at ≥ 40 % O₂ | [ntrs.nasa.gov/citations/20010074098](https://ntrs.nasa.gov/citations/20010074098), [19990054085](https://ntrs.nasa.gov/citations/19990054085), [20040053567](https://ntrs.nasa.gov/citations/20040053567) |
| Burning at 8.2 psia / 34 % O₂ | One NASA abstract: 31.4 % O₂ is the calculated upper limit that would not raise burning rate at 8.2 psia | Find the abstract via [ntrs.nasa.gov/citations/20220015741](https://ntrs.nasa.gov/citations/20220015741) and related NTRS hits |
| Ventilation flow vs flame | Below ≈ 1–2 cm/s flow flames dim; extinction at ≈ 0.2–0.5 cm/s; at 5–20 cm/s (typical cabin ventilation) flames spread upstream; materials may burn more readily in 0 g with ventilation than in 1 g | [ntrs.nasa.gov/api/citations/20140011099/…](https://ntrs.nasa.gov/api/citations/20140011099/downloads/20140011099.pdf), [20040084156](https://ntrs.nasa.gov/api/citations/20040084156/downloads/20040084156.pdf), Saffire-IV model [20220002714](https://ntrs.nasa.gov/api/citations/20220002714/downloads/Model%20Development%20of%20Large-Scale%20Spacecraft%20Fires%20during%20the%20Saffire-IV%20Experiments.pdf) |
| Large fires (Saffire) | Flames reached steady lengths; thick-fuel growth did not match the Earth test (NASA-STD-6001 Test 1); a flame jumped a 4.5 cm gap; steady spread over large thin charring fabric is possible in low g | Saffire VI (ICES 2024) [ntrs.nasa.gov/citations/20240002981](https://ntrs.nasa.gov/citations/20240002981); slides [20240007488](https://ntrs.nasa.gov/api/citations/20240007488/downloads/Saffire%20ICES%202024%20Saffire%20presentation072124small.pdf); ICES 2021 [20210011521](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf); [20180005168](https://ntrs.nasa.gov/api/citations/20180005168/downloads/20180005168.pdf). Results are partly preliminary: say so |
| Materials | SIBAL fabric (75 % cotton, 25 % fibreglass), PMMA (1- and 2-sided), Nomex, Kydex 100 (the NASA-STD-6001 reference material) | Saffire papers above; Test 1 / MAPTIS paper [ntrs.nasa.gov/citations/20040084025](https://ntrs.nasa.gov/citations/20040084025) |
| How NASA rates materials on Earth | NASA-STD-6001 Test 1: upward flame spread, pass/fail, valid only at the atmosphere tested; current revision 6001B (2025) | [20040084025](https://ntrs.nasa.gov/api/citations/20040084025/downloads/20040084025.pdf); NESC brief [TB 26-03](https://ntrs.nasa.gov/api/citations/20260001542/downloads/TB_26-03Final.pdf); [20150020937](https://ntrs.nasa.gov/api/citations/20150020937/downloads/20150020937.pdf) |
| Mars-specific (0.38 g) flame data | **None found.** That is a gap, and we show it as one | Gaps map |

**MAPTIS** (NASA's materials flammability database) has no public web interface that we found, so we don't use it directly: we cite papers that summarise its data.

### 3. Raw data and images

| What | Where | Notes |
|---|---|---|
| PSI datasets (FLEX, BASS, SAME, …) | NASA PSI portal (free account; guide: [science.nasa.gov … psi-database-guide.pdf](https://science.nasa.gov/wp-content/uploads/2024/11/psi-database-guide.pdf)); mirror on the [AWS Open Data registry](https://registry.opendata.aws/nasa-psi) with no use restrictions | ACME data was marked "authorized users only": check before planning on it. Help: msfc-psi-help@mail.nasa.gov |
| Overview book | NASA "Combustion in reduced gravity" ISS mini-book: [nasa.gov … np-2015-10-034 …pdf](https://www.nasa.gov/sites/default/files/atoms/files/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf) | Good plain-language source for Four Worlds and the science primer |
| Real flame images for Four Worlds | FLEX droplet and cool-flame images: [NASA ISS blog, 2013](https://blogs.nasa.gov/ISS_Science_Blog/2013/11/25/cool-flames-on-the-international-space-station-an-anatomy-of-discovery/); NASA SVS "Great Balls of Fire" [svs.gsfc.nasa.gov/11318](https://svs.gsfc.nasa.gov/11318); images.nasa.gov (search "FLEX", "cool flame", "Saffire") | Credit each image ("Image: NASA") with its page link; never the NASA logo or anything implying endorsement. Where no image exists (Moon, Mars), the card says "never filmed: no experiment yet" |

## Files

| File | Who writes it | Committed |
|---|---|---|
| `data/experiments.json` | People (seed list from the foundation PR, all `verified: false`) | Yes |
| `data/findings.json` | People, after verifying (Claude proposals copied in by hand) | Yes |
| `data/worlds.json` | People: Earth, ISS, Moon, Mars (gravity, missions, cabin atmospheres, optional credited NASA image) | Yes |
| `data/atmospheres.json` | People: cabin atmosphere presets (pressure, O₂, where used), each with a NASA source | Yes |
| `data/generated/insights.json` | SI job 2 only (`si-run` skill) | Yes (the app reads it; no AI at runtime) |
| `data/generated/answers.json` | SI job 3 only (`si-run` skill) | Yes |
| `data/raw/ntrs/*.json` | `npm run data:ntrs` | No |
| `data/raw/proposed/*.json` | SI job 1 (`si-run` skill) | No |
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

### Worlds and atmospheres (`data/worlds.json`, `data/atmospheres.json`)

Added 2026-11-14 for Same Fire, Four Worlds (F8), the gaps map (F16) and the Habitat Designer (F19). Both are points in the same condition space as findings (gravity, O₂, pressure).

- **Atmosphere:** `id` (kebab-case), `name`, `pressureKPa`, `oxygenPercent`, `usedFor` (plain words), `sources` (≥ 1), `verified`.
- **World:** `id` (`earth` · `iss` · `moon` · `mars`), `name`, `gravityG`, `missions` (the `Mission` values it stands for; ISS also stands for Mars transit), `atmosphereIds` (first = default; each must exist in `atmospheres.json`), optional `image` (`src`, `alt`, `credit`, `sourceUrl`: a real NASA flame image; none → the card says "never filmed"), `sources`, `verified`.
- **Not stored on a world:** "how fire differs here". That text comes from findings at the world's gravity, so every sentence keeps its finding citation.
- Same rules as findings: a verified record needs a source with a `locator`; seed values (written from web search, NASA hosts blocked) are all `verified: false` until a teammate checks them against the links in › Sources for Four Worlds….

## Workflow: from paper to finding

1. **Find papers.** `npm run data:ntrs -- "BASS flame spread" "Saffire flame growth"` → read titles and abstracts in `data/raw/ntrs/`. Pick papers with numbers and clear conclusions. Prefer results papers and final reports over proposals.
2. **Download** the PDF into `data/raw/`.
3. **Extract.** In a Claude Code session, run SI job 1 (`si-run` skill, `prompts/extract.md`) on the paper's abstract and results pages → `data/raw/proposed/<paper>.json`. One paper per session keeps Pro usage down. (With an API key: `npm run si:extract`.)
4. **Verify** (the step that makes us credible; see below).
5. **Add** the checked findings to `data/findings.json`: next free IDs, `verified: true`, remove `_quote`.
6. `npm run data:validate`, then commit in small batches (one paper or one experiment per commit).
7. Insights and answers get rebuilt at the planned checkpoints; `npm run data:validate` warns when they're stale (`docs/ai.md` › When to re-run).

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
