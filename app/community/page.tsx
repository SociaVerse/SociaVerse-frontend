"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Users, Zap, Code, Palette, Gamepad2, Music, Globe, Plus, Loader2, Check, ExternalLink, Lock, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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

interface Community {
    id: number
    title: string
    description: string
    slug: string
    category: string
    image: string | null
    primary_color: string
    members_count: number
    is_joined: boolean
    created_at: string
}

const CATEGORIES = [
    { value: "tech", label: "Technology", icon: Code, color: "from-blue-500 to-cyan-500" },
    { value: "art", label: "Art & Design", icon: Palette, color: "from-pink-500 to-rose-500" },
    { value: "gaming", label: "Gaming", icon: Gamepad2, color: "from-green-500 to-emerald-500" },
    { value: "music", label: "Music", icon: Music, color: "from-purple-500 to-violet-500" },
    { value: "science", label: "Science", icon: Zap, color: "from-yellow-500 to-orange-500" },
    { value: "business", label: "Business", icon: Globe, color: "from-indigo-500 to-blue-500" },
    { value: "other", label: "Other", icon: Users, color: "from-slate-500 to-zinc-500" },
]

export default function CommunityPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth()
    const { toast } = useToast()
    const [communities, setCommunities] = useState<Community[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("all")

    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [createForm, setCreateForm] = useState({ title: "", description: "", category: "other" })
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [extractedColor, setExtractedColor] = useState("#000000")
    const [isCreating, setIsCreating] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (isAuthenticated) {
            fetchCommunities()
        } else if (!authLoading) {
            setIsLoading(false) // Stop loading if not auth (wrapper handles UI)
        }
    }, [isAuthenticated, authLoading])

    const fetchCommunities = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch('http://127.0.0.1:8000/api/communities/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setCommunities(data)
            }
        } catch (error) {
            console.error("Failed to fetch communities", error)
        } finally {
            setIsLoading(false)
        }
    }

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
            formData.append('primary_color', extractedColor)
            if (selectedImage) {
                formData.append('image', selectedImage)
            }

            const response = await fetch('http://127.0.0.1:8000/api/communities/', {
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
                setCreateForm({ title: "", description: "", category: "other" })
                setSelectedImage(null)
                setImagePreview(null)
                setExtractedColor("#000000")
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

    const handleJoin = async (slug: string, isJoined: boolean) => {
        // Optimistic update
        setCommunities(prev => prev.map(c =>
            c.slug === slug ? { ...c, is_joined: !isJoined, members_count: c.members_count + (isJoined ? -1 : 1) } : c
        ))

        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`http://127.0.0.1:8000/api/communities/${slug}/join/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            if (!response.ok) {
                // Revert
                setCommunities(prev => prev.map(c =>
                    c.slug === slug ? { ...c, is_joined: isJoined, members_count: c.members_count + (isJoined ? 1 : -1) } : c
                ))
                toast({ title: "Error", type: "error", message: "Failed to update membership." })
            } else {
                const data = await response.json()
                toast({
                    title: data.joined ? "Joined!" : "Left",
                    type: "success",
                    message: data.joined ? `You joined the community.` : `You left the community.`
                })
            }
        } catch (error) {
            // Revert
            setCommunities(prev => prev.map(c =>
                c.slug === slug ? { ...c, is_joined: isJoined, members_count: c.members_count + (isJoined ? 1 : -1) } : c
            ))
        }
    }

    const filteredCommunities = communities.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === 'all' || c.category === activeCategory
        return matchesSearch && matchesCategory
    })

    const myCommunities = communities.filter(c => c.is_joined)

    if (authLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>

    if (!isAuthenticated) return <AuthLockOverlay />

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">

            {/* Sidebar (Desktop) */}
            <aside className="w-64 border-r border-white/5 bg-slate-900/50 hidden md:flex flex-col fixed h-screen top-0 pt-20 p-4">
                <div className="mb-8">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Discover</h2>
                    <div className="space-y-1">
                        <Button variant={activeCategory === 'all' ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveCategory('all')}>
                            <Globe className="w-4 h-4 mr-2" /> All Communities
                        </Button>
                        {CATEGORIES.map(cat => (
                            <Button
                                key={cat.value}
                                variant={activeCategory === cat.value ? "secondary" : "ghost"}
                                className="w-full justify-start text-slate-400 hover:text-white"
                                onClick={() => setActiveCategory(cat.value)}
                            >
                                <cat.icon className="w-4 h-4 mr-2" /> {cat.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {myCommunities.length > 0 && (
                    <div>
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">My Communities</h2>
                        <div className="space-y-1">
                            {myCommunities.slice(0, 5).map(c => (
                                <Button key={c.id} variant="ghost" className="w-full justify-start text-sm truncate" asChild>
                                    <Link href={`#`}>
                                        <span
                                            className="w-2 h-2 rounded-full mr-2"
                                            style={{ backgroundColor: c.primary_color || '#64748b' }}
                                        />
                                        {c.title}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Communities</h1>
                        <p className="text-slate-400">Join discussions, find teammates, and connect with peers.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                                <Plus className="w-4 h-4 mr-2" /> Create Community
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create a Community</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Start a new community for others to join.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Image Upload */}
                                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/10 rounded-xl bg-slate-950/50 hover:bg-slate-950 hover:border-blue-500/50 transition-colors relative group cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                                    {imagePreview ? (
                                        <div className="relative w-full h-32 rounded-lg overflow-hidden">
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
                                        <div className="flex flex-col items-center justify-center py-4">
                                            <Upload className="w-8 h-8 text-slate-500 mb-2" />
                                            <p className="text-sm text-slate-400">Upload Cover Image</p>
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
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                                        style={{ backgroundColor: extractedColor }}
                                    />
                                    <span className="text-xs text-slate-400">Detected Theme Color</span>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="text-slate-300">Name</Label>
                                    <Input
                                        id="title"
                                        className="bg-slate-950 border-white/10 text-white"
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
                                        className="bg-slate-950 border-white/10 text-white"
                                        value={createForm.description}
                                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={isCreating} className="bg-blue-600 hover:bg-blue-500 text-white">
                                    {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Create Community
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search Mobile */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Search communities..."
                        className="pl-10 h-12 bg-slate-900/50 border-white/10 text-white focus:border-blue-500/50 transition-all rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Content Logic */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-48 rounded-3xl bg-slate-900/50 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredCommunities.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No communities found</h3>
                                <p className="text-slate-400">Try adjusting your search or create a new one.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCommunities.map((community, i) => (
                                    <CommunityCard
                                        key={community.id}
                                        community={community}
                                        index={i}
                                        onJoin={() => handleJoin(community.slug, community.is_joined)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

            </main>
        </div>
    )
}

function CommunityCard({ community, index, onJoin }: { community: Community, index: number, onJoin: () => void }) {
    const categoryInfo = CATEGORIES.find(c => c.value === community.category) || CATEGORIES[6]
    const Icon = categoryInfo.icon
    const router = useRouter()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => router.push(`/community/${community.slug}`)}
            className="group relative h-64 rounded-[2rem] overflow-hidden cursor-pointer"
            style={{
                borderColor: community.primary_color ? `${community.primary_color}30` : undefined
            }}
        >
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 bg-neutral-900 border border-white/5 group-hover:border-opacity-50 transition-colors duration-500">
                {community.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div className="absolute inset-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={community.image} alt={community.title} className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${categoryInfo.color} opacity-5 group-hover:opacity-20 transition-all duration-500`} />
                )}

                {/* Noise texture overlay for texture */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">

                {/* Top Section */}
                <div className="flex justify-between items-start">
                    <div
                        className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg group-hover:bg-white/10 transition-all group-hover:scale-110 duration-300"
                        style={{ borderColor: community.primary_color ? `${community.primary_color}40` : undefined }}
                    >
                        {community.image ? (
                            <div className="w-full h-full rounded-2xl overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={community.image} alt="Icon" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <Icon className="w-6 h-6" />
                        )}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
                        {categoryInfo.label}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:opacity-90 transition-opacity" style={{ color: community.primary_color && community.primary_color !== '#000000' ? community.primary_color : undefined }}>{community.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{community.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2 overflow-hidden">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-neutral-900 bg-slate-800 flex items-center justify-center text-[8px] text-slate-500 font-bold">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs text-slate-500 font-medium">+{community.members_count} members</span>
                        </div>

                        <Button
                            size="sm"
                            className={`rounded-full h-9 px-5 text-xs font-bold transition-all shadow-lg ${community.is_joined
                                ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/5"
                                : "bg-white text-black hover:opacity-90"
                                }`}
                            style={!community.is_joined && community.primary_color && community.primary_color !== '#000000' ? { backgroundColor: community.primary_color, color: 'white' } : {}}
                            onClick={(e) => {
                                e.preventDefault()
                                onJoin()
                            }}
                        >
                            {community.is_joined ? "Joined" : "Join"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div
                className={`absolute -inset-1 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10`}
                style={{
                    background: community.primary_color ? `linear-gradient(to right, ${community.primary_color}, transparent)` : undefined
                }}
            />
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
