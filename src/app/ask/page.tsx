import { AskSearch } from "@/components/ask-search";
import { PageHeader } from "@/components/ui";
import { searchIndex } from "@/lib/search";

export const metadata = { title: "Ask · Flame in Freefall" };

// F7: the question library. Prepared, reviewed SI answers (data/generated/answers.json) plus
// every NASA source, searchable as you type. No live AI call (docs/ai.md › Mode A).
export default function AskPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Prepared by our SI, reviewed by the team"
        title="Ask"
        lead="Questions mission planners and judges ask, answered from cited NASA findings. Search as you type; open the same search anywhere with Ctrl/⌘ K."
      />
      <AskSearch items={searchIndex()} autoFocus />
    </div>
  );
}
