
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/custom-toast"
import { BadgeCheck, ShieldCheck, Zap, Star, Check, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function VerifiedPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        if (isAuthenticated) {
            fetchVerificationStatus()
        }
    }, [isAuthenticated])

    const fetchVerificationStatus = async () => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/users/me/', {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                // Assuming is_premium is the field for paid verification
                // Or is_verified if we repurposed it. Backend model has both.
                // Let's use is_premium for paid verification logic here distinct from email verification.
                setIsVerified(data.is_premium)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setFetching(false)
        }
    }

    // Removed handleSubscribe logic

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in fade-in duration-700">

            {/* Hero Section */}
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-4 ring-1 ring-blue-500/50 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]"
                >
                    <BadgeCheck className="w-16 h-16 text-blue-500" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    SociaVerse <span className="text-blue-500">Verified</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
                    Elevate your presence with a verified badge, enhanced protection, and direct support.
                </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <BenefitCard
                    icon={BadgeCheck}
                    title="Verified Badge"
                    description="Get the exclusive blue checkmark on your profile to show the world you're the real deal."
                />
                <BenefitCard
                    icon={ShieldCheck}
                    title="Waitlist Priority"
                    description="Jump the line for new features and get priority access to beta releases."
                />
                <BenefitCard
                    icon={Zap}
                    title="Exclusive Features"
                    description="Access to premium stickers, custom app icons, and high-quality video uploads."
                />
            </div>

            {/* Pricing Card */}
            <div className="relative max-w-md mx-auto mt-12 p-8 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

                <div className="text-center mb-8">
                    <h3 className="text-lg font-medium text-slate-400 uppercase tracking-widest mb-2">Membership</h3>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold text-white">Choose Plan</span>
                    </div>
                </div>

                <ul className="space-y-4 mb-8">
                    {["Verified Badge", "Proactive Account Protection", "Direct Support", "Exclusive Stickers"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-slate-300">
                            <div className="p-1 rounded-full bg-green-500/10 text-green-500">
                                <Check className="w-4 h-4" />
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>

                {isVerified ? (
                    <Button className="w-full h-12 text-lg font-semibold bg-green-600/20 text-green-500 hover:bg-green-600/30 border border-green-500/50 cursor-default">
                        <Check className="w-5 h-5 mr-2" /> Active Member
                    </Button>
                ) : (
                    <Link href="/settings/verified/subscribe" className="w-full block">
                        <Button
                            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]"
                        >
                            View Plans
                        </Button>
                    </Link>
                )}

                <p className="text-xs text-center text-slate-500 mt-4">
                    Cancel anytime. Terms and conditions apply.
                </p>
            </div>

        </div>
    )
}

function BenefitCard({ icon: Icon, title, description }: any) {
    return (
        <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:bg-slate-900/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 text-blue-400">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </div>
    )
}
