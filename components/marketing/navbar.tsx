"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Leaf } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { navLinks, siteConfig } from "@/lib/site";
import { GlowButton } from "@/components/marketing/glow-button";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-[var(--color-accent)] text-[var(--color-accent-foreground)]">
            <Leaf className="h-4 w-4" />
          </span>
          {siteConfig.name}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Start free</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <GlowButton href="/app" size="sm" withArrow={false}>
              Dashboard
            </GlowButton>
            <UserButton />
          </Show>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-pill border border-[var(--color-border)] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-left text-base text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">Start free</Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <GlowButton href="/app" withArrow={false} className="w-full">
                  Dashboard
                </GlowButton>
                <div className="flex items-center gap-3">
                  <UserButton />
                  <span className="text-sm text-[var(--color-text-muted)]">Account</span>
                </div>
              </Show>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
