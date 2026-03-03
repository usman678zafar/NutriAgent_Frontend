"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles, UtensilsCrossed, Search, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mealApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function MealsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("history"); // history | suggestions
    const [meals, setMeals] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showLogModal, setShowLogModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [estimating, setEstimating] = useState(false);

    // New meal form state
    const [newMeal, setNewMeal] = useState({
        meal_type: "breakfast",
        food_name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    });

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/");
                return;
            }
            const [historyRes, suggestionsRes] = await Promise.all([
                mealApi.getToday(),
                activeTab === "suggestions" ? mealApi.getSuggestions() : Promise.resolve({ data: [] })
            ]);
            setMeals(historyRes.data);
            if (activeTab === "suggestions") {
                setSuggestions(suggestionsRes.data);
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            if (err.response?.status === 404) {
                setError("Please set your metrics in the Nutrition tab first!");
            } else {
                setError("Error loading suggestions. Try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleLogMeal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mealApi.log(newMeal);
            setShowLogModal(false);
            setNewMeal({ meal_type: "breakfast", food_name: "", calories: 0, protein: 0, carbs: 0, fats: 0 });
            fetchData();
        } catch (err) {
            console.error("Log Error:", err);
        }
    };

    const handleMagicEstimate = async () => {
        if (!newMeal.food_name) return;
        setEstimating(true);
        try {
            const res = await mealApi.estimate({ food: newMeal.food_name });
            setNewMeal({
                ...newMeal,
                food_name: res.data.food_name,
                calories: res.data.calories,
                protein: res.data.protein,
                carbs: res.data.carbs,
                fats: res.data.fats
            });
        } catch (err) {
            console.error(err);
        } finally {
            setEstimating(false);
        }
    };

    const filteredMeals = meals.filter(m =>
        m.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.meal_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
            <div className="space-y-8">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Meal Planning</h1>
                        <p className="text-slate-500">Log your intake or let AI decide.</p>
                    </div>
                    <button
                        onClick={() => setShowLogModal(true)}
                        className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                    >
                        <Plus size={24} />
                    </button>
                </header>

                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-2xl w-full max-w-sm">
                    {["History", "Suggestions"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === tab.toLowerCase()
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center py-12"
                        >
                            <Loader2 className="animate-spin text-blue-500" size={32} />
                        </motion.div>
                    ) : activeTab === "history" ? (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-4"
                        >
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Filter history..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                />
                            </div>
                            {filteredMeals.length > 0 ? (
                                <div className="grid gap-3">
                                    {filteredMeals.map((meal, i) => (
                                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-500">
                                                    <UtensilsCrossed size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tight">{meal.meal_type}</p>
                                                    <p className="font-semibold text-slate-800">{meal.food_name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900">{Math.round(meal.calories)} kcal</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{Math.round(meal.protein)}p / {Math.round(meal.carbs)}c / {Math.round(meal.fats)}f</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400">No meals found.</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="suggestions"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-3xl text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={20} />
                                    <h2 className="font-bold">AI Meal Planner</h2>
                                </div>
                                <p className="text-sm text-indigo-100 mb-4">Optimized based on your current macro split and weight trend.</p>
                                <button
                                    onClick={fetchData}
                                    className="bg-white text-indigo-600 w-full py-3 rounded-2xl font-bold shadow-lg hover:shadow-indigo-400/20 transition-all active:scale-95"
                                >
                                    Generate New Plan
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-medium text-center animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {suggestions.length > 0 ? (
                                    suggestions.map((sug, i) => (
                                        <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase">AI SUGGESTION</span>
                                                <span className="font-bold text-slate-700">{sug.calories} kcal</span>
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{sug.food_name}</h3>
                                            <p className="text-sm text-slate-500 mt-1">{sug.protein}g Protein | {sug.carbs}g Carbs | {sug.fats}g Fats</p>
                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setNewMeal({
                                                            meal_type: sug.meal_type || "lunch",
                                                            food_name: sug.food_name,
                                                            calories: sug.calories,
                                                            protein: sug.protein,
                                                            carbs: sug.carbs,
                                                            fats: sug.fats
                                                        });
                                                        setShowLogModal(true);
                                                    }}
                                                    className="flex-1 bg-slate-900 text-white text-xs font-bold py-2 rounded-xl hover:bg-indigo-600 transition-colors"
                                                >
                                                    Add to Log
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-400 italic">
                                        Hit generate to see AI meal suggestions.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Log Meal Modal */}
                <AnimatePresence>
                    {showLogModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"
                            >
                                <button
                                    onClick={() => setShowLogModal(false)}
                                    className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={20} />
                                </button>
                                <h2 className="text-2xl font-bold mb-6">Log New Meal</h2>
                                <form onSubmit={handleLogMeal} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Meal Type</label>
                                        <select
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium"
                                            value={newMeal.meal_type}
                                            onChange={(e) => setNewMeal({ ...newMeal, meal_type: e.target.value })}
                                        >
                                            <option value="breakfast">Breakfast</option>
                                            <option value="lunch">Lunch</option>
                                            <option value="dinner">Dinner</option>
                                            <option value="snack">Snack</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Food Name</label>
                                            <p className="text-[10px] text-blue-500 font-bold mb-0.5 group-hover:block transition-all italic">AI can estimate this! ⬎</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                required
                                                className="flex-1 bg-slate-50 border-none rounded-2xl p-4 font-medium"
                                                placeholder="e.g. Scrambled Eggs"
                                                value={newMeal.food_name}
                                                onChange={(e) => setNewMeal({ ...newMeal, food_name: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                disabled={estimating || !newMeal.food_name}
                                                onClick={handleMagicEstimate}
                                                className={cn(
                                                    "bg-blue-50 text-blue-600 px-4 rounded-2xl transition-all shadow-sm flex items-center justify-center",
                                                    estimating ? "opacity-70" : "hover:bg-blue-100 active:scale-95",
                                                    !estimating && newMeal.food_name && newMeal.calories === 0 && "animate-pulse"
                                                )}
                                            >
                                                {estimating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Calories</label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium"
                                                value={newMeal.calories}
                                                onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Protein (g)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium"
                                                value={newMeal.protein}
                                                onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Carbs (g)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium"
                                                value={newMeal.carbs}
                                                onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase">Fats (g)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium"
                                                value={newMeal.fats}
                                                onChange={(e) => setNewMeal({ ...newMeal, fats: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold mt-4 hover:bg-blue-600 transition-colors shadow-lg active:scale-95"
                                    >
                                        Save Meal
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
