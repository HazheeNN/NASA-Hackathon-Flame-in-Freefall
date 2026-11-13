import { z } from "zod";
import { Experiment, Finding, InsightsFile } from "./schema";

// Cross-record checks that the schemas alone can't express. Used by `npm run data:validate`,
// the unit tests (so CI fails on bad data) and the SI scripts. Returns problems, never throws.
export function validateCorpus(raw: { experiments: unknown; findings: unknown; insights: unknown }): string[] {
  const problems: string[] = [];
  const ex = z.array(Experiment).safeParse(raw.experiments);
  const fi = z.array(Finding).safeParse(raw.findings);
  const ins = InsightsFile.safeParse(raw.insights);
  if (!ex.success) problems.push(`experiments.json: ${z.prettifyError(ex.error)}`);
  if (!fi.success) problems.push(`findings.json: ${z.prettifyError(fi.error)}`);
  if (!ins.success) problems.push(`generated/insights.json: ${z.prettifyError(ins.error)}`);
  if (!ex.success || !fi.success || !ins.success) return problems;

  const dupes = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const id of dupes(ex.data.map((e) => e.id))) problems.push(`Duplicate experiment id ${id}`);
  for (const id of dupes(fi.data.map((f) => f.id))) problems.push(`Duplicate finding id ${id}`);
  for (const id of dupes(ins.data.insights.map((i) => i.id))) problems.push(`Duplicate insight id ${id}`);

  const experimentIds = new Set(ex.data.map((e) => e.id));
  const findingIds = new Set(fi.data.map((f) => f.id));
  for (const f of fi.data) {
    if (!experimentIds.has(f.experimentId)) problems.push(`${f.id}: unknown experimentId "${f.experimentId}"`);
    if (f.verified && f.sources.every((s) => !s.locator)) problems.push(`${f.id}: verified but no source has a page/section locator`);
  }
  for (const i of ins.data.insights) {
    for (const ref of i.findingIds) if (!findingIds.has(ref)) problems.push(`${i.id}: cites missing finding ${ref}`);
  }
  return problems;
}
