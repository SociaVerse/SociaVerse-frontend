"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Users, ArrowRight, BadgeCheck, X, Calendar, ExternalLink } from "lucide-react"
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
const CACHE_TTL = 60_000 // 1 minute

async function cachedFetch(url: string, options?: RequestInit) {
    const now = Date.now()
    if (cache[url] && now - cache[url].ts < CACHE_TTL) return cache[url].data
    const res = await fetch(url, options)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    cache[url] = { data, ts: now }
    return data
}

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState("For You")
    const { isAuthenticated, user } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) {
            setShowAuthModal(true)
        } else {
            action()
        }
    }

    const tabs = ["For You", "Events", "People", "Communities"]

    return (
        <div className="min-h-[100dvh] bg-slate-950 text-slate-100 pt-16 md:pt-20 pb-[calc(5rem+env(safe-area-inset-bottom))]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Mobile Header - adjusted pt to clear navbar */}
                <div className="md:hidden mb-6 pt-[calc(4rem+env(safe-area-inset-top))]">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 tracking-tight">
                            The Pulse ⚡
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mt-1">Live updates from across the verse.</p>
                    </div>
                    <SearchBar />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Feed */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Desktop Header - Sticky - adjusted top to clear navbar */}
                        <div className="hidden md:block sticky top-16 z-40 bg-slate-950 -mt-20 pt-24 pb-4 border-b border-slate-800/50">
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 tracking-tight">
                                    The Pulse ⚡
                                </h1>
                                <p className="text-slate-400 text-sm font-medium mt-1">Live updates from across the verse.</p>
                            </div>
                            <SearchBar />
                            <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border relative overflow-hidden group snap-center ${activeTab === tab
                                            ? "bg-slate-100 text-slate-950 border-slate-100 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                            : "bg-transparent border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                                            }`}
                                    >
                                        <span className="relative z-10">{tab}</span>
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-white"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Feed — lazy mount: only mount a tab after first visit */}
                        <div className="space-y-6 min-h-[50vh]">
                            <AnimatePresence mode="wait">
                                {activeTab === "For You" && (
                                    <motion.div key="foryou" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <ForYouFeed handleAuthAction={handleAuthAction} onPostClick={setSelectedPost} />
                                    </motion.div>
                                )}
                                {activeTab === "Events" && (
                                    <motion.div key="events" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <EventsFeed />
                                    </motion.div>
                                )}
                                {activeTab === "People" && (
                                    <motion.div key="people" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <PeopleFeed handleAuthAction={handleAuthAction} currentUserId={user?.id} isAuthenticated={isAuthenticated} />
                                    </motion.div>
                                )}
                                {activeTab === "Communities" && (
                                    <motion.div key="communities" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <CommunitiesFeed isAuthenticated={isAuthenticated} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Sidebar — rendered but fetches are deferred */}
                    <div className="hidden lg:block lg:col-span-4 space-y-6">
                        <TrendingCommunitiesSidebar />
                        <WhoToFollow handleAuthAction={handleAuthAction} isAuthenticated={isAuthenticated} currentUserId={user?.id} />
                    </div>

                </div>
            </div>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            <PostModal
                post={selectedPost}
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
            />
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
                    const users = Array.isArray(userData) ? userData : userData.results || []
                    setUserResults(users.slice(0, 4))
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
            <div className={`relative flex items-center bg-slate-800/80 rounded-2xl px-4 py-3 transition-colors ${isFocused ? "bg-slate-800 ring-1 ring-slate-700" : "hover:bg-slate-800"}`}>
                <Search className={`h-5 w-5 mr-3 transition-colors shrink-0 ${isFocused ? "text-slate-200" : "text-slate-500"}`} />
                <input
                    type="text"
                    placeholder="Search people, events..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="bg-transparent border-none outline-none flex-1 text-slate-200 placeholder:text-slate-500 text-sm"
                />
                {isSearching && <div className="w-4 h-4 rounded-full border-2 border-slate-500 border-t-slate-200 animate-spin shrink-0" />}
                {query && !isSearching && (
                    <button onClick={() => { setQuery(""); setUserResults([]); setEventResults([]) }} className="text-slate-500 hover:text-slate-300 shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {isFocused && (query.length >= 2) && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsFocused(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50">
                        {!hasResults && !isSearching && (
                            <div className="p-6 text-center text-slate-500 text-sm">No results for "{query}"</div>
                        )}

                        {userResults.length > 0 && (
                            <div>
                                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">People</p>
                                {userResults.map((u: any) => (
                                    <div
                                        key={u.id}
                                        onClick={() => { router.push(`/u/${u.username}`); setIsFocused(false) }}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/60 cursor-pointer transition-colors"
                                    >
                                        <img
                                            src={u.profile_picture ? (u.profile_picture.startsWith('http') ? u.profile_picture : `${API}${u.profile_picture}`) : `https://ui-avatars.com/api/?name=${u.username}&background=random`}
                                            className="w-9 h-9 rounded-full object-cover"
                                            alt={u.username}
                                        />
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <p className="text-sm font-semibold text-slate-200">{u.first_name} {u.last_name}</p>
                                                {u.is_verified && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                                            </div>
                                            <p className="text-xs text-slate-500">@{u.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {eventResults.length > 0 && (
                            <div className={userResults.length > 0 ? "border-t border-slate-800" : ""}>
                                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Events</p>
                                {eventResults.map((e: any) => (
                                    <div
                                        key={e.id}
                                        onClick={() => { router.push(`/events/${e.id}`); setIsFocused(false) }}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/60 cursor-pointer transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-200 truncate max-w-[280px]">{e.title}</p>
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

            const res = await fetch(url, {
                headers: token ? { Authorization: `Token ${token}` } : {}
            })

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

    const lastPostRef = useInfiniteScroll({
        callback: () => fetchPosts(false),
        isLoading: loading || loadingMore,
        hasMore: hasMore
    })

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-3 w-[100px]" />
                            </div>
                        </div>
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                ))}
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No posts yet. Be the first to post!</p>
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} handleAuthAction={handleAuthAction} onPostClick={onPostClick} />
            ))}

            {/* Sentinel */}
            <div ref={lastPostRef} className="h-10 flex items-center justify-center">
                {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
            </div>

            {!hasMore && posts.length > 0 && (
                <p className="text-center text-slate-600 text-sm py-4">You're all caught up!</p>
            )}
        </motion.div>
    )
}

// ── Events Feed ───────────────────────────────────────────────────────────────

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

    const lastEventRef = useInfiniteScroll({
        callback: () => fetchEvents(false),
        isLoading: loading || loadingMore,
        hasMore: hasMore
    })

    const filtered = filter === "all" ? events : events.filter(e => e.category === filter)

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                        <Skeleton className="h-36 w-full" />
                        <div className="p-4 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div>
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${filter === cat
                            ? "bg-white text-slate-950 border-white"
                            : "bg-transparent border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white"
                            }`}
                    >
                        {cat === "all" ? "All Events" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p>No {filter !== "all" ? filter : ""} events found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filtered.map((event, i) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                        >
                            <Link href={`/events/${event.id}`} className="block group">
                                <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-black/30">
                                    <div className="relative h-36 overflow-hidden">
                                        <img
                                            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600"}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                        <span className="absolute top-3 left-3 bg-slate-950/60 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                                            {event.category}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-200 text-base leading-tight truncate mb-2 group-hover:text-white transition-colors">{event.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(event.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="truncate max-w-[100px]">{event.location}</span>
                                            </span>
                                            <span className="flex items-center gap-1 ml-auto">
                                                <Users className="w-3.5 h-3.5" />
                                                {event.registration_count || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Sentinel */}
            <div ref={lastEventRef} className="h-10 flex items-center justify-center mt-4">
                {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
            </div>

            {!hasMore && events.length > 0 && (
                <p className="text-center text-slate-600 text-sm py-8">No more events to show.</p>
            )}
        </div>
    )
}

// ── People Feed ───────────────────────────────────────────────────────────────

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

    const lastPersonRef = useInfiniteScroll({
        callback: () => fetchPeople(false),
        isLoading: loading || loadingMore,
        hasMore: hasMore
    })

    const handleFollow = async (userId: number) => {
        if (!isAuthenticated) { handleAuthAction(() => { }); return }
        setPending(p => ({ ...p, [userId]: true }))
        try {
            const token = localStorage.getItem("sociaverse_token")
            const res = await fetch(`${API}/api/users/${userId}/follow/`, {
                method: "POST",
                headers: { Authorization: `Token ${token}` }
            })
            if (res.ok) {
                setFollowing(f => ({ ...f, [userId]: !f[userId] }))
            }
        } catch (e) {
            console.error(e)
        } finally {
            setPending(p => ({ ...p, [userId]: false }))
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex flex-col items-center gap-3">
                            <Skeleton className="w-20 h-20 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-9 w-full rounded-full" />
                        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {people.map((person, i) => (
                <motion.div
                    key={person.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col items-center text-center transition-colors"
                >
                    <Link href={`/u/${person.username}`} className="flex flex-col items-center mb-4 group">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-slate-700 group-hover:ring-blue-500 transition-all">
                            <img
                                src={person.profile_picture ? (person.profile_picture.startsWith('http') ? person.profile_picture : `${API}${person.profile_picture}`) : `https://ui-avatars.com/api/?name=${person.username}&background=random`}
                                alt={person.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                            <h3 className="font-bold text-base text-slate-200 group-hover:text-white transition-colors">
                                {person.first_name ? `${person.first_name} ${person.last_name || ""}`.trim() : person.username}
                            </h3>
                            {person.is_verified && <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500">@{person.username}</p>
                        {person.college && <p className="text-xs text-slate-600 mt-0.5">{person.college}</p>}
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className={`w-full rounded-full text-xs transition-all ${following[person.id]
                            ? "border-slate-600 text-slate-400 bg-slate-800"
                            : "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600"
                            }`}
                        disabled={pending[person.id]}
                        onClick={() => handleFollow(person.id)}
                    >
                        {pending[person.id] ? "..." : following[person.id] ? "Following" : "Follow"}
                    </Button>
                </motion.div>
            ))}

            {/* Sentinel */}
            <div ref={lastPersonRef} className="col-span-1 md:col-span-2 h-10 flex items-center justify-center mt-4">
                {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
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

    const lastCommunityRef = useInfiniteScroll({
        callback: () => fetchCommunities(false),
        isLoading: loading || loadingMore,
        hasMore: hasMore
    })

    const bannerImages = [
        "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1580843410763-48582e62a49f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1590642916589-59234a0a613c?auto=format&fit=crop&q=80&w=600",
    ]

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                        <Skeleton className="h-44 w-full" />
                    </div>
                ))}
            </div>
        )
    }

    if (communities.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No communities found yet.</p>
                <Link href="/community" className="mt-3 inline-flex items-center gap-1 text-sm text-blue-400 hover:underline">
                    Browse communities <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {communities.map((comm, i) => (
                <motion.div
                    key={comm.id || comm.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <Link href={`/community/${comm.slug}`} className="block group relative h-44 rounded-2xl overflow-hidden">
                        <img
                            src={comm.banner || comm.icon || bannerImages[i % bannerImages.length]}
                            alt={comm.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{comm.name}</h3>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="flex items-center gap-1 text-sm">
                                    <Users className="h-4 w-4 text-blue-400" />
                                    {comm.member_count || comm.members_count || 0} Members
                                </div>
                                {comm.college && (
                                    <div className="flex items-center gap-1 text-sm">
                                        <MapPin className="h-4 w-4 text-purple-400" />
                                        {comm.college}
                                    </div>
                                )}
                            </div>
                            {comm.description && (
                                <p className="text-slate-400 text-sm mt-2 line-clamp-1">{comm.description}</p>
                            )}
                        </div>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md p-3 rounded-full">
                            <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                    </Link>
                </motion.div>
            ))}

            {/* Sentinel */}
            <div ref={lastCommunityRef} className="h-10 flex items-center justify-center mt-4">
                {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
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
                // Defer this sidebar 800ms — let the main feed load first
                await new Promise(r => setTimeout(r, 800))
                const data: any[] = await cachedFetch(`${API}/api/users/search/?q=&limit=10`, { headers })
                const others = data.filter((u: any) => u.id !== currentUserId)
                setSuggestions(others.slice(0, 5))
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
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-4 text-slate-200">Who to Follow</h3>
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-9 h-9 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-2.5 w-16" />
                                </div>
                            </div>
                            <Skeleton className="h-7 w-16 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : suggestions.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No suggestions right now.</p>
            ) : (
                <div className="space-y-3">
                    {suggestions.map(user => (
                        <div key={user.id} className="flex items-center justify-between gap-2">
                            <Link href={`/u/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                                <img
                                    src={user.profile_picture ? (user.profile_picture.startsWith('http') ? user.profile_picture : `${API}${user.profile_picture}`) : `https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`}
                                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                                    alt={user.username}
                                />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1">
                                        <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                                            {user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.username}
                                        </p>
                                        {user.is_verified && <BadgeCheck className="w-3 h-3 text-blue-500 shrink-0" />}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                                </div>
                            </Link>
                            <Button
                                size="sm"
                                variant="outline"
                                className={`h-7 rounded-full border-slate-700 text-xs px-3 shrink-0 transition-all ${following[user.id]
                                    ? "text-slate-400 bg-slate-800 border-slate-600"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`}
                                disabled={pending[user.id]}
                                onClick={() => handleFollow(user.id)}
                            >
                                {pending[user.id] ? "..." : following[user.id] ? "Following" : "Follow"}
                            </Button>
                        </div>
                    ))}
                    <Link href="/explore" className="block text-center text-xs text-blue-400 hover:underline pt-1">Show more</Link>
                </div>
            )}
        </div>
    )
}

// ── Trending Communities Sidebar ──────────────────────────────────────────────

function TrendingCommunitiesSidebar() {
    const [communities, setCommunities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetch_ = async () => {
            try {
                // Defer sidebars by 800ms so main feed gets priority HTTP connections
                await new Promise(r => setTimeout(r, 800))

                // 1. Try dedicated trending endpoint
                const data = await cachedFetch(`${API}/api/communities/trending/`)
                const list = (Array.isArray(data) ? data : data.results || []).slice(0, 5)
                if (list.length > 0) { setCommunities(list); setLoading(false); return }
            } catch (_) { /* may not exist yet */ }

            // 2. Fallback: general list sorted by member count
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
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <Skeleton className="h-5 w-36 mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
                </div>
            </div>
        )
    }

    if (communities.length === 0) return null

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-4 text-slate-200">Trending Communities</h3>
            <div className="space-y-3">
                {communities.map((comm, i) => (
                    <Link href={`/community/${comm.slug}`} key={comm.id || comm.slug}>
                        <div className="flex items-center justify-between py-2 cursor-pointer group">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="text-xs font-bold text-slate-600 w-4 shrink-0">{i + 1}</span>
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-300 group-hover:text-blue-400 transition-colors text-sm truncate">{comm.name}</p>
                                    <p className="text-xs text-slate-500">{comm.member_count || 0} members</p>
                                </div>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
