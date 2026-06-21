import { z } from "zod";

/** Shared client + server schema for the "Let's Talk" contact form. */
export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(80),
  email: z.string().email("Please enter a valid email."),
  message: z
    .string()
    .min(10, "Tell us a little more (10+ characters).")
    .max(2000, "Message is too long."),
});

export type ContactInput = z.infer<typeof contactSchema>;
