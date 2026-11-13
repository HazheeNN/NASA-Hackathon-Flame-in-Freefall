// npm run data:validate — checks every JSON file in data/ against src/lib/schema.ts and the
// cross-record rules in src/lib/validate.ts. Run it after any hand edit or script run.
import { readFileSync } from "node:fs";
import { validateCorpus } from "../src/lib/validate";

const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const problems = validateCorpus({
  experiments: read("data/experiments.json"),
  findings: read("data/findings.json"),
  insights: read("data/generated/insights.json"),
});
const findings = read("data/findings.json") as { verified: boolean }[];
console.log(`${findings.length} findings, ${findings.filter((f) => f.verified).length} verified`);
if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join("\n"));
  process.exit(1);
}
console.log("✓ data is valid");
