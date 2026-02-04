"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Calendar, MapPin, Clock, Trophy, Share2, ArrowLeft,
    Globe, Users, Sparkles, CheckCircle2, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/custom-toast"
import Link from "next/link"

export default function EventDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const { toast } = useToast()

    const [event, setEvent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/`)
                if (response.ok) {
                    const data = await response.json()
                    setEvent(data)
                } else {
                    toast({ type: "error", title: "Error", message: "Event not found" })
                    router.push("/events")
                }
            } catch (error) {
                console.error("Failed to fetch event:", error)
                toast({ type: "error", title: "Network Error", message: "Could not load event details" })
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchEvent()
    }, [id, router, toast])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
        )
    }

    if (!event) return null

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-900/20 to-transparent opacity-50" />
                <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px]" />
            </div>

            <main className="relative z-10">
                {/* Hero Header with Image */}
                <div className="relative h-[50vh] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
                    <img
                        src={event.image || "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1000"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute top-8 left-4 md:left-8 z-50">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="bg-black/30 backdrop-blur-md text-white hover:bg-black/50 rounded-full h-12 w-12 p-0"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-bold backdrop-blur-md flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> {event.category}
                                </span>
                                {event.is_promoted && (
                                    <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-bold backdrop-blur-md flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Promoted
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight shadow-xl">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap gap-6 text-slate-300 font-medium">
                                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5">
                                    <Calendar className="w-5 h-5 text-blue-400" />
                                    <span>{new Date(event.start_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5">
                                    <MapPin className="w-5 h-5 text-emerald-400" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8 relative z-30">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 space-y-8"
                        >
                            {/* Description Card */}
                            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-yellow-500" /> About Event
                                </h2>
                                <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                                    {event.description}
                                </p>
                            </div>

                            {/* Rules & Info */}
                            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl">
                                <h3 className="text-xl font-bold text-white mb-6">Rules & Guidelines</h3>
                                <div className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                                    {event.rules || "No specific rules provided. Please follow standard community guidelines."}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Action Card */}
                            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl sticky top-24">
                                <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
                                    <div>
                                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Time</p>
                                        <p className="text-white font-mono text-xl">
                                            {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Entry</p>
                                        <p className="text-emerald-400 font-bold text-xl">Free</p>
                                    </div>
                                </div>

                                <Button className="w-full h-14 bg-white text-black hover:bg-slate-200 rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-all mb-4">
                                    Register Now
                                </Button>

                                <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 text-slate-300 rounded-2xl flex items-center justify-center gap-2">
                                    <Share2 className="w-4 h-4" /> Share Event
                                </Button>

                                {/* Organizer Mini Profile */}
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Organized by</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
                                            {event.organizer_name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{event.organizer_name}</p>
                                            <p className="text-xs text-slate-500">Verified Organizer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Prize Card */}
                            {event.prize && (
                                <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl p-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-500">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-yellow-500 font-bold uppercase text-xs tracking-wider">Prize Pool</p>
                                            <p className="text-2xl font-bold text-white">{event.prize}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}
