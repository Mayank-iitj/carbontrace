import { PageHeader } from "@/components/marketing/page-header";
import { SectionWrapper } from "@/components/marketing/primitives";
import { Reveal } from "@/components/motion/reveal";

/** Shared layout for legal pages (privacy, terms). */
export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: [string, string?];
  updated: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <>
      <PageHeader eyebrow="Legal" heading={title} description={updated} />
      <SectionWrapper>
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          {sections.map((s) => (
            <Reveal key={s.heading}>
              <div className="flex flex-col gap-3">
                <h2 className="font-display text-2xl font-medium">{s.heading}</h2>
                <p className="leading-relaxed text-[var(--color-text-muted)]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
