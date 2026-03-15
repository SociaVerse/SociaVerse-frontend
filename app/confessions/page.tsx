"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    EyeOff, Send, ArrowUp, Clock, Sparkles,
    MessageCircle, Loader2, AlertCircle
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { confessionsApi, Confession } from "@/services/confessions"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/custom-toast"
import Link from "next/link"

export default function ConfessionsPage() {
    const { isAuthenticated, user } = useAuth()
    const { toast } = useToast()

    // Confession feed state
    const [confessions, setConfessions] = useState<Confession[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)

    // Submission state
    const [newConfession, setNewConfession] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [upvoted, setUpvoted] = useState<Record<number, boolean>>({})
    const [upvoteCounts, setUpvoteCounts] = useState<Record<number, number>>({})

    const fetchConfessions = useCallback(async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return
        if (isInitial) setLoading(true); else setLoadingMore(true)
        try {
            const data = isInitial
                ? await confessionsApi.getConfessions(1)
                : nextUrl
                    ? await confessionsApi.getConfessionsByUrl(nextUrl)
                    : null

            if (data) {
                const results = data.results || []
                setConfessions(prev => isInitial ? results : [...prev, ...results])
                setNextUrl(data.next || null)
                setHasMore(!!data.next)

                // Initialize upvote states
                const newUpvoted: Record<number, boolean> = {}
                const newCounts: Record<number, number> = {}
                results.forEach((c: Confession) => {
                    newUpvoted[c.id] = c.is_upvoted || false
                    newCounts[c.id] = c.upvotes_count || 0
                })
                if (isInitial) {
                    setUpvoted(newUpvoted)
                    setUpvoteCounts(newCounts)
                } else {
                    setUpvoted(prev => ({ ...prev, ...newUpvoted }))
                    setUpvoteCounts(prev => ({ ...prev, ...newCounts }))
                }
            }
        } catch (error) {
            console.error("Failed to fetch confessions:", error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [hasMore, loadingMore, nextUrl])

    useEffect(() => { fetchConfessions(true) }, [])

    const lastConfessionRef = useInfiniteScroll({
        callback: () => fetchConfessions(false),
        isLoading: loading || loadingMore,
        hasMore
    })

    const handleSubmit = async () => {
        if (!newConfession.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            const created = await confessionsApi.createConfession(newConfession.trim())
            setConfessions(prev => [created, ...prev])
            setUpvoted(prev => ({ ...prev, [created.id]: false }))
            setUpvoteCounts(prev => ({ ...prev, [created.id]: 0 }))
            setNewConfession("")
            toast({
                type: "success",
                title: "Confession posted!",
                message: "Your anonymous confession has been shared.",
                duration: 3000
            })
        } catch (error) {
            console.error("Failed to submit confession:", error)
            toast({
                type: "error",
                title: "Failed",
                message: "Could not post your confession. Try again.",
                duration: 3000
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpvote = async (id: number) => {
        if (!isAuthenticated) return

        const wasUpvoted = upvoted[id] ?? false
        const currentCount = upvoteCounts[id] ?? 0

        // Optimistic update
        setUpvoted(prev => ({ ...prev, [id]: !wasUpvoted }))
        setUpvoteCounts(prev => ({
            ...prev,
            [id]: wasUpvoted ? Math.max(0, currentCount - 1) : currentCount + 1
        }))

        try {
            await confessionsApi.upvoteConfession(id)
        } catch (error) {
            // Revert on error
            setUpvoted(prev => ({ ...prev, [id]: wasUpvoted }))
            setUpvoteCounts(prev => ({ ...prev, [id]: currentCount }))
        }
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffSecs = Math.floor(diffMs / 1000)

        if (diffSecs < 60) return "just now"
        if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`
        if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`
        if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)}d ago`
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    return (
        <div className="min-h-dvh bg-slate-950 text-slate-100 pt-16 pb-24 md:pb-8">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-6 pb-4"
                >
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                            <EyeOff className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white">🕶 Confessions</h1>
                            <p className="text-xs text-slate-500 font-medium">Anonymous • University only</p>
                        </div>
                    </div>
                </motion.div>

                {/* Submission Form */}
                {isAuthenticated ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-5 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                                    <EyeOff className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-400">Posting as Anonymous Student</span>
                            </div>

                            <textarea
                                value={newConfession}
                                onChange={(e) => setNewConfession(e.target.value)}
                                placeholder="Spill the tea... 🍵 Your identity is completely hidden."
                                rows={3}
                                className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl px-4 py-3 text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm leading-relaxed"
                                id="confession-input"
                            />

                            <div className="flex items-center justify-between mt-3">
                                <p className="text-[11px] text-slate-600">
                                    🔒 Your identity is never shown to anyone
                                </p>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!newConfession.trim() || isSubmitting}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    id="confession-submit"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Confess
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-sm text-center">
                            <EyeOff className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 mb-3">Log in to post anonymous confessions</p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-purple-500/20"
                            >
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Confessions Feed */}
                <AnimatePresence mode="wait">
                    {loading && confessions.length === 0 ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-slate-900/40 border border-slate-800/40 rounded-3xl p-5 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-9 h-9 rounded-full" />
                                        <div className="space-y-1.5">
                                            <Skeleton className="h-3 w-32" />
                                            <Skeleton className="h-2.5 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-16 w-full rounded-xl" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            ))}
                        </div>
                    ) : confessions.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            {confessions.map((confession, i) => (
                                <ConfessionCard
                                    key={confession.id}
                                    confession={confession}
                                    index={i}
                                    isUpvoted={upvoted[confession.id] ?? false}
                                    upvoteCount={upvoteCounts[confession.id] ?? 0}
                                    onUpvote={() => handleUpvote(confession.id)}
                                    formatTime={formatTime}
                                />
                            ))}

                            {/* Infinite scroll sentinel */}
                            <div ref={lastConfessionRef} className="h-10 flex items-center justify-center">
                                {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-purple-400" />}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-16 h-16 rounded-full bg-slate-900/60 flex items-center justify-center mx-auto mb-4 border border-slate-800/50">
                                <EyeOff className="w-7 h-7 text-slate-600" />
                            </div>
                            <p className="text-slate-400 font-medium mb-1">No confessions yet</p>
                            <p className="text-sm text-slate-600">Be the first to spill the tea at your university 🍵</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

// ── Confession Card Component ─────────────────────────────────────────────────

function ConfessionCard({
    confession,
    index,
    isUpvoted,
    upvoteCount,
    onUpvote,
    formatTime,
}: {
    confession: Confession
    index: number
    isUpvoted: boolean
    upvoteCount: number
    onUpvote: () => void
    formatTime: (date: string) => string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.2) }}
            className="group"
        >
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-3xl p-5 hover:border-purple-500/20 hover:bg-slate-900/70 transition-all duration-200 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
                        <EyeOff className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-200">Anonymous Student</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(confession.created_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-4 pl-12">
                    <p className="text-slate-200 text-[15px] leading-relaxed whitespace-pre-wrap">
                        {confession.content}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pl-12">
                    <button
                        onClick={onUpvote}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                            isUpvoted
                                ? "bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-sm shadow-purple-500/10"
                                : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300"
                        }`}
                        id={`upvote-${confession.id}`}
                    >
                        <ArrowUp className={`w-3.5 h-3.5 ${isUpvoted ? "text-purple-400" : ""}`} />
                        {upvoteCount > 0 && <span>{upvoteCount}</span>}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
