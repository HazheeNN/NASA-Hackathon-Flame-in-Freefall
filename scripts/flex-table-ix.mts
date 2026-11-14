// npm run data:flex — turns FLEX Table IX into data/datasets/flex-table-ix.json.
// Source: Dietrich et al., "Detailed Results From the Flame Extinguishment Experiment (FLEX)
// March 2009 to December 2011", NASA/TP—2015-216046 (NTRS 20150023456), Table IX, pp. 20–28.
// Downloads the PDF to data/raw/ (git-ignored) if missing, reads it with `pdftotext -layout`
// (poppler-utils: apt install poppler-utils · brew install poppler · Windows: use WSL), and keeps
// every value exactly as printed. Re-run only if the parser changes; the JSON is committed.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const NTRS_ID = "20150023456";
const PDF = "data/raw/flex-tp-2015-216046.pdf";
const OUT = "data/datasets/flex-table-ix.json";

if (!existsSync(PDF)) {
  mkdirSync("data/raw", { recursive: true });
  const res = await fetch(`https://ntrs.nasa.gov/api/citations/${NTRS_ID}/downloads/${NTRS_ID}.pdf`);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  writeFileSync(PDF, Buffer.from(await res.arrayBuffer()));
}
const text = execFileSync("pdftotext", ["-layout", "-f", "1", "-l", "40", PDF, "-"], { encoding: "utf8", maxBuffer: 1 << 26 });

// "–" (en dash) in the table means "not measured / did not occur".
const num = (s: string) => (s === "–" || s === "-" ? null : Number(s.replace(/^~/, "")));
const ROW = /^\s*FLEX[–-](\d{3})\s+(\S+)\s+(\d+\/\d+\/\d+)\s+(\S+)\s+(Methanol|Heptane)\s+(.*)$/;
const FOOTER = /^\s*NASA\/TP—2015-216046\s+(\d+)\s*$/;

type Row = Record<string, unknown> & { test: number };
const rows: Row[] = [];
let pending: Row[] = [];
for (const line of text.split("\n")) {
  const footer = line.match(FOOTER);
  if (footer) {
    for (const r of pending) r.page = Number(footer[1]);
    pending = [];
    continue;
  }
  const m = line.match(ROW);
  if (!m) continue;
  const [, test, identifier, date, timeGmt, fuel, rest] = m;
  const t = rest.trim().split(/\s+/);
  if (t.length !== 10) throw new Error(`FLEX-${test}: expected 10 values, got ${t.length}: ${rest}`);
  const [p, o2, n2, co2, he, d0, dExt, k, burn, end] = t;
  const notes: string[] = [];
  if (burn.startsWith("~")) notes.push("Burn time printed as approximate (~).");
  let pressure = num(p);
  if (pressure === 0) {
    pressure = null;
    notes.push("Pressure printed as 0, which is not physical: treated as missing.");
  }
  const row: Row = {
    test: Number(test),
    identifier,
    date,
    timeGmt: timeGmt === "–" ? null : timeGmt,
    fuel: fuel.toLowerCase(),
    pressureMmHg: pressure,
    o2: num(o2),
    n2: num(n2),
    co2: num(co2),
    he: num(he),
    initialDiameterMm: num(d0),
    extinctionDiameterMm: num(dExt),
    burningRateMm2PerS: num(k),
    burnTimeS: num(burn),
    testEnd: end.toLowerCase(),
  };
  if (notes.length) row.notes = notes.join(" ");
  rows.push(row);
  pending.push(row);
}

const dataset = {
  id: "flex-table-ix",
  title: "FLEX Table IX: results by test number",
  experimentId: "flex",
  description:
    "Every FLEX droplet-combustion test on the ISS, March 2009 to December 2011: fuel, ambient pressure and composition, initial droplet diameter, visible-flame extinction diameter, burning-rate constant (linear fit of droplet diameter squared versus time), burn time and how the test ended. Microgravity (ISS).",
  gravityG: 0,
  source: {
    title: "Detailed Results From the Flame Extinguishment Experiment (FLEX) March 2009 to December 2011 (NASA/TP—2015-216046)",
    url: `https://ntrs.nasa.gov/citations/${NTRS_ID}`,
    year: 2015,
    ntrsId: NTRS_ID,
    locator: "Table IX, pp. 20–28; column definitions p. 19",
  },
  extractedBy: "script",
  verified: false,
  rows,
};
mkdirSync("data/datasets", { recursive: true });
writeFileSync(OUT, JSON.stringify(dataset, null, 1) + "\n");
const count = (k: string) => rows.filter((r) => r.testEnd === k).length;
console.log(`${rows.length} tests → ${OUT} · extinction ${count("extinction")} · disruption ${count("disruption")} · completion ${count("completion")}`);
