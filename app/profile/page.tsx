"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    User, Mail, MapPin, Link as LinkIcon, Settings, Share2, Camera, LogOut, Lock,
    Calendar, Briefcase, Grid, Heart, Image as ImageIcon, MessageCircle, MoreHorizontal,
    BadgeCheck, Loader2, X, Check, Trash2
} from "lucide-react"
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa"
import Link from "next/link"
import { useToast } from "@/components/ui/custom-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { UserList } from "@/components/user-list"
import { PostCard } from "@/components/post-card"
import { compressImage } from "@/utils/image-compression"

export default function ProfilePage() {
    const { isAuthenticated, user, isLoading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("Posts")
    const { toast } = useToast()

    // State
    const [profile, setProfile] = useState({
        id: 0,
        name: "",
        username: "",
        email: "",
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
        role: "Member"
    })
    const [isLoadingData, setIsLoadingData] = useState(true)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login")
        } else if (isAuthenticated) {
            fetchProfile()
        }
    }, [isLoading, isAuthenticated, router])

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setProfile({
                    id: data.id,
                    name: `${data.first_name} ${data.last_name}`.trim() || data.username,
                    username: data.username,
                    email: data.email,
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
                    joined: "February 2026", // TODO: Add joined date to backend serializer if needed
                    role: data.is_verified ? "Verified User" : "Member"
                })
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
            toast({ title: "Error", message: "Failed to load profile data", type: "error" })
        } finally {
            setIsLoadingData(false)
        }
    }

    if (isLoading || isLoadingData) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (!isAuthenticated) return null

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20 md:-mt-32">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">

                    {/* Avatar & Key Info */}
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 relative w-full md:w-auto">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative mx-auto md:mx-0"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-slate-950 bg-slate-900 overflow-hidden shadow-2xl relative group">
                                <img
                                    src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-6 h-6 bg-green-500 border-4 border-slate-950 rounded-full" title="Online" />
                        </motion.div>

                        <div className="mb-2 md:mb-4 pt-2 md:pt-0 text-center md:text-left flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                                {profile.name}
                                {profile.role === "Verified User" && <BadgeCheck className="w-6 h-6 text-blue-500" />}
                                {profile.is_private && <Lock className="w-5 h-5 text-slate-400" />}
                            </h1>
                            <p className="text-slate-400 font-medium text-lg">@{profile.username}</p>

                            {/* Mobile Key Info (Visible only on small screens) */}
                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-3 md:hidden text-sm text-slate-400">
                                {profile.role && (
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        <span>{profile.role}</span>
                                    </div>
                                )}
                                {profile.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                                {profile.website && (
                                    <div className="flex items-center gap-1">
                                        <LinkIcon className="w-3.5 h-3.5" />
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate max-w-[150px]">
                                            {profile.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-6 mt-4 text-slate-300">
                                <div className="cursor-pointer hover:text-white transition-colors" onClick={() => setActiveTab("Followers")}>
                                    <span className="font-bold text-white">{profile.followers_count}</span> Followers
                                </div>
                                <div className="cursor-pointer hover:text-white transition-colors" onClick={() => setActiveTab("Following")}>
                                    <span className="font-bold text-white">{profile.following_count}</span> Following
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-4 md:mt-0 md:self-end md:mb-6 w-full md:w-auto justify-center md:justify-end">
                        <Link href="/settings/profile" className="flex-1 md:flex-none">
                            <Button className="w-full md:w-auto rounded-full bg-white text-slate-950 hover:bg-slate-200 font-semibold px-6">
                                Edit Profile
                            </Button>
                        </Link>
                        <Button variant="outline" className="flex-1 md:flex-none w-full md:w-auto rounded-full border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>

                {/* --- Main Content Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

                    {/* LEFT SIDEBAR (Intro & Photos) - Hidden on mobile, specific info moved to header */}
                    <div className="hidden lg:block lg:col-span-4 space-y-6">

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

                        {/* Photos Preview */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">Photos</h3>
                                <Button variant="link" className="text-blue-400 p-0 h-auto text-sm">See all</Button>
                            </div>
                            <div className="text-center py-8 text-slate-500 text-sm">
                                No photos yet
                            </div>
                        </div>
                    </div>

                    {/* MAIN FEED (Right Column) */}
                    <div className="lg:col-span-8">

                        {/* Custom Tabs */}
                        <div className="flex items-center gap-8 border-b border-slate-800 mb-6 sticky top-0 bg-slate-950/95 backdrop-blur-xl z-20 pt-2 pb-px overflow-x-auto scrollbar-hide">
                            {["Posts", "Followers", "Following", "About", "Media", "Likes"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-semibold transition-colors relative whitespace-nowrap ${activeTab === tab ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                                        }`}
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

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "Posts" && <PostsFeed profile={profile} currentUser={user} />}
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

                    </div>
                </div>
            </div>
        </div>
    )
}




// --- Sub-components for Feed ---

// --- Sub-components for Feed ---

function PostsFeed({ profile, currentUser }: { profile: any, currentUser: any }) {
    const [content, setContent] = useState("")
    const [images, setImages] = useState<File[]>([])
    const [posts, setPosts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/?username=${profile.username}`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setPosts(data)
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        }
    }

    const [isCompressing, setIsCompressing] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files)
            if (images.length + selectedFiles.length > 10) {
                toast({ title: "Limit Exceeded", message: "You can only upload up to 10 images.", type: "error" })
                return
            }

            setIsCompressing(true);
            try {
                const compressedFiles = await Promise.all(
                    selectedFiles.map(async (file) => {
                        try {
                            const compressed = await compressImage(file);
                            return compressed;
                        } catch (err) {
                            console.error("Failed to compress", file.name, err);
                            return file; // Fallback to original
                        }
                    })
                );
                setImages(prev => [...prev, ...compressedFiles])
            } catch (error) {
                console.error("Error processing images", error);
            } finally {
                setIsCompressing(false);
            }
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleCreatePost = () => {
        if (!content.trim() && images.length === 0) return
        setShowConfirm(true)
    }

    const confirmPost = async () => {
        setShowConfirm(false)
        setIsLoading(true)
        const formData = new FormData()
        formData.append('content', content)
        images.forEach(image => {
            formData.append('uploaded_images', image)
        })

        try {
            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            })

            if (response.ok) {
                const newPost = await response.json()
                setPosts(prev => [newPost, ...prev])
                setContent("")
                setImages([])
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 3000)
                toast({ title: "Success", message: "Post created successfully!", type: "success" })
            } else {
                toast({ title: "Error", message: "Failed to create post.", type: "error" })
            }
        } catch (error) {
            console.error("Error creating post:", error)
            toast({ title: "Error", message: "Something went wrong.", type: "error" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeletePost = async (postId: number) => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` }
            })

            if (response.ok) {
                setPosts(prev => prev.filter(p => p.id !== postId))
                toast({ title: "Deleted", message: "Post deleted successfully.", type: "success" })
            } else {
                toast({ title: "Error", message: "Failed to delete post.", type: "error" })
            }
        } catch (error) {
            console.error("Error deleting post:", error)
            toast({ title: "Error", message: "Failed to delete post.", type: "error" })
        }
    }

    const { isAuthenticated } = useAuth()
    const router = useRouter()

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) {
            router.push("/login")
            return
        }
        action()
    }

    return (
        <div className="space-y-6 relative">
            {/* Success Animation */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-2xl">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
                            >
                                <Check className="w-10 h-10 text-slate-950" strokeWidth={3} />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-2">Post Published!</h2>
                            <p className="text-slate-400">Your moment has been shared.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ready to publish?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Your post will be visible to your followers and on your profile.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border-slate-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmPost} className="bg-blue-600 text-white hover:bg-blue-700">Publish Post</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Create Post Input and List -- only show create input if looking at own profile */}
            {currentUser && currentUser.username === profile.username && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex-shrink-0">
                            <img
                                src={currentUser.profile_picture || `https://ui-avatars.com/api/?name=${currentUser.username}`}
                                alt="Me"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-3">
                            <textarea
                                placeholder="What's on your mind?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 min-h-[40px] resize-none"
                                rows={Math.max(2, content.split('\n').length)}
                            />

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                            <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                                <div className="flex gap-2 text-blue-400">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="hover:bg-blue-500/10 hover:text-blue-400 rounded-full w-8 h-8"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 hover:text-blue-400 rounded-full w-8 h-8">
                                        <MapPin className="w-5 h-5" />
                                    </Button>
                                </div>
                                <Button
                                    size="sm"
                                    className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6"
                                    onClick={handleCreatePost}
                                    disabled={isLoading || isCompressing || (!content.trim() && images.length === 0)}
                                >
                                    {isLoading || isCompressing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Posts List */}
            {posts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <p>No posts yet. {currentUser && currentUser.username === profile.username ? "Share your first moment!" : ""}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            handleAuthAction={handleAuthAction}
                            onDelete={handleDeletePost}
                            onImageClick={setSelectedImage}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}


