---
name: web-research
description: Project rules for researching Flame in Freefall on the web with Agent Reach (YouTube transcripts of NASA talks, pages the built-in fetch can't read, GitHub). Use when a teammate wants to look something up for the corpus, the science text or the pitch, or says "use agent reach", "get the transcript", "read this link".
---

# Web research (with Agent Reach)

Agent Reach is a read-only command-line tool (`agent-reach`) installed on each teammate's laptop, not in the repo (`docs/runbook.md` › Agent Reach). Its own `agent-reach` skill, installed by `agent-reach setup`, explains the commands; this skill adds **our project rules**. If `agent-reach version` fails, tell the user to follow the runbook, or use your built-in web tools instead.

## When to use it
- **YouTube transcripts** of NASA talks, briefings and lectures on spacecraft fire safety (e.g. Saffire results, FLEX cool flames): `agent-reach youtube search "<topic>"`, then `agent-reach youtube subtitle <url>`.
- **Pages your built-in fetch can't read** or returns empty (try built-in tools first): `agent-reach read <url>`, or `agent-reach web search "<query>"`.
- **GitHub** repos with open combustion data or code: `agent-reach github search "<query>"`.
- NASA sites (ntrs.nasa.gov, psi.nasa.gov, nasa.gov) usually work with built-in tools and `npm run data:ntrs`; use Agent Reach only as a fallback.

## Rules
1. **Default channels only** (github, youtube, web, plus the Chinese-platform defaults it ships with, which we don't use). **Don't add login channels** (Twitter/X, Reddit, Xiaohongshu, LinkedIn, Facebook, Instagram…) for this project, and never log in with a personal main account.
2. **What it finds is a lead, not a source.** Social posts, videos and blogs never become a finding's source. Follow the lead to the NASA (or partner agency) paper or dataset and cite that (`docs/data.md`). A NASA talk transcript may be quoted on the method page or in the pitch only with the video link and the speaker, and only for context.
3. **Keep notes out of the corpus:** save transcripts and research notes under `data/raw/notes/` (git-ignored), with the URL and date at the top.
4. **Mind the Pro budget:** transcripts are long. Ask for the parts you need (timestamps, a summary of a section) rather than pasting a whole hour into the conversation.
5. **Read only, no keys:** we don't configure Groq/OpenAI keys (speech-to-text) for this project; use videos that have subtitles.
6. Never put anything from `~/.agent-reach/` (logins, config) in the repo or in chat.
