# Independent second review (2026-11-14)

A fresh Claude agent, with none of the original reasoning, judged all 39 findings, 11 insights and 23 answers against their NASA sources (meaning, numbers, conditions, implication wording, evidence type). It changed no files. **This is a second AI reviewer, not a human check:** the human spot-check list (`2026-11-14-spot-check.md`) still stands.

## Result

| | Pass | Minor | Issue |
|---|---|---|---|
| Findings (39) | 26 | 12 | 1 (low severity) |
| Insights (11) | 4 | 7 | 0 |
| Answers (23) | 15 | 8 | 0 |

No citation pointed to an unrelated finding, and every Mars-gravity or 34 % O₂ claim was already marked as an extrapolation or gap, except F-028 below.

## What was fixed (each point re-checked against the source before changing it)

- **F-028** (issue): implication said "higher fire risk than either Earth or orbit"; the poster only compares lunar gravity with Earth. Now "than the same materials would on Earth".
- **F-032 / Q-17**: "after an electrical arc" was too definite. NASA: investigators "couldn't determine a specific source of ignition" but "found evidence of arcing in several wires". Wording and a second quote added.
- **F-018 / I-05**: the reviewer found stronger NASA wording; the mini-book p. 31 says recent BASS results "indicate that NASA-STD-6001 Test 1 is not conservative". Added as a quote; I-05 now cites it instead of overstating the drop-tower "might not".
- **F-014**: mini-book p. 31 confirms "local application of suppressant is not adequate"; added as a second quote.
- **F-025 / I-11**: candle oscillations "over one minute in extreme cases" (was "up to a minute": wrong direction).
- **F-026 / Q-16**: "lean" and "exist only in microgravity" were not in the source; now "premixed low-Lewis-number gas mixtures", title "were made in microgravity", implication softened.
- **F-011 / I-07 / Q-20**: smoke particles differ in size *from Earth flames* (not "a wide range of sizes"); SAME-2 sizes stated as pre-ignition smoke with "some much larger particles in still air".
- **F-016, F-019, F-020, F-022**: implications brought back to what the tests showed (oxygen-starved low-flow fires; a Cygnus-sized cabin; "may be" the bigger threat; overheating, not smouldering). **I-02 / Q-13** titles and lead softened to "may be the bigger threat" / "most likely"; "ten times" → "an order of magnitude".
- **I-01, I-06, Q-12**: extinction at very low flow now cites F-008 (F-017 only covers blowoff); an unsupported mechanism clause removed from I-01.
- **I-09, Q-10**: the half-heat-flux figure is now presented as a model result, with the slow-airflow condition.
- **Q-11**: the 34 % O₂ habitat figure now cites F-028 (its source) instead of F-013.
- **Q-23**: CO/CO₂ comparison attributed to Saffire VI.
- **F-015, F-027**: flow values removed from `conditions` (10 cm/s was a starting point, 30 cm/s a 1 g reference, not test conditions).
- **F-001**: evidence kind "review" (it rests on NASA's review book; F-033 is the primary FLEX statement, which says only "slightly lower than initially expected"). **F-030**: "review" (the abstract states the authors' concept, not measured results). **F-034** now points to the contamination caveat in F-038. **F-036** attributes the 8.2 psia figure to our atmosphere data.

All 66 quotes were re-matched word for word against their sources after the changes; insights and answers restamped.

## Worth knowing for the pitch

- Say "lower than expected" for FLEX oxygen limits, not "significantly lower than predicted" (the primary report says "slightly").
- Mir candles: the abstract says "as long as 45 minutes", the mini-book "over 45 minutes"; we use the abstract.
- The 2004 NASA-STD-6001 abstract also says a material passing Test 1 "would most likely not burn in a quiescent microgravity environment"; the point is ventilation, which our insights already make.
