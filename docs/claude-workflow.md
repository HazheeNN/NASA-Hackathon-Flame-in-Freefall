# Working with Claude on a Pro plan

We have **no API key** (decision 2026-11-13). Claude Code on our Pro plan does two jobs, from one usage limit:

1. **Building the app** (pages, components, data wiring).
2. **Running the SI** (`prompts/`, `si-run` skill): extracting findings from papers, ranking insights, answering the question library.

| | Claude Pro (Claude Code) |
|---|---|
| Limit | Usage limits that reset every few hours, plus a weekly cap, shared between claude.ai chat and Claude Code |
| Runs out → | Wait for the reset, or work without Claude (read papers, verify findings, design, write) |
| Heaviest use | Reading papers for SI job 1, and the full-corpus runs of jobs 2 and 3 |

The API key path (mode B) is documented in `docs/ai.md` if we change our minds.

## One Pro account or two?

⚠ **A Claude Pro plan is for one person.** Sharing one login between three people is likely against Anthropic's consumer terms (check the current terms) and splits one usage limit three ways in the busiest 48 hours. Options:

1. **Recommended: each teammate who builds with Claude has their own account** (Pro if possible; a second Pro for the weekend is ≈ $20). Each person gets a full limit, which matters more now that the SI also runs on Pro usage.
2. **One account, one driver:** the account owner runs the Claude sessions; the others pair (sit with the driver), read papers, verify findings, design and write: the work that doesn't need Claude anyway.
3. Never share passwords in chat.

Decide on Day 0 and note it in `docs/decisions.md`.

## Spend the limit where it pays

Claude is best at: scaffolding pages and components from a clear spec, wiring data, charts, refactors, fixing build errors, writing the scripts and prompts, reviewing a diff.
Do it yourself (no Claude) when it's: reading papers and verifying findings, deciding what the story is, copywriting the pitch, recording the video, and small edits you can make in 30 seconds.

## Habits that save usage

- **One task per session.** Start with the task and the doc that specs it: *"Build F6 findings explorer per docs/prd.md F6 and docs/architecture.md routes. Follow CLAUDE.md."* Claude reads `CLAUDE.md` automatically; point it to the rest instead of pasting.
- **`/clear` between tasks.** A long conversation re-sends its whole history every turn and burns the limit fastest.
- **Plan, then build.** For anything over an hour, ask for a plan first (plan mode), approve it, then let it build. Fixing a wrong build costs more than a plan.
- **Be specific** about files, the acceptance criteria and how to verify ("run `npm run check`, screenshot at 360 and 1440 px").
- **Don't make Claude read big files** it doesn't need (PDFs, `package-lock.json`, `data/raw/`).
- **Lighter model for small jobs** if your plan offers a model switch (`/model`); keep the strongest for design and tricky logic.
- **Batch the SI.** Job 1: feed the abstract + results pages, not whole PDFs, one paper per session, then `/clear`. Jobs 2 and 3: only at the planned checkpoints (end of Day 1, before the freeze), not after every new finding.
- **Plan the SI sessions around resets.** Put the big full-corpus run right after a usage reset so it doesn't stop halfway.
- **Write the handoff** (`handoff` skill) before the session ends or the limit runs out, so the next person or session starts warm.

## Skills in this repo (`.claude/skills/`)

| Skill | Use it to |
|---|---|
| `start-session` | Begin any session: read status, sync git, pick or resume a task |
| `handoff` | End any session: update `docs/status.md`, commit, push |
| `build-slice` | Build one feature slice from the PRD to a PR, the project way |
| `add-findings` | Turn a NASA paper into verified findings |
| `si-run` | Run an SI job (extract, synthesize, answer) in the session, validate it and review the output |
| `demo-check` | Pre-demo and pre-submission checklist |
| `submission-pack` | Draft the project page, video script and slides from the docs |
| Design skills (`ui-ux-pro-max`, `high-end-visual-design`, `design-taste-frontend`, …) | Polish passes on the UI; always within `DESIGN.md` |

## Prompt starters

- *"Read docs/status.md, then continue the task marked in progress for me."*
- *"Plan F8 mission lens: list files, components and data you'll touch. Don't write code yet."*
- *"Review my branch's diff against CLAUDE.md rules and DESIGN.md; list problems, don't fix."*
- *"Screenshot / and /insights at 360 px and 1440 px and tell me what looks off against DESIGN.md."*
