import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { GlowButton } from "@/components/marketing/glow-button";

const cardBase =
  "group relative overflow-hidden rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-white/15";

/** /0x numbered feature card (reference services grid). */
export function NumberedCard({
  index,
  title,
  description,
  icon: Icon,
}: {
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className={cn(cardBase, "flex flex-col gap-6 p-8")}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-[var(--color-accent)]">/{index}</span>
        <span className="flex h-11 w-11 items-center justify-center rounded-pill border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-accent)] transition-colors group-hover:border-[var(--color-accent)]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-2xl font-medium">{title}</h3>
        <p className="leading-relaxed text-[var(--color-text-muted)]">{description}</p>
      </div>
      <div
        className="pointer-events-none absolute -bottom-px left-8 right-8 h-px origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden
      />
    </div>
  );
}

/** Process step with /0x index and connecting rhythm. */
export function ProcessStep({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
      <span className="font-mono text-sm text-[var(--color-accent)]">/{index}</span>
      <h3 className="font-display text-xl font-medium sm:text-2xl">{title}</h3>
      <p className="leading-relaxed text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

/** Climate-story / case card with category tag + date + badge. */
export function StoryCard({
  category,
  date,
  title,
  excerpt,
  metric,
}: {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  metric: string;
}) {
  return (
    <article className={cn(cardBase, "flex flex-col gap-6 p-8")}>
      <div className="aspect-[16/10] w-full rounded-2xl bg-gradient-to-br from-[var(--color-surface-2)] via-[var(--color-surface)] to-black ring-1 ring-inset ring-white/5">
        <div className="flex h-full items-end justify-between p-5">
          <Badge variant="accent">{metric}</Badge>
          <Badge variant="outline">{category}</Badge>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        <span>{date}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl font-medium">{title}</h3>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{excerpt}</p>
      </div>
    </article>
  );
}

/** Pricing tier card (reference pricing, "Popular" highlight on middle tier). */
export function PricingCard({
  name,
  price,
  cadence,
  description,
  features,
  cta,
  href,
  popular = false,
}: {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-8 rounded-card border p-8",
        popular
          ? "border-[var(--color-accent)] bg-[var(--color-surface)] glow-accent"
          : "border-[var(--color-border)] bg-[var(--color-surface)]",
      )}
    >
      {popular && (
        <Badge variant="accent" className="absolute right-8 top-8">
          Popular
        </Badge>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-lg font-medium uppercase tracking-wide">{name}</h3>
        <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
      </div>
      <div className="flex items-end gap-1">
        <span className="display text-5xl">{price}</span>
        {cadence && (
          <span className="pb-1 text-sm text-[var(--color-text-muted)]">{cadence}</span>
        )}
      </div>
      <ul className="flex flex-col gap-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-[var(--color-text)]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
            <span className="text-[var(--color-text-muted)]">{f}</span>
          </li>
        ))}
      </ul>
      <GlowButton
        href={href}
        variant={popular ? "primary" : "outline"}
        className="mt-auto w-full"
        withArrow={false}
      >
        {cta}
      </GlowButton>
    </div>
  );
}

/** Testimonial / quote card for the testimonial marquee. */
export function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <figure className="flex w-[22rem] shrink-0 flex-col gap-6 rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
      <blockquote className="leading-relaxed text-[var(--color-text)]">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-pill bg-[var(--color-accent)] font-display text-sm font-semibold text-[var(--color-accent-foreground)]"
          aria-hidden
        >
          {author.charAt(0)}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-medium">{author}</span>
          <span className="text-xs text-[var(--color-text-muted)]">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Trust/standards badge tile. */
export function StandardBadge({ name, kind }: { name: string; kind: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <span className="font-display text-lg font-medium">{name}</span>
      <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {kind}
      </span>
    </div>
  );
}

export { cardBase };
