import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateCorpus } from "@/lib/validate";

const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const corpus = () => ({
  experiments: read("data/experiments.json"),
  findings: read("data/findings.json"),
  insights: read("data/generated/insights.json"),
});

const finding = {
  id: "F-001",
  experimentId: "bass",
  title: "Example",
  statement: "Example statement.",
  conditions: { gravityG: 0 },
  measurements: [],
  safetyImplication: "Example.",
  themes: ["flame-spread"],
  evidence: { kind: "measured", strength: 1 },
  sources: [{ title: "Example source", url: "https://ntrs.nasa.gov/citations/00000000" }],
  extractedBy: "human",
  verified: false,
};

describe("data/", () => {
  it("is valid against the schema and cross-record rules", () => {
    expect(validateCorpus(corpus())).toEqual([]);
  });

  it("catches a finding that points at an unknown experiment", () => {
    const c = corpus();
    c.findings = [{ ...finding, experimentId: "nope" }];
    expect(validateCorpus(c)).toContain('F-001: unknown experimentId "nope"');
  });

  it("catches an insight citing a finding that doesn't exist", () => {
    const c = corpus();
    c.findings = [finding];
    c.insights = {
      generatedAt: "x", model: "x", findingsHash: "x",
      insights: [{
        id: "I-01", rank: 1, title: "t", answer: "a", explanation: "e", recommendation: "r", caveats: "c",
        risk: "high", missions: ["ISS"], themes: ["flame-spread"], findingIds: ["F-002"],
        scores: { safetyRelevance: 5, severity: 5, evidence: 3, actionability: 4 },
      }],
    };
    expect(validateCorpus(c)).toContain("I-01: cites missing finding F-002");
  });

  it("refuses a verified finding with no page or section to check", () => {
    const c = corpus();
    c.findings = [{ ...finding, verified: true }];
    expect(validateCorpus(c)).toContain("F-001: verified but no source has a page/section locator");
  });
});
