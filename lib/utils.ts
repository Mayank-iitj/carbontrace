import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared scroll-reveal easing — mirrors the reference's smooth cubic-bezier. */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
