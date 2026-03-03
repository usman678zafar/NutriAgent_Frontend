"use client";

import { useEffect, useState } from "react";
import { Scale, Ruler, UserCircle2, Activity, Target, Save, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { metricsApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export default function MetricsPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        weight: 75,
        height: 180,
        age: 28,
        gender: "male",
        activity_level: "moderate",
        goal: "loss"
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState("");
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const fetchCurrent = async () => {
            try {
                // Fetch both targets and actual metrics
                const [targetsRes, metricsRes] = await Promise.allSettled([
                    metricsApi.getCurrentTargets(),
                    metricsApi.getCurrentMetrics()
                ]);

                if (targetsRes.status === 'fulfilled' && targetsRes.value.data) {
                    setResult(targetsRes.value.data);
                }

                if (metricsRes.status === 'fulfilled' && metricsRes.value.data) {
                    const m = metricsRes.value.data;
                    setFormData({
                        weight: m.weight,
                        height: m.height,
                        age: m.age,
                        gender: m.gender,
                        activity_level: m.activity_level,
                        goal: m.goal
                    });
                }
            } catch (err) {
                console.log("Error fetching metrics context", err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchCurrent();
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await metricsApi.update(formData);
            setResult(res.data);
            // Navigate to dashboard after a short delay to show success
            setTimeout(() => router.push("/dashboard"), 2000);
        } catch (err: any) {
            setError(getErrorMessage(err));
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                router.push("/");
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
            <div className="space-y-8 pb-12">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Metrics</h1>
                    <p className="text-slate-500">Keep your data updated for accurate AI planning.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Core Stats */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Physical Stats</h2>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                                    <Scale size={14} /> Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                                    className="w-full text-2xl font-bold bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                                    <Ruler size={14} /> Height (cm)
                                </label>
                                <input
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                                    className="w-full text-2xl font-bold bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                                    <UserCircle2 size={14} /> Age
                                </label>
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                                    className="w-full text-2xl font-bold bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                                    <UserCircle2 size={14} /> Gender
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Male', 'Female'].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setFormData({ ...formData, gender: g.toLowerCase() })}
                                            className={`py-3 rounded-xl text-xs font-bold transition-all ${formData.gender === g.toLowerCase()
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Preferences */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Status & Goals</h2>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                                    <Activity size={14} /> Activity Level
                                </label>
                                <select
                                    value={formData.activity_level}
                                    onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 appearance-none"
                                >
                                    <option value="sedentary">Sedentary (Office job)</option>
                                    <option value="light">Light (1-2 days/week)</option>
                                    <option value="moderate">Moderate (3-5 days/week)</option>
                                    <option value="active">Active (Daily exercise)</option>
                                    <option value="very_active">Very Active (Elite athlete)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                                    <Target size={14} /> Primary Goal
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Loss', 'Maintain', 'Gain'].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setFormData({ ...formData, goal: g.toLowerCase() })}
                                            className={`py-3 rounded-xl text-xs font-bold transition-all ${formData.goal === g.toLowerCase()
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 font-medium text-center bg-red-50 py-2 rounded-xl">{error}</p>
                            )}

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2"
                                >
                                    <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                                        <CheckCircle size={16} /> New Plan Generated!
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-green-600">
                                        <span>🔥 Calories: {Math.round(result.calories)} kcal</span>
                                        <span>🥩 Protein: {Math.round(result.protein)}g</span>
                                        <span>🍞 Carbs: {Math.round(result.carbs)}g</span>
                                        <span>🥑 Fats: {Math.round(result.fats)}g</span>
                                    </div>
                                    <p className="text-[10px] text-green-500">Redirecting to dashboard...</p>
                                </motion.div>
                            )}

                            <div className="pt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Calculating...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save & Recalculate Plan
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-center text-slate-400 mt-3 px-4">
                                    This will trigger the <span className="text-blue-500 font-bold">Nutrition AI Agent</span> to generate a new calorie and macro target.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* History Card */}
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Scale size={18} className="text-slate-400" />
                        Recent Weight Logs
                    </h2>
                    <div className="h-40 flex items-end gap-2 px-2">
                        {[60, 55, 65, 50, 70, 45, 60].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                className="flex-1 bg-slate-100 rounded-t-lg relative group cursor-pointer hover:bg-blue-100 transition-colors"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    7{i}.5 kg
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 px-1">
                        <span className="text-[10px] font-bold text-slate-300 uppercase">Feb 21</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase">Today</span>
                    </div>
                </section>
            </div>
        </div>
    );
}

