import "server-only";
import { atmosphereById, displayFindingById, displayInsights, experimentById, flex, formulas, showingSample, worlds } from "./data";
import { mmHgToKPa, type LabTest, type WorldId } from "./lab";
import type { Atmosphere, Formula, Insight, World } from "./schema";
import { showUnverified, visible } from "./visibility";

// Plain, serialisable view models for client components. Visibility (verified only on the live
// site) is applied here, once.

export type LabAtmosphere = Pick<Atmosphere, "id" | "name" | "pressureKPa" | "oxygenPercent" | "usedFor" | "verified"> & {
  source: Atmosphere["sources"][number];
};
export type LabWorld = Pick<World, "name" | "gravityG" | "missions" | "verified"> & {
  id: WorldId;
  image: NonNullable<World["image"]> & { card: string };
  atmospheres: LabAtmosphere[];
  source: World["sources"][number];
};

export function labWorlds(): LabWorld[] {
  return visible(worlds)
    .filter((w) => w.image)
    .map((w) => ({
      id: w.id,
      name: w.name,
      gravityG: w.gravityG,
      missions: w.missions,
      verified: w.verified,
      image: { ...w.image!, card: w.image!.src.replace(/\.jpg$/, "-card.jpg") },
      source: w.sources[0],
      atmospheres: visible(w.atmosphereIds.map((id) => atmosphereById.get(id)).filter((a) => a !== undefined)).map((a) => ({
        id: a.id,
        name: a.name,
        pressureKPa: a.pressureKPa,
        oxygenPercent: a.oxygenPercent,
        usedFor: a.usedFor,
        verified: a.verified,
        source: a.sources[0],
      })),
    }));
}

export function labDataset() {
  if (!showUnverified && !flex.verified) return null;
  const tests: LabTest[] = flex.rows.map((r) => ({
    test: r.test,
    fuel: r.fuel,
    pKPa: r.pressureMmHg === null ? null : mmHgToKPa(r.pressureMmHg),
    o2: r.o2,
    co2: r.co2,
    he: r.he,
    k: r.burningRateMm2PerS,
    end: r.testEnd,
    page: r.page,
  }));
  return { tests, source: flex.source, verified: flex.verified, title: flex.title };
}

export const visibleFormulas = (): Formula[] => visible(formulas);

export type Confidence = { findings: number; experiments: number; verified: number; atGravity: boolean | null };

const MISSION_G: Record<string, number> = { ISS: 0, "Mars transit": 0, "Artemis (Moon)": 0.165, "Mars surface": 0.38 };

// The confidence meter is computed from the cited findings, never set by hand.
export function confidence(i: Insight): Confidence {
  const cited = i.findingIds.map((id) => displayFindingById.get(id)).filter((f) => f !== undefined);
  const gs = i.missions.map((m) => MISSION_G[m]);
  const tested = cited.some((f) => f.conditions.gravityG !== undefined && gs.some((g) => Math.abs(f.conditions.gravityG! - g) < 0.03));
  return {
    findings: cited.length,
    experiments: new Set(cited.map((f) => f.experimentId)).size,
    verified: cited.filter((f) => f.verified).length,
    atGravity: cited.some((f) => f.conditions.gravityG !== undefined) ? tested : null,
  };
}

export type InsightCard = Pick<Insight, "id" | "rank" | "title" | "answer" | "risk" | "missions" | "findingIds"> & { confidence: Confidence };

export function insightCards(): { sample: boolean; cards: InsightCard[] } {
  return {
    sample: showingSample,
    cards: displayInsights.map((i) => ({
      id: i.id,
      rank: i.rank,
      title: i.title,
      answer: i.answer,
      risk: i.risk,
      missions: i.missions,
      findingIds: i.findingIds,
      confidence: confidence(i),
    })),
  };
}

export const experimentName = (id: string) => experimentById.get(id)?.acronym ?? experimentById.get(id)?.name ?? id;
