"use client"

import { motion } from "framer-motion"
import { Search, Users, Zap, Code, Palette, Gamepad2, Music, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CommunityPage() {
    const communities = [
        {
            title: "Hackster Club",
            members: "500",
            online: "142",
            description: "For the cybersecurity enthusiasts and ethical hackers.",
            color: "from-pink-500 to-rose-500",
            icon: <Palette className="h-6 w-6" />
        },
        {
            title: "Coding 💻",
            members: "8.5k",
            online: "520",
            description: "Debug, deploy, and discuss the latest tech stacks.",
            color: "from-blue-500 to-cyan-500",
            icon: <Code className="h-6 w-6" />
        },
        {
            title: "Startup Squad 🚀",
            members: "2.1k",
            online: "89",
            description: "Building the next unicorn? Find your co-founders here.",
            color: "from-orange-500 to-amber-500",
            icon: <Zap className="h-6 w-6" />
        },
        {
            title: "Gaming Lounge 🎮",
            members: "12k",
            online: "1.2k",
            description: "Competitive gaming, casual lobbies, and game dev talk.",
            color: "from-green-500 to-emerald-500",
            icon: <Gamepad2 className="h-6 w-6" />
        },
        {
            title: "Music Makers 🎵",
            members: "3.4k",
            online: "210",
            description: "Collab on beats, share tracks, and discuss theory.",
            color: "from-purple-500 to-violet-500",
            icon: <Music className="h-6 w-6" />
        },
        {
            title: "idkkkkkk",
            members: "5.6k",
            online: "340",
            description: "Connect with students from universities worldwide.",
            color: "from-indigo-500 to-blue-500",
            icon: <Globe className="h-6 w-6" />
        }
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20">

            {/* Background Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], x: [0, -30, 0], y: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", delay: 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Tribe</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
                    >
                        Join communities that match your vibe. Connect, collaborate, and create with students who share your passion.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-full px-6 py-4 shadow-2xl">
                            <Search className="h-6 w-6 text-slate-400 mr-4" />
                            <input
                                type="text"
                                placeholder="Search for communities (e.g. 'coding', 'art', 'gaming')..."
                                className="bg-transparent border-none outline-none flex-1 text-lg text-slate-200 placeholder:text-slate-500"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mb-16"
                >
                    {["All", "Technology", "Art & Design", "Gaming", "Music", "Science", "Business"].map((cat, i) => (
                        <button
                            key={i}
                            className={`px-6 py-2 rounded-full border transition-all ${i === 0
                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                                    : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Community Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {communities.map((community, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            whileHover={{
                                y: -10,
                                scale: 1.02,
                                rotateX: 5,
                                rotateY: 5,
                                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)"
                            }}
                            className="group relative bg-slate-900/40 border border-slate-800 backdrop-blur-sm rounded-3xl overflow-hidden perspective-1000"
                        >
                            {/* Gradient Header */}
                            <div className={`h-32 bg-gradient-to-r ${community.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

                            <div className="p-6 relative">
                                {/* Icon Badge */}
                                <div className="absolute -top-10 left-6 w-20 h-20 rounded-2xl bg-slate-900 border-4 border-slate-950 flex items-center justify-center shadow-xl">
                                    <div className={`w-full h-full rounded-xl bg-gradient-to-br ${community.color} opacity-20 absolute inset-0`} />
                                    <div className="relative z-10 text-white">
                                        {community.icon}
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{community.title}</h3>
                                    <p className="text-slate-400 mb-6 line-clamp-2">{community.description}</p>

                                    <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>{community.members}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span>{community.online} online</span>
                                        </div>
                                    </div>

                                    <Button className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-blue-500/20">
                                        Join Community
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    )
}
