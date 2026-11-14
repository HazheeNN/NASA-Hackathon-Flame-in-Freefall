import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/ui";

export const metadata = { title: "Findings · Flame in Freefall" };

export default function Page() {
  return (
    <ComingSoon
      title="Findings"
      icon={<FileText size={28} strokeWidth={1.75} className="text-primary" aria-hidden />}
      what="Search and filter every finding by experiment, theme, gravity, O₂, platform and verification."
      wp="WP3b"
    />
  );
}
