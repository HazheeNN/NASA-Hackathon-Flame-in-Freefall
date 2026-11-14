import "server-only";
import { answers, atmospheres, experimentById, experiments, findings, flex, formulas, worlds } from "@/lib/data";
import { visible } from "@/lib/visibility";
import { rank, words } from "./guard";

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
  const datasetLines =
    flex.verified
      ? [
          `FLEX Table IX: ${flex.rows.length} droplet tests burned in microgravity (0 g) on the ISS, 2009–2011; fuels methanol and heptane; pressure 70–309 kPa (0.70–3.05 atm); oxygen 12–34 %; diluted with nitrogen, CO₂ or helium; outcomes: flame went out, droplet broke apart, or burned to the end. Source: ${flex.source.title}, ${flex.source.locator}. Shown on the Findings page (FLEX dataset tab) and the Gaps map.`,
        ]
      : [];
  const experimentLines = visible(experiments).map(
    (e) => `${e.acronym ?? e.name} (${e.agency}, ${e.platform}, ${e.years}). Source: ${e.sources.map((s) => s.title + (s.locator ? `, ${s.locator}` : "")).join("; ")}`,
  );
  const text = [
    "VERIFIED FINDINGS (cite these IDs):",
    ...picked.map(findingLine),
    "",
    "NASA FORMULAS:",
    ...formulaLines,
    "",
    "WORLDS:",
    ...worldLines,
    "",
    "DATASETS (for questions about tested ranges; not citable as [F-###]):",
    ...datasetLines,
    "",
    "EXPERIMENTS AND THEIR NASA SOURCES (for questions about where the data comes from):",
    ...experimentLines,
  ].join("\n");
  return { text, allowed: new Set(picked.map((f) => f.id)) };
}

// Words every answer shares; they say nothing about which answer fits.
const GENERIC = new Set(["verified", "data", "nasa", "source", "sources", "finding", "findings", "range", "ranges", "tested", "test", "tests", "space", "show", "tell", "explain", "know"]);

// Last resort when no AI answers: the closest prepared, reviewed answer (docs/ai.md › Job 3),
// matched on the question's specific words, and only if it shares most of them.
export function preparedAnswer(question: string) {
  const specific = words(question).filter((w) => !GENERIC.has(w)).join(" ");
  if (!specific) return null;
  const need = Math.max(2, Math.ceil(new Set(words(specific)).size * 0.5));
  const best = rank(answers.answers, (a) => a.question, specific)[0];
  return best && best.score >= need ? best.item : null;
}

// Experiments named in a reply (e.g. "FLEX", "Saffire"): their NASA sources go under the answer.
export function experimentSources(text: string): ChatSource[] {
  const t = text.toLowerCase();
  return visible(experiments)
    .filter((e) => [e.acronym, e.name].some((n) => n && n.length > 2 && t.includes(n.toLowerCase())))
    .flatMap((e) =>
      e.sources.map((s) => ({ findingId: e.acronym ?? e.id, title: s.title, url: s.url, locator: s.locator, year: s.year, experiment: e.acronym ?? e.name, experimentId: e.id })),
    );
}

// Questions about where the data comes from or what was tested can be answered straight from the
// data, without any AI: used when the live AI is unavailable. Facts only from the verified records.
const PLACES: { match: RegExp; label: string; platforms: string[]; extra?: RegExp }[] = [
  { match: /\b(iss|space station|station)\b/i, label: "the ISS", platforms: ["ISS"] },
  { match: /\b(space ?ship|spacecraft|cabin|orbit|cygnus|shuttle|mir)\b/i, label: "spacecraft", platforms: ["ISS", "Crewed spacecraft", "Uncrewed spacecraft"] },
  { match: /\b(moon|lunar|artemis)\b/i, label: "the Moon", platforms: [], extra: /moon|lunar/i },
  { match: /\b(mars|martian)\b/i, label: "Mars", platforms: [], extra: /mars|martian/i },
  { match: /\b(earth|ground|drop tower)\b/i, label: "Earth and drop towers", platforms: ["Drop tower", "Ground (1 g)"] },
];
const SOURCES_Q = /\b(source|sources|where .*(from|come)|reference|dataset|data set|tested|range|ranges|experiments?|measured)\b/i;

export function provenanceAnswer(question: string): { answer: string; sources: ChatSource[] } | null {
  if (!SOURCES_Q.test(question)) return null;
  const place = PLACES.find((p) => p.match.test(question));
  const pool = visible(experiments).filter((e) =>
    place ? place.platforms.includes(e.platform) || (place.extra?.test(`${e.name} ${e.summary}`) ?? false) : true,
  );
  const parts: string[] = [];
  const includeFlex = flex.verified && (!place || place.platforms.includes("ISS"));
  if (includeFlex) {
    parts.push(
      `Our verified test data for ${place ? place.label : "microgravity"} is FLEX Table IX: ${flex.rows.length} droplet tests burned in microgravity on the ISS (2009–2011), methanol and heptane, tested at 70–309 kPa (0.70–3.05 atm) and 12–34 % oxygen, diluted with nitrogen, CO₂ or helium (${flex.source.title}, ${flex.source.locator}).`,
    );
  }
  if (place && place.platforms.length === 0) {
    parts.push(`Our verified data has no fire tests on ${place.label} itself, which is why it shows as untested (red) on the Gaps map.`);
  }
  if (pool.length) {
    const names = pool.map((e) => `${e.acronym ?? e.name} (${e.years.split(";")[0]})`);
    const lead = !place ? "Our verified experiments" : place.platforms.length ? `Experiments for ${place.label}` : `Related experiments`;
    parts.push(`${lead}: ${names.join(", ")}.`);
  }
  parts.push("Every source, with its page, is listed on this site's Sources page.");
  const sources = [
    ...(includeFlex ? [{ findingId: "FLEX Table IX", title: flex.source.title, url: flex.source.url, locator: flex.source.locator, year: flex.source.year, experiment: "FLEX", experimentId: "flex" }] : []),
    ...pool.flatMap((e) =>
      e.sources.slice(0, 1).map((s) => ({ findingId: e.acronym ?? e.id, title: s.title, url: s.url, locator: s.locator, year: s.year, experiment: e.acronym ?? e.name, experimentId: e.id })),
    ),
  ];
  return { answer: parts.join(" "), sources };
}
