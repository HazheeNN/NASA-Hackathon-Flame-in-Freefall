import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiLabel, Card, Citations, ConfidenceMeter, Label, MissionChip, RiskBadge, SampleBanner, ThemeChip, VerifiedBadge } from "@/components/ui";
import { confidence } from "@/lib/views";
import { displayFindingById, displayInsights, experimentById, showingSample } from "@/lib/data";

export function generateStaticParams() {
  return displayInsights.map((i) => ({ id: i.id }));
}

const SCORES = [
  ["safetyRelevance", "Safety relevance"],
  ["severity", "Severity"],
  ["evidence", "Evidence"],
  ["actionability", "Actionability"],
] as const;

// F5 detail: answer → explanation → recommendation → caveats → cited findings.
export default async function InsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const insight = displayInsights.find((i) => i.id === id);
  if (!insight) notFound();
  const cited = insight.findingIds.map((f) => displayFindingById.get(f)).filter((f) => f !== undefined);

  return (
    <div className="space-y-8">
      <Link href="/insights" className="inline-flex items-center gap-2 text-[15px] text-muted hover:text-fg">
        <ArrowLeft size={20} strokeWidth={1.75} aria-hidden /> All insights
      </Link>
      {showingSample && <SampleBanner />}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[13px] text-muted">
                #{insight.rank} · {insight.id}
              </span>
              <RiskBadge risk={insight.risk} />
            </div>
            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.01em]">{insight.title}</h1>
            <p className="text-[17px] leading-relaxed">
              {insight.answer} <Citations ids={insight.findingIds} />
            </p>
            <AiLabel count={insight.findingIds.length} />
          </header>

          {(
            [
              ["Why", insight.explanation],
              ["What to do", insight.recommendation],
              ["Caveats", insight.caveats],
            ] as const
          ).map(([label, text]) => (
            <Card key={label}>
              <Label>{label}</Label>
              <p className="mt-2 text-[17px] leading-relaxed">{text}</p>
            </Card>
          ))}
        </div>

        <aside className="space-y-6">
          <Card>
            <ConfidenceMeter c={confidence(insight)} />
          </Card>
          <Card>
            <Label>How it ranks</Label>
            <dl className="mt-4 space-y-3">
              {SCORES.map(([key, name]) => (
                <div key={key}>
                  <div className="flex justify-between text-[15px]">
                    <dt className="text-muted">{name}</dt>
                    <dd className="font-mono tabular">{insight.scores[key]} / 5</dd>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-raised" aria-hidden>
                    <div className="h-1.5 rounded-full bg-primary" style={{ width: `${insight.scores[key] * 20}%` }} />
                  </div>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <Label>Applies to</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {insight.missions.map((m) => (
                <MissionChip key={m} mission={m} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {insight.themes.map((t) => (
                <ThemeChip key={t} theme={t} />
              ))}
            </div>
          </Card>
        </aside>
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <FileText size={20} strokeWidth={1.75} className="text-primary" aria-hidden /> Cited findings
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cited.map((f) => (
            <Card key={f.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <Citations ids={[f.id]} />
                <VerifiedBadge verified={f.verified} />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-muted">{f.statement}</p>
              <p className="mt-auto font-mono text-[13px] text-muted">
                {experimentById.get(f.experimentId)?.acronym ?? f.experimentId} · {f.sources[0].title}
                {f.sources[0].locator ? `, ${f.sources[0].locator}` : ""}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
