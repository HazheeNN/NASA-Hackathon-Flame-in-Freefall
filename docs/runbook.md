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
npm run dev
```

   Open http://localhost:3000. No API key or other secrets are needed.
4. `npm run check` should pass.
5. Install Claude Code and sign in (`docs/claude-workflow.md`); open it in the repo folder and say "start session".

## Agent Reach (optional, each laptop, ≈ 5 min)

A read-only tool that lets Claude read things its built-in web tools can't, mainly YouTube transcripts of NASA talks (project rules: `web-research` skill). It installs on your laptop, never in the repo: the program goes through `uv`, and its settings and any logins live in `~/.agent-reach/`.

1. Install `uv` if `uv --version` fails (no admin password needed):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Install the pinned version (from GitHub only: the PyPI package with the same name is **not** this project):

```bash
uv tool install https://github.com/Panniantong/Agent-Reach/releases/download/v1.6.1/agent-reach.zip
```

3. Set it up (turns on the default channels and installs its Claude skill in your home folder):

```bash
agent-reach setup
```

4. Check it:

```bash
agent-reach doctor --text
```

Then in Claude Code: *"Use the web-research skill to find NASA talks on the Saffire experiments."* Don't add login channels (Twitter, Reddit, …) for this project. To remove it later, ask Claude to "uninstall Agent Reach" (it shows what it will delete first).

## Anthropic API key: not needed now

We run the SI in Claude Code (mode A, `docs/ai.md`). Only if we decide to switch to mode B: a Claude Pro subscription is not API access, so the owner would create a key at console.anthropic.com, add ≈ $10–20 of credit, **set a spend limit**, and add it to Vercel and `.env.local` as `ANTHROPIC_API_KEY` (`docs/security.md` › If we switch).

## NASA accounts (Day 0)

- **PSI** (psi.nasa.gov): register for a free account so we can download experiment data on Day 1.
- **NTRS** needs no account.

## Vercel (owner, once, ≈ 10 min)

1. vercel.com → sign in with GitHub → **Add New → Project** → import `NASA-Hackathon-Flame-in-Freefall`.
2. Framework: Next.js (auto). Build command and output: defaults.
3. Environment variables: none needed.
4. Deploy. Every push to `main` updates Production; every PR gets a Preview URL.
5. Put the Production URL in `CLAUDE.md`, `README.md` and `docs/submission.md`.

## Running the SI

Find papers:

```bash
npm run data:ntrs -- "Saffire flame spread"
```

Then, in a Claude Code session, use the `si-run` skill: say e.g. *"Run SI job 1 on data/raw/saffire-2019.pdf pages 5–9 for experiment saffire"*, or *"Run SI jobs 2 and 3 on the full corpus"*. Afterwards:

```bash
npm run data:validate
```

and follow the review checklists in `docs/data.md` and `docs/ai.md`.

## Demo day

1. Freeze: only fixes after the freeze time in the plan.
2. Production deploy is green and opens on a phone and the demo laptop.
3. Run the 3-minute demo twice on the live site, once on a local production build with Wi-Fi off.
4. Golden questions pass (`docs/ai.md`).
5. Demo laptop: charger, browser zoom 100 %, notifications off, tabs pre-opened, offline backup (local `npm run build && npm start`) and the demo video file.
6. Submit with ≥ 2 hours buffer (`docs/submission.md`).

## After the event

- Decide about making the repo public (`docs/security.md` › Owner actions).
