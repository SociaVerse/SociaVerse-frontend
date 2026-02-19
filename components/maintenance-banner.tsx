"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function MaintenanceBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        // Auto-dismiss after 10 seconds if needed, but for "System Upgrade" maybe keep it persistent until dismissed
    }, [])

    if (!isMounted) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -50, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="fixed top-24 left-0 right-0 z-[60] flex justify-center pointer-events-none px-4"
                >
                    <div className="pointer-events-auto bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/20 p-1 pr-3 flex items-center gap-3 max-w-md w-full overflow-hidden relative group">

                        {/* Animated Gradient Border Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Icon Box */}
                        <div className="relative z-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-2.5 shadow-lg shadow-orange-500/20 flex-shrink-0">
                            <Zap className="h-5 w-5 text-white animate-pulse" fill="currentColor" />
                        </div>

                        {/* Text Content */}
                        <div className="relative z-10 flex-1 min-w-0 py-2">
                            <h4 className="text-sm font-bold text-white leading-tight">System Upgrade</h4>
                            <p className="text-xs text-slate-400 truncate">Backend is offline for improvements.</p>
                        </div>

                        {/* Actions */}
                        <div className="relative z-10 flex items-center gap-2 pl-2 border-l border-white/5">
                            <button
                                onClick={() => setIsVisible(false)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
