"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Users,
    Zap,
    Shield,
    Globe,
    BookOpen,
    Calendar,
    MessageCircle,
    Share2
} from "lucide-react"

const features = [
    {
        icon: <Users className="h-8 w-8 text-blue-400" />,
        title: "Student Tribes",
        description: "Connect with students from your campus and beyond. Find your niche, whether it's coding, art, or gaming.",
        color: "from-blue-500/20 to-indigo-500/20"
    },
    {
        icon: <Zap className="h-8 w-8 text-yellow-400" />,
        title: "Instant Collaboration",
        description: "Launch projects, share notes, and brainstorm in real-time with zero friction.",
        color: "from-yellow-500/20 to-orange-500/20"
    },
    {
        icon: <Shield className="h-8 w-8 text-green-400" />,
        title: "Verified Community",
        description: "A safe space for students. Verified profiles ensure you're connecting with real peers.",
        color: "from-green-500/20 to-emerald-500/20"
    },
    {
        icon: <Globe className="h-8 w-8 text-purple-400" />,
        title: "Global Reach",
        description: "Don't just stay local. Expand your network to universities worldwide.",
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        icon: <BookOpen className="h-8 w-8 text-red-400" />,
        title: "Resource Library",
        description: "Access a community-driven library of study materials, past papers, and guides.",
        color: "from-red-500/20 to-rose-500/20"
    },
    {
        icon: <Calendar className="h-8 w-8 text-cyan-400" />,
        title: "Campus Events",
        description: "Never miss a hackathon, workshop, or social mixer again. Sync with your calendar.",
        color: "from-cyan-500/20 to-sky-500/20"
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

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                                    <Link href="/signup">Get Started Now</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-all">
                                    <Link href="/login">Already a Member?</Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Simple Footer (Optional, can be a component later) */}
            <footer className="py-10 border-t border-slate-900 bg-slate-950 text-center">
                <p className="text-slate-600 text-sm">
                    © {new Date().getFullYear()} SociaVerse. All rights reserved.
                </p>
            </footer>

        </div>
    )
}
