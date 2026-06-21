import { groqChat, aiEnabled } from "@/lib/ai/groq";
import {
  insightsResultSchema,
  type InsightsInput,
  type InsightsResult,
} from "@/lib/validations/insights";

const SYSTEM_PROMPT = `You are CarbonTrace's climate insights engine. Given a person's lifestyle profile, estimate their annual carbon footprint and return prioritised, genuinely actionable recommendations.

Rules:
- Base estimates on credible public emission factors (DEFRA/BEIS, US EPA, IPCC, Our World in Data).
- Rank recommendations by impact (largest CO2e saving first).
- Every recommendation must be specific and realistic for this profile.
- estimatedSavingKgPerYear must be a plausible number in kg CO2e per year.
- Respond with STRICT JSON only, matching exactly this shape:
{
  "estimatedAnnualFootprintTonnes": number,
  "summary": string,
  "recommendations": [
    { "title": string, "category": string, "detail": string, "estimatedSavingKgPerYear": number, "effort": "low" | "medium" | "high" }
  ]
}
Return 3 to 5 recommendations. Do not include any prose outside the JSON.`;

function buildUserPrompt(input: InsightsInput): string {
  return [
    `Region: ${input.region}`,
    `Household size: ${input.householdSize}`,
    `Diet: ${input.diet}`,
    `Primary transport: ${input.transport}`,
    input.notes ? `Extra context: ${input.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Deterministic fallback so the demo works without a GROQ_API_KEY. */
function stubInsights(input: InsightsInput): InsightsResult {
  const dietSaving =
    input.diet === "heavy-meat" || input.diet === "omnivore" ? 720 : 240;
  const transportSaving =
    input.transport === "petrol-car"
      ? 1400
      : input.transport === "frequent-flyer"
        ? 2200
        : 350;

  const base =
    (input.transport === "frequent-flyer" ? 9 : 6.2) +
    (input.diet === "heavy-meat" ? 1.6 : input.diet === "vegan" ? -0.8 : 0);

  return {
    estimatedAnnualFootprintTonnes: Math.max(
      1.8,
      Number((base / Math.sqrt(input.householdSize)).toFixed(1)),
    ),
    summary: `Based on a ${input.diet} diet and ${input.transport.replace(/-/g, " ")} in ${input.region}, your biggest levers are transport and diet. (Sample insights — add a GROQ_API_KEY for live, personalised AI analysis.)`,
    recommendations: [
      {
        title:
          input.transport === "frequent-flyer"
            ? "Swap one long-haul flight for rail or virtual"
            : "Shift short car trips to bike or transit",
        category: "Transport",
        detail:
          "Transport is typically the single largest personal source. Replacing your highest-emission trips compounds quickly across a year.",
        estimatedSavingKgPerYear: transportSaving,
        effort: "medium",
      },
      {
        title:
          input.diet === "vegan"
            ? "Cut food waste with weekly meal planning"
            : "Add two plant-based days each week",
        category: "Food",
        detail:
          "Diet shifts are low-cost and immediate. Even partial reductions in red meat and dairy move your footprint meaningfully.",
        estimatedSavingKgPerYear: dietSaving,
        effort: "low",
      },
      {
        title: "Tighten home energy use",
        category: "Home Energy",
        detail:
          "A smart thermostat, LED lighting and a 1°C heating setback trim baseline energy with no lifestyle change. Switching to a renewable tariff goes further.",
        estimatedSavingKgPerYear: 480,
        effort: "low",
      },
    ],
  };
}

/**
 * Generate footprint insights. Uses Groq when configured; otherwise returns a
 * deterministic sample so the experience always works.
 */
export async function generateInsights(
  input: InsightsInput,
): Promise<{ result: InsightsResult; live: boolean }> {
  if (!aiEnabled) {
    return { result: stubInsights(input), live: false };
  }

  const raw = await groqChat({
    json: true,
    temperature: 0.4,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(input) },
    ],
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Groq returned malformed JSON.");
  }

  const result = insightsResultSchema.parse(parsed);
  return { result, live: true };
}
