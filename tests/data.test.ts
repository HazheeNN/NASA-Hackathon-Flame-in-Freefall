import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { findingsHash, inlineCitations, staleWarnings, validateCorpus } from "@/lib/validate";

const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const corpus = () => ({
  experiments: read("data/experiments.json"),
  findings: read("data/findings.json"),
  insights: read("data/generated/insights.json"),
  answers: read("data/generated/answers.json"),
  atmospheres: read("data/atmospheres.json"),
  worlds: read("data/worlds.json"),
});

const answersWith = (answer: string, findingIds: string[]) => ({
  generatedAt: "x", model: "x", findingsHash: "x",
  answers: [{ id: "Q-01", question: "q?", answer, findingIds, themes: [], missions: [] }],
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

  it("reads inline citations like [F-004, F-011]", () => {
    expect(inlineCitations("Slower [F-004, F-011]. Also [F-002].")).toEqual(["F-004", "F-011", "F-002"]);
  });

  it("catches an answer citing a finding that doesn't exist, or one missing from findingIds", () => {
    const c = corpus();
    c.findings = [finding];
    c.answers = answersWith("Spread is slow [F-001]. And [F-009].", ["F-001"]);
    const problems = validateCorpus(c);
    expect(problems).toContain("Q-01: cites F-009 in the text but not in findingIds");
    c.answers = answersWith("Spread is slow [F-001].", ["F-001", "F-007"]);
    expect(validateCorpus(c)).toContain("Q-01: cites missing finding F-007");
  });

  it("warns when answers were made from older findings, and not when current", () => {
    const c = corpus();
    c.findings = [finding];
    c.answers = answersWith("Spread is slow [F-001].", ["F-001"]);
    expect(staleWarnings(c)).toHaveLength(1);
    c.answers.findingsHash = findingsHash(c.findings);
    expect(staleWarnings(c)).toEqual([]);
  });

  it("catches a world pointing at an atmosphere that doesn't exist", () => {
    const c = corpus();
    c.worlds = [{ ...c.worlds[0], atmosphereIds: ["nope"] }];
    expect(validateCorpus(c)).toContain(`world ${c.worlds[0].id}: unknown atmosphere "nope"`);
  });

  it("refuses a verified atmosphere with no page or section to check", () => {
    const c = corpus();
    const a = { ...c.atmospheres[0], verified: true, sources: [{ title: "Example source", url: "https://ntrs.nasa.gov/citations/00000000" }] };
    c.atmospheres = [a, ...c.atmospheres.slice(1)];
    expect(validateCorpus(c)).toContain(`${a.id}: verified but no source has a page/section locator`);
  });
});
