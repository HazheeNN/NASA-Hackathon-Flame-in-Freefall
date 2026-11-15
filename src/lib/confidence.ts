// "How sure are we?" (F20): computed from an insight's cited findings, never set by hand and never
// by the AI. Pure, so it can be tested (tests/confidence.test.ts). The thresholds are ours, not NASA's.
//
// Six bars, each 0–1, averaged into Strong (≥ 0.75), Moderate (≥ 0.45) or Weak:
// 1. Findings: how many support it (full at 5).
// 2. Experiments: how many different experiments they come from (full at 3).
// 3. Verified: share checked by a teammate against the NASA page.
// 4. Evidence type: controlled tests count most, models less, reviews and accident reports least.
// 5. Gravity: share of the insight's missions whose gravity at least one finding was measured at.
// 6. Cabin air: share of the missions' planned cabin air (O₂ and pressure) a finding was measured at.

export type MissionContext = { mission: string; gravityG: number; air: { oxygenPercent: number; pressureKPa: number; name: string } | null };
type Cited = { experimentId: string; verified: boolean; evidence: { kind: string }; conditions: { gravityG?: number; oxygenPercent?: number; pressureKPa?: number } };

export type CheckState = "tested" | "untested" | "unknown";
export type ConditionCheck = { label: string; missions: string[]; state: CheckState };

export type Confidence = {
  findings: number;
  experiments: number;
  verified: number;
  kinds: Record<string, number>;
  gravity: ConditionCheck[];
  air: ConditionCheck[];
  bars: { name: string; value: number; text: string }[];
  score: number;
  word: "Strong" | "Moderate" | "Weak";
};

const KIND_WEIGHT: Record<string, number> = { measured: 1, modelled: 0.75, review: 0.5, "incident-report": 0.25 };
const KIND_LABEL: Record<string, [string, string]> = { measured: ["test", "tests"], modelled: ["model", "models"], review: ["review", "reviews"], "incident-report": ["accident report", "accident reports"] };
const G_TOL = 0.03;
const O2_TOL = 3; // percentage points
const P_TOL = 0.2; // ±20 %

const gText = (g: number) => (g === 0 ? "0 g" : `${g} g`);
const share = (checks: ConditionCheck[], unknownValue: number) =>
  checks.length ? checks.reduce((a, c) => a + (c.state === "tested" ? 1 : c.state === "unknown" ? unknownValue : 0), 0) / checks.length : 0;

function groupBy<T>(items: T[], key: (t: T) => string) {
  const m = new Map<string, T[]>();
  for (const t of items) m.set(key(t), [...(m.get(key(t)) ?? []), t]);
  return [...m.values()];
}

export function computeConfidence(cited: Cited[], missions: MissionContext[]): Confidence {
  const n = cited.length;
  const kinds: Record<string, number> = {};
  for (const f of cited) kinds[f.evidence.kind] = (kinds[f.evidence.kind] ?? 0) + 1;

  // Gravity: one check per distinct gravity among the missions.
  const gravity = groupBy(missions, (m) => String(m.gravityG)).map((ms) => {
    const g = ms[0].gravityG;
    const hit = cited.some((f) => f.conditions.gravityG !== undefined && Math.abs(f.conditions.gravityG - g) < G_TOL);
    return { label: gText(g), missions: ms.map((m) => m.mission), state: (hit ? "tested" : "untested") as CheckState };
  });

  // Cabin air: one check per distinct planned air. "Unknown" when none of the findings states its air.
  const statesAir = cited.some((f) => f.conditions.oxygenPercent !== undefined);
  const air = groupBy(
    missions.filter((m) => m.air),
    (m) => `${m.air!.oxygenPercent}|${m.air!.pressureKPa}`,
  ).map((ms) => {
    const a = ms[0].air!;
    const hit = cited.some(
      (f) =>
        f.conditions.oxygenPercent !== undefined &&
        Math.abs(f.conditions.oxygenPercent - a.oxygenPercent) <= O2_TOL &&
        (f.conditions.pressureKPa === undefined || Math.abs(f.conditions.pressureKPa - a.pressureKPa) <= a.pressureKPa * P_TOL),
    );
    const state: CheckState = hit ? "tested" : statesAir ? "untested" : "unknown";
    return { label: `${a.oxygenPercent} % O₂, ${a.pressureKPa} kPa`, missions: ms.map((m) => m.mission), state };
  });

  const experiments = new Set(cited.map((f) => f.experimentId)).size;
  const verified = cited.filter((f) => f.verified).length;
  const evidence = n ? cited.reduce((a, f) => a + (KIND_WEIGHT[f.evidence.kind] ?? 0.5), 0) / n : 0;
  const kindText = Object.entries(kinds)
    .sort((a, b) => (KIND_WEIGHT[b[0]] ?? 0) - (KIND_WEIGHT[a[0]] ?? 0))
    .map(([k, c]) => `${c} ${(KIND_LABEL[k] ?? [k, k])[c > 1 ? 1 : 0]}`)
    .join(" · ");
  const tested = (cs: ConditionCheck[]) => `${cs.filter((c) => c.state === "tested").length}/${cs.length}`;

  const bars = [
    { name: "Findings", value: Math.min(n / 5, 1), text: String(n) },
    { name: "Experiments", value: Math.min(experiments / 3, 1), text: String(experiments) },
    { name: "Verified", value: n ? verified / n : 0, text: `${verified}/${n}` },
    { name: "Evidence type", value: evidence, text: kindText || "—" },
    { name: "Mission gravity", value: share(gravity, 0), text: `${tested(gravity)} tested` },
    { name: "Cabin air", value: share(air, 0.5), text: air.every((c) => c.state === "unknown") ? "not stated" : `${tested(air)} tested` },
  ];
  const score = bars.reduce((a, b) => a + b.value, 0) / bars.length;
  return { findings: n, experiments, verified, kinds, gravity, air, bars, score, word: score >= 0.75 ? "Strong" : score >= 0.45 ? "Moderate" : "Weak" };
}
