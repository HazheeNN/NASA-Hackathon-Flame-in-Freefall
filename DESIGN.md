---
version: alpha
name: Flame in Freefall
description: An interactive, AI-powered dashboard that summarizes, ranks and interprets NASA microgravity combustion findings into fire safety insights for crewed missions. It should feel like a mission-control console reading a NASA technical report, lit by the blue sphere of a flame burning in microgravity.
colors:
  primary: "#5B9BFF"
  primary-hover: "#7DB0FF"
  primary-soft: "#12264A"
  on-primary: "#04122B"
  ember: "#FF8A3D"
  ember-soft: "#3A1E0C"
  on-ember: "#2A1102"
  background: "#070B14"
  surface: "#0E1524"
  surface-raised: "#141D30"
  on-surface: "#E6ECF5"
  muted: "#93A1B8"
  line: "#22304A"
  risk-high: "#FF6B6B"
  risk-high-soft: "#3A1416"
  risk-medium: "#F5C451"
  risk-medium-soft: "#3A2E0E"
  risk-low: "#3DD68C"
  risk-low-soft: "#0E3324"
  verified: "#3DD68C"
  unverified: "#F5C451"
  focus: "#FFD166"
  on-focus: "#1A1300"
  series-1: "#5B9BFF"
  series-2: "#FF8A3D"
  series-3: "#2EC4B6"
  series-4: "#A78BFA"
  series-5: "#A3E635"
  series-6: "#F472B6"
  on-series: "#070B14"
typography:
  display:
    fontFamily: IBM Plex Sans
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.04em
  data-lg:
    fontFamily: IBM Plex Mono
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.1
    fontFeature: '"tnum" 1'
  data-sm:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: '"tnum" 1'
rounded:
  none: 0px
  sm: 6px
  md: 10px
  lg: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
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
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px 18px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px 18px
    height: 44px
  chip-theme:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  chip-ember:
    backgroundColor: "{colors.ember-soft}"
    textColor: "{colors.ember}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  button-ember:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.on-ember}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px 18px
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

**Reference:** a mission-control console in the middle of reading a NASA technical report. The room is dark, the data is bright, and every number has a source next to it. The one image people remember is **the blue flame sphere**: without gravity, hot gas does not rise, so a candle flame becomes a dim blue ball instead of a yellow teardrop. That sphere is our brand. Use it as the logo mark, the hero visual and the loading state.

- **Audience:** hackathon judges (on a laptop or a projector, 3–5 minutes each), then mission engineers and crew-safety people who want answers they can trust.
- **Mood:** calm, precise, credible. Closer to a flight-data display than a startup landing page. The excitement comes from the science and the data, not from decoration.
- **Density:** medium. One clear idea per panel, numbers large, a source on everything.
- **Device:** wide desktop first (demos and judging), and it must still work on a 360 px phone and a tablet. Use the screen fully: card grids (1 column on phones, 2 on tablets, 3 on wide desktops), and panels side by side where they fit.
- **One theme: dark.** No light mode in hackathon scope (`docs/decisions.md`). Check it on a projector-like setting (brightness down) before the demo.

## Colors

- **Primary `{colors.primary}`, microgravity-flame blue.** Main actions, active navigation, links, the flame mark, and the "microgravity" series in charts. `{colors.primary-soft}` is the quiet fill behind chips and secondary buttons.
- **Ember `{colors.ember}`, normal-gravity flame orange.** Anything about fire on Earth (1 g) compared with microgravity, and calls to attention that are not risk levels. Never use it for the risk scale.
- **Background `{colors.background}` → surface `{colors.surface}` → raised `{colors.surface-raised}`.** Three steps of deep space. Panels sit on the background; popovers, tooltips and selected cards sit on raised. `{colors.line}` is for hairline borders and dividers only.
- **Text:** `{colors.on-surface}` for content, `{colors.muted}` for labels, units, captions and metadata. Never put muted text on raised surfaces below 13 px.
- **Risk scale:** `{colors.risk-high}`, `{colors.risk-medium}`, `{colors.risk-low}`, each with a `-soft` fill. Only for the fire-risk rating of an insight or scenario. **Always a word plus the colour** ("High risk"), never colour alone.
- **Evidence status:** `{colors.verified}` (a person checked the finding against its NASA source) and `{colors.unverified}` (extracted, not yet checked). Always a word and an icon too.
- **Focus `{colors.focus}`:** the 2 px keyboard focus ring. Nothing else is this yellow.
- **Chart series** `{colors.series-1}` … `{colors.series-6}`, in that order. Series 1 is always microgravity, series 2 always normal gravity (1 g) when both appear. No more than 6 series in a chart; group the rest as "Other" in `{colors.muted}`.
- Colours reach code only through the tokens in `src/app/globals.css`, which mirrors this file. No raw hex in components (ESLint fails on `bg-[#…]`).

## Typography

- **IBM Plex Sans** for everything written, **IBM Plex Mono** for numbers, units, IDs (`F-012`) and citations. The pairing reads as "engineering document", and Plex was designed for exactly this kind of technical interface.
- `display` only for the hero line on the overview; `headline-lg` for page titles; `headline-md` for panel titles; `body-lg` for AI summaries (people read them, so give them room); `body-md` everywhere else; `body-sm` for captions and footnotes; `label-md` uppercase for small labels above values and for chips.
- `data-lg` for KPI numbers, `data-sm` for table cells, axis labels and citation chips. Tabular figures always, so columns of numbers line up.
- Units always written, with a thin space, in muted: `21 % O₂`, `101.3 kPa`, `0.38 g`. Use the real subscripts (O₂, CO₂).

## Layout

- Max content width 1440 px, centred, with `{spacing.gutter}` side gutters on phones and 40 px on desktops.
- App shell: a slim top bar (flame mark, product name, main navigation, the "Ask" button). On phones, the navigation collapses into a menu button.
- 8 px spacing grid (`{spacing.sm}`). Panels are separated by `{spacing.lg}`, sections by `{spacing.2xl}`.
- Grids: 1 column under 640 px, 2 from 640 px, 3 from 1200 px. A list–detail view only splits once something is picked.
- Every AI-written panel follows the same order: **answer first, then evidence (citation chips), then caveats.** Judges should be able to read just the first line.

## Elevation & Depth

- Depth comes from surface steps (background → surface → raised), not shadows. One soft shadow is allowed on popovers and the Ask panel.
- A single faint radial glow of `{colors.primary}` behind the hero flame sphere. Nowhere else.
- No glassmorphism and no blur effects behind text.

## Shapes

- `{rounded.lg}` for cards and panels, `{rounded.md}` for buttons and inputs, `{rounded.sm}` for badges and citation chips, `{rounded.full}` for theme chips and the flame mark.
- Circles carry meaning here (the flame sphere). Use them for the mark, scatter points and status dots, not as decoration.

## Components

- **Cards** (`card`, `card-raised`): title (`headline-md`), one-line answer, then content. Click target is the whole card when it opens something.
- **KPI tiles** (`kpi-tile`): a mono number, a label above it in `label-md`, and an optional caption below in muted. Max 4 in a row.
- **Buttons:** `button-primary` for the one main action of a view, `button-secondary` for the rest, `button-ember` only for "compare with 1 g" style actions. Minimum height 44 px.
- **Chips:** `chip-theme` for fire-science themes (ignition, spread, extinction…), `chip-ember` for 1 g / Earth comparisons.
- **Badges:** `badge-risk-*` for risk level and `badge-verified` / `badge-unverified` for evidence status. Word plus icon plus colour, always.
- **Citation chip** (`citation-chip`): mono `F-012` style ID that opens the finding with its NASA source link. Every AI sentence that states a fact ends with at least one.
- **Charts:** the series tokens (`chart-series-1` … `chart-series-6`), hairline gridlines in `{colors.line}`, axis labels in `data-sm` muted, a short title that states the takeaway ("Flames spread slower in microgravity, until the airflow picks up"), and a source line under every chart.
- **Focus ring** (`focus-ring`): 2 px `{colors.focus}` outline with 2 px offset on every interactive element.

## Iconography

Lucide only, 20 px, stroke 1.75. The same meaning always uses the same icon:

| Meaning | Icon |
|---|---|
| Flame / combustion | `flame` |
| Experiment / program | `flask-conical` |
| Finding | `file-text` |
| Insight (AI) | `sparkles` |
| Ask (question library) | `message-square-text` |
| Source / citation | `book-open` |
| Verified | `badge-check` |
| Unverified | `circle-alert` |
| Risk | `triangle-alert` |
| Mission / scenario | `rocket` |
| Gravity level | `orbit` |
| Oxygen | `wind` |
| Filter | `sliders-horizontal` |

The flame-sphere mark is ours (`src/components/flame-mark.tsx`). **Never use the NASA insignia ("meatball") or logotype ("worm")**: NASA does not allow them on third-party projects.

## Motion

- Purposeful and short: 150–250 ms ease-out for hovers, panels and filters.
- One signature motion: the flame sphere gently "breathes" (scale 1 → 1.04, 4 s loop) on the hero and while the AI is thinking.
- Streaming AI text appears as it arrives; no fake typewriter effect.
- Respect `prefers-reduced-motion`: switch off the breathing and transitions.

## Do's and Don'ts

- **Do** put a source on every number and every AI claim. Credibility is our design language.
- **Do** say plainly when something is unverified or uncertain, in words.
- **Do** show microgravity next to 1 g whenever possible: the contrast is the story.
- **Don't** use stock space photos, star-field wallpapers, neon gradients or "AI" sparkle overload. One sparkles icon marks AI content; that's it.
- **Don't** use colour alone to carry meaning (risk, status, series): add words, icons or labels.
- **Don't** use the NASA logo or imply NASA endorses the project.
- **Don't** add a light theme, extra fonts or a component library during the hackathon.
