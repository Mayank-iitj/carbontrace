import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { z } from "zod";

const EMISSION_FACTORS: Record<string, Record<string, number>> = {
  transport: {
    "mostly-walk-cycle": 0.0,
    "public-transit": 0.03, // kg CO2e per km
    "ev": 0.05,             // kg CO2e per km
    "petrol-car": 0.17,     // kg CO2e per km
    "flight": 0.25,         // kg CO2e per km
  },
  energy: {
    electricity: 0.23, // kg CO2e per kWh
    heating: 0.18,     // kg CO2e per kWh (gas/oil)
  },
  food: {
    "vegan": 0.7,        // kg CO2e per meal
    "vegetarian": 1.2,   // kg CO2e per meal
    "pescatarian": 1.5,  // kg CO2e per meal
    "omnivore": 2.0,     // kg CO2e per meal
    "heavy-meat": 3.5,   // kg CO2e per meal
  },
  shopping: {
    clothing: 15.0,    // kg CO2e per item
    electronics: 80.0, // kg CO2e per item
    waste: 2.5,        // kg CO2e per bag of household waste
  },
};

const activitySchema = z.object({
  category: z.enum(["transport", "energy", "food", "shopping"]),
  subCategory: z.string(),
  amount: z.number().positive(),
  unit: z.string(),
  notes: z.string().optional(),
});

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return fail("Unauthorized", 401);
  }

  try {
    const profile = await db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!profile) {
      return fail("Profile not found", 404);
    }

    const activities = await db.carbonActivity.findMany({
      where: { userId: profile.id },
      orderBy: { loggedAt: "desc" },
    });

    return ok(activities);
  } catch (error) {
    console.error("GET /api/activities error:", error);
    return fail("Database error", 500);
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return fail("Unauthorized", 401);
  }

  try {
    const profile = await db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!profile) {
      return fail("Profile not found", 404);
    }

    const body = await req.json();
    const parsed = activitySchema.safeParse(body);
    if (!parsed.success) {
      return fail("Invalid activity data", 400, parsed.error.flatten());
    }

    const { category, subCategory, amount, unit, notes } = parsed.data;

    // Calculate CO2e
    const factor = EMISSION_FACTORS[category]?.[subCategory] ?? 0;
    const co2eKg = amount * factor;

    const activity = await db.carbonActivity.create({
      data: {
        userId: profile.id,
        category,
        subCategory,
        amount,
        unit,
        co2eKg,
        notes,
      },
    });

    return ok(activity);
  } catch (error) {
    console.error("POST /api/activities error:", error);
    return fail("Database error", 500);
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return fail("Unauthorized", 401);
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return fail("Missing activity ID", 400);
    }

    const profile = await db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!profile) {
      return fail("Profile not found", 404);
    }

    const activity = await db.carbonActivity.findFirst({
      where: { id, userId: profile.id },
    });

    if (!activity) {
      return fail("Activity not found or unauthorized", 404);
    }

    await db.carbonActivity.delete({
      where: { id },
    });

    return ok({ success: true });
  } catch (error) {
    console.error("DELETE /api/activities error:", error);
    return fail("Database error", 500);
  }
}
