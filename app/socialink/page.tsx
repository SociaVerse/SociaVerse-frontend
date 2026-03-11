"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Zap, Users, Rocket, Clock, MessageSquare, Lock } from "lucide-react"

export default function SociaLinkComingSoonPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans flex flex-col pt-16 sm:pt-0">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 pb-24 sm:pb-12 max-w-5xl mx-auto w-full text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full flex flex-col items-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold mb-8 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                        <Clock className="w-4 h-4" />
                        <span>Arriving at Launch</span>
                    </div>

                    {/* Logo/Icon Graphic */}
                    <div className="relative mb-10 w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-violet-600/20 to-blue-600/20 animate-pulse border border-white/10" />
                        <div className="absolute inset-2 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/5 flex items-center justify-center shadow-2xl overflow-hidden">
                            <MessageSquare className="w-12 h-12 text-violet-400 opacity-50 absolute -translate-x-3 translate-y-3" />
                            <Lock className="w-10 h-10 text-white z-10" />
                        </div>
                    </div>

                    {/* Typography */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-slate-500">
                        Anonymous Chat <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-500 relative inline-block">
                            Redefined
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full blur-[2px] opacity-70" />
                        </span>
                    </h1>

                    <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
                        Get ready to experience professional networking without bias. Form genuine connections, exchange ideas securely, and reveal your identity only when you choose to.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-12">
                        <button
                            onClick={() => router.push('/join-waitlist')}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 hover:scale-105 hover:border-white/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 w-full sm:w-auto overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Rocket className="w-5 h-5 mr-3 relative z-10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            <span className="relative z-10">Join the Waitlist</span>
                        </button>
                    </div>
                </motion.div>

                {/* Features Display */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full relative z-10"
                >
                    <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:bg-slate-900/60 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-colors">
                            <Shield className="w-6 h-6 text-violet-400" />
                        </div>
                        <h3 className="font-bold text-white text-xl mb-3">Zero Bias Connection</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">Your photo, college, and name remain hidden. Let your ideas and conversation drive the connection first.</p>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:bg-slate-900/60 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                            <Zap className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="font-bold text-white text-xl mb-3">Smart Matching</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">Our AI pairs you with peers across different colleges tailored to your specific interests and carrier goals.</p>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:bg-slate-900/60 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                            <Users className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-white text-xl mb-3">Mutual Reveals</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">Once trust is established, simply send a "Reveal Request". If both parties accept, profiles are unlocked instantly.</p>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
