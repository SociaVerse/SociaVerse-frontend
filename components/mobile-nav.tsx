"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Search, PlusSquare, MessageCircle, User, Zap, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const pathname = usePathname()
    const { isAuthenticated, user } = useAuth() // Assuming we can get user for profile pic

    // Hide on auth pages
    const isAuthPage = pathname === "/login" || pathname === "/signup"
    if (isAuthPage) return null

    const navItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/explore", icon: Search, label: "Explore" }, // Changed Globe to Search for Insta feel
        { href: "/marketplace", icon: PlusSquare, label: "Create", isMain: true }, // Changed Zap to PlusSquare
        { href: "/chat", icon: MessageCircle, label: "Chat" },
        { href: "/profile", icon: User, label: "Profile" },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-black border-t border-white/10 pb-safe pt-2 px-2">
            <div className="flex items-center justify-around w-full h-12">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link key={item.href} href={item.href} className="flex-1 flex justify-center items-center h-full">
                            <div className="relative p-2">
                                <Icon
                                    className={cn(
                                        "w-[26px] h-[26px] transition-all duration-200",
                                        isActive ? "text-white" : "text-slate-500",
                                        // Simple scale effect on tap
                                    )}
                                    // Simulating filled state by strokewidth or logic if using filled icons
                                    strokeWidth={isActive ? 3 : 2}
                                />
                                {item.href === "/chat" && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-black"></span>
                                )}
                                {item.label === "Profile" && isActive && (
                                    <motion.div
                                        layoutId="profile-active"
                                        className="absolute -bottom-2 w-1 h-1 bg-white rounded-full left-1/2 -translate-x-1/2"
                                    />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

// Mock auth hook usage if needed, otherwise standard import
import { useAuth } from "@/components/auth-provider"

