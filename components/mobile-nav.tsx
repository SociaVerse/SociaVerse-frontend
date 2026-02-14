"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Search, PlusSquare, MessageCircle, Store, Zap, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const pathname = usePathname()
    // const { isAuthenticated, user } = useAuth() // Not needed if profile is removed

    // Hide on auth pages or create page
    const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/create"
    if (isAuthPage) return null

    const navItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/explore", icon: Search, label: "Explore" },
        { href: "/create", icon: PlusSquare, label: "Create", isMain: true }, // Fixed link to /create
        { href: "/chat", icon: MessageCircle, label: "Chat" },
        { href: "/marketplace", icon: Store, label: "Market" }, // Replaced Profile with Market
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
                                    )}
                                    strokeWidth={isActive ? 3 : 2}
                                />
                                {item.href === "/chat" && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-black"></span>
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

