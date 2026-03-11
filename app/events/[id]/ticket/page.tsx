"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Calendar, MapPin, Clock, ArrowLeft, Download, Printer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/custom-toast"
import { QRCodeSVG } from "qrcode.react"
import Link from "next/link"

export default function DigitalTicketPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user, isAuthenticated } = useAuth()
    const { toast } = useToast()

    const [event, setEvent] = useState<any>(null)
    const [registration, setRegistration] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) return

        const fetchTicketData = async () => {
            try {
                const token = localStorage.getItem("sociaverse_token")

                // Fetch event details
                const eventRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/`, {
                    headers: { "Authorization": `Token ${token}` }
                })

                if (!eventRes.ok) {
                    toast({ type: "error", title: "Error", message: "Event not found" })
                    router.push("/events")
                    return
                }
                const eventData = await eventRes.json()
                setEvent(eventData)

                // If not registered or not approved, kick them out
                if (!eventData.is_registered || eventData.registration_status !== 'approved') {
                    toast({ type: "error", title: "Access Denied", message: "You do not have an approved ticket for this event." })
                    router.push(`/events/${id}`)
                    return
                }

                setRegistration({
                    status: eventData.registration_status,
                    registered_at: new Date().toISOString() // We don't have exact registered_at from list endpoint usually, placeholder is fine for visual
                })

            } catch (error) {
                console.error("Failed to fetch ticket:", error)
                toast({ type: "error", title: "Network Error", message: "Could not load ticket details" })
            } finally {
                setIsLoading(false)
            }
        }

        fetchTicketData()
    }, [id, router, toast, isAuthenticated])

    const handlePrint = () => {
        window.print()
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
                <p className="mb-4">You must be logged in to view your ticket.</p>
                <Button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">Login</Button>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
        )
    }

    if (!event || !user) return null

    const ticketDataString = JSON.stringify({
        evt: event.id,
        usr: user.id || user.username,
        typ: "SociaVerse_Ticket"
    })

    return (
        <div className="min-h-screen bg-neutral-950 text-slate-200 font-sans selection:bg-blue-500/30 pb-20 pt-24 px-4 sm:px-6">

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden print:hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Back Link */}
                <Link
                    href={`/events/${id}`}
                    className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors mb-8 print:hidden group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Event
                </Link>

                <div className="flex items-center justify-between mb-8 print:hidden">
                    <h1 className="text-3xl font-semibold tracking-tight text-white">Your Ticket</h1>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                            onClick={handlePrint}
                        >
                            <Printer className="w-4 h-4 mr-2" /> Print
                        </Button>
                    </div>
                </div>

                {/* Digital Ticket Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col md:flex-row print:shadow-none print:border print:border-neutral-200"
                >
                    {/* Left/Top: Event Cover Image */}
                    <div className="md:w-1/3 relative h-48 md:h-auto bg-neutral-100">
                        <img
                            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-2 inline-block shadow-sm">
                                {event.category}
                            </span>
                        </div>
                    </div>

                    {/* Right/Bottom: Ticket Content */}
                    <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-between text-neutral-900 relative">
                        {/* Cutout decorations */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-950 rounded-full hidden md:block print:hidden" />
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-950 rounded-full hidden md:block print:hidden" />
                        <div className="absolute left-1/2 -top-3 -translate-x-1/2 w-6 h-6 bg-neutral-950 rounded-full block md:hidden print:hidden" />
                        <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-6 h-6 bg-neutral-950 rounded-full block md:hidden print:hidden" />

                        <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b md:border-b-0 md:border-r border-neutral-200 border-dashed pb-8 md:pb-0 md:pr-8 mb-8 md:mb-0">

                            <div className="flex-1">
                                <h2 className="text-2xl font-bold tracking-tight text-neutral-950 mb-4">{event.title}</h2>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-900">
                                                {new Date(event.start_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-900 truncate max-w-[200px]" title={event.location}>
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mb-1">Attendee</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-600">
                                            {user.username?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-950">{user.first_name ? `${user.first_name} ${user.last_name || ""}` : user.username}</p>
                                            <p className="text-sm text-neutral-500">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Area (QR Code) */}
                        <div className="flex flex-col items-center justify-center shrink-0 pt-8 md:pt-0 md:pl-8">
                            <div className="bg-white p-2 rounded-xl border border-neutral-100 shadow-sm mb-3">
                                <QRCodeSVG
                                    value={ticketDataString}
                                    size={140}
                                    level="Q"
                                    includeMargin={false}
                                />
                            </div>
                            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Entry Code</p>
                            <p className="text-xs text-neutral-300 mt-1 font-mono">#{event.id}-{user.id}</p>
                        </div>

                    </div>
                </motion.div>

                <div className="text-center mt-8 text-neutral-500 text-sm print:hidden">
                    Please present this ticket at the entrance. <br className="md:hidden" /> A screenshot is also accepted.
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body {
                        background-color: white !important;
                    }
                }
            `}</style>
        </div>
    )
}
