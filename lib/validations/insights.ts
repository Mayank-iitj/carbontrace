import { z } from "zod";

export const dietOptions = [
  "vegan",
  "vegetarian",
  "pescatarian",
  "omnivore",
  "heavy-meat",
] as const;

export const transportOptions = [
  "mostly-walk-cycle",
  "public-transit",
  "petrol-car",
  "ev",
  "frequent-flyer",
] as const;

/** Input for the AI footprint insights demo. */
export const insightsInputSchema = z.object({
  region: z.string().min(2).max(60).default("United Kingdom"),
  householdSize: z.coerce.number().int().min(1).max(12).default(1),
  diet: z.enum(dietOptions).default("omnivore"),
  transport: z.enum(transportOptions).default("petrol-car"),
  notes: z.string().max(500).optional(),
});

export type InsightsInput = z.infer<typeof insightsInputSchema>;

/** A single ranked, actionable recommendation. */
export const recommendationSchema = z.object({
  title: z.string(),
  category: z.string(),
  detail: z.string(),
  estimatedSavingKgPerYear: z.number(),
  effort: z.enum(["low", "medium", "high"]),
});

export const insightsResultSchema = z.object({
  estimatedAnnualFootprintTonnes: z.number(),
  summary: z.string(),
  recommendations: z.array(recommendationSchema).min(1),
});

export type Recommendation = z.infer<typeof recommendationSchema>;
export type InsightsResult = z.infer<typeof insightsResultSchema>;
