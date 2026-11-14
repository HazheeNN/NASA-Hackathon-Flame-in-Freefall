"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { EmptyState, ThemeChip, VerifiedBadge } from "@/components/ui";
import type { LabTest } from "@/lib/lab";

export type FindingRow = {
  id: string;
  title: string;
  statement: string;
  experiment: string;
  themes: string[];
  gravityG?: number;
  oxygenPercent?: number;
  verified: boolean;
};

const END_TEXT = { extinction: "Went out", disruption: "Broke apart", completion: "Burned out" } as const;

export function FindingsExplorer({ findings, tests, datasetVerified }: { findings: FindingRow[]; tests: LabTest[] | null; datasetVerified: boolean }) {
  const params = useSearchParams();
  const [tab, setTab] = useState<"findings" | "datasets">(params.get("tab") === "datasets" ? "datasets" : "findings");
  const tabCls = (on: boolean) => `h-10 rounded-full px-4 text-[14px] font-semibold ${on ? "bg-fg text-page" : "bg-raised text-fg hover:bg-line"}`;
  return (
    <div className="space-y-6">
      <div role="tablist" className="flex gap-2">
        <button role="tab" aria-selected={tab === "findings"} className={tabCls(tab === "findings")} onClick={() => setTab("findings")}>
          Findings ({findings.length})
        </button>
        <button role="tab" aria-selected={tab === "datasets"} className={tabCls(tab === "datasets")} onClick={() => setTab("datasets")}>
          FLEX dataset ({tests?.length ?? 0} tests)
        </button>
      </div>
      {tab === "findings" ? <Findings rows={findings} /> : <Dataset tests={tests} verified={datasetVerified} />}
    </div>
  );
}

function Findings({ rows }: { rows: FindingRow[] }) {
  const [q, setQ] = useState("");
  const [exp, setExp] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const exps = [...new Set(rows.map((r) => r.experiment))].sort();
  const shown = rows.filter(
    (r) =>
      (exp === "all" || r.experiment === exp) &&
      (!verifiedOnly || r.verified) &&
      (!q || `${r.id} ${r.title} ${r.statement}`.toLowerCase().includes(q.toLowerCase())),
  );
  if (!rows.length)
    return (
      <EmptyState title="No verified findings yet">
        Findings are claims from NASA papers, each checked by a teammate against the page it comes from. They appear here as soon
        as the first ones are verified. The FLEX dataset tab already has 276 real tests.
      </EmptyState>
    );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search findings" className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-raised px-3" />
        <select value={exp} onChange={(e) => setExp(e.target.value)} className="h-10 rounded-lg border border-line bg-raised px-3">
          <option value="all">All experiments</option>
          {exps.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} /> Verified only
        </label>
      </div>
      <p className="text-[13px] text-muted">{shown.length} findings</p>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((f) => (
          <li key={f.id} className="relative flex flex-col gap-3 rounded-xl border border-line bg-surface p-5 hover:bg-raised">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[13px] text-muted">
                {f.id} · {f.experiment}
              </span>
              <VerifiedBadge verified={f.verified} />
            </div>
            <Link href={`/findings/${f.id}`} className="font-semibold after:absolute after:inset-0">
              {f.title}
            </Link>
            <p className="text-[14px] text-muted">{f.statement}</p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {f.themes.map((t) => (
                <ThemeChip key={t} theme={t} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dataset({ tests, verified }: { tests: LabTest[] | null; verified: boolean }) {
  const [fuel, setFuel] = useState("all");
  const [end, setEnd] = useState("all");
  const [all, setAll] = useState(false);
  const rows = useMemo(() => (tests ?? []).filter((t) => (fuel === "all" || t.fuel === fuel) && (end === "all" || t.end === end)), [tests, fuel, end]);
  if (!tests) return <EmptyState title="Dataset not verified yet">The live site shows the FLEX table once a teammate has spot-checked it against the NASA report.</EmptyState>;
  const shown = all ? rows : rows.slice(0, 40);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="h-10 rounded-lg border border-line bg-raised px-3">
          <option value="all">All fuels</option>
          <option value="heptane">Heptane</option>
          <option value="methanol">Methanol</option>
        </select>
        <select value={end} onChange={(e) => setEnd(e.target.value)} className="h-10 rounded-lg border border-line bg-raised px-3">
          <option value="all">All outcomes</option>
          <option value="extinction">Flame went out</option>
          <option value="disruption">Droplet broke apart</option>
          <option value="completion">Burned to the end</option>
        </select>
        <VerifiedBadge verified={verified} />
        <a href="https://ntrs.nasa.gov/citations/20150023456" target="_blank" rel="noreferrer" className="ml-auto text-[14px] text-primary hover:underline">
          Source: FLEX Table IX, NASA/TP—2015-216046
        </a>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[720px] text-left text-[14px]">
          <thead className="bg-surface text-muted">
            <tr>
              {["Test", "Fuel", "Pressure (kPa)", "O₂ (%)", "Diluent", "K (mm²/s)", "Outcome", "Page"].map((h) => (
                <th key={h} scope="col" className="px-3 py-2.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line font-mono tabular">
            {shown.map((t) => (
              <tr key={t.test} className="hover:bg-surface">
                <td className="px-3 py-2">FLEX-{String(t.test).padStart(3, "0")}</td>
                <td className="px-3 py-2 font-sans capitalize">{t.fuel}</td>
                <td className="px-3 py-2">{t.pKPa === null ? "–" : t.pKPa.toFixed(1)}</td>
                <td className="px-3 py-2">{t.o2 === null ? "–" : (t.o2 * 100).toFixed(0)}</td>
                <td className="px-3 py-2 font-sans">{t.co2 ? `CO₂ ${(t.co2 * 100).toFixed(0)} %` : t.he ? `He ${(t.he * 100).toFixed(0)} %` : "N₂"}</td>
                <td className="px-3 py-2">{t.k ?? "–"}</td>
                <td className="px-3 py-2 font-sans">{END_TEXT[t.end]}</td>
                <td className="px-3 py-2">{t.page}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 40 && (
        <button type="button" onClick={() => setAll(!all)} className="h-10 rounded-full bg-raised px-4 text-[14px] font-semibold hover:bg-line">
          {all ? "Show fewer" : `Show all ${rows.length} tests`}
        </button>
      )}
    </div>
  );
}
