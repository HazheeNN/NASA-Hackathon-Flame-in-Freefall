import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, Label, SampleBanner, ThemeChip, VerifiedBadge } from "@/components/ui";
import { displayFindingById, experimentById } from "@/lib/data";
import { gravity, oxygen, pressure, withUnit } from "@/lib/format";

export function generateStaticParams() {
  return [...displayFindingById.keys()].map((id) => ({ id }));
}

// Minimal finding detail so citation chips open something (WP3a). The explorer is WP3b.
export default async function FindingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const f = displayFindingById.get(id);
  if (!f) notFound();
  const c = f.conditions;
  const conditions = [
    c.gravityG !== undefined && ["Gravity", gravity(c.gravityG)],
    c.oxygenPercent !== undefined && ["Oxygen", oxygen(c.oxygenPercent)],
    c.pressureKPa !== undefined && ["Pressure", pressure(c.pressureKPa)],
    c.flowCmPerS !== undefined && ["Airflow", withUnit(c.flowCmPerS, "cm/s")],
    c.material && ["Material", c.material],
    c.fuel && ["Fuel", c.fuel],
  ].filter((x): x is [string, string] => Boolean(x));
  const experiment = experimentById.get(f.experimentId);

  return (
    <div className="space-y-8">
      <Link href="/insights" className="inline-flex items-center gap-2 text-[15px] text-muted hover:text-fg">
        <ArrowLeft size={20} strokeWidth={1.75} aria-hidden /> Insights
      </Link>
      {f.id.startsWith("F-9") && <SampleBanner />}
      <header className="max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[13px] text-muted">
            <FileText size={14} strokeWidth={1.75} aria-hidden /> {f.id}
          </span>
          <VerifiedBadge verified={f.verified} />
        </div>
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.01em]">{f.title}</h1>
        <p className="text-[17px] leading-relaxed">{f.statement}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <Label>Test conditions</Label>
          {conditions.length ? (
            <dl className="mt-3 space-y-2">
              {conditions.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 text-[15px]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-mono tabular">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-2 text-muted">The source states no conditions.</p>
          )}
        </Card>
        <Card>
          <Label>What it means for a crew</Label>
          <p className="mt-2">{f.safetyImplication}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {f.themes.map((t) => (
              <ThemeChip key={t} theme={t} />
            ))}
          </div>
        </Card>
        <Card>
          <Label>Source</Label>
          <ul className="mt-3 space-y-3">
            {f.sources.map((s) => (
              <li key={s.url + s.title}>
                <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 text-primary hover:underline">
                  <BookOpen size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
                  {s.title}
                </a>
                <p className="ml-7 font-mono text-[13px] text-muted">{[s.year, s.locator].filter(Boolean).join(" · ") || "No page given yet"}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[13px] text-muted">
            {experiment?.acronym ?? experiment?.name ?? f.experimentId} · {f.evidence.kind} · strength {f.evidence.strength}/3
          </p>
        </Card>
      </div>
    </div>
  );
}
