import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of CarbonTrace.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title={["Terms of", "Service"]}
      updated="Last updated: 21 June 2026"
      sections={[
        {
          heading: "Acceptance",
          body: "By creating an account or using CarbonTrace you agree to these terms. If you don't agree, please don't use the service.",
        },
        {
          heading: "The service",
          body: "CarbonTrace provides carbon-footprint estimation, insights and offset facilitation. Estimates are based on published emission factors and are provided for informational purposes.",
        },
        {
          heading: "Accounts",
          body: "You're responsible for safeguarding your account credentials and for activity under your account. Notify us of any unauthorised use.",
        },
        {
          heading: "Payments & offsets",
          body: "Paid plans and offset purchases are processed by Stripe. Offset certificates correspond to retirements with the named registry. Card details are never stored by CarbonTrace.",
        },
        {
          heading: "Liability",
          body: "The service is provided 'as is'. To the extent permitted by law, CarbonTrace is not liable for indirect or consequential damages arising from use of the estimates.",
        },
        {
          heading: "Contact",
          body: "Questions about these terms? Email hello@carbontrace.app.",
        },
      ]}
    />
  );
}
