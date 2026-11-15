"use client";

import { Menu, MessageSquareText, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SearchItem } from "@/lib/search";
import { AskSearch } from "./ask-search";
import { ChatPanel } from "./chat/chat-panel";

const NAV = [
  { href: "/", label: "Flame Lab" },
  { href: "/gaps", label: "Gaps map" },
  { href: "/insights", label: "Insights" },
  { href: "/formulas", label: "Formulas" },
  { href: "/findings", label: "Findings" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
];

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function SiteHeader({ index, suggestions }: { index: SearchItem[]; suggestions: string[] }) {
  const pathname = usePathname();
  const [menuOn, setMenuOn] = useState<string | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const [askTab, setAskTab] = useState<"chat" | "search">("chat");
  const open = menuOn === pathname;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAskOpen((v) => !v);
      }
      if (e.key === "Escape") setAskOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const link = (n: (typeof NAV)[number], mobile = false) => {
    const active = isActive(pathname, n.href);
    return (
      <Link
        key={n.href}
        href={n.href}
        aria-current={active ? "page" : undefined}
        className={`font-semibold transition-colors duration-200 ${mobile ? "block rounded-lg px-3 py-3 text-[17px]" : "relative py-2 text-[15px]"} ${
          active ? "text-fg" : "text-muted hover:text-fg"
        } ${!mobile && active ? "after:absolute after:inset-x-0 after:-bottom-[17px] after:h-0.5 after:bg-fg" : ""}`}
      >
        {n.label}
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-page/95">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 font-bold tracking-[-0.01em]">
            {/* Team logo (white line art, transparent), same 28 px as the old mark. */}
            <Image src="/logo.png" alt="" width={28} height={28} priority />
            <span>Flame in Freefall</span>
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-5 lg:flex">
            {NAV.map((n) => link(n))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAskOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-page transition-opacity hover:opacity-90"
            >
              <MessageSquareText size={18} strokeWidth={1.75} aria-hidden />
              Ask
              <kbd className="hidden font-mono text-[11px] font-normal normal-case text-page/60 sm:inline">⌘K</kbd>
            </button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-fg hover:bg-surface lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setMenuOn(open ? null : pathname)}
            >
              {open ? <X size={20} strokeWidth={1.75} aria-hidden /> : <Menu size={20} strokeWidth={1.75} aria-hidden />}
            </button>
          </div>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label="Main" className="border-t border-line bg-page px-4 py-2 lg:hidden">
            {NAV.map((n) => link(n, true))}
          </nav>
        )}
      </header>

      {askOpen && (
        <div role="dialog" aria-modal="true" aria-label="Ask" className="fixed inset-0 z-40 flex items-start justify-center bg-page/70 px-4 pt-[10vh]" onClick={() => setAskOpen(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-line bg-surface p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="eyebrow inline-flex items-center gap-2">
                <MessageSquareText size={14} strokeWidth={1.75} aria-hidden /> Ask
              </p>
              <button type="button" onClick={() => setAskOpen(false)} aria-label="Close" className="rounded-full p-1 text-muted hover:text-fg">
                <X size={20} strokeWidth={1.75} aria-hidden />
              </button>
            </div>
            <div role="tablist" aria-label="Ask" className="mb-4 flex gap-2">
              {(
                [
                  ["chat", "Chat with the assistant"],
                  ["search", "Search the library"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={askTab === id}
                  onClick={() => setAskTab(id)}
                  className={`h-9 rounded-full px-3.5 text-[13px] font-semibold ${askTab === id ? "bg-fg text-page" : "bg-raised text-fg hover:bg-line"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {askTab === "chat" ? (
              <ChatPanel suggestions={suggestions} autoFocus compact />
            ) : (
              <AskSearch items={index} autoFocus onNavigate={() => setAskOpen(false)} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
