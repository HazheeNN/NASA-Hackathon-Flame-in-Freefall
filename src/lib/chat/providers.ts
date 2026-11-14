import "server-only";
import { pickGeminiModel, pickGroqModel } from "./models";

// Free-tier AI providers for the live chat, tried in the order of AI_ORDER (decision 2026-11-15).
// Keys live only in Vercel's environment variables; they never reach the browser or the model.

export type Turn = { role: "user" | "assistant"; content: string };
export type Reply = { text: string; provider: string; model: string };

const TIMEOUT_MS = 15_000;

class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP ${status}`);
  }
}

async function call(url: string, headers: Record<string, string>, body?: unknown) {
  const res = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new HttpError(res.status);
  return res.json();
}

type Provider = {
  key: string;
  label: string;
  defaultModel: string;
  envModel: string;
  // Ask the provider which models it offers now and pick one (used when a model name is retired).
  discover: (key: string) => Promise<string | null>;
  chat: (model: string, system: string, turns: Turn[], key: string) => Promise<string>;
};

const GROQ = "https://api.groq.com/openai/v1";
const GEMINI = "https://generativelanguage.googleapis.com/v1beta";

const PROVIDERS: Record<string, Provider> = {
  // Groq: Meta's Llama and other open models, OpenAI-compatible API.
  groq: {
    key: "GROQ_API_KEY",
    label: "Groq",
    envModel: "GROQ_MODEL",
    defaultModel: "openai/gpt-oss-120b",
    discover: async (key) => {
      const data = await call(`${GROQ}/models`, { authorization: `Bearer ${key}` });
      const ids: string[] = (data?.data ?? []).filter((m: { active?: boolean }) => m.active !== false).map((m: { id: string }) => m.id);
      return pickGroqModel(ids);
    },
    chat: async (model, system, turns, key) => {
      const data = await call(
        `${GROQ}/chat/completions`,
        { authorization: `Bearer ${key}` },
        { model, temperature: 0.2, max_tokens: 500, messages: [{ role: "system", content: system }, ...turns] },
      );
      return String(data?.choices?.[0]?.message?.content ?? "");
    },
  },
  // Google Gemini (free tier).
  gemini: {
    key: "GEMINI_API_KEY",
    label: "Google Gemini",
    envModel: "GEMINI_MODEL",
    defaultModel: "gemini-flash-latest",
    discover: async (key) => {
      const data = await call(`${GEMINI}/models?pageSize=1000`, { "x-goog-api-key": key });
      return pickGeminiModel(data?.models ?? []);
    },
    chat: async (model, system, turns, key) => {
      const data = await call(
        `${GEMINI}/models/${encodeURIComponent(model)}:generateContent`,
        { "x-goog-api-key": key },
        {
          systemInstruction: { parts: [{ text: system }] },
          contents: turns.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.content }] })),
          generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
        },
      );
      const parts: { text?: string; thought?: boolean }[] = data?.candidates?.[0]?.content?.parts ?? [];
      return parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("");
    },
  },
};

// The model that worked last, per provider (kept while this server instance lives).
const working = new Map<string, string>();
export const forgetModels = () => working.clear(); // tests

// Which model to use: a GROQ_MODEL / GEMINI_MODEL setting if present; otherwise ask the
// provider which models it offers now (once per server instance) and pick one; the built-in
// default is only a last guess. If the provider says the model doesn't exist (404, or 400 for an
// unknown name), look again and retry once.
async function ask(name: string, p: Provider, system: string, turns: Turn[], key: string): Promise<Reply> {
  let model = working.get(name) || process.env[p.envModel];
  if (!model) model = (await p.discover(key).catch(() => null)) ?? p.defaultModel;
  try {
    const text = await p.chat(model, system, turns, key);
    working.set(name, model);
    return { text, provider: p.label, model };
  } catch (e) {
    if (!(e instanceof HttpError) || (e.status !== 404 && e.status !== 400)) throw e;
    working.delete(name);
    const found = await p.discover(key).catch(() => null);
    if (!found || found === model) throw new Error(`HTTP ${e.status} (model ${model}; no other model found)`);
    const text = await p.chat(found, system, turns, key);
    working.set(name, found);
    return { text, provider: p.label, model: found };
  }
}

const configured = () =>
  (process.env.AI_ORDER || "groq,gemini")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export function providerOrder() {
  return configured().filter((name) => PROVIDERS[name] && process.env[PROVIDERS[name].key]);
}

// Try each configured provider in turn; return the first non-empty reply (or null if all fail).
// Try each configured provider in turn; return the first usable reply, plus why the others
// failed (provider names and status codes only, never keys) so a fallback can explain itself.
export async function askProviders(system: string, turns: Turn[], accept: (r: Reply) => boolean) {
  const failures: string[] = [];
  for (const name of configured()) {
    const p = PROVIDERS[name];
    if (!p) {
      failures.push(`${name}: unknown provider`);
      continue;
    }
    if (!process.env[p.key]) {
      failures.push(`${name}: no key`);
      continue;
    }
    try {
      const reply = await ask(name, p, system, turns, process.env[p.key]!);
      if (!reply.text.trim()) failures.push(`${name}: empty reply`);
      else if (!accept(reply)) failures.push(`${name}: answer without valid sources`);
      else return { reply, failures };
    } catch (e) {
      const why = e instanceof Error ? (e.name === "TimeoutError" ? "timeout" : e.message) : "error";
      failures.push(`${name}: ${why}`);
      console.warn(`chat: ${name} failed (${why})`);
    }
  }
  if (!configured().length) failures.push("AI_ORDER is empty");
  return { reply: null, failures };
}
