"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, CheckCircle2, Shield, Zap, Globe, MessageCircle, Rocket, GraduationCap } from "lucide-react"

// Floating icons component for background
const FloatingIcons = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[
                { Icon: Shield, delay: 0, x: "20%", y: "30%" },
                { Icon: Zap, delay: 2, x: "80%", y: "20%" },
                { Icon: Globe, delay: 4, x: "15%", y: "70%" },
                { Icon: MessageCircle, delay: 1, x: "75%", y: "80%" },
            ].map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0.3, 0.6, 0.3], y: [-10, 10, -10] }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        delay: item.delay,
                        ease: "easeInOut",
                    }}
                    className={`absolute text-white/5`}
                    style={{ left: item.x, top: item.y }}
                >
                    <item.Icon className="w-16 h-16 md:w-32 md:h-32" />
                </motion.div>
            ))}
        </div>
    )
}

const CountdownTimer = ({ itemVariants }: { itemVariants: import("framer-motion").Variants }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date("2026-05-12T00:00:00") - +new Date()
        if (difference > 0) {
            return {
                Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                Mins: Math.floor((difference / 1000 / 60) % 60),
                Secs: Math.floor((difference / 1000) % 60)
            }
        }
        return { Days: 0, Hours: 0, Mins: 0, Secs: 0 }
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    if (!mounted) return (
        <motion.div variants={itemVariants} className="flex justify-center gap-3 sm:gap-4 mt-8 mb-2">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="bg-slate-900/40 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl animate-pulse"></div>
                    <div className="w-8 h-3 bg-slate-800/50 mt-3 rounded animate-pulse"></div>
                </div>
            ))}
        </motion.div>
    )

    return (
        <motion.div variants={itemVariants} className="flex justify-center gap-3 sm:gap-4 mt-8 mb-2">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.1)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 z-0"></div>

                        <span className="relative z-10 text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                            {value.toString().padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-3">
                        {unit}
                    </span>
                </div>
            ))}
        </motion.div>
    )
}

export default function JoinWaitlist() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'survey' | 'success' | 'already_registered'>('idle')
    const [formData, setFormData] = useState({ name: "", email: "" })
    const [university, setUniversity] = useState("")
    const [entryId, setEntryId] = useState<number | null>(null)
    const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false)
    const [focusedInput, setFocusedInput] = useState<string | null>(null)

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage(null)
        setWaitlistStatus('idle')

        const allowedDomains = [
            "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "live.com",
            "msn.com", "proton.me", "protonmail.com", "pm.me", "yahoo.com", "ymail.com",
            "rocketmail.com", "icloud.com", "me.com", "mac.com", "gmx.com", "gmx.de",
            "web.de", "mail.com", "zoho.com", "aol.com", "fastmail.com", "tutanota.com",
            "rediffmail.com"
        ]

        const email = formData.email.toLowerCase().trim()
        const domain = email.split('@')[1]

        if (!domain || !allowedDomains.includes(domain)) {
            setErrorMessage("Please use a valid personal email provider (e.g., Gmail, Outlook, Yahoo) to join the waitlist.")
            setIsSubmitting(false)
            return
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
            const response = await fetch(`${apiUrl}/api/waitlist/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                // Check if it's the "already registered" error from the backend
                if (data.error && data.error.includes("already registered")) {
                    setWaitlistStatus('already_registered')
                } else {
                    setErrorMessage(data.error || "Something went wrong. Please try again.")
                }
                setIsSubmitting(false)
                return
            }

            // Success
            if (data.id) {
                setEntryId(data.id)
            }
            setIsSubmitting(false)
            setWaitlistStatus('survey')
        } catch (error) {
            setErrorMessage("Network error. Please try again later.")
            setIsSubmitting(false)
        }
    }

    const handleSurveySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!university.trim() || !entryId) {
            setWaitlistStatus('success')
            return
        }

        setIsSubmittingSurvey(true)
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
            const response = await fetch(`${apiUrl}/api/waitlist/survey/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: entryId,
                    university: university,
                }),
            })

            const data = await response.json()
            console.log("Survey upload response:", data)

            if (!response.ok) {
                console.error("Failed to save university data:", data.error)
            }

            setIsSubmittingSurvey(false)
            setWaitlistStatus('success')
        } catch (error) {
            console.error("Survey submission network error:", error)
            setIsSubmittingSurvey(false)
            setWaitlistStatus('success')
        }
    }

    // Animation variants
    const containerVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const itemVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden pt-36 md:pt-40 pb-10">

            {/* Dynamic Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/10 blur-[150px] mix-blend-screen pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] rounded-full bg-indigo-600/10 blur-[100px] mix-blend-screen pointer-events-none animate-pulse-slow" style={{ animationDelay: '4s' }} />

            {/* Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay"></div>

            <FloatingIcons />

            <div className="z-10 w-full max-w-[440px] px-6 flex flex-col items-center">

                {/* Header Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="text-center mb-10 w-full"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md text-blue-400 px-4 py-1.5 rounded-full mb-6 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>

                        <span className="text-xs font-bold tracking-widest uppercase">Limited Early Access</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-[1.1]">
                        {"Unlock the".split("").map((char, index) => (
                            <motion.span
                                key={`text1-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.04 + 0.3 }}
                                className="inline-block"
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                        <br />
                        {"Future".split("").map((char, index) => (
                            <motion.span
                                key={`text2-${index}`}
                                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.5, delay: ("Unlock the".length + index) * 0.04 + 0.3 }}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 inline-block"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-slate-400 text-[1.1rem] leading-relaxed max-w-sm mx-auto">
                        Reserve your spot for the next evolution in social connectivity.
                    </motion.p>

                    <CountdownTimer itemVariants={itemVariants} />
                </motion.div>

                {/* Form Container */}
                <div className="w-full relative perspective-1000">
                    <AnimatePresence mode="wait">
                        {waitlistStatus === 'idle' && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, rotateX: 10, y: 20 }}
                                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                                className="relative p-[1px] md:p-[2px] rounded-[2rem] overflow-hidden shadow-2xl group/card"
                            >
                                {/* Rotating Conic Gradient Border */}
                                <div className="absolute inset-[-100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_240deg,rgba(59,130,246,1)_360deg)] pointer-events-none opacity-80" />
                                <div className="absolute inset-[-100%] animate-[spin_8s_linear_infinite_reverse] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_240deg,rgba(168,85,247,1)_360deg)] pointer-events-none opacity-80" />

                                <form
                                    onSubmit={handleSubmit}
                                    className="bg-slate-900/95 backdrop-blur-3xl p-8 sm:p-10 rounded-[calc(2rem-1px)] md:rounded-[calc(2rem-2px)] relative z-10 w-full h-full"
                                >

                                    <div className="space-y-6 relative z-10">

                                        {/* Name Input */}
                                        <div
                                            className="space-y-2 relative group/input"
                                            onMouseMove={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                (e.currentTarget as HTMLDivElement).style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                                                (e.currentTarget as HTMLDivElement).style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                                            }}
                                        >
                                            <label htmlFor="name" className="text-xs font-bold tracking-wide text-slate-400 uppercase ml-1 pointer-events-none">Full Name</label>
                                            <div className="relative p-[1px] rounded-[17px] overflow-hidden bg-slate-800/50 border border-slate-800/80 group-hover/input:border-transparent transition-colors duration-300">
                                                {/* Spotlight effect */}
                                                <div
                                                    className="absolute inset-0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
                                                    style={{
                                                        background: `radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.4), transparent 40%)`
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    id="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    onFocus={() => setFocusedInput('name')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className={`w-full bg-slate-950/80 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none transition-all font-medium text-[15px] focus:bg-slate-900 relative z-10 ${focusedInput === 'name' ? 'shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50' : ''}`}
                                                    placeholder="Your Name"
                                                />
                                            </div>
                                        </div>

                                        {/* Email Input and Error Group */}
                                        <div className="flex flex-col">
                                            <div
                                                className="space-y-2 relative group/input"
                                                onMouseMove={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    (e.currentTarget as HTMLDivElement).style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                                                    (e.currentTarget as HTMLDivElement).style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                                                }}
                                            >
                                                <label htmlFor="email" className="text-xs font-bold tracking-wide text-slate-400 uppercase ml-1 pointer-events-none">Email Address</label>
                                                <div className="relative p-[1px] rounded-[17px] overflow-hidden bg-slate-800/50 border border-slate-800/80 group-hover/input:border-transparent transition-colors duration-300">
                                                    {/* Spotlight effect */}
                                                    <div
                                                        className="absolute inset-0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
                                                        style={{
                                                            background: `radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.4), transparent 40%)`
                                                        }}
                                                    />
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        onFocus={() => setFocusedInput('email')}
                                                        onBlur={() => setFocusedInput(null)}
                                                        className={`w-full bg-slate-950/80 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none transition-all font-medium text-[15px] focus:bg-slate-900 relative z-10 ${focusedInput === 'email' ? 'shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50' : ''}`}
                                                        placeholder="Your Email"
                                                    />
                                                </div>
                                            </div>

                                            {/* Error Message Display */}
                                            <AnimatePresence>
                                                {errorMessage && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-start sm:items-center gap-2">
                                                            <Shield className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
                                                            <p className="flex-1">{errorMessage}</p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Submit Button */}
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full mt-8 bg-white text-black font-bold text-[15px] tracking-wide rounded-2xl px-4 py-4 md:py-5 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                                        >
                                            <span className="relative z-10">{isSubmitting ? 'Securing Position...' : 'Secure My Spot'}</span>
                                            {!isSubmitting && (
                                                <motion.div
                                                    initial={{ x: 0 }}
                                                    animate={{ x: [0, 5, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                                    className="relative z-10 block"
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </motion.div>
                                            )}

                                            {/* Advanced Button Shine */}
                                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-blue-50/50 to-transparent skew-x-12 z-0"></div>
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {waitlistStatus === 'survey' && (
                            <motion.div
                                key="survey"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                className="relative p-[1px] md:p-[2px] rounded-[2rem] overflow-hidden shadow-2xl group/card max-w-md w-full mx-auto"
                            >
                                {/* Rotating Conic Gradient Border for Survey */}
                                <div className="absolute inset-[-100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_240deg,rgba(168,85,247,1)_360deg)] pointer-events-none opacity-80" />
                                <div className="absolute inset-[-100%] animate-[spin_8s_linear_infinite_reverse] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_240deg,rgba(59,130,246,1)_360deg)] pointer-events-none opacity-80" />

                                <div className="bg-slate-900/95 backdrop-blur-3xl p-8 sm:p-10 rounded-[calc(2rem-1px)] md:rounded-[calc(2rem-2px)] relative z-10 w-full h-full text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 15, delay: 0.2 }}
                                        className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] rotate-3"
                                    >
                                        <GraduationCap className="w-10 h-10 text-indigo-400 -rotate-3" />
                                    </motion.div>

                                    <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-3 tracking-tight">You're on the list!</h3>
                                    <p className="text-slate-400 leading-relaxed max-w-[280px] mx-auto text-[15px] mb-8">
                                        Want to bump yourself up the queue? Tell us your campus to unlock <span className="text-purple-400 font-semibold">VIP early access</span>.
                                    </p>

                                    <form onSubmit={handleSurveySubmit} className="space-y-5 text-left">
                                        <div
                                            className="space-y-2 relative group/input"
                                            onMouseMove={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                (e.currentTarget as HTMLDivElement).style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                                                (e.currentTarget as HTMLDivElement).style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                                            }}
                                        >
                                            <label htmlFor="university" className="text-xs font-bold tracking-wide text-slate-400 uppercase ml-1 pointer-events-none text-left w-full block">University / Campus (Optional)</label>
                                            <div className="relative p-[1px] rounded-[17px] overflow-hidden bg-slate-800/50 border border-slate-800/80 group-hover/input:border-transparent transition-colors duration-300">
                                                <div
                                                    className="absolute inset-0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
                                                    style={{ background: `radial-gradient(120px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(168, 85, 247, 0.4), transparent 40%)` }}
                                                />
                                                <input
                                                    type="text"
                                                    id="university"
                                                    value={university}
                                                    onChange={(e) => setUniversity(e.target.value)}
                                                    onFocus={() => setFocusedInput('university')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className={`w-full bg-slate-950/80 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none transition-all font-medium text-[15px] focus:bg-slate-900 relative z-10 ${focusedInput === 'university' ? 'shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/50' : ''}`}
                                                    placeholder="e.g. Stanford University"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setWaitlistStatus('success')}
                                                className="px-4 py-4 rounded-2xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all text-[15px] sm:w-1/3 w-full"
                                            >
                                                Skip
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmittingSurvey}
                                                className="px-4 py-4 rounded-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white transition-all text-[15px] sm:w-2/3 w-full shadow-lg shadow-purple-900/30 disabled:opacity-70 flex justify-center items-center relative overflow-hidden group"
                                            >
                                                <span className="relative z-10">{isSubmittingSurvey ? 'Saving...' : 'Boost My Spot! 🚀'}</span>
                                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {waitlistStatus === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                                className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-10 rounded-[2rem] text-center backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.2)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>

                                <motion.div
                                    initial={{ scale: 0, y: 50, opacity: 0 }}
                                    animate={{ scale: 1, y: 0, opacity: 1 }}
                                    transition={{ type: "spring", damping: 15, delay: 0.1 }}
                                    className="relative w-28 h-28 mx-auto mb-8"
                                >
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                                    <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] relative z-10 overflow-hidden group">

                                        {/* Rocket Launch Animation */}
                                        <div className="w-[96%] h-[96%] bg-slate-950 rounded-full flex items-center justify-center relative">

                                            {/* Exhaust trails */}
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                className="absolute bottom-4 w-1 bg-gradient-to-t from-orange-500 to-transparent blur-sm rounded-full"
                                            />
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: ["0%", "120%", "0%"], opacity: [0, 1, 0] }}
                                                transition={{ duration: 1.2, delay: 0.3, repeat: Infinity, ease: "linear" }}
                                                className="absolute bottom-2 -left-2 w-1 bg-gradient-to-t from-red-500 to-transparent blur-sm rounded-full"
                                            />
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: ["0%", "80%", "0%"], opacity: [0, 1, 0] }}
                                                transition={{ duration: 1.8, delay: 0.1, repeat: Infinity, ease: "linear" }}
                                                className="absolute bottom-3 -right-2 w-1 bg-gradient-to-t from-amber-400 to-transparent blur-sm rounded-full"
                                            />

                                            {/* The Rocket */}
                                            <motion.div
                                                animate={{ y: [-2, 2, -2] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <Rocket className="w-12 h-12 text-indigo-400 -translate-y-2 group-hover:-translate-y-4 transition-transform duration-300" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>

                                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-3 tracking-tight">Access Secured.</h3>
                                <p className="text-indigo-200/80 leading-relaxed max-w-[280px] mx-auto text-[15px] font-medium">
                                    Welcome to the SociaVerse, {formData.name || 'future member'}. We've dispatched a transmission to your inbox.
                                </p>
                            </motion.div>
                        )}

                        {waitlistStatus === 'already_registered' && (
                            <motion.div
                                key="already_registered"
                                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                                className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/30 p-10 rounded-[2rem] text-center backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, delay: 0.1 }}
                                    className="w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/50 relative overflow-hidden group"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-[conic-gradient(transparent_0deg,transparent_270deg,rgba(245,158,11,0.4)_360deg)]"
                                    />
                                    <div className="w-[90%] h-[90%] bg-slate-950 rounded-full flex items-center justify-center relative z-10">
                                        <Globe className="w-10 h-10 text-amber-400" />
                                    </div>
                                </motion.div>

                                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 mb-3 tracking-tight">You're Already On Radar</h3>
                                <p className="text-amber-200/80 leading-relaxed max-w-[280px] mx-auto text-[15px] font-medium">
                                    Your coordinates ({formData.email}) are already in our system. Stand by for launch sequences.
                                </p>

                                <button
                                    onClick={() => setWaitlistStatus('idle')}
                                    className="mt-8 text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                                >
                                    Register another email
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-8 flex flex-col items-center gap-2"
                >
                    <p className="text-center text-slate-500/80 text-xs font-medium uppercase tracking-widest">
                        Join the revolution
                    </p>
                    <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-slate-600/50 to-transparent"></div>
                </motion.div>
            </div>
        </div>
    )
}
