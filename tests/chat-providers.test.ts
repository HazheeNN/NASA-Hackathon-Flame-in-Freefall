import { afterEach, describe, expect, it, vi } from "vitest";
import { askProviders, providerOrder } from "@/lib/chat/providers";

vi.mock("server-only", () => ({}));

const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe("provider chain (simulated AI, no network)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
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
      calls.push(url.includes("groq") ? "groq" : "gemini");
      return url.includes("groq") ? new Response("{}", { status: 429 }) : ok({ candidates: [{ content: { parts: [{ text: "Grounded [F-001]." }] } }] });
    });
    const r = await askProviders("sys", [{ role: "user", content: "q" }], () => true);
    expect(r?.provider).toBe("Google Gemini");
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
    expect(r?.text).toBe("Cited [F-001].");
  });
});
