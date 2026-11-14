"use client";

import { Menu, MessageSquareText, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FlameMark } from "./flame-mark";

// App shell top bar (DESIGN.md › Layout): flame mark, name, main navigation, the Ask button.
// Below 1024 px the navigation folds into a menu button.
const NAV = [
  { href: "/", label: "Overview" },
  { href: "/insights", label: "Insights" },
  { href: "/worlds", label: "Four Worlds" },
  { href: "/gaps", label: "Gaps map" },
  { href: "/habitat", label: "Habitat" },
  { href: "/findings", label: "Findings" },
  { href: "/sources", label: "Sources" },
];

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function SiteHeader() {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  const link = (n: (typeof NAV)[number], mobile = false) => {
    const active = isActive(pathname, n.href);
    return (
      <Link
        key={n.href}
        href={n.href}
        aria-current={active ? "page" : undefined}
        className={`rounded-md font-semibold transition-colors duration-200 ${
          mobile ? "block px-3 py-3 text-[17px]" : "px-3 py-2 text-[15px]"
        } ${active ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface hover:text-fg"}`}
      >
        {n.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-page">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <FlameMark />
          <span>Flame in Freefall</span>
        </Link>
        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => link(n))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/ask"
            aria-current={isActive(pathname, "/ask") ? "page" : undefined}
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-4 text-[13px] font-semibold uppercase tracking-[0.04em] text-on-primary transition-colors duration-200 hover:bg-primary-hover"
          >
            <MessageSquareText size={20} strokeWidth={1.75} aria-hidden />
            Ask
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-[10px] text-fg hover:bg-surface lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? <X size={20} strokeWidth={1.75} aria-hidden /> : <Menu size={20} strokeWidth={1.75} aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line px-4 py-2 lg:hidden">
          {NAV.map((n) => link(n, true))}
        </nav>
      )}
    </header>
  );
}
