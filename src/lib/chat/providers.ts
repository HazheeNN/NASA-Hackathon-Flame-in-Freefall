import "server-only";
import { rankGeminiModels, rankGroqModels } from "./models";

// Free-tier AI providers for the live chat, tried in the order of AI_ORDER (decision 2026-11-15).
// Keys live only in Vercel's environment variables; they never reach the browser or the model.

export type Turn = { role: "user" | "assistant"; content: string };
export type Reply = { text: string; provider: string; model: string };

const TIMEOUT_MS = 12_000;
const TRIES_PER_PROVIDER = 3; // models tried per provider before moving on

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
  // Ask the provider which models it offers now, best first (names are retired every few months).
  discover: (key: string) => Promise<string[]>;
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
      return rankGroqModels(ids);
    },
    chat: async (model, system, turns, key) => {
      const data = await call(
        `${GROQ}/chat/completions`,
        { authorization: `Bearer ${key}` },
        // Room for "thinking" models, whose hidden reasoning counts against max_tokens.
        { model, temperature: 0.2, max_tokens: 1500, messages: [{ role: "system", content: system }, ...turns] },
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
      return rankGeminiModels(data?.models ?? []);
    },
    chat: async (model, system, turns, key) => {
      const data = await call(
        `${GEMINI}/models/${encodeURIComponent(model)}:generateContent`,
        { "x-goog-api-key": key },
        {
          systemInstruction: { parts: [{ text: system }] },
          contents: turns.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.content }] })),
          generationConfig: { temperature: 0.2, maxOutputTokens: 1500 },
        },
      );
      const parts: { text?: string; thought?: boolean }[] = data?.candidates?.[0]?.content?.parts ?? [];
      return parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("");
    },
  },
};

// The model that worked last, per provider (kept while this server instance lives).
const working = new Map<string, string>();
export const forgetModels = () => (working.clear(), discovered.clear()); // tests

// Models to try, best first: a GROQ_MODEL / GEMINI_MODEL setting, the one that worked last,
// then the provider's current list (looked up once per server instance), then a built-in guess.
const discovered = new Map<string, string[]>();
async function candidates(name: string, p: Provider, key: string) {
  if (!discovered.get(name)?.length) discovered.set(name, await p.discover(key).catch(() => []));
  const list = [process.env[p.envModel], working.get(name), ...(discovered.get(name) ?? []), p.defaultModel].filter((m): m is string => !!m);
  return [...new Set(list)].slice(0, TRIES_PER_PROVIDER);
}

// Try the candidates in turn. A model that is retired (404/400), overloaded or rate-limited
// (503/429) or that replies with nothing is skipped for the next one; other errors stop here.
async function ask(name: string, p: Provider, system: string, turns: Turn[], key: string): Promise<Reply> {
  const notes: string[] = [];
  for (const model of await candidates(name, p, key)) {
    try {
      const text = await p.chat(model, system, turns, key);
      if (!text.trim()) {
        notes.push(`${model}: empty reply`);
        continue;
      }
      working.set(name, model);
      return { text, provider: p.label, model };
    } catch (e) {
      const status = e instanceof HttpError ? e.status : 0;
      const why = status ? `HTTP ${status}` : e instanceof Error && e.name === "TimeoutError" ? "timeout" : "error";
      notes.push(`${model}: ${why}`);
      if (![400, 404, 429, 500, 503].includes(status)) break;
    }
  }
  if (working.get(name) && notes.some((n) => n.startsWith(working.get(name)!))) working.delete(name);
  throw new Error(notes.join(", ") || "no model available");
}

const configured = () =>
  (process.env.AI_ORDER || "groq,gemini")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export function providerOrder() {
  return configured().filter((name) => PROVIDERS[name] && process.env[PROVIDERS[name].key]);
}

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
      if (!accept(reply)) failures.push(`${name}: answer without valid sources`);
      else return { reply, failures };
    } catch (e) {
      const why = e instanceof Error ? e.message : "error";
      failures.push(`${name}: ${why}`);
      console.warn(`chat: ${name} failed (${why})`);
    }
  }
  if (!configured().length) failures.push("AI_ORDER is empty");
  return { reply: null, failures };
}
