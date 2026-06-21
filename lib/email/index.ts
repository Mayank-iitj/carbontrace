import { Resend } from "resend";

/**
 * Email adapter with graceful degradation.
 *
 * When RESEND_API_KEY is present we send via Resend; otherwise we log the
 * message server-side and report success so local dev works with zero keys.
 * This is the canonical pattern every external-service adapter follows
 * (see lib/adapters/README.md) — real client when configured, safe no-op stub
 * otherwise — so later milestones (Stripe, AI, Blob, KV) plug in identically.
 */

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "CarbonTrace <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

export const emailEnabled = Boolean(resend);

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: SendEmailInput): Promise<{ id: string | null; stubbed: boolean }> {
  if (!resend) {
    // Graceful stub: no key configured. Log so the flow is observable in dev.
    console.info(
      `[email:stub] would send → to=${to} subject="${subject}"\n${text}`,
    );
    return { id: null, stubbed: true };
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }

  return { id: data?.id ?? null, stubbed: false };
}
