"use client"

import { motion } from "framer-motion"
import { Search, MapPin, Users, GraduationCap, ArrowRight, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AuthModal } from "@/components/auth-modal"

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState("All")
    const router = useRouter()
    const { isAuthenticated } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) {
            setShowAuthModal(true)
        } else {
            action()
        }
    }

    const universities = [
        {
            name: "Stanford University",
            location: "California, USA",
            students: "16k+",
            color: "from-red-600 to-red-800",
            image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&q=80&w=500"
        },
        {
            name: "MIT",
            location: "Massachusetts, USA",
            students: "11k+",
            color: "from-slate-600 to-slate-800",
            image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=500"
        },
        {
            name: "Oxford University",
            location: "Oxford, UK",
            students: "24k+",
            color: "from-blue-600 to-blue-800",
            image: "https://images.unsplash.com/photo-1580843410763-48582e62a49f?auto=format&fit=crop&q=80&w=500"
        },
        {
            name: "ETH Zurich",
            location: "Zurich, Switzerland",
            students: "22k+",
            color: "from-orange-600 to-orange-800",
            image: "https://images.unsplash.com/photo-1590642916589-59234a0a613c?auto=format&fit=crop&q=80&w=500"
        }
    ]

    const people = [
        {
            name: "Alex Rivera",
            role: "CS Student @ Stanford",
            bio: "Building the future of AI. 🤖",
            followers: "2.4k",
            gradient: "from-blue-400 to-cyan-400"
        },
        {
            name: "Sarah Chen",
            role: "Design @ RISD",
            bio: "Pixel pusher & coffee addict. ☕️",
            followers: "5.1k",
            gradient: "from-purple-400 to-pink-400"
        },
        {
            name: "Marcus Johnson",
            role: "MBA @ Harvard",
            bio: "Startup founder. Let's connect! 🚀",
            followers: "3.8k",
            gradient: "from-emerald-400 to-green-400"
        },
        {
            name: "Priya Patel",
            role: "Med Student @ JHU",
            bio: "Saving lives & taking notes. 🩺",
            followers: "1.9k",
            gradient: "from-orange-400 to-yellow-400"
        }
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20">

            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-600/5 to-purple-600/5 blur-[100px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Search */}
                <div className="flex flex-col items-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-8 text-center"
                    >
                        Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Universe</span> 
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-full max-w-3xl relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
                            <div className="flex items-center px-4 py-3">
                                <Search className="h-6 w-6 text-slate-400 mr-4" />
                                <input
                                    type="text"
                                    placeholder="Search universities, people, or topics..."
                                    className="bg-transparent border-none outline-none flex-1 text-lg text-slate-200 placeholder:text-slate-500"
                                />
                                <Button className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6">
                                    Search
                                </Button>
                            </div>

                            {/* Search Tabs */}
                            <div className="flex gap-2 px-2 pb-2 mt-2 border-t border-slate-800/50 pt-2 overflow-x-auto">
                                {["All", "Universities", "People", "Events", "Notes"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                                            ? "bg-slate-800 text-blue-400"
                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Featured Universities */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-blue-400" />
                            Top Universities
                        </h2>
                        <Button variant="ghost" className="text-slate-400 hover:text-white">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {universities.map((uni, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                onClick={() => handleAuthAction(() => console.log(`Clicked University: ${uni.name}`))}
                                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer"
                            >
                                <div className="absolute inset-0">
                                    <img src={uni.image} alt={uni.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${uni.color} flex items-center justify-center mb-4 shadow-lg`}>
                                        <GraduationCap className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{uni.name}</h3>
                                    <p className="text-slate-400 text-sm flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {uni.location}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Suggested People */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                            <Users className="h-8 w-8 text-purple-400" />
                            People to Follow
                        </h2>
                        <Button variant="ghost" className="text-slate-400 hover:text-white">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {people.map((person, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm flex flex-col items-center text-center group hover:border-purple-500/30 transition-colors"
                            >
                                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${person.gradient} p-1 mb-4`}>
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl">
                                        {person.name.charAt(0)}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold mb-1">{person.name}</h3>
                                <p className="text-blue-400 text-sm font-medium mb-2">{person.role}</p>
                                <p className="text-slate-400 text-sm mb-6">{person.bio}</p>
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl border-slate-700 hover:bg-slate-800 hover:text-white"
                                    onClick={() => handleAuthAction(() => console.log(`Connected with ${person.name}`))}
                                >
                                    Connect
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Trending Now */}
                <section>
                    <div className="flex items-center gap-2 mb-8">
                        <TrendingUp className="h-6 w-6 text-green-400" />
                        <h2 className="text-xl font-bold text-slate-300 uppercase tracking-wider">Trending Now</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["#Hackathon2025", "#FinalsWeek", "#AIArt", "#CampusLife", "#Internships", "#StudySetup", "#Coding", "#Design"].map((tag, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 cursor-pointer transition-colors text-center"
                            >
                                <span className="text-slate-300 font-medium">{tag}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </div>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    )
}
