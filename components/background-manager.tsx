"use client";

import { usePathname } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { MouseSpotlight } from "@/components/mouse-spotlight";
import { AnimatePresence, motion } from "framer-motion";

export function BackgroundManager() {
    const pathname = usePathname();

    // Determine which background to show
    const isHome = pathname === "/";
    const isEvents = pathname?.startsWith("/events") || pathname?.startsWith("/community");
    const isAuth = pathname === "/login" || pathname === "/signup";

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-950">
            <MouseSpotlight />
            <AnimatePresence mode="wait">
                {isHome && (
                    <motion.div
                        key="home-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <BackgroundBeams className="opacity-40" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150 mix-blend-overlay" />
                        <FloatingParticles />
                    </motion.div>
                )}

                {isEvents && (
                    <motion.div
                        key="events-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDuration: '10s' }} />
                        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px]" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
                    </motion.div>
                )}

                {isAuth && (
                    <motion.div
                        key="auth-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
