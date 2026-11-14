import { afterEach, describe, expect, it, vi } from "vitest";
import { askProviders, forgetModels, providerOrder } from "@/lib/chat/providers";

vi.mock("server-only", () => ({}));

const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe("provider chain (simulated AI, no network)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    forgetModels();
  });

  it("skips providers without a key and follows AI_ORDER", () => {
    vi.stubEnv("AI_ORDER", "groq,gemini,meta");
    vi.stubEnv("GROQ_API_KEY", "");
    vi.stubEnv("GEMINI_API_KEY", "test");
    expect(providerOrder()).toEqual(["gemini"]);
  });

  it("falls through to the backup when the main provider is rate-limited", async () => {
    vi.stubEnv("AI_ORDER", "groq,gemini");
    vi.stubEnv("GROQ_API_KEY", "test");
    vi.stubEnv("GEMINI_API_KEY", "test");
    const calls: string[] = [];
    vi.stubGlobal("fetch", async (url: string) => {
      if (url.includes("/models") && !url.includes(":generateContent")) return ok({});
      calls.push(url.includes("groq") ? "groq" : "gemini");
      return url.includes("groq") ? new Response("{}", { status: 429 }) : ok({ candidates: [{ content: { parts: [{ text: "Grounded [F-001]." }] } }] });
    });
    const r = await askProviders("sys", [{ role: "user", content: "q" }], () => true);
    expect(r.reply?.provider).toBe("Google Gemini");
    expect(r.failures).toEqual(["groq: HTTP 429"]);
    expect(calls).toEqual(["groq", "gemini"]);
  });

  it("moves on when an answer fails the citation check", async () => {
    vi.stubEnv("AI_ORDER", "groq,gemini");
    vi.stubEnv("GROQ_API_KEY", "test");
    vi.stubEnv("GEMINI_API_KEY", "test");
    vi.stubGlobal("fetch", async (url: string) =>
      url.includes("groq") ? ok({ choices: [{ message: { content: "Uncited claim." } }] }) : ok({ candidates: [{ content: { parts: [{ text: "Cited [F-001]." }] } }] }),
    );
    const r = await askProviders("sys", [{ role: "user", content: "q" }], (x) => x.text.includes("[F-"));
    expect(r.reply?.text).toBe("Cited [F-001].");
    expect(r.failures).toEqual(["groq: answer without valid sources"]);
  });
});

describe("chat sources", () => {
  it("returns the NASA document and page for each cited finding", async () => {
    const { sourcesFor } = await import("@/lib/chat/knowledge");
    const s = sourcesFor(["F-001", "F-999"]);
    expect(s.length).toBeGreaterThan(0);
    expect(s.every((x) => x.findingId === "F-001" && x.url.startsWith("http") && x.title && x.experimentId)).toBe(true);
  });
});

describe("prepared-answer fallback matching", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    forgetModels();
  });

  it("ignores generic words, so a sources question doesn't pick an unrelated answer", async () => {
    const { preparedAnswer } = await import("@/lib/chat/knowledge");
    expect(preparedAnswer("what are the source for the verified data on ISS and what are the verified range")).toBeNull();
    expect(preparedAnswer("Why do flames look different in microgravity?")?.question).toMatch(/microgravity/i);
  });

  it("reports why each provider failed", async () => {
    vi.stubEnv("AI_ORDER", "groq,gemini");
    vi.stubEnv("GROQ_API_KEY", "");
    vi.stubEnv("GEMINI_API_KEY", "test");
    vi.stubGlobal("fetch", async () => new Response("{}", { status: 404 }));
    const r = await askProviders("sys", [{ role: "user", content: "q" }], () => true);
    expect(r.reply).toBeNull();
    expect(r.failures[0]).toBe("groq: no key");
    expect(r.failures[1]).toMatch(/^gemini: HTTP 404/);
  });

  it("finds a current model when the configured one is retired (404), then answers", async () => {
    vi.stubEnv("AI_ORDER", "groq");
    vi.stubEnv("GROQ_API_KEY", "test");
    vi.stubEnv("GROQ_MODEL", "llama-3.3-70b-versatile");
    const used: string[] = [];
    vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
      if (url.endsWith("/models")) return ok({ data: [{ id: "whisper-large-v3" }, { id: "meta-llama/llama-4-scout-17b-16e-instruct" }] });
      const model = JSON.parse(String(init?.body)).model as string;
      used.push(model);
      return model === "llama-3.3-70b-versatile" ? new Response("{}", { status: 404 }) : ok({ choices: [{ message: { content: "Cited [F-001]." } }] });
    });
    const r = await askProviders("sys", [{ role: "user", content: "q" }], () => true);
    expect(r.reply?.model).toBe("meta-llama/llama-4-scout-17b-16e-instruct");
    expect(used).toEqual(["llama-3.3-70b-versatile", "meta-llama/llama-4-scout-17b-16e-instruct"]);
  });
});

describe("answers about sources without any AI", () => {
  it("answers the ISS sources-and-range question from the verified data", async () => {
    const { provenanceAnswer } = await import("@/lib/chat/knowledge");
    const r = provenanceAnswer("what are the source for the verfied data on ISS and what are the verfied range")!;
    expect(r.answer).toMatch(/FLEX Table IX/);
    expect(r.answer).toMatch(/70–309 kPa/);
    expect(r.sources.some((s) => s.url.includes("20150023456"))).toBe(true);
  });

  it("says plainly when a world has no tests, and ignores non-source questions", async () => {
    const { provenanceAnswer } = await import("@/lib/chat/knowledge");
    expect(provenanceAnswer("what was tested on Mars?")!.answer).toMatch(/no fire tests on Mars/);
    expect(provenanceAnswer("what was tested on the Moon?")!.answer).toMatch(/no fire tests on the Moon itself.*Related experiments: FM2/);
    expect(provenanceAnswer("is a fire on Mars dangerous?")).toBeNull();
  });
});
