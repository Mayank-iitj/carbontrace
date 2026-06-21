import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { SectionWrapper } from "@/components/marketing/primitives";
import { StatCounter } from "@/components/marketing/stat-counter";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { stats } from "@/lib/landing-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "CarbonTrace exists to make personal and organisational carbon footprints measurable, trustworthy and actionable.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        heading={["Make carbon", "measurable for everyone"]}
        description="We started CarbonTrace because you can't reduce what you can't measure — and most people have never seen their footprint, let alone a credible way to act on it."
      />

      <SectionWrapper heading={["Our mission", undefined]} accentLine={null}>
        <Reveal className="max-w-3xl">
          <p className="text-xl leading-relaxed text-[var(--color-text-muted)]">
            We turn opaque climate data into a number you can see, trust and shrink. That means
            transparent methodology, factors you can check, and recommendations ranked by real
            impact — not guilt. Whether you&apos;re one person or a whole organisation, the goal is
            the same: fewer tonnes, measured honestly.
          </p>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper dotGrid>
        <RevealGroup className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((s) => (
            <Reveal key={s.label}>
              <StatCounter
                value={s.value}
                suffix={s.suffix}
                decimals={s.decimals ?? 0}
                label={s.label}
              />
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>

      <SectionWrapper id="careers" eyebrow="Careers" heading={["Build the climate", "tools we need"]}>
        <Reveal className="max-w-2xl">
          <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">
            We&apos;re a small, remote-first team of engineers, designers and climate scientists.
            If credible, beautifully-built climate software is your thing, we&apos;d love to hear
            from you — reach out via the contact page.
          </p>
        </Reveal>
      </SectionWrapper>
    </>
  );
}
