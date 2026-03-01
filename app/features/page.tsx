"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import {
    LayoutDashboard,
    ShoppingBag,
    CalendarDays,
    Gamepad2,
    Palette,
    EyeOff,
    Sparkles,
    Lock
} from "lucide-react"

const features = [
    {
        icon: <LayoutDashboard className="h-7 w-7 text-blue-400 transition-transform duration-500 group-hover:scale-110" />,
        title: "Dynamic Feed",
        description: "Your personalized hub. Share updates, photos, and connect with what matters most in real-time.",
        color: "from-blue-500/20 to-indigo-500/20 shadow-blue-500/10 hover:shadow-blue-500/25",
        border: "hover:border-blue-500/50"
    },
    {
        icon: <ShoppingBag className="h-7 w-7 text-amber-400 transition-transform duration-500 group-hover:scale-110" />,
        title: "Marketplace",
        description: "A secure ecosystem to buy, sell, and trade. Find what you need directly from your peers.",
        color: "from-amber-500/20 to-orange-500/20 shadow-amber-500/10 hover:shadow-amber-500/25",
        border: "hover:border-amber-500/50"
    },
    {
        icon: <CalendarDays className="h-7 w-7 text-purple-400 transition-transform duration-500 group-hover:scale-110" />,
        title: "Events Hub",
        description: "Never miss out. Discover, host, and RSVP to virtual and real-world campus events seamlessly.",
        color: "from-purple-500/20 to-pink-500/20 shadow-purple-500/10 hover:shadow-purple-500/25",
        border: "hover:border-purple-500/50"
    },
    {
        icon: <Gamepad2 className="h-7 w-7 text-green-400 transition-transform duration-500 group-hover:scale-110" />,
        title: "Game Center",
        description: "Challenge friends to multiplayer games right in the app. Climb the leaderboards and earn bragging rights.",
        color: "from-green-500/20 to-emerald-500/20 shadow-green-500/10 hover:shadow-green-500/25",
        border: "hover:border-green-500/50"
    },
    {
        icon: <Palette className="h-7 w-7 text-rose-400 transition-transform duration-500 group-hover:scale-110" />,
        title: "Custom Profiles",
        description: "Your digital identity, designed by you. Express yourself with customizable themes and showcase your achievements.",
        color: "from-rose-500/20 to-red-500/20 shadow-rose-500/10 hover:shadow-rose-500/25",
        border: "hover:border-rose-500/50"
    }
]
const funnyMessages = [
    "Consulting the oracle...",
    "Bribing the server hamster...",
    "Downloading more RAM...",
    "Reversing the polarity of the neutron flow...",
    "Searching for the 'Any' key...",
    "Counting backwards from infinity...",
    "Untangling headphone wires for extra bandwidth...",
    "Asking ChatGPT for the password...",
    "Trying 'password123'...",
    "Waiting for the stars to align...",
]

export default function FeaturesPage() {
    const [showDecryption, setShowDecryption] = useState(false)
    const [messageIndex, setMessageIndex] = useState(0)

    const calculateTimeLeft = () => {
        const targetDate = new Date("2026-05-12T00:00:00").getTime();
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        if (!showDecryption) return;

        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % funnyMessages.length)
        }, 2500)

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000)

        return () => {
            clearInterval(interval)
            clearInterval(timer)
        }
    }, [showDecryption])

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Gradients (Static for performance) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="container px-4 mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 relative inline-block group">
                            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 relative">
                                Social Potential
                                {/* Micro Shine Effect on Hover (CSS Only) */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-shine transition-all duration-1000 w-1/2 h-full opacity-0 group-hover:opacity-100 pointer-events-none" />
                            </span>
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                        >
                            SociaVerse isn't just another social network. It's a powerhouse of tools designed to supercharge your student life.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-slate-900/40 relative">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                                className={`group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden ${feature.border}`}
                            >
                                {/* Hover Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                <div className="relative z-10">
                                    <div className="mb-6 p-4 rounded-2xl bg-slate-800/50 w-fit border border-slate-700/50 shadow-md group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:bg-slate-800 transition-all duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-slate-200 group-hover:text-white transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* The Secret Riddle Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mt-20 max-w-4xl mx-auto"
                    >
                        <div className="relative p-1 rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800/50 shadow-2xl overflow-hidden group hover:border-violet-500/30 transition-colors duration-500">
                            {/* Scanning line effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/10 to-transparent h-[20%] -translate-y-full group-hover:animate-[scan_3s_ease-in-out_infinite]" />

                            <div className="bg-slate-950/80 backdrop-blur-xl rounded-[1.8rem] p-10 md:p-14 relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="shrink-0 relative">
                                    <div className="absolute inset-0 bg-violet-600 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
                                    <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-violet-500/20 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                                        <EyeOff className="w-10 h-10 text-violet-400 relative z-10 mb-1 transition-transform duration-500 group-hover:scale-110" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-violet-500/70 font-mono relative z-10">Classified</span>
                                    </div>
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="inline-flex items-center space-x-2 text-violet-400 mb-4 font-mono text-sm">
                                        <Sparkles className="w-4 h-4" />
                                        <span>SYSTEM_ANOMALY_DETECTED</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Project: SociaLink</span>
                                    </h3>
                                    <div className="space-y-3 text-slate-400 font-mono text-sm md:text-base leading-relaxed">
                                        <div className="border-l-2 border-violet-500/30 pl-4 py-1 italic relative group/poem cursor-default">
                                            <span className="absolute -left-[2px] top-0 h-full w-[2px] bg-violet-500 shadow-[0_0_10px_purple]"></span>
                                            <p className="group-hover/poem:animate-pulse transition-all">"Born in shadows, bound by time.</p>
                                            <p className="group-hover/poem:animate-pulse transition-all delay-75">No names, no faces—just thoughts intertwine.</p>
                                            <p className="group-hover/poem:animate-pulse transition-all delay-150">Speak your truth before the connection drops...</p>
                                            <p className="group-hover/poem:animate-pulse transition-all delay-200">Are you brave enough when the hourglass stops?"</p>
                                        </div>
                                        <div className="opacity-60 text-xs mt-4 group-hover:opacity-100 transition-opacity duration-700 flex flex-col gap-1">
                                            <span>&gt; STATUS: Encrypted connection protocol ready.</span>
                                            <span>&gt; DECRYPTION: Awaiting valid 256-[bit] key...</span>
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 1 }}
                                            className="pt-6"
                                        >
                                            <Button
                                                onClick={() => setShowDecryption(true)}
                                                variant="outline"
                                                className="bg-violet-950/30 hover:bg-violet-900/50 text-violet-300 border-violet-500/30 hover:border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300 font-mono text-xs uppercase tracking-widest relative overflow-hidden group/btn"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover/btn:animate-shine transition-all duration-1000 w-1/2 h-full opacity-0 group-hover/btn:opacity-100 pointer-events-none" />
                                                <span className="relative z-10 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                                                    Initialize Decryption
                                                </span>
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Interactive CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="container px-4 mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative rounded-[2.5rem] bg-gradient-to-b from-blue-900/40 to-slate-900/40 border border-blue-500/20 p-12 md:p-20 text-center overflow-hidden hover:border-blue-500/40 transition-colors duration-500 shadow-2xl"
                    >
                        {/* Ambient Background */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Ready to <span className="text-blue-400">Join the Verse?</span>
                            </h2>
                            <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
                                Thousands of students are already building their future on SociaVerse. Don't get left behind.
                            </p>

                            {process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true' ? (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                                        <Link href="/join-waitlist">Join the Waitlist</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                                        <Link href="/signup">Get Started Now</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                        <Link href="/login">Already a Member?</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Decryption Overlay Modal */}
            <AnimatePresence>
                {showDecryption && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
                    >
                        {/* Dramatic Lighting Background */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-[500px] h-[500px] bg-violet-600/20 blur-[100px] rounded-full"
                            />
                        </div>

                        <div className="relative w-full max-w-lg bg-slate-900/80 border border-violet-500/30 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(139,92,246,0.15)] text-center overflow-hidden">
                            {/* Scanning line effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/10 to-transparent h-[20%] -translate-y-full animate-[scan_2s_ease-in-out_infinite]" />

                            <Button
                                onClick={() => setShowDecryption(false)}
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 text-slate-500 hover:text-white rounded-full hover:bg-slate-800 z-10"
                            >
                                <X className="w-5 h-5" />
                            </Button>

                            <div className="flex justify-center mb-8 relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="w-24 h-24 rounded-full border-[3px] border-dashed border-violet-500/30 border-t-violet-400 absolute"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                    className="w-20 h-20 rounded-full border-[2px] border-dashed border-fuchsia-500/30 border-b-fuchsia-400 absolute top-2"
                                />
                                <div className="w-24 h-24 flex items-center justify-center relative z-10">
                                    <Lock className="w-8 h-8 text-violet-300 animate-pulse" />
                                </div>
                            </div>

                            <motion.h2
                                className="text-2xl md:text-3xl font-bold text-white mb-6 font-mono tracking-tight"
                            >
                                DECRYPTING...
                            </motion.h2>

                            <div className="h-6 relative overflow-hidden mb-8">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={messageIndex}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-violet-400 font-mono text-sm absolute w-full text-center"
                                    >
                                        {funnyMessages[messageIndex]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 backdrop-blur-sm">
                                <p className="text-slate-400 text-sm md:text-base font-mono mb-4 uppercase tracking-[0.2em]">Estimated decryption time:</p>

                                <div className="flex justify-center items-start gap-2 md:gap-4 font-mono">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-slate-900 rounded-lg border border-violet-500/20 text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-violet-300 to-violet-500 shadow-[inset_0_0_15px_rgba(139,92,246,0.1)]">
                                            {timeLeft.days.toString().padStart(2, '0')}
                                        </div>
                                        <span className="text-[10px] md:text-xs text-slate-500 mt-2 uppercase tracking-widest">Days</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-12 md:h-16 flex items-center justify-center">
                                            <span className="text-xl md:text-3xl font-bold text-violet-500/50">:</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-slate-900 rounded-lg border border-violet-500/20 text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-violet-300 to-violet-500 shadow-[inset_0_0_15px_rgba(139,92,246,0.1)]">
                                            {timeLeft.hours.toString().padStart(2, '0')}
                                        </div>
                                        <span className="text-[10px] md:text-xs text-slate-500 mt-2 uppercase tracking-widest">Hrs</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-12 md:h-16 flex items-center justify-center">
                                            <span className="text-xl md:text-3xl font-bold text-violet-500/50">:</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-slate-900 rounded-lg border border-violet-500/20 text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-violet-300 to-violet-500 shadow-[inset_0_0_15px_rgba(139,92,246,0.1)]">
                                            {timeLeft.minutes.toString().padStart(2, '0')}
                                        </div>
                                        <span className="text-[10px] md:text-xs text-slate-500 mt-2 uppercase tracking-widest">Mins</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-12 md:h-16 flex items-center justify-center">
                                            <span className="text-xl md:text-3xl font-bold text-violet-500/50">:</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-slate-900 rounded-lg border border-violet-500/20 text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-violet-300 to-violet-500 shadow-[inset_0_0_15px_rgba(139,92,246,0.1)]">
                                            {timeLeft.seconds.toString().padStart(2, '0')}
                                        </div>
                                        <span className="text-[10px] md:text-xs text-slate-500 mt-2 uppercase tracking-widest">Secs</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 mt-6 md:mt-8 italic opacity-70">
                                    (Just kidding. But you will have to wait until launch.)
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
