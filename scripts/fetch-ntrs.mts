// npm run data:ntrs -- "flame spread microgravity"  [more queries…]
// Searches the NASA Technical Reports Server (public, no key) and saves candidate papers to
// data/raw/ntrs/<query>.json (git-ignored). A person then picks which papers to read and
// turns them into findings (docs/data.md › Workflow). Nothing here goes into the app directly.
//
// NOT TESTED from the cloud session that wrote it (ntrs.nasa.gov was blocked there).
// First run on a laptop: check the field names below against one real response.
import { mkdirSync } from "node:fs";
import { writeJson } from "./si.mts";

type NtrsResult = {
  id: number | string;
  title?: string;
  abstract?: string;
  publications?: { publicationDate?: string }[];
  distributionDate?: string;
  subjectCategories?: string[];
};

const queries = process.argv.slice(2);
if (!queries.length) {
  console.error('Usage: npm run data:ntrs -- "query one" "query two"');
  process.exit(1);
}

mkdirSync("data/raw/ntrs", { recursive: true });
for (const q of queries) {
  const url = `https://ntrs.nasa.gov/api/citations/search?q=${encodeURIComponent(q)}&page.size=50`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    console.error(`${q}: HTTP ${res.status}`);
    continue;
  }
  const body = (await res.json()) as { results?: NtrsResult[]; stats?: { total?: number } };
  const rows = (body.results ?? []).map((r) => ({
    ntrsId: String(r.id),
    title: r.title ?? "",
    year: Number((r.publications?.[0]?.publicationDate ?? r.distributionDate ?? "").slice(0, 4)) || undefined,
    url: `https://ntrs.nasa.gov/citations/${r.id}`,
    abstract: r.abstract ?? "",
    subjects: r.subjectCategories ?? [],
  }));
  const file = `data/raw/ntrs/${q.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
  writeJson(file, rows);
  console.log(`${q}: ${rows.length} of ${body.stats?.total ?? "?"} results → ${file}`);
}
