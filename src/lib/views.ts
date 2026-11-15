import "server-only";
import { atmosphereById, displayFindingById, displayInsights, experimentById, flex, formulas, showingSample, worlds } from "./data";
import { computeConfidence, type Confidence, type MissionContext } from "./confidence";
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

export type { Confidence } from "./confidence";

// Each mission's gravity and planned cabin air, from the worlds data (a world lists the missions it
// stands for; its first atmosphere is the planned one). Mars transit is the ISS world (≈ 0 g).
function missionContexts(missions: string[]): MissionContext[] {
  return missions.flatMap((m) => {
    const w = worlds.find((x) => (x.missions as string[]).includes(m));
    if (!w) return [];
    const a = atmosphereById.get(w.atmosphereIds[0]);
    return [{ mission: m, gravityG: w.gravityG, air: a ? { oxygenPercent: a.oxygenPercent, pressureKPa: a.pressureKPa, name: a.name } : null }];
  });
}

export function confidence(i: Insight): Confidence {
  const cited = i.findingIds.map((id) => displayFindingById.get(id)).filter((f) => f !== undefined);
  return computeConfidence(cited, missionContexts(i.missions));
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
