import Link from "next/link";
import { FormulaCard, validityText } from "@/components/formula-card";
import { EmptyState, PageHeader } from "@/components/ui";
import { formulas } from "@/lib/data";
import { visible } from "@/lib/visibility";

export const metadata = { title: "Formulas · Flame in Freefall" };

// F22: every NASA formula the site uses or explains, what it is for, how we use it, and where
// it comes from (decision 2026-11-14, option C).
export default function FormulasPage() {
  const list = visible(formulas);
  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="The physics behind the numbers"
        title="Formulas"
        lead="Every number this site calculates comes from a formula in a NASA source, used only inside the conditions NASA tested it in. Here is each one: what it tells you, how we use it, a worked example, its limits and the exact page it comes from."
      />

      <ul className="grid gap-4 md:grid-cols-3">
        {[
          ["NASA sources only", "Each formula cites a NASA (or partner agency) paper with its page."],
          ["Inside the tested range", "Outside it the site says “outside tested conditions” and shows no number."],
          ["Labelled", "Calculated values say “calculated from a NASA formula”, never “measured”."],
        ].map(([t, d]) => (
          <li key={t} className="rounded-xl border border-line bg-surface p-5">
            <p className="font-semibold">{t}</p>
            <p className="mt-1 text-[15px] text-muted">{d}</p>
          </li>
        ))}
      </ul>

      {list.length === 0 ? (
        <EmptyState title="No verified formulas yet">They appear here once a teammate has checked each one against its NASA page.</EmptyState>
      ) : (
        <>
          <nav aria-label="Formulas on this page" className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[640px] text-left text-[15px]">
              <thead className="bg-surface text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Formula</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Equation</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Valid for</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Used in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((f) => (
                  <tr key={f.id}>
                    <td className="px-4 py-3">
                      <Link href={`#${f.id}`} className="font-semibold text-primary hover:underline">
                        {f.id} · {f.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono">{f.expression.split("   →")[0]}</td>
                    <td className="px-4 py-3 text-muted">{validityText(f)}</td>
                    <td className="px-4 py-3 text-muted">{f.whereUsed.length ? f.whereUsed.map((w) => w.label.split(" › ")[0]).join(", ") : "Explained only"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </nav>
          <div className="space-y-8">
            {list.map((f) => (
              <FormulaCard key={f.id} f={f} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
