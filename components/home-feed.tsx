"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Image as ImageIcon, Smile, MoreHorizontal, TrendingUp, Search, Bell, Compass, Users, ShoppingBag, CalendarDays } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { api, Post } from "@/services/api"
import { PostCard } from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { Loader2 } from "lucide-react"

export function HomeFeed() {
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou")
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) return router.push("/login")
        action()
    }

    const fetchPosts = async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return

        if (isInitial) {
            setLoading(true)
        } else {
            setLoadingMore(true)
        }

        try {
            // StandardPagination returns { results, next }
            // For now api.getPosts() returns just data. We need to check if it handles params.
            // Let's assume we can pass params or it returns the full object now after backend change.
            const token = localStorage.getItem("sociaverse_token")
            const url = isInitial
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/posts/`
                : nextCursor

            if (!url) return

            const response = await fetch(url, {
                headers: {
                    'Authorization': token ? `Token ${token}` : ''
                }
            })

            if (response.ok) {
                const data = await response.json()
                const newPosts = data.results || data

                if (isInitial) {
                    setPosts(newPosts)
                } else {
                    setPosts(prev => [...prev, ...newPosts])
                }

                setNextCursor(data.next || null)
                setHasMore(!!data.next)
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        setPosts([])
        setHasMore(true)
        setNextCursor(null)
        fetchPosts(true)
    }, [activeTab])

    const lastPostRef = useInfiniteScroll({
        callback: () => fetchPosts(false),
        isLoading: loading || loadingMore,
        hasMore: hasMore
    })

    useEffect(() => {
        // Force scroll to top on mount to fix scroll restoration issues
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 md:pb-0 pt-16 md:pt-16">
            <div className="max-w-7xl mx-auto px-0 md:px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

                    {/* Main Feed Area */}
                    <div className="lg:col-span-8 border-x border-slate-800/50 min-h-screen bg-slate-950/50">

                        {/* Feed Header - Sticky - adjusted top to clear navbar */}
                        <div className="sticky top-16 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="md:hidden">
                                    <Link href={`/u/${user?.username}`}>
                                        <div className="p-[2px] rounded-full bg-gradient-to-tr from-blue-500 to-purple-500">
                                            <Avatar className="h-8 w-8 border-2 border-slate-950">
                                                <AvatarImage src={user?.profile_picture || ""} className="object-cover" />
                                                <AvatarFallback className="bg-slate-800 text-xs">{user?.username?.[0]}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </Link>
                                </div>
                                <div className="flex gap-6 mx-auto md:mx-0">
                                    <button
                                        onClick={() => setActiveTab("foryou")}
                                        className={`relative px-2 py-3 text-sm font-bold transition-colors ${activeTab === 'foryou' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        For You
                                        {activeTab === 'foryou' && (
                                            <motion.div layoutId="feedTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("following")}
                                        className={`relative px-2 py-3 text-sm font-bold transition-colors ${activeTab === 'following' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Following
                                        {activeTab === 'following' && (
                                            <motion.div layoutId="feedTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
                                        )}
                                    </button>
                                </div>
                                <div className="w-8 md:hidden"></div> {/* Spacer for balance */}
                            </div>
                        </div>

                        <div className="p-4 space-y-6">

                            {/* Welcome Heading */}
                            <div className="mb-2">
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
                                    Welcome back, {user?.first_name || "Adventurer"}!
                                </h1>
                                <p className="text-slate-400 text-sm font-medium mt-1">See what's happening in your verse ✨</p>
                            </div>

                            {/* Discover Widget */}
                            <DiscoverWidget />

                            {/* Compose Box Trigger */}
                            <div
                                onClick={() => router.push("/create")}
                                className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-4 cursor-pointer hover:bg-slate-900/50 transition-all flex gap-4 items-center group backdrop-blur-sm"
                            >
                                <Link href={`/u/${user?.username}`}>
                                    <Avatar className="h-10 w-10 border border-slate-700/50 hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer">
                                        <AvatarImage src={user?.profile_picture || ""} className="object-cover" />
                                        <AvatarFallback className="bg-slate-800">{user?.username?.[0]}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex-1 bg-slate-950/30 rounded-full h-11 flex items-center px-5 text-slate-500 text-sm group-hover:text-slate-400 transition-colors border border-slate-800/30 group-hover:border-slate-700/50">
                                    What's happening?
                                </div>
                                <div className="flex gap-2 text-blue-500/70 group-hover:text-blue-400 transition-colors pr-2">
                                    <ImageIcon className="h-5 w-5" />
                                </div>
                            </div>

                            {/* Posts Feed */}
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <div className="space-y-6 pt-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-slate-900/20 border border-slate-800/50 rounded-3xl p-6 space-y-4">
                                                <div className="flex gap-4">
                                                    <Skeleton className="h-12 w-12 rounded-full" />
                                                    <div className="space-y-2 flex-1">
                                                        <Skeleton className="h-4 w-[200px]" />
                                                        <Skeleton className="h-3 w-[100px]" />
                                                    </div>
                                                </div>
                                                <Skeleton className="h-48 w-full rounded-2xl" />
                                            </div>
                                        ))}
                                    </div>
                                ) : posts.length > 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 pb-20"
                                    >
                                        {posts.map((post) => (
                                            <PostCard key={post.id} post={post} handleAuthAction={handleAuthAction} />
                                        ))}

                                        {/* Sentinel for Infinite Scroll */}
                                        <div ref={lastPostRef} className="h-10 flex items-center justify-center break-inside-avoid w-full col-span-full">
                                            {loadingMore && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-20">
                                        <p className="text-slate-500 mb-4">No posts yet.</p>
                                        <Link href="/create">
                                            <Button variant="outline" className="rounded-full">Create your first post</Button>
                                        </Link>
                                    </div>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>

                    {/* Right Sidebar - Desktop Only */}
                    <div className="hidden lg:block lg:col-span-4 py-8 px-4 space-y-8 sticky top-20 h-fit">

                        {/* Search in Sidebar */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                placeholder="Search SociaVerse"
                                className="pl-11 h-12 rounded-full bg-slate-900/30 border-slate-800/60 focus:bg-slate-900/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
                            />
                        </div>

                        {/* Trending Topic Card */}
                        <div className="bg-slate-900/20 border border-slate-800/40 rounded-3xl overflow-hidden p-6 backdrop-blur-sm">
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-200">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                Trending
                            </h3>
                            <div className="space-y-5">
                                {[
                                    { tag: "#Hackathon2025", count: "12.5K posts" },
                                    { tag: "Midterms", count: "8.2K posts" },
                                    { tag: "CampusFest", count: "5.1K posts" },
                                    { tag: "#Internships", count: "3.4K posts" },
                                ].map((topic, i) => (
                                    <div key={i} className="flex justify-between items-center group cursor-pointer">
                                        <div>
                                            <p className="font-bold text-slate-300 group-hover:text-blue-400 transition-colors">{topic.tag}</p>
                                            <p className="text-xs text-slate-500 font-medium">{topic.count}</p>
                                        </div>
                                        <MoreHorizontal className="h-4 w-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Who to Follow */}
                        <div className="bg-slate-900/20 border border-slate-800/40 rounded-3xl overflow-hidden p-6 backdrop-blur-sm">
                            <h3 className="font-bold text-xl mb-6 text-slate-200">Who to follow</h3>
                            <div className="space-y-5">
                                {[
                                    { name: "Dev Club", handle: "@devclub_official", img: "https://ui-avatars.com/api/?name=DC&background=random" },
                                    { name: "Sarah J.", handle: "@sarah_des", img: "https://ui-avatars.com/api/?name=SJ&background=random" },
                                    { name: "Tech Talk", handle: "@techtalks", img: "https://ui-avatars.com/api/?name=TT&background=random" },
                                ].map((u, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex gap-3 items-center">
                                            <Avatar className="h-10 w-10 border border-slate-800">
                                                <AvatarImage src={u.img} />
                                                <AvatarFallback>{u.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-sm text-slate-200 truncate">{u.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{u.handle}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-8 rounded-full text-xs px-4 bg-slate-900/50 border-slate-700/50 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all">Follow</Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

function DiscoverWidget() {
    const router = useRouter()

    const tiles = [
        {
            icon: Compass,
            label: "Explore",
            sub: "Trending now",
            href: "/explore",
            gradient: "from-blue-600 to-sky-500",
            glow: "shadow-blue-500/30",
        },
        {
            icon: CalendarDays,
            label: "Events",
            sub: "What's on",
            href: "/events",
            gradient: "from-violet-600 to-purple-500",
            glow: "shadow-violet-500/30",
        },
        {
            icon: Users,
            label: "Community",
            sub: "Find your crew",
            href: "/community",
            gradient: "from-emerald-600 to-teal-500",
            glow: "shadow-emerald-500/30",
        },
        {
            icon: ShoppingBag,
            label: "Marketplace",
            sub: "Buy & sell",
            href: "/marketplace",
            gradient: "from-orange-500 to-amber-400",
            glow: "shadow-orange-500/30",
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/30 p-5 backdrop-blur-sm"
        >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full bg-blue-600/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-purple-600/5 blur-3xl" />

            <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-white">Explore Your Verse</h3>
                        <p className="mt-0.5 text-xs text-slate-500">Jump into the action</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {[0, 150, 300].map((delay) => (
                            <span
                                key={delay}
                                className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500"
                                style={{ animationDelay: `${delay}ms` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {tiles.map((tile, i) => (
                        <motion.button
                            key={tile.href}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.06 * i, duration: 0.3 }}
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.93 }}
                            onClick={() => router.push(tile.href)}
                            className="flex flex-col items-center gap-2 group focus:outline-none"
                        >
                            <div
                                className={`relative flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${tile.gradient} shadow-lg ${tile.glow} transition-all duration-300 group-hover:shadow-xl`}
                            >
                                <tile.icon className="h-6 w-6 text-white drop-shadow" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors leading-tight text-center">
                                {tile.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
