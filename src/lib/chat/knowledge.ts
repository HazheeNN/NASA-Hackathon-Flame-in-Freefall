import "server-only";
import { answers, experimentById, findings, formulas, worlds, atmospheres } from "@/lib/data";
import { visible } from "@/lib/visibility";
import { rank } from "./guard";

// What the live chat may use: verified findings (the most relevant ones for this question),
// the NASA formulas and the worlds' gravity and cabin air. Nothing else.

const MAX_FINDINGS = 14;

const findingLine = (f: (typeof findings)[number]) => {
  const c = f.conditions;
  const cond = [
    c.gravityG !== undefined && `${c.gravityG} g`,
    c.oxygenPercent !== undefined && `${c.oxygenPercent} % O₂`,
    c.pressureKPa !== undefined && `${c.pressureKPa} kPa`,
    c.flowCmPerS !== undefined && `airflow ${c.flowCmPerS} cm/s`,
    c.material || c.fuel,
  ]
    .filter(Boolean)
    .join(", ");
  const exp = experimentById.get(f.experimentId);
  const src = f.sources.map((s) => `${s.title}${s.year ? ` (${s.year})` : ""}${s.locator ? `, ${s.locator}` : ""}`).join("; ");
  return `${f.id} (${exp?.acronym ?? exp?.name ?? f.experimentId}${cond ? `; ${cond}` : ""}): ${f.statement} Why it matters: ${f.safetyImplication} Source: ${src}`;
};

export type ChatSource = { findingId: string; title: string; url: string; locator?: string; year?: number; experiment: string; experimentId: string };

// The NASA documents behind the cited findings, shown under each chat answer and linked to /sources.
export function sourcesFor(ids: string[]): ChatSource[] {
  const byId = new Map(visible(findings).map((f) => [f.id, f]));
  return ids.flatMap((id) => {
    const f = byId.get(id);
    if (!f) return [];
    const exp = experimentById.get(f.experimentId);
    return f.sources.map((s) => ({
      findingId: id,
      title: s.title,
      url: s.url,
      locator: s.locator,
      year: s.year,
      experiment: exp?.acronym ?? exp?.name ?? f.experimentId,
      experimentId: f.experimentId,
    }));
  });
}

export function knowledgeFor(question: string) {
  const pool = visible(findings);
  const ranked = rank(pool, (f) => `${f.title} ${f.statement} ${f.themes.join(" ")} ${f.experimentId}`, question);
  const picked = ranked.slice(0, MAX_FINDINGS).map((r) => r.item);
  const formulaLines = visible(formulas).map(
    (f) => `${f.id} ${f.name}: ${f.expression}. ${f.explanation} Valid: ${JSON.stringify(f.validity)}. (Formulas are not findings: don't cite FX IDs in brackets.)`,
  );
  const worldLines = visible(worlds).map((w) => {
    const air = w.atmosphereIds
      .map((id) => visible(atmospheres).find((a) => a.id === id))
      .filter((a) => a !== undefined)
      .map((a) => `${a.name} ${a.pressureKPa} kPa / ${a.oxygenPercent} % O₂`)
      .join("; ");
    return `${w.name}: ${w.gravityG} g; cabin air: ${air}`;
  });
  const text = [
    "VERIFIED FINDINGS (cite these IDs):",
    ...picked.map(findingLine),
    "",
    "NASA FORMULAS:",
    ...formulaLines,
    "",
    "WORLDS:",
    ...worldLines,
  ].join("\n");
  return { text, allowed: new Set(picked.map((f) => f.id)) };
}

// Last resort when no AI answers: the closest prepared, reviewed answer (docs/ai.md › Job 3).
export function preparedAnswer(question: string) {
  const best = rank(answers.answers, (a) => `${a.question} ${a.answer}`, question)[0];
  return best && best.score >= 2 ? best.item : null;
}
