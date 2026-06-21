"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ArrowRight, ArrowLeft, Loader2, Globe, Users, Utensils, Car, Target } from "lucide-react";
import { Eyebrow } from "@/components/marketing/primitives";
import { dietOptions, transportOptions } from "@/lib/validations/insights";

const STEPS = [
  { id: "region", title: "Where do you live?", icon: Globe },
  { id: "household", title: "Household Size", icon: Users },
  { id: "diet", title: "Dietary Choices", icon: Utensils },
  { id: "transport", title: "Primary Transport", icon: Car },
  { id: "goal", title: "Set Your Target", icon: Target },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [region, setRegion] = useState("United Kingdom");
  const [householdSize, setHouseholdSize] = useState(1);
  const [diet, setDiet] = useState<string>("omnivore");
  const [transport, setTransport] = useState<string>("petrol-car");
  const [targetReduction, setTargetReduction] = useState(20);

  useEffect(() => {
    // Check if profile onboarding is already done
    fetch("/api/profile")
      .then((res) => res.json())
      .then((res) => {
        if (res.data?.onboardingComplete) {
          router.replace("/app");
        } else {
          // Pre-populate if profile exists
          if (res.data) {
            if (res.data.region) setRegion(res.data.region);
            if (res.data.householdSize) setHouseholdSize(res.data.householdSize);
            if (res.data.diet) setDiet(res.data.diet);
            if (res.data.transport) setTransport(res.data.transport);
            if (res.data.targetReduction) setTargetReduction(res.data.targetReduction);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          householdSize,
          diet,
          transport,
          targetReduction,
        }),
      });
      if (res.ok) {
        router.push("/app");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0b0a] text-[#f4f5f2]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  const StepIcon = STEPS[currentStep]!.icon;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0b0a] bg-dot-grid px-6 py-12 text-[#f4f5f2]">
      {/* Background radial gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-30" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[var(--color-border)] bg-[#121413]/85 p-8 backdrop-blur-md shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-[#0a0b0a] mb-6 shadow-[0_0_20px_rgba(168,255,83,0.3)]">
            <Leaf className="h-6 w-6" />
          </div>
          <Eyebrow className="mb-2">CarbonTrace Onboarding</Eyebrow>
          <div className="text-xs text-[var(--color-text-muted)] font-mono mb-4">
            Step {currentStep + 1} of {STEPS.length}
          </div>
          
          {/* Progress Bar */}
          <div className="h-1 w-full bg-[var(--color-border)] rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-[var(--color-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Card Content */}
        <div className="min-h-[220px]">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2 rounded-lg bg-[var(--color-border)] text-[var(--color-accent)]">
              <StepIcon className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-semibold tracking-tight">{STEPS[currentStep]!.title}</h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--color-text-muted)] mb-3">
                    Emissions standards vary by region due to local electricity grids and transport structures.
                  </p>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-[#0a0b0a] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-all font-mono"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Germany">Germany</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--color-text-muted)] mb-3">
                    Sharing housing splits baseline footprints like heating and lighting.
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => setHouseholdSize(num)}
                        className={`py-3 rounded-xl border text-sm font-mono transition-all ${
                          householdSize === num
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                            : "border-[var(--color-border)] hover:border-gray-500 text-[var(--color-text-muted)]"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  {dietOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDiet(opt)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                        diet === opt
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                          : "border-[var(--color-border)] hover:border-gray-500 text-[var(--color-text-muted)]"
                      }`}
                    >
                      <span className="capitalize text-sm font-medium">{opt.replace("-", " ")}</span>
                      <span className="text-xs font-mono text-[var(--color-text-muted)]">
                        {opt === "vegan" && "🌱 Low Impact"}
                        {opt === "vegetarian" && "🥗 Med-Low"}
                        {opt === "heavy-meat" && "🥩 High Impact"}
                        {opt === "omnivore" && "🍖 Average"}
                        {opt === "pescatarian" && "🐟 Med"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-3">
                  {transportOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setTransport(opt)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                        transport === opt
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                          : "border-[var(--color-border)] hover:border-gray-500 text-[var(--color-text-muted)]"
                      }`}
                    >
                      <span className="capitalize text-sm font-medium">{opt.replace(/-/g, " ")}</span>
                      <span className="text-xs font-mono text-[var(--color-text-muted)]">
                        {opt === "mostly-walk-cycle" && "🚲 Zero Direct"}
                        {opt === "public-transit" && "🚌 Eco"}
                        {opt === "ev" && "⚡ Low"}
                        {opt === "petrol-car" && "🚗 High"}
                        {opt === "frequent-flyer" && "✈️ Very High"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    What target carbon reduction do you want to hit? We will track this goal on your dashboard.
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 20, 30, 50].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setTargetReduction(pct)}
                        className={`py-3 rounded-xl border text-sm font-mono transition-all ${
                          targetReduction === pct
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                            : "border-[var(--color-border)] hover:border-gray-500 text-[var(--color-text-muted)]"
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-[#0a0b0a] border border-[var(--color-border)] text-xs text-center text-[var(--color-text-muted)]">
                    A {targetReduction}% reduction target equates to saving roughly{" "}
                    <span className="text-[var(--color-accent)] font-semibold font-mono">
                      {(targetReduction * 0.08 * 1000).toFixed(0)} kg CO2e
                    </span>{" "}
                    annually per person.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <div className="mt-8 flex justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium transition-all ${
              currentStep === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[var(--color-border)]"
            }`}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-accent)] text-[#0a0b0a] text-sm font-semibold hover:brightness-110 shadow-lg shadow-[rgba(168,255,83,0.25)] transition-all"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : currentStep === STEPS.length - 1 ? (
              "Complete"
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
