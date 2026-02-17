"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Gamepad2, RefreshCw, ArrowLeft, Grid3X3, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Meteors } from "@/components/ui/meteors";
import { TicTacToe } from "@/app/games/components/tic-tac-toe";
import { SnakeGame } from "@/app/games/components/snake";
import { cn } from "@/lib/utils";

type ViewState = "landing" | "tic-tac-toe" | "snake";

export function OfflineDetector() {
    const [isOffline, setIsOffline] = useState(false);
    const [view, setView] = useState<ViewState>("landing");
    const pathname = usePathname();

    useEffect(() => {
        // Initial check
        setIsOffline(!navigator.onLine);

        const handleOnline = () => {
            setIsOffline(false);
            setView("landing"); // Reset view when back online
        };

        const handleOffline = () => {
            setIsOffline(true);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // If user is already on the games page, don't show the intrusive overlay
    // But if they are on another page, we show it.
    const shouldShowOverlay = isOffline && !pathname.startsWith('/games');

    if (!shouldShowOverlay) return null;

    return (
        <AnimatePresence mode="wait">
            {shouldShowOverlay && (
                <motion.div
                    key="offline-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden"
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        <Meteors number={20} />
                    </div>

                    {/* Massive Background Branding */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                        <h1 className="text-[15vw] font-black text-white/[0.03] rotate-[-15deg] whitespace-nowrap select-none">
                            SociaVerse
                        </h1>
                    </div>

                    <AnimatePresence mode="wait">
                        {view === "landing" ? (
                            <LandingView
                                key="landing"
                                onPlay={() => setView("tic-tac-toe")}
                                onRetry={() => window.location.reload()}
                            />
                        ) : (
                            <GameView
                                key="game"
                                gameId={view}
                                onBack={() => setView("landing")}
                                onSwitchGame={(id) => setView(id as ViewState)}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function LandingView({ onPlay, onRetry }: { onPlay: () => void, onRetry: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl w-full flex flex-col items-center gap-8 text-center relative z-10"
        >
            {/* Animated Icon */}
            <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="p-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 shadow-[0_0_50px_-12px_rgba(239,68,68,0.5)]"
            >
                <WifiOff className="w-16 h-16" />
            </motion.div>

            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500">
                    SYSTEM OFFLINE
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-md mx-auto">
                    Connection lost in the void. <br />
                    Reconnect to resume your journey.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm mt-8">
                <Button
                    size="lg"
                    variant="outline"
                    className="h-14 border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl gap-3 text-base group"
                    onClick={onRetry}
                >
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Retry Connection
                </Button>

                <Button
                    size="lg"
                    className="h-14 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl gap-3 text-base shadow-lg shadow-indigo-500/25 group"
                    onClick={onPlay}
                >
                    <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Play Arcade
                </Button>
            </div>
        </motion.div>
    )
}

function GameView({ gameId, onBack, onSwitchGame }: { gameId: string, onBack: () => void, onSwitchGame: (id: string) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl h-full flex flex-col relative z-20"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 w-full max-w-md mx-auto xl:max-w-none">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-slate-400 hover:text-white gap-2 pl-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </Button>

                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => onSwitchGame('tic-tac-toe')}
                        className={cn(
                            "p-2 rounded-lg transition-all",
                            gameId === 'tic-tac-toe' ? "bg-indigo-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
                        )}
                        title="Tic Tac Toe"
                    >
                        <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onSwitchGame('snake')}
                        className={cn(
                            "p-2 rounded-lg transition-all",
                            gameId === 'snake' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
                        )}
                        title="Snake"
                    >
                        <Ghost className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto min-h-0">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {gameId === 'tic-tac-toe' ? "Tic Tac Toe" : "Snake Game"}
                </h2>

                {gameId === 'tic-tac-toe' && <TicTacToe />}
                {gameId === 'snake' && <SnakeGame />}
            </div>
        </motion.div>
    )
}
