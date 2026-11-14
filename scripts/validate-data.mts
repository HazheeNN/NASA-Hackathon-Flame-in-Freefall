// npm run data:validate — checks every JSON file in data/ against src/lib/schema.ts and the
// cross-record rules in src/lib/validate.ts. Run it after any hand edit or SI run.
// It also prints the findings hash to put in an SI output file (mode A, docs/ai.md).
import { readFileSync } from "node:fs";
import { findingsHash, staleWarnings, validateCorpus } from "../src/lib/validate";

const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const raw = {
  experiments: read("data/experiments.json"),
  findings: read("data/findings.json"),
  insights: read("data/generated/insights.json"),
  answers: read("data/generated/answers.json"),
  atmospheres: read("data/atmospheres.json"),
  worlds: read("data/worlds.json"),
  flex: read("data/datasets/flex-table-ix.json"),
};
const findings = raw.findings as { verified: boolean }[];
console.log(`${raw.experiments.length} experiments · ${findings.length} findings (${findings.filter((f) => f.verified).length} verified) · ${raw.insights.insights.length} insights · ${raw.answers.answers.length} answers · ${raw.worlds.length} worlds · ${raw.atmospheres.length} atmospheres · ${raw.flex.rows.length} FLEX tests`);
console.log(`findingsHash: ${findingsHash(raw.findings)}`);
for (const w of staleWarnings(raw)) console.warn(`! ${w}`);
const problems = validateCorpus(raw);
if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join("\n"));
  process.exit(1);
}
console.log("✓ data is valid");
