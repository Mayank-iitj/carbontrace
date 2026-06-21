import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { z } from "zod";

const profileSchema = z.object({
  region: z.string().min(2).max(60).default("United Kingdom"),
  householdSize: z.number().int().min(1).max(12).default(1),
  diet: z.string().default("omnivore"),
  transport: z.string().default("petrol-car"),
  targetReduction: z.number().int().min(5).max(100).default(20),
});

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return fail("Unauthorized", 401);
  }

  try {
    let profile = await db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!profile) {
      // Sync user from Clerk initially if not found in db
      const user = await currentUser();
      const email = user?.emailAddresses[0]?.emailAddress ?? "unknown@clerk.user";
      const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.username || null;

      profile = await db.userProfile.create({
        data: {
          clerkId: userId,
          email,
          name,
          onboardingComplete: false,
        },
      });
    }

    return ok(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return fail("Database error", 500);
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return fail("Unauthorized", 401);
  }

  try {
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return fail("Invalid profile data", 400, parsed.error.flatten());
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress ?? "unknown@clerk.user";
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.username || null;

    const profile = await db.userProfile.upsert({
      where: { clerkId: userId },
      update: {
        ...parsed.data,
        onboardingComplete: true,
      },
      create: {
        clerkId: userId,
        email,
        name,
        ...parsed.data,
        onboardingComplete: true,
      },
    });

    return ok(profile);
  } catch (error) {
    console.error("POST /api/profile error:", error);
    return fail("Database error", 500);
  }
}
