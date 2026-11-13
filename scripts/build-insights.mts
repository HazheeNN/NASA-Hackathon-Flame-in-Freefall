// npm run si:build — the "summarize, rank, interpret" step of the challenge.
// Sends the whole findings corpus to Claude once and gets back ranked fire-safety insights
// that cite finding IDs. Output: data/generated/insights.json (committed, so the demo never
// waits on the API). Re-run whenever data/findings.json changes; the file records which
// findings it was built from (findingsHash).
//
// NOT TESTED against the live API from the session that wrote it (no key there).
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { Insight, type Finding } from "../src/lib/schema";
import { validateCorpus } from "../src/lib/validate";
import { MODEL, client, logUsage, readJson, stopIfNotDone, writeJson } from "./si.mts";

const findingsText = readFileSync("data/findings.json", "utf8");
const findings = JSON.parse(findingsText) as Finding[];
if (!findings.length) {
  console.error("data/findings.json is empty. Add findings first (docs/data.md › Workflow).");
  process.exit(1);
}
const experiments = readJson<unknown>("data/experiments.json");

const Proposed = z.object({ insights: z.array(Insight.omit({ id: true })) });

// The rubric is the heart of "ranking" (docs/ai.md › Ranking). Judges will ask how the
// order was decided: the answer is these four scores, shown on every insight card.
const system = `You are a spacecraft fire safety analyst. You turn NASA microgravity combustion findings into ranked, actionable fire safety insights for crewed exploration (ISS, Artemis lunar missions, Mars transit, Mars surface).

Work only from the findings provided. Every insight must cite the finding IDs (F-###) it rests on; never cite anything else and never add facts that are not in the findings. If findings disagree, say so in "caveats".

Write 8 to 15 insights. Each one connects several findings where possible (patterns across experiments are worth more than restating one result).
For each insight:
- "title": a short headline (max 10 words).
- "answer": one sentence a mission planner can act on. Lead with it.
- "explanation": 2 to 4 plain sentences on the physics and the evidence, for a smart non-specialist.
- "recommendation": a concrete design or operations action.
- "caveats": limits of the evidence (sample sizes, gravity levels not tested, unverified findings, extrapolation to partial gravity).
- "missions": which mission contexts it applies to. Partial gravity (Moon 0.17 g, Mars 0.38 g) is often untested: say so rather than assume.
- "scores" (integers 1-5): safetyRelevance (how directly it affects crew fire safety), severity (how bad the fire scenario is), evidence (strength and verification of the cited findings; unverified findings cap this at 3), actionability (how clearly it leads to a design or procedure change).
- "risk": high | medium | low, for the scenario the insight describes.
- "rank": 1 = most important. Rank by safetyRelevance and severity first, then evidence, then actionability.`;

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
  findingsHash: createHash("sha256").update(findingsText).digest("hex").slice(0, 16),
  insights,
};
const problems = validateCorpus({ experiments, findings, insights: file });
if (problems.length) {
  console.error("Claude's insights failed validation (often a made-up finding ID). Nothing written:\n" + problems.join("\n"));
  process.exit(1);
}
writeJson("data/generated/insights.json", file);
console.log(`${insights.length} insights → data/generated/insights.json`);
