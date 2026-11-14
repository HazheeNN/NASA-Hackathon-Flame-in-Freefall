import { BadgeCheck, BookOpen, CircleAlert, Sparkles, TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Insight, ThemeName } from "@/lib/schema";

// Shared building blocks (DESIGN.md › Components). Colours only through theme tokens.

const ICON = { size: 20, strokeWidth: 1.75, "aria-hidden": true } as const;
const SMALL = { size: 14, strokeWidth: 1.75, "aria-hidden": true } as const;

export function Card({ children, raised = false, className = "" }: { children: ReactNode; raised?: boolean; className?: string }) {
  return <article className={`rounded-2xl p-6 ${raised ? "bg-raised" : "bg-surface"} ${className}`}>{children}</article>;
}

export function PageHeader({ title, lead, icon }: { title: string; lead?: ReactNode; icon?: ReactNode }) {
  return (
    <header className="max-w-3xl space-y-3">
      <h1 className="flex items-center gap-3 text-[28px] font-semibold leading-tight tracking-[-0.01em]">
        {icon}
        {title}
      </h1>
      {lead && <p className="text-[17px] leading-relaxed text-muted">{lead}</p>}
    </header>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-muted">{children}</p>;
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
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[13px] font-semibold ${r.cls}`}>
      <TriangleAlert {...SMALL} /> {r.text}
    </span>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-raised px-2 py-0.5 text-[13px] font-semibold text-verified">
      <BadgeCheck {...SMALL} /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md bg-raised px-2 py-0.5 text-[13px] font-semibold text-unverified">
      <CircleAlert {...SMALL} /> Unverified
    </span>
  );
}

export function ThemeChip({ theme }: { theme: ThemeName | string }) {
  return <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[13px] font-semibold text-primary">{theme.replaceAll("-", " ")}</span>;
}

export function MissionChip({ mission }: { mission: string }) {
  return <span className="rounded-full border border-line px-2.5 py-1 text-[13px] font-semibold text-fg">{mission}</span>;
}

// Opens the finding (and from there its NASA source). Every AI fact ends with at least one.
export function CitationChip({ id }: { id: string }) {
  return (
    <Link
      href={`/findings/${id}`}
      className="inline-flex items-center gap-1 rounded-md bg-raised px-1.5 py-0.5 font-mono text-[13px] text-primary transition-colors duration-200 hover:bg-primary-soft"
      aria-label={`Finding ${id}`}
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
    <div role="note" className="flex items-start gap-3 rounded-xl border border-unverified/40 bg-risk-medium-soft p-4 text-[15px]">
      <CircleAlert {...ICON} className="mt-0.5 shrink-0 text-unverified" />
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

export function ComingSoon({ title, icon, what, wp }: { title: string; icon: ReactNode; what: string; wp: string }) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} icon={icon} lead={what} />
      <Card className="max-w-3xl">
        <Label>Coming next</Label>
        <p className="mt-2 text-muted">This page is planned in {wp} (docs/plans/2026-11-hackathon.md).</p>
      </Card>
    </div>
  );
}
