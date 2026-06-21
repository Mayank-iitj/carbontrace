import type { Metadata } from "next";
import { MilestonePlaceholder } from "@/components/marketing/milestone-placeholder";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <MilestonePlaceholder
      eyebrow="Coming next"
      title="Sign-in lands in Milestone 2"
      description="Auth.js with email/password, Google and GitHub is the next build phase. For now, explore the product story on the landing page."
    />
  );
}
