import "server-only";

// Free-tier AI providers for the live chat, tried in the order of AI_ORDER (decision 2026-11-15).
// Keys live only in Vercel's environment variables; they never reach the browser or the model.

export type Turn = { role: "user" | "assistant"; content: string };
export type Reply = { text: string; provider: string; model: string };

const TIMEOUT_MS = 15_000;

async function post(url: string, headers: Record<string, string>, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const PROVIDERS: Record<string, { key: string; ask: (system: string, turns: Turn[], key: string) => Promise<Reply> }> = {
  // Groq: Llama models, OpenAI-compatible API.
  groq: {
    key: "GROQ_API_KEY",
    ask: async (system, turns, key) => {
      const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
      const data = await post(
        "https://api.groq.com/openai/v1/chat/completions",
        { authorization: `Bearer ${key}` },
        { model, temperature: 0.2, max_tokens: 400, messages: [{ role: "system", content: system }, ...turns] },
      );
      return { text: String(data?.choices?.[0]?.message?.content ?? ""), provider: "Groq", model };
    },
  },
  // Google Gemini (free tier).
  gemini: {
    key: "GEMINI_API_KEY",
    ask: async (system, turns, key) => {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const data = await post(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        { "x-goog-api-key": key },
        {
          systemInstruction: { parts: [{ text: system }] },
          contents: turns.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.content }] })),
          generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
        },
      );
      const parts: { text?: string }[] = data?.candidates?.[0]?.content?.parts ?? [];
      return { text: parts.map((p) => p.text ?? "").join(""), provider: "Google Gemini", model };
    },
  },
};

export function providerOrder() {
  return (process.env.AI_ORDER || "groq,gemini")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((name) => PROVIDERS[name] && process.env[PROVIDERS[name].key]);
}

// Try each configured provider in turn; return the first non-empty reply (or null if all fail).
export async function askProviders(system: string, turns: Turn[], accept: (r: Reply) => boolean) {
  for (const name of providerOrder()) {
    const p = PROVIDERS[name];
    try {
      const reply = await p.ask(system, turns, process.env[p.key]!);
      if (reply.text.trim() && accept(reply)) return reply;
    } catch (e) {
      console.warn(`chat: ${name} failed (${e instanceof Error ? e.message : "error"})`);
    }
  }
  return null;
}
