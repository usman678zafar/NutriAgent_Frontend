"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, Bell, Shield, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await authApi.getMe();
                setUser(res.data);
            } catch (err) {
                console.error(err);
                router.push("/");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/auth");
    };

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
            <div className="space-y-8 pb-12">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Account</h1>
                    <p className="text-slate-500 font-medium">Manage your AI coaching preferences.</p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center gap-4 text-center"
                >
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-3xl font-black italic border-4 border-white shadow-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                        <p className="text-slate-400 font-medium">{user?.email}</p>
                    </div>
                </motion.div>

                <div className="space-y-3">
                    {[
                        { icon: Bell, title: "Notifications", color: "text-blue-500" },
                        { icon: Shield, title: "Security & Privacy", color: "text-rose-500" },
                        { icon: Settings, title: "Preferences", color: "text-slate-600" },
                    ].map((item, i) => (
                        <button key={i} className="w-full bg-white p-5 rounded-3xl border border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center ${item.color}`}>
                                    <item.icon size={20} />
                                </div>
                                <span className="font-bold text-slate-700">{item.title}</span>
                            </div>
                            <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full py-5 rounded-[2rem] bg-rose-50 text-rose-600 font-black flex items-center justify-center gap-2 hover:bg-rose-100 transition-all active:scale-95 shadow-sm border border-rose-100"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
}
