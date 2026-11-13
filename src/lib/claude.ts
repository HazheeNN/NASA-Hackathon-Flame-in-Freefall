import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// The one place the app talks to Claude (docs/ai.md). Server only: the key never reaches
// the browser. Default model: Claude Opus 5.5. Override with CLAUDE_MODEL (e.g. a cheaper
// model while developing) without touching code.
export const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";

// Live SI can be switched off (LIVE_SI=off) so the demo falls back to the pre-built
// insights if the key runs out or the API is slow during judging.
export const liveSiEnabled = () => Boolean(process.env.ANTHROPIC_API_KEY) && process.env.LIVE_SI !== "off";

let client: Anthropic | undefined;
export function claude() {
  client ??= new Anthropic();
  return client;
}
