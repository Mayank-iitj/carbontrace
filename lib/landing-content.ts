import {
  Activity,
  BarChart3,
  Sprout,
  Trees,
  type LucideIcon,
} from "lucide-react";

/** Original CarbonTrace landing content (no copy reused from the reference). */

export const features: {
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    index: "01",
    title: "Track",
    description:
      "Log drives, flights, meals and bills in seconds. Every entry is converted to CO₂e using versioned, region-aware emission factors.",
    icon: Activity,
  },
  {
    index: "02",
    title: "Analyze",
    description:
      "See your footprint break down by category, trend over time, and stack up against national and 1.5°C-aligned targets.",
    icon: BarChart3,
  },
  {
    index: "03",
    title: "Reduce",
    description:
      "Set reduction goals and get AI-prioritised actions with estimated savings — the highest-impact moves, ranked for you.",
    icon: Sprout,
  },
  {
    index: "04",
    title: "Offset",
    description:
      "Neutralise what you can't cut yet through verified Gold Standard and Verra projects, with a certificate for every tonne.",
    icon: Trees,
  },
];

export const stats = [
  { value: 48200, suffix: "t", label: "CO₂e tracked" },
  { value: 12.4, suffix: "k t", decimals: 1, label: "Tonnes reduced" },
  { value: 1.9, suffix: "M", decimals: 1, label: "Trees equivalent" },
  { value: 27000, suffix: "+", label: "Active members" },
];

export const stories = [
  {
    category: "Transport",
    date: "May 2026",
    metric: "−42%",
    title: "From two cars to one cargo bike",
    excerpt:
      "How the Okafor household halved their commute emissions in a single quarter by switching short trips to an e-bike.",
  },
  {
    category: "Home Energy",
    date: "Apr 2026",
    metric: "−1.8 t",
    title: "A heat pump pays for itself",
    excerpt:
      "Tracking gas vs. electricity made the upgrade case obvious — and the savings landed faster than expected.",
  },
  {
    category: "Food",
    date: "Mar 2026",
    metric: "−31%",
    title: "Meat-free weekdays, measured",
    excerpt:
      "A team of 40 ran a logging challenge and watched their collective diet footprint drop, week over week.",
  },
];

export const process = [
  {
    index: "01",
    title: "Onboard",
    description:
      "Answer a few questions about your home, travel and diet to get an instant baseline footprint.",
  },
  {
    index: "02",
    title: "Log",
    description:
      "Quick-add activities or connect utilities, banks and vehicles to keep your numbers current automatically.",
  },
  {
    index: "03",
    title: "Get insights",
    description:
      "Receive personalised, ranked recommendations and watch your dashboard respond as habits change.",
  },
  {
    index: "04",
    title: "Offset & grow",
    description:
      "Neutralise the remainder, earn streaks and badges, and bring friends or your whole team along.",
  },
];

export const standards = [
  { name: "Gold Standard", kind: "Offset registry" },
  { name: "Verra (VCS)", kind: "Offset registry" },
  { name: "GHG Protocol", kind: "Accounting standard" },
  { name: "DEFRA / BEIS", kind: "Emission factors" },
  { name: "US EPA", kind: "Emission factors" },
  { name: "IPCC AR6", kind: "Science basis" },
];

export const methodologySlides = [
  {
    title: "Versioned, region-aware factors",
    body: "Every category uses published emission factors tagged with a source and a date. When factors update we version them — your historical totals never silently change.",
    source: "DEFRA/BEIS 2024, US EPA, IPCC AR6",
  },
  {
    title: "Snapshotted at log time",
    body: "Each activity stores the exact factor used to compute its CO₂e. That makes every number in your history auditable and reproducible.",
    source: "GHG Protocol — Corporate Standard",
  },
  {
    title: "Honest about estimates",
    body: "Spend-based and integration-derived figures are clearly labelled as estimates and are always user-confirmable. We show a confidence indicator, not false precision.",
    source: "Our World in Data methodology",
  },
];

export const pricing = [
  {
    name: "Starter",
    price: "Free",
    description: "Everything you need to measure your personal footprint.",
    features: [
      "1 user",
      "Manual activity logging",
      "Core dashboard & trends",
      "Basic insights",
      "Community challenges",
    ],
    cta: "Start free",
    href: "/sign-up",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    cadence: "/mo",
    description: "Automate tracking and accelerate your reductions.",
    features: [
      "Utility, bank & vehicle integrations",
      "AI insights & recommendations",
      "Unlimited history",
      "PDF & CSV reports",
      "Goals, streaks & badges",
    ],
    cta: "Start Pro trial",
    href: "/sign-up",
    popular: true,
  },
  {
    name: "Teams",
    price: "Custom",
    description: "Measure and reduce across your whole organisation.",
    features: [
      "Org dashboard & member management",
      "Team challenges & leaderboard",
      "SSO & priority support",
      "Public API access",
      "Dedicated onboarding",
    ],
    cta: "Talk to us",
    href: "/contact",
    popular: false,
  },
];

export const testimonials = [
  {
    quote:
      "I finally understand which of my habits actually move the needle. The flight estimate alone changed how I plan trips.",
    author: "Priya N.",
    role: "Product designer",
  },
  {
    quote:
      "We rolled CarbonTrace out to the whole team. The leaderboard turned sustainability into something people talk about.",
    author: "Marcus L.",
    role: "Ops lead, Northwind",
  },
  {
    quote:
      "The methodology page sold me. Versioned factors and snapshots — it's the first tracker I actually trust.",
    author: "Dr. Elena R.",
    role: "Climate researcher",
  },
  {
    quote:
      "Logging takes ten seconds and the weekly report keeps me honest. My footprint is down a third since January.",
    author: "Tomas B.",
    role: "Cyclist & dad of two",
  },
  {
    quote:
      "Offsetting through verified projects, with a certificate for each tonne, made it feel real instead of hand-wavy.",
    author: "Aisha K.",
    role: "Founder, Greenloop",
  },
  {
    quote:
      "The AI recommendations are specific and ranked by impact. No vague 'use less energy' — actual next steps.",
    author: "Jonas W.",
    role: "Software engineer",
  },
];

export const faqs = [
  {
    q: "How accurate are the numbers?",
    a: "We use published, region-aware emission factors from sources like DEFRA/BEIS, the US EPA and the IPCC, and snapshot the exact factor used onto every activity. Spend-based or integration-derived figures are clearly labelled as estimates with a confidence indicator.",
  },
  {
    q: "Do I have to log everything manually?",
    a: "No. The free plan supports fast manual logging, and Pro adds utility, bank and vehicle integrations that keep your footprint current automatically — always with your confirmation.",
  },
  {
    q: "What exactly is CO₂e?",
    a: "CO₂e (carbon dioxide equivalent) expresses the warming impact of all greenhouse gases on a common scale. It lets us compare a flight, a steak and a kilowatt-hour using a single number.",
  },
  {
    q: "Are the carbon offsets legitimate?",
    a: "We only list projects verified under recognised registries such as Gold Standard and Verra. Every purchase generates a downloadable certificate linked to the project's verification record.",
  },
  {
    q: "Is my data private?",
    a: "Your activity data is yours. AI insights run on anonymised category summaries, never raw personal records, and you can export or delete your data at any time.",
  },
  {
    q: "Can my team or company use it?",
    a: "Yes — the Teams plan adds an organisation dashboard, member management, team challenges, SSO and a rate-limited public API.",
  },
  {
    q: "What does a reduction goal look like?",
    a: "Set something like '−20% transport by December'. We auto-fill your baseline, track progress, flag whether you're on or off track, and nudge you with milestones.",
  },
  {
    q: "How much does it cost?",
    a: "Starter is free forever. Pro is $9/month with integrations, AI insights and reports. Teams is custom-priced for organisations.",
  },
];
