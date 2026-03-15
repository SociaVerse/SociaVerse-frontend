"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    Search, MapPin, Users, ArrowRight, BadgeCheck, X, Calendar,
    ExternalLink, Zap, Globe, Sparkles, Heart, MessageCircle,
    Link2, Bookmark, Loader2
} from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AuthModal } from "@/components/auth-modal"
import { Post } from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { PostModal } from "@/components/post-modal"
import { useToast } from "@/components/ui/custom-toast"
import { api } from "@/services/api"

const API = process.env.NEXT_PUBLIC_API_URL

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
    { label: "For You",     Icon: Zap,      glow: "rgba(16,185,129,0.35)",  chipClass: "from-emerald-500 to-teal-500",  textActive: "text-emerald-300", borderActive: "border-emerald-500/50" },
    { label: "Events",      Icon: Calendar, glow: "rgba(249,115,22,0.35)",  chipClass: "from-orange-500 to-amber-500",  textActive: "text-orange-300",  borderActive: "border-orange-500/50"  },
    { label: "People",      Icon: Users,    glow: "rgba(139,92,246,0.35)",  chipClass: "from-violet-500 to-purple-500", textActive: "text-violet-300",  borderActive: "border-violet-500/50"  },
    { label: "Communities", Icon: Globe,    glow: "rgba(59,130,246,0.35)",  chipClass: "from-blue-500 to-indigo-500",   textActive: "text-blue-300",    borderActive: "border-blue-500/50"    },
] as const

type TabLabel = (typeof TABS)[number]["label"]

const AVATAR_GRADIENTS = [
    "from-emerald-500 to-teal-500",
    "from-violet-500 to-purple-500",
    "from-orange-500 to-amber-500",
    "from-blue-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-cyan-500 to-sky-500",
]

// ── Masonry Card Wrapper ──────────────────────────────────────────────────────

interface MasonryCardProps {
    glowColor: string
    onClick?: () => void
    children: React.ReactNode
    overlay?: React.ReactNode
}

function MasonryCard({ glowColor, onClick, children, overlay }: MasonryCardProps) {
    const [hovered, setHovered] = useState(false)
    const [tapped, setTapped] = useState(false)
    const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleClick = (e: React.MouseEvent) => {
        if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
            e.preventDefault()
            if (tapped) {
                setTapped(false)
                onClick?.()
            } else {
                setTapped(true)
                if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
                tapTimerRef.current = setTimeout(() => setTapped(false), 3000)
            }
        } else {
            onClick?.()
        }
    }

    const showOverlay = hovered || tapped

    return (
        <div
            className="relative group rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer break-inside-avoid mb-2 sm:mb-3 bg-slate-900/50 backdrop-blur-md border transition-all duration-200"
            style={showOverlay ? {
                transform: "scale(1.03)",
                border: `1px solid ${glowColor.replace("0.35", "0.55")}`,
                boxShadow: `0 0 24px ${glowColor}, 0 8px 32px rgba(0,0,0,0.5)`,
            } : {
                transform: "scale(1)",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleClick}
        >
            {children}
            {overlay && (
                <div className={`absolute inset-0 transition-opacity duration-200 ${showOverlay ? "opacity-100" : "opacity-0"}`}>
                    {overlay}
                </div>
            )}
        </div>
    )
}

// ── Action Overlay ────────────────────────────────────────────────────────────

function ActionOverlay({ onLike, onComment, onShare, onSave, liked = false, saved = false, likeCount = 0, commentCount = 0 }: {
    onLike?: (e: React.MouseEvent) => void
    onComment?: (e: React.MouseEvent) => void
    onShare?: (e: React.MouseEvent) => void
    onSave?: (e: React.MouseEvent) => void
    liked?: boolean
    saved?: boolean
    likeCount?: number
    commentCount?: number
}) {
    return (
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex items-center gap-2.5">
                <button onClick={onLike}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all ${liked ? "bg-rose-500/30 border-rose-400/50 text-rose-300" : "bg-slate-800/70 border-white/10 text-slate-300 hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-rose-300"}`}>
                    <Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-400" : ""}`} />
                    {likeCount > 0 && <span>{likeCount}</span>}
                </button>
                <button onClick={onComment}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-slate-800/70 border border-white/10 text-slate-300 hover:bg-sky-500/20 hover:border-sky-400/40 hover:text-sky-300 transition-all backdrop-blur-sm">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {commentCount > 0 && <span>{commentCount}</span>}
                </button>
                <button onClick={onShare}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-slate-800/70 border border-white/10 text-slate-300 hover:bg-emerald-500/20 hover:border-emerald-400/40 hover:text-emerald-300 transition-all backdrop-blur-sm">
                    <Link2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={onSave}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all ${saved ? "bg-amber-500/30 border-amber-400/50 text-amber-300" : "bg-slate-800/70 border-white/10 text-slate-300 hover:bg-amber-500/20 hover:border-amber-400/40 hover:text-amber-300"}`}>
                    <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-amber-400" : ""}`} />
                </button>
            </div>
        </div>
    )
}

// ── Explore Page ──────────────────────────────────────────────────────────────

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState<TabLabel>("For You")
    const { isAuthenticated, user } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    
    // Lifted states for synchronization
    const [posts, setPosts] = useState<Post[]>([])
    const [liked, setLiked] = useState<Record<number, boolean>>({})
    const [likeCounts, setLikeCounts] = useState<Record<number, number>>({})
    
    const router = useRouter()

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) setShowAuthModal(true)
        else action()
    }

    const activeTabMeta = TABS.find(t => t.label === activeTab)!

    return (
        <div className="min-h-dvh bg-slate-950 text-slate-100 pt-16">
            {/* Ambient glow */}
            <div
                className="fixed inset-0 pointer-events-none transition-all duration-700 z-0"
                style={{ background: `radial-gradient(ellipse 80% 45% at 50% -10%, ${activeTabMeta.glow.replace("0.35","0.09")} 0%, transparent 70%)` }}
            />

            {/* Sticky header */}
            <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-2xl border-b border-white/5 shadow-sm shadow-black/20">
                <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6">
                    {/* Search bar row */}
                    <div className="flex items-center gap-3 py-3">
                        <div className="hidden md:flex items-center gap-1.5 shrink-0">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                            <span className="font-bold text-lg text-slate-100">🌍 Global Explore</span>
                        </div>
                        <div className="md:hidden flex items-center gap-1.5 shrink-0">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex-1"><SearchBar /></div>
                    </div>
                    {/* Tab chips */}
                    <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
                        {TABS.map(({ label, Icon }) => {
                            const meta = TABS.find(t => t.label === label)!
                            const isActive = activeTab === label
                            return (
                                <button key={label} onClick={() => setActiveTab(label)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border shrink-0 transition-all duration-200 ${isActive ? `bg-linear-to-r ${meta.chipClass} text-white border-transparent` : `bg-slate-900/60 ${meta.textActive} border-white/5 hover:bg-slate-800/60`}`}
                                    style={isActive ? { boxShadow: `0 0 16px ${meta.glow}` } : {}}>
                                    <Icon className="w-3.5 h-3.5" />{label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Feed area */}
            <div className="relative z-10 max-w-[1800px] mx-auto px-2 sm:px-3 lg:px-5 py-4">
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                        {activeTab === "For You" && (
                            <ForYouFeed 
                                handleAuthAction={handleAuthAction} 
                                isAuthenticated={isAuthenticated} 
                                onOpenPost={setSelectedPost}
                                posts={posts}
                                setPosts={setPosts}
                                liked={liked}
                                setLiked={setLiked}
                                likeCounts={likeCounts}
                                setLikeCounts={setLikeCounts}
                            />
                        )}
                        {activeTab === "Events" && <EventsFeed />}
                        {activeTab === "People" && (
                            <PeopleFeed handleAuthAction={handleAuthAction} isAuthenticated={isAuthenticated} currentUserId={user?.id} />
                        )}
                        {activeTab === "Communities" && <CommunitiesFeed isAuthenticated={isAuthenticated} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {selectedPost && <PostModal 
                post={selectedPost} 
                isOpen={!!selectedPost} 
                onClose={() => setSelectedPost(null)}
                isLiked={liked[selectedPost.id] ?? !!(selectedPost as any).is_liked}
                likeCount={likeCounts[selectedPost.id] ?? ((selectedPost as any).like_count || (selectedPost as any).likes_count || 0)}
                onLikeToggle={(isLiked, count) => {
                    setLiked((l: Record<number, boolean>) => ({ ...l, [selectedPost.id]: isLiked }))
                    setLikeCounts((c: Record<number, number>) => ({ ...c, [selectedPost.id]: count }))
                }}
                onCommentAdded={() => {
                    setPosts((currentPosts: Post[]) => currentPosts.map((p: Post) => {
                        if (p.id === selectedPost.id) {
                            return { ...p, comments_count: (p.comments_count || 0) + 1 }
                        }
                        return p;
                    }));
                }}
            />}
            {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
        </div>
    )
}

// ── Search Bar ────────────────────────────────────────────────────────────────

function SearchBar() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<{ users: any[]; events: any[] }>({ users: [], events: [] })
    const [loading, setLoading] = useState(false)
    const [focused, setFocused] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!query.trim()) { setResults({ users: [], events: [] }); return }
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem("sociaverse_token")
                const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {}
                const [uRes, eRes] = await Promise.all([
                    fetch(`${API}/api/users/search/?q=${encodeURIComponent(query)}`, { headers }),
                    fetch(`${API}/api/events/?search=${encodeURIComponent(query)}`, { headers }),
                ])
                const users = uRes.ok ? await uRes.json() : []
                const eventsData = eRes.ok ? await eRes.json() : []
                setResults({
                    users: (Array.isArray(users) ? users : users.results || []).slice(0, 4),
                    events: (Array.isArray(eventsData) ? eventsData : eventsData.results || []).slice(0, 3),
                })
            } catch { /* silent */ }
            finally { setLoading(false) }
        }, 300)
    }, [query])

    const hasResults = results.users.length > 0 || results.events.length > 0

    return (
        <div className="relative w-full">
            <div className={`flex items-center gap-2 bg-slate-900/60 border rounded-xl px-3 py-2 transition-all duration-200 ${focused ? "border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]" : "border-white/5 hover:border-white/10"}`}>
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 200)}
                    placeholder="Search people, events, communities…"
                    className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none" />
                {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400 shrink-0" />}
                {query && !loading && <button onClick={() => setQuery("")} className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"><X className="w-4 h-4" /></button>}
            </div>
            <AnimatePresence>
                {focused && query && hasResults && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
                        className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                        {results.users.length > 0 && (
                            <div>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 pt-3 pb-1">People</p>
                                {results.users.map(u => {
                                    const name = u.first_name ? `${u.first_name} ${u.last_name || ""}`.trim() : u.username
                                    return (
                                        <button key={u.id} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/60 transition-colors" onClick={() => router.push(`/u/${u.username}`)}>
                                            <img src={u.profile_picture ? (u.profile_picture.startsWith("http") ? u.profile_picture : `${API}${u.profile_picture}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=94a3b8`}
                                                className="w-7 h-7 rounded-full object-cover border border-white/10" alt={u.username} />
                                            <div className="text-left min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <p className="text-sm font-semibold text-slate-200 truncate">{name}</p>
                                                    {u.is_verified && <BadgeCheck className="w-3 h-3 text-blue-400 shrink-0" />}
                                                </div>
                                                <p className="text-xs text-slate-500">@{u.username}</p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                        {results.events.length > 0 && (
                            <div className={results.users.length > 0 ? "border-t border-white/5" : ""}>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 pt-3 pb-1">Events</p>
                                {results.events.map(ev => (
                                    <button key={ev.id} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/60 transition-colors text-left" onClick={() => router.push(`/events/${ev.id}`)}>
                                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                                            <Calendar className="w-3.5 h-3.5 text-orange-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-200 truncate">{ev.title || ev.name}</p>
                                            {ev.date && <p className="text-xs text-slate-500">{new Date(ev.date).toLocaleDateString()}</p>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="px-4 py-2.5 border-t border-white/5">
                            <button className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}>
                                See all results for &quot;{query}&quot; →
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ── For You Feed (Posts Masonry) ──────────────────────────────────────────────

function ForYouFeed({ 
    handleAuthAction, 
    isAuthenticated, 
    onOpenPost,
    posts,
    setPosts,
    liked,
    setLiked,
    likeCounts,
    setLikeCounts
}: {
    handleAuthAction: (fn: () => void) => void
    isAuthenticated: boolean
    onOpenPost: (post: Post) => void
    posts: Post[]
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>
    liked: Record<number, boolean>
    setLiked: React.Dispatch<React.SetStateAction<Record<number, boolean>>>
    likeCounts: Record<number, number>
    setLikeCounts: React.Dispatch<React.SetStateAction<Record<number, number>>>
}) {
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [saved, setSaved] = useState<Record<number, boolean>>({})
    const { toast } = useToast()

    const fetchPosts = useCallback(async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return
        if (isInitial) setLoading(true); else setLoadingMore(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {}
            const url = isInitial ? `${API}/api/posts/?visibility=global` : nextUrl
            if (!url) return
            const res = await fetch(url, { headers })
            if (res.ok) {
                const data = await res.json()
                const results: Post[] = data.results || data
                setPosts(prev => isInitial ? results : [...prev, ...results])
                setNextUrl(data.next || null)
                setHasMore(!!data.next)
            }
        } catch(e) { console.error(e) }
        finally { setLoading(false); setLoadingMore(false) }
    }, [hasMore, loadingMore, nextUrl])

    useEffect(() => { fetchPosts(true) }, [])
    const lastPostRef = useInfiniteScroll({ callback: () => fetchPosts(false), isLoading: loading || loadingMore, hasMore })

    const handleLike = async (e: React.MouseEvent, post: Post) => {
        e.stopPropagation()
        handleAuthAction(async () => {
            const isCurrentlyLiked = liked[post.id] ?? !!(post as any).is_liked
            const currentCount = likeCounts[post.id] ?? ((post as any).like_count || (post as any).likes_count || 0)
            
            // Optimistic update
            setLiked(l => ({ ...l, [post.id]: !isCurrentlyLiked }))
            setLikeCounts(c => ({ ...c, [post.id]: isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1 }))
            
            try {
                await api.likePost(post.id)
            } catch(e) { 
                console.error(e) 
                // Revert on error
                setLiked(l => ({ ...l, [post.id]: isCurrentlyLiked }))
                setLikeCounts(c => ({ ...c, [post.id]: currentCount }))
            }
        })
    }

    const handleShare = (e: React.MouseEvent, postId: number) => {
        e.stopPropagation()
        const url = `${window.location.origin}/post/${postId}`
        navigator.clipboard?.writeText(url)
        toast({
            type: "success",
            title: "Link Copied!",
            message: "Post link has been copied to your clipboard.",
            duration: 3000
        })
        api.sharePost(postId).catch(e => console.error("Failed to register share", e))
    }

    const handleSave = (e: React.MouseEvent, postId: number) => {
        e.stopPropagation()
        handleAuthAction(() => {
            setSaved(s => {
                const isCurrentlySaved = s[postId]
                if (!isCurrentlySaved) {
                    toast({
                        type: "success",
                        title: "Saved to Bookmarks",
                        message: "This post has been saved to your collection.",
                        duration: 3000
                    })
                } else {
                    toast({
                        type: "info",
                        title: "Removed",
                        message: "Post removed from bookmarks.",
                        duration: 3000
                    })
                }
                return { ...s, [postId]: !isCurrentlySaved }
            })
        })
    }

    const HEIGHTS = ["h-72", "h-56", "h-64", "h-48", "h-80", "h-52"]

    if (loading && posts.length === 0) return (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-3 sm:gap-4">
            {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-3 sm:mb-4 rounded-xl overflow-hidden bg-slate-900/40 border border-white/5">
                    <Skeleton className={`w-full ${HEIGHTS[i % HEIGHTS.length]}`} />
                    <div className="p-3 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-2.5 w-1/2" /></div>
                </div>
            ))}
        </div>
    )

    if (posts.length === 0) return (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <Sparkles className="w-14 h-14 mb-5 opacity-20" />
            <p className="font-semibold text-xl">Nothing here yet</p>
            <p className="text-sm mt-2 text-slate-600">Follow people to see their posts</p>
        </div>
    )

    return (
        <div>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-3 sm:gap-4">
                {posts.map((post, i) => {
                    const imagesArr = (post as any).images || []
                    const hasImage = imagesArr.length > 0 || !!(post as any).image || !!(post as any).media_url
                    const imageUrl = imagesArr.length > 0 ? imagesArr[0].image : ((post as any).image || (post as any).media_url)
                    const actualImgUrl = imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `${API}${imageUrl}`) : ""
                    const authorName = (post as any).author_name || (post as any).author?.username || "Unknown"
                    const authorAvatar = (post as any).author_avatar || (post as any).author?.profile_picture
                    const isLiked = liked[post.id] ?? !!(post as any).is_liked
                    const isSaved = saved[post.id] ?? false
                    const likeCount = likeCounts[post.id] ?? ((post as any).like_count || (post as any).likes_count || 0)
                    const commentCount = (post as any).comment_count || (post as any).comments_count || 0
                    
                    return (
                        <motion.div key={post.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                            <MasonryCard glowColor="rgba(16,185,129,0.35)" onClick={() => onOpenPost(post)}
                                overlay={<ActionOverlay liked={isLiked} saved={isSaved} likeCount={likeCount} commentCount={commentCount}
                                    onLike={e => handleLike(e, post)}
                                    onComment={e => { e.stopPropagation(); onOpenPost(post) }}
                                    onShare={e => handleShare(e, post.id)}
                                    onSave={e => handleSave(e, post.id)} />}>
                                {hasImage && (
                                    <div className="w-full relative bg-slate-900/40">
                                        <img src={actualImgUrl}
                                            alt="post" className="w-full h-auto max-h-[600px] object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                    </div>
                                )}
                                <div className={`p-4 sm:p-5 bg-slate-900/80 ${!hasImage ? "min-h-[140px] flex flex-col justify-between" : ""}`}>
                                    {(post as any).content && (
                                        <p className={`text-slate-100 text-[14px] leading-relaxed mb-4 ${hasImage ? "line-clamp-3" : "line-clamp-10"}`}>
                                            {(post as any).content}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2.5">
                                        <img src={authorAvatar ? (authorAvatar.startsWith("http") ? authorAvatar : `${API}${authorAvatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0f172a&color=94a3b8`}
                                            alt={authorName} className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0" />
                                        <span className="text-sm text-slate-300 font-medium truncate">{authorName}</span>
                                        <div className="ml-auto flex items-center gap-2.5 text-xs text-slate-500 shrink-0">
                                            {likeCount > 0 && <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{likeCount}</span>}
                                            {commentCount > 0 && <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{commentCount}</span>}
                                        </div>
                                    </div>
                                </div>
                            </MasonryCard>
                        </motion.div>
                    )
                })}
            </div>
            <div ref={lastPostRef} className="h-12 flex items-center justify-center mt-3">
                {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />}
            </div>
        </div>
    )
}

// ── Events Feed (Masonry) ─────────────────────────────────────────────────────

const EVENT_CATEGORIES = [
    { label: "All", emoji: "✨" }, { label: "Music", emoji: "🎵" }, { label: "Tech", emoji: "💻" },
    { label: "Sports", emoji: "⚽" }, { label: "Arts", emoji: "🎨" }, { label: "Food", emoji: "🍕" },
    { label: "Gaming", emoji: "🎮" }, { label: "Education", emoji: "📚" },
]

function EventsFeed() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [category, setCategory] = useState("All")
    const router = useRouter()

    const fetchEvents = useCallback(async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return
        if (isInitial) setLoading(true); else setLoadingMore(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {}
            const catParam = category !== "All" ? `&category=${encodeURIComponent(category)}` : ""
            const url = isInitial ? `${API}/api/events/?limit=20${catParam}&visibility=global` : nextUrl
            if (!url) return
            const res = await fetch(url, { headers })
            if (res.ok) {
                const data = await res.json()
                const results = data.results || data
                setEvents(prev => isInitial ? results : [...prev, ...results])
                setNextUrl(data.next || null)
                setHasMore(!!data.next)
            }
        } catch(e) { console.error(e) }
        finally { setLoading(false); setLoadingMore(false) }
    }, [category, hasMore, loadingMore, nextUrl])

    useEffect(() => { fetchEvents(true) }, [])
    const lastEventRef = useInfiniteScroll({ callback: () => fetchEvents(false), isLoading: loading || loadingMore, hasMore })

    const EHEIGHTS = ["h-64", "h-52", "h-72", "h-56", "h-68", "h-48"]
    const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""

    if (loading && events.length === 0) return (
        <div>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
                {EVENT_CATEGORIES.map((_, i) => <Skeleton key={i} className="h-9 w-20 rounded-full shrink-0" />)}
            </div>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-3 sm:gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="break-inside-avoid mb-3 sm:mb-4 rounded-xl overflow-hidden bg-slate-900/40 border border-white/5">
                        <Skeleton className={`w-full ${EHEIGHTS[i % EHEIGHTS.length]}`} />
                        <div className="p-3 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-2.5 w-1/2" /></div>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div>
            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
                {EVENT_CATEGORIES.map(({ label, emoji }) => (
                    <button key={label} onClick={() => setCategory(label)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border shrink-0 transition-all ${category === label ? "bg-linear-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-[0_0_12px_rgba(249,115,22,0.35)]" : "bg-slate-900/60 text-slate-400 border-white/5 hover:border-orange-500/30 hover:text-orange-300"}`}>
                        <span>{emoji}</span>{label}
                    </button>
                ))}
            </div>
            {events.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium">No events found</p>
                </div>
            ) : (
                <div>
                    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-3 sm:gap-4">
                        {events.map((event, i) => {
                            const imageUrl = event.cover_image || event.image || event.banner
                            const title = event.title || event.name
                            const dateStr = fmtDate(event.date || event.start_date || event.event_date)
                            return (
                                <motion.div key={event.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                                    <MasonryCard glowColor="rgba(249,115,22,0.35)" onClick={() => router.push(`/events/${event.id}`)}
                                        overlay={
                                            <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex items-center justify-center">
                                                <button onClick={e => { e.stopPropagation(); router.push(`/events/${event.id}`) }}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-sm font-semibold hover:bg-orange-500/30 transition-all">
                                                    <ExternalLink className="w-3.5 h-3.5" />View Event
                                                </button>
                                            </div>
                                        }>
                                        {imageUrl ? (
                                            <div className="relative w-full bg-slate-900/40">
                                                <img src={imageUrl.startsWith("http") ? imageUrl : `${API}${imageUrl}`}
                                                    alt={title} className="w-full h-auto max-h-[600px] object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                                <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
                                                {dateStr && <div className="absolute top-2.5 right-2.5 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg">{dateStr}</div>}
                                            </div>
                                        ) : (
                                            <div className={`relative w-full bg-linear-to-br from-orange-500/10 to-amber-500/5 flex items-center justify-center ${EHEIGHTS[(i + 2) % EHEIGHTS.length]}`}>
                                                <Calendar className="w-12 h-12 text-orange-500/30" />
                                                {dateStr && <div className="absolute top-2.5 right-2.5 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[10px] font-bold px-2 py-1 rounded-lg">{dateStr}</div>}
                                            </div>
                                        )}
                                        <div className="p-3 bg-slate-900/80">
                                            <h3 className="font-bold text-sm text-slate-200 line-clamp-2 mb-1">{title}</h3>
                                            {event.location && <p className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5 shrink-0" /><span className="truncate">{event.location}</span></p>}
                                            {event.category && <span className="mt-1.5 inline-block text-[10px] font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">{event.category}</span>}
                                        </div>
                                    </MasonryCard>
                                </motion.div>
                            )
                        })}
                    </div>
                    <div ref={lastEventRef} className="h-12 flex items-center justify-center mt-3">
                        {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-orange-400" />}
                    </div>
                </div>
            )}
        </div>
    )
}

// ── People Feed (Masonry) ─────────────────────────────────────────────────────

function PeopleFeed({ handleAuthAction, isAuthenticated, currentUserId }: {
    handleAuthAction: (fn: () => void) => void
    isAuthenticated: boolean
    currentUserId?: number
}) {
    const [people, setPeople] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [following, setFollowing] = useState<Record<number, boolean>>({})
    const [pending, setPending] = useState<Record<number, boolean>>({})
    const router = useRouter()

    const fetchPeople = useCallback(async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return
        if (isInitial) setLoading(true); else setLoadingMore(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {}
            const url = isInitial ? `${API}/api/users/search/?q=` : nextUrl
            if (!url) return
            const res = await fetch(url, { headers })
            if (res.ok) {
                const data = await res.json()
                const results: any[] = Array.isArray(data) ? data : data.results || []
                const filtered = results.filter((u: any) => u.id !== currentUserId)
                setPeople(prev => isInitial ? filtered : [...prev, ...filtered])
                setNextUrl(data.next || null)
                setHasMore(!!data.next)
            }
        } catch(e) { console.error(e) }
        finally { setLoading(false); setLoadingMore(false) }
    }, [hasMore, loadingMore, nextUrl, currentUserId])

    useEffect(() => { fetchPeople(true) }, [])
    const lastPersonRef = useInfiniteScroll({ callback: () => fetchPeople(false), isLoading: loading || loadingMore, hasMore })

    const handleFollow = (userId: number) => {
        handleAuthAction(async () => {
            setPending(p => ({ ...p, [userId]: true }))
            try {
                const token = localStorage.getItem("sociaverse_token")
                await fetch(`${API}/api/users/${userId}/follow/`, { method: "POST", headers: { Authorization: `Token ${token}` } })
                setFollowing(f => ({ ...f, [userId]: !f[userId] }))
            } catch(e) { console.error(e) }
            finally { setPending(p => ({ ...p, [userId]: false })) }
        })
    }

    const PHEIGHTS = ["h-64", "h-48", "h-56", "h-52", "h-72"]

    if (loading && people.length === 0) return (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-3 sm:mb-4 rounded-xl overflow-hidden bg-slate-900/40 border border-white/5">
                    <Skeleton className={`w-full ${PHEIGHTS[i % PHEIGHTS.length]}`} />
                    <div className="p-3 space-y-2 text-center">
                        <Skeleton className="h-3 w-2/3 mx-auto" /><Skeleton className="h-2.5 w-1/2 mx-auto" /><Skeleton className="h-7 w-full rounded-full mt-1" />
                    </div>
                </div>
            ))}
        </div>
    )

    if (people.length === 0) return (
        <div className="text-center py-24 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No users found</p>
        </div>
    )

    return (
        <div>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-3 sm:gap-4">
                {people.map((person, i) => {
                    const isFollowing = following[person.id]
                    const isPending = pending[person.id]
                    const gradClass = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                    const displayName = person.first_name ? `${person.first_name} ${person.last_name || ""}`.trim() : person.username
                    return (
                        <motion.div key={person.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                            <MasonryCard glowColor="rgba(139,92,246,0.35)" onClick={() => router.push(`/u/${person.username}`)}
                                overlay={
                                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4">
                                        <button onClick={e => { e.stopPropagation(); router.push(`/u/${person.username}`) }}
                                            className="text-sm font-bold text-white hover:text-violet-300 transition-colors">
                                            View Profile →
                                        </button>
                                        <button onClick={e => { e.stopPropagation(); handleFollow(person.id) }} disabled={isPending}
                                            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border ${isFollowing ? "border-slate-600 text-slate-400 bg-slate-800/70 hover:border-red-500/40 hover:text-red-400" : "border-violet-400/50 text-violet-300 bg-violet-500/20 hover:bg-violet-500/30"}`}>
                                            {isPending ? "..." : isFollowing ? "Following ✓" : "+ Follow"}
                                        </button>
                                    </div>
                                }>
                                <div className={`relative w-full overflow-hidden ${PHEIGHTS[i % PHEIGHTS.length]} bg-linear-to-br ${gradClass}`}>
                                    <img src={person.profile_picture ? (person.profile_picture.startsWith("http") ? person.profile_picture : `${API}${person.profile_picture}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0f172a&color=94a3b8&size=400`}
                                        alt={displayName} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />
                                </div>
                                <div className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 mb-0.5">
                                        <p className="font-bold text-sm text-slate-200 truncate max-w-[120px]">{displayName}</p>
                                        {person.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">@{person.username}</p>
                                    {person.college && <p className="text-[10px] text-slate-600 mt-1 truncate">{person.college}</p>}
                                </div>
                            </MasonryCard>
                        </motion.div>
                    )
                })}
            </div>
            <div ref={lastPersonRef} className="h-12 flex items-center justify-center mt-3">
                {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-violet-400" />}
            </div>
        </div>
    )
}

// ── Communities Feed (Masonry) ────────────────────────────────────────────────

function CommunitiesFeed({ isAuthenticated }: { isAuthenticated: boolean }) {
    const [communities, setCommunities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)

    const fetchCommunities = useCallback(async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return
        if (isInitial) setLoading(true); else setLoadingMore(true)
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
        } catch(e) { console.error(e) }
        finally { setLoading(false); setLoadingMore(false) }
    }, [hasMore, loadingMore, nextUrl])

    useEffect(() => { fetchCommunities(true) }, [])
    const lastCommunityRef = useInfiniteScroll({ callback: () => fetchCommunities(false), isLoading: loading || loadingMore, hasMore })

    const router = useRouter()
    const FALLBACK_BANNERS = [
        "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1580843410763-48582e62a49f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1590642916589-59234a0a613c?auto=format&fit=crop&q=80&w=600",
    ]
    const CHEIGHTS = ["h-56", "h-44", "h-64", "h-52", "h-60", "h-48"]

    if (loading && communities.length === 0) return (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-3 sm:mb-4 rounded-xl overflow-hidden bg-slate-900/40 border border-white/5">
                    <Skeleton className={`w-full ${CHEIGHTS[i % CHEIGHTS.length]}`} />
                    <div className="p-3 space-y-2"><Skeleton className="h-3 w-2/3" /><Skeleton className="h-2.5 w-1/2" /></div>
                </div>
            ))}
        </div>
    )

    if (communities.length === 0) return (
        <div className="text-center py-24 text-slate-500">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No communities yet</p>
            <Link href="/community" className="mt-3 inline-flex items-center gap-1 text-sm text-blue-400 hover:underline">
                Browse communities <ArrowRight className="w-3 h-3" />
            </Link>
        </div>
    )

    return (
        <div>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-3 sm:gap-4">
                {communities.map((comm, i) => (
                    <motion.div key={comm.id || comm.slug} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                        <MasonryCard glowColor="rgba(59,130,246,0.35)" onClick={() => router.push(`/community/${comm.slug}`)}
                            overlay={
                                <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex items-center justify-center">
                                    <button onClick={e => { e.stopPropagation(); router.push(`/community/${comm.slug}`) }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-sm font-semibold hover:bg-blue-500/30 transition-all">
                                        <Globe className="w-3.5 h-3.5" />Join Community
                                    </button>
                                </div>
                            }>
                            <div className={`relative w-full overflow-hidden ${CHEIGHTS[i % CHEIGHTS.length]}`}>
                                <img src={comm.banner || comm.icon || FALLBACK_BANNERS[i % FALLBACK_BANNERS.length]}
                                    alt={comm.name} className="w-full h-full object-cover transition-transform duration-500" />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-blue-300 border border-blue-500/20">
                                    <Users className="w-2.5 h-2.5" />{(comm.member_count || comm.members_count || 0).toLocaleString()}
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-sm text-slate-200 mb-1 truncate">{comm.name}</h3>
                                {comm.description && <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{comm.description}</p>}
                                {comm.college && <p className="text-[10px] text-slate-600 mt-1.5 flex items-center gap-1"><MapPin className="w-2.5 h-2.5 shrink-0" />{comm.college}</p>}
                            </div>
                        </MasonryCard>
                    </motion.div>
                ))}
            </div>
            <div ref={lastCommunityRef} className="h-12 flex items-center justify-center mt-3">
                {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-blue-400" />}
            </div>
        </div>
    )
}
