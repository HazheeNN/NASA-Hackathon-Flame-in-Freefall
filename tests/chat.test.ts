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

  it("accepts a sources answer only for a sources question that points to the Sources page", async () => {
    const { isProvenanceAnswer } = await import("@/lib/chat/guard");
    expect(isProvenanceAnswer("what are the sources for the ISS data?", "FLEX Table IX ... Every source is listed on this site's Sources page.")).toBe(true);
    expect(isProvenanceAnswer("is Mars dangerous?", "Yes. Every source is listed on this site's Sources page.")).toBe(false);
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
