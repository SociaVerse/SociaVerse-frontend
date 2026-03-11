"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Calendar, MapPin, Clock, Trophy, Share2, ArrowLeft,
    Globe, Users, Sparkles, CheckCircle2, AlertCircle,
    CalendarPlus, Map, Mail, Ticket
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
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({ data: regForm })
            })

            if (response.ok) {
                const responseData = await response.json()
                toast({ type: "success", title: "Success", message: responseData.message || "Registration submitted." })
                setEvent((prev: any) => ({
                    ...prev,
                    is_registered: true,
                    registration_status: responseData.status,
                    registration_count: (prev.registration_count || 0) + 1
                }))
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

    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)

    const handleCancelRegistration = async () => {
        setIsCancelling(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/register/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${token}`
                }
            })

            if (response.ok) {
                toast({ type: "success", title: "Cancelled", message: "Your registration has been cancelled." })
                setEvent((prev: any) => ({
                    ...prev,
                    is_registered: false,
                    registration_status: null,
                    registration_count: Math.max(0, (prev.registration_count || 1) - 1)
                }))
                setShowCancelDialog(false)
            } else {
                const error = await response.json()
                toast({ type: "error", title: "Action Failed", message: error.error || "Could not cancel registration" })
            }
        } catch (error) {
            toast({ type: "error", title: "Error", message: "Network error" })
        } finally {
            setIsCancelling(false)
        }
    }

    const generateCalendarUrl = (type: 'google' | 'outlook' | 'yahoo') => {
        if (!event) return '#'

        const startRaw = new Date(event.start_date)
        const endRaw = event.end_date ? new Date(event.end_date) : new Date(startRaw.getTime() + 60 * 60 * 1000)

        const title = encodeURIComponent(event.title)
        const details = encodeURIComponent(event.description?.substring(0, 200) + '...')
        const location = encodeURIComponent(event.location)

        const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')

        if (type === 'google') {
            return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGCalDate(startRaw)}/${formatGCalDate(endRaw)}&details=${details}&location=${location}`
        }
        if (type === 'outlook') {
            return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startRaw.toISOString()}&enddt=${endRaw.toISOString()}&body=${details}&location=${location}`
        }
        return '#'
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
                const token = localStorage.getItem("sociaverse_token")
                const headers: HeadersInit = {}
                if (token) {
                    headers["Authorization"] = `Token ${token}`
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/`, { headers })
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

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">

                {/* Premium Header Section */}
                <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-10">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 h-64 md:h-80">
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-900/20 z-10" />
                        <img
                            src={event.image || "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1000"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-20 pt-32 md:pt-48 px-6 md:px-10 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex gap-2 mb-4">
                                    <span className="px-3 py-1 rounded-md bg-neutral-800/80 border border-neutral-700 text-neutral-200 text-xs font-medium backdrop-blur-sm">
                                        {event.category}
                                    </span>
                                    {event.is_promoted && (
                                        <span className="px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium flex items-center gap-1.5">
                                            <Sparkles className="w-3 h-3" /> Promoted
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                    {event.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-5 text-sm md:text-base text-neutral-400 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-neutral-500" />
                                        <span>{new Date(event.start_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-neutral-500" />
                                        <span>{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer group"
                                    >
                                        <MapPin className="w-4 h-4 text-neutral-500 group-hover:text-blue-400" />
                                        <span className="underline decoration-neutral-700 underline-offset-4 group-hover:decoration-blue-500/50">{event.location}</span>
                                    </a>
                                </div>
                            </div>

                            {/* Back Button (Absolute Top Right) */}
                            <div className="absolute top-6 right-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    className="bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 rounded-lg h-10 w-10 p-0 backdrop-blur-sm border border-neutral-800/50 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About Section - Clean Text */}
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-neutral-500" />
                                About Event
                            </h2>
                            <div className="prose prose-invert prose-neutral max-w-none text-neutral-300 leading-relaxed text-base">
                                {event.description}
                            </div>
                        </section>

                        {/* Rules Section - Compact Card */}
                        {event.rules && (
                            <section>
                                <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-neutral-500" />
                                    Rules & Requirements
                                </h3>
                                <div className="bg-neutral-900/50 rounded-xl p-6 text-neutral-300 leading-relaxed whitespace-pre-wrap border border-neutral-800 text-sm">
                                    {event.rules}
                                </div>
                            </section>
                        )}

                        {/* Prize Pool - List View */}
                        {(event.prize || event.prize_first) && (
                            <section>
                                <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-neutral-500" />
                                    Prize Distribution
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {event.prize_first && (
                                        <div className="flex items-center justify-between bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 border border-neutral-700 font-semibold">1st</div>
                                                <div>
                                                    <p className="font-semibold text-white text-base">Winner</p>
                                                    <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">1st Place</p>
                                                </div>
                                            </div>
                                            <span className="font-mono font-medium text-neutral-200 text-lg">{event.prize_first}</span>
                                        </div>
                                    )}
                                    {event.prize_second && (
                                        <div className="flex items-center justify-between bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 border border-neutral-700 font-semibold">2nd</div>
                                                <div>
                                                    <p className="font-semibold text-white text-base">1st Runner Up</p>
                                                    <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">2nd Place</p>
                                                </div>
                                            </div>
                                            <span className="font-mono font-medium text-neutral-200 text-lg">{event.prize_second}</span>
                                        </div>
                                    )}
                                    {event.prize_third && (
                                        <div className="flex items-center justify-between bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 border border-neutral-700 font-semibold">3rd</div>
                                                <div>
                                                    <p className="font-semibold text-white text-base">2nd Runner Up</p>
                                                    <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">3rd Place</p>
                                                </div>
                                            </div>
                                            <span className="font-mono font-medium text-neutral-200 text-lg">{event.prize_third}</span>
                                        </div>
                                    )}
                                    {event.prize_others && (
                                        <div className="flex items-center justify-between bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 border border-neutral-700"><Sparkles className="w-4 h-4" /></div>
                                                <div>
                                                    <p className="font-semibold text-white text-base">Other</p>
                                                    <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">Additional</p>
                                                </div>
                                            </div>
                                            <span className="font-mono font-medium text-neutral-200 text-lg">{event.prize_others}</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                        {/* Speakers Section */}
                        {event.speakers?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-neutral-500" />
                                    Speakers & Special Guests
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {event.speakers.map((speaker: any, i: number) => (
                                        <div key={i} className="bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 flex items-center gap-4 transition-colors">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/50">
                                                <img src={speaker.photoUrl || `https://ui-avatars.com/api/?name=${speaker.name}&background=random`} alt={speaker.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white text-base">{speaker.name}</h4>
                                                <p className="text-xs text-neutral-400 font-medium mb-0.5">{speaker.role}</p>
                                                <p className="text-xs text-neutral-500 line-clamp-1">{speaker.company}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Schedule Section */}
                        {event.schedule?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-neutral-500" />
                                    Event Itinerary
                                </h2>
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-neutral-800">
                                    {event.schedule.map((item: any, i: number) => (
                                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-950 border-4 border-neutral-950 text-neutral-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-700 group-hover:bg-blue-500 transition-colors" />
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                                    <h4 className="font-semibold text-white text-base">{item.title}</h4>
                                                    <span className="text-xs font-mono text-neutral-400 font-medium px-2.5 py-1 bg-neutral-800/50 rounded-md border border-neutral-700/50">{item.time}</span>
                                                </div>
                                                <p className="text-sm text-neutral-400 leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Sponsors Section */}
                        {event.sponsors?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-neutral-500" />
                                    Supported By
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {event.sponsors.map((sponsor: any, i: number) => (
                                        <a key={i} href={sponsor.website} target="_blank" rel="noopener noreferrer" className="bg-neutral-900/30 rounded-xl p-5 flex flex-col items-center justify-center border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 transition-colors group">
                                            {sponsor.logoUrl ? (
                                                <img src={sponsor.logoUrl} alt={sponsor.name} className="h-10 object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 mb-3" />
                                            ) : (
                                                <div className="h-10 flex items-center justify-center text-neutral-500 group-hover:text-neutral-300 transition-colors font-semibold text-base mb-3 text-center">{sponsor.name}</div>
                                            )}
                                            <span className="text-[10px] font-medium text-neutral-600 uppercase tracking-widest">{sponsor.tier}</span>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FAQs Section */}
                        {event.faqs?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-neutral-500" />
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-3">
                                    {event.faqs.map((faq: any, i: number) => (
                                        <div key={i} className="bg-neutral-900/40 rounded-xl p-6 border border-neutral-800">
                                            <h4 className="font-semibold text-white text-base mb-2">{faq.question}</h4>
                                            <p className="text-sm text-neutral-400 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Registration Card - Professional */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm">
                                <div className="mb-6">
                                    <p className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wide">Entry Options</p>
                                    <div className="flex items-baseline gap-3 mb-3">
                                        <span className="text-3xl font-bold text-white tracking-tight">Free</span>
                                        <span className="text-[11px] text-neutral-400 font-medium bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded w-fit uppercase tracking-wider">Open to All</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                        <Users className="w-4 h-4 text-neutral-500" />
                                        <span><strong className="text-neutral-200 font-semibold">{event.registration_count || 0}</strong> registered</span>
                                    </div>
                                </div>

                                <Button
                                    className={`w-full font-semibold h-12 rounded-xl mb-3 text-sm transition-all ${event.organizer === user?.id
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : event.is_registered
                                            ? event.registration_status === 'pending'
                                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 cursor-default"
                                                : event.registration_status === 'waitlisted'
                                                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/10 cursor-default"
                                                    : event.registration_status === 'approved'
                                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                                        : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-800 cursor-default"
                                            : "bg-white text-neutral-950 hover:bg-neutral-200"
                                        }`}
                                    disabled={event.is_registered && event.registration_status !== 'approved'}
                                    onClick={() => {
                                        if (event.organizer === user?.id) {
                                            router.push(`/events/${id}/manage`)
                                        } else if (event.is_registered && event.registration_status === 'approved') {
                                            // Optional: Route to digital ticket
                                            router.push(`/events/${id}/ticket`)
                                        } else if (!event.is_registered) {
                                            setShowRegisterSheet(true)
                                        }
                                    }}
                                >
                                    {event.organizer === user?.id ? (
                                        "Manage Dashboard"
                                    ) : event.is_registered ? (
                                        event.registration_status === 'pending' ? (
                                            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Pending Approval</span>
                                        ) : event.registration_status === 'waitlisted' ? (
                                            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Waitlisted</span>
                                        ) : event.registration_status === 'approved' ? (
                                            <span className="flex items-center gap-2"><Ticket className="w-4 h-4" /> View Ticket</span>
                                        ) : (
                                            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> You are already registered</span>
                                        )
                                    ) : (
                                        "Register Now"
                                    )}
                                </Button>

                                {event.is_registered && event.organizer !== user?.id && (
                                    <div className="text-center mb-4">
                                        <button
                                            onClick={() => setShowCancelDialog(true)}
                                            className="text-[11px] font-medium text-neutral-500 hover:text-red-400 transition-colors underline decoration-neutral-700 underline-offset-4"
                                        >
                                            Can't make it? Cancel registration
                                        </button>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full border-neutral-800 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white h-12 rounded-xl font-medium text-sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href)
                                            toast({ type: "success", title: "Copied", message: "Link copied to clipboard" })
                                        }}
                                    >
                                        <Share2 className="w-4 h-4 mr-2" /> Share
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full border-neutral-800 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white h-12 rounded-xl font-medium text-sm"
                                            >
                                                <CalendarPlus className="w-4 h-4 mr-2" /> Save Date
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-neutral-900 border-neutral-800 text-neutral-300 align-end min-w-[200px]">
                                            <DropdownMenuItem asChild className="hover:bg-neutral-800 hover:text-white cursor-pointer focus:bg-neutral-800">
                                                <a href={generateCalendarUrl('google')} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                    Google Calendar
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="hover:bg-neutral-800 hover:text-white cursor-pointer focus:bg-neutral-800">
                                                <a href={generateCalendarUrl('outlook')} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                    Outlook / Office 365
                                                </a>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="mt-6 pt-6 border-t border-neutral-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-semibold text-neutral-300 text-sm">
                                            {event.organizer_name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white text-sm">{event.organizer_name}</p>
                                            <p className="text-[11px] text-neutral-500 uppercase tracking-widest mt-0.5 font-medium">Organizer</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`mailto:placeholder@organizer.com?subject=Question regarding ${encodeURIComponent(event.title)}`}
                                        className="h-10 w-10 flex items-center justify-center rounded-lg bg-neutral-800/50 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors border border-neutral-800 hover:border-neutral-700"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Registration Sheet - Premium Version */}
            <Sheet open={showRegisterSheet} onOpenChange={setShowRegisterSheet}>
                <SheetContent className="bg-neutral-950 border-l border-neutral-800 text-white w-full sm:max-w-lg p-0 flex flex-col overflow-y-auto">

                    {/* Event Preview Hero */}
                    <div className="relative h-40 shrink-0 overflow-hidden">
                        <img
                            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-900/20" />
                        <div className="absolute bottom-4 left-5 right-5">
                            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">{event.category}</span>
                            <h2 className="text-xl font-bold text-white leading-tight truncate">{event.title}</h2>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 px-6 py-6 gap-6">

                        {/* Header */}
                        <SheetHeader className="space-y-1 text-left p-0">
                            <SheetTitle className="text-2xl font-bold text-white tracking-tight">Secure Your Spot</SheetTitle>
                            <SheetDescription className="text-neutral-400 text-sm">
                                {event.requires_approval
                                    ? "Fill in your details. The organizer will review and approve your application."
                                    : "Fill in your details below to instantly confirm your registration."
                                }
                            </SheetDescription>
                        </SheetHeader>

                        {/* Approval notice banner */}
                        {event.requires_approval && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                                <p className="text-xs text-amber-300 font-medium">This event requires organizer approval. You'll be notified by email once reviewed.</p>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="flex flex-col gap-4 flex-1">
                            {event.registration_fields?.length > 0 ? (
                                event.registration_fields.map((field: string, idx: number) => (
                                    <motion.div
                                        key={field}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.07 }}
                                        className="space-y-2"
                                    >
                                        <Label className="text-sm font-medium text-neutral-300">{field}</Label>
                                        <Input
                                            value={regForm[field] || ""}
                                            onChange={(e) => setRegForm({ ...regForm, [field]: e.target.value })}
                                            placeholder={`Enter your ${field.toLowerCase()}`}
                                            className="bg-neutral-900 border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-white placeholder:text-neutral-600 h-11 rounded-xl transition-all"
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-8 text-center rounded-xl bg-neutral-900/50 border border-neutral-800 border-dashed"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-neutral-600 mb-3" />
                                    <p className="text-neutral-400 font-medium text-sm">No additional details required.</p>
                                    <p className="text-neutral-600 text-xs mt-1">Just confirm to reserve your spot!</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer CTA */}
                        <div className="space-y-3 pt-2 border-t border-neutral-800/80">
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={handleRegister}
                                disabled={isRegistering}
                            >
                                {isRegistering ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Submitting...
                                    </span>
                                ) : event.requires_approval ? (
                                    "Submit Application"
                                ) : (
                                    "Confirm Registration →"
                                )}
                            </Button>
                            <p className="text-center text-xs text-neutral-600">
                                By registering, you agree to the event's terms. You'll receive a confirmation email.
                            </p>
                        </div>

                    </div>
                </SheetContent>
            </Sheet>


            {/* Cancel Registration Alert */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent className="bg-neutral-900 border-neutral-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Cancel Registration?</AlertDialogTitle>
                        <AlertDialogDescription className="text-neutral-400">
                            Are you sure you want to continuously cancel your registration for this event? This action cannot be undone, and you may lose your spot if there is a waitlist.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">Keep Spot</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelRegistration}
                            className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/30"
                            disabled={isCancelling}
                        >
                            {isCancelling ? "Cancelling..." : "Yes, Cancel Registration"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
