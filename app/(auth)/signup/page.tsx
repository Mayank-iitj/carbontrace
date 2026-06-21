import type { Metadata } from "next";
import { MilestonePlaceholder } from "@/components/marketing/milestone-placeholder";

export const metadata: Metadata = { title: "Start free" };

export default function SignupPage() {
  return (
    <MilestonePlaceholder
      eyebrow="Coming next"
      title="Sign-up lands in Milestone 2"
      description="Registration, email verification and the onboarding wizard arrive in the next build phase, wiring up Prisma + Auth.js."
    />
  );
}
