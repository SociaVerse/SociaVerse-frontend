"use client"

import { useState, useEffect, use } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { User, Mail, MapPin, Link as LinkIcon, UserPlus, MessageSquare, MoreHorizontal } from "lucide-react"

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
    // Unwrapping params using React.use() as recommended in Next.js 15+ (though 14 logic also works, safe to use promise unwrapping pattern if unsure about precise version, but here simply awaiting or using use() hook is standard for async params in newer Next.js or standard props in older. Given package.json said Next 16, params is a Promise)

    const { username } = use(params)

    const [isFollowing, setIsFollowing] = useState(false)
    const [profile, setProfile] = useState({
        name: username.charAt(0).toUpperCase() + username.slice(1), // Mock name from username
        username: username,
        bio: "Digital creator and tech enthusiast. Sharing my journey through code and pixels. 📸 💻",
        location: "New York, USA",
        website: "portfolio.dev",
        followers: 1234,
        following: 567,
        posts: 42,
        avatar: null
    })

    // Mock Fetching data
    useEffect(() => {
        // Simulate fetching user data
        console.log("Fetching data for", username)
        // setProfile(...)
    }, [username])


    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-slate-950 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <main className="max-w-4xl mx-auto relative z-10">

                {/* Header / Cover */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-48 md:h-64 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 relative shadow-2xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black/20" />
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
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-950 bg-slate-900 flex items-center justify-center shadow-xl overflow-hidden">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-slate-600" />
                                )}
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex space-x-3 mb-4 md:mb-8"
                        >
                            <Button
                                onClick={() => setIsFollowing(!isFollowing)}
                                className={`transition-all ${isFollowing ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                            >
                                {isFollowing ? (
                                    <>Following</>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Follow
                                    </>
                                )}
                            </Button>
                            <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 backdrop-blur-sm">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Message
                            </Button>
                            <Button variant="outline" size="icon" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 backdrop-blur-sm">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    </div>

                    {/* Profile Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mt-8 grid gap-8 md:grid-cols-3"
                    >
                        {/* Left Column: Bio/Stats */}
                        <div className="space-y-6">
                            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-lg">
                                <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
                                <p className="text-blue-400 font-medium mb-4">@{profile.username}</p>
                                <p className="text-slate-300 mb-6 leading-relaxed">
                                    {profile.bio}
                                </p>

                                <div className="space-y-3 text-sm border-t border-slate-800 pt-4">
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
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-xl font-bold text-white">{profile.posts}</div>
                                        <div className="text-xs text-slate-500">Posts</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">{profile.followers}</div>
                                        <div className="text-xs text-slate-500">Followers</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">{profile.following}</div>
                                        <div className="text-xs text-slate-500">Following</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Content */}
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="text-xl font-semibold text-white px-1">Posts</h3>
                            {/* Placeholder Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl aspect-video flex items-center justify-center text-slate-600 hover:bg-slate-900/60 hover:border-slate-700 transition-all cursor-pointer group">
                                        <span className="group-hover:text-slate-400 transition-colors">Post Preview {i}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </motion.div>

                </div>
            </main>
        </div>
    )
}
