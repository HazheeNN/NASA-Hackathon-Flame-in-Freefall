#!/usr/bin/env bash
# Usage:
#   security-scan.sh            # secrets in the working tree + full git history, .gitignore check
#   security-scan.sh skills [dir]  # suspicious content in skills/plugins/agents (default: .claude)
# Prints findings; exit 1 if anything needs a look. Findings are leads, not verdicts: read each one.
set -u
found=0
hit() { echo "!! $1"; found=1; }

SECRET_RE='(\bsk-(ant-|proj-)?[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{40,}|xox[baprs]-[A-Za-z0-9-]{10,}|sk_live_[A-Za-z0-9]{20,}|rk_live_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{35}|-----BEGIN [A-Z ]*PRIVATE KEY-----|eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|postgres(ql)?://[^:/ ]+:[^@/ <\[]{6,}@)'

scan_secrets() {
  echo "== Working tree (tracked + untracked, excluding node_modules/.next/.git)"
  if git rev-parse --git-dir >/dev/null 2>&1; then
    files=$(git ls-files -co --exclude-standard)
  else
    files=$(find . -type f -not -path '*/node_modules/*' -not -path '*/.next/*' -not -path '*/.git/*')
  fi
  [ -n "$files" ] && echo "$files" | tr '\n' '\0' | xargs -0 grep -nIE "$SECRET_RE" 2>/dev/null \
    | grep -vE '\.env\.example|security-scan\.sh' | head -50 | while read -r l; do echo "   $l"; done \
    && [ -n "$(echo "$files" | tr '\n' '\0' | xargs -0 grep -lIE "$SECRET_RE" 2>/dev/null | grep -vE '\.env\.example|security-scan\.sh')" ] && hit "possible secrets in the files above"

  if git rev-parse --git-dir >/dev/null 2>&1; then
    echo "== Git history (all commits)"
    h=$(git log --all -p --no-color 2>/dev/null | grep -nE "^\+.*$SECRET_RE" | head -20)
    [ -n "$h" ] && { echo "$h" | sed 's/^/   /'; hit "possible secrets in history: rotate the key, then rewrite history only with the owner's OK"; }
    echo "== .env files ever committed"
    e=$(git log --all --name-only --format= 2>/dev/null | grep -E '(^|/)\.env' | grep -v '\.env\.example' | sort -u)
    [ -n "$e" ] && { echo "$e" | sed 's/^/   /'; hit ".env file(s) were committed at some point"; }
    echo "== .gitignore"
    for p in .env .env.local .env.test; do
      git check-ignore -q "$p" || hit "$p is not ignored by .gitignore"
    done
  fi
}

scan_skills() {
  dir="${1:-.claude}"
  echo "== Skills/plugins/agents under $dir"
  [ -d "$dir" ] || { echo "   (no $dir)"; return; }
  # Code and instructions only; bundled data files (csv) are skipped.
  inc=(--include='*.md' --include='*.sh' --include='*.py' --include='*.js' --include='*.mjs' --include='*.ts' --include='*.json' --include='*.yaml' --include='*.yml')
  r=$(grep -rn "${inc[@]}" -P '[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{2064}\x{2066}-\x{2069}\x{FEFF}]' "$dir" 2>/dev/null | head)
  [ -n "$r" ] && { echo "$r" | sed 's/^/   /'; hit "zero-width or bidi control characters (hidden text)"; }
  r=$(grep -rn "${inc[@]}" -E '<!--.*(ignore|instruction|system|assistant|do not tell|secret|curl|token)' -i "$dir" 2>/dev/null | head)
  [ -n "$r" ] && { echo "$r" | sed 's/^/   /'; hit "HTML comments that read like instructions"; }
  r=$(grep -rn "${inc[@]}" -E '\b(curl|wget)\b|\bnc +-|base64 +(-d|--decode)|\beval *\(|\bexec *\(|child_process|Invoke-WebRequest|\| *(ba)?sh\b' "$dir" 2>/dev/null | head -20)
  [ -n "$r" ] && { echo "$r" | sed 's/^/   /'; hit "network/exec commands: check each is expected"; }
  r=$(grep -rn "${inc[@]}" -E '^allowed-tools:.*Bash' "$dir" 2>/dev/null | head)
  [ -n "$r" ] && { echo "$r" | sed 's/^/   /'; hit "skills pre-approving Bash"; }
  r=$(grep -rn "${inc[@]}" -E '"(SessionStart|Setup|PreToolUse|PostToolUse|UserPromptSubmit)"' "$dir" 2>/dev/null | head)
  [ -n "$r" ] && { echo "$r" | sed 's/^/   /'; hit "hooks that run automatically: read the commands"; }
  r=$(grep -rn "${inc[@]}" -E '(~/\.ssh|~/\.aws|id_rsa|ANTHROPIC_API_KEY|(cat|curl|scp)[^|]*\.env)' "$dir" 2>/dev/null | grep -vE '"(Read|Edit|Write|Bash)\(' | head)
  [ -n "$r" ] && { echo "$r" | sed 's/^/   /'; hit "references to credentials locations"; }
}

case "${1:-}" in
  skills) scan_skills "${2:-.claude}" ;;
  *) scan_secrets ;;
esac
[ $found -eq 0 ] && echo "OK: nothing found" || { echo "Review the findings above."; exit 1; }
