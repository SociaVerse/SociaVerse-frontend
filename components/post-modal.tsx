"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, ChevronLeft, ChevronRight, Heart, MessageCircle,
    Share2, Mail, BadgeCheck, ExternalLink, Calendar, MapPin
} from "lucide-react"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogPortal, DialogOverlay
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Post, Comment, api } from "@/services/api"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/custom-toast"
import Link from "next/link"

interface PostModalProps {
    post: Post | null;
    isOpen: boolean;
    onClose: () => void;
}

export function PostModal({ post, isOpen, onClose }: PostModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoadingComments, setIsLoadingComments] = useState(false)
    const [isLikedLocally, setIsLikedLocally] = useState(false)
    const [localLikeCount, setLocalLikeCount] = useState(0)
    const { user } = useAuth()
    const { toast } = useToast()
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen && post) {
            setCurrentImageIndex(0)
            setIsLikedLocally(!!post.is_liked)
            setLocalLikeCount(post.likes_count || 0)
            fetchComments()
        }
    }, [isOpen, post])

    const fetchComments = async () => {
        if (!post) return
        setIsLoadingComments(true)
        try {
            const data = await api.getComments(post.id)
            // Backend fix applied: only root comments returned if filter parent__isnull=True is active
            // but for safety we can filter here too if needed
            setComments(data)
        } catch (error) {
            console.error("Error fetching comments:", error)
        } finally {
            setIsLoadingComments(false)
        }
    }

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (!post?.images) return
        setCurrentImageIndex((prev) => (prev + 1) % post.images.length)
    }

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (!post?.images) return
        setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length)
    }

    const handleToggleLike = async () => {
        if (!post) return
        
        // Optimistic UI update
        const newVal = !isLikedLocally
        setIsLikedLocally(newVal)
        setLocalLikeCount(prev => newVal ? prev + 1 : Math.max(0, prev - 1))
        
        try {
            await api.likePost(post.id)
        } catch (error) {
            // Revert on failure
            setIsLikedLocally(!newVal)
            setLocalLikeCount(prev => !newVal ? prev + 1 : Math.max(0, prev - 1))
        }
    }

    const handleShare = () => {
        if (!post) return
        const url = `${window.location.origin}/post/${post.id}`
        navigator.clipboard?.writeText(url)
        toast({
            type: "success",
            title: "Link Copied!",
            message: "Post link has been copied to your clipboard.",
            duration: 3000
        })
    }

    if (!post) return null

    const images = post.images.map(img =>
        img.image.startsWith('http') ? img.image : `${process.env.NEXT_PUBLIC_API_URL}${img.image}`
    )

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent showCloseButton={false} className="max-w-[98vw] w-full md:max-w-6xl h-[88vh] md:h-[85vh] p-0 bg-slate-950/95 backdrop-blur-2xl border-white/10 overflow-hidden sm:rounded-[2.5rem] rounded-3xl flex flex-col shadow-2xl">

                {/* Mobile Header - High Fidelity */}
                <div className="md:hidden flex items-center justify-between p-4 bg-slate-950/40 backdrop-blur-md border-b border-white/5 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 ring-2 ring-blue-500/20 shadow-inner">
                            <img
                                src={post.author.profile_picture ? (post.author.profile_picture.startsWith('http') ? post.author.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${post.author.profile_picture}`) : `https://ui-avatars.com/api/?name=${post.author.username}`}
                                alt={post.author.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <DialogTitle className="text-sm font-bold text-slate-100 flex items-center gap-1.5 tracking-tight">
                                {post.author.first_name} {post.author.last_name}
                                {post.author.is_verified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                            </DialogTitle>
                            <DialogDescription className="text-[11px] text-slate-500 font-medium">
                                @{post.author.username}
                            </DialogDescription>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 transition-all">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                    {/* Image Section - The Cinematic Hero */}
                    <div className="relative flex-[1.6] bg-black/40 flex items-center justify-center min-h-[30vh] md:min-h-0 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
                        {/* Background Ambient Glow */}
                        {images.length > 0 && (
                            <div className="absolute inset-0 opacity-20 blur-3xl scale-150 pointer-events-none">
                                <img src={images[currentImageIndex]} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {images.length > 0 ? (
                            <>
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={images[currentImageIndex]}
                                        alt="Post content"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                        className="max-w-full max-h-full object-contain relative z-10 shadow-2xl"
                                    />
                                </AnimatePresence>

                                {/* Interactive Navigation */}
                                {images.length > 1 && (
                                    <>
                                        <div className="hidden md:block">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={prevImage}
                                                className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-xl hover:bg-black/80 text-white rounded-full h-12 w-12 border border-white/10 z-20 transition-all hover:scale-110 active:scale-95"
                                            >
                                                <ChevronLeft className="h-7 w-7" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={nextImage}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-xl hover:bg-black/80 text-white rounded-full h-12 w-12 border border-white/10 z-20 transition-all hover:scale-110 active:scale-95"
                                            >
                                                <ChevronRight className="h-7 w-7" />
                                            </Button>
                                        </div>

                                        {/* Pagination Indicator - Premium Style */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 z-20">
                                            {images.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 rounded-full transition-all duration-500 ease-out ${i === currentImageIndex ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/20'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-slate-700 gap-4">
                                <div className="p-6 rounded-full bg-slate-900/50 border border-white/5">
                                    <Mail className="w-16 h-16 opacity-20" />
                                </div>
                                <p className="text-sm font-bold tracking-widest uppercase opacity-40">Status Update</p>
                            </div>
                        )}
                    </div>

                    {/* Content Sidebar - Elegant Typography */}
                    <div className="flex-1 w-full md:w-[440px] flex flex-col min-h-0 bg-slate-900/40 backdrop-blur-3xl relative">
                        {/* Desktop Header - Premium */}
                        <div className="hidden md:flex p-5 border-b border-white/5 items-center justify-between bg-slate-900/40">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 ring-2 ring-blue-500/20 shadow-md">
                                    <img
                                        src={post.author.profile_picture ? (post.author.profile_picture.startsWith('http') ? post.author.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${post.author.profile_picture}`) : `https://ui-avatars.com/api/?name=${post.author.username}`}
                                        alt={post.author.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <DialogTitle className="text-sm font-bold text-white flex items-center gap-1.5 tracking-tight">
                                        {post.author.first_name} {post.author.last_name}
                                        {post.author.is_verified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-slate-400 font-medium">
                                        @{post.author.username}
                                    </DialogDescription>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Master Scroll Area */}
                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                            <div className="p-5 space-y-7 pb-40">
                                {/* The Post Captions */}
                                <div className="space-y-4">
                                    <div className="text-slate-100 text-[15px] leading-[1.6] font-medium tracking-tight">
                                        {post.content}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-[11px] text-slate-500 font-semibold tracking-wide uppercase opacity-70">
                                        <span>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="opacity-30">•</span>
                                        <span>{new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                {/* Modern Stats & Actions Bar */}
                                <div className="flex items-center justify-between py-2 border-y border-white/5">
                                    <div className="flex items-center gap-6">
                                        <motion.button
                                                onClick={handleToggleLike}
                                                whileTap={{ scale: 0.9 }}
                                                className="flex items-center gap-2 group"
                                            >
                                                <div className={`p-2 rounded-full transition-colors ${isLikedLocally ? 'bg-rose-500/10' : 'bg-white/5 group-hover:bg-rose-500/10'}`}>
                                                    <Heart className={`w-5 h-5 transition-all ${isLikedLocally ? 'fill-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-slate-400'}`} />
                                                </div>
                                                <span className={`text-xs font-bold ${isLikedLocally ? 'text-rose-500' : 'text-slate-400'}`}>{localLikeCount}</span>
                                            </motion.button>
                                            <div className="flex items-center gap-2 group">
                                                <div className="p-2 rounded-full bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                                                    <MessageCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 group-hover:text-blue-400 transition-colors">{post.comments_count}</span>
                                            </div>
                                        </div>
                                        <Button onClick={handleShare} variant="ghost" size="icon" className="w-10 h-10 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
                                            <Share2 className="w-5 h-5" />
                                        </Button>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-5">
                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] pl-1">Discussion</h4>
                                    {isLoadingComments ? (
                                        <div className="py-16 flex justify-center">
                                            <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {comments.length > 0 ? (
                                                comments.map((comment) => (
                                                    <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-700">
                                                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 ring-1 ring-white/10 shadow-lg">
                                                            <img
                                                                src={comment.author.profile_picture ? (comment.author.profile_picture.startsWith('http') ? comment.author.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${comment.author.profile_picture}`) : `https://ui-avatars.com/api/?name=${comment.author.username}`}
                                                                className="w-full h-full object-cover"
                                                                alt={comment.author.username}
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-1.5">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[13px] font-bold text-slate-200 hover:text-blue-400 cursor-pointer transition-colors">
                                                                    {comment.author.first_name}
                                                                </span>
                                                                <span className="text-[10px] text-slate-600 font-bold">{new Date(comment.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                            </div>
                                                            <p className="text-[13px] text-slate-400 leading-relaxed font-medium">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-16 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                                                    <p className="text-[12px] font-bold tracking-tight text-white/20">Empty Space. Start talking?</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Floating Action Input - Glassmorphism Masterpiece */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-slate-950/80 backdrop-blur-3xl border-t border-white/10 z-30 pb-16 md:pb-6">
                            <div className="max-w-2xl mx-auto flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-[2rem] p-2.5 px-4 border border-white/10 shadow-2xl group ring-1 ring-white/5">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 ring-2 ring-blue-500/30">
                                    <img
                                        src={user?.profile_picture ? (user.profile_picture.startsWith('http') ? user.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture}`) : `https://ui-avatars.com/api/?name=${user?.username || 'user'}`}
                                        className="w-full h-full object-cover"
                                        alt="Me"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Express something..."
                                    className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-100 placeholder:text-slate-500 font-medium"
                                />
                                <Button size="sm" className="h-9 w-9 rounded-full p-0 bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-110 active:scale-90">
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
