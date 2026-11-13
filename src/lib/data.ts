import "server-only";
import { z } from "zod";
import experimentsJson from "../../data/experiments.json";
import findingsJson from "../../data/findings.json";
import answersJson from "../../data/generated/answers.json";
import insightsJson from "../../data/generated/insights.json";
import { AnswersFile, Experiment, Finding, InsightsFile } from "./schema";

// The corpus is small (tens to a few hundred records), so it ships as JSON in the repo:
// no database, nothing to go down during judging (docs/decisions.md). Parsing at import
// time means a bad record fails the build, not the demo.
export const experiments = z.array(Experiment).parse(experimentsJson);
export const findings = z.array(Finding).parse(findingsJson);
export const insights = InsightsFile.parse(insightsJson);
export const answers = AnswersFile.parse(answersJson);

export const experimentById = new Map(experiments.map((e) => [e.id, e]));
export const findingById = new Map(findings.map((f) => [f.id, f]));
