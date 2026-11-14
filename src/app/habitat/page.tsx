import { Rocket } from "lucide-react";
import { ComingSoon } from "@/components/ui";

export const metadata = { title: "Habitat Designer · Flame in Freefall" };

export default function Page() {
  return (
    <ComingSoon
      title="Habitat Designer"
      icon={<Rocket size={28} strokeWidth={1.75} className="text-primary" aria-hidden />}
      what="Pick a world, a cabin atmosphere, a material and airflow, and see what NASA has tested near those conditions."
      wp="WP5"
    />
  );
}
