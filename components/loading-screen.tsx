"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Meteors } from "./ui/meteors";

const LOADING_PHRASES = [
    "Traveling to the verse...",
    "Polishing pixels...",
    "Connecting minds...",
    "Warp speed engaged...",
    "Loading your digital reality...",
    "Syncing with the matrix...",
    "Wait for it...",
    "Almost there...",
];

export const LoadingScreen = ({ destination = "the Verse" }: { destination?: string }) => {
    const [phraseIndex, setPhraseIndex] = useState(-1);

    useEffect(() => {
        // Start showing random phrases after 2s if loading is still happening
        const initialDelay = setTimeout(() => {
            setPhraseIndex(0);
        }, 2000);

        // Change phrase every 2s
        const interval = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
        }, 2000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
                opacity: 0,
                y: -50,
                transition: { duration: 0.5, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-zinc-900/30 overflow-hidden pointer-events-none">
                <Meteors number={20} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            {/* Content Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                        duration: 0.5,
                        ease: "easeOut"
                    }
                }}
                className="relative z-10 flex flex-col items-center gap-2"
            >
                {/* Branding Text */}
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-white animate-pulse drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                    SociaVerse
                </h1>

                {/* Subtitle / Loading Bar */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                        width: "100%",
                        opacity: 1,
                        transition: { delay: 0.3, duration: 1.5, ease: "easeInOut" }
                    }}
                    className="h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-32 mt-4 opacity-50"
                />

                {/* Destination / Dynamic Loading Phrases */}
                <div className="h-8 mt-4 flex items-center justify-center min-w-[200px] text-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={phraseIndex === -1 ? "destination" : phraseIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm md:text-base text-zinc-400 font-medium tracking-wide"
                        >
                            {phraseIndex === -1 ? `Hovering to ${destination}...` : LOADING_PHRASES[phraseIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};
