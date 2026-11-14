import { FlameLab } from "@/components/lab/flame-lab";
import { atmospheres, flex, formulas, worlds } from "@/lib/data";
import { insightCards, labDataset, labWorlds, visibleFormulas } from "@/lib/views";
import { showUnverified } from "@/lib/visibility";

// Home = the Flame Lab (decision 2026-11-14): conditions, the flame, the four worlds, what NASA
// measured, and the ranked insights for the chosen world.
export default function Home() {
  const { cards, sample } = insightCards();
  const unverified = showUnverified
    ? worlds.filter((w) => !w.verified).length +
      atmospheres.filter((a) => !a.verified).length +
      formulas.filter((f) => !f.verified).length +
      (flex.verified ? 0 : 1)
    : 0;
  return (
    <FlameLab
      worlds={labWorlds()}
      dataset={labDataset()}
      formulas={visibleFormulas()}
      insights={cards}
      sampleInsights={sample}
      hiddenOnLive={unverified}
    />
  );
}
