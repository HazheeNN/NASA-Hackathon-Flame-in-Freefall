import type { Metadata } from "next";
import { DM_Mono, Public_Sans } from "next/font/google";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { chatSuggestions, searchIndex } from "@/lib/search";
import "./globals.css";

// NASA Horizon Design System typefaces (DESIGN.md › Typography).
const sans = Public_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-public-sans" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

export const metadata: Metadata = {
  title: "Flame in Freefall",
  description: "See how fire behaves on Earth, in orbit, on the Moon and on Mars, from verified NASA microgravity combustion data.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <SiteHeader index={searchIndex()} suggestions={chatSuggestions()} />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-10 lg:py-12">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-8 text-[13px] text-muted sm:flex-row sm:justify-between lg:px-10">
            <p>Built for the NASA Space Apps Challenge from public NASA data. Not affiliated with or endorsed by NASA. Logo: SI-generated.</p>
            <p>
              Every number cites NASA ·{" "}
              <Link href="/sources" className="text-primary hover:underline">
                Sources &amp; method
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
