import { NextRequest } from "next/server";
import { insightsInputSchema } from "@/lib/validations/insights";
import { generateInsights } from "@/lib/ai/insights";
import { ok, fail, zodFail } from "@/lib/api";

export const runtime = "nodejs";
// Allow time for the model call on serverless.
export const maxDuration = 30;

/**
 * POST /api/insights — generate AI footprint insights via Groq.
 *
 * Real Groq call when GROQ_API_KEY is set; deterministic sample otherwise.
 * The key stays server-side, so this works with no separate backend.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body.", 400);
  }

  const parsed = insightsInputSchema.safeParse(body);
  if (!parsed.success) {
    return zodFail(parsed.error);
  }

  try {
    const { result, live } = await generateInsights(parsed.data);
    return ok({ ...result, live });
  } catch (err) {
    console.error("[insights] generation failed", err);
    return fail("Couldn't generate insights right now. Please try again.", 502);
  }
}
