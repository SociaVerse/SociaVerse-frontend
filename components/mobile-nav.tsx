"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Search, MessageCircle, Store, Zap, Globe, Rocket, Users, Calendar, BookOpen, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    // const { isAuthenticated, user } = useAuth() // Not needed if profile is removed

    // Hide on auth pages or create page or when in a specific chat
    const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/create"
    const isChatOpen = pathname === "/chat" && searchParams.has("cid")

    const isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true'

    if (isAuthPage || isChatOpen) return null

    const regularNavItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/explore", icon: Search, label: "Explore" },
        { href: "/studyhub", icon: BookOpen, label: "Study Hub" },
        { href: "/chat", icon: MessageCircle, label: "Chat" },
        { href: "/events", icon: Calendar, label: "Events" },
    ]

    const waitlistNavItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/features", icon: Zap, label: "Features", isMain: true },
        { href: "/team", icon: Users, label: "Team" },
        { href: "/join-waitlist", icon: Rocket, label: "Join" },
    ]

    const navItems = isWaitlistMode ? waitlistNavItems : regularNavItems

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
            <div className="bg-slate-900/80 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] pb-safe pt-1">
                <div className="flex items-center justify-around w-full h-14">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                        const Icon = item.icon

                        return (
                            <Link key={item.href} href={item.href} className="flex-1 flex flex-col justify-center items-center h-full group">
                                <div className="relative p-2 transition-all duration-300">
                                    <div className={cn(
                                        "absolute inset-0 rounded-xl transition-all duration-300 opacity-0 scale-50",
                                        isActive ? "bg-white/10 opacity-100 scale-100" : "group-hover:bg-white/5 group-hover:opacity-50 group-hover:scale-90"
                                    )} />
                                    <Icon
                                        className={cn(
                                            "relative z-10 w-6 h-6 transition-all duration-300",
                                            isActive ? "text-white -translate-y-0.5" : "text-slate-400 group-hover:text-slate-200",
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {!isWaitlistMode && item.href === "/chat" && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-black z-20"></span>
                                    )}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navIndicator"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                                        />
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// Mock auth hook usage if needed, otherwise standard import
import { useAuth } from "@/components/auth-provider"

