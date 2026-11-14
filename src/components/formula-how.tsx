import Link from "next/link";
import type { Formula } from "@/lib/schema";

// "How is this calculated?" next to a computed number in the Flame Lab: the formula with the
// visitor's current values plugged in, its source page, and a link to the full explanation.
export function FormulaHow({ f, substituted }: { f: Formula; substituted: string }) {
  const s = f.sources[0];
  return (
    <details className="group mt-3 rounded-lg bg-raised/70 text-[13px]">
      <summary className="cursor-pointer list-none px-3 py-2 font-semibold text-primary marker:hidden hover:text-primary-hover">
        <span className="mr-1 inline-block transition-transform group-open:rotate-90" aria-hidden>
          ›
        </span>
        How is this calculated? ({f.id})
      </summary>
      <div className="space-y-2 px-3 pb-3">
        <p className="font-mono text-[14px]">{f.expression}</p>
        <p className="font-mono text-[14px] text-fg">{substituted}</p>
        <p className="text-muted">
          Calculated from a NASA formula: {s.title}
          {s.locator ? `, ${s.locator.split(" (")[0].split(",")[0]}` : ""}.
        </p>
        <Link href={`/formulas#${f.id}`} className="font-semibold text-primary hover:underline">
          Full explanation and limits →
        </Link>
      </div>
    </details>
  );
}
