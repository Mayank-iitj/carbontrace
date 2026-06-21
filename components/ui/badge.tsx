import * as React from "react";
import { cn } from "@/lib/utils";

/** Small pill label — used for tags, "Popular", standards, etc. */
export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "accent" | "outline";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium tracking-wide",
        variant === "default" && "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]",
        variant === "accent" &&
          "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]",
        variant === "outline" &&
          "border border-[var(--color-border)] text-[var(--color-text-muted)]",
        className,
      )}
      {...props}
    />
  );
}
