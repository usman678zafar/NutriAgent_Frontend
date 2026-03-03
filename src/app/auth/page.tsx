"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Zap, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (isLogin) {
                const res = await authApi.login({ email: formData.email, password: formData.password });
                localStorage.setItem("token", res.data.access_token);
                router.push("/dashboard");
            } else {
                await authApi.register(formData);
                // After registration, auto-login
                const loginRes = await authApi.login({ email: formData.email, password: formData.password });
                if (loginRes.data.access_token) {
                    localStorage.setItem("token", loginRes.data.access_token);
                    router.push("/metrics");
                } else {
                    setIsLogin(true);
                    setError("Account created! Please sign in.");
                }
            }
        } catch (err: any) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100"
            >
                <div className="flex flex-col items-center gap-4 mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200">
                        <Zap className="text-white fill-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {isLogin ? "Welcome Back" : "Start your Journey"}
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">NutriAgent AI Personal Coach</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-medium focus:ring-2 focus:ring-blue-500/20"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-medium focus:ring-2 focus:ring-blue-500/20"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 font-medium focus:ring-2 focus:ring-blue-500/20"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-medium text-center bg-red-50 py-2 rounded-xl">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-400 font-medium">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-blue-600 font-bold hover:underline"
                        >
                            {isLogin ? "Sign Up" : "Log In"}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

