"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, Users, ArrowRight, Music, Code, Trophy, Star, Lock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"


const events = [
    {
        title: "Inter-College Hackathon 2024",
        category: "Tech & Coding",
        date: "Mar 15, 2024",
        time: "48 Hours",
        location: "Main Auditorium",
        attendees: 450,
        image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1000",
        color: "from-blue-500 to-cyan-500",
        icon: <Code className="h-5 w-5" />
    },
    {
        title: "Neon Night Music Fest",
        category: "Entertainment",
        date: "Mar 20, 2024",
        time: "7:00 PM",
        location: "Campus Grounds",
        attendees: 1200,
        image: "https://images.unsplash.com/photo-1459749411177-d4a37196040e?auto=format&fit=crop&q=80&w=1000",
        color: "from-purple-500 to-pink-500",
        icon: <Music className="h-5 w-5" />
    },
    {
        title: "E-Sports Championship",
        category: "Gaming",
        date: "Mar 25, 2024",
        time: "10:00 AM",
        location: "Student Center",
        attendees: 300,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
        color: "from-green-500 to-emerald-500",
        icon: <Trophy className="h-5 w-5" />
    },
    {
        title: "Startup Pitch Day",
        category: "Business",
        date: "Apr 02, 2024",
        time: "2:00 PM",
        location: "Innovation Hub",
        attendees: 150,
        image: "https://images.unsplash.com/photo-1559136555-930d72f18615?auto=format&fit=crop&q=80&w=1000",
        color: "from-orange-500 to-yellow-500",
        icon: <Star className="h-5 w-5" />
    }
]

export default function EventsPage() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Ambience */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
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

                    <p className="mt-6 text-xs text-slate-500">
                        It only takes a minute to join 10k+ students.
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

                <div className="container px-4 mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                            <Calendar className="h-4 w-4" />
                            <span>Campus Life</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Events</span> Near You
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            From hackathons to music festivals, find out what's happening on campus and never miss a moment.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Events Listings */}
            <section className="pb-32">
                <div className="container px-4 mx-auto max-w-7xl">

                    {/* Filters (Visual Only) */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {["All Events", "Tech", "Music", "Sports", "Workshops", "Social"].map((filter, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`px-6 py-2 rounded-full border text-sm font-medium transition-all ${i === 0
                                    ? "bg-slate-100 text-slate-900 border-slate-100"
                                    : "bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white"
                                    }`}
                            >
                                {filter}
                            </motion.button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {events.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group relative rounded-3xl overflow-hidden bg-slate-900/50 border border-slate-800 backdrop-blur-sm"
                            >
                                {/* Image Overlay */}
                                <div className="relative h-64 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10 opacity-90`} />
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/20`}>
                                            {event.icon} {event.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative p-6 -mt-12 z-20">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-300">
                                                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-blue-400" /> {event.date}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-blue-400" /> {event.time}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-slate-800/50 my-4" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-400">
                                                <MapPin className="h-4 w-4" /> {event.location}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-400">
                                                <Users className="h-4 w-4" /> {event.attendees} interested
                                            </div>
                                        </div>
                                        <Button size="icon" className={`rounded-full h-12 w-12 bg-gradient-to-r ${event.color} hover:shadow-lg hover:scale-105 transition-all`}>
                                            <ArrowRight className="h-5 w-5 text-white" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

        </div>
    )
}
