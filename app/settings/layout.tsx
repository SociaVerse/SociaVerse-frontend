
"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
    User, Settings, Shield, Bell, LogOut, ChevronRight, BadgeCheck
} from "lucide-react"

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, logout, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    if (isLoading) return null

    if (!isAuthenticated) {
        router.push("/login")
        return null
    }

    const navigation = [
        { name: 'Edit Profile', href: '/settings/profile', icon: User },
        { name: 'Privacy & Safety', href: '/settings/privacy', icon: Shield },
        { name: 'SociaVerse Verified', href: '/settings/verified', icon: BadgeCheck },
        { name: 'Account', href: '/settings/account', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 pt-20 pb-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden sticky top-24">
                            <div className="p-4 border-b border-slate-800">
                                <h2 className="font-bold text-xl text-white">Settings</h2>
                            </div>
                            <nav className="p-2 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                                ? "bg-blue-500/10 text-blue-400 font-medium"
                                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="flex-1">{item.name}</span>
                                            {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                                        </Link>
                                    )
                                })}
                            </nav>

                            <div className="p-2 mt-2 border-t border-slate-800">
                                <button
                                    onClick={() => logout()}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Log Out</span>
                                </button>
                            </div>

                            {/* Branding Footer */}
                            <div className="p-6 text-center border-t border-slate-800 bg-slate-950/30">
                                <h3 className="font-bold text-lg text-white mb-1">SociaVerse</h3>
                                <p className="text-xs text-slate-500">
                                    © 2026 SociaVerse Inc.<br />
                                    Building the future of connection.
                                </p>
                                <div className="flex justify-center gap-4 mt-4 text-xs text-slate-600">
                                    <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
                                    <Link href="/terms" className="hover:text-slate-400">Terms</Link>
                                    <Link href="/cookies" className="hover:text-slate-400">Cookies</Link>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 min-h-[600px]">
                            {children}
                        </div>
                    </main>

                </div>
            </div>
        </div>
    )
}
