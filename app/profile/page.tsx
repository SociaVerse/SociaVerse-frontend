"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    User, Mail, MapPin, Link as LinkIcon, Edit2, Settings, Share2, Camera, LogOut,
    Calendar, Briefcase, Grid, Heart, Image as ImageIcon, MessageCircle, MoreHorizontal,
    BadgeCheck
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const { isAuthenticated, logout, isLoading } = useAuth()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState("Posts")

    // State
    const [profile, setProfile] = useState({
        name: "",
        username: "",
        email: "",
        bio: "",
        location: "",
        website: "",
        avatar: null as string | null,
        cover: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000",
        joined: "September 2023",
        role: "Software Engineer"
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
            const token = localStorage.getItem('token')
            // Mocking a successful fetch for development if API fails or for demo purposes
            // In real scenario, uncomment the fetch logic:
            /*
            const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                 setProfile(prev => ({
                    ...prev,
                    name: `${data.first_name} ${data.last_name}`.trim() || data.username,
                    username: data.username,
                    email: data.email,
                    location: data.college || "San Francisco, CA",
                    // ... keep other fields or defaults
                }))
            }
            */

            // Simulating API load
            setTimeout(() => {
                setProfile(prev => ({
                    ...prev,
                    name: "Alex Rivera",
                    username: "arivera_dev",
                    email: "alex@example.com",
                    bio: "Building digital experiences that matter. 🚀 Full-stack developer & UI enthusiast. Coffee lover ☕",
                    location: "San Francisco, CA",
                    website: "alexrivera.dev",
                    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
                    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000"
                }))
                setIsLoadingData(false)
            }, 800)

        } catch (error) {
            console.error("Error fetching profile:", error)
            setIsLoadingData(false)
        }
    }

    if (isLoading || isLoadingData) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                {/* Skeleton Header */}
                <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                    <div className="w-full h-48 md:h-64 bg-slate-900 rounded-xl relative">
                        <div className="absolute -bottom-16 left-8 w-32 h-32 md:w-40 md:h-40 bg-slate-800 rounded-full border-4 border-slate-950" />
                    </div>

                    <div className="flex justify-end pt-4 px-4 md:px-8">
                        <div className="flex gap-3">
                            <div className="w-24 h-10 bg-slate-900 rounded-full" />
                            <div className="w-10 h-10 bg-slate-900 rounded-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-2">
                        {/* Left Col Skeleton */}
                        <div className="space-y-6">
                            <div className="h-64 bg-slate-900 rounded-xl" />
                            <div className="h-48 bg-slate-900 rounded-xl" />
                        </div>

                        {/* Right Col Skeleton */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="flex gap-8 border-b border-slate-800 pb-4">
                                <div className="w-16 h-4 bg-slate-900 rounded" />
                                <div className="w-16 h-4 bg-slate-900 rounded" />
                                <div className="w-16 h-4 bg-slate-900 rounded" />
                            </div>
                            <div className="h-32 bg-slate-900 rounded-xl" />
                            <div className="h-64 bg-slate-900 rounded-xl" />
                            <div className="h-64 bg-slate-900 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) return null

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">

            {/* --- Cover Image --- */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden group">
                <img
                    src={profile.cover}
                    alt="Cover"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Edit Cover Trigger */}
                <div className="absolute top-24 right-4 md:top-auto md:bottom-4 md:right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-md">
                        <Camera className="w-4 h-4 mr-2" />
                        Edit Cover
                    </Button>
                </div>
            </div>

            {/* --- Profile Header Info --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20 md:-mt-24">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">

                    {/* Avatar & Key Info */}
                    <div className="flex flex-col md:flex-row items-end md:items-end gap-6 relative">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-slate-950 bg-slate-900 overflow-hidden shadow-2xl relative group cursor-pointer">
                                <img src={profile.avatar || ""} alt={profile.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white/80" />
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-6 h-6 bg-green-500 border-4 border-slate-950 rounded-full" title="Online" />
                        </motion.div>

                        <div className="mb-2 md:mb-4 pt-2 md:pt-0">
                            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                                {profile.name}
                                <BadgeCheck className="w-6 h-6 text-blue-500" />
                            </h1>
                            <p className="text-slate-400 font-medium text-lg">@{profile.username}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-4 md:mt-0 md:self-end md:mb-6">
                        <Button className="rounded-full bg-white text-slate-950 hover:bg-slate-200 font-semibold px-6">
                            Edit Profile
                        </Button>
                        <Button variant="outline" className="rounded-full border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-800 text-slate-400">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
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
                                <p className="text-slate-300 leading-relaxed text-base">{profile.bio}</p>
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-slate-500" />
                                    <span>{profile.role}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-slate-500" />
                                    <span>{profile.location}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <LinkIcon className="w-5 h-5 text-slate-500" />
                                    <a href={`https://${profile.website}`} className="text-blue-400 hover:underline">{profile.website}</a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-slate-500" />
                                    <span>Joined {profile.joined}</span>
                                </div>
                            </div>
                        </div>

                        {/* Photos Preview */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">Photos</h3>
                                <Button variant="link" className="text-blue-400 p-0 h-auto text-sm">See all</Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-800 hover:opacity-90 cursor-pointer transition-opacity">
                                        <img
                                            src={`https://images.unsplash.com/photo-${1550000000000 + i * 1000000}?auto=format&fit=crop&q=80&w=200`}
                                            alt="Gallery"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MAIN FEED (Right Column) */}
                    <div className="lg:col-span-8">

                        {/* Custom Tabs */}
                        <div className="flex items-center gap-8 border-b border-slate-800 mb-6 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-20 pt-2 pb-px">
                            {["Posts", "About", "Media", "Likes"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === tab ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
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
                                {activeTab === "Posts" && <PostsFeed profile={profile} />}
                                {activeTab === "About" && (
                                    <div className="text-slate-400 text-center py-10">About details coming soon...</div>
                                )}
                                {activeTab === "Media" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                                                <img src={`https://images.unsplash.com/photo-${1550000000000 + i * 5000000}?auto=format&fit=crop&q=80&w=600`} alt="Media" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
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

function PostsFeed({ profile }: { profile: any }) {
    return (
        <div className="space-y-6">
            {/* Create Post Input */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex-shrink-0">
                    <img src={profile.avatar} alt="Me" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="What's on your mind?"
                        className="w-full bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 h-10"
                    />
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/50">
                        <div className="flex gap-2 text-blue-400">
                            <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 hover:text-blue-400 rounded-full w-8 h-8">
                                <ImageIcon className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 hover:text-blue-400 rounded-full w-8 h-8">
                                <MapPin className="w-5 h-5" />
                            </Button>
                        </div>
                        <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6">Post</Button>
                    </div>
                </div>
            </div>

            {/* Pinned Post */}
            <PostCard
                author={profile}
                time="Pinned"
                content="Excited to announce I'm joining the SociaVerse team! 🌍 Let's build the future of social connection together."
                image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                stats={{ likes: 420, comments: 45, shares: 12 }}
                isPinned
            />

            {/* Normal Post */}
            <PostCard
                author={profile}
                time="2h ago"
                content="Just pushed some updates to my portfolio. Check it out and let me know what you think! 🎨 #WebDesign #React"
                stats={{ likes: 85, comments: 12, shares: 3 }}
            />
        </div>
    )
}

function PostCard({ author, time, content, image, stats, isPinned }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
        >
            <div className="flex gap-3 mb-3">
                <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover border border-slate-800" />
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-200">{author.name}</h4>
                        {isPinned && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Pinned</span>}
                    </div>
                    <p className="text-xs text-slate-500">@{author.username} · {time}</p>
                </div>
            </div>

            <p className="text-slate-300 mb-4 whitespace-pre-wrap leading-relaxed">{content}</p>

            {image && (
                <div className="rounded-xl overflow-hidden mb-4 border border-slate-800">
                    <img src={image} alt="Post" className="w-full h-auto object-cover" />
                </div>
            )}

            <div className="flex items-center justify-between text-slate-500 pt-2 border-t border-slate-800/50">
                <Button variant="ghost" size="sm" className="hover:text-pink-500 gap-2 rounded-full">
                    <Heart className="w-4 h-4" /> {stats.likes}
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-blue-400 gap-2 rounded-full">
                    <MessageCircle className="w-4 h-4" /> {stats.comments}
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-green-400 gap-2 rounded-full">
                    <Share2 className="w-4 h-4" /> {stats.shares}
                </Button>
            </div>
        </motion.div>
    )
}
