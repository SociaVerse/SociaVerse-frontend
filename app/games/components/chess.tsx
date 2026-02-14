"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { RefreshCcw, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Simple representation for UI demo
// In a real app, use chess.js or similar for logic
const INITIAL_BOARD = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
]

const PIECES: Record<string, string> = {
    "k": "♔", "q": "♕", "r": "♖", "b": "♗", "n": "♘", "p": "♙", // Black
    "K": "♚", "Q": "♛", "R": "♜", "B": "♝", "N": "♞", "P": "♟"  // White
}

export function ChessGame() {
    const [board, setBoard] = useState(INITIAL_BOARD)

    // Placeholder for actual game logic
    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 text-amber-500 rounded-full mb-2 border border-amber-500/20">
                    <Crown className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Review Mode</h3>
                <p className="text-sm text-slate-400">Full chess engine coming soon. <br />Enjoy the board visualization.</p>
            </div>

            <div className="aspect-square w-full bg-slate-800 border-8 border-slate-800 rounded-lg shadow-2xl relative">
                <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                    {board.map((row, rankIdx) =>
                        row.map((piece, fileIdx) => {
                            const isDark = (rankIdx + fileIdx) % 2 === 1
                            return (
                                <div
                                    key={`${rankIdx}-${fileIdx}`}
                                    className={cn(
                                        "flex items-center justify-center text-3xl md:text-4xl select-none cursor-pointer hover:ring-2 ring-inset ring-amber-400/50 transition-all",
                                        isDark ? "bg-slate-700/50" : "bg-slate-300/10"
                                    )}
                                >
                                    {piece && (
                                        <span className={cn(
                                            "drop-shadow-md transform transition-transform hover:scale-110",
                                            piece === piece.toUpperCase() ? "text-slate-100" : "text-black drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]"
                                        )}>
                                            {PIECES[piece]}
                                        </span>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Coordinates */}
                <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-around text-xs text-slate-500 font-mono">
                    {['8', '7', '6', '5', '4', '3', '2', '1'].map(r => <span key={r}>{r}</span>)}
                </div>
                <div className="absolute -bottom-6 left-0 right-0 flex justify-around text-xs text-slate-500 font-mono">
                    {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(f => <span key={f}>{f}</span>)}
                </div>
            </div>

            <Button disabled className="w-full bg-white/5 text-slate-400 border border-white/5">
                Play vs CPU (Unavailable)
            </Button>
        </div>
    )
}
