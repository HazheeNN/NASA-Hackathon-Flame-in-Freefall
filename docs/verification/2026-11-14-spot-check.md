# Spot-check list (2026-11-14)

The FLEX table, the 20 experiments and the 32 findings were marked verified by Claude at the owner's request (#11), not checked by a teammate's own eyes. This list lets a person confirm the parts that matter most in about 20 minutes. Every link opens the source at the right page.

For each item: open the link, read the quote at that place, tick **OK** or write what's wrong. Tell Claude about anything wrong; don't edit the data yourself.

## 1. Findings behind the top 3 insights (most important: judges see these first)

### I-01 · #1 · Cabin ventilation is the worst case, not a safety margin

*Insight says:* Rate materials and plan fire response for airflow near 10 cm/s, the speed of spacecraft ventilation, because that is where solids burn at the lowest oxygen and spread fastest.

Also check that the insight's sentence follows from the findings below and doesn't claim more.

- [ ] **F-003** · Tests in still air suggested materials are less flammable in microgravity, but that margin may not be valid in real spacecraft, where ventilation airflow strongly strengthens flames.
  - [PDF p. 18](https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf#page=18): “Microgravity experiments demonstrated that the assumed margin of safety of reduced flammability in microgravity, based on quiescent test results, may not be valid for most spacecraft environments where ventilation flow strongly enhances flames.”
- [ ] **F-008** · For flame spread over solids, the lowest oxygen level that still supports a flame occurs at an airflow of about 10 cm/s, which is also where flames spread fastest, and is typical of spacecraft ventilation. At even lower speeds, radiative loss puts the flame out.
  - [PDF p. 31](https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf#page=31): “the characteristic gas velocity of the minimum in the curve is on the order of 10 cm/s and also corresponds to a maximum in the flame spread rate. To give perspective, this is the velocity typical of that of spacecraft ventilation systems.”
- [ ] **F-017** · BASS-II crews adapted to new flow variations, including blowoff extinctions, which helped outline a U-shaped flammability boundary.
  - [PDF p. 19 (printed p. 11), 1.6 Overall Conclusions](https://ntrs.nasa.gov/api/citations/20210011385/downloads/TM-20210011385.pdf#page=19): “they were able to adapt to new flow variations such as blowoff extinctions, that proved to be very valuable data in outlining the U-shaped flammability boundary”
- [ ] **F-015** · On a 2-cm-wide cotton-fiberglass fabric in opposed flow, BASS stepped the airflow down from 10 cm/s to below 1 cm/s; the flame and its spread rate changed very rapidly and dramatically with each step.
  - [PDF p. 20](https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf#page=20): “The flow is decreased in discrete steps from 10 cm/s all the way down to less than 1 cm/s. The flame response to flow changes is very rapid, and the flow effects on the flame and its spread rate are dramatic. Total burn time is 90 seconds.”
- [ ] **F-010** · NASA research disproved three misconceptions: that a steady fire cannot exist in still microgravity air, that a fire will self-extinguish if ventilation is shut off, and that terrestrial fire tests are very conservative because reduced gravity is inherently safer.
  - [PDF p. 35](https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf#page=35): “1. A steady fire cannot exist in a quiescent microgravity environment. 2. A fire will self-extinguish if ventilation is shut off. 3. Because the reduced-gravity environment is inherently safer, terrestrial fire standards and tests represent a very conservative approach to fire safety.”
  - [PDF p. 35](https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf#page=35): “demonstrates the fallacy of these assumptions”

### I-02 · #2 · After a fire, toxic gas is the main threat

*Insight says:* Size detection and cleanup for carbon monoxide and carbon dioxide first: in large spacecraft fire tests, gas build-up mattered more than heat or pressure.

Also check that the insight's sentence follows from the findings below and doesn't claim more.

- [ ] **F-020** · In Saffire VI, the rise in spacecraft temperature and pressure was less significant than the increase in carbon dioxide and carbon monoxide.
  - [Abstract](https://ntrs.nasa.gov/citations/20240002981): “Overall, the temperature and pressure rise in the spacecraft were found to be less significant than the increase in carbon dioxide and carbon monoxide.”
  - [Abstract](https://ntrs.nasa.gov/citations/20240002981): “These tests spanned 1.5 to 3.2 kW with free air volumes of 17 to 19 cubic meters.”
- [ ] **F-019** · Saffire IV and V burned 40-cm-wide samples inside a Cygnus spacecraft; fires with heat release up to 10 kW measurably changed cabin pressure, temperature and CO2, but average conditions did not rise to unacceptable levels.
  - [Abstract](https://ntrs.nasa.gov/citations/20210011521): “despite having heat release rates up to 10 kW, the average vehicle conditions did not rise to unacceptable levels”
  - [Abstract](https://ntrs.nasa.gov/citations/20210011521): “The samples were all 40 cm wide”
- [ ] **F-016** · In BASS-II, CO to CO2 ratios were an order of magnitude higher than in efficient combustion; flames burned fuel-rich (global equivalence ratio about 1.3) under low-velocity flow, and most released well below 100 W.
  - [PDF p. 19 (printed p. 11), 1.6 Overall Conclusions](https://ntrs.nasa.gov/api/citations/20210011385/downloads/TM-20210011385.pdf#page=19): “The CO to CO2 ratios for these fires are an order of magnitude higher than for efficient flue gases, indicating that these flames are not efficient.”
  - [PDF p. 19 (printed p. 11), 1.6 Overall Conclusions](https://ntrs.nasa.gov/api/citations/20210011385/downloads/TM-20210011385.pdf#page=19): “the global equivalence ratio for the tests is estimated to be 1.3 on average, which indicates the flames were burning fuel rich under the low-velocity forced-flow conditions”
- [ ] **F-031** · On 24 February 1997 a solid-fuel oxygen generator in Mir's Kvant-1 module caught fire; the flame lasted several minutes, cut off access to one of two Soyuz escape vehicles and filled the modules with smoke, which life support took hours to clear.
  - [Paragraphs 1 and 3](https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/): “The searing flame, lasting several minutes, not only cut off access to one of the two Soyuz escape vehicles but also filled the station’s modules with smoke.”
  - [Paragraphs 1 and 3](https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/): “The station’s life support systems cleared its atmosphere of the toxic smoke over several hours”

### I-03 · #3 · More oxygen demands stricter material control

*Insight says:* Treat any cabin above 21 % oxygen as a higher fire risk and tighten material and ignition-source rules to match.

Also check that the insight's sentence follows from the findings below and doesn't claim more.

- [ ] **F-013** · Crewed spacecraft necessarily contain fuel, oxygen and ignition sources, often run at a higher oxygen fraction than air, offer limited escape and tolerate almost no damage to life support.
  - [PDF p. 35](https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf#page=35): “A fire or explosion requires all elements of the “fire triangle” to be present: fuel, oxygen and a source of ignition. Crewed spacecraft, by necessity, contain all three.”
  - [PDF p. 35](https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf#page=35): “spacecraft frequently operate at an ambient oxygen mole fraction higher than that of air, have limited options for escape, and have almost no tolerance for damage to critical life support systems”
- [ ] **F-032** · In the 1967 Apollo 1 ground test, the cabin held pure oxygen at 16.7 psi with more flammable material than allowed; after an electrical arc, the fire spread very rapidly and killed three astronauts.
  - [Investigation section](https://www.nasa.gov/history/55-years-ago-the-apollo-1-fire-and-its-aftermath/): “Because of the pure oxygen atmosphere, pressurized to 16.7 psi – two pounds above atmospheric pressure and a larger-than-allowable amount of flammable material in the spacecraft – the fire spread very rapidly.”
- [ ] **F-031** · On 24 February 1997 a solid-fuel oxygen generator in Mir's Kvant-1 module caught fire; the flame lasted several minutes, cut off access to one of two Soyuz escape vehicles and filled the modules with smoke, which life support took hours to clear.
  - [Paragraphs 1 and 3](https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/): “The searing flame, lasting several minutes, not only cut off access to one of the two Soyuz escape vehicles but also filled the station’s modules with smoke.”
  - [Paragraphs 1 and 3](https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/): “The station’s life support systems cleared its atmosphere of the toxic smoke over several hours”

## 2. FLEX Table IX: 4 random rows

Open the page, find the test number in Table IX, and compare every column. PDF page = printed page + 6.

| Test | Fuel | Pressure (mmHg) | O₂ | N₂ | CO₂ | He | D₀ (mm) | Ext. diam. (mm) | K (mm²/s) | Burn time (s) | End | Open | OK |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FLEX-023 | heptane | 541.8 | 0.34 | 0.66 | 0 | 0 | 3.01 | – | 0.73 | 13.1 | disruption | [printed p. 20](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=26) | ☐ |
| FLEX-104 | methanol | 534.1 | 0.23 | 0.56 | 0.2 | 0 | 3.6 | 1.58 | 0.49 | 23.2 | extinction | [printed p. 23](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=29) | ☐ |
| FLEX-171 | methanol | 766.7 | 0.21 | 0.64 | 0.15 | 0 | 3.53 | 1.59 | 0.46 | 23.6 | extinction | [printed p. 24](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=30) | ☐ |
| FLEX-262 | methanol | 531.2 | 0.21 | 0.49 | 0 | 0.3 | 3.25 | 1.78 | 0.65 | 12.1 | extinction | [printed p. 27](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=33) | ☐ |

## 3. Experiments: the 4 that were corrected

Check the years and facility in our data against the source text.

- [ ] **BASS**: years *2012 (BASS) and 2014 (BASS-II)*; facility *Microgravity Science Glovebox*
  - [Abstract: Microgravity Science Glovebox, air flow up to 40 cm/s](https://ntrs.nasa.gov/citations/20140011099)
  - [Burning and Suppression of Solids–II (BASS-II) Summary Report](https://ntrs.nasa.gov/citations/20210011385)
  - [p. 19: BASS flight operations started March 2012; p. 45: in the MSG](https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf)
- [ ] **Saffire**: years *2016 to 2023*; facility *Cygnus cargo vehicle, after leaving the ISS*
  - [PDF p. 4: Saffire-I launched in the Cygnus on 22 March 2016 (OA-6)](https://ntrs.nasa.gov/citations/20170001636)
  - [Slide 4: Saffire IV and V flew in 2020 and 2021; Saffire VI flew in December 2023](https://ntrs.nasa.gov/citations/20240007488)
- [ ] **SoFIE**: years *2023 onward*; facility *Combustion Integrated Rack*
  - [Abstract: insert for the Combustion Integrated Rack](https://ntrs.nasa.gov/citations/20200000361)
  - [Poster: liquid droplets (2009–2017), gaseous fuels (2017–2022), solid fuels (2023–)](https://ntrs.nasa.gov/citations/20250002347)
- [ ] **Zero Gravity Research Facility (Glenn Research Center)**: years *Operational since 1966*; facility *Vacuum drop shaft, 5.18 seconds of free fall*
  - [Facility Overview: near-weightless for 5.18 seconds; operational since 1966; used for combustion](https://www.nasa.gov/centers-and-facilities/glenn/zero-gravity-research-facility/)

## 4. Not verified yet

- [ ] **FX-03 forced stretch rate** `a = 3/2 · U ÷ r` (new on PR #10): formula on [PDF p. 3](https://ntrs.nasa.gov/api/citations/20160012691/downloads/20160012691.pdf#page=3); rod sizes and 14–18 % O₂ in the abstract, [PDF p. 1](https://ntrs.nasa.gov/api/citations/20160012691/downloads/20160012691.pdf#page=1); the 60.3 cm/s maximum flow on [PDF p. 2](https://ntrs.nasa.gov/api/citations/20160012691/downloads/20160012691.pdf#page=2). If OK, Claude sets `verified: true`.
- [ ] **Proposed FLEX findings F-033…F-038:** `docs/verification/2026-11-14-flex-findings-review.md`.

Checked by: …… · Date: ……
