import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/marketing/page-header";
import { SectionWrapper } from "@/components/marketing/primitives";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/marketing/contact-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the CarbonTrace team about methodology, teams or your footprint.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Let's talk"
        heading={["We'd love to", "hear from you"]}
        description="Questions about methodology, teams, or getting started? Send a note and we'll reply within one business day."
      />
      <SectionWrapper>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col gap-4">
            <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">
              Prefer email? Reach us directly:
            </p>
            <Link
              href={`mailto:${siteConfig.email}`}
              className="font-display text-2xl text-[var(--color-accent)] hover:underline"
            >
              {siteConfig.email}
            </Link>
            <p className="text-sm text-[var(--color-text-muted)]">{siteConfig.location}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <ContactForm />
          </Reveal>
        </div>
      </SectionWrapper>
    </>
  );
}
