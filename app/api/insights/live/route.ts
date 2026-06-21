import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { groqChat, aiEnabled } from "@/lib/ai/groq";
import { insightsResultSchema, type InsightsResult } from "@/lib/validations/insights";

const SYSTEM_PROMPT = `You are CarbonTrace's live climate advisor. Analyze the user's actual logged carbon activities and profile to provide personalized, high-impact suggestions for reducing their carbon footprint.
Rules:
- Make recommendations highly relevant to their logged behaviors.
- Rank recommendations by impact (largest CO2e saving first).
- Every recommendation must be specific and realistic.
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

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return fail("Unauthorized", 401);
  }

  try {
    const profile = await db.userProfile.findUnique({
      where: { clerkId: userId },
      include: { activities: true },
    });

    if (!profile) {
      return fail("Profile not found", 404);
    }

    // Compute basic statistics
    const totalEmissionsKg = profile.activities.reduce((sum: number, act: { co2eKg: number }) => sum + act.co2eKg, 0);
    const categoryTotals: Record<string, number> = {};
    for (const act of profile.activities) {
      categoryTotals[act.category] = (categoryTotals[act.category] || 0) + act.co2eKg;
    }

    // Find highest category
    let highestCategory = "none";
    let highestAmount = 0;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    }

    if (!aiEnabled) {
      // Stub live insights with rules based on logged activities
      const result: InsightsResult = {
        estimatedAnnualFootprintTonnes: Number((6.2 + totalEmissionsKg / 1000).toFixed(1)),
        summary: `You have logged ${profile.activities.length} activities totaling ${(totalEmissionsKg).toFixed(1)} kg CO2e. ${
          highestCategory !== "none"
            ? `Your highest emissions are in the ${highestCategory} category.`
            : "Log more daily activities to get detailed breakdowns."
        } (Sample live insights — add a GROQ_API_KEY for live AI analysis.)`,
        recommendations: [
          {
            title: highestCategory === "transport" ? "Transition to low-carbon commutes" : "Optimize home energy usage",
            category: highestCategory === "transport" ? "Transport" : "Energy",
            detail: highestCategory === "transport" 
              ? "Since transport is your highest source of logged emissions, switching to public transit or carpooling twice a week can make a major impact."
              : "Set thermostat 1°C cooler in winter, or switch to energy-efficient appliances to trim electricity draw.",
            estimatedSavingKgPerYear: highestCategory === "transport" ? 450 : 250,
            effort: "low",
          },
          {
            title: "Swap to a green energy tariff",
            category: "Energy",
            detail: "Switching your home energy provider to a certified 100% renewable electricity tariff instantly drops your grid emissions to near zero.",
            estimatedSavingKgPerYear: 500,
            effort: "medium",
          },
          {
            title: "Plan plant-based meal days",
            category: "Food",
            detail: "Swap out beef or lamb for lentils, tofu, or other legumes for just two days per week. It is one of the fastest ways to lower your carbon trail.",
            estimatedSavingKgPerYear: 320,
            effort: "low",
          },
        ],
      };
      return ok({ ...result, live: false });
    }

    // AI is enabled, build prompt with actual logged activities summary
    const activitiesSummary = profile.activities.slice(0, 15).map(act => (
      `- Category: ${act.category}, Subcategory: ${act.subCategory}, Amount: ${act.amount} ${act.unit}, CO2e: ${act.co2eKg.toFixed(1)} kg`
    )).join("\n");

    const prompt = [
      `User Profile:`,
      `- Region: ${profile.region}`,
      `- Household size: ${profile.householdSize}`,
      `- Baseline diet: ${profile.diet}`,
      `- Primary transport: ${profile.transport}`,
      `Total Logged Emissions: ${totalEmissionsKg.toFixed(1)} kg CO2e`,
      activitiesSummary ? `Recent Logs:\n${activitiesSummary}` : "No activities logged yet.",
    ].join("\n");

    const raw = await groqChat({
      json: true,
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Groq returned malformed JSON.");
    }

    const result = insightsResultSchema.parse(parsed);
    return ok({ ...result, live: true });
  } catch (error) {
    console.error("GET /api/insights/live error:", error);
    return fail("Couldn't generate live insights right now.", 502);
  }
}
