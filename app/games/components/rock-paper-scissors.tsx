"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Hand, Scissors, Scroll, RefreshCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Choice = "rock" | "paper" | "scissors"
type Result = "win" | "lose" | "draw" | null

const CHOICES = [
    { id: "rock", name: "Rock", icon: Scroll, color: "text-slate-400" }, // Using Scroll as Rock approx
    { id: "paper", name: "Paper", icon: Hand, color: "text-blue-400" },
    { id: "scissors", name: "Scissors", icon: Scissors, color: "text-pink-500" }
] as const

export function RockPaperScissors() {
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null)
    const [computerChoice, setComputerChoice] = useState<Choice | null>(null)
    const [result, setResult] = useState<Result>(null)
    const [score, setScore] = useState({ player: 0, computer: 0 })

    const handleChoice = (choice: Choice) => {
        setPlayerChoice(choice)

        // Random computer choice
        const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)].id
        setComputerChoice(randomChoice)

        // Determine winner
        if (choice === randomChoice) {
            setResult("draw")
        } else if (
            (choice === "rock" && randomChoice === "scissors") ||
            (choice === "paper" && randomChoice === "rock") ||
            (choice === "scissors" && randomChoice === "paper")
        ) {
            setResult("win")
            setScore(prev => ({ ...prev, player: prev.player + 1 }))
        } else {
            setResult("lose")
            setScore(prev => ({ ...prev, computer: prev.computer + 1 }))
        }
    }

    const resetGame = () => {
        setPlayerChoice(null)
        setComputerChoice(null)
        setResult(null)
    }

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-md">
            {/* Scoreboard */}
            <div className="flex items-center justify-between w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">You</span>
                    <span className="text-3xl font-black text-white">{score.player}</span>
                </div>
                <div className="text-slate-600 font-bold text-xl">VS</div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Bot</span>
                    <span className="text-3xl font-black text-white">{score.computer}</span>
                </div>
            </div>

            {/* Game Area */}
            <div className="h-64 flex items-center justify-center w-full">
                {!playerChoice ? (
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {CHOICES.map((choice) => (
                            <motion.button
                                key={choice.id}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleChoice(choice.id)}
                                className="aspect-square bg-slate-800/50 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group"
                            >
                                <motion.div
                                    className={cn("p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors", choice.color)}
                                >
                                    <choice.icon className="w-8 h-8" />
                                </motion.div>
                                <span className="font-bold text-slate-300">{choice.name}</span>
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full px-4">
                        {/* Player Choice */}
                        <motion.div
                            initial={{ scale: 0, x: -50 }}
                            animate={{ scale: 1, x: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className={cn(
                                "w-24 h-24 rounded-full bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center",
                                CHOICES.find(c => c.id === playerChoice)?.color
                            )}>
                                {(() => {
                                    const Icon = CHOICES.find(c => c.id === playerChoice)!.icon
                                    return <Icon className="w-10 h-10" />
                                })()}
                            </div>
                            <span className="font-bold text-blue-400">You Picked</span>
                        </motion.div>

                        {/* Result Text */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className={cn(
                                "text-4xl font-black uppercase tracking-tighter",
                                result === "win" ? "text-emerald-400" : result === "lose" ? "text-red-400" : "text-slate-400"
                            )}>
                                {result === "win" ? "You Win!" : result === "lose" ? "You Lost" : "Draw"}
                            </span>
                            <Button onClick={resetGame} variant="outline" size="sm" className="mt-2">
                                <RefreshCcw className="w-4 h-4 mr-2" /> Play Again
                            </Button>
                        </motion.div>

                        {/* Computer Choice */}
                        <motion.div
                            initial={{ scale: 0, x: 50 }}
                            animate={{ scale: 1, x: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className={cn(
                                "w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center",
                                CHOICES.find(c => c.id === computerChoice)?.color
                            )}>
                                {(() => {
                                    const Icon = CHOICES.find(c => c.id === computerChoice)!.icon
                                    return <Icon className="w-10 h-10" />
                                })()}
                            </div>
                            <span className="font-bold text-red-400">Bot Picked</span>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}
