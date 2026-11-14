import { AskSearch } from "@/components/ask-search";
import { AiLabel, CitedText, Label, MissionChip, PageHeader } from "@/components/ui";
import { answers } from "@/lib/data";
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

      {answers.answers.length > 0 && (
        <section aria-labelledby="all-answers" className="space-y-4">
          <h2 id="all-answers" className="text-[22px] font-semibold">
            All prepared answers ({answers.answers.length})
          </h2>
          {answers.answers.map((a) => (
            <article key={a.id} id={a.id} className="scroll-mt-24 rounded-2xl border border-line bg-surface p-6">
              <Label>{a.id}</Label>
              <h3 className="mt-1 text-[19px] font-semibold">{a.question}</h3>
              <p className="mt-3 text-[16px] leading-relaxed">
                <CitedText text={a.answer} />
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {a.missions.map((m) => (
                  <MissionChip key={m} mission={m} />
                ))}
                {a.findingIds.length > 0 && <AiLabel count={a.findingIds.length} />}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
