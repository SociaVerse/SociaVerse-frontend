"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Globe, Zap, Shield, Radar, Power, Users, PlayCircle, X } from "lucide-react"
import { DemoChat } from "@/components/socialink/demo-chat"

export default function SociaLinkPage() {
    const [isAnonymous, setIsAnonymous] = useState(true)
    const [isMatching, setIsMatching] = useState(false)
    const [matchStep, setMatchStep] = useState(0) // 0: Idle, 1: Scanning, 2: Connecting, 3: Success
    const [error, setError] = useState<string | null>(null)
    const [isDemoMode, setIsDemoMode] = useState(false)
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    const handleMatch = async () => {
        if (!isAuthenticated) {
            router.push('/login?next=/socialink')
            return
        }

        const token = localStorage.getItem("sociaverse_token")
        if (!token) {
            router.push('/login')
            return
        }

        startMatchingProcess()
    }

    const handleDemoMatch = () => {
        setIsDemoMode(true)
        startMatchingProcess()
    }

    const startMatchingProcess = () => {
        setIsMatching(true)
        setMatchStep(1) // Start Scanning
        setError(null)

        // Simulate scanning delay for effect
        setTimeout(async () => {
            if (isDemoMode) {
                // Demo Mode Logic
                setMatchStep(2) // Found, connecting
                setTimeout(() => {
                    setMatchStep(3) // Success (renders DemoChat)
                }, 1500)
                return
            }

            try {
                const token = localStorage.getItem("sociaverse_token")
                const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/chat/socialink/match/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify({ topic: 'General' }) // Can be expanded later
                })

                const data = await response.json()

                if (response.ok) {
                    if (data.status === 'matched') {
                        setMatchStep(2) // Found, connecting
                        setTimeout(() => {
                            setMatchStep(3) // Success
                            setTimeout(() => router.push(`/chat/${data.conversation.id}`), 1000)
                        }, 1500)
                    } else if (data.status === 'waiting') {
                        // Poll for status or just wait
                        pollForMatch()
                    }
                } else {
                    setError(data.message || 'Failed to match')
                    setIsMatching(false)
                    setMatchStep(0)
                }
            } catch (err) {
                console.error("Match error", err)
                setError("Connection failed. Please try again.")
                setIsMatching(false)
                setMatchStep(0)
            }
        }, 4000)
    }

    const pollForMatch = async () => {
        const token = localStorage.getItem("sociaverse_token")
        const interval = setInterval(async () => {
            try {
                const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/chat/socialink/status/', {
                    headers: { 'Authorization': `Token ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    if (data.status === 'matched') {
                        clearInterval(interval)
                        setMatchStep(2)
                        setTimeout(() => {
                            setMatchStep(3)
                            setTimeout(() => router.push(`/chat/${data.conversation.id}`), 1000)
                        }, 1000)
                    }
                }
            } catch (e) {
                console.error("Polling error", e)
            }
        }, 2000)

        // Timeout after 30 seconds
        setTimeout(() => {
            clearInterval(interval)
            if (isMatching && matchStep !== 3) { // If still matching and not success
                setIsMatching(false)
                setMatchStep(0)
                setError("No match found yet. Try again later!")
            }
        }, 30000)
    }

    const exitDemo = () => {
        setIsMatching(false)
        setMatchStep(0)
        setIsDemoMode(false)
        setError(null)
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans flex flex-col">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div />

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
                        <Switch
                            checked={isAnonymous}
                            onCheckedChange={setIsAnonymous}
                            className="data-[state=checked]:bg-emerald-500"
                        />
                        <span className={cn("text-xs font-medium", isAnonymous ? "text-emerald-400" : "text-slate-400")}>
                            {isAnonymous ? "Ghost Mode Active" : "Public Mode"}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 pb-12">

                <AnimatePresence mode="wait">
                    {!isMatching ? (
                        <motion.div
                            className="text-center max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                                </span>
                                1,240 Users Online
                            </motion.div>

                            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tight">
                                Connect Without <br /> Boundaries
                            </h2>

                            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                                Experience professional networking reimagined. Match anonymously, exchange ideas, and reveal your identity only when ready.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={handleMatch}
                                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-violet-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 hover:bg-violet-500 active:scale-95 w-full sm:w-auto"
                                >
                                    <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
                                    <Power className="w-5 h-5 mr-2" />
                                    Initialize Connection
                                    <div className="ml-2 w-5 h-5 border-t-2 border-r-2 border-white/20 rounded-full group-hover:border-white/60 group-hover:animate-spin transition-colors" />
                                </button>

                                <button
                                    onClick={handleDemoMatch}
                                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-300 transition-all duration-200 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-white/20 hover:bg-white/10 hover:text-white active:scale-95 w-full sm:w-auto"
                                >
                                    <PlayCircle className="w-5 h-5 mr-2" />
                                    Try Demo
                                </button>
                            </div>


                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg inline-block"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {/* Feature Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
                                <FeatureCard icon={Shield} title="Anonymous First" desc="Your profile remains hidden until you decide to reveal." />
                                <FeatureCard icon={Zap} title="Smart Matching" desc="AI-driven algos connect you with relevant peers." />
                                <FeatureCard icon={Users} title="Community Driven" desc="Join a network of thousands of professionals." />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className={cn(
                                "relative flex flex-col items-center justify-center w-full",
                                matchStep === 3 && isDemoMode ? "max-w-md h-[600px]" : "max-w-md aspect-square"
                            )}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {matchStep === 3 && isDemoMode ? (
                                <DemoChat onExit={exitDemo} />
                            ) : (
                                <>
                                    {/* Radar/Scanning Animation */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            className="w-full h-full border border-violet-500/30 rounded-full"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        />
                                        <motion.div
                                            className="absolute w-[80%] h-[80%] border border-blue-500/30 rounded-full"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                                            transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "linear" }}
                                        />
                                        <motion.div
                                            className="absolute w-[60%] h-[60%] border border-emerald-500/30 rounded-full"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                                            transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "linear" }}
                                        />

                                        {/* Rotating Radar Line */}
                                        <motion.div
                                            className="absolute w-full h-full rounded-full bg-gradient-to-t from-transparent via-transparent to-violet-500/10"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            style={{ maskImage: "linear-gradient(to bottom, black, transparent)" }}
                                        />
                                    </div>

                                    {/* Central Status */}
                                    <div className="relative z-10 text-center">
                                        <div className="w-24 h-24 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/20">
                                            {matchStep === 1 && (
                                                <Radar className="w-10 h-10 text-violet-400 animate-pulse" />
                                            )}
                                            {matchStep === 2 && (
                                                <Globe className="w-10 h-10 text-blue-400 animate-spin-slow" />
                                            )}
                                            {matchStep === 3 && ( // Only shows for real match before redirect
                                                <Shield className="w-10 h-10 text-emerald-400" />
                                            )}
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {matchStep === 1 && "Scanning Network..."}
                                            {matchStep === 2 && "Peer Identified"}
                                            {matchStep === 3 && "Secure Link Established"}
                                        </h3>
                                        <p className="text-slate-400 text-sm">
                                            {matchStep === 1 && "Searching for optimal connection..."}
                                            {matchStep === 2 && "Handshaking protocols..."}
                                            {matchStep === 3 && "Redirecting to encrypted channel..."}
                                        </p>

                                        <button onClick={exitDemo} className="mt-8 text-slate-500 text-xs hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto">
                                            <X className="w-3 h-3" /> Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isMatching && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-8 flex flex-col items-center justify-center gap-2"
                    >
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium font-mono">
                            Powered by <span className="text-violet-400">SociaVerse</span>
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <Icon className="w-6 h-6 text-violet-400 mb-4" />
            <h4 className="font-semibold text-white mb-2">{title}</h4>
            <p className="text-sm text-slate-400">{desc}</p>
        </div>
    )
}
