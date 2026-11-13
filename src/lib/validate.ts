import { createHash } from "node:crypto";
import { z } from "zod";
import { AnswersFile, Experiment, Finding, InsightsFile } from "./schema";

// Cross-record checks that the schemas alone can't express. Used by `npm run data:validate`,
// the unit tests (so CI fails on bad data) and the SI scripts. Returns problems, never throws.

type Raw = { experiments: unknown; findings: unknown; insights: unknown; answers?: unknown };

// Identifies the set of findings an SI output was made from. Formatting-independent.
export function findingsHash(findings: unknown) {
  return createHash("sha256").update(JSON.stringify(findings)).digest("hex").slice(0, 16);
}

const CITE = /\[(F-\d{3}(?:\s*,\s*F-\d{3})*)\]/g;
export function inlineCitations(text: string) {
  return [...text.matchAll(CITE)].flatMap((m) => m[1].split(/\s*,\s*/));
}

export function validateCorpus(raw: Raw): string[] {
  const problems: string[] = [];
  const ex = z.array(Experiment).safeParse(raw.experiments);
  const fi = z.array(Finding).safeParse(raw.findings);
  const ins = InsightsFile.safeParse(raw.insights);
  const ans = AnswersFile.safeParse(raw.answers ?? { generatedAt: "", model: "", findingsHash: "", answers: [] });
  if (!ex.success) problems.push(`experiments.json: ${z.prettifyError(ex.error)}`);
  if (!fi.success) problems.push(`findings.json: ${z.prettifyError(fi.error)}`);
  if (!ins.success) problems.push(`generated/insights.json: ${z.prettifyError(ins.error)}`);
  if (!ans.success) problems.push(`generated/answers.json: ${z.prettifyError(ans.error)}`);
  if (!ex.success || !fi.success || !ins.success || !ans.success) return problems;

  const dupes = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const id of dupes(ex.data.map((e) => e.id))) problems.push(`Duplicate experiment id ${id}`);
  for (const id of dupes(fi.data.map((f) => f.id))) problems.push(`Duplicate finding id ${id}`);
  for (const id of dupes(ins.data.insights.map((i) => i.id))) problems.push(`Duplicate insight id ${id}`);
  for (const id of dupes(ans.data.answers.map((a) => a.id))) problems.push(`Duplicate answer id ${id}`);

  const experimentIds = new Set(ex.data.map((e) => e.id));
  const findingIds = new Set(fi.data.map((f) => f.id));
  for (const f of fi.data) {
    if (!experimentIds.has(f.experimentId)) problems.push(`${f.id}: unknown experimentId "${f.experimentId}"`);
    if (f.verified && f.sources.every((s) => !s.locator)) problems.push(`${f.id}: verified but no source has a page/section locator`);
  }
  for (const i of ins.data.insights) {
    for (const ref of i.findingIds) if (!findingIds.has(ref)) problems.push(`${i.id}: cites missing finding ${ref}`);
  }
  for (const a of ans.data.answers) {
    for (const ref of a.findingIds) if (!findingIds.has(ref)) problems.push(`${a.id}: cites missing finding ${ref}`);
    for (const ref of inlineCitations(a.answer)) {
      if (!a.findingIds.includes(ref)) problems.push(`${a.id}: cites ${ref} in the text but not in findingIds`);
    }
  }
  return problems;
}

// Not errors (CI stays green while the corpus grows), but the SI output must be rebuilt
// before the demo. Printed by `npm run data:validate`.
export function staleWarnings(raw: Raw): string[] {
  const current = findingsHash(raw.findings);
  const out: string[] = [];
  for (const [name, file] of [["insights", raw.insights], ["answers", raw.answers]] as const) {
    const f = file as { findingsHash?: string; insights?: unknown[]; answers?: unknown[] } | undefined;
    const items = f?.insights ?? f?.answers ?? [];
    if (items.length && f?.findingsHash !== current) out.push(`${name} were made from older findings: rebuild them (si-run skill)`);
  }
  return out;
}
