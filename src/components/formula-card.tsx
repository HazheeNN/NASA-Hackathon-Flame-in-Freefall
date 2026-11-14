import { CircleOff, Sigma } from "lucide-react";
import Link from "next/link";
import { SourceLink, StatusChip, VerifiedBadge } from "@/components/ui";
import type { Formula } from "@/lib/schema";

const fmt = (x: number) => (Number.isInteger(x) ? String(x) : String(Number(x.toFixed(3))));

export function validityText(f: Formula) {
  const v = f.validity;
  const parts = [
    v.gravityG && (v.gravityG[0] === v.gravityG[1] ? `${v.gravityG[0]} g only` : `${v.gravityG[0]}–${v.gravityG[1]} g`),
    v.pressureKPa && `${v.pressureKPa[0]}–${v.pressureKPa[1]} kPa`,
    v.oxygenPercent && `${v.oxygenPercent[0]}–${v.oxygenPercent[1]} % O₂`,
    v.flowCmPerS && `airflow ${v.flowCmPerS[0]}–${v.flowCmPerS[1]} cm/s`,
    v.fuel && v.fuel.join(", "),
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Any cabin pressure and oxygen fraction (it is a definition).";
}

// One formula, fully explained (F22): what, equation, symbols, how we use it, worked example,
// valid range and limits, where it appears on the site, and the NASA citation.
export function FormulaCard({ f }: { f: Formula }) {
  return (
    <article id={f.id} className="scroll-mt-24 rounded-xl border border-line bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line p-6">
        <div>
          <p className="eyebrow">{f.id}</p>
          <h2 className="mt-1 text-[24px] font-bold">{f.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {f.whereUsed.length ? <StatusChip state="tested" label="Computed on this site" /> : <StatusChip state="neutral" label="Explained only" />}
          <VerifiedBadge verified={f.verified} />
        </div>
      </header>

      <div className="grid gap-8 p-6 xl:grid-cols-2">
        <div className="space-y-6">
          <section>
            <h3 className="eyebrow">What it tells you</h3>
            <p className="mt-2 text-[17px] leading-relaxed">{f.explanation}</p>
          </section>

          <section>
            <h3 className="eyebrow">The equation</h3>
            <p className="mt-2 rounded-lg bg-raised px-4 py-4 text-center font-mono text-[22px] tracking-wide">{f.expression}</p>
            <table className="mt-3 w-full text-left text-[15px]">
              <thead className="sr-only">
                <tr>
                  <th>Symbol</th>
                  <th>Meaning</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {f.variables.map((v) => (
                  <tr key={v.symbol}>
                    <td className="w-24 py-2 pr-3 font-mono">{v.symbol}</td>
                    <td className="py-2 pr-3 text-muted">{v.meaning}</td>
                    <td className="py-2 text-right font-mono text-muted">{v.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h3 className="eyebrow">How we use it</h3>
            <ol className="mt-3 space-y-3">
              {f.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-[15px]">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-raised font-mono text-[12px]">{i + 1}</span>
                  <span className="text-muted">{s}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-line p-5">
            <h3 className="eyebrow inline-flex items-center gap-2">
              <Sigma size={14} strokeWidth={1.75} aria-hidden /> Worked example
            </h3>
            <p className="mt-2 text-[15px] text-muted">{f.example.text}</p>
            <dl className="mt-3 space-y-1 font-mono text-[15px] tabular">
              {f.example.inputs.map((i) => (
                <div key={i.symbol} className="flex justify-between gap-4">
                  <dt>{i.symbol}</dt>
                  <dd>
                    {fmt(i.value)} <span className="text-muted">{i.unit}</span>
                  </dd>
                </div>
              ))}
              <div className="mt-2 flex justify-between gap-4 border-t border-line pt-2 font-semibold">
                <dt>{f.example.result.symbol}</dt>
                <dd>
                  ≈ {fmt(f.example.result.value)} <span className="font-normal text-muted">{f.example.result.unit}</span>
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="eyebrow">Valid for</h3>
            <p className="mt-2 font-mono text-[15px]">{validityText(f)}</p>
            <p className="mt-2 inline-flex gap-2 text-[14px] text-muted">
              <CircleOff size={16} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0 text-untested" />
              <span>
                {Object.keys(f.validity).length > 0 && (
                  <>
                    Outside this range the site shows <span className="font-semibold text-untested">“outside tested conditions”</span> and
                    no number.{" "}
                  </>
                )}
                {f.limits}
              </span>
            </p>
          </section>

          <section>
            <h3 className="eyebrow">Where it appears on this site</h3>
            {f.whereUsed.length ? (
              <ul className="mt-2 space-y-1">
                {f.whereUsed.map((w) => (
                  <li key={w.href + w.label}>
                    <Link href={w.href} className="text-[15px] text-primary hover:text-primary-hover hover:underline">
                      {w.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[15px] text-muted">Not computed anywhere yet; explained here as part of the method.</p>
            )}
          </section>

          <section>
            <h3 className="eyebrow">Citation</h3>
            <ul className="mt-2 space-y-2">
              {f.sources.map((s) => (
                <li key={s.url}>
                  <SourceLink source={s} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
