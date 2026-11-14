import { Orbit } from "lucide-react";
import { ComingSoon } from "@/components/ui";

export const metadata = { title: "Same Fire, Four Worlds · Flame in Freefall" };

export default function Page() {
  return (
    <ComingSoon
      title="Same Fire, Four Worlds"
      icon={<Orbit size={28} strokeWidth={1.75} className="text-primary" aria-hidden />}
      what="Earth, the ISS, the Moon and Mars side by side: each world's gravity and cabin air, how fire differs there, and what was never tested."
      wp="WP5"
    />
  );
}
