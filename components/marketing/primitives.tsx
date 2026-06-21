import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/** Small uppercase, letter-spaced micro-label above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
      {children}
    </span>
  );
}

/**
 * Oversized display heading. `lines` renders a two-line stacked variant
 * (mirrors the reference's "Create, / Impactful" pattern); the second line
 * can be accented.
 */
export function DisplayHeading({
  lines,
  accentLine = 1,
  className,
  as: Tag = "h2",
}: {
  lines: [string, string?];
  accentLine?: 0 | 1 | null;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "display text-balance text-4xl sm:text-5xl lg:text-6xl",
        className,
      )}
    >
      {lines.map((line, i) =>
        line ? (
          <span
            key={i}
            className={cn(
              "block",
              accentLine === i && "text-[var(--color-accent)]",
            )}
          >
            {line}
          </span>
        ) : null,
      )}
    </Tag>
  );
}

/**
 * Section shell: consistent vertical rhythm, optional dot-grid background,
 * and a scroll-reveal header block (eyebrow + heading + description).
 */
export function SectionWrapper({
  id,
  eyebrow,
  heading,
  accentLine = 1,
  description,
  children,
  className,
  dotGrid = false,
  align = "left",
}: {
  id?: string;
  eyebrow?: string;
  heading?: [string, string?];
  accentLine?: 0 | 1 | null;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  dotGrid?: boolean;
  align?: "left" | "center";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 border-t border-[var(--color-border)] py-20 sm:py-28",
        dotGrid && "bg-dot-grid",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        {(eyebrow || heading || description) && (
          <div
            className={cn(
              "mb-12 flex max-w-3xl flex-col gap-5",
              align === "center" && "mx-auto items-center text-center",
            )}
          >
            {eyebrow && (
              <Reveal>
                <Eyebrow>{eyebrow}</Eyebrow>
              </Reveal>
            )}
            {heading && (
              <Reveal delay={0.05}>
                <DisplayHeading lines={heading} accentLine={accentLine} />
              </Reveal>
            )}
            {description && (
              <Reveal delay={0.1}>
                <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">
                  {description}
                </p>
              </Reveal>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
