import { MapIcon } from "lucide-react";
import { ComingSoon } from "@/components/ui";

export const metadata = { title: "Where NASA has never burned · Flame in Freefall" };

export default function Page() {
  return (
    <ComingSoon
      title="Where NASA has never burned"
      icon={<MapIcon size={28} strokeWidth={1.75} className="text-primary" aria-hidden />}
      what="A map of every tested condition (gravity × O₂), the empty regions, and the experiments our SI proposes next."
      wp="WP6"
    />
  );
}
