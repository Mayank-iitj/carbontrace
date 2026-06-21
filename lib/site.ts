/** Central site config — used across metadata, nav, and footer. */
export const siteConfig = {
  name: "CarbonTrace",
  tagline: "Measure. Reduce. Offset.",
  description:
    "CarbonTrace turns your everyday choices into measurable climate action — track your carbon footprint, get AI-guided insights, hit reduction goals, and offset what's left with verified projects.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://carbontrace.app",
  email: "hello@carbontrace.app",
  location: "Remote-first · London · San Francisco",
} as const;

export const navLinks = [
  { label: "Features", href: "/features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Methodology", href: "/methodology" },
] as const;

export const emissionCategories = [
  "Transport",
  "Home Energy",
  "Food",
  "Shopping",
  "Travel",
  "Waste",
] as const;
