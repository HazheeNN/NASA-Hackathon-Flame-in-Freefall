import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-plex-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "Flame in Freefall",
  description: "AI-powered fire safety insights from NASA microgravity combustion research.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 lg:px-10 lg:py-12">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-8 text-[13px] text-muted sm:flex-row sm:justify-between lg:px-10">
            <p>Built for the NASA Space Apps Challenge from public NASA data. Not affiliated with or endorsed by NASA.</p>
            <p>
              Every claim cites its source ·{" "}
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
