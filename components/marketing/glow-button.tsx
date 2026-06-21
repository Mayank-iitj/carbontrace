import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Accent CTA with a wipe-in glow + trailing arrow (reference CTA feel).
 * Renders as a Next <Link> when `href` is provided, else a button.
 */
export function GlowButton({
  href,
  children,
  withArrow = true,
  className,
  ...props
}: ButtonProps & { href?: string; withArrow?: boolean }) {
  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <Button asChild className={cn("group", className)} {...props}>
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button className={cn("group", className)} {...props}>
      {content}
    </Button>
  );
}
