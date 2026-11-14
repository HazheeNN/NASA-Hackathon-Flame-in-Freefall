import "server-only";
import { answers, atmospheres, experiments, findings, flex, formulas, worlds } from "./data";
import { visible } from "./visibility";
import { showUnverified } from "./visibility";

export type SearchItem = { kind: "Answer" | "Finding" | "Experiment" | "Dataset" | "Cabin air" | "Formula" | "World"; title: string; text: string; href: string };

// Everything the Ask search can match. Small (a few hundred items), so it ships to the browser.
export function searchIndex(): SearchItem[] {
  return [
    ...answers.answers.map((a) => ({ kind: "Answer" as const, title: a.question, text: a.answer, href: `/ask?q=${encodeURIComponent(a.question)}#${a.id}` })),
    ...visible(findings).map((f) => ({ kind: "Finding" as const, title: `${f.id} · ${f.title}`, text: f.statement, href: `/findings/${f.id}` })),
    ...visible(experiments).map((e) => ({ kind: "Experiment" as const, title: e.acronym ? `${e.acronym} · ${e.name}` : e.name, text: e.summary, href: `/sources#${e.id}` })),
    ...(showUnverified || flex.verified ? [{ kind: "Dataset" as const, title: flex.title, text: flex.description, href: "/findings?tab=datasets" }] : []),
    ...visible(atmospheres).map((a) => ({ kind: "Cabin air" as const, title: a.name, text: a.usedFor, href: "/sources#atmospheres" })),
    ...visible(formulas).map((f) => ({ kind: "Formula" as const, title: `${f.id} · ${f.name}`, text: f.explanation, href: "/sources#formulas" })),
    ...visible(worlds).map((w) => ({ kind: "World" as const, title: w.name, text: `${w.gravityG} g`, href: "/" })),
  ];
}
