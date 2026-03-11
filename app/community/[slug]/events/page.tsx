"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Megaphone, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Announcement {
    id: number
    title: string
    body: string
    created_at: string
    author: string
}

// Placeholder component until a dedicated backend endpoint is built
export default function EventsPage() {
    const params = useParams()
    const slug = params.slug as string
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const token = localStorage.getItem("sociaverse_token")
                const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/`, {
                    headers: { 'Authorization': `Token ${token}` }
                })
                if (r.ok) {
                    const data = await r.json()
                    setIsAdmin(data.is_admin)
                }
            } catch { /* ignore */ } finally {
                setLoading(false)
            }
        }
        fetchCommunity()
    }, [slug])

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    )

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-24 md:pb-8 scrollbar-hide">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-blue-400" />
                            Events &amp; Announcements
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Stay up to date with community news and events.</p>
                    </div>
                    {isAdmin && (
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm" disabled>
                            <Plus className="w-4 h-4 mr-2" />
                            New Announcement
                        </Button>
                    )}
                </div>

                {/* Upcoming events placeholder */}
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Upcoming</h2>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-2xl border border-blue-500/20 p-6 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                            <Calendar className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">No events yet</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                            {isAdmin
                                ? "Create your first event or announcement to keep your community engaged."
                                : "No events have been scheduled yet. Check back later!"}
                        </p>
                    </motion.div>
                </div>

                {/* Announcements placeholder */}
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Announcements</h2>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/60 rounded-2xl border border-white/5 p-6 text-center"
                    >
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3">
                            <Megaphone className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-500 text-sm">No announcements have been posted.</p>
                    </motion.div>
                </div>

                {/* Info note */}
                <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-500 text-center">
                    💡 Full events system with RSVPs, recurring events, and ICS export is coming soon.
                </div>
            </div>
        </div>
    )
}
