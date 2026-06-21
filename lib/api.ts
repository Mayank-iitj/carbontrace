import { NextResponse } from "next/server";
import { ZodError } from "zod";

/** Consistent JSON envelope: { data, error }. */
export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data, error: null }, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { data: null, error: { message, details: details ?? null } },
    { status },
  );
}

/** Format a ZodError into a flat field→message map for friendly UI. */
export function zodFail(error: ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    fieldErrors[key] ??= issue.message;
  }
  return fail("Validation failed.", 422, fieldErrors);
}
