import "server-only";
import { answers, atmospheres, experimentById, experiments, findings, flex, formulas, insights, worlds } from "@/lib/data";
import { visible } from "@/lib/visibility";
import { isAboutQuestion, rank, words } from "./guard";

// What the live chat may use: verified findings (the most relevant ones for this question),
// the NASA formulas and the worlds' gravity and cabin air. Nothing else.

// Free tiers limit tokens per minute and per request, so the briefing is kept small: only what
// this kind of question needs (docs/ai.md › Live chat › Briefing size).
const MAX_FINDINGS = 7;
const MAX_FINDINGS_ABOUT = 4;

const short = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);

const findingLine = (f: (typeof findings)[number]) => {
  const c = f.conditions;
  const cond = [
    c.gravityG !== undefined && `${c.gravityG} g`,
    c.oxygenPercent !== undefined && `${c.oxygenPercent} % O₂`,
    c.pressureKPa !== undefined && `${c.pressureKPa} kPa`,
    c.flowCmPerS !== undefined && `${c.flowCmPerS} cm/s`,
  ]
    .filter(Boolean)
    .join(", ");
  const exp = experimentById.get(f.experimentId);
  const s = f.sources[0];
  return `${f.id} (${exp?.acronym ?? short(exp?.name ?? f.experimentId, 30)}${cond ? `; ${cond}` : ""}): ${f.statement} Matters: ${short(f.safetyImplication, 140)} Source: ${short(s.title, 60)}${s.locator ? `, ${short(s.locator, 40)}` : ""}`;
};

// `href` overrides the link to our own page (formulas link to /formulas, experiments to /sources).
export type ChatSource = { findingId: string; title: string; url: string; locator?: string; year?: number; experiment: string; experimentId: string; href?: string };

// The NASA documents behind the cited findings, shown under each chat answer and linked to /sources.
export function sourcesFor(ids: string[]): ChatSource[] {
  const byId = new Map(visible(findings).map((f) => [f.id, f]));
  const fx = new Map(visible(formulas).map((f) => [f.id, f]));
  return ids.flatMap((id) => {
    const formula = fx.get(id);
    if (formula) {
      return formula.sources.map((s) => ({ findingId: id, title: s.title, url: s.url, locator: s.locator, year: s.year, experiment: formula.name, experimentId: id, href: `/formulas#${id}` }));
    }
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

const ABOUT_SHORT =
  "Flame in Freefall: a NASA Space Apps 2026 entry turning verified NASA microgravity combustion research into fire-safety insights for the ISS, the Moon and Mars. Not affiliated with NASA. Gaps (e.g. Mars gravity, untested habitat air) show in red on the Gaps map.";

// Facts about the project itself, computed from the data (so they're always current).
function aboutText() {
  const fs = visible(findings);
  const themes = [...new Map(fs.flatMap((f) => f.themes).map((t) => [t, 0])).keys()];
  const count = (t: string) => fs.filter((f) => f.themes.includes(t as never)).length;
  const exps = visible(experiments);
  return [
    "Flame in Freefall is a NASA Space Apps Challenge 2026 entry (challenge: \"Flame in Freefall\"). It summarizes, ranks and interprets NASA microgravity combustion research into fire-safety insights for crews on the ISS, the Moon and Mars. Independent project, not affiliated with or endorsed by NASA.",
    `Data: ${fs.length} verified findings (claims from NASA papers, each checked by the team against the page it comes from) from ${exps.length} experiments and sources, ${flex.verified ? `the FLEX Table IX dataset (${flex.rows.length} ISS droplet tests), ` : ""}${visible(formulas).length} NASA formulas, 4 worlds (Earth, ISS, Moon, Mars) with their cabin air. Topics covered (number of findings): ${themes.map((t) => `${t.replaceAll("-", " ")} ${count(t)}`).join(", ")}.`,
    `Insights: ${insights.insights.length} ranked fire-safety insights written by an AI (Claude) from the findings and reviewed by the team; ${answers.answers.length} prepared answers.`,
    "Not covered: no fire tests at Mars gravity (0.38 g) and very few at Moon gravity (a lunar-surface experiment, FM2, is planned); little data at the proposed 34 % O₂ / 56.5 kPa habitat air; liquid droplets tested only in microgravity. These gaps show in red on the Gaps map.",
    "Pages: Flame Lab (home: pick a world and the cabin air, see an illustrated flame and what NASA measured), Gaps map (what was and wasn't tested), Insights (ranked, with a confidence meter), Formulas (each NASA formula, how it's used, its limits and page), Findings (every finding and the FLEX table), Sources (every NASA source and how the AI works), About, and Ask (this chat and the prepared answers).",
    "Rules: every number cites a NASA or partner-agency source with a page; the live site shows only verified data; untested conditions are shown, never guessed; no data from Chinese agencies or missions. This chat uses free AI services (Groq, Google Gemini) and only the information given here.",
  ].join(" ");
}

export function knowledgeFor(question: string) {
  const about = isAboutQuestion(question);
  const wantsFormulas = /\b(formulas?|equations?|calculat\w*|partial pressure|d² law|d2 law|burn time|stretch)\b/i.test(question);
  const pool = visible(findings);
  const ranked = rank(pool, (f) => `${f.title} ${f.statement} ${f.themes.join(" ")} ${f.experimentId}`, question);
  const picked = ranked.slice(0, about ? MAX_FINDINGS_ABOUT : MAX_FINDINGS).map((r) => r.item);
  const shownFormulas = visible(formulas);
  const formulaLines = shownFormulas.map((f) =>
    about || wantsFormulas
      ? `${f.id} ${f.name}: ${f.expression}. ${short(f.explanation, 160)} Valid: ${JSON.stringify(f.validity)}. Used: ${f.whereUsed.map((w) => w.label).join("; ") || "explained only"}. Source: ${short(f.sources[0].title, 60)}${f.sources[0].locator ? `, ${short(f.sources[0].locator, 50)}` : ""}`
      : `${f.id} ${f.name}: ${f.expression}`,
  );
  const worldLine = visible(worlds)
    .map((w) => {
      const air = w.atmosphereIds
        .map((id) => visible(atmospheres).find((a) => a.id === id))
        .filter((a) => a !== undefined)
        .slice(0, 2)
        .map((a) => `${a.pressureKPa} kPa/${a.oxygenPercent} % O₂`)
        .join(" or ");
      return `${w.name} ${w.gravityG} g (air ${air})`;
    })
    .join("; ");
  const datasetLine = flex.verified
    ? `FLEX Table IX: ${flex.rows.length} droplet tests in microgravity on the ISS, 2009–2011; methanol and heptane; 70–309 kPa; 12–34 % O₂; diluted with N₂, CO₂ or He. Source: ${short(flex.source.title, 70)}, ${flex.source.locator}.`
    : "";
  const experimentLines = visible(experiments).map(
    (e) => `${e.acronym ?? short(e.name, 40)} (${e.platform}, ${short(e.years, 40)}): ${short(e.sources[0].title, 70)}`,
  );
  const text = [
    "ABOUT THE PROJECT:",
    about ? aboutText() : ABOUT_SHORT,
    "",
    "VERIFIED FINDINGS (cite these IDs):",
    ...picked.map(findingLine),
    "",
    "NASA FORMULAS (cite as [FX-01]):",
    ...formulaLines,
    "",
    `WORLDS: ${worldLine}`,
    ...(about ? ["", `DATASET: ${datasetLine}`, "", "EXPERIMENTS AND THEIR NASA SOURCES:", ...experimentLines] : []),
  ].join("\n");
  return { text, allowed: new Set([...picked.map((f) => f.id), ...shownFormulas.map((f) => f.id)]) };
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
  if (!SOURCES_Q.test(question)) return /\b(project|site|website|cover|covers|covered|coverage|about|what can you|what are you)\b/i.test(question) ? { answer: `${aboutText()} Every source, with its page, is listed on this site's Sources page.`, sources: [] } : null;
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
  const fx = /\b(formula|formulas|equation|equations)\b/i.test(question) ? visible(formulas) : [];
  if (fx.length) {
    parts.push(
      `Our formulas all come from NASA papers: ${fx.map((f) => `${f.name} (${f.sources[0].title}${f.sources[0].locator ? `, ${f.sources[0].locator.split(" (")[0]}` : ""}) [${f.id}]`).join("; ")}. Each one is explained, with its limits, on the Formulas page.`,
    );
  }
  parts.push("Every source, with its page, is listed on this site's Sources page.");
  const sources = [
    ...sourcesFor(fx.map((f) => f.id)),
    ...(includeFlex ? [{ findingId: "FLEX Table IX", title: flex.source.title, url: flex.source.url, locator: flex.source.locator, year: flex.source.year, experiment: "FLEX", experimentId: "flex" }] : []),
    ...pool.flatMap((e) =>
      e.sources.slice(0, 1).map((s) => ({ findingId: e.acronym ?? e.id, title: s.title, url: s.url, locator: s.locator, year: s.year, experiment: e.acronym ?? e.name, experimentId: e.id })),
    ),
  ];
  return { answer: parts.join(" "), sources };
}
