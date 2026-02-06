"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Calendar, MapPin, Clock, Trophy, Share2, ArrowLeft,
    Globe, Users, Sparkles, CheckCircle2, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/custom-toast"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Check } from "lucide-react"

export default function EventDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const { toast } = useToast()

    const [event, setEvent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRegistering, setIsRegistering] = useState(false)
    const [showRegisterSheet, setShowRegisterSheet] = useState(false)
    const [regForm, setRegForm] = useState<any>({})

    const handleRegister = async () => {
        setIsRegistering(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            if (!token) {
                toast({ type: "error", title: "Login Required", message: "Please login to register" })
                router.push("/login") // or open login modal
                return
            }

            const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({ data: regForm })
            })

            if (response.ok) {
                toast({ type: "success", title: "Registered!", message: "You have successfully registered." })
                setEvent((prev: any) => ({ ...prev, is_registered: true, registration_count: (prev.registration_count || 0) + 1 }))
                setShowRegisterSheet(false)
            } else {
                const error = await response.json()
                toast({ type: "error", title: "Registration Failed", message: error.error || "Something went wrong" })
            }
        } catch (error) {
            toast({ type: "error", title: "Error", message: "Network error" })
        } finally {
            setIsRegistering(false)
        }
    }

    // Autofill effect
    useEffect(() => {
        if (showRegisterSheet && user && event?.registration_fields) {
            const initialData: any = {}
            event.registration_fields.forEach((field: string) => {
                if (field === 'Name') initialData[field] = user.username // or full name if available
                else if (field === 'Email') initialData[field] = user.email
                else if (field === 'College') initialData[field] = user.college || ""
                else initialData[field] = ""
            })
            setRegForm(initialData)
        }
    }, [showRegisterSheet, user, event])

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/events/${id}/`)
                if (response.ok) {
                    const data = await response.json()
                    setEvent(data)
                } else {
                    toast({ type: "error", title: "Error", message: "Event not found" })
                    router.push("/events")
                }
            } catch (error) {
                console.error("Failed to fetch event:", error)
                toast({ type: "error", title: "Network Error", message: "Could not load event details" })
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchEvent()
    }, [id, router, toast])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
        )
    }

    if (!event) return null

    return (
        <div className="min-h-screen bg-neutral-950 text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
            {/* Subtle Ambient Background - Toned down for professionalism */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/10 to-transparent opacity-40" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* Compact Header Section */}
                <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl mb-8">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 h-80 md:h-96">
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent z-10" />
                        <img
                            src={event.image || "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1000"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-20 pt-40 md:pt-48 px-6 md:px-10 pb-10">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-md bg-white/10 border border-white/10 text-white text-xs font-semibold backdrop-blur-md uppercase tracking-wider">
                                        {event.category}
                                    </span>
                                    {event.is_promoted && (
                                        <span className="px-3 py-1 rounded-md bg-purple-500/20 border border-purple-500/20 text-purple-300 text-xs font-semibold backdrop-blur-md uppercase tracking-wider flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Promoted
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                    {event.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-400" />
                                        <span>{new Date(event.start_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-400" />
                                        <span>{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-400" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Back Button (Absolute Top Right) */}
                            <div className="absolute top-6 right-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    className="bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10 p-0 backdrop-blur-md border border-white/10"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section - Clean Text */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                About Event
                            </h2>
                            <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
                                {event.description}
                            </div>
                        </section>

                        {/* Rules Section - Compact Card */}
                        <section className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-slate-400" />
                                Rules & Requirements
                            </h3>
                            <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                                {event.rules || "No specific rules provided. Please follow standard community guidelines."}
                            </div>
                        </section>

                        {/* Prize Pool - List View */}
                        {(event.prize || event.prize_first) && (
                            <section>
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    Prize Distribution
                                </h2>
                                <div className="space-y-3">
                                    {event.prize_first && (
                                        <div className="flex items-center justify-between bg-neutral-900 border border-yellow-500/20 rounded-xl p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-xl">🥇</div>
                                                <div>
                                                    <p className="font-bold text-white">Winner</p>
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider">1st Place</p>
                                                </div>
                                            </div>
                                            <span className="font-mono font-bold text-yellow-400 text-lg">{event.prize_first}</span>
                                        </div>
                                    )}
                                    {event.prize_second && (
                                        <div className="flex items-center justify-between bg-neutral-900 border border-white/5 rounded-xl p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center text-xl">🥈</div>
                                                <div>
                                                    <p className="font-bold text-slate-200">1st Runner Up</p>
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider">2nd Place</p>
                                                </div>
                                            </div>
                                            <span className="font-mono font-bold text-slate-300 text-lg">{event.prize_second}</span>
                                        </div>
                                    )}
                                    {event.prize_third && (
                                        <div className="flex items-center justify-between bg-neutral-900 border border-white/5 rounded-xl p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-orange-700/10 flex items-center justify-center text-xl">🥉</div>
                                                <div>
                                                    <p className="font-bold text-slate-300">2nd Runner Up</p>
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider">3rd Place</p>
                                                </div>
                                            </div>
                                            <span className="font-mono font-bold text-orange-200 text-lg">{event.prize_third}</span>
                                        </div>
                                    )}
                                    {event.prize_others && (
                                        <div className="flex items-center justify-between bg-neutral-900 border border-white/5 rounded-xl p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center text-xl">🎁</div>
                                                <div>
                                                    <p className="font-bold text-slate-200">Other</p>
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Other Place</p>
                                                </div>
                                            </div>
                                            <span className="font-mono font-bold text-slate-300 text-lg">{event.prize_others}</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Registration Card - Simplified */}
                            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                                <div className="mb-6">
                                    <p className="text-sm text-slate-500 mb-1">Entry Fee</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-white">Free</span>
                                        <span className="text-sm text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">Open to All</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                                        <Users className="w-4 h-4" />
                                        <span>{event.registration_count || 0} registered already</span>
                                    </div>
                                </div>

                                <Button
                                    className={`w-full font-semibold h-12 rounded-xl mb-3 shadow transition-all ${event.is_registered
                                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-default"
                                        : event.organizer === user?.id
                                            ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                                            : "bg-white text-neutral-900 hover:bg-slate-200"
                                        }`}
                                    disabled={event.is_registered || event.organizer === user?.id}
                                    onClick={() => !event.is_registered && event.organizer !== user?.id && setShowRegisterSheet(true)}
                                >
                                    {event.is_registered ? (
                                        <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Registered</span>
                                    ) : event.organizer === user?.id ? (
                                        "Organizer View"
                                    ) : (
                                        "Register Now"
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full border-white/10 text-slate-300 hover:bg-white/5 hover:text-white h-12 rounded-xl"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href)
                                        toast({ type: "success", title: "Copied", message: "Link copied to clipboard" })
                                    }}
                                >
                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                </Button>

                                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                                        {event.organizer_name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{event.organizer_name}</p>
                                        <p className="text-xs text-slate-500">Event Organizer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Registration Sheet */}
            <Sheet open={showRegisterSheet} onOpenChange={setShowRegisterSheet}>
                <SheetContent className="bg-neutral-900 border-l border-white/10 text-white w-full sm:max-w-md">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl font-bold text-white">Register for Event</SheetTitle>
                        <SheetDescription className="text-slate-400">
                            Complete the form below to secure your spot.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4">
                        {event.registration_fields?.length > 0 ? (
                            event.registration_fields.map((field: string) => (
                                <div key={field} className="space-y-2">
                                    <Label className="text-slate-300">{field}</Label>
                                    <Input
                                        value={regForm[field] || ""}
                                        onChange={(e) => setRegForm({ ...regForm, [field]: e.target.value })}
                                        className="bg-neutral-800 border-slate-700 focus:border-purple-500"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="py-4 text-center text-slate-400 italic">
                                No specific information required. Click confirm to register.
                            </div>
                        )}

                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold h-12 mt-6"
                            onClick={handleRegister}
                            disabled={isRegistering}
                        >
                            {isRegistering ? "Registering..." : "Confirm Registration"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
