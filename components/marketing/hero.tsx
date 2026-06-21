"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/utils";
import { GlowButton } from "@/components/marketing/glow-button";
import { Eyebrow } from "@/components/marketing/primitives";

export function Hero() {
  const reduced = useReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay },
        };

  return (
    <section className="relative isolate overflow-hidden bg-dot-grid pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Animated accent glow background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <motion.div
          className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,255,83,0.18),transparent_60%)] blur-3xl"
          animate={reduced ? undefined : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div {...rise(0)}>
            <Eyebrow>Carbon footprint, finally measurable</Eyebrow>
          </motion.div>

          <motion.h1
            {...rise(0.08)}
            className="display mt-6 text-6xl text-balance sm:text-7xl lg:text-8xl"
          >
            <span className="block">Measure.</span>
            <span className="block text-[var(--color-accent)]">Reduce.</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)] sm:text-xl"
          >
            CarbonTrace turns your everyday choices into measurable climate action. Track every
            tonne, get AI-guided insights, hit your reduction goals, and offset the rest with
            verified projects.
          </motion.p>

          <motion.div
            {...rise(0.24)}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <GlowButton href="/signup" size="lg">
              Start free
            </GlowButton>
            <GlowButton href="/#how-it-works" size="lg" variant="secondary" withArrow={false}>
              See how it works
            </GlowButton>
          </motion.div>

          <motion.div
            {...rise(0.32)}
            className="mt-10 flex items-center gap-3 text-sm text-[var(--color-text-muted)]"
          >
            <span className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
              ))}
            </span>
            Loved by 27,000+ members reducing their footprint
          </motion.div>
        </div>
      </div>
    </section>
  );
}
