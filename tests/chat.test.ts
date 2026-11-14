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
});

