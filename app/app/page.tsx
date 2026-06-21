"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Plus,
  Trash2,
  TrendingDown,
  Target,
  Sparkles,
  Calendar,
  Car,
  Lightbulb,
  ShoppingBag,
  Utensils,
  Award,
  Loader2,
  RefreshCw,
  PlusCircle,
} from "lucide-react";
import { Eyebrow } from "@/components/marketing/primitives";

interface Activity {
  id: string;
  category: string;
  subCategory: string;
  amount: number;
  unit: string;
  co2eKg: number;
  loggedAt: string;
  notes?: string;
}

interface Goal {
  id: string;
  title: string;
  category: string;
  targetSaving: number;
  currentSaving: number;
  status: string;
  createdAt: string;
}

interface Profile {
  id: string;
  clerkId: string;
  name?: string;
  region: string;
  householdSize: number;
  diet: string;
  transport: string;
  targetReduction: number;
  onboardingComplete: boolean;
}

interface AIInsight {
  estimatedAnnualFootprintTonnes: number;
  summary: string;
  recommendations: Array<{
    title: string;
    category: string;
    detail: string;
    estimatedSavingKgPerYear: number;
    effort: "low" | "medium" | "high";
  }>;
  live: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "log" | "goals" | "ai">("overview");

  // Loading States
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);

  // Logging Form State
  const [logCategory, setLogCategory] = useState<"transport" | "energy" | "food" | "shopping">("transport");
  const [logSubCategory, setLogSubCategory] = useState("petrol-car");
  const [logAmount, setLogAmount] = useState<number | "">("");
  const [logNotes, setLogNotes] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  // Goal Form State
  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("Transport");
  const [goalTarget, setGoalTarget] = useState<number | "">("");
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);

  useEffect(() => {
    // 1. Fetch Profile
    fetch("/api/profile")
      .then((res) => res.json())
      .then((res) => {
        if (!res.data?.onboardingComplete) {
          router.replace("/app/onboarding");
        } else {
          setProfile(res.data);
          // 2. Fetch Activities & Goals
          Promise.all([fetch("/api/activities"), fetch("/api/goals")])
            .then(async ([actRes, goalRes]) => {
              const acts = await actRes.json();
              const gls = await goalRes.json();
              setActivities(acts.data || []);
              setGoals(gls.data || []);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  // Fetch AI Insights
  const fetchAIInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const res = await fetch("/api/insights/live");
      const data = await res.json();
      if (data.data) {
        setAiInsight(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "ai" && !aiInsight) {
      fetchAIInsights();
    }
  }, [activeTab, aiInsight, fetchAIInsights]);

  // Handle Log Activity Submit
  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logAmount || Number(logAmount) <= 0) return;
    setIsLogging(true);

    let unit = "km";
    if (logCategory === "energy") unit = "kWh";
    if (logCategory === "food") unit = "meals";
    if (logCategory === "shopping") {
      unit = logSubCategory === "waste" ? "bags" : "items";
    }

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: logCategory,
          subCategory: logSubCategory,
          amount: Number(logAmount),
          unit,
          notes: logNotes,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setActivities((prev) => [data.data, ...prev]);
        setLogAmount("");
        setLogNotes("");
        setActiveTab("overview");
        // Clear cached insights so they re-fetch on new logs
        setAiInsight(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLogging(false);
    }
  };

  // Handle Delete Activity
  const handleDeleteActivity = async (id: string) => {
    try {
      const res = await fetch(`/api/activities?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setActivities((prev) => prev.filter((a) => a.id !== id));
        setAiInsight(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Create Goal
  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;
    setIsCreatingGoal(true);

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: goalTitle,
          category: goalCategory,
          targetSaving: Number(goalTarget),
        }),
      });
      const data = await res.json();
      if (data.data) {
        setGoals((prev) => [data.data, ...prev]);
        setGoalTitle("");
        setGoalTarget("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingGoal(false);
    }
  };

  // Handle Update Goal Status
  const handleToggleGoalStatus = async (goal: Goal) => {
    const nextStatus = goal.status === "active" ? "achieved" : "active";
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: goal.id,
          title: goal.title,
          category: goal.category,
          targetSaving: goal.targetSaving,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setGoals((prev) => prev.map((g) => (g.id === goal.id ? data.data : g)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Subcategory defaults when logCategory changes
  useEffect(() => {
    if (logCategory === "transport") setLogSubCategory("petrol-car");
    if (logCategory === "energy") setLogSubCategory("electricity");
    if (logCategory === "food") setLogSubCategory("omnivore");
    if (logCategory === "shopping") setLogSubCategory("clothing");
  }, [logCategory]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0b0a] text-[#f4f5f2]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  // Statistics Calculations
  const currentMonthEmissions = activities.reduce((sum: number, a) => sum + a.co2eKg, 0);
  const baselineMonthlyLimit = 650; // Average baseline monthly target in kg
  const monthlyProgressPct = Math.min(100, (currentMonthEmissions / baselineMonthlyLimit) * 100);

  const categoryEmissions = {
    transport: activities.filter((a) => a.category === "transport").reduce((sum: number, a) => sum + a.co2eKg, 0),
    energy: activities.filter((a) => a.category === "energy").reduce((sum: number, a) => sum + a.co2eKg, 0),
    food: activities.filter((a) => a.category === "food").reduce((sum: number, a) => sum + a.co2eKg, 0),
    shopping: activities.filter((a) => a.category === "shopping").reduce((sum: number, a) => sum + a.co2eKg, 0),
  };

  return (
    <div className="min-h-screen bg-[#0a0b0a] text-[#f4f5f2] font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] px-6 py-4 lg:px-8 bg-[#121413]/40 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-[#0a0b0a]">
              <Leaf className="h-4 w-4" />
            </span>
            CarbonTrace
          </div>

          {/* Navigation Controls */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121413] border border-[var(--color-border)] p-1 rounded-xl">
            {(["overview", "log", "goals", "ai"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-[var(--color-accent)] text-[#0a0b0a]"
                    : "text-[var(--color-text-muted)] hover:text-white"
                }`}
              >
                {tab === "ai" ? "AI Coach" : tab === "log" ? "Log Activity" : tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--color-text-muted)] font-mono hidden sm:inline">
              Baseline: {profile?.region}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Mobile navigation bar */}
      <div className="md:hidden flex justify-around border-b border-[var(--color-border)] bg-[#121413]/60 px-4 py-2">
        {(["overview", "log", "goals", "ai"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? "bg-[var(--color-accent)] text-[#0a0b0a]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            {tab === "ai" ? "AI" : tab === "log" ? "Log" : tab}
          </button>
        ))}
      </div>

      {/* Dashboard Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Monthly Footprint Card */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[#121413] p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Calendar className="h-20 w-20 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                    This Month Emissions
                  </h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      {currentMonthEmissions.toFixed(0)}
                    </span>
                    <span className="text-sm font-mono text-[var(--color-text-muted)]">kg CO2e</span>
                  </div>

                  {/* Progress towards target baseline */}
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs font-mono text-[var(--color-text-muted)]">
                      <span>Monthly Limit Target</span>
                      <span>{monthlyProgressPct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#0a0b0a] rounded-full overflow-hidden border border-[var(--color-border)]">
                      <div
                        className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
                        style={{ width: `${monthlyProgressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Target Reduction Card */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[#121413] p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Target className="h-20 w-20 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                    Target Reduction Goal
                  </h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight text-[var(--color-accent)]">
                      {profile?.targetReduction}%
                    </span>
                    <span className="text-sm text-[var(--color-text-muted)]">savings</span>
                  </div>
                  <p className="mt-6 text-xs text-[var(--color-text-muted)] font-mono leading-relaxed">
                    Personal target of <span className="text-white">{(baselineMonthlyLimit * (profile?.targetReduction || 20) / 100).toFixed(0)} kg CO2e</span> monthly reduction.
                  </p>
                </div>

                {/* YTD Projection Card */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[#121413] p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingDown className="h-20 w-20 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                    YTD Projection
                  </h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      {((currentMonthEmissions * 12) / 1000).toFixed(1)}
                    </span>
                    <span className="text-sm font-mono text-[var(--color-text-muted)]">Tonnes CO2e/yr</span>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-[#A8FF53] font-mono">
                    <Award className="h-4 w-4" /> Global average target is ~2.0 Tonnes.
                  </div>
                </div>
              </div>

              {/* Breakdown and Activity List */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Category Share */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[#121413] p-6 lg:col-span-1">
                  <h3 className="text-lg font-semibold tracking-tight">Emissions Breakdown</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mb-6">
                    Distribution across logged categories
                  </p>

                  <div className="space-y-4">
                    {[
                      { name: "Transport", val: categoryEmissions.transport, icon: Car, color: "bg-blue-500" },
                      { name: "Home Energy", val: categoryEmissions.energy, icon: Lightbulb, color: "bg-yellow-500" },
                      { name: "Diet / Food", val: categoryEmissions.food, icon: Utensils, color: "bg-green-500" },
                      { name: "Shopping & Waste", val: categoryEmissions.shopping, icon: ShoppingBag, color: "bg-purple-500" },
                    ].map((cat) => {
                      const share = currentMonthEmissions > 0 ? (cat.val / currentMonthEmissions) * 100 : 0;
                      return (
                        <div key={cat.name} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)] font-medium">
                              <cat.icon className="h-3.5 w-3.5" /> {cat.name}
                            </span>
                            <span className="font-mono">{cat.val.toFixed(0)} kg ({share.toFixed(0)}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#0a0b0a] rounded-full overflow-hidden border border-[var(--color-border)]">
                            <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${share}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Logged Feed */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[#121413] p-6 lg:col-span-2 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">Recent Activity Log</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Your latest tracked lifestyle choices
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("log")}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-semibold hover:bg-[#0a0b0a] text-[var(--color-accent)] transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" /> Log
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-1">
                    {activities.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--color-text-muted)]">
                        <span className="p-3 bg-[#0a0b0a] border border-[var(--color-border)] rounded-full mb-3 text-gray-500">
                          <Leaf className="h-6 w-6" />
                        </span>
                        <p className="text-sm">No activities logged yet.</p>
                        <p className="text-xs">Click the log button above to track your first event!</p>
                      </div>
                    ) : (
                      activities.map((act) => (
                        <div
                          key={act.id}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--color-border)] bg-[#0a0b0a] hover:border-gray-500 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="p-2.5 rounded-lg bg-[#121413] text-[var(--color-accent)]">
                              {act.category === "transport" && <Car className="h-4 w-4" />}
                              {act.category === "energy" && <Lightbulb className="h-4 w-4" />}
                              {act.category === "food" && <Utensils className="h-4 w-4" />}
                              {act.category === "shopping" && <ShoppingBag className="h-4 w-4" />}
                            </span>
                            <div>
                              <p className="text-sm font-semibold capitalize tracking-tight">
                                {act.subCategory.replace(/-/g, " ")}
                              </p>
                              <p className="text-xs text-[var(--color-text-muted)] font-mono">
                                {act.amount} {act.unit} {act.notes ? `· "${act.notes}"` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold font-mono text-[var(--color-accent)]">
                              +{act.co2eKg.toFixed(1)} kg
                            </span>
                            <button
                              onClick={() => handleDeleteActivity(act.id)}
                              className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "log" && (
            <motion.div
              key="log"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto rounded-3xl border border-[var(--color-border)] bg-[#121413] p-8"
            >
              <h3 className="text-2xl font-bold tracking-tight mb-2">Track Carbon Action</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-8">
                Input your daily utility bills, meal choices, commuting distances, and shopping to compute direct emissions.
              </p>

              {/* Form Category Selector */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { key: "transport" as const, name: "Transport", icon: Car },
                  { key: "energy" as const, name: "Utility/Energy", icon: Lightbulb },
                  { key: "food" as const, name: "Meal", icon: Utensils },
                  { key: "shopping" as const, name: "Shopping", icon: ShoppingBag },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setLogCategory(item.key)}
                    className={`py-3 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      logCategory === item.key
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                        : "border-[var(--color-border)] hover:border-gray-500 text-[var(--color-text-muted)]"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogSubmit} className="space-y-6">
                {/* Subcategory */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[var(--color-text-muted)] block uppercase">
                    Sub-category Type
                  </label>
                  <select
                    value={logSubCategory}
                    onChange={(e) => setLogSubCategory(e.target.value)}
                    className="w-full bg-[#0a0b0a] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-all font-mono capitalize"
                  >
                    {logCategory === "transport" && (
                      <>
                        <option value="petrol-car">Petrol Car</option>
                        <option value="ev">Electric Vehicle (EV)</option>
                        <option value="public-transit">Public Transit (Bus/Train)</option>
                        <option value="flight">Flight (Air travel)</option>
                        <option value="mostly-walk-cycle">Walk / Cycle</option>
                      </>
                    )}
                    {logCategory === "energy" && (
                      <>
                        <option value="electricity">Grid Electricity</option>
                        <option value="heating">Gas Heating</option>
                      </>
                    )}
                    {logCategory === "food" && (
                      <>
                        <option value="heavy-meat">Heavy Red Meat Meal</option>
                        <option value="omnivore">Average Omnivore Meal</option>
                        <option value="pescatarian">Fish/Pescatarian Meal</option>
                        <option value="vegetarian">Vegetarian Meal</option>
                        <option value="vegan">Vegan / Plant-based Meal</option>
                      </>
                    )}
                    {logCategory === "shopping" && (
                      <>
                        <option value="clothing">Clothing / Apparel</option>
                        <option value="electronics">Electronics Item</option>
                        <option value="waste">Trash / Waste Bag</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[var(--color-text-muted)] block uppercase">
                    Quantity / Amount (
                    {logCategory === "transport" && "km"}
                    {logCategory === "energy" && "kWh"}
                    {logCategory === "food" && "number of meals"}
                    {logCategory === "shopping" && (logSubCategory === "waste" ? "trash bags" : "items")}
                    )
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={logAmount}
                    onChange={(e) => setLogAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 15"
                    className="w-full bg-[#0a0b0a] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-all font-mono"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[var(--color-text-muted)] block uppercase">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="e.g. Weekly grocery trip, Winter heating bill"
                    className="w-full bg-[#0a0b0a] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLogging}
                  className="w-full py-3.5 rounded-xl bg-[var(--color-accent)] text-[#0a0b0a] font-semibold hover:brightness-110 shadow-lg shadow-[rgba(168,255,83,0.2)] transition-all flex items-center justify-center gap-2"
                >
                  {isLogging ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                  <span>Log Activity & Calculate</span>
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
            >
              {/* Create Goal Form */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[#121413] p-6 lg:col-span-1">
                <h3 className="text-lg font-semibold mb-4">Set Reduction Target</h3>
                <form onSubmit={handleCreateGoal} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-[var(--color-text-muted)]">Goal Title</label>
                    <input
                      type="text"
                      required
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      placeholder="e.g. Cycle to office twice a week"
                      className="w-full bg-[#0a0b0a] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--color-accent)] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-[var(--color-text-muted)]">Category</label>
                    <select
                      value={goalCategory}
                      onChange={(e) => setGoalCategory(e.target.value)}
                      className="w-full bg-[#0a0b0a] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--color-accent)] font-mono"
                    >
                      <option value="Transport">Transport</option>
                      <option value="Home Energy">Home Energy</option>
                      <option value="Food & Diet">Food & Diet</option>
                      <option value="Waste / Shopping">Waste / Shopping</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-[var(--color-text-muted)]">Target Saving (kg CO2e / yr)</label>
                    <input
                      type="number"
                      required
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 400"
                      className="w-full bg-[#0a0b0a] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--color-accent)] font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingGoal}
                    className="w-full py-2.5 rounded-xl bg-[var(--color-accent)] text-[#0a0b0a] font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 text-xs"
                  >
                    {isCreatingGoal ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Create Target
                  </button>
                </form>
              </div>

              {/* Goal List */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[#121413] p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-2">Your Carbon Targets</h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-6">Track and achieve carbon saving resolutions</p>

                <div className="space-y-4">
                  {goals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--color-text-muted)]">
                      <Target className="h-8 w-8 text-gray-500 mb-2" />
                      <p className="text-sm">No targets set yet.</p>
                      <p className="text-xs">Create your first climate resolution using the left panel.</p>
                    </div>
                  ) : (
                    goals.map((g) => (
                      <div
                        key={g.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          g.status === "achieved"
                            ? "border-green-500/30 bg-green-500/5 opacity-75"
                            : "border-[var(--color-border)] bg-[#0a0b0a]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold tracking-tight">{g.title}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold tracking-wider bg-[var(--color-border)] text-[var(--color-text-muted)]">
                              {g.category}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--color-text-muted)] font-mono mt-1">
                            Target saving: <span className="text-white font-semibold">{g.targetSaving} kg CO2e/yr</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleToggleGoalStatus(g)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            g.status === "achieved"
                              ? "bg-green-500 text-[#0a0b0a] hover:bg-green-400"
                              : "border border-[var(--color-border)] hover:bg-[#121413] text-[var(--color-text-muted)] hover:text-white"
                          }`}
                        >
                          {g.status === "achieved" ? "✓ Achieved" : "Mark Achieved"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="rounded-3xl border border-[var(--color-border)] bg-[#121413] p-8 relative overflow-hidden">
                {/* Header info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <Eyebrow className="mb-2">Climate Intelligence Engine</Eyebrow>
                    <h2 className="text-2xl font-bold tracking-tight">AI Insights & Advisor</h2>
                  </div>
                  <button
                    onClick={fetchAIInsights}
                    disabled={insightsLoading}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold hover:bg-[#0a0b0a] transition-all"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${insightsLoading ? "animate-spin" : ""}`} />
                    <span>Recalculate Advisor</span>
                  </button>
                </div>

                {/* Main insights render */}
                {insightsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-[var(--color-text-muted)] space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
                    <p className="text-sm font-mono animate-pulse">Groq model analyzing lifestyle telemetry...</p>
                  </div>
                ) : aiInsight ? (
                  <div className="space-y-6">
                    {/* Live indicator badge */}
                    <div className="flex items-center justify-between p-4 bg-[#0a0b0a] border border-[var(--color-border)] rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold font-mono uppercase tracking-wide">
                          {aiInsight.live ? "Live AI Analysis (Groq)" : "Baseline Insights Cache"}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[var(--color-text-muted)]">
                        Est. Footprint: <strong className="text-white">{aiInsight.estimatedAnnualFootprintTonnes} Tonnes / yr</strong>
                      </span>
                    </div>

                    {/* Summary paragraph */}
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed italic border-l-2 border-[var(--color-accent)] pl-4 py-1">
                      {aiInsight.summary}
                    </p>

                    {/* Recommendations stack */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-sm font-mono text-[var(--color-text-muted)] uppercase tracking-wide">
                        Ranked Recommendations
                      </h4>

                      {aiInsight.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="p-5 rounded-2xl border border-[var(--color-border)] bg-[#0a0b0a] flex flex-col md:flex-row justify-between gap-4 hover:border-gray-500 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                                {rec.category}
                              </span>
                              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                                Effort: <span className="capitalize text-white">{rec.effort}</span>
                              </span>
                            </div>
                            <h5 className="text-base font-semibold tracking-tight mt-1.5">{rec.title}</h5>
                            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mt-1">
                              {rec.detail}
                            </p>
                          </div>

                          <div className="flex flex-row md:flex-col justify-between md:justify-center items-start md:items-end border-t md:border-t-0 md:border-l border-[var(--color-border)] pt-3 md:pt-0 md:pl-6 min-w-[120px]">
                            <span className="text-xs text-[var(--color-text-muted)] font-mono">Savings</span>
                            <span className="text-lg font-bold font-mono text-[var(--color-accent)]">
                              -{rec.estimatedSavingKgPerYear} kg
                            </span>
                            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">CO2e / year</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-[var(--color-text-muted)] space-y-4">
                    <Sparkles className="h-10 w-10 text-[var(--color-accent)] opacity-50" />
                    <p className="text-sm">Click the recalculate button to analyze your profile and logs.</p>
                    <button
                      onClick={fetchAIInsights}
                      className="px-6 py-2 rounded-xl bg-[var(--color-accent)] text-[#0a0b0a] font-semibold text-xs hover:brightness-110 transition-all"
                    >
                      Analyze Profile
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
