"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MatchButtonProps {
    onMatch: () => void
    isMatching: boolean
}

export function MatchButton({ onMatch, isMatching }: MatchButtonProps) {
    return (
        <div className="relative group">
            {/* Outer Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

            <button
                onClick={onMatch}
                disabled={isMatching}
                className={cn(
                    "relative w-64 h-64 rounded-full flex flex-col items-center justify-center bg-slate-900 border-4 border-slate-800 shadow-2xl transition-all duration-300 transform",
                    "hover:scale-105 hover:border-violet-500/50 hover:shadow-violet-500/20",
                    isMatching ? "cursor-not-allowed opacity-90" : "cursor-pointer"
                )}
            >
                {/* Inner Ring Animation */}
                {!isMatching && (
                    <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]" />
                )}

                <div className="z-10 flex flex-col items-center space-y-4">
                    {isMatching ? (
                        <>
                            <Loader2 className="w-16 h-16 text-violet-500 animate-spin" />
                            <span className="text-violet-300 font-medium animate-pulse">Finding Peer...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all">
                                <Zap className="w-10 h-10 text-white fill-current" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-white tracking-tight">Start Networking</h3>
                                <p className="text-slate-400 text-xs mt-1 px-4">Tap to connect anonymously</p>
                            </div>
                        </>
                    )}
                </div>
            </button>
        </div>
    )
}
