# How the three of us work

Three teammates, same role: everyone codes, designs, reads papers, writes and presents. That works if we split **work**, not **jobs**.

| Teammate | GitHub | Strongest at | Contact |
|---|---|---|---|
| Hazheen (repo owner) | @HazheeNN | | |
| Teammate 2 | | | |
| Teammate 3 | | | |

## Split work into vertical slices

A slice is one feature end to end: its data, its page, its polish, its screenshot. Whoever takes a slice owns it until it's merged. The work packages in `docs/plans/2026-11-hackathon.md` are already cut this way.

At any moment each of us holds **one** slice. The rough shape:
- one person on the **corpus** (reading papers, verifying findings): the most human work; needs little Claude;
- one on **SI + data plumbing** (SI jobs in Claude Code, insights, the Ask answers);
- one on **UI** (pages, charts, polish).

Rotate every half day so everyone knows every part (and anyone can present any part).

## Claiming and tracking

- The plan file lists every task. To take one, write your name next to it in `docs/status.md` › Now and push (or say so in the team chat). One owner per task.
- Optional: mirror the tasks as GitHub Issues (one per work package) and assign yourself.
- Blocked for more than 20 minutes? Say so. Someone swaps in or we cut the task.

## Git

- Branch per task: `<name>/<short-task>`, e.g. `sara/findings-explorer`.
- Pull `main` before you start and before you open a PR.
- Small PRs (aim for < 400 changed lines, data batches excepted). Use the PR template.
- **One teammate reviews and approves; then the author merges** once CI is green. Never push to `main` directly. During the last 2 hours: merges only after the whole team agrees.
- Conflicts in `data/findings.json`: add findings in separate PRs per experiment and take the next free IDs after pulling; if two PRs used the same IDs, the later one renumbers before merge.

## Rhythm

- **Stand-up every 3–4 hours, 10 minutes, standing:** done / next / blocked. Update `docs/status.md` right after.
- **Decisions:** if 2 of 3 agree, go. Time-box any debate to 5 minutes, then write it in `docs/decisions.md`.
- **Cut, don't slip:** at each check-in, if a Must is at risk, cut a Should first (cut lines are in the plan).
- **Sleep:** stagger it, so someone is always awake and nobody presents on zero sleep. The presenter sleeps most the night before.
- **Demo owner:** decide on Day 1 who presents; the other two run the laptop and handle Q&A on data and AI.

## Definition of done (every slice)

- [ ] Meets its acceptance criteria in `docs/prd.md`; status updated there.
- [ ] `npm run check` passes; `npm run data:validate` passes.
- [ ] Screenshots at 360 px and 1440 px attached to the PR.
- [ ] No uncited claims, no unverified data shown without its badge.
- [ ] `docs/status.md` updated.
