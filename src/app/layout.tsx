import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { FlameMark } from "@/components/flame-mark";
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
      <body className="min-h-dvh antialiased">
        <header className="border-b border-line">
          <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 lg:px-10">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <FlameMark />
              <span>Flame in Freefall</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] px-4 py-8 lg:px-10 lg:py-12">{children}</main>
        <footer className="mx-auto max-w-[1440px] px-4 pb-10 text-sm text-muted lg:px-10">
          Built for the NASA Space Apps Challenge from public NASA data. Not affiliated with or endorsed by NASA.
        </footer>
      </body>
    </html>
  );
}
