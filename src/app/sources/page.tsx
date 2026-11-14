import { BookOpen } from "lucide-react";
import { ComingSoon } from "@/components/ui";

export const metadata = { title: "Sources & method · Flame in Freefall" };

export default function Page() {
  return (
    <ComingSoon
      title="Sources & method"
      icon={<BookOpen size={28} strokeWidth={1.75} className="text-primary" aria-hidden />}
      what="Every NASA source we used, how the SI works and ranks, the formulas we use and their limits, and our AI disclosure."
      wp="WP7"
    />
  );
}
