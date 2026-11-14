import { GapsMap } from "@/components/gaps/gaps-map";
import { PageHeader } from "@/components/ui";
import { labDataset, labWorlds } from "@/lib/views";

export const metadata = { title: "Gaps map · Flame in Freefall" };

export default function GapsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Where NASA has never burned"
        title="The gaps map"
        lead="Every verified NASA test is a dot. The red is where nobody has burned anything yet, including the air NASA plans for Moon and Mars habitats."
      />
      <GapsMap dataset={labDataset()} worlds={labWorlds()} />
    </div>
  );
}
