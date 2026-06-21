import type { Metadata } from "next";
import { MilestonePlaceholder } from "@/components/marketing/milestone-placeholder";

export const metadata: Metadata = { title: "Dashboard" };

export default function AppDashboardPage() {
  return (
    <MilestonePlaceholder
      eyebrow="Coming next"
      title="The dashboard is in Milestone 3"
      description="Footprint overview, trends, goals and the emissions engine plug into this scaffold next. The design system and adapters are already in place."
    />
  );
}
