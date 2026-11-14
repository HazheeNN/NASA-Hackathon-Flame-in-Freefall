import { InsightsList } from "@/components/insights/insights-list";
import { PageHeader, SampleBanner } from "@/components/ui";
import { insightCards } from "@/lib/views";

export const metadata = { title: "Ranked insights · Flame in Freefall" };

// F5 + F20: every insight by rank, filterable, each with its confidence meter.
export default function InsightsPage() {
  const { cards, sample } = insightCards();
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Ranked by our SI"
        title="Fire-safety insights"
        lead="Our SI read the verified findings, linked them across experiments and ranked what matters most for crew safety. Each insight cites the NASA findings behind it and says how sure we are."
      />
      {sample && <SampleBanner />}
      <InsightsList cards={cards} />
    </div>
  );
}
