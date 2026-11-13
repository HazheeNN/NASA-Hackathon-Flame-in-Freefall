# Runbook

Setup and one-off steps, in the order you'll need them.

## Day 0: each teammate's laptop (≈ 20 min)

1. Install **Node 22+** and **git**; a GitHub account; VS Code or any editor; Claude Code (`docs/claude-workflow.md`).
2. Accept the GitHub invite to the repo (the owner adds you: Settings → Collaborators).
3. Clone and run:

```bash
git clone https://github.com/HazheeNN/NASA-Hackathon-Flame-in-Freefall.git
```

```bash
cd NASA-Hackathon-Flame-in-Freefall && npm ci
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

   Open http://localhost:3000. It works without an API key (Ask needs one).
4. Fill `ANTHROPIC_API_KEY` in `.env.local` when the owner shares it (password manager or Vercel, not chat).
5. `npm run check` should pass.

## Anthropic API key (owner, once)

A **Claude Pro subscription is not API access.** The app and the SI scripts need an API key, billed separately:
1. Sign in at console.anthropic.com → create a workspace for this project.
2. Add credits (≈ $20–40 covers the event, `docs/ai.md` › Cost) and **set a monthly spend limit**.
3. Create an API key → store it in a password manager → add it to Vercel and share it with the team there.
4. Check usage once per session on the Console's usage page.

## NASA accounts (Day 0)

- **PSI** (psi.nasa.gov): register for a free account so we can download experiment data on Day 1.
- **NTRS** needs no account.

## Vercel (owner, once, ≈ 10 min)

1. vercel.com → sign in with GitHub → **Add New → Project** → import `NASA-Hackathon-Flame-in-Freefall`.
2. Framework: Next.js (auto). Build command and output: defaults.
3. Environment variables: `ANTHROPIC_API_KEY` for Production and Preview. Optional: `CLAUDE_MODEL`, `LIVE_SI`.
4. Deploy. Every push to `main` updates Production; every PR gets a Preview URL.
5. Put the Production URL in `CLAUDE.md`, `README.md` and `docs/submission.md`.

## Running the SI

```bash
npm run data:ntrs -- "Saffire flame spread"
```

```bash
npm run si:extract -- saffire data/raw/paper.pdf "Exact title" https://ntrs.nasa.gov/citations/<id> 2019
```

```bash
npm run si:build
```

Each run prints its token use and cost. Then follow the review checklists in `docs/data.md` and `docs/ai.md`.

## Demo day

1. Freeze: only fixes after the freeze time in the plan.
2. Production deploy is green and opens on a phone and the demo laptop.
3. Run the 3-minute demo twice live, once with `LIVE_SI=off` (set it in Vercel → redeploy, or run locally).
4. Golden questions pass (`docs/ai.md`).
5. Demo laptop: charger, browser zoom 100 %, notifications off, tabs pre-opened, offline backup (local `npm run build && npm start` with `LIVE_SI=off`) and the demo video file.
6. Submit with ≥ 2 hours buffer (`docs/submission.md`).

## After the event

- Rotate or delete the API key; lower the spend limit.
- Decide about making the repo public (`docs/security.md` › Owner actions).
