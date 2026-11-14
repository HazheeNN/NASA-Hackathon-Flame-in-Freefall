import { z } from "zod";

// One shape for the whole app, the data scripts and the SI pipeline (docs/data.md).
// If you change a field here, update docs/data.md and re-run `npm run data:validate`.

export const Platform = z.enum([
  "ISS",
  "Crewed spacecraft",
  "Uncrewed spacecraft",
  "Drop tower",
  "Parabolic flight",
  "Sounding rocket",
  "Ground (1 g)",
  // NASA reviews that summarise many experiments on several platforms.
  "Multiple platforms",
]);

export const Theme = z.enum([
  "ignition",
  "flame-spread",
  "extinction",
  "flammability-limits",
  "cool-flames",
  "soot-radiation",
  "smoke-detection",
  "suppression",
  "materials",
  "partial-gravity",
  "spacecraft-atmosphere",
  "incidents",
]);

export const Source = z.object({
  title: z.string().min(3),
  url: z.url(),
  year: z.number().int().min(1950).max(2030).optional(),
  // NASA Technical Reports Server id, when the source is on ntrs.nasa.gov.
  ntrsId: z.string().optional(),
  // Page or section the claim comes from, so anyone can check it in a minute.
  locator: z.string().optional(),
});

// A NASA (or partner agency) experiment, facility or programme.
export const Experiment = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  acronym: z.string().optional(),
  agency: z.string(),
  platform: Platform,
  facility: z.string().optional(),
  years: z.string(),
  fuels: z.array(z.string()),
  summary: z.string(),
  themes: z.array(Theme).min(1),
  sources: z.array(Source),
  // false until a teammate checks it against a NASA source (docs/data.md › Verification).
  verified: z.boolean(),
});

// Test conditions. Every value optional: record what the source states, nothing more.
export const Conditions = z.object({
  gravityG: z.number().min(0).max(2).optional(),
  oxygenPercent: z.number().min(0).max(100).optional(),
  pressureKPa: z.number().min(0).max(300).optional(),
  flowCmPerS: z.number().min(0).optional(),
  fuel: z.string().optional(),
  material: z.string().optional(),
});

export const Measurement = z.object({
  quantity: z.string(),
  value: z.number(),
  unit: z.string(),
});

// One claim from one source: the unit the SI ranks and cites as F-001, F-002, …
export const Finding = z.object({
  id: z.string().regex(/^F-\d{3}$/),
  experimentId: z.string(),
  title: z.string().max(120),
  statement: z.string(),
  conditions: Conditions,
  measurements: z.array(Measurement),
  safetyImplication: z.string(),
  themes: z.array(Theme).min(1),
  evidence: z.object({
    kind: z.enum(["measured", "modelled", "review", "incident-report"]),
    // 1 = single observation, 2 = repeated or peer-reviewed, 3 = repeated across experiments.
    strength: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  }),
  sources: z.array(Source).min(1),
  extractedBy: z.enum(["human", "claude"]),
  verified: z.boolean(),
});

export const Mission = z.enum(["ISS", "Artemis (Moon)", "Mars transit", "Mars surface"]);
export const Risk = z.enum(["high", "medium", "low"]);

// A cabin atmosphere: a preset for the Habitat Designer and a marked spot on the gaps map.
// Only values a NASA source states (docs/data.md › Sources for Four Worlds…).
export const Atmosphere = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  pressureKPa: z.number().min(0).max(300),
  oxygenPercent: z.number().min(0).max(100),
  // Where it is used or proposed, in plain words, e.g. "Proposed for Moon and Mars habitats".
  usedFor: z.string(),
  sources: z.array(Source).min(1),
  verified: z.boolean(),
});

// One of the four worlds in Same Fire, Four Worlds (F8). "How fire differs here" is not stored
// here: it comes from findings at this gravity, so every sentence keeps its citation.
export const World = z.object({
  id: z.enum(["earth", "iss", "moon", "mars"]),
  name: z.string(),
  gravityG: z.number().min(0).max(2),
  // Missions this world stands for (ISS also stands for Mars transit: both ≈ 0 g).
  missions: z.array(Mission),
  // Cabin atmospheres used or proposed there; the first one is the default.
  atmosphereIds: z.array(z.string()).min(1),
  // A real, credited NASA image of a flame in this world's gravity. None → "never filmed".
  image: z
    .object({ src: z.string(), alt: z.string(), credit: z.string(), sourceUrl: z.url() })
    .optional(),
  sources: z.array(Source).min(1),
  verified: z.boolean(),
});

// Made by the SI (prompts/synthesize.md) from the findings. Never hand-edited.
export const Insight = z.object({
  id: z.string().regex(/^I-\d{2}$/),
  rank: z.number().int().min(1),
  title: z.string(),
  answer: z.string(),
  explanation: z.string(),
  recommendation: z.string(),
  caveats: z.string(),
  risk: Risk,
  missions: z.array(Mission).min(1),
  themes: z.array(Theme).min(1),
  findingIds: z.array(z.string().regex(/^F-\d{3}$/)).min(1),
  scores: z.object({
    safetyRelevance: z.number().int().min(1).max(5),
    severity: z.number().int().min(1).max(5),
    evidence: z.number().int().min(1).max(5),
    actionability: z.number().int().min(1).max(5),
  }),
});

// Who ran the SI and on which findings, so a stale file is caught (npm run data:validate).
const Provenance = {
  generatedAt: z.string(),
  // e.g. "Claude Code (claude-opus-5-5)" for mode A, "claude-opus-5-5" for the API scripts.
  model: z.string(),
  // Hash of data/findings.json when this file was made (findingsHash() in src/lib/validate.ts).
  findingsHash: z.string(),
};

export const InsightsFile = z.object({ ...Provenance, insights: z.array(Insight) });

// A prepared answer for the Ask library (prompts/answer.md). Facts in `answer` carry inline
// citations like [F-004, F-011]; every cited ID must also be in findingIds.
export const Answer = z.object({
  id: z.string().regex(/^Q-\d{2}$/),
  question: z.string().max(200),
  answer: z.string(),
  findingIds: z.array(z.string().regex(/^F-\d{3}$/)),
  themes: z.array(Theme),
  missions: z.array(Mission),
});

export const AnswersFile = z.object({ ...Provenance, answers: z.array(Answer) });

// FLEX Table IX (NASA/TP—2015-216046): one row per ISS droplet test, values exactly as printed.
// null = "–" in the table (not measured, or did not happen). Written by `npm run data:flex`.
const fraction = z.number().min(0).max(1).nullable();
export const FlexTest = z.object({
  test: z.number().int().min(1),
  identifier: z.string(),
  date: z.string(),
  timeGmt: z.string().nullable(),
  fuel: z.enum(["methanol", "heptane"]),
  pressureMmHg: z.number().positive().nullable(),
  o2: fraction,
  n2: fraction,
  co2: fraction,
  he: fraction,
  initialDiameterMm: z.number().positive().nullable(),
  extinctionDiameterMm: z.number().min(0).nullable(), // the table prints 0 for a few tests
  burningRateMm2PerS: z.number().positive().nullable(),
  burnTimeS: z.number().positive().nullable(),
  testEnd: z.enum(["extinction", "disruption", "completion"]),
  page: z.number().int(),
  notes: z.string().optional(),
});

export const FlexDataset = z.object({
  id: z.literal("flex-table-ix"),
  title: z.string(),
  experimentId: z.string(),
  description: z.string(),
  gravityG: z.number(),
  source: Source,
  extractedBy: z.enum(["script", "human"]),
  verified: z.boolean(),
  rows: z.array(FlexTest).min(1),
});

// A NASA formula (docs/data.md › Formulas). Computed only inside `validity`.
const Range = z.tuple([z.number(), z.number()]);
export const Formula = z.object({
  id: z.string().regex(/^FX-\d{2}$/),
  name: z.string(),
  expression: z.string(),
  explanation: z.string(),
  variables: z.array(z.object({ symbol: z.string(), meaning: z.string(), unit: z.string() })).min(1),
  validity: z.object({
    gravityG: Range.optional(),
    oxygenPercent: Range.optional(),
    pressureKPa: Range.optional(),
    flowCmPerS: Range.optional(),
    fuel: z.array(z.string()).optional(),
  }),
  usedIn: z.array(z.enum(["lab", "worlds", "gaps"])),
  sources: z.array(Source).min(1),
  verified: z.boolean(),
});

export type Experiment = z.infer<typeof Experiment>;
export type Formula = z.infer<typeof Formula>;
export type FlexTest = z.infer<typeof FlexTest>;
export type FlexDataset = z.infer<typeof FlexDataset>;
export type Atmosphere = z.infer<typeof Atmosphere>;
export type World = z.infer<typeof World>;
export type Finding = z.infer<typeof Finding>;
export type Insight = z.infer<typeof Insight>;
export type InsightsFile = z.infer<typeof InsightsFile>;
export type Answer = z.infer<typeof Answer>;
export type AnswersFile = z.infer<typeof AnswersFile>;
export type ThemeName = z.infer<typeof Theme>;
