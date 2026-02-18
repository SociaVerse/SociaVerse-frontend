"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function MaintenanceBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-[60] overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-amber-600/90 via-orange-500/90 to-amber-600/90 backdrop-blur-md">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="bg-white/20 p-1.5 rounded-full animate-pulse">
                                    <AlertTriangle className="h-3.5 w-3.5 text-white" />
                                </div>
                                <p className="text-xs md:text-sm font-medium tracking-wide">
                                    <span className="font-bold text-white mr-1.5">System Upgrade:</span>
                                    Backend services are currently offline for improvements. Some features may be paused.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all duration-200"
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
