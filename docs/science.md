# Fire in microgravity: a primer for the team

Read this before writing any science text in the app, the slides or a prompt. It's what you need to talk to a judge for 3 minutes without saying something wrong.

**Rule:** this primer is background, not a source. Anything the app states as fact must come from a finding with a NASA source. Items marked ⚠ are things we believe but must confirm from a source before putting them in the product.

## Why fire is different without gravity

1. **No buoyancy.** On Earth, hot combustion gases are lighter and rise; cool, oxygen-rich air flows in from below. That convection shapes the teardrop candle flame and feeds it constantly. In microgravity hot gas doesn't rise, so there is no natural convection.
2. **Oxygen arrives slowly, by diffusion** (molecules spreading out), unless something blows air past the flame. So a candle flame becomes a **dim, blue, roughly spherical** flame, our brand mark. It often burns cooler and slower, and can go out when the oxygen around it is used up.
3. **Ventilation is the new "gravity".** In a spacecraft, fans move cabin air at low speeds. That airflow now decides how much oxygen reaches a flame. A small flow can keep a fire alive that would otherwise smother itself. ⚠ Some studies report that, with a slow airflow, certain materials burn in microgravity at oxygen levels where they would not burn in the standard 1 g test: find and cite.
4. **Cool flames.** FLEX showed that large fuel droplets can keep reacting after the visible flame goes out, in a low-temperature "cool flame" that is hard to see. That matters for detection and for re-ignition.
5. **Smoke behaves differently.** Without buoyancy smoke doesn't rise to a ceiling detector, and particle sizes can differ from Earth fires. SAME measured smoke from overheated spacecraft materials to check detectors.
6. **Scale matters.** Small samples in a glovebox may not predict a large fire. Saffire burned spacecraft-sized samples inside empty Cygnus cargo ships to see real flame growth and how fast the cabin air changes.

## Why it matters now: exploration atmospheres and partial gravity

- **Oxygen and pressure.** Cabin atmospheres trade fire risk against spacewalk prep time. The ISS runs at sea-level pressure (≈ 101 kPa) with ≈ 21 % O₂. ⚠ Exploration vehicles and habitats have been studied at lower pressure with more oxygen (often quoted ≈ 56.5 kPa / 34 % O₂). More oxygen generally means materials ignite more easily and burn faster: a core reason this research matters for Artemis and Mars.
- **Partial gravity.** The Moon is ≈ 0.17 g and Mars ≈ 0.38 g. Some buoyancy, but much less than Earth. ⚠ Research suggests flammability in partial gravity can differ from both 0 g and 1 g, and there is very little data. "Untested at this gravity" is one of our most valuable honest outputs (the evidence-gap view).
- **Material screening.** NASA screens materials with a ground test (NASA-STD-6001, Test 1, upward flame spread in 1 g). The open question is how well that predicts behaviour in 0 g and partial gravity.
- **History.** Apollo 1 (1967, ground test, pure-oxygen cabin, three astronauts died) and the Mir fire (1997, oxygen-generator canister, smoke-filled station) are the reasons this field exists. Use them for context, not as microgravity data.

## Where the data comes from (platforms)

| Platform | Microgravity time | Typical use |
|---|---|---|
| Drop towers (NASA Glenn: 2.2 Second Drop Tower, Zero Gravity Research Facility ≈ 5 s) | seconds | Quick, repeatable tests of ignition and early flame behaviour |
| Parabolic flights | ≈ 20 s per parabola | Short tests, partial-gravity parabolas possible |
| Sounding rockets | minutes | Longer tests without a crew |
| Space Shuttle, Mir | days | Early long-duration experiments |
| ISS: Combustion Integrated Rack (CIR), Microgravity Science Glovebox (MSG) | unlimited | FLEX, FLEX-2, CFI, ACME, SoFIE (CIR); BASS, SAME (MSG) |
| Uncrewed spacecraft (Cygnus) | hours | Saffire: large fires, no crew at risk |

## Key experiment families (seed list; verify each, `data/experiments.json`)

- **Droplets:** FLEX, FLEX-2 (extinction, cool flames, suppressants, soot).
- **Gaseous flames:** ACME (soot, flame structure, extinction limits, burning-rate emulator), CFI (cool flames).
- **Solids (most relevant to cabin fires):** BASS / BASS-II (flame spread and nitrogen suppression on PMMA, fabric, paper), SoFIE (ignition and extinction of spacecraft materials), JAXA FLARE (flammability limits at reduced gravity), Saffire I–VI (large-scale spread on spacecraft materials).
- **Detection:** SAME (smoke particle sizes).
- **Standards and incidents:** NASA-STD-6001, Apollo 1, Mir 1997.

## Glossary (use these words, in this sense)

| Term | Meaning |
|---|---|
| **Microgravity** | Near-weightlessness (≈ 10⁻⁶ to 10⁻³ g) in free fall: orbit, drop towers, parabolic flights. Not "zero gravity" in text; "0 g" is fine in charts. |
| **Partial gravity** | Between 0 and 1 g: Moon ≈ 0.17 g, Mars ≈ 0.38 g. |
| **1 g / normal gravity** | Earth conditions; the comparison baseline. |
| **Buoyancy / natural convection** | Hot gas rising because it is lighter; absent in microgravity. |
| **Diffusion flame** | Fuel and oxygen meet at the flame by mixing; candles, droplets, burning solids. |
| **Premixed flame** | Fuel and oxygen already mixed before burning; e.g. a gas stove. |
| **Flame spread** | A flame moving over a solid's surface; measured as a spread rate (mm/s or cm/s). |
| **Opposed vs concurrent flow** | Airflow against vs along the direction of flame spread. Concurrent spread is usually faster and more hazardous. |
| **Ventilation / forced flow** | Air moved by fans; in spacecraft typically centimetres per second. |
| **Ignition** | The start of sustained burning; ignition delay = time to ignite under a heat source. |
| **Extinction** | The flame going out: by oxygen starvation, heat loss, flow too strong ("blow-off") or too weak ("quenching"). |
| **Flammability limit / LOC / MOC** | The lowest oxygen concentration (or pressure, or flow) at which a material keeps burning. LOC = limiting oxygen concentration; MOC = maximum oxygen concentration at which a material passes a test. |
| **Cool flame** | Low-temperature (≈ 500–800 K) reaction that gives off little light; seen in FLEX. |
| **Soot** | Carbon particles formed in flames; they glow (yellow) and radiate heat. |
| **Radiative extinction** | A flame going out because it loses too much heat by radiation; important for large, slow microgravity flames. |
| **Suppression** | Putting a fire out: CO₂, water mist, nitrogen, cutting ventilation, cutting power. |
| **Spacecraft atmosphere** | Cabin pressure and oxygen fraction (e.g. 101 kPa / 21 % O₂ on the ISS). |
| **PMMA** | Acrylic plastic; a standard test fuel. |
| **Nomex, cotton-fiberglass (SIBAL)** | Fabrics used in fire tests; SIBAL is the cotton-fiberglass blend used in Saffire. |
| **CIR / MSG** | Combustion Integrated Rack / Microgravity Science Glovebox: ISS facilities. |
| **NTRS** | NASA Technical Reports Server (ntrs.nasa.gov): NASA papers and reports. |
| **PSI** | NASA Physical Sciences Informatics (psi.nasa.gov): raw data from ISS physical science experiments. |
| **Finding / Insight** | Our product terms: see `docs/prd.md` › Glossary. |

## Phrases to avoid

- "Fire can't burn in space." (It can, and differently.)
- "Zero gravity" in prose (say microgravity).
- "Proven" or "always" unless the cited finding says so; prefer "NASA experiments found…".
- Any number without a unit and a source.
