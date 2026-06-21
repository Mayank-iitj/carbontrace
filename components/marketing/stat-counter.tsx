"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animated number that counts up when scrolled into view (reference stat band).
 * Falls back to the final value immediately under reduced-motion.
 */
export function StatCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  className,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduced, value, duration, motionValue]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div ref={ref} className={cn("flex flex-col gap-2", className)}>
      <span className="display text-5xl text-[var(--color-text)] sm:text-6xl lg:text-7xl">
        {prefix}
        {formatted}
        {suffix}
      </span>
      <span className="text-sm uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {label}
      </span>
    </div>
  );
}
