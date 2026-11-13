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

export type Experiment = z.infer<typeof Experiment>;
export type Finding = z.infer<typeof Finding>;
export type Insight = z.infer<typeof Insight>;
export type InsightsFile = z.infer<typeof InsightsFile>;
export type Answer = z.infer<typeof Answer>;
export type AnswersFile = z.infer<typeof AnswersFile>;
export type ThemeName = z.infer<typeof Theme>;
