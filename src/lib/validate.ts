import { createHash } from "node:crypto";
import { z } from "zod";
import { AnswersFile, Atmosphere, Experiment, Finding, FlexDataset, Formula, InsightsFile, World } from "./schema";

// Cross-record checks that the schemas alone can't express. Used by `npm run data:validate`,
// the unit tests (so CI fails on bad data) and the SI scripts. Returns problems, never throws.

type Raw = {
  experiments: unknown; findings: unknown; insights: unknown; answers?: unknown;
  atmospheres?: unknown; worlds?: unknown; flex?: unknown; formulas?: unknown;
};

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
  const atm = z.array(Atmosphere).safeParse(raw.atmospheres ?? []);
  const wor = z.array(World).safeParse(raw.worlds ?? []);
  if (!atm.success) problems.push(`atmospheres.json: ${z.prettifyError(atm.error)}`);
  if (!wor.success) problems.push(`worlds.json: ${z.prettifyError(wor.error)}`);
  const fx = z.array(Formula).safeParse(raw.formulas ?? []);
  if (!fx.success) problems.push(`formulas.json: ${z.prettifyError(fx.error)}`);
  const flx = raw.flex === undefined ? undefined : FlexDataset.safeParse(raw.flex);
  if (flx && !flx.success) problems.push(`datasets/flex-table-ix.json: ${z.prettifyError(flx.error)}`);
  if (!ex.success || !fi.success || !ins.success || !ans.success || !atm.success || !wor.success) return problems;

  const dupes = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const id of dupes(ex.data.map((e) => e.id))) problems.push(`Duplicate experiment id ${id}`);
  for (const id of dupes(fi.data.map((f) => f.id))) problems.push(`Duplicate finding id ${id}`);
  for (const id of dupes(ins.data.insights.map((i) => i.id))) problems.push(`Duplicate insight id ${id}`);
  for (const id of dupes(ans.data.answers.map((a) => a.id))) problems.push(`Duplicate answer id ${id}`);
  for (const id of dupes(atm.data.map((a) => a.id))) problems.push(`Duplicate atmosphere id ${id}`);
  for (const id of dupes(wor.data.map((w) => w.id))) problems.push(`Duplicate world id ${id}`);

  const atmosphereIds = new Set(atm.data.map((a) => a.id));
  for (const w of wor.data) {
    for (const ref of w.atmosphereIds) if (!atmosphereIds.has(ref)) problems.push(`world ${w.id}: unknown atmosphere "${ref}"`);
  }
  if (fx.success) for (const id of dupes(fx.data.map((f) => f.id))) problems.push(`Duplicate formula id ${id}`);
  for (const r of [...atm.data, ...wor.data, ...(fx.success ? fx.data : [])]) {
    if (r.verified && r.sources.every((s) => !s.locator)) problems.push(`${r.id}: verified but no source has a page/section locator`);
  }

  const experimentIds = new Set(ex.data.map((e) => e.id));
  if (flx?.success) {
    if (!experimentIds.has(flx.data.experimentId)) problems.push(`flex-table-ix: unknown experimentId "${flx.data.experimentId}"`);
    for (const n of dupes(flx.data.rows.map((r) => String(r.test)))) problems.push(`flex-table-ix: duplicate test FLEX-${n}`);
    for (const r of flx.data.rows) {
      const parts = [r.o2, r.n2, r.co2, r.he];
      if (parts.every((x) => x !== null)) {
        const sum = parts.reduce((a, b) => a! + b!, 0)!;
        // Printed to two decimals; the table omits trace water and fuel vapour.
        if (Math.abs(sum - 1) > 0.03) problems.push(`flex-table-ix: FLEX-${r.test} mole fractions sum to ${sum.toFixed(2)}`);
      }
    }
  }
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
