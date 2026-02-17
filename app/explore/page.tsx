"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Users, GraduationCap, ArrowRight, Star, TrendingUp, Filter, MoreHorizontal, Heart, MessageCircle, Share2, BadgeCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AuthModal } from "@/components/auth-modal"
import Link from "next/link"

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState("For You")
    const { isAuthenticated } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) {
            setShowAuthModal(true)
        } else {
            action()
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Mobile Search - Visible only on small screens */}
                <div className="md:hidden mb-6">
                    <SearchBar />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Feed Area */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Desktop Search & Tabs - Sticky */}
                        <div className="hidden md:block sticky top-0 z-40 bg-slate-950 -mt-20 pt-24 pb-4 border-b border-slate-800/50 shadow-md">
                            <SearchBar />
                            <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
                                {["For You", "Trending", "People", "Universities", "Events"].map((tab) => (
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

                        {/* Content Feed */}
                        <div className="space-y-6 min-h-[50vh]">
                            <AnimatePresence mode="wait">
                                {activeTab === "For You" && (
                                    <motion.div key="foryou" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <ForYouFeed handleAuthAction={handleAuthAction} />
                                    </motion.div>
                                )}
                                {activeTab === "People" && (
                                    <motion.div key="people" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <PeopleFeed handleAuthAction={handleAuthAction} />
                                    </motion.div>
                                )}
                                {activeTab === "Universities" && (
                                    <motion.div key="unis" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <UniversitiesFeed />
                                    </motion.div>
                                )}
                                {/* Fallback for other tabs */}
                                {["Trending", "Events"].includes(activeTab) && (
                                    <motion.div key="other" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex flex-col items-center justify-center py-20 text-slate-500">
                                        <Search className="h-12 w-12 mb-4 opacity-20" />
                                        <p>More {activeTab} content coming soon...</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Sidebar - Trending & Who to Follow */}
                    <div className="hidden lg:block lg:col-span-4 space-y-6">
                        <TrendingSidebar />
                        <WhoToFollow handleAuthAction={handleAuthAction} />
                        <PremiumCard />
                    </div>

                </div>
            </div>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    )
}

// --- Components ---

function SearchBar() {
    const [isFocused, setIsFocused] = useState(false)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const router = useRouter()

    const handleSearch = async (val: string) => {
        setQuery(val)
        if (val.length > 1) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/search/?q=${val}`)
                if (res.ok) {
                    const data = await res.json()
                    setResults(data)
                }
            } catch (error) {
                console.error("Search error:", error)
            }
        } else {
            setResults([])
        }
    }

    const handleSelectUser = (username: string) => {
        router.push(`/u/${username}`)
        setIsFocused(false)
    }

    return (
        <div className="relative z-50">
            <div className={`relative flex items-center bg-slate-800/80 rounded-2xl px-4 py-3 transition-colors ${isFocused ? "bg-slate-800 ring-1 ring-slate-700" : "hover:bg-slate-800"}`}>
                <Search className={`h-5 w-5 mr-3 transition-colors ${isFocused ? "text-slate-200" : "text-slate-500"}`} />
                <input
                    type="text"
                    placeholder="Search people..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    // onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="bg-transparent border-none outline-none flex-1 text-slate-200 placeholder:text-slate-500 text-sm"
                />
                {query && (
                    <button onClick={() => { setQuery(""); setResults([]) }} className="text-slate-500 hover:text-slate-300">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isFocused && (query.length > 0 || results.length > 0) && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsFocused(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
                            <span className="font-semibold text-sm text-slate-200">Results</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {results.length > 0 ? (
                                results.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleSelectUser(user.username)}
                                        className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 cursor-pointer transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.profile_picture ? (user.profile_picture.startsWith('http') ? user.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture}`) : `https://ui-avatars.com/api/?name=${user.username}`}
                                                alt={user.username}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="text-left">
                                                <div className="flex items-center gap-1">
                                                    <p className="text-sm font-semibold text-slate-200">{user.first_name} {user.last_name}</p>
                                                    {user.is_verified && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                                                </div>
                                                <p className="text-xs text-slate-500">@{user.username}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-slate-500 text-sm">
                                    No users found.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

import { api, Post } from "@/services/api"
import { PostCard } from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect } from "react"

function ForYouFeed({ handleAuthAction }: { handleAuthAction: (action: () => void) => void }) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await api.getPosts()
                setPosts(data)
            } catch (error) {
                console.error("Failed to fetch posts:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

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
        return <div className="text-center py-20 text-slate-500">No posts yet. Be the first to post!</div>
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
        >
            {posts.map((post) => (
                <PostCard key={post.id} post={post} handleAuthAction={handleAuthAction} />
            ))}
        </motion.div>
    )
}

function PeopleFeed({ handleAuthAction }: { handleAuthAction: (action: () => void) => void }) {
    const people = [
        { name: "Jessica Wu", role: "UX Designer", uni: "Parsons", followers: "12k", gradient: "from-purple-500 to-indigo-500" },
        { name: "David Kim", role: "Founder", uni: "Stanford", followers: "8.5k", gradient: "from-blue-500 to-cyan-500" },
        { name: "Emily Blunt", role: "Researcher", uni: "Oxford", followers: "15k", gradient: "from-orange-500 to-red-500" },
        { name: "Michael Stark", role: "Engineer", uni: "MIT", followers: "5k", gradient: "from-slate-500 to-gray-500" },
        { name: "Sarah Connor", role: "Activist", uni: "Berkeley", followers: "22k", gradient: "from-green-500 to-emerald-500" },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {people.map((person, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center hover:border-slate-700 transition-colors"
                >
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${person.gradient} mb-4 p-1`}>
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-2xl font-bold">
                            {person.name[0]}
                        </div>
                    </div>
                    <h3 className="font-bold text-lg text-slate-200">{person.name}</h3>
                    <p className="text-blue-400 text-sm mb-1">{person.role}</p>
                    <p className="text-slate-500 text-xs mb-4">{person.uni} · {person.followers} followers</p>
                    <Button variant="outline" className="w-full rounded-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => handleAuthAction(() => { })}>
                        Follow
                    </Button>
                </motion.div>
            ))}
        </div>
    )
}

function UniversitiesFeed() {
    const unis = [
        { name: "Stanford", location: "USA", students: "16k", image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&q=80&w=500" },
        { name: "Oxford", location: "UK", students: "24k", image: "https://images.unsplash.com/photo-1580843410763-48582e62a49f?auto=format&fit=crop&q=80&w=500" },
        { name: "MIT", location: "USA", students: "11k", image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=500" },
        { name: "ETH Zurich", location: "Switzerland", students: "22k", image: "https://images.unsplash.com/photo-1590642916589-59234a0a613c?auto=format&fit=crop&q=80&w=500" },
    ]

    return (
        <div className="grid grid-cols-1 gap-6">
            {unis.map((uni, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer"
                >
                    <div className="absolute inset-0">
                        <img src={uni.image} alt={uni.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
                    </div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <h3 className="text-3xl font-bold text-white mb-2">{uni.name}</h3>
                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="flex items-center gap-1 text-sm">
                                <MapPin className="h-4 w-4 text-blue-400" /> {uni.location}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <Users className="h-4 w-4 text-purple-400" /> {uni.students} Students
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md p-3 rounded-full">
                        <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

function TrendingSidebar() {
    const trends = [
        { tag: "#Hackathon2025", posts: "24.5k posts" },
        { tag: "React 19", posts: "12k posts" },
        { tag: "FinalsWeek", posts: "89k posts" },
        { tag: "SummerInternships", posts: "45k posts" },
        { tag: "#CampusLife", posts: "32k posts" },
    ]

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-4 text-slate-200">Trending Now</h3>
            <div className="space-y-4">
                {trends.map((trend, i) => (
                    <div key={i} className="flex justify-between items-start group cursor-pointer">
                        <div>
                            <p className="font-bold text-slate-300 group-hover:text-blue-400 transition-colors">{trend.tag}</p>
                            <p className="text-xs text-slate-500">{trend.posts}</p>
                        </div>
                        <MoreHorizontal className="h-4 w-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
            <Button variant="link" className="text-blue-400 p-0 h-auto mt-4 text-sm">
                Show more
            </Button>
        </div>
    )
}

function WhoToFollow({ handleAuthAction }: { handleAuthAction: (action: () => void) => void }) {
    const suggestions = [
        { name: "TechCrunch", handle: "@techcrunch", initial: "TC", color: "bg-green-600" },
        { name: "Design Daily", handle: "@designdaily", initial: "DD", color: "bg-pink-600" },
        { name: "Code Newbie", handle: "@codenewbie", initial: "CN", color: "bg-purple-600" },
    ]

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-4 text-slate-200">Who to follow</h3>
            <div className="space-y-4">
                {suggestions.map((user, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center font-bold text-xs`}>
                                {user.initial}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-200 hover:underline cursor-pointer">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.handle}</p>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 rounded-full border-slate-700 text-xs" onClick={() => handleAuthAction(() => { })}>
                            Follow
                        </Button>
                    </div>
                ))}
            </div>
            <Button variant="link" className="text-blue-400 p-0 h-auto mt-4 text-sm">
                Show more
            </Button>
        </div>
    )
}

function PremiumCard() {
    return (
        <div className="relative overflow-hidden rounded-2xl p-6 border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
            <h3 className="relative z-10 font-bold text-lg mb-2">SociaVerse Premium</h3>
            <p className="relative z-10 text-sm text-slate-400 mb-4">Unlock exclusive badges, analytics, and more.</p>
            <Button className="relative z-10 w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none">
                Get Verified
            </Button>
        </div>
    )
}
