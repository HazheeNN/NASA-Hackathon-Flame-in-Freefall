import { Suspense } from "react";
import { FindingsExplorer } from "@/components/findings/findings-explorer";
import { PageHeader } from "@/components/ui";
import { findings } from "@/lib/data";
import { experimentName, labDataset } from "@/lib/views";
import { visible } from "@/lib/visibility";

export const metadata = { title: "Findings · Flame in Freefall" };

export default function FindingsPage() {
  const dataset = labDataset();
  const rows = visible(findings).map((f) => ({
    id: f.id,
    title: f.title,
    statement: f.statement,
    experiment: experimentName(f.experimentId),
    themes: f.themes,
    gravityG: f.conditions.gravityG,
    oxygenPercent: f.conditions.oxygenPercent,
    verified: f.verified,
  }));
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="The evidence"
        title="Findings and data"
        lead="Every claim our SI uses, each with its NASA source and page, and the raw test tables behind the gaps map."
      />
      <Suspense>
        <FindingsExplorer findings={rows} tests={dataset?.tests ?? null} datasetVerified={dataset?.verified ?? false} />
      </Suspense>
    </div>
  );
}
