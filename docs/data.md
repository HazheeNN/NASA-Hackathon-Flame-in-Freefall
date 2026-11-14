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

**Leads, not sources:** videos, blogs and social posts found with Agent Reach (`web-research` skill) or search point you to papers; the finding always cites the NASA or agency source itself.

**Licensing:** NASA-authored works are generally not under copyright in the US, but journal versions may be. We store only short quotes, numbers and links, never whole papers, in the repo. Raw downloads live in `data/raw/` (git-ignored).

⚠ The NTRS and PSI hosts were blocked from the cloud session that wrote this. The scripts are written to the documented API but untested: check `scripts/fetch-ntrs.mts` against one real response on your laptop first.

## Data we can use now (checked 2026-11-14 against the NASA PDFs)

| Dataset | What it is | Where | Status |
|---|---|---|---|
| **FLEX Table IX** | 276 ISS droplet-combustion tests (FLEX-001…280; 156, 205, 213, 228 absent): fuel (methanol/heptane), pressure (mmHg), O₂/N₂/CO₂/He mole fractions, initial droplet diameter, extinction diameter, burning-rate constant (mm²/s), burn time, outcome (Extinction 186 · Disruption 62 · Completion 28) | Dietrich et al., *Detailed Results From the Flame Extinguishment Experiment (FLEX) March 2009 to December 2011*, NASA/TP—2015-216046, [ntrs.nasa.gov/citations/20150023456](https://ntrs.nasa.gov/citations/20150023456): column definitions p. 19, Table IX from p. 20 | **Real, measured, public.** **In the repo:** `data/datasets/flex-table-ix.json` (276 rows, each with its page; `npm run data:flex`). Our own parse of the PDF matches the CSV in [shaharia179/flame-in-freefall](https://github.com/shaharia179/flame-in-freefall) (`data/flex_table_ix.csv`) on all 276 rows. Gives the gaps map hundreds of real 0 g points (O₂, pressure, diluent, went out or not) |
| **BASS-II Summary Report** | Solid-fuel flame spread and blowoff on the ISS | NASA TM, [ntrs.nasa.gov/citations/20210011385](https://ntrs.nasa.gov/citations/20210011385) | To read for tables |
| **Exploration atmospheres** | 8.2 psia / 34 % O₂, 8.0 / 32 %, 10.2 / 26.5 %, 14.7 / 21 % | [ntrs.nasa.gov/citations/20130013505](https://ntrs.nasa.gov/citations/20130013505), PDF p. 11 | Values confirmed in the PDF; `data/atmospheres.json` now has the locator |
| **Moon and Mars gravity** | Moon 1.62 m/s², Mars 3.73 m/s² (mean) → 0.165 g, 0.380 g (÷ 9.80665) | NASA NSSDC [Moon](https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html) and [Mars](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html) fact sheets, "Surface gravity" row | Confirmed; `data/worlds.json` has the locator |
| **Partial-gravity flammability** | "Normal gravity may not be the most flammable condition"; Lunar-g tests with SIBAL fabric; limiting O₂ (LOC) at Lunar g | Ferkul, *Material Flammability at Lunar and Martian Gravity*, LPSC 2026, [20260001966](https://ntrs.nasa.gov/api/citations/20260001966/downloads/Ferkul-Lunar%20and%20Planetary%20Science%20Conf%202026%20v2.pdf) | Slides: cite numbers only where a slide states them |

### Other teams' repositories (checked 2026-11-14)

- **[shaharia179/flame-in-freefall](https://github.com/shaharia179/flame-in-freefall)**: useful as a **cross-check**. Its FLEX CSV is a faithful copy of NASA Table IX. It has no licence and is another team's entry, so we **don't copy its code or CSV**: we parse Table IX from the NASA PDF ourselves, cite NASA, and may thank them in the README. We do **not** use its ML models (a predictor is out of scope, `docs/decisions.md`).
- **[benzene09/…Fire-atlas](https://github.com/benzene09/Nasa-Space-App-Challenge-2k26---Fire-atlas)**: **not usable for data**. Its README and `src/utils/data.js` say every number is dummy/illustrative. Only leads: it names PSI datasets (FLEX PSI-69, FLEX-2 PSI-68, BASS PSI-26, CFI-G PSI-159, PSI-117, DAFT PSI-47); check each ID on the PSI site before citing.

### api.nasa.gov and other NASA APIs

- **api.nasa.gov** (free key) has APOD, DONKI space weather, asteroids, EPIC, Mars rover photos, TechPort and similar. **None has combustion data.** Useful only: **TechPort** (descriptions of NASA combustion projects) and the image library below.
- **NASA Image and Video Library**, `images-api.nasa.gov` (no key): real photos for Four Worlds, e.g. `sts050-232-011` "Candle Flames in Microgravity Experiment", Saffire images `GRC-2014-C-02323`. Credit "Image: NASA" with the page link.
- **NTRS API**, `ntrs.nasa.gov/api/citations/search?q=…` (no key): the main source of papers. Each record lists PDF and **full-text `.txt`** downloads, which makes extraction (SI job 1) easy.
- **PSI** (raw ISS experiment data): free account, browser only; or the AWS Open Data mirror.

### No Chinese data (team rule, 2026-11-14)

We use no data from Chinese agencies, missions, institutions or databases (e.g. CMSA, Tiangong or Shijian experiments, CAS institutes). NASA and partner-agency sources (ESA, JAXA, CSA) only. Papers from NASA or partner agencies are fine whoever the co-authors are. When adding a source, check the publishing agency and the experiment platform.

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
| Overview book | NASA "Combustion in reduced gravity" ISS mini-book: [nasa.gov … np-2015-10-034 …pdf](https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf) | Good plain-language source for Four Worlds and the science primer |
| Real flame images for Four Worlds | FLEX droplet and cool-flame images: [NASA ISS blog, 2013](https://blogs.nasa.gov/ISS_Science_Blog/2013/11/25/cool-flames-on-the-international-space-station-an-anatomy-of-discovery/); NASA SVS "Great Balls of Fire" [svs.gsfc.nasa.gov/11318](https://svs.gsfc.nasa.gov/11318); images.nasa.gov (search "FLEX", "cool flame", "Saffire") | Credit each image ("Image: NASA") with its page link; never the NASA logo or anything implying endorsement. Where no image exists (Moon, Mars), the card says "never filmed: no experiment yet" |

## Formulas (decision 2026-11-14, option C)

The site **explains** with NASA formulas everywhere and **computes** with them only inside each formula's tested range. A formula is evidence like a finding: no source, no formula.

### Rules

1. **Source:** a NASA (or partner agency) paper, report or standard, with the page or equation number. A textbook relation (e.g. partial pressure) still cites the NASA paper that uses it for spacecraft.
2. **Validity range:** the conditions it was derived or tested in (gravity, O₂ %, pressure, flow, material or fuel). If the source doesn't state a range, use the range of the data in that paper and say so.
3. **Compute only inside the range.** If any input is outside, show "outside tested conditions" and link the gaps map. Never extrapolate to Moon or Mars gravity because the formula "would work".
4. **Label every computed value** "calculated from a NASA formula" with the citation chip; findings (measured) and calculations look different in the UI.
5. **Don't invent:** no fitted curves of our own, no combining formulas into a risk score, no constants without a source.
6. **Verified** like findings: a teammate checks the equation, units and range against the page; `verified: false` until then, and the UI says so.

### Planned shape (`data/formulas.json`, schema to add when the first formula is verified)

- `id` (`FX-01`), `name`, `expression` (plain text, e.g. `pO2 = P × xO2`), `explanation` (one plain sentence: what it shows)
- `variables`: `symbol`, `meaning`, `unit` for each input and the output
- `validity`: min/max for each condition it was tested in (`gravityG`, `oxygenPercent`, `pressureKPa`, `flowCmPerS`), plus `material`/`fuel` if limited to one
- `usedIn`: `habitat`, `worlds`, `gaps`
- `sources` (≥ 1, with `locator`), `verified`
- The code that computes it lives in `src/lib/formulas.ts`, one small function per formula, with a test that reproduces one worked example from the source.

### Candidate formulas (to find in a NASA source and verify)

| Formula | What it shows | Feature | Where to look |
|---|---|---|---|
| Oxygen partial pressure, `pO2 = P × xO2` (8.2 psia × 0.34 ≈ 19.2 kPa vs ISS ≈ 21.3 kPa) | Why low-pressure habitats need a higher O₂ % to breathe, and the fire-risk trade-off | Habitat Designer | Exploration atmosphere papers ([20130013505](https://ntrs.nasa.gov/citations/20130013505), [20150021491](https://ntrs.nasa.gov/citations/20150021491)) |
| Buoyant velocity scaling, `u_b ~ (g · β · ΔT · L)^½` | Why flames are round at 0 g and how much "natural" flow Moon and Mars gravity give a flame | Four Worlds | Partial-gravity and mixed-convection papers ([20010074098](https://ntrs.nasa.gov/citations/20010074098), Fire on the Moon [20210020516](https://ntrs.nasa.gov/citations/20210020516)) |
| Droplet d² law, `d² = d₀² − K · t` | How a FLEX droplet burns down; burning-rate constant K | Four Worlds (ISS) | **Found:** FLEX TP 2015-216046 p. 19 defines the burning rate as "a linear fit of the droplet diameter squared versus time"; Table IX gives K for 260 tests (valid: 0 g, the tested pressures, O₂ and diluents) |
| Maximum O₂ concentration (MOC) from NASA-STD-6001 Test 1 | Above which O₂ % a material fails NASA's flame test | Habitat Designer, gaps map | [20040084025](https://ntrs.nasa.gov/citations/20040084025), NESC [TB 26-03](https://ntrs.nasa.gov/api/citations/20260001542/downloads/TB_26-03Final.pdf) |
| Flammability boundary: O₂ vs flow (and vs gravity) | Where flames survive or go out | Gaps map | Ventilation papers ([20140011099](https://ntrs.nasa.gov/api/citations/20140011099/downloads/20140011099.pdf)), Ferkul LPSC 2026 ([20260001966](https://ntrs.nasa.gov/api/citations/20260001966/downloads/Ferkul-Lunar%20and%20Planetary%20Science%20Conf%202026%20v2.pdf)) |
| Forced stretch rate `a = 3/2 · U / r` and flame standoff `δ = (α / a)^½` (blowoff of PMMA rods, 1 g vs 0 g flow) | Why airflow can blow a flame off, and how 1 g buoyant flow compares with forced flow in 0 g | Gaps map, Habitat Designer | Olson et al., [20160012691](https://ntrs.nasa.gov/citations/20160012691) p. 3 (valid: cast PMMA rods r 0.318–1.905 cm, the tested O₂) |
| Thin-fuel flame spread rate (de Ris-type relation) | How fast a flame runs over fabric or paper in a given flow | Habitat Designer | Saffire and BASS papers ([20240002981](https://ntrs.nasa.gov/citations/20240002981)) |

Start with the first one (simple, certain) and one fire formula; 3–4 verified formulas beat 10 unchecked ones.

## Files

| File | Who writes it | Committed |
|---|---|---|
| `data/experiments.json` | People (seed list from the foundation PR, all `verified: false`) | Yes |
| `data/findings.json` | People, after verifying (Claude proposals copied in by hand) | Yes |
| `data/worlds.json` | People: Earth, ISS, Moon, Mars (gravity, missions, cabin atmospheres, optional credited NASA image) | Yes |
| `data/datasets/flex-table-ix.json` | `npm run data:flex` (parses NASA/TP—2015-216046 Table IX from the NASA PDF; needs `pdftotext` from poppler) | Yes |
| `data/atmospheres.json` | People: cabin atmosphere presets (pressure, O₂, where used), each with a NASA source | Yes |
| `data/generated/insights.json` | SI job 2 only (`si-run` skill) | Yes (the app reads it; no AI at runtime) |
| `data/generated/answers.json` | SI job 3 only (`si-run` skill) | Yes |
| `data/raw/ntrs/*.json` | `npm run data:ntrs` | No |
| `data/raw/proposed/*.json` | SI job 1 (`si-run` skill) | No |
| `data/raw/*.pdf` | You, downloading papers | No |

The shape of every record is in `src/lib/schema.ts` (Zod). The app parses the files at build time, so bad data fails the build, not the demo.

## Schema in plain words

**Experiment:** `id` (kebab-case, e.g. `bass`), `name`, `acronym`, `agency`, `platform` (ISS, Crewed spacecraft, Uncrewed spacecraft, Drop tower, Parabolic flight, Sounding rocket, Ground (1 g), Multiple platforms: for NASA reviews that summarise many experiments), `facility`, `years` (free text), `fuels`, `summary` (2–3 plain sentences), `themes`, `sources`, `verified`.

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

### Datasets (`data/datasets/`)

Real NASA measurement tables, kept exactly as printed, for the gaps map and Four Worlds. Not findings: a finding is a claim; a dataset row is a measurement. Findings may cite a dataset row's source and page.

- **`flex-table-ix.json`** (`FlexDataset` in `src/lib/schema.ts`): metadata (`source` with NTRS id and locator, `gravityG: 0`, `verified`) and `rows`, one per FLEX test: `test`, `identifier`, `date`, `timeGmt`, `fuel`, `pressureMmHg`, `o2`/`n2`/`co2`/`he` (mole fractions), `initialDiameterMm`, `extinctionDiameterMm`, `burningRateMm2PerS`, `burnTimeS`, `testEnd` (`extinction` · `disruption` · `completion`), `page`, optional `notes`.
- `null` means "–" in the table (not measured or did not happen). Pressure is kept in mmHg as printed (1 mmHg = 0.133322 kPa; convert in the UI). Cleaning, all recorded in `notes`: FLEX-114 prints pressure 0 (not physical) → `null`; FLEX-227 and 229 print burn time with "~" → number kept. A few tests print extinction diameter 0: kept as printed.
- Checks (`npm run data:validate`, tests): unique test numbers, mole fractions sum to 1 ± 0.03, counts match the report (276 tests: 186 extinction, 62 disruption, 28 completion).
- `verified: false` until a teammate spot-checks ~10 rows against the PDF pages.

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
