"use client"

import Link from "next/link"
import { Calendar, ShoppingBag, Users, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
    { href: "/events", label: "Events", icon: Calendar, color: "text-blue-400" },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag, color: "text-emerald-400" },
    { href: "/community", label: "Community", icon: Users, color: "text-violet-400" },
    { href: "/campus", label: "Campus", icon: GraduationCap, color: "text-amber-400" },
]

export function QuickNav() {
    return (
        <div className="w-full max-w-md mx-auto mt-8">
            <p className="text-slate-500 text-xs text-center mb-3 uppercase tracking-wider font-semibold">Quick Access</p>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-4 justify-center">
                {navItems.map((item, index) => (
                    <Link key={item.href} href={item.href}>
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center justify-center w-24 h-24 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-sm hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer"
                        >
                            <item.icon className={`w-8 h-8 ${item.color} mb-2`} />
                            <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
