// Pure helpers for the live chat (tested in tests/chat.test.ts). No secrets, no network.

// Citations: findings [F-012] and NASA formulas [FX-01], alone or in lists.
const ID = "(?:F-\\d{3}|FX-\\d{2})";
const CITE = new RegExp(`\\s*\\[(${ID}(?:\\s*,\\s*${ID})*)\\]`, "g");
export const NO_DATA = "Our verified NASA data doesn't cover that.";

// Keep only citations to findings the model was actually given; drop brackets left empty.
// Returns the cleaned text and the IDs that survived.
export function cleanCitations(text: string, allowed: Set<string>) {
  const kept = new Set<string>();
  const cleaned = text.replace(CITE, (_m, ids: string) => {
    const ok = ids.split(/\s*,\s*/).filter((id) => allowed.has(id));
    ok.forEach((id) => kept.add(id));
    return ok.length ? ` [${ok.join(", ")}]` : "";
  });
  return { text: cleaned.trim(), ids: [...kept] };
}

// A fire-science answer is usable if it cites at least one real finding or formula, or honestly
// says the data doesn't cover the question / declines an off-topic one.
export function isGrounded(text: string, ids: string[]) {
  if (ids.length > 0) return true;
  const t = text.toLowerCase();
  return ["doesn't cover", "does not cover", "only help with", "only answer questions about"].some((p) => t.includes(p));
}

// Questions about the project itself (what the site is, what the data covers, where it comes
// from, how it was checked, the formulas): answered from the ABOUT section, which needs no
// finding ID because it states facts about our site and data, not fire science.
const ABOUT_Q =
  /\b(project|site|website|app|tool|cover|covers|covered|coverage|what can you|help me|how does (this|it|the site) work|who (made|built|are you)|what are you|team|source|sources|reference|references|cite|citation|dataset|data set|datasets|findings|experiments?|formulas?|equations?|verified|verify|verification|checked|tested|range|ranges|where .*(from|come)|how do you know|hello|hi|hey|thanks|thank you)\b/i;
export const isAboutQuestion = (question: string) => ABOUT_Q.test(question);

const STOP = new Set(
  "a an and are as at be by can could do does for from has have how i if in into is it its me my of on or our should than that the their them there these this those to was we what when where which who why will with would you your about fire fires flame flames".split(" "),
);
export const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/o₂/g, "o2")
    .split(/[^a-z0-9.%-]+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

// Rank documents by how many of the question's words they contain (small corpus: no index needed).
export function rank<T>(items: T[], text: (t: T) => string, query: string) {
  const q = new Set(words(query));
  return items
    .map((item) => {
      const hay = new Set(words(text(item)));
      let score = 0;
      q.forEach((w) => hay.has(w) && score++);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);
}

// Per-visitor limit so one person can't use up the free quotas (in memory, per server instance).
const hits = new Map<string, number[]>();
export function allow(key: string, max = 12, windowMs = 10 * 60_000, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}
