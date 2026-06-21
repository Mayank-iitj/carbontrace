import { DisplayHeading, Eyebrow } from "@/components/marketing/primitives";
import { Reveal } from "@/components/motion/reveal";

/** Shared hero header for secondary marketing pages. */
export function PageHeader({
  eyebrow,
  heading,
  description,
}: {
  eyebrow: string;
  heading: [string, string?];
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-dot-grid pt-36 pb-16 sm:pt-44">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex max-w-3xl flex-col gap-5">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <DisplayHeading as="h1" lines={heading} accentLine={1} />
          </Reveal>
          {description && (
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">
                {description}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
