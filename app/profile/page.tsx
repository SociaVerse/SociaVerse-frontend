"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, MapPin, Link as LinkIcon, Edit2, Settings, Share2, Camera, LogOut } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const { isAuthenticated, logout, isLoading } = useAuth()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)

    // State
    const [profile, setProfile] = useState({
        name: "",
        username: "",
        email: "",
        bio: "",
        location: "",
        website: "",
        avatar: null as string | null
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
            const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setProfile({
                    name: `${data.first_name} ${data.last_name}`.trim() || data.username,
                    username: data.username,
                    email: data.email,
                    bio: "Bio not yet implemented in backend", // Placeholder as backend model doesn't have Bio yet
                    location: data.college || "Unknown",
                    website: "",
                    avatar: null
                })
            } else {
                console.error("Failed to fetch profile")
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
        } finally {
            setIsLoadingData(false)
        }
    }

    if (isLoading || isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!isAuthenticated) return null

    const handleSave = () => {
        setIsEditing(false)
        // TODO: Implement update profile endpoint
        console.log("Saved profile:", profile)
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-slate-950 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <main className="max-w-4xl mx-auto relative z-10">

                {/* Header / Cover */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-48 md:h-64 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 relative shadow-2xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                        <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-none">
                            <Camera className="w-4 h-4 mr-2" />
                            Change Cover
                        </Button>
                    </div>
                </motion.div>

                <div className="px-4 md:px-8 -mt-20 relative">
                    <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="relative group"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-950 bg-slate-900 flex items-center justify-center shadow-xl overflow-hidden relative">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-slate-600" />
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex space-x-3 mb-4 md:mb-8"
                        >
                            {isEditing ? (
                                <>
                                    <Button onClick={() => setIsEditing(false)} variant="ghost" className="text-slate-300 hover:bg-slate-800">Cancel</Button>
                                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white">Save Changes</Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 backdrop-blur-sm" onClick={() => setIsEditing(true)}>
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                    <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 backdrop-blur-sm">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="destructive" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-none shadow-none" onClick={logout}>
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </>
                            )}
                        </motion.div>
                    </div>

                    {/* Profile Info Form/Display */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mt-8 grid gap-8 md:grid-cols-3"
                    >
                        {/* Left Column: Stats/Menu */}
                        <div className="space-y-6">
                            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center text-slate-400">
                                        <Mail className="w-4 h-4 mr-3 text-blue-500" />
                                        <span>{profile.email}</span>
                                    </div>
                                    <div className="flex items-center text-slate-400">
                                        <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                                        <span>{profile.location}</span>
                                    </div>
                                    <div className="flex items-center text-slate-400">
                                        <LinkIcon className="w-4 h-4 mr-3 text-blue-500" />
                                        <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">{profile.website}</a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-white mb-4">Stats</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-white">12</div>
                                        <div className="text-xs text-slate-500">Posts</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">1.2k</div>
                                        <div className="text-xs text-slate-500">Followers</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">450</div>
                                        <div className="text-xs text-slate-500">Following</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Edit Form or Content */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-lg">
                                <div className="mb-6">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    className="bg-slate-800 border-slate-700 text-white focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="username">Username</Label>
                                                <Input
                                                    id="username"
                                                    value={profile.username}
                                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                                    className="bg-slate-800 border-slate-700 text-white focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                <textarea
                                                    id="bio"
                                                    value={profile.bio}
                                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                    className="flex min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="location">Location</Label>
                                                    <Input
                                                        id="location"
                                                        value={profile.location}
                                                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                                        className="bg-slate-800 border-slate-700 text-white focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="website">Website</Label>
                                                    <Input
                                                        id="website"
                                                        value={profile.website}
                                                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                                        className="bg-slate-800 border-slate-700 text-white focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h1 className="text-3xl font-bold text-white mb-1 group flex items-center">
                                                {profile.name}
                                                {/* <span className="ml-2 text-blue-500 text-sm bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Pro</span> */}
                                            </h1>
                                            <p className="text-blue-400 font-medium mb-4">@{profile.username}</p>
                                            <p className="text-slate-300 leading-relaxed max-w-2xl">
                                                {profile.bio}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Activity / Posts Section (Placeholder) */}
                            {!isEditing && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-white px-1">Recent Activity</h3>
                                    {/* Placeholder for posts */}
                                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-lg text-center py-12">
                                        <p className="text-slate-500">No recent activity to show.</p>
                                        <Button variant="link" className="text-blue-500 mt-2">Create a new post</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
