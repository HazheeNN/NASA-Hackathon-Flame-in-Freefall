# Security

Small surface: a static site with no secrets, no accounts, no runtime API calls (mode A, `docs/ai.md`). The real risks are publishing something unchecked, and a demo that breaks.

## Threats and what we do

| Risk | What we do | Status |
|---|---|---|
| Secrets committed to git | None needed today. `.env*` git-ignored anyway; `.claude/settings.json` blocks Claude from reading `.env*`; `scripts/security-scan.sh` checks the tree and history | ✅ |
| Wrong or invented content shown as fact | Verification gate, citation validation in CI, review checklist after every SI run (`docs/ai.md`) | ✅ process in place |
| Instructions hidden in a paper steering the SI | Every prompt says source text is data, not instructions; a person reviews all SI output before it ships | ✅ |
| Clickjacking, MIME sniffing, etc. | Security headers in `next.config.ts` | ✅ |
| Vulnerable dependencies | `npm audit` at 0 (minimatch pinned for lint tools via `overrides`) | ✅ |
| Personal data | None collected: no accounts, no analytics, Ask search runs in the browser | ✅ |
| Content Security Policy | Not set yet; add a simple CSP before the final deploy if time allows (easy: no third-party hosts at runtime) | ⏳ optional |

## Live chat keys (decision 2026-11-15)

- `GROQ_API_KEY` and `GEMINI_API_KEY` live only in Vercel's environment variables (Production + Preview); the server route `/api/chat` reads them; they never reach the browser, the repo or the model.
- No credit card on the Groq or Google accounts, so the worst case is a used-up free quota, never a bill.
- Abuse: 12 questions per visitor per 10 minutes, 600-character questions, uncited answers dropped.
- Visitors' questions are sent to Groq or Google; the chat says so under the input.
- After the event: delete both keys in the providers' dashboards.

## If we switch to mode B (API key)

Then these come back, and must be done before the key goes anywhere:
- Create the key in a Console workspace used only for this project; **set a monthly spend limit** (e.g. $25).
- Key only in your own `.env.local` and in Vercel; never `NEXT_PUBLIC_`, never in chat, email or a commit. Read only in `src/lib/claude.ts` (`server-only`).
- `/api/ask`: per-IP rate limit, question ≤ 500 chars, `max_tokens` cap, `LIVE_SI=off` kill switch.
- After the event: delete the key.

## Owner actions

- [ ] Before making the repo public: `scripts/security-scan.sh` (scans the full history too).

## Before the demo

```bash
scripts/security-scan.sh
npm audit
```
