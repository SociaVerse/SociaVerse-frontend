"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Users, Zap, Code, Palette, Gamepad2, Music, Globe, Plus, Loader2, Check, ExternalLink, Lock, Upload, X, ArrowRight, Sparkles, Trophy, Shield, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/custom-toast"
import ColorThief from "colorthief"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Community {
    id: number
    title: string
    description: string
    slug: string
    category: string
    image: string | null
    primary_color: string
    members_count: number
    join_status: 'joined' | 'pending' | 'not_joined'
    created_at: string
    privacy_type?: 'public' | 'restricted' | 'private'
    college_name?: string | null
    engagement_score?: number
    rules?: string
}

const CATEGORIES = [
    { value: "tech", label: "Technology", icon: Code, color: "from-blue-500 to-cyan-500", glow: "shadow-blue-500/50" },
    { value: "art", label: "Art & Design", icon: Palette, color: "from-pink-500 to-rose-500", glow: "shadow-pink-500/50" },
    { value: "gaming", label: "Gaming", icon: Gamepad2, color: "from-green-500 to-emerald-500", glow: "shadow-green-500/50" },
    { value: "music", label: "Music", icon: Music, color: "from-purple-500 to-violet-500", glow: "shadow-purple-500/50" },
    { value: "science", label: "Science", icon: Zap, color: "from-yellow-500 to-orange-500", glow: "shadow-yellow-500/50" },
    { value: "business", label: "Business", icon: Globe, color: "from-indigo-500 to-blue-500", glow: "shadow-indigo-500/50" },
    { value: "other", label: "Other", icon: Users, color: "from-slate-500 to-zinc-500", glow: "shadow-slate-500/50" },
]

export default function CommunityPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth()
    const { toast } = useToast()
    const [communities, setCommunities] = useState<Community[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("all")
    const [filterMode, setFilterMode] = useState<"explore" | "trending">("explore")

    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [createForm, setCreateForm] = useState({
        title: "",
        description: "",
        category: "other",
        privacy_type: "public",
        rules: ""
    })
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [extractedColor, setExtractedColor] = useState("#000000")
    const [isCreating, setIsCreating] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null)

    const fetchCommunities = useCallback(async (isInitial = true) => {
        if (!isInitial && (!hasMore || loadingMore)) return

        if (isInitial) setIsLoading(true)
        else setLoadingMore(true)

        try {
            const token = localStorage.getItem("sociaverse_token")
            let url = ""
            if (isInitial) {
                const base = filterMode === 'trending'
                    ? `${process.env.NEXT_PUBLIC_API_URL}/api/communities/trending/`
                    : `${process.env.NEXT_PUBLIC_API_URL}/api/communities/`
                url = searchQuery ? `${base}?search=${encodeURIComponent(searchQuery)}` : base
            } else {
                url = nextUrl || ""
            }

            if (!url) return

            const response = await fetch(url, {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                const results = data.results || data
                setCommunities(prev => isInitial ? results : [...prev, ...results])
                setNextUrl(data.next || null)
                setHasMore(!!data.next)
            }
        } catch (error) {
            console.error("Failed to fetch communities", error)
        } finally {
            setIsLoading(false)
            setLoadingMore(false)
        }
    }, [filterMode, hasMore, loadingMore, nextUrl, searchQuery])

    useEffect(() => {
        if (isAuthenticated) {
            fetchCommunities(true)
        } else if (!authLoading) {
            setIsLoading(false)
        }
    }, [isAuthenticated, authLoading, filterMode])

    const lastCommunityRef = useInfiniteScroll({
        callback: () => fetchCommunities(false),
        isLoading: isLoading || loadingMore,
        hasMore: hasMore
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const onImageLoad = () => {
        if (imageRef.current) {
            const colorThief = new ColorThief();
            try {
                const color = colorThief.getColor(imageRef.current);
                const hexColor = "#" + color.map(x => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                }).join("");
                setExtractedColor(hexColor)
            } catch (e) {
                console.error("Error extracting color", e)
            }
        }
    }

    const handleCreate = async () => {
        setIsCreating(true)
        try {
            const token = localStorage.getItem("sociaverse_token")

            const formData = new FormData()
            formData.append('title', createForm.title)
            formData.append('description', createForm.description)
            formData.append('category', createForm.category)
            formData.append('privacy_type', createForm.privacy_type)
            formData.append('rules', createForm.rules)
            formData.append('primary_color', extractedColor)
            if (selectedImage) {
                formData.append('image', selectedImage)
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            })

            if (response.ok) {
                const newCommunity = await response.json()
                setCommunities(prev => [newCommunity, ...prev])
                setIsCreateOpen(false)
                resetForm()
                toast({ title: "Success", type: "success", message: "Community created successfully!" })
            } else {
                toast({ title: "Error", type: "error", message: "Failed to create community." })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", type: "error", message: "Something went wrong." })
        } finally {
            setIsCreating(false)
        }
    }

    const resetForm = () => {
        setCreateForm({ title: "", description: "", category: "other", privacy_type: "public", rules: "" })
        setSelectedImage(null)
        setImagePreview(null)
        setExtractedColor("#000000")
        setStep(1)
    }

    const handleJoin = async (slug: string, currentStatus: string) => {
        // Optimistic update
        const isLeaving = currentStatus === 'joined' || currentStatus === 'pending'
        const expectedNewStatus = isLeaving ? 'not_joined' : 'pending' // Just a guess, backend will confirm

        setCommunities(prev => prev.map(c =>
            c.slug === slug ? { ...c, join_status: expectedNewStatus as any, members_count: c.members_count + (isLeaving ? -1 : 1) } : c
        ))

        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/join/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                // Revert
                setCommunities(prev => prev.map(c =>
                    c.slug === slug ? { ...c, join_status: currentStatus as any, members_count: c.members_count + (isLeaving ? 1 : -1) } : c
                ))
                toast({ title: "Error", type: "error", message: data.message || "Failed to update membership." })
            } else {
                // Apply actual status
                setCommunities(prev => prev.map(c =>
                    c.slug === slug ? { ...c, join_status: data.status, members_count: c.members_count + (data.joined ? (isLeaving ? 0 : 1) : (isLeaving ? -1 : 0)) } : c
                ))
                toast({
                    title: data.joined ? "Joined!" : (data.status === 'pending' ? "Request Sent" : "Left"),
                    type: "success",
                    message: data.message
                })
            }
        } catch (error) {
            // Revert
            setCommunities(prev => prev.map(c =>
                c.slug === slug ? { ...c, join_status: currentStatus as any, members_count: c.members_count + (isLeaving ? 1 : -1) } : c
            ))
        }
    }

    // Category filtering is still client-side (no backend category filter param)
    const filteredCommunities = communities.filter(c => {
        const matchesCategory = activeCategory === 'all' || c.category === activeCategory
        return matchesCategory
    })

    if (authLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>

    if (!isAuthenticated) return <AuthLockOverlay />

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
                <div className="absolute top-40 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">

                {/* Hero Section */}
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 backdrop-blur-sm mb-4"
                    >
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span>Discover Your Tribe</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent"
                    >
                        Explore Communities
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Connect with like-minded creators, developers, and enthusiasts. Join discussions, share your work, and grow together in spaces designed for collaboration.
                    </motion.p>
                </div>

                {/* Mode Toggle & Categories */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-20 z-50 bg-slate-950/80 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl">
                    {/* View Modes */}
                    <div className="flex bg-slate-900 rounded-full p-1 border border-white/10 w-full md:w-auto overflow-hidden">
                        <button
                            onClick={() => setFilterMode("explore")}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-full text-sm font-medium transition-all ${filterMode === "explore" ? "bg-white text-black shadow-sm" : "text-slate-400 hover:text-white"}`}
                        >
                            Explore
                        </button>
                        <button
                            onClick={() => setFilterMode("trending")}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-full text-sm font-medium transition-all ${filterMode === "trending" ? "bg-white text-black shadow-sm" : "text-slate-400 hover:text-white"}`}
                        >
                            Trending
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 min-w-0 overflow-x-auto pb-2 md:pb-0 w-full scrollbar-hide">
                        <Button
                            variant={activeCategory === 'all' ? "secondary" : "ghost"}
                            onClick={() => setActiveCategory('all')}
                            className="rounded-full px-6"
                        >
                            All
                        </Button>
                        {CATEGORIES.map(cat => (
                            <Button
                                key={cat.value}
                                variant={activeCategory === cat.value ? "secondary" : "ghost"}
                                onClick={() => setActiveCategory(cat.value)}
                                className="rounded-full whitespace-nowrap"
                            >
                                <cat.icon className="w-4 h-4 mr-2" /> {cat.label}
                            </Button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                placeholder="Search..."
                                className="pl-10 bg-slate-900 border-white/10 text-white focus:ring-2 focus:ring-blue-500/20 rounded-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Dialog open={isCreateOpen} onOpenChange={(open) => {
                            setIsCreateOpen(open)
                            if (!open) resetForm()
                        }}>
                            <DialogTrigger asChild>
                                <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 px-6">
                                    <Plus className="w-4 h-4 mr-2" /> Create
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[500px] p-0 overflow-hidden gap-0">
                                <DialogHeader className="p-6 pb-2">
                                    <DialogTitle className="text-xl">Create a Community</DialogTitle>
                                    <div className="flex gap-2 mt-4">
                                        {[1, 2, 3].map(s => (
                                            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-blue-500' : 'bg-slate-800'}`} />
                                        ))}
                                    </div>
                                </DialogHeader>

                                <div className="p-6 pt-2">
                                    <AnimatePresence mode="wait">
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-4"
                                            >
                                                <div className="grid gap-2">
                                                    <Label htmlFor="title" className="text-slate-300">Name</Label>
                                                    <Input
                                                        id="title"
                                                        className="bg-slate-950 border-white/10 text-white"
                                                        placeholder="e.g. React Developers"
                                                        value={createForm.title}
                                                        onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="category" className="text-slate-300">Category</Label>
                                                    <Select
                                                        value={createForm.category}
                                                        onValueChange={(val) => setCreateForm({ ...createForm, category: val })}
                                                    >
                                                        <SelectTrigger className="bg-slate-950 border-white/10 text-white">
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                            {CATEGORIES.map(cat => (
                                                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="desc" className="text-slate-300">Description</Label>
                                                    <Textarea
                                                        id="desc"
                                                        className="bg-slate-950 border-white/10 text-white min-h-[100px]"
                                                        placeholder="What is this community about?"
                                                        value={createForm.description}
                                                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-4"
                                            >
                                                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-xl bg-slate-950/50 hover:bg-slate-950 hover:border-blue-500/50 transition-colors relative group cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                                                    {imagePreview ? (
                                                        <div className="relative w-full h-40 rounded-lg overflow-hidden">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                ref={imageRef}
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                                onLoad={onImageLoad}
                                                                crossOrigin="anonymous"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <p className="text-xs font-semibold">Change Image</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-6">
                                                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3">
                                                                <Upload className="w-6 h-6 text-slate-500" />
                                                            </div>
                                                            <p className="text-sm text-slate-400 font-medium">Upload Cover Image</p>
                                                            <p className="text-xs text-slate-600 mt-1">Supports JPG, PNG</p>
                                                        </div>
                                                    )}
                                                    <Input
                                                        id="image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                    {imagePreview && (
                                                        <div className="absolute top-2 right-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 rounded-full bg-black/50 hover:bg-red-500/80 text-white"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedImage(null);
                                                                    setImagePreview(null);
                                                                    setExtractedColor("#000000");
                                                                }}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-8 h-8 rounded-full border border-white/20 shadow-sm"
                                                            style={{ backgroundColor: extractedColor }}
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium text-white">Brand Color</p>
                                                            <p className="text-xs text-slate-500">Auto-detected from image</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                <div className="space-y-3">
                                                    <Label className="text-slate-300">Privacy Setting</Label>
                                                    <RadioGroup value={createForm.privacy_type} onValueChange={(val: "public" | "restricted" | "private") => setCreateForm({ ...createForm, privacy_type: val })}>
                                                        <div className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${createForm.privacy_type === 'public' ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-950 border-white/5 hover:border-white/10'}`}>
                                                            <RadioGroupItem value="public" id="public" className="border-slate-500 text-blue-500" />
                                                            <Label htmlFor="public" className="cursor-pointer flex-1">
                                                                <div className="font-medium text-white">Public</div>
                                                                <div className="text-xs text-slate-400">Anyone can view and join.</div>
                                                            </Label>
                                                            <Globe className="w-4 h-4 text-slate-500" />
                                                        </div>
                                                        <div className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${createForm.privacy_type === 'restricted' ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-950 border-white/5 hover:border-white/10'}`}>
                                                            <RadioGroupItem value="restricted" id="restricted" className="border-slate-500 text-blue-500" />
                                                            <Label htmlFor="restricted" className="cursor-pointer flex-1">
                                                                <div className="font-medium text-white">Restricted</div>
                                                                <div className="text-xs text-slate-400">Anyone can view, approval needed to join.</div>
                                                            </Label>
                                                            <Shield className="w-4 h-4 text-slate-500" />
                                                        </div>
                                                        <div className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${createForm.privacy_type === 'private' ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-950 border-white/5 hover:border-white/10'}`}>
                                                            <RadioGroupItem value="private" id="private" className="border-slate-500 text-blue-500" />
                                                            <Label htmlFor="private" className="cursor-pointer flex-1">
                                                                <div className="font-medium text-white">Private — College Only</div>
                                                                <div className="text-xs text-slate-400">Only visible to students from your college.</div>
                                                            </Label>
                                                            <Lock className="w-4 h-4 text-slate-500" />
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="rules" className="text-slate-300">Community Rules</Label>
                                                    <Textarea
                                                        id="rules"
                                                        className="bg-slate-950 border-white/10 text-white min-h-[80px]"
                                                        placeholder="1. Be respectful..."
                                                        value={createForm.rules}
                                                        onChange={(e) => setCreateForm({ ...createForm, rules: e.target.value })}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex justify-between p-6 pt-2 bg-slate-900/50 border-t border-white/5">
                                    {step > 1 ? (
                                        <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-white">
                                            <ChevronLeft className="w-4 h-4 mr-1" /> Back
                                        </Button>
                                    ) : (
                                        <div />
                                    )}

                                    {step < 3 ? (
                                        <Button onClick={() => setStep(step + 1)} className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6">
                                            Next
                                        </Button>
                                    ) : (
                                        <Button onClick={handleCreate} disabled={isCreating} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full px-6 shadow-lg shadow-blue-500/20">
                                            {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            Create Community
                                        </Button>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-80 rounded-3xl bg-slate-900/50 animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredCommunities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-900/30 rounded-3xl border border-white/5 backdrop-blur-sm">
                                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10">
                                    <Search className="w-10 h-10 text-slate-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No communities found</h3>
                                <p className="text-slate-400 max-w-md mx-auto">
                                    We couldn't find any communities matching your criteria. Try adjusting your filters or be the first to create one!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {communities.map((community, i) => (
                                    <CommunityCard
                                        key={community.id}
                                        community={community}
                                        index={i}
                                        onJoin={() => handleJoin(community.slug, community.join_status)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Sentinel */}
                        <div ref={lastCommunityRef} className="h-10 flex items-center justify-center -mt-10 mb-20 text-blue-500">
                            {loadingMore && <Loader2 className="w-6 h-6 animate-spin" />}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function CommunityCard({ community, index, onJoin }: { community: Community, index: number, onJoin: () => void }) {
    const categoryInfo = CATEGORIES.find(c => c.value === community.category) || CATEGORIES[6]
    const router = useRouter()

    const getJoinLabel = () => {
        if (community.join_status === 'joined') return 'Joined'
        if (community.join_status === 'pending') return 'Pending'
        return 'Join Tribe'
    }

    const getJoinStyle = () => {
        if (community.join_status === 'joined') return 'bg-white/5 text-slate-400 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
        if (community.join_status === 'pending') return 'bg-amber-500/10 text-amber-500 border-amber-500/20 px-4'
        return 'bg-blue-600 text-white hover:bg-blue-500 border-transparent shadow-lg shadow-blue-600/20 active:scale-95'
    }

    const privacyBadge = community.privacy_type === 'private'
        ? { icon: Lock, label: 'Private', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' }
        : community.privacy_type === 'restricted'
            ? { icon: Shield, label: 'Restricted', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
            : { icon: Globe, label: 'Public', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
    const PrivacyIcon = privacyBadge.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.35 }}
            onClick={() => router.push(`/community/${community.slug}`)}
            className="group relative flex flex-col h-[280px] bg-slate-900 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-blue-500/10"
        >
            {/* Banner Section */}
            <div className="relative h-20 shrink-0 overflow-hidden bg-slate-800">
                {community.image ? (
                    <img src={community.image} alt="" className="w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${categoryInfo.color} opacity-20`} />
                )}
                <div className="absolute inset-x-3 top-3 flex justify-between items-start z-10">
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border bg-black/40 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider ${privacyBadge.color}`}>
                        <PrivacyIcon className="w-2.5 h-2.5" />
                        {privacyBadge.label}
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {categoryInfo.label}
                    </div>
                </div>
            </div>

            {/* Avatar - Floating */}
            <div className="absolute top-12 left-5 w-14 h-14 rounded-xl border-2 border-slate-900 bg-slate-900 overflow-hidden shadow-xl z-20 transition-transform group-hover:scale-105">
                {community.image ? (
                    <img src={community.image} alt={community.title} className="w-full h-full object-cover" />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${categoryInfo.color}`}>
                        <categoryInfo.icon className="w-7 h-7 text-white" />
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-1 p-5 mt-4">
                <div className="flex-1 min-h-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
                        {community.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                        {community.description}
                    </p>
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                            <Users className="w-3.5 h-3.5" />
                            <span>{community.members_count} members</span>
                        </div>
                        {community.engagement_score && community.engagement_score > 70 && (
                            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">
                                <Sparkles className="w-3 h-3" />
                                <span>Trending Now</span>
                            </div>
                        )}
                    </div>

                    <Button
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (community.join_status === 'pending') return;
                            onJoin();
                        }}
                        className={`h-8 px-5 rounded-lg text-[10px] font-bold transition-all border ${getJoinStyle()}`}
                    >
                        {getJoinLabel()}
                    </Button>
                </div>
            </div>

            {/* Hover visual cue */}
            <div className="absolute bottom-4 right-2 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowRight className="w-4 h-4 text-blue-500/50" />
            </div>
        </motion.div>
    )
}

function AuthLockOverlay() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full text-center relative z-10 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-2xl"
            >
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/20">
                    <Lock className="w-8 h-8 text-blue-400" />
                </div>

                <h2 className="text-3xl font-bold mb-3">Members Only</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Join the SociaVerse community to unlock exclusive events, hackathons, and meetups happening near you.
                </p>

                <div className="flex flex-col gap-3">
                    <Button asChild className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20">
                        <Link href="/login">
                            Log In to Continue
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full h-12 text-base border-slate-700 hover:bg-slate-800 text-slate-300">
                        <Link href="/signup">
                            Create an Account
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
