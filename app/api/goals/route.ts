import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { z } from "zod";

const goalSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  category: z.string(),
  targetSaving: z.number().positive(),
  status: z.enum(["active", "achieved", "abandoned"]).default("active"),
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

    const goals = await db.goal.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    return ok(goals);
  } catch (error) {
    console.error("GET /api/goals error:", error);
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
    const parsed = goalSchema.safeParse(body);
    if (!parsed.success) {
      return fail("Invalid goal data", 400, parsed.error.flatten());
    }

    const { id, title, category, targetSaving, status } = parsed.data;

    let goal;
    if (id) {
      goal = await db.goal.update({
        where: { id, userId: profile.id },
        data: { title, category, targetSaving, status },
      });
    } else {
      goal = await db.goal.create({
        data: {
          userId: profile.id,
          title,
          category,
          targetSaving,
          status,
        },
      });
    }

    return ok(goal);
  } catch (error) {
    console.error("POST /api/goals error:", error);
    return fail("Database error", 500);
  }
}
