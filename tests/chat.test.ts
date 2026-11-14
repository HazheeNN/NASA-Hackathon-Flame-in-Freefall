import { describe, expect, it } from "vitest";
import { allow, cleanCitations, isGrounded, rank } from "@/lib/chat/guard";

describe("live chat guard", () => {
  const allowed = new Set(["F-001", "F-008"]);

  it("keeps real citations and drops invented ones", () => {
    const r = cleanCitations("Spread is fastest at 10 cm/s [F-008, F-099]. Made up [F-777].", allowed);
    expect(r.text).toBe("Spread is fastest at 10 cm/s [F-008]. Made up.");
    expect(r.ids).toEqual(["F-008"]);
  });

  it("accepts cited answers and honest 'not covered' replies, rejects uncited claims", () => {
    expect(isGrounded("x", ["F-001"])).toBe(true);
    expect(isGrounded("Our verified NASA data doesn't cover that.", [])).toBe(true);
    expect(isGrounded("I can only answer questions about fire safety in space and the NASA data on this site.", [])).toBe(true);
    expect(isGrounded("Mars fires are twice as fast.", [])).toBe(false);
  });

  it("ranks documents by shared words", () => {
    const r = rank(["oxygen limit in microgravity", "smoke detector particles"], (s) => s, "what about smoke detectors and particles?");
    expect(r[0].item).toBe("smoke detector particles");
  });

  it("limits questions per visitor", () => {
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) expect(allow("v", 3, 1000, t)).toBe(true);
    expect(allow("v", 3, 1000, t)).toBe(false);
    expect(allow("v", 3, 1000, t + 2000)).toBe(true);
  });

  it("treats questions about the project as answerable without finding IDs, science questions not", async () => {
    const { isAboutQuestion } = await import("@/lib/chat/guard");
    expect(isAboutQuestion("what does your findings cover?")).toBe(true);
    expect(isAboutQuestion("i want to learn more about the project and what it covers")).toBe(true);
    expect(isAboutQuestion("where did you get the formulas from?")).toBe(true);
    expect(isAboutQuestion("is a fire on Mars more dangerous than on the ISS?")).toBe(false);
  });

  it("keeps formula citations like [FX-01] next to findings", () => {
    const r = cleanCitations("pO₂ is 19.2 kPa [FX-01, F-008, FX-99].", new Set(["FX-01", "F-008"]));
    expect(r.text).toBe("pO₂ is 19.2 kPa [FX-01, F-008].");
    expect(r.ids).toEqual(["FX-01", "F-008"]);
  });
});

describe("picking a current model", async () => {
  const { pickGroqModel, pickGeminiModel } = await import("@/lib/chat/models");

  it("Groq: prefers Meta's Llama, skips speech and guard models", () => {
    expect(pickGroqModel(["whisper-large-v3", "meta-llama/llama-guard-4-12b", "openai/gpt-oss-120b", "meta-llama/llama-4-maverick-17b-128e-instruct"])).toBe(
      "meta-llama/llama-4-maverick-17b-128e-instruct",
    );
    expect(pickGroqModel(["whisper-large-v3", "openai/gpt-oss-120b", "qwen/qwen3-32b"])).toBe("openai/gpt-oss-120b");
    expect(pickGroqModel(["whisper-large-v3"])).toBeNull();
  });

  it("Gemini: newest stable Flash with generateContent", () => {
    const m = (name: string, methods = ["generateContent"]) => ({ name: `models/${name}`, supportedGenerationMethods: methods });
    expect(pickGeminiModel([m("gemini-3.5-flash"), m("gemini-3.8-flash"), m("gemini-3.8-flash-preview-05-20"), m("gemini-3.8-flash-lite"), m("text-embedding-004", ["embedContent"])])).toBe(
      "gemini-3.8-flash",
    );
    expect(pickGeminiModel([m("gemini-3.8-flash"), m("gemini-flash-latest")])).toBe("gemini-flash-latest");
  });
});
