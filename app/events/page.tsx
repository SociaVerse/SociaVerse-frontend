"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs"
import {
    Calendar, MapPin, Clock, Users, ArrowRight, Music, Code, Trophy, Star, Lock,
    Search, SlidersHorizontal, Filter, Globe, Sparkles, DollarSign, Tag, X, ChevronDown,
    Edit, Trash2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/custom-toast"

// Interface for Event
interface Event {
    id: number
    organizer_name: string
    title: string
    description: string
    category: string
    image: string | null
    start_date: string
    end_date: string
    location: string
    mode: string
    participation_type: string
    min_team_size: number
    max_team_size: number
    community: string
    rules: string | null
    prize: string | null
    is_promoted: boolean
    attendees_count?: number // Optional if backend doesn't send it yet
}

const CATEGORIES = [
    { id: "all", label: "All Events" },
    { id: "tech", label: "Tech & Coding", icon: Code },
    { id: "music", label: "Music & Arts", icon: Music },
    { id: "gaming", label: "Gaming", icon: Trophy },
    { id: "business", label: "Business", icon: Star },
]

export default function EventsPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const { toast, confirm } = useToast()
    const [activeTab, setActiveTab] = useState("foryou")
    const [searchQuery, setSearchQuery] = useState("")
    const [events, setEvents] = useState<Event[]>([])
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/events/')
                if (response.ok) {
                    const data = await response.json()
                    setEvents(data)
                }
            } catch (error) {
                console.error("Failed to fetch events:", error)
            } finally {
                setIsFetching(false)
            }
        }
        fetchEvents()
    }, [])

    if (isLoading || isFetching) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
    }

    if (!isAuthenticated) {
        return <AuthLockOverlay />
    }

    // Filter Logic
    const filteredEvents = events.filter(event => {
        if (activeTab === "foryou") return true
        // For 'following', we'd normally check user follows. For now just show all or filter by a dummy logic
        if (activeTab === "following") return true
        if (activeTab === "location") return true // Needs geolocation in future
        return true
    }).filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(e => activeTab === 'all' || activeTab === 'foryou' || activeTab === 'following' || activeTab === 'location' ? true : e.category.toLowerCase().includes(activeTab))

    const handleDelete = async (id: number) => {
        const isConfirmed = await confirm({
            title: "Delete Event",
            description: "Are you sure you want to delete this event? This action cannot be undone.",
            confirmText: "Delete Event",
            variant: "danger"
        })

        if (!isConfirmed) return

        const token = localStorage.getItem("sociaverse_token")

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            if (response.ok) {
                setEvents(prev => prev.filter(e => e.id !== id))
                toast({
                    type: "success",
                    title: "Event Deleted",
                    message: "The event has been successfully removed."
                })
            } else {
                toast({
                    type: "error",
                    title: "Deletion Failed",
                    message: "Could not delete the event. Please try again."
                })
            }
        } catch (error) {
            toast({
                type: "error",
                title: "Error",
                message: "An unexpected error occurred."
            })
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500/30 font-sans">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto space-y-8 pb-20">

                {/* Hero / Header Section */}
                <div className="pt-32 px-4 md:px-8 pb-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="space-y-6 max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold backdrop-blur-md"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>Explore Experiences</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight"
                            >
                                Discover <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Unforgettable Events</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-slate-400 max-w-2xl leading-relaxed"
                            >
                                Join hackathons, workshops, and exclusive meetups happening in your community.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button asChild className="h-14 px-8 rounded-full bg-white text-black hover:bg-slate-200 font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                                <Link href="/events/create">
                                    <Sparkles className="w-5 h-5 mr-2" /> Create Event
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Sticky Controls Container */}
                <div className="sticky top-20 z-40 px-4 md:px-8 -mx-4 md:-mx-8">
                    <div className="bg-neutral-950/80 backdrop-blur-2xl border-b border-white/5 pb-4 pt-2 md:py-4 shadow-lg shadow-black/20 transition-all">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-center">

                            {/* Tabs - Modernized Pill Style */}
                            <Tabs defaultValue="foryou" className="w-full md:w-auto" onValueChange={setActiveTab}>
                                <TabsList className="bg-transparent border-none p-0 h-auto w-full md:w-auto grid grid-cols-3 md:flex gap-2">
                                    <TabsTrigger value="foryou" className="rounded-full px-4 py-2 text-sm bg-white/5 border border-white/5 data-[state=active]:bg-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20 text-slate-400 font-medium transition-all">
                                        For You
                                    </TabsTrigger>
                                    <TabsTrigger value="following" className="rounded-full px-4 py-2 text-sm bg-white/5 border border-white/5 data-[state=active]:bg-purple-600 data-[state=active]:border-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-900/20 text-slate-400 font-medium transition-all">
                                        Following
                                    </TabsTrigger>
                                    <TabsTrigger value="location" className="rounded-full px-4 py-2 text-sm bg-white/5 border border-white/5 data-[state=active]:bg-emerald-600 data-[state=active]:border-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/20 text-slate-400 font-medium transition-all">
                                        Near Me
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {/* Search & Filter */}
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-80 group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-9 h-10 rounded-xl bg-white/5 border-white/10 focus:border-blue-500/50 focus:bg-white/10 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600 text-slate-300 text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="h-10 px-4 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-slate-400 hover:border-white/20 transition-all font-medium text-sm">
                                            <SlidersHorizontal className="w-4 h-4" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="bg-neutral-900/95 backdrop-blur-xl border-white/10 text-slate-100 sm:max-w-md">
                                        {/* Filter Content (Unchanged) */}
                                        <SheetHeader className="mb-6">
                                            <SheetTitle className="text-2xl font-bold text-white">Filter Events</SheetTitle>
                                        </SheetHeader>
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Timeframe</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {["Today", "Tomorrow", "This Week", "This Month"].map(label => (
                                                        <Button key={label} variant="outline" className="rounded-xl h-10 border-slate-700 hover:bg-slate-800 hover:text-white text-slate-400 justify-start px-4">
                                                            <Calendar className="w-4 h-4 mr-2 opacity-50" /> {label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Rewards</h3>
                                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
                                                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 shadow-lg shadow-yellow-500/10">
                                                        <Trophy className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-white">Has Prize Pool</h4>
                                                        <p className="text-xs text-slate-500">Only show competitive events</p>
                                                    </div>
                                                    <input type="checkbox" className="w-6 h-6 rounded border-slate-600 bg-slate-800 text-yellow-500 focus:ring-yellow-500/20 cursor-pointer accent-yellow-500" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Interests</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                                                        const Icon = cat.icon
                                                        return (
                                                            <div key={cat.id} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all hover:border-white/20 active:scale-95">
                                                                {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                                                                <span className="text-sm font-medium text-slate-300">{cat.label}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <SheetFooter className="mt-8">
                                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl h-14 text-lg font-bold shadow-lg shadow-blue-500/20">
                                                Apply Filters
                                            </Button>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>

                        {/* Quick Filters (Pills) - integrated into the bar */}
                        <div className=" mt-3 md:mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:justify-center px-1">
                            {CATEGORIES.map(cat => {
                                const Icon = cat.icon
                                return (
                                    <button
                                        key={cat.id}
                                        className="whitespace-nowrap px-4 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-all flex items-center gap-2 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/10"
                                    >
                                        {Icon && <Icon className="w-3 h-3 opacity-70" />}
                                        {cat.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                    {filteredEvents.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} onDelete={handleDelete} />
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border border-white/5">
                            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-800 shadow-xl">
                                <Search className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No matching events</h3>
                            <p className="text-slate-400 max-w-sm mx-auto">We couldn't find any events matching your current filters. Try adjusting your search.</p>
                            <Button variant="link" className="mt-4 text-blue-400" onClick={() => { setSearchQuery(""); setActiveTab("foryou") }}>Clear all filters</Button>
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}

function EventCard({ event, index, onDelete }: { event: any, index: number, onDelete: (id: number) => void }) {
    const { user } = useAuth()
    const isOwner = user?.username === event.organizer_name
    const router = useRouter()

    const handleCardClick = () => {
        router.push(`/events/${event.id}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={handleCardClick}
            className="group relative bg-neutral-900 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(120,40,255,0.15)] flex flex-col h-full cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent z-10 opacity-80" />
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <img
                    src={event.image || "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1000"} // Fallback image
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />

                <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                        <Globe className="w-3 h-3 text-blue-400" /> {event.category}
                    </span>
                    {event.prize && (
                        <span className="px-3 py-1.5 rounded-full bg-yellow-500/10 backdrop-blur-md border border-yellow-500/20 text-xs font-bold text-yellow-400 flex items-center gap-1.5 shadow-lg">
                            <Trophy className="w-3 h-3" /> {event.prize}
                        </span>
                    )}
                </div>

                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {isOwner && (
                        <>
                            <Button asChild size="icon" onClick={(e) => e.stopPropagation()} className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-blue-600/80 hover:scale-110 transition-all">
                                <Link href={`/events/${event.id}/edit`}>
                                    <Edit className="w-4 h-4" />
                                </Link>
                            </Button>
                            <Button size="icon" onClick={(e) => { e.stopPropagation(); onDelete(event.id) }} className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-red-400 hover:bg-red-500/80 hover:text-white hover:scale-110 transition-all">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    <Button size="icon" onClick={(e) => e.stopPropagation()} className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all">
                        <Star className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-1 relative z-20 -mt-10">
                {/* Date Badge float */}
                <div className="self-end mb-2">
                    <div className="bg-neutral-800/80 backdrop-blur-md rounded-2xl px-4 py-2 text-center border border-white/10 shadow-lg group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors duration-300">
                        <span className="block text-xs text-slate-400 group-hover:text-blue-100 uppercase font-black tracking-widest">{new Date(event.start_date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="block text-xl font-black text-white">{new Date(event.start_date).getDate()}</span>
                    </div>
                </div>

                <div className="mb-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
                            {event.organizer_name}
                        </span>
                        {event.is_promoted && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                                <Sparkles className="w-3 h-3" /> Promoted
                            </span>
                        )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-100 mb-3 leading-tight group-hover:text-blue-400 transition-colors">
                        {event.title}
                    </h3>

                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-6">
                        {event.description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <MapPin className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                            <span className="font-medium">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 pl-6">
                            <span>{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-white transition-colors">
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function AuthLockOverlay() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            {/* Background Ambience - Removed, handled by BackgroundManager (or simplified for overlay) */}

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
