import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { SectionWrapper } from "@/components/marketing/primitives";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { NumberedCard } from "@/components/marketing/cards";
import { features } from "@/lib/landing-content";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Track, analyze, reduce and offset your carbon footprint with versioned emission factors, AI insights, goals and verified offsets.",
};

const detail = [
  {
    title: "A footprint you can break down",
    body: "Donut and stacked views split your CO₂e across transport, energy, food, shopping and waste — with deltas versus the previous period and equivalencies you can picture.",
  },
  {
    title: "Trends that tell the truth",
    body: "Daily to yearly time-series, year-over-year comparison, moving averages and anomaly highlights. Export any chart's data as CSV.",
  },
  {
    title: "Goals with accountability",
    body: "Set reduction goals with auto-filled baselines, then get on-track / off-track status and milestone nudges by email and in-app.",
  },
  {
    title: "Insights ranked by impact",
    body: "AI recommendations run on anonymised category summaries and return prioritised actions with estimated savings — never vague advice.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Features"
        heading={["Track, analyze,", "reduce, offset"]}
        description="A complete toolkit for turning everyday choices into measurable climate action."
      />
      <SectionWrapper>
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Reveal key={f.index}>
              <NumberedCard {...f} />
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>
      <SectionWrapper
        eyebrow="In depth"
        heading={["Designed for", "real reductions"]}
        dotGrid
      >
        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {detail.map((d) => (
            <Reveal key={d.title}>
              <div className="rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
                <h3 className="font-display text-2xl font-medium">{d.title}</h3>
                <p className="mt-4 leading-relaxed text-[var(--color-text-muted)]">{d.body}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>
    </>
  );
}
