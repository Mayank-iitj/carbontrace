"use client";

import { Carousel } from "@/components/marketing/carousel";
import { methodologySlides } from "@/lib/landing-content";

/**
 * Client wrapper so the landing page (a Server Component) doesn't have to pass
 * a render function across the server→client boundary.
 */
export function MethodologyCarousel() {
  return (
    <Carousel
      items={methodologySlides}
      renderItem={(slide) => (
        <div className="rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-10">
          <h3 className="display text-3xl sm:text-4xl">{slide.title}</h3>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
            {slide.body}
          </p>
          <p className="mt-8 font-mono text-sm text-[var(--color-accent)]">
            Source: {slide.source}
          </p>
        </div>
      )}
    />
  );
}
