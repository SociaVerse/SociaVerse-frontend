"use client";

import { motion } from "framer-motion";
import { Sparkles, Wrench, Code2, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

export default function MaintenancePage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-purple-500/30">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />

                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* Central Glassmorphic Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-2xl px-6"
            >
                <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                    {/* Inner glowing border top */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                    <div className="flex flex-col items-center text-center">
                        {/* Status Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
                                Systems Offline
                            </span>
                        </motion.div>

                        {/* Animated Icons Container */}
                        <div className="relative flex items-center justify-center mb-8 h-24 w-full">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute"
                            >
                                <div className="w-32 h-32 rounded-full border border-dashed border-white/10" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 bg-gradient-to-br from-purple-500 to-blue-600 p-4 rounded-2xl shadow-lg shadow-purple-500/25"
                            >
                                <Rocket className="w-8 h-8 text-white" />
                            </motion.div>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                                We're upgrading
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-zinc-400 max-w-lg mb-8 leading-relaxed font-light">
                            SociaVerse is currently undergoing scheduled maintenance to bring you new features and a better experience. We'll be back online shortly.
                        </p>

                        {/* Progress Indicator */}
                        <div className="w-full max-w-sm">
                            <div className="flex justify-between text-xs text-zinc-500 font-medium mb-2 uppercase tracking-widest">
                                <span>Optimization</span>
                                <span className="text-purple-400">In Progress</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 flex flex-col items-center gap-2 z-10"
            >
                <div className="flex gap-4 text-zinc-500 mb-2">
                    <Code2 className="w-4 h-4" />
                    <Wrench className="w-4 h-4" />
                
                </div>
                <div className="text-zinc-600 text-xs font-semibold tracking-widest uppercase">
                    © {new Date().getFullYear()} SociaVerse
                </div>
            </motion.div>
        </div>
    );
}
