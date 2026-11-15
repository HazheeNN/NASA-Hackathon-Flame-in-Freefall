import { describe, expect, it } from "vitest";
import { computeConfidence, type MissionContext } from "@/lib/confidence";

const iss: MissionContext = { mission: "ISS", gravityG: 0, air: { oxygenPercent: 21, pressureKPa: 101.3, name: "ISS cabin air" } };
const transit: MissionContext = { ...iss, mission: "Mars transit" };
const habitat = { oxygenPercent: 34, pressureKPa: 56.5, name: "Exploration atmosphere" };
const moon: MissionContext = { mission: "Artemis (Moon)", gravityG: 0.165, air: habitat };
const mars: MissionContext = { mission: "Mars surface", gravityG: 0.38, air: habitat };
const f = (kind: string, conditions: Record<string, number> = {}, experimentId = "x") => ({ experimentId, verified: true, evidence: { kind }, conditions });

describe("confidence meter", () => {
  it("insight #3 (oxygen and materials): tested at 0 g only, Moon and Mars gravity and 34 % O₂ air never tested", () => {
    const c = computeConfidence(
      [f("review", {}, "review"), f("incident-report", { oxygenPercent: 100, pressureKPa: 115.1, gravityG: 1 }, "apollo-1"), f("incident-report", { gravityG: 0 }, "mir-1997")],
      [iss, transit, moon, mars],
    );
    expect(c.gravity.map((g) => [g.label, g.state])).toEqual([
      ["0 g", "tested"],
      ["0.165 g", "untested"],
      ["0.38 g", "untested"],
    ]);
    expect(c.air.map((a) => a.state)).toEqual(["untested", "untested"]);
    expect(c.bars.find((b) => b.name === "Evidence type")!.text).toBe("1 review · 2 accident reports");
    expect(c.word).toBe("Moderate");
  });

  it("missions sharing a gravity are checked once; unstated air is 'unknown', not 'untested'", () => {
    const c = computeConfidence([f("measured", { gravityG: 0 }, "saffire"), f("measured", { gravityG: 0 }, "bass")], [iss, transit]);
    expect(c.gravity).toHaveLength(1);
    expect(c.gravity[0].missions).toEqual(["ISS", "Mars transit"]);
    expect(c.air[0].state).toBe("unknown");
  });

  it("controlled tests weigh more than accident reports", () => {
    const tests = computeConfidence([f("measured", { gravityG: 0 })], [iss]);
    const reports = computeConfidence([f("incident-report", { gravityG: 0 })], [iss]);
    expect(tests.score).toBeGreaterThan(reports.score);
  });
});
