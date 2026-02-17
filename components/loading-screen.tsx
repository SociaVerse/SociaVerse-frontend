"use client";

import { motion } from "framer-motion";
import { Meteors } from "./ui/meteors";

export const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                y: -50,
                transition: { duration: 0.8, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden"
            onAnimationComplete={() => {
                // specific logic if needed
            }}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-zinc-900/30 overflow-hidden pointer-events-none">
                <Meteors number={10} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-blue-500/10 pointer-events-none" />

            {/* Content Container */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                        duration: 0.8,
                        ease: "easeOut"
                    }
                }}
                className="relative z-10 flex flex-col items-center gap-4 text-center px-4"
            >
                {/* Branding Text */}
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-white animate-pulse drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                    Welcome to<br />SociaVerse
                </h1>

                {/* Subtitle / CTA */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.5, duration: 0.8 }
                    }}
                    className="text-lg md:text-2xl text-violet-200/80 font-light tracking-widest uppercase"
                >
                    Connect. Explore. Transcend.
                </motion.p>

                {/* Loading Bar / Visual Indicator */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{
                        width: "150px",
                        transition: { delay: 0.2, duration: 2.5, ease: "easeInOut" }
                    }}
                    className="h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent mt-6"
                    onAnimationComplete={onComplete}
                />
            </motion.div>
        </motion.div>
    );
};

export const AuthLoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-zinc-900/20 overflow-hidden pointer-events-none">
                <Meteors number={8} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-zinc-950 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex flex-col items-center gap-6"
            >
                {/* Pulsing Logo/Text */}
                <div className="relative">
                    <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse"></div>
                    <motion.h1
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-white"
                    >
                        SociaVerse
                    </motion.h1>
                </div>

                {/* Loading Indicator */}
                <div className="flex flex-col items-center gap-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full"
                    />
                    <p className="text-sm text-zinc-500 font-mono tracking-widest uppercase">Securing connection...</p>
                </div>
            </motion.div>
        </div>
    );
};
