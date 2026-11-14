"use client";

import Link from "next/link";
import { useState } from "react";
import { Citations, ConfidenceMeter, EmptyState, MissionChip, RiskBadge } from "@/components/ui";
import type { InsightCard } from "@/lib/views";

const MISSIONS = ["ISS", "Artemis (Moon)", "Mars transit", "Mars surface"];

export function InsightsList({ cards }: { cards: InsightCard[] }) {
  const [mission, setMission] = useState<string | null>(null);
  const [risk, setRisk] = useState<string | null>(null);
  const shown = cards.filter((c) => (!mission || c.missions.includes(mission as InsightCard["missions"][number])) && (!risk || c.risk === risk));
  const pill = (on: boolean) => `h-9 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${on ? "bg-fg text-page" : "bg-raised text-fg hover:bg-line"}`;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter insights">
        <button type="button" className={pill(!mission)} aria-pressed={!mission} onClick={() => setMission(null)}>
          All missions
        </button>
        {MISSIONS.map((m) => (
          <button key={m} type="button" className={pill(mission === m)} aria-pressed={mission === m} onClick={() => setMission(mission === m ? null : m)}>
            {m}
          </button>
        ))}
        <span className="mx-2 hidden h-6 w-px bg-line sm:block" aria-hidden />
        {(["high", "medium", "low"] as const).map((r) => (
          <button key={r} type="button" className={pill(risk === r)} aria-pressed={risk === r} onClick={() => setRisk(risk === r ? null : r)}>
            {r[0].toUpperCase() + r.slice(1)} risk
          </button>
        ))}
        <span className="ml-auto text-[13px] text-muted">{shown.length} shown</span>
      </div>
      {shown.length === 0 ? (
        <EmptyState title="No insights match">Clear a filter, or wait for the next SI run on verified findings.</EmptyState>
      ) : (
        <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((i) => (
            <li key={i.id} className="relative flex flex-col gap-4 rounded-xl border border-line bg-surface p-6 transition-colors duration-200 hover:bg-raised">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[13px] text-muted">#{i.rank} · {i.id}</span>
                <RiskBadge risk={i.risk} />
              </div>
              <h2 className="text-[19px] font-semibold leading-snug">
                <Link href={`/insights/${i.id}`} className="after:absolute after:inset-0 after:rounded-xl">
                  {i.title}
                </Link>
              </h2>
              <p className="text-muted">{i.answer}</p>
              <div className="mt-auto space-y-4">
                <div className="flex flex-wrap gap-2">
                  {i.missions.map((m) => (
                    <MissionChip key={m} mission={m} />
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow">Evidence</span>
                  <Citations ids={i.findingIds} />
                </div>
                <ConfidenceMeter c={i.confidence} compact />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
