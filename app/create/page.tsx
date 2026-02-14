"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/services/api"
import { Button } from "@/components/ui/button"
import { X, Loader2, Image as ImageIcon, MapPin, Smile, UserPlus, ChevronLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/custom-toast"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CreatePostPage() {
    const router = useRouter()
    const { toast } = useToast()
    const { user } = useAuth()
    const [content, setContent] = useState("")
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
        }
    }, [content])

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setImages(prev => [...prev, ...newFiles])

            const newPreviews = newFiles.map(file => URL.createObjectURL(file))
            setImagePreviews(prev => [...prev, ...newPreviews])
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => {
            URL.revokeObjectURL(prev[index])
            return prev.filter((_, i) => i !== index)
        })
    }

    const handleSubmit = async () => {
        if (!content.trim() && images.length === 0) return

        setIsSubmitting(true)
        try {
            await api.createPost(content, images)
            toast({ type: 'success', title: "Posted!", duration: 2000 })
            router.push("/explore")
        } catch (error) {
            console.error("Failed to create post", error)
            toast({ type: 'error', title: "Post failed", message: "Please try again." })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative"
        >
            {/* Top Navigation Bar */}
            <div className="px-4 py-3 flex items-center justify-between bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="-ml-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full"
                >
                    <X className="w-6 h-6" />
                </Button>
                <span className="font-semibold text-lg">New Post</span>
                <Button
                    onClick={handleSubmit}
                    disabled={(!content.trim() && images.length === 0) || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full px-5 py-1.5 h-auto text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                </Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={user?.profile_picture || ""} alt={user?.username} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs text-white">
                            {(user?.username || "U").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-200">{user?.username || "User"}</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 w-fit">
                            <span className="text-[10px] text-slate-400 font-medium">Public</span>
                            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                        </div>
                    </div>
                </div>

                {/* Text Input */}
                <textarea
                    ref={textareaRef}
                    placeholder="What's going on?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent border-none text-xl resize-none focus:ring-0 p-0 text-slate-200 placeholder:text-slate-600 min-h-[100px]"
                    autoFocus
                />

                {/* Image Previews - Masonryish Grid */}
                <AnimatePresence>
                    {imagePreviews.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-2 gap-2 mt-4 pb-20"
                        >
                            {imagePreviews.map((preview, index) => (
                                <motion.div
                                    layout
                                    key={preview}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className={`relative rounded-xl overflow-hidden group border border-white/10 ${imagePreviews.length === 1 ? "col-span-2 aspect-video" : "aspect-square"
                                        }`}
                                >
                                    <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Toolbar */}
            <div className="p-0 bg-slate-950 border-t border-white/5 sticky bottom-0 z-50 pb-safe">
                {/* Options List */}
                <div className="flex flex-col">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-3 p-4 hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5"
                    >
                        <ImageIcon className="w-6 h-6 text-green-500" />
                        <span className="text-slate-300 font-medium">Photo/Video</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5">
                        <UserPlus className="w-6 h-6 text-blue-500" />
                        <span className="text-slate-300 font-medium">Tag People</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5">
                        <Smile className="w-6 h-6 text-yellow-500" />
                        <span className="text-slate-300 font-medium">Feeling/Activity</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 hover:bg-white/5 active:bg-white/10 transition-colors">
                        <MapPin className="w-6 h-6 text-red-500" />
                        <span className="text-slate-300 font-medium">Check in</span>
                    </button>
                </div>
            </div>

            <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageSelect}
            />
        </motion.div>
    )
}
