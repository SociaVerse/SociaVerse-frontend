"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Users, ArrowRight, BadgeCheck, X, Calendar, ExternalLink, Flame, Zap, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AuthModal } from "@/components/auth-modal"
import { api, Post } from "@/services/api"
import { PostCard } from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { Loader2 } from "lucide-react"
import { PostModal } from "@/components/post-modal"

const API = process.env.NEXT_PUBLIC_API_URL

// Module-level cache so navigating back doesn't re-fetch
const cache: Record<string, { data: any; ts: number }> = {}
const CACHE_TTL = 60_000

async function cachedFetch(url: string, options?: RequestInit) {
    const now = Date.now()
    if (cache[url] && now - cache[url].ts < CACHE_TTL) return cache[url].data
    const res = await fetch(url, options)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    cache[url] = { data, ts: now }
    return data
}

const TABS = [
    { label: "For You",      Icon: Zap,      activeClass: "from-emerald-500 to-teal-500",   glow: "shadow-emerald-500/30" },
    { label: "Events",       Icon: Calendar, activeClass: "from-orange-500 to-amber-500",   glow: "shadow-orange-500/30"  },
    { label: "People",       Icon: Users,    activeClass: "from-violet-500 to-purple-500",  glow: "shadow-violet-500/30"  },
    { label: "Communities",  Icon: Globe,    activeClass: "from-blue-500 to-indigo-500",    glow: "shadow-blue-500/30"    },
] as const

type TabLabel = (typeof TABS)[number]["label"]

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState<TabLabel>("For You")
    const { isAuthenticated, user } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) setShowAuthModal(true)
        else action()
    }

    const activeMeta = TABS.find(t => t.label === activeTab)!
    const ActiveIcon = activeMeta.Icon

    return (
        <div className="min-h-dvh bg-slate-950 text-slate-100 pt-16 md:pt-20 pb-[calc(5rem+env(safe-area-inset-bottom))]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Mobile Header ── */}
                <div className="md:hidden mb-4 pt-[calc(4rem+env(safe-area-inset-top))]">
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight leading-none">
                                <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                    The Pulse
                                </span>
                                <span className="ml-1.5">⚡</span>
                            </h1>
                            <p className="text-slate-500 text-xs mt-1">Live updates from across the verse.</p>
                        </div>
                        <motion.div
                            key={activeTab}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`h-9 w-9 rounded-xl bg-linear-to-br ${activeMeta.activeClass} flex items-center justify-center shadow-lg`}
                        >
                            <ActiveIcon className="w-4 h-4 text-white" />
                        </motion.div>
                    </div>
                    <SearchBar />
                    {/* Mobile Tab Chips */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-0.5">
                        {TABS.map(tab => {
                            const TabIcon = tab.Icon
                            const isActive = activeTab === tab.label
                            return (
                                <button
                                    key={tab.label}
                                    onClick={() => setActiveTab(tab.label)}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                        isActive
                                            ? `bg-linear-to-r ${tab.activeClass} text-white shadow-md ${tab.glow}`
                                            : "bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-200"
                                    }`}
                                >
                                    <TabIcon className="w-3 h-3" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ── Main Feed ── */}
                    <div className="lg:col-span-8">

                        {/* Desktop Sticky Header */}
                        <div className="hidden md:block sticky top-16 z-40 bg-slate-950/95 backdrop-blur-sm -mt-20 pt-24 pb-4 border-b border-slate-800/50">
                            <div className="flex items-end justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-black tracking-tight leading-none">
                                        <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                            The Pulse
                                        </span>
                                        <span className="ml-2">⚡</span>
                                    </h1>
                                    <p className="text-slate-500 text-sm mt-1.5">Live updates from across the verse.</p>
                                </div>
                                <motion.div
                                    key={activeTab}
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`h-11 w-11 rounded-2xl bg-linear-to-br ${activeMeta.activeClass} flex items-center justify-center shadow-xl`}
                                >
                                    <ActiveIcon className="w-5 h-5 text-white" />
                                </motion.div>
                            </div>
                            <SearchBar />
                            <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
                                {TABS.map(tab => {
                                    const TabIcon = tab.Icon
                                    const isActive = activeTab === tab.label
                                    return (
                                        <button
                                            key={tab.label}
                                            onClick={() => setActiveTab(tab.label)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all snap-center ${
                                                isActive
                                                    ? `bg-linear-to-r ${tab.activeClass} text-white shadow-lg ${tab.glow}`
                                                    : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                            }`}
                                        >
                                            <TabIcon className="w-3.5 h-3.5" />
                                            {tab.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Content Feed */}
                        <div className="pt-6 min-h-[50vh]">
                            <AnimatePresence mode="wait">
                                {activeTab === "For You" && (
                                    <motion.div key="foryou" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <ForYouFeed handleAuthAction={handleAuthAction} onPostClick={setSelectedPost} />
                                    </motion.div>
                                )}
                                {activeTab === "Events" && (
                                    <motion.div key="events" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <EventsFeed />
                                    </motion.div>
                                )}
                                {activeTab === "People" && (
                                    <motion.div key="people" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <PeopleFeed handleAuthAction={handleAuthAction} currentUserId={user?.id} isAuthenticated={isAuthenticated} />
                                    </motion.div>
                                )}
                                {activeTab === "Communities" && (
                                    <motion.div key="communities" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <CommunitiesFeed isAuthenticated={isAuthenticated} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ── Right Sidebar ── */}
                    <div className="hidden lg:block lg:col-span-4 space-y-5 pt-[calc(9rem+1px)]">
                        <TrendingCommunitiesSidebar />
                        <WhoToFollow handleAuthAction={handleAuthAction} isAuthenticated={isAuthenticated} currentUserId={user?.id} />
                    </div>

                </div>
            </div>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            <PostModal post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
        </div>
    )
}

// ── SearchBar ─────────────────────────────────────────────────────────────────

function SearchBar() {
    const [isFocused, setIsFocused] = useState(false)
    const [query, setQuery] = useState("")
    const [userResults, setUserResults] = useState<any[]>([])
    const [eventResults, setEventResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const router = useRouter()
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleSearch = (val: string) => {
        setQuery(val)
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (val.trim().length < 2) {
            setUserResults([])
            setEventResults([])
            return
        }

        debounceRef.current = setTimeout(async () => {
            setIsSearching(true)
            try {
                const [userRes, eventRes] = await Promise.all([
                    fetch(`${API}/api/users/search/?q=${encodeURIComponent(val)}`),
                    fetch(`${API}/api/events/?search=${encodeURIComponent(val)}`)
                ])
                if (userRes.ok) {
                    const userData = await userRes.json()
                    setUserResults((Array.isArray(userData) ? userData : userData.results || []).slice(0, 4))
                }
                if (eventRes.ok) {
                    const data = await eventRes.json()
                    const events = Array.isArray(data) ? data : data.results || []
                    setEventResults(events.filter((e: any) =>
                        e.title?.toLowerCase().includes(val.toLowerCase())
                    ).slice(0, 3))
                }
            } catch (e) {
                console.error("Search error:", e)
            } finally {
                setIsSearching(false)
            }
        }, 300)
    }

    const hasResults = userResults.length > 0 || eventResults.length > 0

    return (
        <div className="relative z-50">
            <div className={`relative flex items-center rounded-2xl px-4 py-3 transition-all border ${
                isFocused
                    ? "bg-slate-900 border-slate-700 ring-1 ring-slate-600"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}>
                <Search className={`h-4 w-4 mr-3 transition-colors shrink-0 ${isFocused ? "text-emerald-400" : "text-slate-500"}`} />
                <input
                    type="text"
                    placeholder="Search people, events..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="bg-transparent border-none outline-none flex-1 text-slate-200 placeholder:text-slate-600 text-sm"
                />
                {isSearching && <div className="w-4 h-4 rounded-full border-2 border-slate-700 border-t-emerald-400 animate-spin shrink-0" />}
                {query && !isSearching && (
                    <button onClick={() => { setQuery(""); setUserResults([]); setEventResults([]) }} className="text-slate-600 hover:text-slate-300 shrink-0 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {isFocused && query.length >= 2 && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsFocused(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50 backdrop-blur-sm">
                        {!hasResults && !isSearching && (
                            <div className="p-6 text-center text-slate-500 text-sm">
                                No results for "<span className="text-slate-300">{query}</span>"
                            </div>
                        )}
                        {userResults.length > 0 && (
                            <div>
                                <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Users className="w-3 h-3" /> People
                                </p>
                                {userResults.map((u: any) => (
                                    <div
                                        key={u.id}
                                        onClick={() => { router.push(`/u/${u.username}`); setIsFocused(false) }}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/70 cursor-pointer transition-colors"
                                    >
                                        <img
                                            src={u.profile_picture ? (u.profile_picture.startsWith('http') ? u.profile_picture : `${API}${u.profile_picture}`) : `https://ui-avatars.com/api/?name=${u.username}&background=0f172a&color=94a3b8`}
                                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                                            alt={u.username}
                                        />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1">
                                                <p className="text-sm font-semibold text-slate-200 truncate">{u.first_name} {u.last_name}</p>
                                                {u.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                                            </div>
                                            <p className="text-xs text-slate-500">@{u.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {eventResults.length > 0 && (
                            <div className={userResults.length > 0 ? "border-t border-slate-800" : ""}>
                                <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" /> Events
                                </p>
                                {eventResults.map((e: any) => (
                                    <div
                                        key={e.id}
                                        onClick={() => { router.push(`/events/${e.id}`); setIsFocused(false) }}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/70 cursor-pointer transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/20 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-orange-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-200 truncate max-w-[260px]">{e.title}</p>
                                            <p className="text-xs text-slate-500">{e.category} · {new Date(e.start_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

// ── For You Feed ──────────────────────────────────────────────────────────────

function ForYouFeed({ handleAuthAction, onPostClick }: { handleAuthAction: (fn: () => void) => void, onPostClick: (post: Post) => void }) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)

    const fetchPosts = useCallback(async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return
        if (isInitial) setLoading(true)
        else setLoadingMore(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const url = isInitial ? `${API}/api/posts/` : nextUrl
            if (!url) return
            const res = await fetch(url, { headers: token ? { Authorization: `Token ${token}` } : {} })
            if (res.ok) {
                const data = await res.json()
                const results = data.results || data
                setPosts(prev => isInitial ? results : [...prev, ...results])
                setNextUrl(data.next || null)
                setHasMore(!!data.next)
            }
        } catch (e) {
            console.error("Failed to fetch posts:", e)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [hasMore, loadingMore, nextUrl])

    useEffect(() => { fetchPosts(true) }, [])

    const lastPostRef = useInfiniteScroll({ callback: () => fetchPosts(false), isLoading: loading || loadingMore, hasMore })

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 space-y-4">
                        <div className="flex gap-4">
                            <Skeleton className="h-11 w-11 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-[180px]" />
                                <Skeleton className="h-3 w-[100px]" />
                            </div>
                        </div>
                        <Skeleton className="h-20 w-full rounded-xl" />
                    </div>
                ))}
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">Nothing here yet</p>
                <p className="text-sm mt-1 text-slate-600">Be the first to post something!</p>
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} handleAuthAction={handleAuthAction} onPostClick={onPostClick} />
            ))}
            <div ref={lastPostRef} className="h-10 flex items-center justify-center">
                {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />}
            </div>
            {!hasMore && posts.length > 0 && (
                <p className="text-center text-slate-600 text-sm py-4">You're all caught up! ✨</p>
            )}
        </motion.div>
    )
}

// ── Events Feed ───────────────────────────────────────────────────────────────

const EVENT_CATEGORY_META: Record<string, { emoji: string; color: string }> = {
    hackathon: { emoji: "💻", color: "from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-300" },
    workshop:  { emoji: "🔧", color: "from-blue-500/20 to-sky-500/20 border-blue-500/30 text-blue-300"   },
    seminar:   { emoji: "🎓", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300" },
    cultural:  { emoji: "🎭", color: "from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-300"  },
    gaming:    { emoji: "🎮", color: "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-300" },
    sports:    { emoji: "⚽", color: "from-green-500/20 to-lime-500/20 border-green-500/30 text-green-300" },
    tech:      { emoji: "🚀", color: "from-cyan-500/20 to-sky-500/20 border-cyan-500/30 text-cyan-300"   },
}

function EventsFeed() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [filter, setFilter] = useState("all")

    const categories = ["all", "hackathon", "workshop", "seminar", "cultural", "gaming", "sports", "tech"]

    const fetchEvents = useCallback(async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return
        if (isInitial) setLoading(true)
        else setLoadingMore(true)
        try {
            const url = isInitial ? `${API}/api/events/` : nextUrl
            if (!url) return
            const res = await fetch(url)
            if (res.ok) {
                const data = await res.json()
                const results = data.results || data
                setEvents(prev => isInitial ? results : [...prev, ...results])
                setNextUrl(data.next || null)
                setHasMore(!!data.next)
            }
        } catch (e) {
            console.error("Events fetch error:", e)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [hasMore, loadingMore, nextUrl])

    useEffect(() => { fetchEvents(true) }, [])

    const lastEventRef = useInfiniteScroll({ callback: () => fetchEvents(false), isLoading: loading || loadingMore, hasMore })
    const filtered = filter === "all" ? events : events.filter(e => e.category === filter)

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden">
                            <Skeleton className="h-32 w-full" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-5">
                {categories.map(cat => {
                    const meta = EVENT_CATEGORY_META[cat]
                    const isActive = filter === cat
                    return (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                                isActive
                                    ? "bg-white text-slate-950 border-white shadow-md"
                                    : "bg-transparent border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white"
                            }`}
                        >
                            {meta && <span>{meta.emoji}</span>}
                            {cat === "all" ? "All Events" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    )
                })}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p>No {filter !== "all" ? filter : ""} events found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Featured first event */}
                    {filtered[0] && (
                        <Link href={`/events/${filtered[0].id}`} className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-800/60"
                            >
                                <img
                                    src={filtered[0].image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"}
                                    alt={filtered[0].title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        {EVENT_CATEGORY_META[filtered[0].category] && (
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-linear-to-r ${EVENT_CATEGORY_META[filtered[0].category].color}`}>
                                                {EVENT_CATEGORY_META[filtered[0].category].emoji} {filtered[0].category}
                                            </span>
                                        )}
                                        <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                                            Featured
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-white leading-tight group-hover:text-orange-200 transition-colors">{filtered[0].title}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(filtered[0].start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        {filtered[0].location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{filtered[0].location}</span>}
                                        <span className="flex items-center gap-1 ml-auto"><Users className="w-3.5 h-3.5" />{filtered[0].registration_count || 0} going</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    )}

                    {/* Rest of events grid */}
                    {filtered.length > 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filtered.slice(1).map((event, i) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <Link href={`/events/${event.id}`} className="block group">
                                        <div className="bg-slate-900/50 border border-slate-800/60 hover:border-slate-700 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5">
                                            <div className="relative h-32 overflow-hidden">
                                                <img
                                                    src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400"}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
                                                {event.category && EVENT_CATEGORY_META[event.category] && (
                                                    <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-sm text-white border border-white/10">
                                                        {EVENT_CATEGORY_META[event.category].emoji} {event.category}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-3.5">
                                                <h3 className="font-bold text-slate-200 text-sm leading-tight truncate mb-2 group-hover:text-white transition-colors">{event.title}</h3>
                                                <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(event.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    {event.location && (
                                                        <span className="flex items-center gap-1 truncate max-w-20">
                                                            <MapPin className="w-3 h-3 shrink-0" />{event.location}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1 ml-auto">
                                                        <Users className="w-3 h-3" />{event.registration_count || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div ref={lastEventRef} className="h-10 flex items-center justify-center mt-4">
                {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-orange-400" />}
            </div>
            {!hasMore && events.length > 0 && (
                <p className="text-center text-slate-600 text-sm py-8">No more events to show.</p>
            )}
        </div>
    )
}

// ── People Feed ───────────────────────────────────────────────────────────────

const AVATAR_GRADIENTS = [
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-blue-500 to-indigo-600",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-sky-600",
]

function PeopleFeed({ handleAuthAction, currentUserId, isAuthenticated }: {
    handleAuthAction: (fn: () => void) => void
    currentUserId?: number
    isAuthenticated: boolean
}) {
    const [people, setPeople] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [following, setFollowing] = useState<Record<number, boolean>>({})
    const [pending, setPending] = useState<Record<number, boolean>>({})

    const fetchPeople = useCallback(async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return
        if (isInitial) setLoading(true)
        else setLoadingMore(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {}
            const url = isInitial ? `${API}/api/users/search/?q=` : nextUrl
            if (!url) return
            const res = await fetch(url, { headers })
            if (res.ok) {
                const data = await res.json()
                const results = (data.results || data).filter((u: any) => u.id !== currentUserId)
                setPeople(prev => isInitial ? results : [...prev, ...results])
                setNextUrl(data.next || null)
                setHasMore(!!data.next)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [currentUserId, hasMore, loadingMore, nextUrl])

    useEffect(() => { fetchPeople(true) }, [fetchPeople])

    const lastPersonRef = useInfiniteScroll({ callback: () => fetchPeople(false), isLoading: loading || loadingMore, hasMore })

    const handleFollow = async (userId: number) => {
        if (!isAuthenticated) { handleAuthAction(() => { }); return }
        setPending(p => ({ ...p, [userId]: true }))
        try {
            const token = localStorage.getItem("sociaverse_token")
            const res = await fetch(`${API}/api/users/${userId}/follow/`, {
                method: "POST",
                headers: { Authorization: `Token ${token}` }
            })
            if (res.ok) setFollowing(f => ({ ...f, [userId]: !f[userId] }))
        } catch (e) {
            console.error(e)
        } finally {
            setPending(p => ({ ...p, [userId]: false }))
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 flex flex-col items-center gap-3">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-8 w-full rounded-full" />
                    </div>
                ))}
            </div>
        )
    }

    if (people.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No users found.</p>
            </div>
        )
    }

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {people.map((person, i) => {
                    const isFollowing = following[person.id]
                    const isPending = pending[person.id]
                    const gradClass = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                    const displayName = person.first_name
                        ? `${person.first_name} ${person.last_name || ""}`.trim()
                        : person.username
                    return (
                        <motion.div
                            key={person.id}
                            initial={{ opacity: 0, scale: 0.93 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.035 }}
                            className="bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
                        >
                            <Link href={`/u/${person.username}`} className="flex flex-col items-center mb-3 group w-full">
                                <div className={`w-14 h-14 rounded-full mb-2.5 ring-2 ring-offset-2 ring-offset-slate-950 ${isFollowing ? "ring-emerald-500" : "ring-slate-800 group-hover:ring-violet-500"} transition-all overflow-hidden bg-linear-to-br ${gradClass} p-0.5`}>
                                    <img
                                        src={person.profile_picture
                                            ? (person.profile_picture.startsWith('http') ? person.profile_picture : `${API}${person.profile_picture}`)
                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0f172a&color=94a3b8`}
                                        alt={person.username}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="flex items-center gap-1 justify-center mb-0.5">
                                    <p className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors truncate max-w-[100px]">{displayName}</p>
                                    {person.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                                </div>
                                <p className="text-xs text-slate-500 truncate max-w-[100px]">@{person.username}</p>
                                {person.college && (
                                    <p className="text-[10px] text-slate-600 mt-0.5 truncate max-w-[110px]">{person.college}</p>
                                )}
                            </Link>
                            <button
                                className={`w-full py-1.5 rounded-full text-xs font-semibold transition-all border ${
                                    isFollowing
                                        ? "border-slate-700 text-slate-400 bg-slate-800/60 hover:border-red-500/40 hover:text-red-400"
                                        : "border-violet-500/50 text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 hover:border-violet-400"
                                }`}
                                disabled={isPending}
                                onClick={() => handleFollow(person.id)}
                            >
                                {isPending ? "..." : isFollowing ? "Following" : "+ Follow"}
                            </button>
                        </motion.div>
                    )
                })}
            </div>
            <div ref={lastPersonRef} className="h-10 flex items-center justify-center mt-4">
                {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-violet-400" />}
            </div>
        </div>
    )
}

// ── Communities Feed ──────────────────────────────────────────────────────────

function CommunitiesFeed({ isAuthenticated }: { isAuthenticated: boolean }) {
    const [communities, setCommunities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)

    const fetchCommunities = useCallback(async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return
        if (isInitial) setLoading(true)
        else setLoadingMore(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {}
            const url = isInitial ? `${API}/api/communities/` : nextUrl
            if (!url) return
            const res = await fetch(url, { headers })
            if (res.ok) {
                const data = await res.json()
                const results = data.results || data
                setCommunities(prev => isInitial ? results : [...prev, ...results])
                setNextUrl(data.next || null)
                setHasMore(!!data.next)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [hasMore, loadingMore, nextUrl])

    useEffect(() => { fetchCommunities(true) }, [fetchCommunities])

    const lastCommunityRef = useInfiniteScroll({ callback: () => fetchCommunities(false), isLoading: loading || loadingMore, hasMore })

    const bannerImages = [
        "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1580843410763-48582e62a49f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1590642916589-59234a0a613c?auto=format&fit=crop&q=80&w=600",
    ]

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden">
                        <Skeleton className="h-36 w-full" />
                        <div className="p-4 space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (communities.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No communities yet.</p>
                <Link href="/community" className="mt-3 inline-flex items-center gap-1 text-sm text-blue-400 hover:underline">
                    Browse communities <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        )
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {communities.map((comm, i) => (
                    <motion.div
                        key={comm.id || comm.slug}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                    >
                        <Link href={`/community/${comm.slug}`} className="block group">
                            <div className="bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30">
                                <div className="relative h-32 overflow-hidden">
                                    <img
                                        src={comm.banner || comm.icon || bannerImages[i % bannerImages.length]}
                                        alt={comm.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                        <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-blue-300 border border-blue-500/20">
                                            <Users className="w-3 h-3" />
                                            {comm.member_count || comm.members_count || 0}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3.5">
                                    <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors text-sm mb-1 truncate">{comm.name}</h3>
                                    {comm.description && (
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{comm.description}</p>
                                    )}
                                    {comm.college && (
                                        <p className="text-[10px] text-slate-600 mt-1.5 flex items-center gap-1">
                                            <MapPin className="w-2.5 h-2.5" />{comm.college}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
            <div ref={lastCommunityRef} className="h-10 flex items-center justify-center mt-4">
                {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-blue-400" />}
            </div>
        </div>
    )
}

// ── Who To Follow Sidebar ─────────────────────────────────────────────────────

function WhoToFollow({ handleAuthAction, isAuthenticated, currentUserId }: {
    handleAuthAction: (fn: () => void) => void
    isAuthenticated: boolean
    currentUserId?: number
}) {
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [following, setFollowing] = useState<Record<number, boolean>>({})
    const [pending, setPending] = useState<Record<number, boolean>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const token = localStorage.getItem("sociaverse_token")
                const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {}
                await new Promise(r => setTimeout(r, 800))
                const data: any[] = await cachedFetch(`${API}/api/users/search/?q=&limit=10`, { headers })
                const others = data.filter((u: any) => u.id !== currentUserId)
                setSuggestions(others.slice(0, 6))
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetch_()
    }, [currentUserId])

    const handleFollow = async (userId: number) => {
        if (!isAuthenticated) { handleAuthAction(() => { }); return }
        setPending(p => ({ ...p, [userId]: true }))
        try {
            const token = localStorage.getItem("sociaverse_token")
            await fetch(`${API}/api/users/${userId}/follow/`, {
                method: "POST",
                headers: { Authorization: `Token ${token}` }
            })
            setFollowing(f => ({ ...f, [userId]: !f[userId] }))
        } catch (e) {
            console.error(e)
        } finally {
            setPending(p => ({ ...p, [userId]: false }))
        }
    }

    return (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-bold text-base text-slate-200">Who to Follow</h3>
            </div>
            {loading ? (
                <div className="space-y-3.5">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-9 h-9 rounded-full" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-2.5 w-14" />
                                </div>
                            </div>
                            <Skeleton className="h-7 w-16 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : suggestions.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No suggestions right now.</p>
            ) : (
                <div className="space-y-1">
                    {suggestions.map((user, i) => {
                        const gradClass = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                        const displayName = user.first_name
                            ? `${user.first_name} ${user.last_name || ""}`.trim()
                            : user.username
                        return (
                            <div key={user.id} className="flex items-center justify-between gap-2 py-2 px-2 rounded-xl hover:bg-slate-800/40 transition-colors group">
                                <Link href={`/u/${user.username}`} className="flex items-center gap-2.5 flex-1 min-w-0">
                                    <div className={`w-8 h-8 rounded-full bg-linear-to-br ${gradClass} p-px shrink-0 ring-1 ring-white/10`}>
                                        <img
                                            src={user.profile_picture
                                                ? (user.profile_picture.startsWith('http') ? user.profile_picture : `${API}${user.profile_picture}`)
                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0f172a&color=94a3b8`}
                                            className="w-full h-full rounded-full object-cover"
                                            alt={user.username}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1">
                                            <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors truncate max-w-[90px]">{displayName}</p>
                                            {user.is_verified && <BadgeCheck className="w-3 h-3 text-blue-500 shrink-0" />}
                                        </div>
                                        <p className="text-[10px] text-slate-600 truncate">@{user.username}</p>
                                    </div>
                                </Link>
                                <button
                                    className={`h-6 rounded-full text-[10px] font-semibold px-3 shrink-0 transition-all border ${
                                        following[user.id]
                                            ? "text-slate-500 bg-slate-800/60 border-slate-700"
                                            : "text-violet-300 bg-violet-500/10 border-violet-500/30 hover:bg-violet-500/20 hover:border-violet-400"
                                    }`}
                                    disabled={pending[user.id]}
                                    onClick={() => handleFollow(user.id)}
                                >
                                    {pending[user.id] ? "..." : following[user.id] ? "✓" : "+ Follow"}
                                </button>
                            </div>
                        )
                    })}
                    <Link href="/explore?tab=people" className="block text-center text-[11px] text-slate-500 hover:text-violet-400 transition-colors pt-2">
                        See more people →
                    </Link>
                </div>
            )}
        </div>
    )
}

// ── Trending Communities Sidebar ──────────────────────────────────────────────

const RANK_STYLES = [
    "text-orange-400 bg-orange-500/10 border-orange-500/20",
    "text-slate-300 bg-slate-500/10 border-slate-500/20",
    "text-amber-600 bg-amber-600/10 border-amber-600/20",
    "text-slate-500 bg-slate-800/60 border-slate-800",
    "text-slate-500 bg-slate-800/60 border-slate-800",
]

function TrendingCommunitiesSidebar() {
    const [communities, setCommunities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch_ = async () => {
            try {
                await new Promise(r => setTimeout(r, 800))
                const data = await cachedFetch(`${API}/api/communities/trending/`)
                const list = (Array.isArray(data) ? data : data.results || []).slice(0, 5)
                if (list.length > 0) { setCommunities(list); setLoading(false); return }
            } catch (_) { /* endpoint may not exist yet */ }

            try {
                const data2 = await cachedFetch(`${API}/api/communities/`)
                const all: any[] = Array.isArray(data2) ? data2 : data2.results || []
                const sorted = [...all].sort(
                    (a, b) => (b.member_count || b.members_count || 0) - (a.member_count || a.members_count || 0)
                )
                setCommunities(sorted.slice(0, 5))
            } catch (e) {
                console.error("Communities fallback error:", e)
            } finally {
                setLoading(false)
            }
        }
        fetch_()
    }, [])

    if (loading) {
        return (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5">
                <Skeleton className="h-5 w-40 mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-11 w-full rounded-xl" />)}
                </div>
            </div>
        )
    }

    if (communities.length === 0) return null

    return (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 rounded-lg bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-bold text-base text-slate-200">Trending</h3>
            </div>
            <div className="space-y-1">
                {communities.map((comm, i) => (
                    <Link href={`/community/${comm.slug}`} key={comm.id || comm.slug} className="block group">
                        <div className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer">
                            <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${RANK_STYLES[i] || RANK_STYLES[4]}`}>
                                {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-slate-300 group-hover:text-white transition-colors text-sm truncate">{comm.name}</p>
                                <p className="text-[10px] text-slate-600">{(comm.member_count || comm.members_count || 0).toLocaleString()} members</p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-700 opacity-0 group-hover:opacity-100 group-hover:text-slate-400 transition-all shrink-0" />
                        </div>
                    </Link>
                ))}
                <Link href="/community" className="block text-center text-[11px] text-slate-500 hover:text-orange-400 transition-colors pt-2">
                    All communities →
                </Link>
            </div>
        </div>
    )
}
