import { BadgeCheck, BookOpen, CircleAlert, CircleOff, Sparkles, TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Insight, ThemeName } from "@/lib/schema";

// Shared building blocks (DESIGN.md › Components). Colours only through theme tokens.

const SMALL = { size: 14, strokeWidth: 1.75, "aria-hidden": true } as const;

export function Card({ children, raised = false, className = "" }: { children: ReactNode; raised?: boolean; className?: string }) {
  return <article className={`rounded-xl border border-line p-6 ${raised ? "bg-raised" : "bg-surface"} ${className}`}>{children}</article>;
}

export function PageHeader({ eyebrow, title, lead, size = "default" }: { eyebrow?: string; title: string; lead?: ReactNode; size?: "default" | "compact" }) {
  const compact = size === "compact";
  return (
    <header className={compact ? "max-w-2xl space-y-2" : "max-w-3xl space-y-4"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="text-[32px] font-bold leading-[1.15] tracking-[-0.01em] sm:text-[40px]">{title}</h1>
      {lead && <p className={compact ? "line-clamp-2 text-[16px] text-muted" : "text-[18px] leading-relaxed text-muted"}>{lead}</p>}
    </header>
  );
}

// Shared pieces from the UI polish plan (WP-F1).
export function Panel({ title, icon, action, children, className = "" }: { title?: string; icon?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-line bg-surface/90 p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && (
            <h2 className="inline-flex items-center gap-2 text-[17px] font-semibold">
              {icon}
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ value, unit, label }: { value: ReactNode; unit?: string; label?: ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[32px] font-medium leading-none tabular">
        {value} {unit && <span className="text-[16px] text-muted">{unit}</span>}
      </p>
      {label && <p className="mt-1 text-[14px] text-muted">{label}</p>}
    </div>
  );
}

export function Verdict({ state, title, detail }: { state: "tested" | "untested" | "partial"; title: string; detail?: ReactNode }) {
  const tested = state === "tested";
  const Icon = tested ? BadgeCheck : CircleOff;
  return (
    <div className={`flex gap-3 rounded-xl border-l-[3px] p-4 ${tested ? "border-tested bg-tested-soft" : "border-untested bg-untested-soft"}`}>
      <Icon size={20} strokeWidth={1.75} aria-hidden className={`mt-0.5 shrink-0 ${tested ? "text-tested" : "text-untested"}`} />
      <div>
        <p className="text-[18px] font-semibold leading-snug">{title}</p>
        {detail && <p className="mt-1 text-[14px] text-muted">{detail}</p>}
      </div>
    </div>
  );
}

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

const RISK = {
  high: { text: "High risk", cls: "bg-risk-high-soft text-risk-high" },
  medium: { text: "Medium risk", cls: "bg-risk-medium-soft text-risk-medium" },
  low: { text: "Low risk", cls: "bg-risk-low-soft text-risk-low" },
} as const;

// Word + icon + colour, never colour alone.
export function RiskBadge({ risk }: { risk: Insight["risk"] }) {
  const r = RISK[risk];
  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[13px] font-semibold ${r.cls}`}>
      <TriangleAlert {...SMALL} /> {r.text}
    </span>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 rounded bg-raised px-2 py-0.5 text-[13px] font-semibold text-verified">
      <BadgeCheck {...SMALL} /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded bg-raised px-2 py-0.5 text-[13px] font-semibold text-unverified">
      <CircleAlert {...SMALL} /> Unverified
    </span>
  );
}

// Tested (blue) / never tested (red) / neutral: always a word too.
export function StatusChip({ state, label }: { state: "tested" | "untested" | "neutral"; label: string }) {
  const cls =
    state === "tested" ? "bg-tested-soft text-tested" : state === "untested" ? "bg-untested-soft text-untested" : "bg-raised text-muted";
  const Icon = state === "tested" ? BadgeCheck : state === "untested" ? CircleOff : CircleAlert;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${cls}`}>
      <Icon {...SMALL} /> {label}
    </span>
  );
}

export function ThemeChip({ theme }: { theme: ThemeName | string }) {
  return <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[12px] font-semibold text-primary">{theme.replaceAll("-", " ")}</span>;
}

export function MissionChip({ mission }: { mission: string }) {
  return <span className="rounded-full border border-line px-2.5 py-1 text-[12px] font-semibold text-fg">{mission}</span>;
}

// Opens the finding (and from there its NASA source). Every AI fact ends with at least one.
export function CitationChip({ id }: { id: string }) {
  return (
    <Link
      href={id.startsWith("FX-") ? `/formulas#${id}` : `/findings/${id}`}
      className="relative z-10 inline-flex items-center gap-1 rounded bg-raised px-1.5 py-0.5 font-mono text-[13px] text-primary transition-colors duration-200 hover:bg-primary-soft"
      aria-label={id.startsWith("FX-") ? `Formula ${id}` : `Finding ${id}`}
    >
      <BookOpen size={12} strokeWidth={1.75} aria-hidden />
      {id}
    </Link>
  );
}

export function Citations({ ids }: { ids: string[] }) {
  return (
    <span className="inline-flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <CitationChip key={id} id={id} />
      ))}
    </span>
  );
}

// SI text with inline citations like "… spread fastest [F-008, F-015]." The bracketed IDs become
// citation chips, so every fact links to its finding (docs/ai.md › Job 3). Plain text otherwise.
export function CitedText({ text }: { text: string }) {
  const parts = text.split(/\s*\[((?:F-\d{3}|FX-\d{2})(?:\s*,\s*(?:F-\d{3}|FX-\d{2}))*)\]/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="ms-1 inline-flex flex-wrap gap-1 align-baseline">
            {part.split(/\s*,\s*/).map((id) => (
              <CitationChip key={id} id={id} />
            ))}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function SourceLink({ source }: { source: { title: string; url: string; locator?: string; year?: number } }) {
  return (
    <a href={source.url} target="_blank" rel="noreferrer" className="group inline-flex items-start gap-1.5 text-[14px] text-primary hover:text-primary-hover">
      <BookOpen size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden />
      <span>
        <span className="group-hover:underline">{source.title}</span>
        {(source.locator || source.year) && (
          <span className="font-mono text-[13px] text-muted"> · {[source.year, source.locator].filter(Boolean).join(" · ")}</span>
        )}
      </span>
    </a>
  );
}

// One sparkles icon marks AI content (DESIGN.md › Don'ts: no sparkle overload).
export function AiLabel({ count }: { count: number }) {
  return (
    <p className="inline-flex items-center gap-1.5 text-[13px] text-muted">
      <Sparkles {...SMALL} className="text-primary" />
      AI-generated from {count} cited finding{count === 1 ? "" : "s"}, reviewed by the team
    </p>
  );
}

export function SampleBanner() {
  return (
    <div role="note" className="flex items-start gap-3 rounded-xl border border-line bg-risk-medium-soft p-4 text-[15px]">
      <CircleAlert size={20} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0 text-unverified" />
      <p>
        <strong className="font-semibold">Sample data: layout preview.</strong>{" "}
        <span className="text-muted">
          These cards show where real insights will go. Their text is placeholder, not a NASA result. Real insights appear after
          the first SI run.
        </span>
      </p>
    </div>
  );
}

export function PreviewNote({ hidden }: { hidden: number }) {
  if (!hidden) return null;
  return (
    <p className="inline-flex items-center gap-1.5 text-[13px] text-unverified">
      <CircleAlert {...SMALL} /> Preview build: {hidden} unverified record{hidden === 1 ? "" : "s"} shown here are hidden on the live site.
    </p>
  );
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line p-8 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-[15px] text-muted">{children}</p>
    </div>
  );
}

// "How sure are we?": computed from the cited findings (src/lib/views.ts › confidence).
export function ConfidenceMeter({
  c,
  compact = false,
}: {
  c: { findings: number; experiments: number; verified: number; atGravity: boolean | null };
  compact?: boolean;
}) {
  const rows = [
    { name: "Findings", value: Math.min(c.findings / 5, 1), text: String(c.findings) },
    { name: "Experiments", value: Math.min(c.experiments / 3, 1), text: String(c.experiments) },
    { name: "Verified", value: c.findings ? c.verified / c.findings : 0, text: `${c.verified}/${c.findings}` },
    {
      name: "At this gravity",
      value: c.atGravity ? 1 : 0,
      text: c.atGravity === null ? "unknown" : c.atGravity ? "tested" : "extrapolated",
    },
  ];
  const score = rows.reduce((a, r) => a + r.value, 0) / rows.length;
  const word = score >= 0.75 ? "Strong" : score >= 0.45 ? "Moderate" : "Weak";
  return (
    <div aria-label={`Confidence: ${word}`} className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow">How sure are we?</span>
        <span className="text-[13px] font-semibold">{word}</span>
      </div>
      {!compact && (
        <dl className="space-y-1.5">
          {rows.map((r) => (
            <div key={r.name} className="grid grid-cols-[1fr_auto] items-center gap-x-3 text-[13px]">
              <dt className="text-muted">{r.name}</dt>
              <dd className="font-mono tabular">{r.text}</dd>
              <div className="col-span-2 h-1 rounded-full bg-raised" aria-hidden>
                <div className="h-1 rounded-full bg-primary" style={{ width: `${Math.round(r.value * 100)}%` }} />
              </div>
            </div>
          ))}
        </dl>
      )}
      {compact && (
        <div className="flex gap-1" aria-hidden>
          {rows.map((r) => (
            <div key={r.name} className="h-1 flex-1 rounded-full bg-raised">
              <div className="h-1 rounded-full bg-primary" style={{ width: `${Math.round(r.value * 100)}%` }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
