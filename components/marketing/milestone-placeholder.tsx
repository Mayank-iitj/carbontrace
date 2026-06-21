import Link from "next/link";
import { Leaf } from "lucide-react";
import { GlowButton } from "@/components/marketing/glow-button";
import { Eyebrow } from "@/components/marketing/primitives";

/**
 * Friendly placeholder for routes that arrive in a later milestone
 * (auth, dashboard, admin). Keeps the structure + links working today.
 */
export function MilestonePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dot-grid px-6 text-center">
      <Link href="/" className="mb-8 flex items-center gap-2 font-display text-lg font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-[var(--color-accent)] text-[var(--color-accent-foreground)]">
          <Leaf className="h-4 w-4" />
        </span>
        CarbonTrace
      </Link>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="display mt-6 max-w-2xl text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-md text-[var(--color-text-muted)]">{description}</p>
      <div className="mt-10">
        <GlowButton href="/">Back to home</GlowButton>
      </div>
    </main>
  );
}
