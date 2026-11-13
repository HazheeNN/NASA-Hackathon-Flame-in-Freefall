// Shared bits for the SI scripts: mode B of the SI, only with an API key (docs/ai.md).
// Run with tsx on your laptop, never in the browser.
// src/lib/claude.ts is the app's copy; this one avoids "server-only", which throws outside Next.
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync } from "node:fs";

export const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";

export function client() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set. Put it in .env.local (npm run si:* loads it). See docs/runbook.md.");
    process.exit(1);
  }
  return new Anthropic();
}

// The SI instructions live in prompts/*.md, shared with mode A (Claude Code). See prompts/README.md.
export const prompt = (name: "extract" | "synthesize" | "answer") => readFileSync(`prompts/${name}.md`, "utf8");

export const readJson = <T,>(path: string): T => JSON.parse(readFileSync(path, "utf8")) as T;
export const writeJson = (path: string, data: unknown) => writeFileSync(path, JSON.stringify(data, null, 2) + "\n");

// Every run prints what it cost, so the team can watch the API budget (docs/ai.md › Cost).
// Prices per million tokens for claude-opus-5-5; update if you switch CLAUDE_MODEL.
export function logUsage(label: string, u: Anthropic.Usage) {
  const cost =
    (u.input_tokens * 4 + (u.cache_creation_input_tokens ?? 0) * 5 + (u.cache_read_input_tokens ?? 0) * 0.2 + u.output_tokens * 20) / 1e6;
  console.log(
    `${label}: in ${u.input_tokens}, cache write ${u.cache_creation_input_tokens ?? 0}, cache read ${u.cache_read_input_tokens ?? 0}, out ${u.output_tokens} ≈ $${cost.toFixed(3)}`,
  );
}

export function stopIfNotDone(label: string, msg: Anthropic.Message) {
  if (msg.stop_reason === "refusal") {
    console.error(`${label}: Claude declined (${msg.stop_details?.category ?? "no category"}). Nothing written.`);
    process.exit(1);
  }
  if (msg.stop_reason === "max_tokens") {
    console.error(`${label}: output was cut off at max_tokens. Nothing written; raise max_tokens or send less.`);
    process.exit(1);
  }
}
