"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity, LayoutDashboard, Utensils, User, LogOut } from "lucide-react";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hide Navbar on landing page or auth page
    if (pathname === "/" || pathname === "/auth") {
        return null;
    }

    // On server, or before hydration, don't show the navbar because we don't know the auth state
    if (!mounted) {
        return null;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // If no token exists, the user is not authenticated: hide navbar
    if (!token) {
        return null;
    }

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Nutrition", href: "/metrics", icon: Activity },
        { name: "Meals", href: "/meals", icon: Utensils },
        { name: "Profile", href: "/profile", icon: User },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-lg border border-slate-200 px-6 py-3 rounded-full flex items-center gap-8 shadow-xl z-50">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-colors",
                            isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <Icon size={20} />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </Link>
                );
            })}
            <button
                onClick={handleLogout}
                className="flex flex-col items-center gap-1 text-slate-500 hover:text-red-500 transition-colors"
            >
                <LogOut size={20} />
                <span className="text-[10px] font-medium">Logout</span>
            </button>
        </nav>
    );
};

export default Navbar;
