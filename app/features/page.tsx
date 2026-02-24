"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    ShoppingBag,
    CalendarDays,
    Gamepad2,
    Palette,
    EyeOff,
    Sparkles
} from "lucide-react"

const features = [
    {
        icon: <LayoutDashboard className="h-7 w-7 text-blue-400" />,
        title: "Dynamic Feed",
        description: "Your personalized hub. Share updates, photos, and connect with what matters most in real-time.",
        color: "from-blue-500/20 to-indigo-500/20"
    },
    {
        icon: <ShoppingBag className="h-7 w-7 text-amber-400" />,
        title: "Marketplace",
        description: "A secure ecosystem to buy, sell, and trade. Find what you need directly from your peers.",
        color: "from-amber-500/20 to-orange-500/20"
    },
    {
        icon: <CalendarDays className="h-7 w-7 text-purple-400" />,
        title: "Events Hub",
        description: "Never miss out. Discover, host, and RSVP to virtual and real-world campus events seamlessly.",
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        icon: <Gamepad2 className="h-7 w-7 text-green-400" />,
        title: "Game Center",
        description: "Challenge friends to multiplayer games right in the app. Climb the leaderboards and earn bragging rights.",
        color: "from-green-500/20 to-emerald-500/20"
    },
    {
        icon: <Palette className="h-7 w-7 text-rose-400" />,
        title: "Custom Profiles",
        description: "Your digital identity, designed by you. Express yourself with customizable themes and showcase your achievements.",
        color: "from-rose-500/20 to-red-500/20"
    }
]

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="container px-4 mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Social Potential</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            SociaVerse isn't just another social network. It's a powerhouse of tools designed to supercharge your student life.
                        </p>
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
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm overflow-hidden"
                            >
                                {/* Hover Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="relative z-10">
                                    <div className="mb-6 p-4 rounded-2xl bg-slate-800/50 w-fit border border-slate-700/50 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-slate-200 group-hover:text-white transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* The Secret Riddle Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
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
                                        <EyeOff className="w-10 h-10 text-violet-400 relative z-10 mb-1" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-violet-500/70 font-mono relative z-10">Classified</span>
                                    </div>
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="inline-flex items-center space-x-2 text-violet-400 mb-4 font-mono text-sm">
                                        <Sparkles className="w-4 h-4" />
                                        <span>SYSTEM_ANOMALY_DETECTED</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:animate-pulse">Project: SociaLink</span>
                                    </h3>
                                    <div className="space-y-3 text-slate-400 font-mono text-sm md:text-base leading-relaxed">
                                        <p className="border-l-2 border-violet-500/30 pl-4 py-1 italic relative">
                                            <span className="absolute -left-[2px] top-0 h-full w-[2px] bg-violet-500 shadow-[0_0_10px_purple]"></span>
                                            "Born in shadows, bound by time.<br />
                                            No names, no faces—just thoughts intertwine.<br />
                                            Speak your truth before the connection drops...<br />
                                            Are you brave enough when the hourglass stops?"
                                        </p>
                                        <p className="opacity-60 text-xs mt-4 group-hover:opacity-100 transition-opacity duration-700">
                                            &gt; STATUS: Encrypted connection protocol ready.<br />
                                            &gt; DECRYPTION: Available at launch.
                                        </p>
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
                        viewport={{ once: true }}
                        className="relative rounded-[2.5rem] bg-gradient-to-b from-blue-900/40 to-slate-900/40 border border-blue-500/20 p-12 md:p-20 text-center overflow-hidden"
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
                                    <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                                        <Link href="/join-waitlist">Join the Waitlist</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                                        <Link href="/signup">Get Started Now</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-all">
                                        <Link href="/login">Already a Member?</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    )
}
