// Picking a current model when the configured name has been retired (providers rename and retire
// free models every few months). Pure functions, tested in tests/chat.test.ts.

const NOT_CHAT = /whisper|tts|speech|audio|guard|embed|vision|image|imagen|veo|live|aqa|robotics|computer-use|transcri|moderation|compound|native-audio/i;

// Groq (OpenAI-style /models list), best first: Meta's Llama (larger first), then large open
// models; small "instant" models last.
export function rankGroqModels(ids: string[]): string[] {
  const chat = ids.filter((id) => !NOT_CHAT.test(id));
  const order: RegExp[] = [/llama.*(maverick|70b|405b)/i, /llama.*scout/i, /gpt-oss-120b/i, /llama/i, /kimi|qwen|gpt-oss|deepseek|mistral|gemma/i, /./];
  const out: string[] = [];
  for (const re of order) {
    for (const id of chat.filter((x) => re.test(x)).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))) if (!out.includes(id)) out.push(id);
  }
  return out;
}
export const pickGroqModel = (ids: string[]) => rankGroqModels(ids)[0] ?? null;

// Gemini (/v1beta/models), best first: stable Flash that supports generateContent, newest first.
export function rankGeminiModels(models: { name: string; supportedGenerationMethods?: string[] }[]): string[] {
  const out: string[] = [];
  let rest = [...models];
  for (let i = 0; i < 6; i++) {
    const best = pickGeminiModel(rest);
    if (!best) break;
    out.push(best);
    rest = rest.filter((m) => m.name.replace(/^models\//, "") !== best);
  }
  return out;
}

export function pickGeminiModel(models: { name: string; supportedGenerationMethods?: string[] }[]): string | null {
  const usable = models
    .filter((m) => (m.supportedGenerationMethods ?? ["generateContent"]).includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""))
    .filter((n) => /gemini/i.test(n) && !NOT_CHAT.test(n));
  const version = (n: string) => Number(n.match(/gemini-(\d+(?:\.\d+)?)/)?.[1] ?? 0);
  const newest = (xs: string[]) => xs.sort((a, b) => version(b) - version(a) || a.length - b.length)[0];
  const stable = (n: string) => !/preview|exp|lite|tuning|-\d{3}$|thinking/i.test(n);
  return (
    usable.find((n) => n === "gemini-flash-latest") ??
    newest(usable.filter((n) => /flash/i.test(n) && stable(n))) ??
    newest(usable.filter((n) => /flash/i.test(n))) ??
    newest(usable.filter(stable)) ??
    usable[0] ??
    null
  );
}
