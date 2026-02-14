"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Player = "X" | "O"
type SquareValue = Player | null

export function TicTacToe() {
    const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null))
    const [xIsNext, setXIsNext] = useState(true)
    const [winner, setWinner] = useState<Player | "Draw" | null>(null)
    const [winningLine, setWinningLine] = useState<number[] | null>(null)

    const checkWinner = (squares: SquareValue[]) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a] as Player, line: lines[i] }
            }
        }
        return null
    }

    const handleClick = (i: number) => {
        if (squares[i] || winner) return

        const nextSquares = squares.slice()
        nextSquares[i] = xIsNext ? "X" : "O"
        setSquares(nextSquares)
        setXIsNext(!xIsNext)

        const result = checkWinner(nextSquares)
        if (result) {
            setWinner(result.winner)
            setWinningLine(result.line)
        } else if (!nextSquares.includes(null)) {
            setWinner("Draw")
        }
    }

    const resetGame = () => {
        setSquares(Array(9).fill(null))
        setXIsNext(true)
        setWinner(null)
        setWinningLine(null)
    }

    const status = winner
        ? winner === "Draw"
            ? "It's a Draw!"
            : `Winner: ${winner}`
        : `Next Player: ${xIsNext ? "X" : "O"}`

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-md">
            {/* Game Status */}
            <div className="flex items-center justify-between w-full px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="font-bold text-lg text-slate-200">
                    {status}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetGame}
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/80 rounded-3xl border border-white/10 shadow-2xl relative">
                {squares.map((square, i) => (
                    <motion.div
                        key={i}
                        whileHover={!square && !winner ? { scale: 0.95, backgroundColor: "rgba(255,255,255,0.08)" } : {}}
                        whileTap={!square && !winner ? { scale: 0.9 } : {}}
                        onClick={() => handleClick(i)}
                        className={cn(
                            "w-24 h-24 md:w-28 md:h-28 bg-white/5 rounded-xl flex items-center justify-center text-4xl md:text-5xl font-black cursor-pointer transition-colors relative overflow-hidden",
                            winningLine?.includes(i) && "bg-emerald-500/20 border-emerald-500/50",
                            !square && !winner && "hover:bg-white/10"
                        )}
                    >
                        <AnimatePresence>
                            {square && (
                                <motion.span
                                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    className={cn(
                                        square === "X" ? "text-cyan-400" : "text-pink-500",
                                        "drop-shadow-lg"
                                    )}
                                >
                                    {square}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}

                {/* Winner Overlay Effect */}
                {winner && winner !== "Draw" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-[1px] rounded-3xl z-10"
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3"
                        >
                            <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400 mb-1">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                {winner} Wins!
                            </h2>
                            <Button onClick={resetGame} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                                Play Again
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
