import { FlaskConical } from "lucide-react";
import { Card, PageHeader, SourceLink, VerifiedBadge } from "@/components/ui";
import { atmospheres, experiments, flex, formulas, worlds } from "@/lib/data";
import { showUnverified, visible } from "@/lib/visibility";

export const metadata = { title: "Sources & method · Flame in Freefall" };

const RUBRIC = [
  ["Safety relevance", "How directly does this affect crew fire safety?"],
  ["Severity", "How bad is the fire scenario it describes?"],
  ["Evidence", "How strong and verified are the cited findings? Unverified findings cap it at 3."],
  ["Actionability", "How clearly does it lead to a design or procedure change?"],
];

function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="text-[24px] font-bold">{title}</h2>
        {lead && <p className="mt-1 max-w-3xl text-muted">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

export default function SourcesPage() {
  const shownWorlds = visible(worlds);
  return (
    <div className="space-y-16">
      <PageHeader
        eyebrow="Validity"
        title="Sources & method"
        lead="Every number on this site traces to a NASA (or partner agency) source with a page. Here is each one, how our SI works, and the limits of what we show."
      />
      {showUnverified && (
        <p className="text-[14px] text-unverified">Preview build: unverified records are listed with their badge; the live site lists only verified ones.</p>
      )}

      <Section id="method" title="How it works" lead="The SI (Claude, by Anthropic) runs offline in our team's sessions, never while you browse. People check everything it writes.">
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            ["1. Extract", "The SI reads a NASA paper and proposes findings with an exact quote and page. A teammate checks each one against the paper before it counts."],
            ["2. Rank", "It links verified findings across experiments into insights and scores each on the four questions below."],
            ["3. Answer", "It prepares cited answers to the questions planners ask. Every factual sentence carries a finding ID."],
          ].map(([t, d]) => (
            <li key={t}>
              <Card className="h-full">
                <p className="font-semibold">{t}</p>
                <p className="mt-2 text-[15px] text-muted">{d}</p>
              </Card>
            </li>
          ))}
        </ol>
        <Card>
          <p className="eyebrow">Ranking rubric (1 to 5 each)</p>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {RUBRIC.map(([n, q]) => (
              <div key={n}>
                <dt className="font-semibold">{n}</dt>
                <dd className="text-[15px] text-muted">{q}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[14px] text-muted">Rank order: safety relevance and severity first, then evidence, then actionability.</p>
        </Card>
        <Card>
          <p className="eyebrow">The flame</p>
          <p className="mt-2 text-[15px] text-muted">
            The Flame Lab&apos;s flame is an illustration: its shape and colour follow trends NASA documented (spherical and blue in
            microgravity, a flickering sooty teardrop under gravity, brighter with more oxygen). It computes nothing. Numbers come only
            from verified data and from NASA formulas used inside their tested range; outside it, we say &quot;never tested&quot;.
          </p>
        </Card>
      </Section>

      <Section id="formulas" title="Formulas" lead="Only formulas from NASA sources, each used only inside the conditions it was tested in.">
        <div className="grid gap-4 md:grid-cols-2">
          {visible(formulas).map((f) => (
            <Card key={f.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">
                  {f.id} · {f.name}
                </p>
                <VerifiedBadge verified={f.verified} />
              </div>
              <p className="mt-3 rounded-lg bg-raised px-3 py-2 font-mono text-[15px]">{f.expression}</p>
              <p className="mt-3 text-[15px] text-muted">{f.explanation}</p>
              <ul className="mt-3 space-y-1 text-[14px]">
                {f.variables.map((v) => (
                  <li key={v.symbol}>
                    <span className="font-mono">{v.symbol}</span> <span className="text-muted">— {v.meaning} ({v.unit})</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[14px]">
                <span className="font-semibold">Valid for: </span>
                <span className="text-muted">
                  {Object.keys(f.validity).length === 0
                    ? "any cabin pressure and oxygen fraction (it is a definition)"
                    : [
                        f.validity.gravityG && `${f.validity.gravityG[0]}–${f.validity.gravityG[1]} g`,
                        f.validity.pressureKPa && `${f.validity.pressureKPa[0]}–${f.validity.pressureKPa[1]} kPa`,
                        f.validity.oxygenPercent && `${f.validity.oxygenPercent[0]}–${f.validity.oxygenPercent[1]} % O₂`,
                        f.validity.fuel && f.validity.fuel.join(", "),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                </span>
              </p>
              <div className="mt-3 border-t border-line pt-3">
                {f.sources.map((s) => (
                  <SourceLink key={s.url} source={s} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="datasets" title="Datasets">
        {showUnverified || flex.verified ? (
          <Card>
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold">{flex.title}</p>
              <VerifiedBadge verified={flex.verified} />
            </div>
            <p className="mt-2 text-[15px] text-muted">{flex.description}</p>
            <p className="mt-2 text-[14px] text-muted">
              {flex.rows.length} tests. Parsed from the NASA PDF by our script (npm run data:flex); cross-checked row by row against the
              CSV published by the shaharia179/flame-in-freefall team.
            </p>
            <div className="mt-3">
              <SourceLink source={flex.source} />
            </div>
          </Card>
        ) : (
          <p className="text-muted">No dataset verified yet.</p>
        )}
      </Section>

      <Section id="atmospheres" title="Cabin air and worlds">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible(atmospheres).map((a) => (
            <Card key={a.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{a.name}</p>
                <VerifiedBadge verified={a.verified} />
              </div>
              <p className="mt-1 font-mono text-[14px] tabular">
                {a.pressureKPa} kPa · {a.oxygenPercent} % O₂
              </p>
              <p className="mt-2 text-[14px] text-muted">{a.usedFor}</p>
              <div className="mt-3 space-y-1">
                {a.sources.map((s) => (
                  <SourceLink key={s.url + s.title} source={s} />
                ))}
              </div>
            </Card>
          ))}
          {shownWorlds.map((w) => (
            <Card key={w.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{w.name} gravity</p>
                <VerifiedBadge verified={w.verified} />
              </div>
              <p className="mt-1 font-mono text-[14px] tabular">{w.gravityG} g</p>
              <div className="mt-3 space-y-1">
                {w.sources.map((s) => (
                  <SourceLink key={s.url + s.title} source={s} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="experiments" title="Experiments" lead="NASA and partner-agency programmes in our corpus. No data from Chinese agencies, missions or institutions is used.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible(experiments).map((e) => (
            <Card key={e.id} className="scroll-mt-24">
              <div id={e.id} className="flex items-start justify-between gap-3">
                <p className="inline-flex items-center gap-2 font-semibold">
                  <FlaskConical size={18} strokeWidth={1.75} aria-hidden className="text-primary" /> {e.acronym ?? e.name}
                </p>
                <VerifiedBadge verified={e.verified} />
              </div>
              <p className="mt-1 font-mono text-[13px] text-muted">
                {e.agency} · {e.platform} · {e.years}
              </p>
              <p className="mt-2 text-[14px] text-muted">{e.summary}</p>
              <div className="mt-3 space-y-1">
                {e.sources.map((s) => (
                  <SourceLink key={s.url} source={s} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="images" title="Images">
        <ul className="grid gap-2 text-[15px]">
          {shownWorlds.map(
            (w) =>
              w.image && (
                <li key={w.id}>
                  <span className="font-semibold">{w.name}:</span> <span className="text-muted">{w.image.alt}.</span>{" "}
                  <a href={w.image.sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    Image: {w.image.credit}
                  </a>
                </li>
              ),
          )}
        </ul>
      </Section>
    </div>
  );
}
