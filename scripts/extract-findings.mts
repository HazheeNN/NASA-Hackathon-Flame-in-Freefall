// npm run si:extract -- <experimentId> <paper.pdf | abstract.txt> "<source title>" <source url> [year]
// Claude reads ONE NASA paper (PDF) or abstract and proposes findings in our schema.
// Output goes to data/raw/proposed/<file>.json, never straight into data/findings.json:
// a teammate reads each proposal against the paper, fixes it, sets verified=true with a
// page locator, and only then copies it in (docs/data.md › Verification).
//
// NOT TESTED against the live API from the session that wrote it (no key there).
import { mkdirSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type Anthropic from "@anthropic-ai/sdk";
import { Finding } from "../src/lib/schema";
import { MODEL, client, logUsage, readJson, stopIfNotDone, writeJson } from "./si.mts";

const [experimentId, file, sourceTitle, sourceUrl, year] = process.argv.slice(2);
if (!experimentId || !file || !sourceTitle || !sourceUrl) {
  console.error('Usage: npm run si:extract -- bass paper.pdf "Paper title" https://ntrs.nasa.gov/citations/123 2014');
  process.exit(1);
}

// Claude proposes everything except the bookkeeping fields we set ourselves.
const Proposed = z.object({
  findings: z.array(Finding.omit({ id: true, experimentId: true, sources: true, extractedBy: true, verified: true }).extend({
    // Where in the paper this comes from, so the checker can find it in a minute.
    locator: z.string(),
    // The sentence(s) from the paper the finding rests on, copied exactly.
    quote: z.string(),
  })),
});

const doc: Anthropic.ContentBlockParam = file.endsWith(".pdf")
  ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: readFileSync(file).toString("base64") } }
  : { type: "text", text: `<paper>\n${readFileSync(file, "utf8")}\n</paper>` };

const system = `You extract fire-safety-relevant findings from NASA microgravity combustion research for a crew-safety dashboard.
Rules:
- Only state what the paper itself states or measures. No outside knowledge, no extrapolation. If the paper is unclear, leave the field out.
- One finding = one claim. Keep "statement" to one or two plain sentences a non-specialist can follow.
- Record conditions (gravity in g, oxygen %, pressure kPa, airflow cm/s, fuel/material) and numbers with units exactly as reported; convert units only when unambiguous.
- "safetyImplication": one sentence on why this matters for a crewed spacecraft or habitat, clearly worded as an implication, not a result.
- evidence.kind: measured | modelled | review | incident-report. evidence.strength: 1 single test, 2 repeated or peer-reviewed, 3 repeated across experiments.
- "locator" is the page/section/figure; "quote" is the exact supporting text.
- Return 0 findings if the paper has nothing relevant to fire safety. 3 to 8 findings is typical.`;

const msg = await client().messages.parse({
  model: MODEL,
  max_tokens: 16000,
  output_config: { effort: "high", format: zodOutputFormat(Proposed) },
  system,
  messages: [{ role: "user", content: [doc, { type: "text", text: "Extract the findings from this paper." }] }],
});
stopIfNotDone("extract", msg);
logUsage("extract", msg.usage);
const proposed = msg.parsed_output;
if (!proposed) {
  console.error("Claude's reply didn't match the schema. Nothing written.");
  process.exit(1);
}

const existing = readJson<{ id: string }[]>("data/findings.json");
let next = Math.max(0, ...existing.map((f) => Number(f.id.slice(2)))) + 1;
const source = { title: sourceTitle, url: sourceUrl, ...(year ? { year: Number(year) } : {}) };
const out = proposed.findings.map(({ locator, quote, ...f }) => ({
  id: `F-${String(next++).padStart(3, "0")}`,
  experimentId,
  ...f,
  sources: [{ ...source, locator }],
  extractedBy: "claude" as const,
  verified: false,
  _quote: quote, // remove before copying into data/findings.json
}));

mkdirSync("data/raw/proposed", { recursive: true });
const target = `data/raw/proposed/${basename(file).replace(/\.[^.]+$/, "")}.json`;
writeJson(target, out);
console.log(`${out.length} proposed findings → ${target}. Check each against the paper before copying it in.`);
