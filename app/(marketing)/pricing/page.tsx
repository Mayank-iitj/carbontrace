import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { SectionWrapper } from "@/components/marketing/primitives";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { PricingCard } from "@/components/marketing/cards";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { pricing, faqs } from "@/lib/landing-content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free and upgrade for integrations, AI insights and team features. Simple, transparent CarbonTrace pricing.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing plan"
        heading={["Pricing that scales", "with your ambition"]}
        description="Begin measuring for free. Upgrade when you want automation, AI insights and team-wide reductions."
      />
      <SectionWrapper>
        <RevealGroup className="grid gap-6 lg:grid-cols-3">
          {pricing.map((p) => (
            <Reveal key={p.name}>
              <PricingCard {...p} />
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>
      <SectionWrapper eyebrow="FAQs" heading={["Pricing", "questions"]} dotGrid>
        <Reveal className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible>
            {faqs.slice(5).map((faq, i) => (
              <AccordionItem key={faq.q} value={`p-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </SectionWrapper>
    </>
  );
}
