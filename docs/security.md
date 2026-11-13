# Security

Small surface: a static site plus one API route that calls Claude. The real risks are a leaked or drained API key, and a demo that breaks.

## Threats and what we do

| Risk | What we do | Status |
|---|---|---|
| API key committed to git | `.env*` git-ignored; `.claude/settings.json` blocks Claude from reading `.env*`; `scripts/security-scan.sh` checks the tree and history | ✅ |
| API key sent to the browser | Key only read in `src/lib/claude.ts` (`server-only`); never `NEXT_PUBLIC_` | ✅ |
| Someone drains the key through `/api/ask` | Spend limit in the Anthropic Console; per-IP rate limit; question ≤ 500 chars; `max_tokens` cap; `LIVE_SI=off` kill switch | ⏳ build with F7 |
| Prompt injection in the question ("ignore your rules…") | System prompt: answer only from the corpus, stay on topic; corpus text treated as data; no tools, no internet, no actions; the worst case is an off-topic answer | ⏳ build with F7 |
| Clickjacking, MIME sniffing, etc. | Security headers in `next.config.ts` | ✅ |
| Vulnerable dependencies | `npm audit` at 0 (minimatch pinned for lint tools via `overrides`) | ✅ |
| Personal data | None collected: no accounts, no analytics, questions not stored | ✅ |
| Content Security Policy | Not set yet; add a simple CSP before the final deploy if time allows | ⏳ optional |

## Owner actions

- [ ] Create the Anthropic API key in a Console workspace used only for this project; **set a monthly spend limit** (e.g. $50).
- [ ] Put the key only in your own `.env.local` and in Vercel. Share it with teammates through a password manager or Vercel, never in chat, email or a commit.
- [ ] After the event: rotate (delete) the key, or lower the limit, especially if the repo goes public.
- [ ] Before making the repo public: `scripts/security-scan.sh` (scans the full history too).

## Before the demo

```bash
scripts/security-scan.sh
npm audit
```
