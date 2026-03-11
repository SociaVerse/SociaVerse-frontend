"use client"

import { MarketplaceProvider } from "@/context/marketplace-context"
import { ToastProvider } from "@/components/ui/custom-toast"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Heart, Store } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navItems = [
        { name: "Explore", href: "/marketplace", icon: ShoppingBag },
        { name: "Saved", href: "/marketplace/saved", icon: Heart },
        { name: "My Shop", href: "/marketplace/dashboard", icon: Store },
    ]

    // Hide tabs on the detail page (any path with an ID)
    const isDetailPage = pathname.match(/^\/marketplace\/\d+$/)

    return (
        <MarketplaceProvider>
            <ToastProvider>
                <div className="relative min-h-screen bg-slate-950 pt-[88px]">
                    {/* Fixed Top Navigation Tabs - Hidden for V2 Coming Soon */}
                    {false && !isDetailPage && (
                        <div className="sticky top-[88px] z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
                            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                                <div className="flex h-14 items-center flex-nowrap overflow-x-auto scrollbar-hide gap-1 md:gap-2">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all flex-shrink-0",
                                                    isActive
                                                        ? "bg-slate-100/10 text-white"
                                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                                )}
                                            >
                                                <item.icon className={cn("w-4 h-4", isActive && "text-blue-400")} />
                                                {item.name}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <main className={cn("flex-1", !isDetailPage && "pt-6")}>
                        {children}
                    </main>
                </div>
            </ToastProvider>
        </MarketplaceProvider>
    )
}
