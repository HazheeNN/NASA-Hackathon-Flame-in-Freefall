# FLEX findings review (2026-11-14)

Proposed by Claude (SI job 1) from *Detailed Results From the Flame Extinguishment Experiment (FLEX)*, NASA/TP—2015-216046, [NTRS 20150023456](https://ntrs.nasa.gov/citations/20150023456). The proposals file is `data/raw/proposed/flex-tp-2015-216046.json` (git-ignored, in Claude's session); this sheet is the copy the team reviews.

**Already checked by script:** every quote below appears word for word in the PDF on the page linked (hyphenation and line breaks ignored). **Your job:** judge the meaning, using the 4 checks in `docs/data.md` › Verification:
1. The quote supports the statement.
2. Every number, unit and condition is right.
3. The statement doesn't claim more than the paper (no "always", no extrapolation).
4. The safety implication reads as an implication, not a result.

Then tick **Keep**, **Fix** (write what) or **Drop**, and tell Claude. Pages: printed page first, PDF page in brackets; the links open at the PDF page.

## F-001 · Droplet flames needed less oxygen than expected to keep burning

**Statement:** In FLEX tests on the ISS, the lowest oxygen level at which methanol and heptane droplets still burned appeared slightly lower than the team initially expected.

**Quote** (Executive Summary, printed p. 2 (PDF p. 8); [PDF p. 8](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=8)):

> A principle objective was to determine the limiting oxygen index (LOI), the oxygen percentage below which combustion would not occur. This objective reflected the FLEX focus on investigating fire safety in spacecraft. Observed LOI values for these fuels appear to be slightly lower than initially expected.

**Conditions:** gravityG: 0, fuel: methanol, n-heptane droplets · **Numbers:** — · **Themes:** flammability-limits, spacecraft-atmosphere · **Evidence:** measured, strength 2

**Why it matters (implication):** Oxygen limits estimated before flight may not be conservative for liquid fuels in microgravity, so cabin fire margins could be smaller than assumed.

**Look carefully:** The paper gives no numbers, only "slightly lower than initially expected". "May not be conservative" in the implication is our wording, not the paper's.

- [ ] Keep  - [ ] Fix: ……  - [ ] Drop  · Checked by: ……

## F-002 · Droplet flames went out in two different ways depending on dilution

**Statement:** Both methanol and heptane flames showed radiative extinction at higher dilutions of oxygen and diffusive extinction at lower dilutions; some flames also ended by disruptive extinction.

**Quote** (Executive Summary, printed p. 2 (PDF p. 8); [PDF p. 8](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=8)):

> Besides documenting both radiative extinction at higher dilutions and diffusive extinctions at lower dilutions for both fuels, the results exhibited disruptive extinctions and provided information pertinent to soot production for heptane.

**Conditions:** gravityG: 0, fuel: methanol, n-heptane droplets · **Numbers:** — · **Themes:** extinction, suppression · **Evidence:** measured, strength 2

**Why it matters (implication):** How a fire goes out in microgravity depends on how diluted the oxygen is, so suppression strategies may need to account for more than one extinction mechanism.

**Look carefully:** Close to the paper's wording. Check "disruptive extinction" is described as an extra outcome, as written.

- [ ] Keep  - [ ] Fix: ……  - [ ] Drop  · Checked by: ……

## F-003 · The visible flame looks smaller than the full flame

**Statement:** Flame diameters seen by the color camera were about three-fourths of those measured by the ultraviolet (OH) camera; for heptane the gap was larger because the sooty glow sits inside the blue flame envelope.

**Quote** (Section 4.2 Analyzed Data, printed p. 16 (PDF p. 22); also Executive Summary, printed p. 2 (PDF p. 8); [PDF p. 22](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=22)):

> The flame diameters from the color camera are typically about three-fourths of those from the LLUV camera. ... For heptane tests, where there is significant soot luminosity (which is not visible in the LLUV, but dominates the color camera), the discrepancy is even larger because the peak of the soot luminosity is typically inside the blue flame envelope.

**Conditions:** gravityG: 0, fuel: methanol, n-heptane droplets · **Numbers:** visible / UV flame diameter ratio = 0.75 — · **Themes:** soot-radiation, smoke-detection · **Evidence:** measured, strength 2

**Why it matters (implication):** A microgravity flame can extend beyond what the eye or a visible-light camera shows, so visual size estimates may understate the burning zone.

**Look carefully:** "About three-fourths" is stored as 0.75. The "smoke-detection" theme and the visual-size implication are ours; the paper only compares two cameras.

- [ ] Keep  - [ ] Fix: ……  - [ ] Drop  · Checked by: ……

## F-004 · FLEX covered 0.70 to 3.05 atm, mostly 0.7 to 1 atm

**Statement:** FLEX burned methanol and n-heptane droplets 2 to 5 mm across at pressures between 0.70 and 3.05 atm, with oxygen diluted by nitrogen, carbon dioxide or both; most tests were between 0.7 and 1 atm and many were in air.

**Quote** (Executive Summary, printed p. 2 (PDF p. 8); Conclusions, printed p. 17 (PDF p. 23); [PDF p. 8](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=8) · [PDF p. 23](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=23)):

> The droplets had initial diameters between 2 and 5 mm, and they were burned in oxidizing atmospheres at ambient temperature and various pressures between 0.70 and 3.05 atm, over ranges of dilution of oxygen with nitrogen, with carbon dioxide, and with mixtures thereof. Most of the tests were conducted at pressures between 0.7 and 1 atm, and many of the tests were in air.

**Conditions:** gravityG: 0, fuel: methanol, n-heptane droplets · **Numbers:** lowest test pressure = 0.7 atm; highest test pressure = 3.05 atm; smallest initial droplet diameter = 2 mm; largest initial droplet diameter = 5 mm · **Themes:** spacecraft-atmosphere, flammability-limits · **Evidence:** measured, strength 2

**Why it matters (implication):** Cabin atmospheres below 0.70 atm, such as the proposed 8.2 psia (about 0.56 atm) habitat air, lie outside the conditions FLEX measured.

**Look carefully:** The ranges are the paper's. The link to the 0.56 atm (8.2 psia) habitat air is our implication. Conclusions on p. 17 (PDF 23) repeat the 0.70–3.05 atm range.

- [ ] Keep  - [ ] Fix: ……  - [ ] Drop  · Checked by: ……

## F-005 · Without gravity a droplet flame stays spherical

**Statement:** Natural convection destroys the spherical symmetry of droplet burning in normal gravity; microgravity allows spherical symmetry, which NASA has used in combustion research for years.

**Quote** (Introduction, printed p. 2 (PDF p. 8); [PDF p. 8](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=8)):

> Natural convection, however, destroys the spherical symmetry of combustion in normal gravity, as was quite evident in the earliest experiments of Hall and Diederichsen (1953) and Goldsmith (1956). Kumagai and Isoda (1956) were the first to realize that microgravity experiments afforded the opportunity to achieve spherical symmetry—a fact that NASA has taken advantage of in fundamental combustion investigations for a number of years

**Conditions:** gravityG: 0 · **Numbers:** — · **Themes:** partial-gravity, soot-radiation · **Evidence:** review, strength 2

**Why it matters (implication):** Fire in a spacecraft does not take the familiar upward teardrop shape, so crews and detectors cannot rely on Earth experience of how a flame looks or moves.

**Look carefully:** The authors summarise older experiments (1950s), not a FLEX result, so it is marked "review". The crew and detector implication is ours.

- [ ] Keep  - [ ] Fix: ……  - [ ] Drop  · Checked by: ……

## F-006 · Some droplet break-ups were caused by a needle coating, not the fuel

**Statement:** A coating on the fuel needles contaminated some droplets; the authors judge that disruptive extinction of methanol was probably caused by it, while burning rates, flame size and radiative extinction diameters were minimally or not affected.

**Quote** (Section 5.2 Fuel Needle Contamination, printed p. 17 (PDF p. 23); [PDF p. 23](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=23)):

> (1) Burning-rate constants were average, and the droplet history was minimally influenced by the contaminant. ... (4) Disruptive extinction of methanol is probably due to the presence of the contaminant. ... (7) Radiative extinction droplet diameters (larger diameters) were not influenced by the presence of the contaminant.

**Conditions:** gravityG: 0, fuel: methanol, n-heptane droplets · **Numbers:** — · **Themes:** extinction · **Evidence:** measured, strength 1

**Why it matters (implication):** FLEX 'disruption' outcomes for methanol should not be read as how a clean fuel fire behaves, which matters when using these tests to judge fire behaviour.

**Look carefully:** A data-quality caveat. Check our summary of items (1), (4) and (7) on p. 17 doesn't overstate them.

- [ ] Keep  - [ ] Fix: ……  - [ ] Drop  · Checked by: ……
