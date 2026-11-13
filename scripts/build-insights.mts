// npm run si:build — the "summarize, rank, interpret" step of the challenge, mode B (needs
// ANTHROPIC_API_KEY). Mode A without a key: the si-run skill, same prompts/synthesize.md.
// Sends the whole findings corpus to Claude once and gets back ranked fire-safety insights
// that cite finding IDs. Output: data/generated/insights.json (committed, so the demo never
// waits on the API). Re-run whenever data/findings.json changes; the file records which
// findings it was built from (findingsHash).
//
// NOT TESTED against the live API from the session that wrote it (no key there).
import { readFileSync } from "node:fs";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { Insight, type Finding } from "../src/lib/schema";
import { findingsHash, validateCorpus } from "../src/lib/validate";
import { MODEL, client, logUsage, prompt, readJson, stopIfNotDone, writeJson } from "./si.mts";

const findingsText = readFileSync("data/findings.json", "utf8");
const findings = JSON.parse(findingsText) as Finding[];
if (!findings.length) {
  console.error("data/findings.json is empty. Add findings first (docs/data.md › Workflow).");
  process.exit(1);
}
const experiments = readJson<unknown>("data/experiments.json");

const Proposed = z.object({ insights: z.array(Insight.omit({ id: true })) });

// The rubric (prompts/synthesize.md) is the heart of "ranking" (docs/ai.md › Ranking).
const system = prompt("synthesize");

const msg = await client().messages.parse({
  model: MODEL,
  max_tokens: 32000,
  output_config: { effort: "high", format: zodOutputFormat(Proposed) },
  system,
  messages: [
    {
      role: "user",
      content: [
        // Stable corpus first and cached, the question last (docs/ai.md › Cost).
        { type: "text", text: `<experiments>\n${JSON.stringify(experiments)}\n</experiments>` },
        { type: "text", text: `<findings>\n${findingsText}\n</findings>`, cache_control: { type: "ephemeral" } },
        { type: "text", text: "Write the ranked fire safety insights." },
      ],
    },
  ],
});
stopIfNotDone("insights", msg);
logUsage("insights", msg.usage);
if (!msg.parsed_output) {
  console.error("Claude's reply didn't match the schema. Nothing written.");
  process.exit(1);
}

const insights = [...msg.parsed_output.insights]
  .sort((a, b) => a.rank - b.rank)
  .map((ins, i) => ({ id: `I-${String(i + 1).padStart(2, "0")}`, ...ins, rank: i + 1 }));

const file = {
  generatedAt: new Date().toISOString(),
  model: MODEL,
  findingsHash: findingsHash(findings),
  insights,
};
const problems = validateCorpus({ experiments, findings, insights: file });
if (problems.length) {
  console.error("Claude's insights failed validation (often a made-up finding ID). Nothing written:\n" + problems.join("\n"));
  process.exit(1);
}
writeJson("data/generated/insights.json", file);
console.log(`${insights.length} insights → data/generated/insights.json`);
