# FLEX findings review (2026-11-14)

Proposed by Claude (SI job 1) from *Detailed Results From the Flame Extinguishment Experiment (FLEX)*, NASA/TP—2015-216046, [NTRS 20150023456](https://ntrs.nasa.gov/citations/20150023456). The proposals file is `data/raw/proposed/flex-tp-2015-216046.json` (git-ignored, in Claude's session); this sheet is the copy the team reviews.

**Renumbered F-033…F-038** after the 32 findings merged in #11. **Overlap:** F-033 (lower oxygen limit) says much the same as the verified F-001, which cites the ISS mini-book; keep F-033 only as a second source for F-001, or drop it.

**Already checked by script:** every quote below appears word for word in the PDF on the page linked (hyphenation and line breaks ignored). **Your job:** judge the meaning, using the 4 checks in `docs/data.md` › Verification:
1. The quote supports the statement.
2. Every number, unit and condition is right.
3. The statement doesn't claim more than the paper (no "always", no extrapolation).
4. The safety implication reads as an implication, not a result.

Then tick **Keep**, **Fix** (write what) or **Drop**, and tell Claude. Pages: printed page first, PDF page in brackets; the links open at the PDF page.

## Result (Claude, 2026-11-14, at the owner's request)

All six were checked against the PDF: every quote was matched word for word on its page again (the "…" gaps split into separate quotes), and each statement was read against the 4 checks. **All six kept and added to `data/findings.json` as F-033…F-038, `verified: true`.** Quotes are in `2026-11-14-findings-quotes.md`. Changes made while checking:

| Finding | Decision | Change |
|---|---|---|
| F-033 | Keep | Kept as FLEX's own statement (second, primary source next to F-001). Implication reworded to stay with the paper: estimates *overstated* the oxygen needed, so margins *may* be smaller. |
| F-034 | Keep | Implication reworded: a limit measured at one dilution may not hold at another (the suppression-strategy line went further than the paper). |
| F-035 | Keep | Theme "smoke-detection" removed (the paper only compares two cameras); "typically about three-fourths" kept as 0.75. |
| F-036 | Keep | Conclusions (printed p. 17, PDF p. 23) added as a second quote for the 0.70–3.05 atm range. |
| F-037 | Keep | Theme "partial-gravity" removed (the passage is about normal gravity vs microgravity); stays "review". |
| F-038 | Keep | No change; quote split into items (1), (2), (4), (7). |

Also added from the FX-03 paper: **F-039**, a 1 g blowoff test that estimated 13.4 % O₂ for PMMA rods against 13.6 % observed in BASS-II (Marcum, Olson, Ferkul 2016, PDF p. 8 and abstract).

## F-033 · Droplet flames needed less oxygen than expected to keep burning

**Statement:** In FLEX tests on the ISS, the lowest oxygen level at which methanol and heptane droplets still burned (the limiting oxygen index) appeared slightly lower than initially expected.

**Quote** (Executive Summary, printed p. 2 (PDF p. 8); [PDF p. 8](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=8)):

> A principle objective was to determine the limiting oxygen index (LOI), the oxygen percentage below which combustion would not occur. This objective reflected the FLEX focus on investigating fire safety in spacecraft. Observed LOI values for these fuels appear to be slightly lower than initially expected.

**Conditions:** gravityG: 0, fuel: methanol, n-heptane droplets · **Numbers:** — · **Themes:** flammability-limits, spacecraft-atmosphere · **Evidence:** measured, strength 2

**Why it matters (implication):** Oxygen limits estimated before flight may not be conservative for liquid fuels in microgravity, so cabin fire margins could be smaller than assumed.

**Look carefully:** The paper gives no numbers, only "slightly lower than initially expected". "May not be conservative" in the implication is our wording, not the paper's.

- [x] Keep  - [ ] Fix  - [ ] Drop  · Checked by: Claude, against the PDF (owner request, 2026-11-14)

## F-034 · Droplet flames went out in two different ways depending on dilution

**Statement:** Both methanol and heptane flames showed radiative extinction at higher dilutions of oxygen and diffusive extinction at lower dilutions; some flames also ended by disruptive extinction.

**Quote** (Executive Summary, printed p. 2 (PDF p. 8); [PDF p. 8](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=8)):

> Besides documenting both radiative extinction at higher dilutions and diffusive extinctions at lower dilutions for both fuels, the results exhibited disruptive extinctions and provided information pertinent to soot production for heptane.

**Conditions:** gravityG: 0, fuel: methanol, n-heptane droplets · **Numbers:** — · **Themes:** extinction, suppression · **Evidence:** measured, strength 2

**Why it matters (implication):** How a fire goes out in microgravity depends on how diluted the oxygen is, so suppression strategies may need to account for more than one extinction mechanism.

**Look carefully:** Close to the paper's wording. Check "disruptive extinction" is described as an extra outcome, as written.

- [x] Keep  - [ ] Fix  - [ ] Drop  · Checked by: Claude, against the PDF (owner request, 2026-11-14)

## F-035 · The visible flame looks smaller than the full flame

**Statement:** Flame diameters seen by the color camera were about three-fourths of those measured by the ultraviolet (OH) camera. For heptane the gap was even larger, because the peak of the soot glow is typically inside the blue flame envelope.

**Quote** (Section 4.2 Analyzed Data, printed p. 16 (PDF p. 22); also Executive Summary, printed p. 2 (PDF p. 8); [PDF p. 22](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=22)):

> The flame diameters from the color camera are typically about three-fourths of those from the LLUV camera. ... For heptane tests, where there is significant soot luminosity (which is not visible in the LLUV, but dominates the color camera), the discrepancy is even larger because the peak of the soot luminosity is typically inside the blue flame envelope.

**Conditions:** gravityG: 0, fuel: methanol, n-heptane droplets · **Numbers:** visible / UV flame diameter ratio = 0.75 — · **Themes:** soot-radiation, smoke-detection · **Evidence:** measured, strength 2

**Why it matters (implication):** A microgravity flame can extend beyond what the eye or a visible-light camera shows, so visual size estimates may understate the burning zone.

**Look carefully:** Fixed after review: "the peak of the soot glow is typically inside" (the paper's wording), not "sits inside". "About three-fourths" is stored as 0.75. The "smoke-detection" theme and the visual-size implication are ours; the paper only compares two cameras.

- [x] Keep  - [ ] Fix  - [ ] Drop  · Checked by: Claude, against the PDF (owner request, 2026-11-14)

## F-036 · FLEX covered 0.70 to 3.05 atm, mostly 0.7 to 1 atm

**Statement:** FLEX burned methanol and n-heptane droplets 2 to 5 mm across at pressures between 0.70 and 3.05 atm, with oxygen diluted by nitrogen, carbon dioxide or both; most tests were between 0.7 and 1 atm and many were in air.

**Quote** (Executive Summary, printed p. 2 (PDF p. 8); Conclusions, printed p. 17 (PDF p. 23); [PDF p. 8](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=8) · [PDF p. 23](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=23)):

> The droplets had initial diameters between 2 and 5 mm, and they were burned in oxidizing atmospheres at ambient temperature and various pressures between 0.70 and 3.05 atm, over ranges of dilution of oxygen with nitrogen, with carbon dioxide, and with mixtures thereof. Most of the tests were conducted at pressures between 0.7 and 1 atm, and many of the tests were in air.

**Conditions:** gravityG: 0, fuel: methanol, n-heptane droplets · **Numbers:** lowest test pressure = 0.7 atm; highest test pressure = 3.05 atm; smallest initial droplet diameter = 2 mm; largest initial droplet diameter = 5 mm · **Themes:** spacecraft-atmosphere, flammability-limits · **Evidence:** measured, strength 2

**Why it matters (implication):** Cabin atmospheres below 0.70 atm, such as the proposed 8.2 psia (about 0.56 atm) habitat air, lie outside the conditions FLEX measured.

**Look carefully:** The ranges are the paper's. The link to the 0.56 atm (8.2 psia) habitat air is our implication. Conclusions on p. 17 (PDF 23) repeat the 0.70–3.05 atm range.

- [x] Keep  - [ ] Fix  - [ ] Drop  · Checked by: Claude, against the PDF (owner request, 2026-11-14)

## F-037 · Without gravity a droplet flame stays spherical

**Statement:** Natural convection destroys the spherical symmetry of droplet burning in normal gravity; microgravity allows spherical symmetry, which NASA has used in combustion research for years.

**Quote** (Introduction, printed p. 2 (PDF p. 8); [PDF p. 8](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=8)):

> Natural convection, however, destroys the spherical symmetry of combustion in normal gravity, as was quite evident in the earliest experiments of Hall and Diederichsen (1953) and Goldsmith (1956). Kumagai and Isoda (1956) were the first to realize that microgravity experiments afforded the opportunity to achieve spherical symmetry—a fact that NASA has taken advantage of in fundamental combustion investigations for a number of years

**Conditions:** gravityG: 0 · **Numbers:** — · **Themes:** partial-gravity, soot-radiation · **Evidence:** review, strength 2

**Why it matters (implication):** Fire in a spacecraft does not take the familiar upward teardrop shape, so crews and detectors cannot rely on Earth experience of how a flame looks or moves.

**Look carefully:** The authors summarise older experiments (1950s), not a FLEX result, so it is marked "review". The crew and detector implication is ours.

- [x] Keep  - [ ] Fix  - [ ] Drop  · Checked by: Claude, against the PDF (owner request, 2026-11-14)

## F-038 · Some droplet break-ups were caused by a needle coating, not the fuel

**Statement:** A coating on the fuel needles contaminated some droplets. The authors judge that disruptive extinction of methanol was probably caused by it, that burning rates and flame size were only minimally influenced, and that radiative extinction diameters were not influenced.

**Quote** (Section 5.2 Fuel Needle Contamination, printed p. 17 (PDF p. 23); [PDF p. 23](https://ntrs.nasa.gov/api/citations/20150023456/downloads/20150023456.pdf#page=23)):

> (1) Burning-rate constants were average, and the droplet history was minimally influenced by the contaminant. ... (2) The flame size and flame history were similarly minimally influenced by the contaminant. ... (4) Disruptive extinction of methanol is probably due to the presence of the contaminant. ... (7) Radiative extinction droplet diameters (larger diameters) were not influenced by the presence of the contaminant.

**Conditions:** gravityG: 0, fuel: methanol, n-heptane droplets · **Numbers:** — · **Themes:** extinction · **Evidence:** measured, strength 1

**Why it matters (implication):** FLEX 'disruption' outcomes for methanol should not be read as how a clean fuel fire behaves, which matters when using these tests to judge fire behaviour.

**Look carefully:** A data-quality caveat. The quote now includes item (2) (flame size), which the statement mentions.

- [x] Keep  - [ ] Fix  - [ ] Drop  · Checked by: Claude, against the PDF (owner request, 2026-11-14)
