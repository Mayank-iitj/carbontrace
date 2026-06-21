import { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";
import { ok, fail, zodFail } from "@/lib/api";

export const runtime = "nodejs";

/**
 * POST /api/contact — "Let's Talk" form handler.
 * Validates with Zod and notifies the team via the email adapter.
 *
 * NOTE: persistence to a ContactMessage table is deferred to Milestone 2
 * (Prisma). Until then the message is delivered (or logged) via the adapter.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body.", 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return zodFail(parsed.error);
  }

  const { name, email, message } = parsed.data;

  try {
    await sendEmail({
      to: siteConfig.email,
      subject: `New contact message from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  } catch (err) {
    console.error("[contact] email send failed", err);
    return fail("We couldn't send your message. Please try again shortly.", 502);
  }

  return ok({ received: true });
}
