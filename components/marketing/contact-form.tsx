"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[var(--color-accent)] focus:outline-none";

export function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(json?.error?.message ?? "Something went wrong.");
      }
      setDone(true);
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-card border border-[var(--color-accent)] bg-[var(--color-surface)] p-8 glow-accent">
        <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-[var(--color-accent)] text-[var(--color-accent-foreground)]">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="font-display text-2xl font-medium">Message sent</h3>
        <p className="text-[var(--color-text-muted)]">
          Thanks for reaching out — we&apos;ll get back to you within one business day.
        </p>
        <Button variant="outline" onClick={() => setDone(false)}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm text-[var(--color-text-muted)]">
          Name
        </label>
        <input
          id="name"
          className={fieldClass}
          placeholder="Ada Lovelace"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-[var(--color-text-muted)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={fieldClass}
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm text-[var(--color-text-muted)]">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className={cn(fieldClass, "resize-none")}
          placeholder="Tell us what you're trying to measure…"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && <p className="text-sm text-red-400">{errors.message.message}</p>}
      </div>

      {serverError && <p className="text-sm text-red-400">{serverError}</p>}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
