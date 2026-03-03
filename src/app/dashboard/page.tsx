"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Target, TrendingUp, Calendar, Loader2, Scale, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { metricsApi, mealApi, insightApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [targets, setTargets] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    });
    const [todayMeals, setTodayMeals] = useState<any[]>([]);
    const [insights, setInsights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [weightHistory, setWeightHistory] = useState<any[]>([]);
    const [reviewMessage, setReviewMessage] = useState("");

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/");
                return;
            }

            const [targetsRes, mealsRes, insightsRes, historyRes] = await Promise.all([
                metricsApi.getCurrentTargets(),
                mealApi.getToday(),
                insightApi.getHabitInsights(),
                metricsApi.getHistory()
            ]);

            setTargets(targetsRes.data);
            setTodayMeals(mealsRes.data);
            setInsights(insightsRes.data);
            setWeightHistory(historyRes.data);
        } catch (err: any) {
            console.error("Dashboard Fetch Error:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                router.push("/");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async () => {
        try {
            const res = await insightApi.reviewProgress();
            if (res.data.status === "adjusted") {
                setReviewMessage(`AI Adjustment: ${res.data.details.reason}`);
                fetchData(); // Refresh everything
            } else {
                setReviewMessage(res.data.reason || "Your progress is on track! Keep it up.");
            }
            setTimeout(() => setReviewMessage(""), 6000);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [router]);

    // Calculate totals from today's meals
    const currentMacros = todayMeals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-slate-500 font-medium italic">Consulting with your AI Coach...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
            <div className="space-y-8">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Good morning, Champ!</h1>
                        <p className="text-slate-500">Your AI-generated nutrition plan is ready.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Today's Target</p>
                        <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                            <Zap size={20} className="fill-blue-600" />
                            {Math.round(targets.calories)} kcal
                        </div>
                    </div>
                </header>

                {/* Macros Grid */}
                <section className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Protein", current: currentMacros.protein, target: targets.protein, unit: "g", color: "bg-orange-500", light: "bg-orange-50" },
                        { label: "Carbs", current: currentMacros.carbs, target: targets.carbs, unit: "g", color: "bg-blue-500", light: "bg-blue-50" },
                        { label: "Fats", current: currentMacros.fats, target: targets.fats, unit: "g", color: "bg-yellow-500", light: "bg-yellow-50" },
                    ].map((macro) => {
                        const progress = targets.calories > 0 ? (macro.current / macro.target) * 100 : 0;
                        return (
                            <motion.div
                                key={macro.label}
                                whileHover={{ y: -4 }}
                                className={cn("p-4 rounded-2xl border border-slate-100 shadow-sm", macro.light)}
                            >
                                <p className="text-xs font-semibold text-slate-500 uppercase">{macro.label}</p>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-xl font-bold">{Math.round(macro.current)}</span>
                                    <span className="text-xs font-medium text-slate-400">/ {Math.round(macro.target)}{macro.unit}</span>
                                </div>
                                <div className="mt-3 h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", macro.color)}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </section>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                            <Calendar size={18} className="text-indigo-500" />
                            Today's Meals
                        </div>
                        <div className="space-y-3">
                            {todayMeals.length > 0 ? todayMeals.map((meal, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div>
                                        <p className="text-sm font-medium">{meal.food_name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase">{meal.meal_type}</p>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{Math.round(meal.calories)} kcal</span>
                                </div>
                            )) : (
                                <div className="py-4 text-center text-slate-400 text-sm italic">
                                    No meals logged yet today.
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => router.push("/meals")}
                            className="w-full py-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                            Log a meal
                        </button>
                    </section>

                    {/* AI Recommendations */}
                    <section className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg space-y-4 relative overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-2 font-semibold text-indigo-100">
                            <Target size={18} />
                            AI Coach Insight
                        </div>
                        <p className="text-sm leading-relaxed text-indigo-50/90">
                            {insights && insights[0] && typeof insights[0] === 'object' && insights[0].text
                                ? `"${insights[0].text}"`
                                : typeof insights[0] === 'string'
                                    ? `"${insights[0]}"`
                                    : `"Keep tracking your meals to get personalized AI coaching insights!"`}
                        </p>
                        <div className="pt-2">
                            <button
                                onClick={() => router.push("/meals")}
                                className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-50 transition-colors"
                            >
                                Get Meal Idea
                            </button>
                        </div>
                    </section>
                </div>

                {/* Weight History Chart */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                <Scale size={20} className="text-emerald-500" /> Weight Tracking
                            </h3>
                            <p className="text-xs text-slate-400">Scale progression over time.</p>
                        </div>
                        <button
                            onClick={handleReview}
                            className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                        >
                            Review Progress
                        </button>
                    </div>

                    <div className="h-48 flex items-end gap-3 px-2">
                        {weightHistory.length > 0 ? weightHistory.map((h, i) => {
                            // Normalize height
                            const min = Math.min(...weightHistory.map(w => w.weight)) - 2;
                            const max = Math.max(...weightHistory.map(w => w.weight)) + 2;
                            const pct = ((h.weight - min) / (max - min)) * 80 + 20;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${pct}%` }}
                                    className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg relative group cursor-pointer hover:from-emerald-600 transition-colors"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl">
                                        {h.weight} kg<br /><span className="text-[8px] text-slate-400">{new Date(h.recorded_at).toLocaleDateString()}</span>
                                    </div>
                                </motion.div>
                            );
                        }) : (
                            <div className="flex-1 h-full flex items-center justify-center text-slate-300 italic text-sm">
                                Log some weight metrics to see history.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

