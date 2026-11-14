import { FlaskConical } from "lucide-react";
import { FlameMark } from "@/components/flame-mark";
import { VerifiedBadge } from "@/components/ui";
import { experiments, findings, insights } from "@/lib/data";

// Overview. Foundation version: shows the seed corpus so the design system can be seen
// working. The real overview (top-ranked insights, charts, Ask) is planned in
// docs/plans/2026-11-hackathon.md.
export default function Home() {
  const verified = findings.filter((f) => f.verified).length;
  const kpis = [
    { label: "Experiments", value: experiments.length },
    { label: "Findings", value: findings.length },
    { label: "Verified findings", value: findings.length ? `${Math.round((verified / findings.length) * 100)}%` : "—" },
    { label: "Ranked insights", value: insights.insights.length },
  ];

  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
        <div className="max-w-3xl space-y-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-primary">NASA Space Apps · Flame in Freefall</p>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-[44px]">
            What decades of fire in microgravity tell us about keeping crews safe
          </h1>
          <p className="text-[17px] leading-relaxed text-muted">
            NASA has burned droplets, gases and spacecraft materials in drop towers, on the space station and inside empty cargo
            ships. We summarize, rank and interpret those findings into fire safety insights for the Moon and Mars, with a source on
            every claim.
          </p>
        </div>
        <div className="hidden justify-self-center md:block">
          <FlameMark size={220} breathe />
        </div>
      </section>

      <section aria-label="Corpus at a glance" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-surface p-5">
            <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-muted">{k.label}</p>
            <p className="tabular mt-2 font-mono text-4xl font-medium">{k.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-[28px] font-semibold tracking-[-0.01em]">Experiments in the corpus</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {experiments.map((e) => (
            <article key={e.id} className="flex flex-col gap-3 rounded-2xl bg-surface p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="flex items-center gap-2 text-xl font-semibold">
                  <FlaskConical size={20} strokeWidth={1.75} className="shrink-0 text-primary" aria-hidden />
                  {e.acronym ?? e.name}
                </h3>
                <VerifiedBadge verified={e.verified} />
              </div>
              {e.acronym && <p className="text-sm text-muted">{e.name}</p>}
              <p>{e.summary}</p>
              <p className="mt-auto font-mono text-[13px] text-muted">
                {e.agency} · {e.platform} · {e.years}
              </p>
              <div className="flex flex-wrap gap-2">
                {e.themes.map((t) => (
                  <span key={t} className="rounded-full bg-primary-soft px-2.5 py-1 text-[13px] font-semibold text-primary">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
