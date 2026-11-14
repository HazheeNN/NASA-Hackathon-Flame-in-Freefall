"use client";

import { ArrowUp, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CitedText } from "@/components/ui";

type Source = { findingId: string; title: string; url: string; locator?: string; year?: number; experiment: string; experimentId: string };
type Msg = { role: "user" | "assistant"; content: string; source?: string; sources?: Source[] };

const SOURCE: Record<string, string> = {
  prepared: "Prepared answer, reviewed by the team",
  data: "Answered straight from our verified data",
  none: "No answer available",
  limit: "Question limit",
  invalid: "",
};

// The live assistant (decision 2026-11-15): answers only from verified NASA findings, with
// citation chips. Free AI providers on the server; prepared answers when they're unavailable.
export function ChatPanel({ suggestions, autoFocus = false, compact = false }: { suggestions: string[]; autoFocus?: boolean; compact?: boolean }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [msgs, busy]);

  async function send(text: string) {
    const q = text.trim().slice(0, 600);
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-6).map(({ role, content }) => ({ role, content: content.slice(0, 2000) })) }),
      });
      const data = (await res.json()) as { answer: string; provider: string; model?: string; sources?: Source[]; why?: string };
      const label = SOURCE[data.provider] ?? `AI answer (${data.model ?? data.provider} via ${data.provider}), checked for citations`;
      // When the live AI didn't answer, say why (provider names and status codes only).
      const source = data.why && (data.provider === "prepared" || data.provider === "none" || data.provider === "data") ? `${label} · live AI unavailable (${data.why})` : label;
      setMsgs([...next, { role: "assistant", content: data.answer, source, sources: data.sources ?? [] }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "The assistant can't be reached right now. The prepared answers on the Ask page still work.", source: "Offline" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div className={`space-y-4 overflow-y-auto ${compact ? "max-h-[50vh]" : "max-h-[60vh]"}`} aria-live="polite">
        {msgs.length === 0 && (
          <div className="space-y-3">
            <p className="text-[15px] text-muted">
              Ask anything about fire safety in space. Answers come only from our verified NASA findings, with a source on every fact.
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="rounded-full bg-raised px-3 py-1.5 text-left text-[13px] hover:bg-line">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-fg px-4 py-2.5 text-[15px] text-page">{m.content}</p>
            </div>
          ) : (
            <div key={i} className="max-w-[92%] space-y-1.5">
              <div className="rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3 text-[15px] leading-relaxed">
                <CitedText text={m.content} />
              </div>
              {m.sources && m.sources.length > 0 && <SourceList sources={m.sources} />}
              {m.source && (
                <p className="inline-flex items-center gap-1.5 px-1 text-[12px] text-muted">
                  <Sparkles size={12} strokeWidth={1.75} aria-hidden className="text-primary" /> {m.source}
                </p>
              )}
            </div>
          ),
        )}
        {busy && <p className="px-1 text-[14px] text-muted">Checking the NASA findings…</p>}
        <div ref={end} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-4 flex items-end gap-2"
      >
        <label className="flex-1">
          <span className="sr-only">Your question</span>
          <textarea
            autoFocus={autoFocus}
            value={input}
            maxLength={600}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="e.g. Is a fire on Mars more dangerous than on the ISS?"
            className="max-h-32 min-h-12 w-full resize-y rounded-xl border border-line bg-raised px-4 py-3 text-[15px] placeholder:text-muted"
          />
        </label>
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-fg text-page disabled:opacity-40"
        >
          <ArrowUp size={20} strokeWidth={1.75} aria-hidden />
        </button>
      </form>
      <p className="mt-2 text-[12px] text-muted">
        Live answers are written by a free AI service (Groq or Google) from our verified findings and checked for citations; your
        question is sent to that service. Unchecked claims are never shown.
      </p>
    </div>
  );
}

// Where the answer comes from: each cited finding's NASA document (with page), linked to the
// source itself and to its experiment on the Sources page.
function SourceList({ sources }: { sources: Source[] }) {
  // One line per document page; findings that cite the same page are listed together.
  const groups = new Map<string, Source & { ids: string[] }>();
  for (const s of sources) {
    const key = `${s.url}|${s.locator ?? ""}`;
    const g = groups.get(key);
    if (g) {
      if (!g.ids.includes(s.findingId)) g.ids.push(s.findingId);
    } else groups.set(key, { ...s, ids: [s.findingId] });
  }
  const list = [...groups.values()];
  // PDFs open at the cited page ("PDF p. 31" → #page=31).
  const href = (s: Source) => {
    const page = s.locator?.match(/PDF p\. (\d+)/)?.[1];
    return page && s.url.toLowerCase().includes(".pdf") ? `${s.url}#page=${page}` : s.url;
  };
  return (
    <details className="rounded-xl border border-line bg-page/40 px-3 py-2 text-[13px]">
      <summary className="cursor-pointer font-semibold text-primary hover:text-primary-hover">
        Where this comes from ({list.length} NASA source{list.length === 1 ? "" : "s"})
      </summary>
      <ul className="mt-2 space-y-2">
        {list.map((s) => (
          <li key={`${s.url}|${s.locator}`} className="space-y-0.5">
            <a href={href(s)} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1.5 text-fg hover:text-primary hover:underline">
              <BookOpen size={14} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0 text-primary" />
              <span>
                {s.title}
                {s.year ? ` (${s.year})` : ""}
              </span>
            </a>
            <p className="pl-5 text-muted">
              <span className="font-mono">{s.ids.join(", ")}</span>
              {s.locator ? ` · ${s.locator}` : ""} ·{" "}
              <Link href={`/sources#${s.experimentId}`} className="text-primary hover:underline">
                {s.experiment} on our Sources page
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </details>
  );
}
