# Flame in Freefall

**AI-powered fire safety insights from NASA microgravity combustion research.** Our entry for the NASA Space Apps Challenge "Flame in Freefall".

In microgravity, fire doesn't rise: a candle flame becomes a dim blue sphere, flames feed on the ventilation airflow, and some burn invisibly as "cool flames". NASA has studied this for decades, from drop towers to the International Space Station to full-scale fires inside empty cargo ships. Flame in Freefall reads that research, ranks the fire safety insights that matter most for the Moon and Mars, and answers questions, with a NASA source behind every claim.

**Live:** _coming soon_ · **Method and sources:** `/sources` in the app

## How it works

1. **Corpus:** findings from NASA experiments (FLEX, ACME, BASS, SoFIE, Saffire, …), each with test conditions, measurements and a cited source, checked by a person.
2. **SI layer (Claude by Anthropic):** extracts findings from papers, links them across experiments into ranked insights using a published rubric (safety relevance, severity, evidence, actionability), and powers a cited Q&A advisor.
3. **Dashboard:** overview, ranked insights, findings explorer, mission lens (ISS, Moon, Mars transit, Mars surface) with evidence gaps.

## Run locally

```bash
npm ci
cp .env.example .env.local   # add ANTHROPIC_API_KEY for the Ask feature; never commit it
npm run dev
```

```bash
npm run check   # typecheck, lint, tests, build
```

## For the team (and Claude)

Start with `CLAUDE.md`, then `docs/status.md`. Everything else is linked from there.

## Credits

Built from public NASA data (NASA Technical Reports Server, Physical Sciences Informatics). Not affiliated with or endorsed by NASA.
