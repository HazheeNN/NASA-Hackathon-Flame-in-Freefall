# Data check against NASA sources (2026-11-14)

Every table in `data/` compared with the NASA documents it cites, downloaded straight from NASA (NTRS, NSSDC). Claude did the comparison in a cloud session that was given access to those NASA sites; Agent Reach wasn't needed (or installed there). **Nothing was set to `verified: true`:** that stays a teammate's sign-off (`docs/data.md` › Verification). Use this file to do it quickly.

## Summary

| Table | Result | Fixed in this PR | Left for a teammate |
|---|---|---|---|
| `datasets/flex-table-ix.json` (276 tests) | **All 276 rows match** Table IX of NASA/TP—2015-216046 (pp. 20–28), every number, date, time, fuel and test end. The only 2 differences are documented on purpose: test 9 has no time printed ("–" → null), test 114 prints pressure 0 (→ null, with a note). No test missing, none extra. | — | Open 3–4 rows in the PDF yourself, then set `verified: true` |
| `worlds.json` (4) | Moon 1.62 m/s² → **0.165 g ✓**, Mars 3.73 m/s² → **0.38 g ✓** (NSSDC fact sheets). Earth 1 g ✓. | The partial-gravity paper (NTRS 20010074098) had the wrong title; its real title is *Physical and Chemical Aspects of Fire Suppression in Extraterrestrial Environments*. It states **0.38 g for Mars**, but **no 0.16 g Moon value**. | Find a NASA source for Moon flammability at 0.16–0.17 g (the NSSDC sheet covers the gravity itself). Check the ISS mini-book on www.nasa.gov for the ISS row. |
| `atmospheres.json` (5) | 8.0 psia / 32 % (EAWG), 8.2 psia / 34 %, 10.2 psia / 26.5 % **✓**, all on p. 11 of NTRS 20130013505; kPa conversions ✓ (56.5, 55.2, 70.3). ISS-like 14.7 psia (101.35 kPa), 21 % O₂ ✓ in NTRS 20240005117. | Earth air set to the cited NSSDC values: **101.4 kPa** (1014 mb, was 101.3) and **20.95 % O₂** (was 20.9). Two wrong source titles fixed (20240005117 is *Creating the Test Environment for Exploration Habitats*; 20150021491 is *…Risk of **Hypobaric** Hypoxia…*). EAWG wording: commissioned 2005 (final report 2006). Locators added. | 20240005117 says vehicle cabins mimic sea level since the Shuttle; it isn't an ISS spec. A direct ISS cabin source would be stronger. |
| `experiments.json` (14) | Facts found in NASA abstracts: ACME in the CIR from **2017 ✓**; BASS in the **Microgravity Science Glovebox ✓**, flow up to 40 cm/s; SoFIE an insert for the **CIR ✓**; Saffire on **Cygnus ✓**, Saffire-I **2016 ✓**, Saffire VI the last flight; NASA-STD-6001 Test 1 = upward flame spread, and whether it's conservative in reduced gravity is an open question ✓; Apollo 204 Review Board report 1967 ✓. | 8 experiments now cite real NTRS papers instead of search links (ACME, BASS, SoFIE, Saffire, SAME, NASA-STD-6001, Apollo 1). **SAME years corrected:** "Late 2000s" → **"2007 (SAME) and 2010 (SAME-2)"** (Expedition 15, then Expedition 24). | Not confirmed in NTRS: **FLEX-2, CFI, FLARE, Mir 1997** (no matching NTRS results; try nasa.gov / JAXA), ACME's end year (2020), BASS years (2011–2013), Saffire's end year (2024 is the paper; the flight may be 2023), SAME's facility (MSG), the drop-tower times (5 s, 2.2 s). |

## How it was checked

- FLEX: `pdftotext -layout` on the report's pp. 19–40, every `FLEX–NNN` line matched to its JSON row field by field. This is independent of `scripts/flex-table-ix.mts`'s parser.
- Worlds and atmospheres: NSSDC fact sheets (HTML) and NTRS PDFs, read at the cited pages.
- Experiments: NTRS search API, then the abstracts of the matching papers.

## Follow-up: the four missing sources (2026-11-14)

All four now cite a NASA source with a page (`data/experiments.json`), still `verified: false` for a teammate's sign-off. Found through the NTRS API and nasa.gov in this cloud session; Agent Reach wasn't needed (and isn't installed in cloud sessions).

| Experiment | Source | What it confirms, and what changed |
|---|---|---|
| **FLEX-2** | NTRS 20210022617 (Nayagam, Dietrich, Williams 2021), PDF p. 2; NTRS 20205008449, p. 2 | Part of the FLEX series on the ISS, 2008–2016, on the CIR + MDCA. Years changed from "2010s" to that. **Fuels (heptane, decane, mixtures) not yet confirmed.** |
| **CFI** | Same two papers: p. 2 ("Cool Flame Investigation (CFI): ISS 2017"), p. 13 (warm flames at elevated pressures) | **Corrected:** it was a **droplet** experiment on the MDCA in **2017**, not gaseous fuels "late 2010s onward". NASA's name is *Cool Flame Investigation*. |
| **FLARE** | NTRS 20160001023 (Juarez et al., NASA White Sands, 2016), p. 1, 2, 4 | JAXA-led with NASA and ESA, on the ISS Japanese Experiment Module (Kibo). Goal: compare NASA-STD-6001 Test 1 with oxygen limits measured in orbit. Ground work 2015–2019. **Flight dates still unconfirmed** (JAXA's own site would have them; not reachable from this session). Name corrected to *Reduced-g*. |
| **Mir 1997** | NASA History, "25 Years Ago: Fire Aboard Space Station Mir" (John Uri, 2022) | 24 Feb 1997, solid-fuel oxygen generator in the Kvant-1 module, six crew, flame for several minutes, smoke, one Soyuz route blocked; NASA calls it the worst in-orbit fire in spaceflight history. Summary reworded to match. |
| **ACME** (extra) | NTRS 20250002347 (Stocker 2025 poster) | Gaseous-fuel tests ran **2017–2022**: years changed from "2017 to 2020". |
