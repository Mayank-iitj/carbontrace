"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/utils";

/**
 * Arrow-navigated carousel (reference team slider).
 * Renders one slide at a time with a crossfade; keyboard + button accessible.
 */
export function Carousel<T>({
  items,
  renderItem,
  className,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const count = items.length;

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="relative min-h-[20rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          >
            {renderItem(items[index]!, index)}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2" role="tablist" aria-label="Carousel position">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-8 bg-[var(--color-accent)]"
                  : "w-4 bg-[var(--color-surface-2)] hover:bg-[var(--color-text-muted)]",
              )}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next slide"
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
