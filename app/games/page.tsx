"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Gamepad2, Trophy, Brain, Scissors, Grid3X3, Ghost, Crown, Dice6 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Meteors } from "@/components/ui/meteors"
import { TicTacToe } from "./components/tic-tac-toe"
import { RockPaperScissors } from "./components/rock-paper-scissors"
import { MemoryMatch } from "./components/memory-match"
import { SnakeGame } from "./components/snake"
import { ChessGame } from "./components/chess"
import { LudoGame } from "./components/ludo"

// Game Definitions
const GAMES = [
    {
        id: "tic-tac-toe",
        name: "Tic Tac Toe",
        description: "The classic game of X's and O's. Challenge the AI or a friend.",
        icon: Grid3X3,
        color: "from-blue-500 to-cyan-500",
        component: TicTacToe,
        status: "active"
    },
    {
        id: "rock-paper-scissors",
        name: "Rock Paper Scissors",
        description: "Test your luck and strategy in this quick hand game.",
        icon: Scissors,
        color: "from-pink-500 to-rose-500",
        component: RockPaperScissors,
        status: "active"
    },
    {
        id: "memory-match",
        name: "Memory Match",
        description: "Train your brain by finding matching pairs of cards.",
        icon: Brain,
        color: "from-violet-500 to-purple-500",
        component: MemoryMatch,
        status: "active"
    },
    {
        id: "snake",
        name: "Snake",
        description: "Navigate the snake to eat food and grow without hitting walls.",
        icon: Ghost,
        color: "from-emerald-500 to-green-500",
        component: SnakeGame,
        status: "active"
    },
    {
        id: "chess",
        name: "Chess",
        description: "Strategic board game for two players. Master the board.",
        icon: Crown,
        color: "from-amber-500 to-orange-500",
        component: ChessGame,
        status: "active"
    },
    {
        id: "ludo",
        name: "Ludo",
        description: "Race your tokens from start to finish. A game of luck and strategy.",
        icon: Dice6,
        color: "from-sky-500 to-indigo-500",
        component: LudoGame,
        status: "active"
    }
]

export default function GameCenterPage() {
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null)

    const selectedGame = GAMES.find(g => g.id === selectedGameId)

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-10 px-4 md:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <Meteors number={20} />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                            <Gamepad2 className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                SociaVerse Arcade
                            </h1>
                            <p className="text-slate-400 text-sm md:text-base mt-1">
                                Chill, play, and compete.
                            </p>
                        </div>
                    </div>

                    {selectedGameId && (
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedGameId(null)}
                            className="gap-2 text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Games
                        </Button>
                    )}
                </header>

                <AnimatePresence mode="wait">
                    {!selectedGameId ? (
                        <motion.div
                            key="game-grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {GAMES.map((game) => (
                                <motion.div
                                    key={game.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (game.status === 'active') {
                                            setSelectedGameId(game.id)
                                        }
                                    }}
                                    className={cn(
                                        "group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-sm p-6 cursor-pointer transition-all duration-300",
                                        game.status === 'active'
                                            ? "hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/10"
                                            : "opacity-60 cursor-not-allowed grayscale"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                                        game.color
                                    )} />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg bg-gradient-to-br",
                                            game.color
                                        )}>
                                            <game.icon className="w-6 h-6" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                                            {game.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            {game.status === 'active' ? (
                                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Play Now <ArrowLeft className="w-3 h-3 rotate-180" />
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="game-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                                {/* Game Header */}
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-xl bg-gradient-to-br text-white shadow-sm",
                                            selectedGame?.color
                                        )}>
                                            {selectedGame && <selectedGame.icon className="w-5 h-5" />}
                                        </div>
                                        <h2 className="text-xl font-bold text-white">{selectedGame?.name}</h2>
                                    </div>
                                </div>

                                {/* Game Content */}
                                <div className="p-6 min-h-[400px] flex items-center justify-center bg-slate-950/30">
                                    {selectedGame && <selectedGame.component />}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
