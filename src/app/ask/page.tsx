import { MessageSquareText } from "lucide-react";
import { ComingSoon } from "@/components/ui";

export const metadata = { title: "Ask · Flame in Freefall" };

export default function Page() {
  return (
    <ComingSoon
      title="Ask"
      icon={<MessageSquareText size={28} strokeWidth={1.75} className="text-primary" aria-hidden />}
      what="Questions mission planners and judges ask, with prepared answers that cite NASA findings. Search as you type."
      wp="WP4"
    />
  );
}
