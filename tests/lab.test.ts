import { describe, expect, it } from "vitest";
import { burnTime, coverage, nearestTests, oxygenPartialPressure, type LabTest, type Setup } from "@/lib/lab";

const t = (o: Partial<LabTest>): LabTest => ({ test: 1, fuel: "heptane", pKPa: 101, o2: 0.21, co2: 0, he: 0, k: 0.6, end: "extinction", page: 20, ...o });
const tests = [t({ test: 1 }), t({ test: 2, o2: 0.3, pKPa: 200, k: 0.8, end: "completion" }), t({ test: 3, fuel: "methanol" })];
const iss: Setup = { world: "iss", gravityG: 0, o2: 21, pressureKPa: 101.3, flow: 0, fuel: "heptane" };

describe("Flame Lab", () => {
  it("marks a microgravity setup inside the FLEX range as tested", () => {
    const c = coverage(iss, tests);
    expect([c.gravity.state, c.o2.state, c.pressure.state]).toEqual(["tested", "tested", "tested"]);
  });

  it("marks Mars gravity and out-of-range pressure as untested", () => {
    expect(coverage({ ...iss, world: "mars", gravityG: 0.38 }, tests).gravity.state).toBe("untested");
    expect(coverage({ ...iss, pressureKPa: 56.5 }, tests).pressure.label).toBe("Beyond the tests");
  });

  it("finds nearby tests only in microgravity, same fuel", () => {
    const n = nearestTests(iss, tests)!;
    expect(n.count).toBe(1);
    expect(n.kMedian).toBe(0.6);
    expect(nearestTests({ ...iss, gravityG: 0.165 }, tests)).toBeNull();
  });

  it("computes the two NASA formulas", () => {
    expect(oxygenPartialPressure(56.5, 34)).toBeCloseTo(19.21, 2);
    expect(burnTime(2, 0.5)).toBe(8);
  });
});

describe("formulas.json worked examples", () => {
  it("each example's result follows from its inputs", async () => {
    const { readFileSync } = await import("node:fs");
    const { FORMULA_FN } = await import("@/lib/lab");
    const formulas = JSON.parse(readFileSync("data/formulas.json", "utf8")) as {
      id: string;
      example: { inputs: { symbol: string; value: number }[]; result: { value: number } };
    }[];
    for (const f of formulas) {
      const fn = FORMULA_FN[f.id];
      expect(fn, `${f.id} has no function in FORMULA_FN`).toBeDefined();
      const v = Object.fromEntries(f.example.inputs.map((i) => [i.symbol, i.value]));
      expect(fn(v)).toBeCloseTo(f.example.result.value, 1);
    }
  });
});
