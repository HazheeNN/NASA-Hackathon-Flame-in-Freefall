import "server-only";
import { z } from "zod";
import atmospheresJson from "../../data/atmospheres.json";
import experimentsJson from "../../data/experiments.json";
import findingsJson from "../../data/findings.json";
import answersJson from "../../data/generated/answers.json";
import insightsJson from "../../data/generated/insights.json";
import worldsJson from "../../data/worlds.json";
import { AnswersFile, Atmosphere, Experiment, Finding, InsightsFile, World } from "./schema";

// The corpus is small (tens to a few hundred records), so it ships as JSON in the repo:
// no database, nothing to go down during judging (docs/decisions.md). Parsing at import
// time means a bad record fails the build, not the demo.
export const experiments = z.array(Experiment).parse(experimentsJson);
export const findings = z.array(Finding).parse(findingsJson);
export const insights = InsightsFile.parse(insightsJson);
export const answers = AnswersFile.parse(answersJson);
export const atmospheres = z.array(Atmosphere).parse(atmospheresJson);
export const worlds = z.array(World).parse(worldsJson);

export const experimentById = new Map(experiments.map((e) => [e.id, e]));
export const findingById = new Map(findings.map((f) => [f.id, f]));
export const atmosphereById = new Map(atmospheres.map((a) => [a.id, a]));
export const worldById = new Map(worlds.map((w) => [w.id, w]));
