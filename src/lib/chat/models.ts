// Picking a current model when the configured name has been retired (providers rename and retire
// free models every few months). Pure functions, tested in tests/chat.test.ts.

const NOT_CHAT = /whisper|tts|speech|audio|guard|embed|vision|image|imagen|veo|live|aqa|robotics|computer-use|transcri|moderation|compound|native-audio/i;

// Groq (OpenAI-style /models list): prefer Meta's Llama, larger first; else a large open model.
export function pickGroqModel(ids: string[]): string | null {
  const chat = ids.filter((id) => !NOT_CHAT.test(id));
  const order: RegExp[] = [/llama.*(maverick|70b|405b)/i, /llama.*scout/i, /llama/i, /gpt-oss-120b/i, /qwen|kimi|gpt-oss|deepseek|mistral|gemma/i];
  for (const re of order) {
    const hit = chat.filter((id) => re.test(id)).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0];
    if (hit) return hit;
  }
  return chat[0] ?? null;
}

// Gemini (/v1beta/models): a stable Flash model that supports generateContent, newest version first.
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
