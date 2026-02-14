"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Crown, Play, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// --- Constants & Types ---
type PlayerColor = "red" | "green" | "yellow" | "blue"
type PieceState = "base" | "track" | "home" | "finished"
type Piece = {
    id: number
    color: PlayerColor
    state: PieceState
    distance: number // 0-57 (58 = finished)
}

const PLAYERS: PlayerColor[] = ["red", "green", "yellow", "blue"]
// Distances:
// 0-50: Main Track (51 steps? No, 0 to 50 is 51 steps. A lap is usually 52 cells.)
// Let's standardise: 
// Track Indices: 0-51 (52 cells).
// Red Start: Index 0.
// Green Start: Index 13.
// Yellow Start: Index 26.
// Blue Start: Index 39.
// Home Run Entry: After walking 51 steps (i.e. at index 50 relative to start?)
// Let's say 'distance' tracks total steps taken.
// distance 0 = at start position.
// distance 50 = last step on track.
// distance 51 = first step in home run.
// distance 56 = last step in home run (Home).
// distance 57 = Finished / Center.

const TOTAL_STEPS = 57 // 0 to 56 are valid positions? 
// 0(Start) + 50 steps = reach entry to home run.
// + 5 steps inside home run = reach home? usually 6.
// Let's map it visually.

// TRACK COORDINATES (1-based [Row, Col] for CSS Grid)
// We define the full 52-step loop starting from Red's Start (R7, C2)
const TRACK_COORDS = [
    // Red Arm Top (Rightwards) -> 0-4
    { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 }, { r: 7, c: 6 },
    // Up into Green Arm -> 5-10
    { r: 6, c: 7 }, { r: 5, c: 7 }, { r: 4, c: 7 }, { r: 3, c: 7 }, { r: 2, c: 7 }, { r: 1, c: 7 },
    // Across Top -> 11-12
    { r: 1, c: 8 }, { r: 1, c: 9 },
    // Down Green Arm -> 13-18 (Green Start is index 13 -> {r:2, c:10} usually? No standard is r2, c9 first then down?)
    // Let's trace standard path: R1,C9 -> R2,C9.
    { r: 2, c: 9 }, { r: 3, c: 9 }, { r: 4, c: 9 }, { r: 5, c: 9 }, { r: 6, c: 9 }, { r: 7, c: 9 }, // Index 18 is R7,C9
    // Right into Yellow Arm -> 19-24
    { r: 7, c: 10 }, { r: 7, c: 11 }, { r: 7, c: 12 }, { r: 7, c: 13 }, { r: 7, c: 14 }, { r: 7, c: 15 },
    // Down Right -> 25-26
    { r: 8, c: 15 }, { r: 9, c: 15 },
    // Left Yellow Arm -> 27-32
    { r: 9, c: 14 }, { r: 9, c: 13 }, { r: 9, c: 12 }, { r: 9, c: 11 }, { r: 9, c: 10 }, { r: 9, c: 9 },
    // Down into Blue Arm -> 33-38
    { r: 10, c: 9 }, { r: 11, c: 9 }, { r: 12, c: 9 }, { r: 13, c: 9 }, { r: 14, c: 9 }, { r: 15, c: 9 },
    // Left Bottom -> 39-40
    { r: 15, c: 8 }, { r: 15, c: 7 },
    // Up Blue Arm -> 41-46
    { r: 14, c: 7 }, { r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 },
    // Left into Red Arm -> 47-52
    { r: 9, c: 6 }, { r: 9, c: 5 }, { r: 9, c: 4 }, { r: 9, c: 3 }, { r: 9, c: 2 }, { r: 9, c: 1 },
    // Up Left -> 51 (Last step before Red Home Run or Red Start)
    { r: 8, c: 1 } // Index 51. Next for Red is Home Run. Next for others is Index 0.
]

// Home Run Paths (5 steps, 6th is center)
const HOME_RUNS = {
    red: [{ r: 8, c: 2 }, { r: 8, c: 3 }, { r: 8, c: 4 }, { r: 8, c: 5 }, { r: 8, c: 6 }],
    green: [{ r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 }, { r: 6, c: 8 }],
    yellow: [{ r: 8, c: 14 }, { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }],
    blue: [{ r: 14, c: 8 }, { r: 13, c: 8 }, { r: 12, c: 8 }, { r: 11, c: 8 }, { r: 10, c: 8 }]
}
// Center is generic, usually handled by checking distance > X

const START_OFFSETS = {
    red: 0,
    green: 13,
    yellow: 26,
    blue: 39
}

const SAFE_SPOTS = [0, 8, 13, 21, 26, 34, 39, 47] // Standard safe spots (Stars)

// Coordinates for Safe Spots to check against
// 0 -> R7, C2 (Red Start)
// 8 -> R3, C7 (Green safe?) No, usually R2,C9 is Green Start (Index 13).
// Let's refine logical Start Indices.
// If Red Start is 0 (R7, C2).
// Green Start is typically R2, C9.
// My map: Index 13 is R2, C9. Correct. 52/4 = 13.
// Yellow Start Index 26 -> R9, C14. Correct?
// Blue Start Index 39 -> R14, C7. Correct?


export function LudoGame() {
    const [pieces, setPieces] = useState<Piece[]>([])
    const [turn, setTurn] = useState<PlayerColor>("red")
    const [diceValue, setDiceValue] = useState<number | null>(null)
    const [isRolling, setIsRolling] = useState(false)
    const [canMove, setCanMove] = useState(false)
    const [winner, setWinner] = useState<PlayerColor | null>(null)

    useEffect(() => { resetGame() }, [])

    const resetGame = () => {
        const p: Piece[] = []
        PLAYERS.forEach(c => {
            for (let i = 0; i < 4; i++) p.push({ id: p.length, color: c, state: "base", distance: -1 })
        })
        setPieces(p)
        setTurn("red")
        setDiceValue(null)
        setWinner(null)
        setCanMove(false)
    }

    const rollDice = () => {
        if (isRolling || winner || (diceValue && canMove)) return
        setIsRolling(true)
        const interval = setInterval(() => setDiceValue(Math.ceil(Math.random() * 6)), 100)
        setTimeout(() => {
            clearInterval(interval)
            const val = Math.ceil(Math.random() * 6)
            setDiceValue(val)
            setIsRolling(false)
            checkMoves(val, pieces, turn)
        }, 800)
    }

    const checkMoves = (val: number, currentPieces: Piece[], currentTurn: PlayerColor) => {
        const movable = currentPieces.filter(p => p.color === currentTurn).some(p => {
            if (p.state === "base") return val === 6
            if (p.state === "finished") return false
            // Max distance is 56 (Home)
            return (p.distance + val) <= 56
        })

        if (movable) {
            setCanMove(true)
        } else {
            setCanMove(false)
            setTimeout(nextTurn, 1000)
        }
    }

    const nextTurn = () => {
        setDiceValue(null)
        const idx = PLAYERS.indexOf(turn)
        setTurn(PLAYERS[(idx + 1) % 4])
    }

    const handlePieceClick = (piece: Piece) => {
        if (!canMove || piece.color !== turn || !diceValue) return

        // Validate Move
        let valid = false
        if (piece.state === "base") {
            if (diceValue === 6) valid = true
        } else if (piece.state !== "finished") {
            if (piece.distance + diceValue <= 56) valid = true
        }

        if (!valid) return

        // Execute Move
        const newPieces = [...pieces]
        const p = newPieces.find(px => px.id === piece.id)!

        if (p.state === "base") {
            p.state = "track"
            p.distance = 0
        } else {
            p.distance += diceValue
            if (p.distance === 56) p.state = "finished"
        }

        // Kill Logic (Only on main track 0-50, and not on Safe Spots)
        if (p.state === "track" && p.distance < 51) {
            const trackPos = (START_OFFSETS[p.color] + p.distance) % 52
            // Check collisions
            const enemies = newPieces.filter(ep =>
                ep.color !== p.color &&
                ep.state === "track" &&
                ep.distance < 51 &&
                (START_OFFSETS[ep.color] + ep.distance) % 52 === trackPos
            )

            // Check Safe Spot
            const isSafe = SAFE_SPOTS.includes(trackPos)

            if (!isSafe && enemies.length > 0) {
                // Kill!
                enemies.forEach(e => {
                    e.state = "base"
                    e.distance = -1
                })
                // Reset turn? No, standard Ludo usually gives bonus turn but let's keep simple
            }
        }

        setPieces(newPieces)
        setCanMove(false)

        // Check Win
        if (newPieces.filter(px => px.color === turn && px.state === "finished").length === 4) {
            setWinner(turn)
        } else {
            if (diceValue === 6) {
                setDiceValue(null)
                // Retain turn
            } else {
                setTimeout(nextTurn, 500)
            }
        }
    }

    const getPieceStyle = (p: Piece) => {
        if (p.state === "base") return {}
        if (p.state === "finished") return {} // Handled in center div

        if (p.distance > 50) {
            // Home Run
            const idx = p.distance - 51
            if (idx < 5) {
                return HOME_RUNS[p.color][idx]
            }
            return {} // Should be finished
        }

        // Track
        const pos = (START_OFFSETS[p.color] + p.distance) % 52
        return TRACK_COORDS[pos]
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto select-none">
            {/* Info Panel */}
            {!winner && (
                <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur border border-white/10 px-6 py-3 rounded-full shadow-xl">
                    <span className={cn("text-lg font-bold uppercase tracking-widest",
                        turn === "red" ? "text-red-500" :
                            turn === "green" ? "text-emerald-500" :
                                turn === "yellow" ? "text-yellow-400" : "text-blue-500"
                    )}>{turn}'s Turn</span>
                </div>
            )}

            {/* Game Board */}
            <div className="relative w-full aspect-square bg-slate-50 border-8 border-slate-800 rounded-lg shadow-2xl max-w-[500px] overflow-hidden">
                <div className="grid grid-cols-15 grid-rows-15 w-full h-full">
                    {/* Render Grid Cells (Track + Home Runs) */}
                    {/* Top Left Base (Red) */}
                    <div className="col-span-6 row-span-6 bg-red-100 p-4 border-r-2 border-b-2 border-slate-800 flex items-center justify-center">
                        <div className="w-full h-full bg-red-500 rounded-3xl border-4 border-red-600 shadow-inner flex flex-wrap gap-3 p-4 justify-center items-center">
                            {pieces.filter(p => p.color === 'red' && p.state === 'base').map(p => (
                                <div key={p.id} onClick={() => handlePieceClick(p)} className="w-8 h-8 rounded-full bg-red-700 border-2 border-white/50 shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                            ))}
                        </div>
                    </div>

                    {/* Top Middle Tracks */}
                    {Array.from({ length: 6 }).map((_, i) => ( // Cols 7-9, Rows 1-6
                        <React.Fragment key={`tm-${i}`}>
                            {/* Left Col (7) */}
                            <div className="col-start-7 row-start-[var(--r)] border-[0.5px] border-slate-300 bg-white" style={{ "--r": i + 1 } as any} />
                            {/* Middle Col (8 - Home Run Green) */}
                            <div className="col-start-8 row-start-[var(--r)] border-[0.5px] border-slate-300 bg-green-200" style={{ "--r": i + 1 } as any}>
                                {i === 1 && <Star className="text-slate-400/50 w-full h-full p-1" />}
                            </div>
                            {/* Right Col (9) */}
                            <div className="col-start-9 row-start-[var(--r)] border-[0.5px] border-slate-300 bg-white" style={{ "--r": i + 1 } as any}>
                                {i === 1 && <div className="w-full h-full bg-green-400 rounded-full scale-75" />} {/* Green Start */}
                            </div>
                        </React.Fragment>
                    ))}

                    {/* Top Right Base (Green) */}
                    <div className="col-span-6 row-span-6 col-start-10 bg-green-100 p-4 border-l-2 border-b-2 border-slate-800 flex items-center justify-center">
                        <div className="w-full h-full bg-emerald-500 rounded-3xl border-4 border-emerald-600 shadow-inner flex flex-wrap gap-3 p-4 justify-center items-center">
                            {pieces.filter(p => p.color === 'green' && p.state === 'base').map(p => (
                                <div key={p.id} onClick={() => handlePieceClick(p)} className="w-8 h-8 rounded-full bg-emerald-800 border-2 border-white/50 shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                            ))}
                        </div>
                    </div>

                    {/* Middle Rows (7-9) */}
                    {/* Red Track Area (Cols 1-6) */}
                    <div className="col-span-6 row-span-3 row-start-7 col-start-1 grid grid-rows-3 grid-cols-6">
                        {/* Row 7: Track */}
                        {Array.from({ length: 6 }).map((_, c) => (
                            <div key={`r7-${c}`} className="border-[0.5px] border-slate-300 bg-white relative">
                                {c === 1 && <div className="absolute inset-0 m-1 bg-red-400 rounded-full opacity-50" />} {/* Start */}
                            </div>
                        ))}
                        {/* Row 8: Home Run Red */}
                        {Array.from({ length: 6 }).map((_, c) => (
                            <div key={`r8-${c}`} className={cn("border-[0.5px] border-slate-300", c > 0 && "bg-red-200")}>
                                {c === 1 && <Star className="text-slate-400/50 w-full h-full p-1" />}
                            </div>
                        ))}
                        {/* Row 9: Track */}
                        {Array.from({ length: 6 }).map((_, c) => (<div key={`r9-${c}`} className="border-[0.5px] border-slate-300 bg-white" />))}
                    </div>

                    {/* Center Home */}
                    <div className="col-span-3 row-span-3 col-start-7 row-start-7 bg-white relative grid grid-cols-2 grid-rows-2">
                        {/* Triangles */}
                        <div className="bg-red-500/20 border-r border-b border-black/10"></div>
                        <div className="bg-green-500/20 border-l border-b border-black/10"></div>
                        <div className="bg-blue-500/20 border-r border-t border-black/10"></div>
                        <div className="bg-yellow-500/20 border-l border-t border-black/10"></div>

                        {/* Finished Pieces */}
                        <div className="absolute inset-0 flex flex-wrap items-center justify-center p-2 gap-1">
                            {pieces.filter(p => p.state === 'finished').map(p => (
                                <div key={p.id} className={cn("w-3 h-3 rounded-full shadow-sm",
                                    p.color === 'red' ? "bg-red-600" :
                                        p.color === 'green' ? "bg-emerald-600" :
                                            p.color === 'yellow' ? "bg-yellow-500" : "bg-blue-600"
                                )} />
                            ))}
                        </div>
                    </div>

                    {/* Yellow Track Area (Cols 10-15) */}
                    <div className="col-span-6 row-span-3 row-start-7 col-start-10 grid grid-rows-3 grid-cols-6">
                        {/* Row 7: Track */}
                        {Array.from({ length: 6 }).map((_, c) => (<div key={`r7y-${c}`} className="border-[0.5px] border-slate-300 bg-white" />))}
                        {/* Row 8: Home Run Yellow */}
                        {Array.from({ length: 6 }).map((_, c) => (
                            <div key={`r8y-${c}`} className={cn("border-[0.5px] border-slate-300", c < 5 && "bg-yellow-200")}>
                                {c === 4 && <Star className="text-slate-400/50 w-full h-full p-1" />}
                            </div>
                        ))}
                        {/* Row 9: Track */}
                        {Array.from({ length: 6 }).map((_, c) => (
                            <div key={`r9y-${c}`} className="border-[0.5px] border-slate-300 bg-white relative">
                                {c === 4 && <div className="absolute inset-0 m-1 bg-yellow-400 rounded-full opacity-50" />}
                            </div>
                        ))}
                    </div>

                    {/* Bottom Left Base (Blue) */}
                    <div className="col-span-6 row-span-6 row-start-10 bg-blue-100 p-4 border-r-2 border-t-2 border-slate-800 flex items-center justify-center">
                        <div className="w-full h-full bg-blue-500 rounded-3xl border-4 border-blue-600 shadow-inner flex flex-wrap gap-3 p-4 justify-center items-center">
                            {pieces.filter(p => p.color === 'blue' && p.state === 'base').map(p => (
                                <div key={p.id} onClick={() => handlePieceClick(p)} className="w-8 h-8 rounded-full bg-blue-700 border-2 border-white/50 shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                            ))}
                        </div>
                    </div>

                    {/* Bottom Middle Tracks */}
                    <div className="col-span-3 row-span-6 row-start-10 col-start-7 grid grid-rows-6 grid-cols-3">
                        {Array.from({ length: 6 }).map((_, r) => (
                            <React.Fragment key={`bm-${r}`}>
                                <div className="border-[0.5px] border-slate-300 bg-white relative">
                                    {r === 4 && <div className="absolute inset-0 m-1 bg-blue-400 rounded-full opacity-50" />}
                                </div>
                                <div className={cn("border-[0.5px] border-slate-300", r < 5 && "bg-blue-200")}>
                                    {r === 4 && <Star className="text-slate-400/50 w-full h-full p-1" />}
                                </div>
                                <div className="border-[0.5px] border-slate-300 bg-white" />
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Bottom Right Base (Yellow) */}
                    <div className="col-span-6 row-span-6 row-start-10 col-start-10 bg-yellow-100 p-4 border-l-2 border-t-2 border-slate-800 flex items-center justify-center">
                        <div className="w-full h-full bg-yellow-400 rounded-3xl border-4 border-yellow-500 shadow-inner flex flex-wrap gap-3 p-4 justify-center items-center">
                            {pieces.filter(p => p.color === 'yellow' && p.state === 'base').map(p => (
                                <div key={p.id} onClick={() => handlePieceClick(p)} className="w-8 h-8 rounded-full bg-yellow-600 border-2 border-white/50 shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Absolute Positioned Pieces on Track */}
                {pieces.filter(p => (p.state === 'track' || (p.distance > 50 && p.state !== 'finished'))).map(p => {
                    const style = getPieceStyle(p)
                    return (
                        <motion.div
                            layoutId={`piece-${p.id}`}
                            key={p.id}
                            initial={false}
                            className={cn("absolute w-6 h-6 z-20 rounded-full border-2 border-white shadow-xl cursor-pointer hover:scale-125 transition-all outline-4 outline-offset-1 m-auto inset-0",
                                p.color === 'red' ? "bg-red-600 outline-red-500/0" :
                                    p.color === 'green' ? "bg-emerald-600 outline-emerald-500/0" :
                                        p.color === 'yellow' ? "bg-yellow-500 outline-yellow-500/0" : "bg-blue-600 outline-blue-500/0",
                                (canMove && diceValue && p.color === turn && (p.distance + diceValue <= 56)) ? "ring-4 ring-black/20 scale-110" : ""
                            )}
                            style={style as any}
                            onClick={() => handlePieceClick(p)}
                        />
                    )
                })}
            </div>

            {/* Dice Control */}
            <div className="mt-4">
                <Button
                    className={cn("w-24 h-24 rounded-2xl flex flex-col gap-2 items-center justify-center transition-all shadow-2xl skew-y-0 hover:-translate-y-1 active:translate-y-0",
                        turn === "red" ? "bg-red-500 hover:bg-red-600" :
                            turn === "green" ? "bg-emerald-500 hover:bg-emerald-600" :
                                turn === "yellow" ? "bg-yellow-400 hover:bg-yellow-500 text-slate-800" : "bg-blue-500 hover:bg-blue-600"
                    )}
                    onClick={rollDice}
                    disabled={isRolling || canMove || !!winner}
                >
                    <motion.div animate={isRolling ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}>
                        {!diceValue && !isRolling ? <Play className="w-8 h-8" /> : <DiceIcon value={diceValue} />}
                    </motion.div>
                    <span className="font-bold text-xs uppercase">{isRolling ? "Rolling" : canMove ? "Move" : "Roll"}</span>
                </Button>
            </div>

            {/* Winner Modal */}
            {winner && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl text-center space-y-6 animate-in zoom-in">
                        <Crown className="w-20 h-20 text-yellow-500 mx-auto" />
                        <h2 className="text-4xl font-black text-white uppercase">{winner} Wins!</h2>
                        <Button onClick={resetGame} size="lg" className="w-full font-bold text-lg">Play Again</Button>
                    </div>
                </div>
            )}
        </div>
    )
}

const Star = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
)

const DiceIcon = ({ value }: { value: number | null }) => {
    const Icons = [Dice1, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    const Icon = Icons[value || 0]
    return <Icon className="w-10 h-10" />
}
