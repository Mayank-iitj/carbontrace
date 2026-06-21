"use client";

import { useState } from "react";
import { Loader2, Sparkles, TrendingDown } from "lucide-react";
import {
  dietOptions,
  transportOptions,
  type InsightsInput,
  type InsightsResult,
} from "@/lib/validations/insights";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Result = InsightsResult & { live: boolean };

const selectClass =
  "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] transition-colors focus:border-[var(--color-accent)] focus:outline-none";

const labelize = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const effortTone: Record<string, string> = {
  low: "text-[var(--color-accent)]",
  medium: "text-yellow-300",
  high: "text-orange-300",
};

export function AiInsightsDemo() {
  const [form, setForm] = useState<InsightsInput>({
    region: "United Kingdom",
    householdSize: 2,
    diet: "omnivore",
    transport: "petrol-car",
  });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof InsightsInput>(key: K, value: InsightsInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as {
        data: Result | null;
        error: { message?: string } | null;
      };
      if (!res.ok || !json.data) {
        throw new Error(json.error?.message ?? "Something went wrong.");
      }
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      {/* Input form */}
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-5 rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="region" className="text-sm text-[var(--color-text-muted)]">
              Region
            </label>
            <input
              id="region"
              className={selectClass}
              value={form.region}
              onChange={(e) => update("region", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="household" className="text-sm text-[var(--color-text-muted)]">
              Household size
            </label>
            <input
              id="household"
              type="number"
              min={1}
              max={12}
              className={selectClass}
              value={form.householdSize}
              onChange={(e) => update("householdSize", Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="diet" className="text-sm text-[var(--color-text-muted)]">
              Diet
            </label>
            <select
              id="diet"
              className={selectClass}
              value={form.diet}
              onChange={(e) => update("diet", e.target.value as InsightsInput["diet"])}
            >
              {dietOptions.map((d) => (
                <option key={d} value={d} className="bg-[var(--color-surface)]">
                  {labelize(d)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="transport" className="text-sm text-[var(--color-text-muted)]">
              Primary transport
            </label>
            <select
              id="transport"
              className={selectClass}
              value={form.transport}
              onChange={(e) =>
                update("transport", e.target.value as InsightsInput["transport"])
              }
            >
              {transportOptions.map((t) => (
                <option key={t} value={t} className="bg-[var(--color-surface)]">
                  {labelize(t)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="notes" className="text-sm text-[var(--color-text-muted)]">
            Anything else? <span className="opacity-60">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={2}
            className={cn(selectClass, "resize-none")}
            placeholder="e.g. I work from home, heat with gas, fly twice a year…"
            value={form.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Analyzing…" : "Generate AI insights"}
        </Button>
      </form>

      {/* Result panel */}
      <div className="flex flex-col gap-5">
        {!result && !loading && (
          <div className="flex h-full min-h-[18rem] flex-col items-center justify-center gap-3 rounded-card border border-dashed border-[var(--color-border)] p-8 text-center">
            <Sparkles className="h-8 w-8 text-[var(--color-accent)]" />
            <p className="max-w-xs text-[var(--color-text-muted)]">
              Fill in your profile and Groq will estimate your footprint and rank your
              highest-impact actions.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex h-full min-h-[18rem] flex-col items-center justify-center gap-3 rounded-card border border-[var(--color-border)] p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
            <p className="text-[var(--color-text-muted)]">Crunching emission factors…</p>
          </div>
        )}

        {result && !loading && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 rounded-card border border-[var(--color-accent)] bg-[var(--color-surface)] p-6 glow-accent">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Estimated annual footprint
                </span>
                <span className="display text-4xl">
                  {result.estimatedAnnualFootprintTonnes} t
                  <span className="ml-1 text-lg text-[var(--color-text-muted)]">CO₂e</span>
                </span>
              </div>
              <Badge variant={result.live ? "accent" : "outline"}>
                {result.live ? "Live · Groq" : "Sample"}
              </Badge>
            </div>

            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              {result.summary}
            </p>

            <ul className="flex flex-col gap-3">
              {result.recommendations.map((rec) => (
                <li
                  key={rec.title}
                  className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-display text-lg font-medium">{rec.title}</h4>
                    <span className="flex shrink-0 items-center gap-1 font-mono text-sm text-[var(--color-accent)]">
                      <TrendingDown className="h-4 w-4" />−
                      {rec.estimatedSavingKgPerYear.toLocaleString()} kg/yr
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {rec.detail}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge variant="outline">{rec.category}</Badge>
                    <span className={cn("uppercase tracking-wide", effortTone[rec.effort])}>
                      {rec.effort} effort
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
