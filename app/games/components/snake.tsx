"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Constants
const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

type Point = { x: number; y: number }
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

export function SnakeGame() {
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }])
    const [food, setFood] = useState<Point>({ x: 15, y: 15 })
    const [direction, setDirection] = useState<Direction>("RIGHT")
    const [isPlaying, setIsPlaying] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)

    // Use refs for mutable state in the game loop to avoid dependency staleness
    const directionRef = useRef<Direction>("RIGHT")
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

    const generateFood = useCallback((): Point => {
        return {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        }
    }, [])

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }])
        setFood(generateFood())
        setDirection("RIGHT")
        directionRef.current = "RIGHT"
        setScore(0)
        setIsGameOver(false)
        setIsPlaying(true)
    }

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
                if (directionRef.current !== "DOWN") directionRef.current = "UP"
                break
            case "ArrowDown":
                if (directionRef.current !== "UP") directionRef.current = "DOWN"
                break
            case "ArrowLeft":
                if (directionRef.current !== "RIGHT") directionRef.current = "LEFT"
                break
            case "ArrowRight":
                if (directionRef.current !== "LEFT") directionRef.current = "RIGHT"
                break
        }
    }, [])

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleKeyDown])

    useEffect(() => {
        if (isPlaying && !isGameOver) {
            gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED)
        } else {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current)
        }
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current)
        }
    }, [isPlaying, isGameOver, snake]) // snake dependency updates the closure

    const moveSnake = () => {
        setSnake(prevSnake => {
            const head = { ...prevSnake[0] }
            const currentDir = directionRef.current

            switch (currentDir) {
                case "UP": head.y -= 1; break;
                case "DOWN": head.y += 1; break;
                case "LEFT": head.x -= 1; break;
                case "RIGHT": head.x += 1; break;
            }

            // Check collisions
            if (
                head.x < 0 || head.x >= GRID_SIZE ||
                head.y < 0 || head.y >= GRID_SIZE ||
                prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
            ) {
                setIsGameOver(true)
                setIsPlaying(false)
                if (score > highScore) setHighScore(score)
                return prevSnake
            }

            const newSnake = [head, ...prevSnake]

            // Eat Food
            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 10)
                setFood(generateFood())
            } else {
                newSnake.pop()
            }

            return newSnake
        })
    }

    // Touch Controls
    const changeDirection = (dir: Direction) => {
        if (dir === "UP" && directionRef.current !== "DOWN") directionRef.current = "UP"
        if (dir === "DOWN" && directionRef.current !== "UP") directionRef.current = "DOWN"
        if (dir === "LEFT" && directionRef.current !== "RIGHT") directionRef.current = "LEFT"
        if (dir === "RIGHT" && directionRef.current !== "LEFT") directionRef.current = "RIGHT"
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Stats */}
            <div className="flex items-center justify-between w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Score</span>
                    <span className="text-2xl font-black text-white">{score}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Best</span>
                    <span className="text-2xl font-black text-emerald-400">{highScore}</span>
                </div>
            </div>

            {/* Game Board */}
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1" style={{ width: 300, height: 300 }}>
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const x = i % GRID_SIZE
                    const y = Math.floor(i / GRID_SIZE)
                    const isSnakeHead = snake[0].x === x && snake[0].y === y
                    const isSnakeBody = snake.some((s, idx) => idx > 0 && s.x === x && s.y === y)
                    const isFood = food.x === x && food.y === y

                    return (
                        <div
                            key={i}
                            className="absolute"
                            style={{
                                width: '5%',
                                height: '5%',
                                left: `${x * 5}%`,
                                top: `${y * 5}%`
                            }}
                        >
                            {isSnakeHead && (
                                <div className="absolute inset-0.5 bg-emerald-400 rounded-sm z-20 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                            )}
                            {isSnakeBody && (
                                <div className="absolute inset-0.5 bg-emerald-600/80 rounded-sm z-10" />
                            )}
                            {isFood && (
                                <div className="absolute inset-0.5 bg-pink-500 rounded-full animate-pulse z-20 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                            )}
                            <div className="absolute inset-0 border border-white/5 opacity-20" />
                        </div>
                    )
                })}

                {/* Overlays */}
                {!isPlaying && !isGameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30">
                        <Button onClick={resetGame} size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2">
                            <Play className="w-5 h-5 fill-current" /> Start Game
                        </Button>
                    </div>
                )}
                {isGameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-30">
                        <div className="flex flex-col items-center gap-4 p-6 text-center">
                            <div className="p-3 bg-red-500/20 text-red-500 rounded-full mb-2">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Game Over</h2>
                            <p className="text-slate-400 mb-2">Score: <span className="text-white font-bold">{score}</span></p>
                            <Button onClick={resetGame} className="bg-white text-slate-900 hover:bg-slate-200 font-bold">
                                Try Again
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Controls */}
            <div className="grid grid-cols-3 gap-2 md:hidden">
                <div />
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10" onPointerDown={() => changeDirection("UP")}><ArrowUp className="w-6 h-6" /></Button>
                <div />
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10" onPointerDown={() => changeDirection("LEFT")}><ArrowLeft className="w-6 h-6" /></Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10" onPointerDown={() => changeDirection("DOWN")}><ArrowDown className="w-6 h-6" /></Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10" onPointerDown={() => changeDirection("RIGHT")}><ArrowRight className="w-6 h-6" /></Button>
            </div>

            <p className="text-xs text-slate-500 mt-4 md:block hidden">
                Use <kbd className="bg-slate-800 px-1 py-0.5 rounded border border-white/10 text-slate-300">Arrow Keys</kbd> to move
            </p>
        </div>
    )
}
