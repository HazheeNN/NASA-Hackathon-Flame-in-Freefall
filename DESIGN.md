---
version: alpha
name: Flame in Freefall
description: An interactive flame lab and evidence dashboard that shows how fire behaves on Earth, in orbit, on the Moon and on Mars, built on verified NASA microgravity combustion data. It should feel like a NASA mission page (real photography, near-black and white, one accent, bold clean type), never like an official NASA site.
colors:
  primary: "#7FB2FF"
  primary-hover: "#A3C8FF"
  primary-soft: "#14223A"
  on-primary: "#05101F"
  ember: "#FFA24C"
  ember-soft: "#3A230F"
  on-ember: "#2A1404"
  background: "#08090B"
  surface: "#121418"
  surface-raised: "#1A1D23"
  on-surface: "#F3F5F8"
  muted: "#A3ACBA"
  line: "#2B3039"
  tested: "#5AA2FF"
  tested-soft: "#102440"
  untested: "#FF5C50"
  untested-soft: "#3D1512"
  earth: "#5CB0FF"
  iss: "#CFD8E3"
  moon: "#DCD8D0"
  mars: "#E5733F"
  on-world: "#08090B"
  risk-high: "#FF6B5E"
  risk-high-soft: "#3D1512"
  risk-medium: "#F5C451"
  risk-medium-soft: "#3A2E0E"
  risk-low: "#3DD68C"
  risk-low-soft: "#0E3324"
  verified: "#3DD68C"
  unverified: "#F5C451"
  focus: "#FFD166"
  on-focus: "#1A1300"
  series-1: "#5AA2FF"
  series-2: "#FFA24C"
  series-3: "#2EC4B6"
  series-4: "#A78BFA"
  series-5: "#A3E635"
  series-6: "#F472B6"
  on-series: "#08090B"
typography:
  display:
    fontFamily: Public Sans
    fontSize: 52px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.12em
  data-lg:
    fontFamily: DM Mono
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.1
    fontFeature: '"tnum" 1'
  data-sm:
    fontFamily: DM Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: '"tnum" 1'
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 72px
  gutter: 16px
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-raised:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  text-muted:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
  divider:
    backgroundColor: "{colors.line}"
    height: 1px
  button-primary:
    backgroundColor: "{colors.on-surface}"
    textColor: "{colors.background}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 12px 20px
    height: 44px
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 12px 20px
    height: 44px
  link:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
  link-hover:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary-hover}"
  chip-theme:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  chip-tested:
    backgroundColor: "{colors.tested-soft}"
    textColor: "{colors.tested}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  chip-untested:
    backgroundColor: "{colors.untested-soft}"
    textColor: "{colors.untested}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  chip-ember:
    backgroundColor: "{colors.ember-soft}"
    textColor: "{colors.ember}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  world-earth:
    backgroundColor: "{colors.earth}"
    textColor: "{colors.on-world}"
  world-iss:
    backgroundColor: "{colors.iss}"
    textColor: "{colors.on-world}"
  world-moon:
    backgroundColor: "{colors.moon}"
    textColor: "{colors.on-world}"
  world-mars:
    backgroundColor: "{colors.mars}"
    textColor: "{colors.on-world}"
  badge-risk-high:
    backgroundColor: "{colors.risk-high-soft}"
    textColor: "{colors.risk-high}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 2px 8px
  badge-risk-medium:
    backgroundColor: "{colors.risk-medium-soft}"
    textColor: "{colors.risk-medium}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 2px 8px
  badge-risk-low:
    backgroundColor: "{colors.risk-low-soft}"
    textColor: "{colors.risk-low}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 2px 8px
  badge-verified:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.verified}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 2px 8px
  badge-unverified:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.unverified}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 2px 8px
  citation-chip:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.primary}"
    typography: "{typography.data-sm}"
    rounded: "{rounded.sm}"
    padding: 2px 6px
  kpi-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.data-lg}"
    rounded: "{rounded.lg}"
    padding: 20px
  focus-ring:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.on-focus}"
  chart-series-1:
    backgroundColor: "{colors.series-1}"
    textColor: "{colors.on-series}"
  chart-series-2:
    backgroundColor: "{colors.series-2}"
    textColor: "{colors.on-series}"
  chart-series-3:
    backgroundColor: "{colors.series-3}"
    textColor: "{colors.on-series}"
  chart-series-4:
    backgroundColor: "{colors.series-4}"
    textColor: "{colors.on-series}"
  chart-series-5:
    backgroundColor: "{colors.series-5}"
    textColor: "{colors.on-series}"
  chart-series-6:
    backgroundColor: "{colors.series-6}"
    textColor: "{colors.on-series}"
---

## Overview

**Reference:** a NASA mission page (decision 2026-11-14): big real photography, near-black and white, bold clean type, generous space, one accent. Inspired by NASA's public **Horizon Design System** (its typefaces Public Sans and DM Mono). It must never look like an official NASA site: no NASA insignia or logotype, no copy of nasa.gov's header, and the "not affiliated with or endorsed by NASA" line in the footer.

- **The homepage is the Flame Lab:** pick conditions and a world, watch the flame change, read what NASA has (and hasn't) tested. Everything else is one click away.
- **Audience:** hackathon judges on a laptop or projector, then mission engineers. Calm, readable, honest.
- **Density:** low on the surface, detail on demand. One idea per panel.
- **One dark theme.** Real NASA photos are always darkened by a scrim so text stays readable.

## Colors

- **Neutrals carry the page:** `{colors.background}` → `{colors.surface}` → `{colors.surface-raised}`, text `{colors.on-surface}`, labels `{colors.muted}`, hairlines `{colors.line}`.
- **Primary `{colors.primary}`** for links, active navigation and focusable accents. The main button is white on black (`button-primary`), like NASA pages.
- **Tested `{colors.tested}` / untested `{colors.untested}`:** the honesty colours. Blue = NASA measured it (with the source); red = never tested or not verified yet. Always with a word ("Tested", "Never tested").
- **World colours** `{colors.earth}`, `{colors.iss}`, `{colors.moon}`, `{colors.mars}`: only for the world cards' subtle glow, the selected-world ring and world markers on charts.
- **Ember `{colors.ember}`** for Earth / 1 g comparisons. **Risk** colours only for insight risk levels. **Verified / unverified** for evidence status. **Focus** yellow only for the keyboard ring.
- Colours reach code only through the tokens in `src/app/globals.css` (ESLint fails on raw hex in class names).

## Typography

- **Public Sans** for everything written, **DM Mono** for numbers, units, IDs (`F-012`) and citations.
- `display` for the Flame Lab headline only; `headline-lg` page titles; `headline-md` panel titles; `body-lg` for lead text and AI summaries; `body-md` everywhere else; `label-md` uppercase for small labels (`.eyebrow`).
- Units always written with a thin space: `21 % O₂`, `101.3 kPa`, `0.38 g`.

## Layout

- Max content width 1440 px, 16 px gutters on phones, 40 px on desktops.
- Top bar: flame mark, name, navigation (Flame Lab, Gaps map, Insights, Formulas, Findings, Sources, About) and the Ask button (also Ctrl/⌘ K). Collapses to a menu below 1024 px.
- Flame Lab: controls | flame | NASA data side by side on wide screens, stacked on phones; the four world cards below (1 column on small phones, 2 on tablets, 4 on desktops).
- Every AI-written panel: answer first, then evidence (citation chips), then caveats.

## Elevation & Depth

- Depth from surface steps and photography, not shadows. One soft shadow on the Ask dialog.
- World cards glow softly in their world colour on hover and when selected (a blurred outer shadow, low opacity). Nothing pulses.

## Shapes

- `{rounded.lg}` cards, `{rounded.full}` buttons and chips, `{rounded.sm}` badges and citation chips.

## Components

- **World card:** the world's real NASA photo, darkened at the bottom; name, gravity, cabin air. Hover: soft glow in the world colour; selected: 2 px ring in the world colour.
- **Condition slider:** a track showing the NASA-tested range in `{colors.tested}` and untested in `{colors.untested}`, with the word under it.
- **Coverage chip:** `chip-tested` / `chip-untested`, always a word.
- **Confidence meter:** 4 short bars (findings, experiments, verified share, tested at this gravity) with words.
- **Cards, badges, citation chips** as in the front matter. Every AI fact ends with at least one citation chip.
- **Charts:** hand-drawn SVG; series tokens; a title stating the takeaway; a source line under it.

## Iconography

Lucide only, 20 px, stroke 1.75; same meaning, same icon:

| Meaning | Icon |
|---|---|
| Flame / Flame Lab | `flame` |
| Experiment | `flask-conical` |
| Finding | `file-text` |
| Insight (AI) | `sparkles` |
| Ask | `message-square-text` |
| Source / citation | `book-open` |
| Verified | `badge-check` |
| Unverified | `circle-alert` |
| Never tested | `circle-off` |
| Risk | `triangle-alert` |
| Gravity / world | `orbit` |
| Oxygen | `wind` |
| Pressure | `gauge` |
| Airflow | `fan` |
| Gaps map | `map` |
| Formula | `sigma` |
| Fire-only mode | `maximize-2` |

The flame-sphere mark is ours (`src/components/flame-mark.tsx`).

## Motion

- 150–250 ms ease-out for hovers and panels; 600 ms cross-fade when the world background changes.
- The flame animates continuously (WebGL); with `prefers-reduced-motion` it is drawn once and stays still.

## Do's and Don'ts

- **Do** put a source on every number; show untested and unverified in words.
- **Do** credit every NASA photo ("Image: NASA" + the page).
- **Don't** use the NASA logo or imply endorsement; don't copy nasa.gov's header.
- **Don't** show a simulated number: the flame is an illustration; numbers come only from verified data and NASA formulas inside their tested range.
- **Don't** use colour alone for meaning.
