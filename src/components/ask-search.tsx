"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchItem } from "@/lib/search";

// Matches every word typed against titles and text (a few hundred items: no library needed).
export function filterItems(items: SearchItem[], q: string) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return items.filter((i) => i.kind === "Answer").slice(0, 12);
  return items
    .map((i) => {
      const hay = `${i.title} ${i.text}`.toLowerCase();
      const hits = words.filter((w) => hay.includes(w)).length;
      const inTitle = words.filter((w) => i.title.toLowerCase().includes(w)).length;
      return { i, score: hits * 2 + inTitle + (i.kind === "Answer" ? 1 : 0) };
    })
    .filter((x) => x.score >= words.length * 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((x) => x.i);
}

export function AskSearch({ items, autoFocus = false, onNavigate, initial = "" }: { items: SearchItem[]; autoFocus?: boolean; onNavigate?: () => void; initial?: string }) {
  const [q, setQ] = useState(initial);
  const results = useMemo(() => filterItems(items, q), [items, q]);
  const answers = items.filter((i) => i.kind === "Answer").length;
  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search questions, findings and sources</span>
        <Search size={20} strokeWidth={1.75} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about fire on the Moon, Mars, oxygen, cool flames…"
          className="h-14 w-full rounded-xl border border-line bg-raised pl-12 pr-4 text-[17px] placeholder:text-muted"
        />
      </label>
      <ul className="mt-4 max-h-[55vh] space-y-1 overflow-y-auto" aria-live="polite">
        {results.map((r) => (
          <li key={r.kind + r.href + r.title}>
            <Link href={r.href} onClick={onNavigate} className="block rounded-lg px-3 py-3 transition-colors hover:bg-raised">
              <span className="eyebrow">{r.kind}</span>
              <span className="mt-0.5 block font-semibold">{r.title}</span>
              <span className="mt-0.5 line-clamp-2 block text-[14px] text-muted">{r.text}</span>
            </Link>
          </li>
        ))}
      </ul>
      {results.length === 0 && (
        <p className="px-3 py-6 text-[15px] text-muted">
          {q
            ? "No prepared answer or source matches that yet. Try fewer words, or browse the findings."
            : answers === 0
              ? "The question library fills in after the first SI run. Meanwhile, search findings, experiments, datasets and formulas."
              : ""}
        </p>
      )}
    </div>
  );
}
