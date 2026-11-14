import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Citations, Label, MissionChip, PageHeader, RiskBadge, SampleBanner } from "@/components/ui";
import { displayInsights, showingSample } from "@/lib/data";

export const metadata = { title: "Ranked insights · Flame in Freefall" };

// F5: every insight by rank. Filters by mission and theme come in WP3c.
export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Ranked fire-safety insights"
        icon={<Sparkles size={28} strokeWidth={1.75} className="text-primary" aria-hidden />}
        lead="Our SI read the findings, linked them across experiments and ranked what matters most for crew safety. Each insight cites the NASA findings behind it."
      />
      {showingSample && <SampleBanner />}
      {displayInsights.length === 0 ? (
        <p className="text-muted">No insights yet. They appear after the first SI run (docs/ai.md).</p>
      ) : (
        <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayInsights.map((i) => (
            <li key={i.id} className="relative flex flex-col gap-4 rounded-2xl bg-surface p-6 transition-colors duration-200 hover:bg-raised">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[13px] text-muted">
                  #{i.rank} · {i.id}
                </span>
                <RiskBadge risk={i.risk} />
              </div>
              <h2 className="text-xl font-semibold leading-snug">
                {/* The whole card is the click target (DESIGN.md › Cards). */}
                <Link href={`/insights/${i.id}`} className="after:absolute after:inset-0 after:rounded-2xl">
                  {i.title}
                </Link>
              </h2>
              <p className="text-muted">{i.answer}</p>
              <div className="mt-auto space-y-3">
                <div className="flex flex-wrap gap-2">
                  {i.missions.map((m) => (
                    <MissionChip key={m} mission={m} />
                  ))}
                </div>
                <div className="relative z-10 flex flex-wrap items-center gap-2">
                  <Label>Evidence</Label>
                  <Citations ids={i.findingIds} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
