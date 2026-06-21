"use client";

import Link from "next/link";
import { ArrowUp, Leaf } from "lucide-react";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Methodology", href: "/methodology" },
      { label: "Dashboard", href: "/app" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/about#careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Location / brand column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-[var(--color-accent)] text-[var(--color-accent-foreground)]">
                <Leaf className="h-4 w-4" />
              </span>
              {siteConfig.name}
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--color-text-muted)]">
              {siteConfig.tagline} — turning everyday choices into measurable climate action.
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">{siteConfig.location}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm text-[var(--color-accent)] hover:underline"
            >
              {siteConfig.email}
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                {col.title}
              </span>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-border)] pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            Back to top
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
