"use client"

import { useState, useEffect, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    User, MapPin, Link as LinkIcon, Share2, Lock,
    Calendar, Briefcase, Heart, MessageCircle, MoreHorizontal,
    BadgeCheck, Loader2, X, UserPlus, MessageSquare, Check
} from "lucide-react"
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa"
import { useToast } from "@/components/ui/custom-toast"
import Link from "next/link"
import { UserList } from "@/components/user-list"
import { PostCard } from "@/components/post-card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ban, EyeOff, Flag } from "lucide-react"

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params)
    const { isAuthenticated, user: currentUser } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("Posts")
    const { toast } = useToast()

    // State
    const [profile, setProfile] = useState({
        id: 0,
        name: "",
        username: "",
        bio: "",
        location: "",
        website: "",
        gender: "",
        social_links: {} as any,
        is_private: false,
        followers_count: 0,
        following_count: 0,
        avatar: null as string | null,
        banner: null as string | null,
        joined: "",
        role: "Member",
        is_verified: false,
        is_blocked: false,
        is_restricted: false,
    })
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [followStatus, setFollowStatus] = useState<'none' | 'pending' | 'accepted' | 'self'>('none')
    const [isFollowLoading, setIsFollowLoading] = useState(false)

    useEffect(() => {
        if (username) {
            fetchProfile()
        }
    }, [username, isAuthenticated])

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            const headers: HeadersInit = {}
            if (token) headers['Authorization'] = `Token ${token}`

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/u/${username}/`, { headers })

            if (response.ok) {
                const data = await response.json()
                setProfile({
                    id: data.id,
                    name: `${data.first_name} ${data.last_name}`.trim() || data.username,
                    username: data.username,
                    bio: data.bio || "",
                    location: data.location || "",
                    website: data.website || "",
                    gender: data.gender || "",
                    social_links: data.social_links || {},
                    is_private: data.is_private || false,
                    followers_count: data.followers_count || 0,
                    following_count: data.following_count || 0,
                    avatar: data.profile_picture || null,
                    banner: data.banner_image || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000",
                    joined: "February 2026",
                    role: data.is_verified ? "Verified User" : "Member",
                    is_verified: data.is_verified,
                    is_blocked: data.is_blocked || false,
                    is_restricted: data.is_restricted || false,
                })
                setFollowStatus(data.follow_status || 'none')
            } else {
                toast({ title: "Error", message: "User not found", type: "error" })
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
        } finally {
            setIsLoadingData(false)
        }
    }

    const handleFollow = async () => {
        if (!isAuthenticated) {
            router.push("/login")
            return
        }
        if (isFollowLoading) return

        setIsFollowLoading(true)
        const token = localStorage.getItem('sociaverse_token')

        try {
            let method = 'POST'
            if (followStatus === 'accepted' || followStatus === 'pending') {
                method = 'DELETE'
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${profile.id}/follow/`, {
                method: method,
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                if (data.status === 'following') {
                    setFollowStatus('accepted')
                    setProfile(prev => ({ ...prev, followers_count: prev.followers_count + 1 }))
                } else if (data.status === 'requested') {
                    setFollowStatus('pending')
                    toast({ title: "Requested", message: "Follow request sent.", type: "success" })
                } else if (data.status === 'unfollowed') {
                    if (followStatus === 'accepted') {
                        setProfile(prev => ({ ...prev, followers_count: Math.max(0, prev.followers_count - 1) }))
                    }
                    setFollowStatus('none')
                }
            } else {
                const err = await response.json()
                toast({ title: "Error", message: err.error || "Action failed", type: "error" })
            }
        } catch (error) {
            console.error("Follow action error:", error)
            toast({ title: "Error", message: "Something went wrong", type: "error" })
        } finally {
            setIsFollowLoading(false)
        }
    }

    const handleBlock = async () => {
        if (!isAuthenticated) return
        const token = localStorage.getItem('sociaverse_token')
        try {
            const method = profile.is_blocked ? 'DELETE' : 'POST'
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/block/${profile.id}/`, {
                method: method,
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                setProfile(prev => ({ ...prev, is_blocked: !prev.is_blocked }))
                if (!profile.is_blocked) {
                    // Start blocking -> Also unfollows
                    setFollowStatus('none')
                    toast({ title: "Blocked", message: `You have blocked @${profile.username}`, type: "success" })
                } else {
                    toast({ title: "Unblocked", message: `You have unblocked @${profile.username}`, type: "success" })
                }
            }
        } catch (error) {
            console.error("Block error", error)
        }
    }

    const handleRestrict = async () => {
        if (!isAuthenticated) return
        const token = localStorage.getItem('sociaverse_token')
        try {
            const method = profile.is_restricted ? 'DELETE' : 'POST'
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/restrict/${profile.id}/`, {
                method: method,
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                setProfile(prev => ({ ...prev, is_restricted: !prev.is_restricted }))
                toast({
                    title: profile.is_restricted ? "Unrestricted" : "Restricted",
                    message: `@${profile.username} has been ${profile.is_restricted ? "unrestricted" : "restricted"}.`,
                    type: "success"
                })
            }
        } catch (error) {
            console.error("Restrict error", error)
        }
    }

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    const isPrivateAndHidden = profile.is_private && followStatus !== 'accepted' && followStatus !== 'self'

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">

            {/* --- Cover Image --- */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden group">
                <img
                    src={profile.banner!}
                    alt="Cover"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
            </div>

            {/* --- Profile Header Info --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-24 md:-mt-32">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">

                    {/* Avatar & Key Info */}
                    <div className="flex flex-col md:flex-row items-end md:items-end gap-6 relative w-full md:w-auto">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative mx-auto md:mx-0"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-slate-950 bg-slate-900 overflow-hidden shadow-2xl relative group">
                                <img
                                    src={profile.avatar ? (profile.avatar.startsWith('http') ? profile.avatar : `${process.env.NEXT_PUBLIC_API_URL}${profile.avatar}`) : `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        <div className="mb-2 md:mb-4 pt-2 md:pt-0 text-center md:text-left flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                                {profile.name}
                                {profile.is_verified && <BadgeCheck className="w-6 h-6 text-blue-500" />}
                                {profile.is_private && <Lock className="w-5 h-5 text-slate-400" />}
                            </h1>
                            <p className="text-slate-400 font-medium text-lg">@{profile.username}</p>
                            <div className="flex items-center justify-center md:justify-start gap-6 mt-2 text-slate-300">
                                <div><span className="font-bold text-white">{profile.followers_count}</span> Followers</div>
                                <div><span className="font-bold text-white">{profile.following_count}</span> Following</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-4 md:mt-0 md:self-end md:mb-6 w-full md:w-auto justify-center md:justify-end">
                        {followStatus === 'self' ? (
                            <Link href="/settings/profile">
                                <Button className="rounded-full bg-white text-slate-950 hover:bg-slate-200 font-semibold px-6">
                                    Edit Profile
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                onClick={handleFollow}
                                disabled={isFollowLoading}
                                className={`rounded-full font-semibold px-6 min-w-[120px] transition-all ${followStatus === 'accepted' || followStatus === 'pending'
                                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                                    : "bg-white text-slate-950 hover:bg-slate-200"
                                    }`}
                            >
                                {isFollowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>
                                        {followStatus === 'none' && <><UserPlus className="w-4 h-4 mr-2" /> Follow</>}
                                        {followStatus === 'pending' && "Requested"}
                                        {followStatus === 'accepted' && "Following"}
                                    </>
                                )}
                            </Button>
                        )}

                        <Link href={`/chat?user=${profile.username}`}>
                            <Button variant="outline" className="rounded-full border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Message
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-full border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer text-red-400 hover:text-red-300" onClick={handleBlock}>
                                    <Ban className="w-4 h-4 mr-2" />
                                    {profile.is_blocked ? "Unblock" : "Block"}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer" onClick={handleRestrict}>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    {profile.is_restricted ? "Unrestrict" : "Restrict"}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">
                                    <Flag className="w-4 h-4 mr-2" />
                                    Report
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* --- Main Content Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

                    {/* LEFT SIDEBAR (Intro & Photos) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Intro Card */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-white mb-4">Intro</h3>
                            <div className="space-y-4 text-sm text-slate-400">
                                {profile.bio && (
                                    <p className="text-slate-300 leading-relaxed text-base">{profile.bio}</p>
                                )}
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-slate-500" />
                                    <span>{profile.role}</span>
                                </div>
                                {profile.location && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-slate-500" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                {profile.website && (
                                    <div className="flex items-center gap-3">
                                        <LinkIcon className="w-5 h-5 text-slate-500" />
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate max-w-[200px]">
                                            {profile.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-slate-500" />
                                    <span>Joined {profile.joined}</span>
                                </div>
                                {profile.gender && profile.gender !== 'N' && (
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-slate-500" />
                                        <span>{profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : 'Other'}</span>
                                    </div>
                                )}

                                {/* Social Links */}
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {profile.social_links.twitter && (
                                        <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-blue-500/20 hover:text-blue-500 transition-colors">
                                            <FaTwitter className="w-4 h-4" />
                                        </a>
                                    )}
                                    {profile.social_links.instagram && (
                                        <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-pink-500/20 hover:text-pink-500 transition-colors">
                                            <FaInstagram className="w-4 h-4" />
                                        </a>
                                    )}
                                    {profile.social_links.linkedin && (
                                        <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-blue-700/20 hover:text-blue-700 transition-colors">
                                            <FaLinkedin className="w-4 h-4" />
                                        </a>
                                    )}
                                    {profile.social_links.github && (
                                        <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-white/10 hover:text-white transition-colors">
                                            <FaGithub className="w-4 h-4" />
                                        </a>
                                    )}
                                    {profile.website && (
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-green-500/20 hover:text-green-500 transition-colors">
                                            <FaGlobe className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* MAIN FEED (Right Column) */}
                    <div className="lg:col-span-8">

                        {/* Custom Tabs */}
                        <div className="flex items-center gap-8 border-b border-slate-800 mb-6 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-20 pt-2 pb-px overflow-x-auto">
                            {["Posts", "Followers", "Following", "About", "Media", "Likes"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    disabled={isPrivateAndHidden} // Disable tabs if private
                                    className={`pb-4 text-sm font-semibold transition-colors relative whitespace-nowrap ${activeTab === tab ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                                        } ${isPrivateAndHidden ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="profileTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        {isPrivateAndHidden ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-slate-900/30 border border-slate-800 rounded-2xl">
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                    <Lock className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">This account is private</h3>
                                <p className="text-slate-400">Follow to see their posts and media.</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === "Posts" && <PostsFeed username={username} currentUser={currentUser} />}
                                    {activeTab === "Followers" && (
                                        <UserList endpoint={`${process.env.NEXT_PUBLIC_API_URL}/api/users/${profile.id}/followers/`} emptyMessage="No followers yet" />
                                    )}
                                    {activeTab === "Following" && (
                                        <UserList endpoint={`${process.env.NEXT_PUBLIC_API_URL}/api/users/${profile.id}/following/`} emptyMessage="Not following anyone yet" />
                                    )}
                                    {activeTab === "About" && (
                                        <div className="text-slate-400 text-center py-10">About details coming soon...</div>
                                    )}
                                    {activeTab === "Media" && (
                                        <div className="text-center py-12 text-slate-500">
                                            No media yet
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function PostsFeed({ username, currentUser }: { username: string, currentUser: any }) {
    const [posts, setPosts] = useState<any[]>([])
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) {
            router.push("/login")
            return
        }
        action()
    }

    useEffect(() => {
        if (username) fetchPosts()
    }, [username])

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            const headers: HeadersInit = {}
            if (token) headers['Authorization'] = `Token ${token}`

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/?username=${username}`, {
                headers
            })
            if (response.ok) {
                const data = await response.json()
                setPosts(data)
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        }
    }

    return (
        <div className="space-y-6 relative">
            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-pointer"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full z-[10000]"
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                        >
                            <X className="w-8 h-8" />
                        </Button>
                        <motion.img
                            layoutId={selectedImage}
                            src={selectedImage}
                            alt="Full screen"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Posts List */}
            {posts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <p>No posts yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            handleAuthAction={handleAuthAction}
                            onImageClick={setSelectedImage}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}


