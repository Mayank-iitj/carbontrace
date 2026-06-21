import type { Metadata } from "next";
import { MilestonePlaceholder } from "@/components/marketing/milestone-placeholder";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <MilestonePlaceholder
      eyebrow="Coming next"
      title="Admin arrives with the data layer"
      description="User management, emission-factor CRUD and content tools land once Prisma and Auth.js are wired in Milestone 2+."
    />
  );
}
