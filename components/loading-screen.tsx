"use client";

import { motion } from "framer-motion";

export const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                filter: "blur(10px)",
                transition: { duration: 0.8, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white overflow-hidden"
        >
            {/* Minimalist Background Glow - Fixed Position, No JS movement */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center gap-8"
            >
                {/* Main Brand Text with Shimmer Effect */}
                <div className="relative">
                    <h1
                        className="text-4xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-white to-zinc-500 animate-shimmer bg-[length:200%_100%]"
                    >
                        SociaVerse
                    </h1>
                </div>

                {/* Elegant Tagline Reveal */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex flex-col items-center gap-1"
                >
                    <p className="text-xs md:text-base text-indigo-300/80 font-mono tracking-[0.2em] md:tracking-[0.3em] uppercase text-center">
                        Establishing Connection
                    </p>
                </motion.div>

                {/* Thin Premium Loading Line */}
                <div className="w-24 md:w-32 h-[1px] bg-zinc-800 relative overflow-hidden mt-4">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 2.5, ease: "circOut" }}
                        className="absolute inset-0 bg-indigo-500"
                        onAnimationComplete={onComplete}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export const AuthLoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
            {/* Simple glow for depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center gap-6"
            >
                {/* Pulsing Logo Ring */}
                <div className="relative">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl"
                    />
                    <h1 className="relative text-3xl font-bold tracking-tight text-white">
                        SociaVerse
                    </h1>
                </div>

                {/* Minimalist Spinner */}
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border border-zinc-700 border-t-indigo-500 rounded-full"
                    />
                    <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                        Authenticating
                    </span>
                </div>
            </motion.div>
        </div>
    );
};
