"use client"

import { motion } from "framer-motion"
import { School, Globe } from "lucide-react"

interface VisibilitySelectorProps {
    value: "university" | "global"
    onChange: (value: "university" | "global") => void
    className?: string
}

export function VisibilitySelector({ value, onChange, className = "" }: VisibilitySelectorProps) {
    const options = [
        {
            id: "university" as const,
            label: "Only my university",
            description: "Visible to students in your university",
            icon: School,
            gradient: "from-blue-500 to-indigo-500",
            activeGlow: "shadow-blue-500/25",
            activeBorder: "border-blue-500/50",
            activeBg: "bg-blue-500/10",
        },
        {
            id: "global" as const,
            label: "Global",
            description: "Visible to all universities",
            icon: Globe,
            gradient: "from-emerald-500 to-teal-500",
            activeGlow: "shadow-emerald-500/25",
            activeBorder: "border-emerald-500/50",
            activeBg: "bg-emerald-500/10",
        },
    ]

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-slate-300 mb-2">
                Who can see this?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((option) => {
                    const isActive = value === option.id
                    const Icon = option.icon
                    return (
                        <motion.button
                            key={option.id}
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onChange(option.id)}
                            className={`relative flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-left ${
                                isActive
                                    ? `${option.activeBorder} ${option.activeBg} shadow-lg ${option.activeGlow}`
                                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80"
                            }`}
                        >
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                    isActive
                                        ? `bg-gradient-to-br ${option.gradient} text-white shadow-md`
                                        : "bg-slate-800 text-slate-400"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold transition-colors ${isActive ? "text-white" : "text-slate-300"}`}>
                                    {option.label}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                            </div>
                            {/* Radio indicator */}
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                isActive ? `${option.activeBorder}` : "border-slate-600"
                            }`}>
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${option.gradient}`}
                                    />
                                )}
                            </div>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}
