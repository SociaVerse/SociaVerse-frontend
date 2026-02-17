"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/custom-toast"
import { Check, Loader2, ArrowLeft, Star, Crown } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function SubscribePage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState<string | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

    const plans = [
        {
            id: 'monthly',
            name: 'Monthly',
            price: '$14.99',
            period: '/month',
            description: 'Perfect for getting started',
            features: [
                'Verified Blue Badge',
                'Priority Support',
                'Edit Posted Content',
                'Ad-free Experience'
            ],
            icon: Star,
            color: 'blue'
        },
        {
            id: 'yearly',
            name: 'Yearly',
            price: '$149.99',
            period: '/year',
            description: 'Save 17% with annual billing',
            features: [
                'All Monthly Features',
                'Exclusive Gold Badge',
                'Early Access Features',
                'Profile Highlighting'
            ],
            icon: Crown,
            color: 'yellow',
            popular: true
        }
    ]

    const handleSubscribe = async (planId: string) => {
        setLoading(planId)
        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            const token = localStorage.getItem('sociaverse_token')
            const formData = new FormData()
            formData.append('is_premium', 'true')
            formData.append('is_verified', 'true')
            // In a real app, we would send the plan ID to the backend

            const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/users/me/', {
                method: 'PATCH',
                headers: { 'Authorization': `Token ${token}` },
                body: formData
            })

            if (response.ok) {
                toast({
                    title: "Welcome to SociaVerse Verified!",
                    message: `You have successfully subscribed to the ${planId} plan.`,
                    type: "success"
                })
                router.push('/settings/verified')
            } else {
                throw new Error("Failed to subscribe")
            }
        } catch (error) {
            toast({ title: "Error", message: "Payment failed. Please try again.", type: "error" })
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-700">

            {/* Header */}
            <div className="mb-12">
                <Link href="/settings/verified" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Overview
                </Link>
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Choose Your <span className="text-blue-500">Plan</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-xl mx-auto">
                        Unlock the full potential of SociaVerse with a verified membership.
                    </p>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: plan.id === 'yearly' ? 0.1 : 0 }}
                        className={`relative p-8 rounded-3xl border transition-all duration-300 ${selectedPlan === plan.id
                            ? 'bg-slate-900/80 border-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.02]'
                            : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
                            }`}
                        onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                                <p className="text-slate-400">{plan.description}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${plan.id === 'yearly' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                <plan.icon className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="mb-8">
                            <span className="text-5xl font-bold text-white">{plan.price}</span>
                            <span className="text-slate-500">{plan.period}</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-slate-300">
                                    <div className="p-1 rounded-full bg-green-500/10 text-green-500">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleSubscribe(plan.id)
                                }}
                                disabled={loading !== null}
                                className={`w-full h-12 text-lg font-semibold transition-all ${plan.id === 'yearly'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20'
                                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                                    }`}
                            >
                                {loading === plan.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Subscribe Now"
                                )}
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <p className="text-center text-slate-500 mt-12 text-sm">
                Secure payment processed by Stripe. You can cancel at any time.
            </p>
        </div>
    )
}
