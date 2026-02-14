"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCcw, Gamepad2, Ghost, Heart, Star, Zap, Cloud, Sun, Moon, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ICONS = [Ghost, Heart, Star, Zap, Cloud, Sun, Moon, Music] // 8 pairs

type Card = {
    id: number
    icon: any
    isFlipped: boolean
    isMatched: boolean
    color: string
}

const COLORS = [
    "text-pink-500", "text-blue-400", "text-emerald-400", "text-yellow-400",
    "text-purple-400", "text-orange-400", "text-cyan-400", "text-rose-400"
]

export function MemoryMatch() {
    const [cards, setCards] = useState<Card[]>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [moves, setMoves] = useState(0)
    const [matches, setMatches] = useState(0)
    const [isLocking, setIsLocking] = useState(false)

    useEffect(() => {
        initializeGame()
    }, [])

    const initializeGame = () => {
        const shuffledIcons = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({
                id: index,
                icon,
                isFlipped: false,
                isMatched: false,
                color: COLORS[index % COLORS.length] // Assign somewhat predictable colors for visual variety
            }))

        // Randomize colors too
        shuffledIcons.forEach(card => {
            card.color = COLORS[Math.floor(Math.random() * COLORS.length)]
        })

        setCards(shuffledIcons)
        setFlippedCards([])
        setMoves(0)
        setMatches(0)
        setIsLocking(false)
    }

    const handleCardClick = (id: number) => {
        if (isLocking || flippedCards.includes(id) || cards[id].isMatched || cards[id].isFlipped) return

        const newCards = [...cards]
        newCards[id].isFlipped = true
        setCards(newCards)

        const newFlipped = [...flippedCards, id]
        setFlippedCards(newFlipped)

        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1)
            setIsLocking(true)
            checkForMatch(newFlipped, newCards)
        }
    }

    const checkForMatch = (flipped: number[], currentCards: Card[]) => {
        const [first, second] = flipped

        // Compare icon components (using name or reference equality if simple)
        // Since we spread ICONS from the same array, referencing the function matches.
        if (currentCards[first].icon === currentCards[second].icon) {
            setTimeout(() => {
                const newCards = [...currentCards]
                newCards[first].isMatched = true
                newCards[second].isMatched = true
                setCards(newCards)
                setFlippedCards([])
                setMatches(prev => prev + 1)
                setIsLocking(false)
            }, 500)
        } else {
            setTimeout(() => {
                const newCards = [...currentCards]
                newCards[first].isFlipped = false
                newCards[second].isFlipped = false
                setCards(newCards)
                setFlippedCards([])
                setIsLocking(false)
            }, 1000)
        }
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-lg">
            {/* Stats */}
            <div className="flex items-center justify-between w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Moves</span>
                        <span className="text-2xl font-black text-white">{moves}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Matches</span>
                        <span className="text-2xl font-black text-emerald-400">{matches} / 8</span>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={initializeGame}
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3 w-full aspect-square">
                {cards.map((card) => (
                    <div key={card.id} className="relative w-full h-full perspective-1000 group cursor-pointer" onClick={() => handleCardClick(card.id)}>
                        <motion.div
                            initial={false}
                            animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                            transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
                            className="w-full h-full relative preserve-3d"
                        >
                            {/* Front (Hidden) */}
                            <div className="absolute inset-0 w-full h-full bg-slate-800/80 border border-white/10 rounded-xl flex items-center justify-center backface-hidden shadow-lg group-hover:bg-slate-800 transition-colors">
                                <Gamepad2 className="w-6 h-6 text-slate-600 opacity-20" />
                            </div>

                            {/* Back (Revealed) */}
                            <div className={cn(
                                "absolute inset-0 w-full h-full bg-gradient-to-br border border-white/20 rounded-xl flex items-center justify-center backface-hidden shadow-xl rotate-y-180",
                                card.isMatched ? "from-emerald-500/20 to-teal-500/20 border-emerald-500/50" : "from-slate-800 to-slate-900"
                            )}>
                                <card.icon className={cn("w-8 h-8 drop-shadow-md", card.color)} />
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {matches === 8 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl"
                >
                    <div className="bg-slate-900 p-8 rounded-3xl border border-emerald-500/30 flex flex-col items-center gap-4 text-center shadow-2xl">
                        <h2 className="text-3xl font-bold text-white">🎉 Great Job!</h2>
                        <p className="text-slate-400">You cleared the board in {moves} moves.</p>
                        <Button onClick={initializeGame} className="bg-emerald-500 hover:bg-emerald-600 text-white w-full">
                            Play Again
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
