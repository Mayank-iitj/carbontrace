import Link from "next/link";
import { Hero } from "@/components/marketing/hero";
import { Marquee } from "@/components/marketing/marquee";
import { StatCounter } from "@/components/marketing/stat-counter";
import { MethodologyCarousel } from "@/components/marketing/methodology-carousel";
import { AiInsightsDemo } from "@/components/marketing/ai-insights";
import { ContactForm } from "@/components/marketing/contact-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SectionWrapper,
  DisplayHeading,
  Eyebrow,
} from "@/components/marketing/primitives";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import {
  NumberedCard,
  ProcessStep,
  StoryCard,
  PricingCard,
  TestimonialCard,
  StandardBadge,
} from "@/components/marketing/cards";
import {
  features,
  stats,
  stories,
  process,
  standards,
  pricing,
  testimonials,
  faqs,
} from "@/lib/landing-content";
import { emissionCategories, siteConfig } from "@/lib/site";

const partners = [
  "Northwind",
  "Greenloop",
  "Helios Energy",
  "Terra Foods",
  "Veloce",
  "BlueSky Air",
  "Lumen Grid",
];

export default function HomePage() {
  return (
    <>
      {/* 1. Navbar lives in the marketing layout. 2. Hero */}
      <Hero />

      {/* 3. Category marquee */}
      <div className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-6">
        <Marquee
          speed={28}
          items={emissionCategories.map((c) => (
            <span key={c} className="font-display text-xl font-medium text-[var(--color-text)]">
              {c}
            </span>
          ))}
        />
      </div>

      {/* 4. Partner / press logo ticker */}
      <div className="py-10">
        <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Trusted by climate-forward teams
        </p>
        <Marquee
          speed={40}
          reverse
          separator=""
          items={partners.map((p) => (
            <span
              key={p}
              className="font-display text-lg font-medium text-[var(--color-text-muted)] grayscale transition hover:text-[var(--color-text)]"
            >
              {p}
            </span>
          ))}
        />
      </div>

      {/* 5. What We Do — features */}
      <SectionWrapper
        id="features"
        eyebrow="What we do"
        heading={["Everything you need to", "act on your footprint"]}
        description="Four connected steps take you from a number you can't see to climate action you can measure."
      >
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Reveal key={f.index}>
              <NumberedCard {...f} />
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>

      {/* 6. Impact stats band */}
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

      {/* 7. Climate stories */}
      <SectionWrapper
        eyebrow="Climate stories"
        heading={["Real reductions,", "measured and verified"]}
        description="What it looks like when people and teams turn tracking into tonnes saved."
      >
        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {stories.map((s) => (
            <Reveal key={s.title}>
              <StoryCard {...s} />
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>

      {/* 8. How it works */}
      <SectionWrapper
        id="how-it-works"
        eyebrow="The journey"
        heading={["From baseline", "to lasting change"]}
        dotGrid
      >
        <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p) => (
            <Reveal key={p.index}>
              <ProcessStep {...p} />
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>

      {/* 8b. AI insights demo — powered by Groq */}
      <SectionWrapper
        id="ai-insights"
        eyebrow="AI insights · powered by Groq"
        heading={["See your footprint,", "and how to shrink it"]}
        description="Tell us a little about your lifestyle and our Groq-powered engine estimates your annual footprint and ranks your highest-impact actions — in seconds."
      >
        <Reveal>
          <AiInsightsDemo />
        </Reveal>
      </SectionWrapper>

      {/* 9. Trust / standards */}
      <SectionWrapper
        eyebrow="Built on credible science"
        heading={["Standards and sources", "you can check"]}
        description="No black boxes. We cite the registries, accounting standards and emission factors behind every number."
      >
        <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {standards.map((s) => (
            <Reveal key={s.name}>
              <StandardBadge {...s} />
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>

      {/* 10. Methodology carousel */}
      <SectionWrapper
        eyebrow="Our methodology"
        heading={["Numbers you can", "actually trust"]}
        dotGrid
      >
        <Reveal>
          <MethodologyCarousel />
        </Reveal>
      </SectionWrapper>

      {/* 11. Pricing */}
      <SectionWrapper
        id="pricing"
        eyebrow="Pricing plan"
        heading={["Start free,", "scale when ready"]}
        description="No credit card to begin. Upgrade for automation, AI insights and team features."
      >
        <RevealGroup className="grid gap-6 lg:grid-cols-3">
          {pricing.map((p) => (
            <Reveal key={p.name}>
              <PricingCard {...p} />
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>

      {/* 12. Testimonials */}
      <SectionWrapper
        eyebrow="Testimonials"
        heading={["Loved by people", "who measure"]}
        dotGrid
      >
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <p className="display text-2xl text-balance sm:text-3xl">
            &ldquo;The first tracker I actually trust — versioned factors, snapshots, and
            recommendations ranked by real impact.&rdquo;
          </p>
        </Reveal>
        <div className="flex flex-col gap-6">
          <Marquee
            speed={50}
            separator=""
            items={testimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.author} {...t} />
            ))}
          />
          <Marquee
            speed={50}
            reverse
            separator=""
            items={testimonials.slice(3).map((t) => (
              <TestimonialCard key={t.author} {...t} />
            ))}
          />
        </div>
      </SectionWrapper>

      {/* 13. FAQ */}
      <SectionWrapper eyebrow="FAQs" heading={["Questions,", "answered"]}>
        <Reveal className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`item-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </SectionWrapper>

      {/* 14. Let's Talk — CTA / contact */}
      <SectionWrapper id="contact" dotGrid>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <Reveal>
              <Eyebrow>Let&apos;s talk</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <DisplayHeading lines={["Ready to measure", "what matters?"]} accentLine={1} />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-md text-lg leading-relaxed text-[var(--color-text-muted)]">
                Questions about methodology, teams, or your own footprint? Send us a note and
                we&apos;ll get back within one business day.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex flex-col gap-1 text-sm text-[var(--color-text-muted)]">
                <span>{siteConfig.location}</span>
                <Link
                  href={`mailto:${siteConfig.email}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {siteConfig.email}
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </SectionWrapper>

      {/* 15. Footer lives in the marketing layout. */}
    </>
  );
}
