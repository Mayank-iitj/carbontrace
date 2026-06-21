import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CarbonTrace collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={["Privacy", "Policy"]}
      updated="Last updated: 21 June 2026"
      sections={[
        {
          heading: "Data we collect",
          body: "We collect the account details you provide (name, email) and the activity data you log to calculate your footprint. We do not sell your personal data.",
        },
        {
          heading: "How we use it",
          body: "Your data is used to compute and display your CO₂e footprint, power insights, and operate the service. AI insights run on anonymised category summaries, never raw personal records.",
        },
        {
          heading: "Your rights",
          body: "You can export all of your data or delete your account at any time from settings. Deletion removes your personal records in line with applicable data-protection law (including GDPR).",
        },
        {
          heading: "Cookies",
          body: "We use essential cookies for authentication and a cookie-consent banner for any analytics. You can manage non-essential cookies at any time.",
        },
        {
          heading: "Contact",
          body: "Questions about privacy? Email hello@carbontrace.app and we'll respond promptly.",
        },
      ]}
    />
  );
}
