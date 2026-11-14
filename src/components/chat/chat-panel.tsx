"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CitedText } from "@/components/ui";

type Msg = { role: "user" | "assistant"; content: string; source?: string };

const SOURCE: Record<string, string> = {
  prepared: "Prepared answer, reviewed by the team",
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
      const data = (await res.json()) as { answer: string; provider: string; model?: string };
      const source = SOURCE[data.provider] ?? `AI answer (${data.model ?? data.provider} via ${data.provider}), checked for citations`;
      setMsgs([...next, { role: "assistant", content: data.answer, source }]);
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
