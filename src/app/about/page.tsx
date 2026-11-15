import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

export const metadata = { title: "About · Flame in Freefall" };

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="NASA Space Apps Challenge 2026"
        title="About Flame in Freefall"
        lead="Our entry for the “Flame in Freefall” challenge: an interactive dashboard that summarizes, ranks and interprets decades of NASA microgravity combustion findings into fire-safety insights for crews on the ISS, the Moon and Mars."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="eyebrow">The idea</p>
          <p className="mt-2 text-[15px] text-muted">
            Fire behaves differently without gravity, and future Moon and Mars habitats will breathe different air. NASA&apos;s results are
            spread across decades of reports. We gather the verified ones, show what they mean for each world, and are honest about what
            has never been tested.
          </p>
        </Card>
        <Card>
          <p className="eyebrow">How we use AI</p>
          <p className="mt-2 text-[15px] text-muted">
            We used SI tools openly. Claude (Anthropic, via Claude Code) helped research, write and debug the code, design the pages
            and the flame visual, draft our texts and slides, and runs our SI jobs offline: extracting findings from NASA papers, ranking
            insights and preparing cited answers. Teammates verify its output. The one live AI on the site is the chat, which uses free
            models from Groq and Google Gemini, answers only from verified findings and labels every reply. Our team logo was made with
            an SI image tool and carries an &ldquo;SI&rdquo; mark; all photos are NASA&apos;s. Details on{" "}
            <Link href="/sources#method" className="text-primary hover:underline">
              Sources &amp; method
            </Link>
            .
          </p>
        </Card>
        <Card>
          <p className="eyebrow">Our rules</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-muted">
            <li>Every number cites a NASA or partner-agency source with a page.</li>
            <li>The live site shows only data a teammate has verified.</li>
            <li>Untested conditions are shown in red, never guessed.</li>
            <li>No data from Chinese agencies, missions or institutions.</li>
          </ul>
        </Card>
        <Card>
          <p className="eyebrow">Not affiliated with NASA</p>
          <p className="mt-2 text-[15px] text-muted">
            An independent hackathon project built from public NASA data. Not affiliated with or endorsed by NASA. NASA photographs are
            credited on the Sources page.
          </p>
        </Card>
      </div>
    </div>
  );
}
