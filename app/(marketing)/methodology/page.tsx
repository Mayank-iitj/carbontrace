import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { SectionWrapper } from "@/components/marketing/primitives";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { StandardBadge } from "@/components/marketing/cards";
import { standards, methodologySlides } from "@/lib/landing-content";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How CarbonTrace calculates CO₂e: versioned, region-aware emission factors from DEFRA/BEIS, US EPA and the IPCC, snapshotted at log time.",
};

const factorTable = [
  { category: "Transport", example: "Petrol car (avg)", factor: "0.170 kg CO₂e / km", source: "DEFRA/BEIS 2024" },
  { category: "Transport", example: "Short-haul flight (economy)", factor: "0.151 kg CO₂e / km", source: "DEFRA/BEIS 2024" },
  { category: "Home Energy", example: "UK grid electricity", factor: "0.207 kg CO₂e / kWh", source: "DEFRA/BEIS 2024" },
  { category: "Home Energy", example: "Natural gas", factor: "0.183 kg CO₂e / kWh", source: "DEFRA/BEIS 2024" },
  { category: "Food", example: "Beef (per kg)", factor: "≈ 60 kg CO₂e / kg", source: "Our World in Data" },
  { category: "Waste", example: "Mixed landfill (per kg)", factor: "0.446 kg CO₂e / kg", source: "US EPA WARM" },
];

export default function MethodologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Methodology"
        heading={["How we turn habits", "into honest numbers"]}
        description="Every figure in CarbonTrace traces back to a published source and a date. Here's exactly how the engine works."
      />

      <SectionWrapper heading={["Principles", undefined]} accentLine={null}>
        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {methodologySlides.map((s) => (
            <Reveal key={s.title}>
              <div className="flex h-full flex-col gap-4 rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
                <h3 className="font-display text-xl font-medium">{s.title}</h3>
                <p className="leading-relaxed text-[var(--color-text-muted)]">{s.body}</p>
                <p className="mt-auto font-mono text-xs text-[var(--color-accent)]">{s.source}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>

      <SectionWrapper
        eyebrow="Sample factors"
        heading={["A few of the", "factors we use"]}
        description="Illustrative values shown for transparency. In-app these are versioned, region-aware, and snapshotted onto each activity."
        dotGrid
      >
        <Reveal>
          <div className="overflow-x-auto rounded-card border border-[var(--color-border)]">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
                <tr>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Example</th>
                  <th className="px-5 py-4 font-medium">Factor</th>
                  <th className="px-5 py-4 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {factorTable.map((row) => (
                  <tr key={row.example} className="border-t border-[var(--color-border)]">
                    <td className="px-5 py-4 text-[var(--color-accent)]">{row.category}</td>
                    <td className="px-5 py-4">{row.example}</td>
                    <td className="px-5 py-4 font-mono">{row.factor}</td>
                    <td className="px-5 py-4 text-[var(--color-text-muted)]">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper eyebrow="Standards & sources" heading={["What we", "build on"]}>
        <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {standards.map((s) => (
            <Reveal key={s.name}>
              <StandardBadge {...s} />
            </Reveal>
          ))}
        </RevealGroup>
      </SectionWrapper>
    </>
  );
}
