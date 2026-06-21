import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Leaf } from "lucide-react";
import { Eyebrow } from "@/components/marketing/primitives";
import { GlowButton } from "@/components/marketing/glow-button";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AppDashboardPage() {
  // This route is protected by Clerk middleware — reaching it means signed in.
  const user = await currentUser();
  const name = user?.firstName ?? user?.username ?? "there";

  return (
    <main className="flex min-h-screen flex-col bg-dot-grid">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-[var(--color-accent)] text-[var(--color-accent-foreground)]">
            <Leaf className="h-4 w-4" />
          </span>
          CarbonTrace
        </Link>
        <UserButton />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Eyebrow>You&apos;re signed in</Eyebrow>
        <h1 className="display mt-6 max-w-2xl text-4xl sm:text-5xl">
          Welcome, <span className="text-[var(--color-accent)]">{name}</span>.
        </h1>
        <p className="mt-5 max-w-md text-[var(--color-text-muted)]">
          Your authenticated dashboard lives here. The footprint overview, trends, goals and the
          emissions engine arrive in Milestone 3 — the auth, design system and adapters are already
          in place.
        </p>
        <div className="mt-10">
          <GlowButton href="/">Back to home</GlowButton>
        </div>
      </div>
    </main>
  );
}
