"use client"

import { useState, useEffect } from "react"
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Calendar, Users, MapPin, Trophy, Image as ImageIcon,
    Check, ArrowLeft, ArrowRight, Sparkles, Globe, CheckCircle2,
    Laptop, Save
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { compressImage } from "@/utils/image-compression"

// ... (Reuse constants from create/page.tsx or move to a shared file)
const EVENT_TYPES = [
    { id: 'hackathon', label: 'Hackathon' },
    { id: 'workshop', label: 'Workshop' },
    { id: 'seminar', label: 'Seminar' },
    { id: 'meetup', label: 'Meetup' },
    { id: 'cultural', label: 'Cultural Fest' },
    { id: 'gaming', label: 'Gaming Tournament' },
    { id: 'sports', label: 'Sports' }
]

const COMMUNITIES = [
    { id: 'gdsc', name: 'Google Developer Student Clubs', members: '12k', color: 'bg-blue-500' },
    { id: 'mlsa', name: 'Microsoft Learn Student Amb.', members: '8.5k', color: 'bg-blue-600' },
    { id: 'ieee', name: 'IEEE Student Branch', members: '15k', color: 'bg-blue-700' },
    { id: 'acm', name: 'ACM Student Chapter', members: '10k', color: 'bg-blue-500' },
]

const STEPS = [
    { id: 1, title: "Overview", icon: Sparkles },
    { id: 2, title: "Participation", icon: Users },
    { id: 3, title: "Details", icon: Laptop },
    { id: 4, title: "Review", icon: CheckCircle2 }
]

import { useToast } from "@/components/ui/custom-toast"

export default function EditEventPage() {
    const router = useRouter()
    const params = useParams()
    const { id } = params
    const { toast } = useToast()

    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        eventName: "",
        eventType: "",
        eventImage: "",
        startDate: "",
        endDate: "",
        mode: "offline",
        venue: "",
        participationType: "individual",
        minTeamSize: 2,
        maxTeamSize: 4,
        community: "independent",
        description: "",
        rules: "",
        prize: "",
        prize_first: "",
        prize_second: "",
        prize_third: "",
        prize_others: "",
    })

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/`)
                if (response.ok) {
                    const event = await response.json()

                    // Format dates for input fields (YYYY-MM-DDThh:mm)
                    const formatDate = (dateString: string) => {
                        if (!dateString) return ""
                        const date = new Date(dateString)
                        return date.toISOString().slice(0, 16)
                    }

                    setFormData({
                        eventName: event.title,
                        eventType: event.category,
                        eventImage: event.image,
                        startDate: formatDate(event.start_date),
                        endDate: formatDate(event.end_date),
                        mode: event.mode || "offline",
                        venue: event.location,
                        participationType: event.participation_type,
                        minTeamSize: event.min_team_size,
                        maxTeamSize: event.max_team_size,
                        community: event.community,
                        description: event.description,
                        rules: event.rules,
                        prize: event.prize || "",
                        prize_first: event.prize_first || "",
                        prize_second: event.prize_second || "",
                        prize_third: event.prize_third || "",
                        prize_others: event.prize_others || ""
                    })
                } else {
                    toast({ type: "error", title: "Load Failed", message: "Failed to load event details." })
                    router.push("/events")
                }
            } catch (error) {
                console.error("Failed to fetch event:", error)
                toast({ type: "error", title: "Network Error", message: "Failed to fetch event details." })
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchEvent()
        }
    }, [id, router, toast])

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const handleUpdate = async () => {
        setIsSaving(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            if (!token) {
                toast({ type: "error", title: "Authentication Error", message: "You must be logged in to update." })
                setIsSaving(false)
                return
            }

            if (!formData.startDate || !formData.endDate) {
                toast({ type: "warning", title: "Missing Dates", message: "Please select both start and end dates." })
                setIsSaving(false)
                return
            }

            const payload = {
                title: formData.eventName,
                description: formData.description,
                category: formData.eventType,
                image: formData.eventImage || null,
                start_date: new Date(formData.startDate).toISOString(),
                end_date: new Date(formData.endDate).toISOString(),
                location: formData.venue,
                mode: formData.mode,
                participation_type: formData.participationType,
                min_team_size: parseInt(String(formData.minTeamSize)),
                max_team_size: parseInt(String(formData.maxTeamSize)),
                community: formData.community,
                rules: formData.rules,
                prize: formData.prize,
                prize_first: formData.prize_first,
                prize_second: formData.prize_second,
                prize_third: formData.prize_third,
                prize_others: formData.prize_others,
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                toast({
                    type: "success",
                    title: "Event Updated",
                    message: "Your changes have been saved successfully!"
                })
                router.push("/events")
            } else {
                const errorData = await response.json()
                toast({
                    type: "error",
                    title: "Update Failed",
                    message: JSON.stringify(errorData)
                })
            }
        } catch (error) {
            console.error("Update error:", error)
            toast({ type: "error", title: "Network Error", message: "Failed to connect to the server." })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-20 px-4 relative overflow-hidden selection:bg-purple-500/30">
            {/* Same Background as Create Page */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-emerald-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-5xl relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 drop-shadow-sm">
                        Edit Event
                    </h1>
                </div>

                {/* Progress Stepper (Same as Create) */}
                <div className="mb-16 hidden md:block">
                    <div className="relative max-w-3xl mx-auto">
                        <div className="absolute top-7 left-0 w-full h-0.5 bg-slate-800 -z-10 rounded-full transform -translate-y-1/2" />
                        <motion.div
                            className="absolute top-7 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -z-10 rounded-full origin-left transform -translate-y-1/2"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: (currentStep - 1) / (STEPS.length - 1) }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />

                        <div className="flex justify-between w-full">
                            {STEPS.map((step) => {
                                const isActive = step.id === currentStep
                                const isCompleted = step.id < currentStep

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 w-24">
                                        <motion.div
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-xl ${isActive ? "border-purple-500 bg-neutral-900 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-110" :
                                                isCompleted ? "border-green-500 bg-neutral-900 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]" :
                                                    "border-slate-800 bg-neutral-900 text-slate-600"
                                                }`}
                                        >
                                            {isCompleted ? <Check className="w-6 h-6" /> : <step.icon className={`w-6 h-6 ${isActive && 'text-purple-400'}`} />}
                                        </motion.div>
                                        <span className={`text-xs font-bold tracking-widest uppercase text-center ${isActive ? "text-purple-400 drop-shadow-md" : isCompleted ? "text-green-400" : "text-slate-600"}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <motion.div
                    layout
                    className="bg-neutral-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                    <AnimatePresence mode="wait" custom={1}>
                        <motion.div
                            key={currentStep}
                            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {currentStep === 1 && (
                                <Step1 data={formData} update={handleInputChange} />
                            )}
                            {currentStep === 2 && (
                                <Step2 data={formData} update={handleInputChange} />
                            )}
                            {currentStep === 3 && (
                                <Step3 data={formData} update={handleInputChange} />
                            )}
                            {currentStep === 4 && (
                                <Step4 data={formData} />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-16 pt-8 border-t border-white/5">
                        <Button
                            variant="ghost"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`text-slate-400 hover:text-white hover:bg-white/5 rounded-full h-14 px-8 text-base font-medium transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" /> Back
                        </Button>

                        {currentStep < 4 ? (
                            <Button
                                onClick={nextStep}
                                className="bg-white text-black hover:bg-slate-200 rounded-full h-14 px-8 text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all hover:scale-105"
                            >
                                Continue <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full h-14 px-10 text-lg font-bold shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all hover:scale-105"
                            >
                                {isSaving ? "Saving..." : "Update Event"} <Save className="w-5 h-5 ml-2" />
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

// ------------------- STEPS (Reused from Create Page, simplified props) -------------------

function Step1({ data, update }: { data: any, update: (field: string, value: any) => void }) {
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [isCompressing, setIsCompressing] = useState(false)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setIsCompressing(true)
            try {
                const compressedFile = await compressImage(file)
                const reader = new FileReader()
                reader.onloadend = () => {
                    update("eventImage", reader.result)
                    setIsCompressing(false)
                }
                reader.readAsDataURL(compressedFile)
            } catch (error) {
                console.error("Compression failed", error)
                setIsCompressing(false)
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Event Basic Info</h2>
                <p className="text-slate-400">Update the core details of your event.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-slate-300 font-medium ml-1">Event Banner</Label>
                    <div
                        className="w-full h-48 rounded-3xl border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-500 transition-all cursor-pointer relative overflow-hidden group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />

                        {data.eventImage ? (
                            <img src={data.eventImage} alt="Banner" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                    <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <p className="text-lg font-medium text-slate-300 group-hover:text-white">Upload Banner Image</p>
                            </div>
                        )}
                        {isCompressing && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                                <p className="text-white font-medium text-sm">Compressing...</p>
                            </div>
                        )}
                        {data.eventImage && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-bold">Click to Change</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-slate-300 font-medium ml-1">Event Name</Label>
                        <Input
                            placeholder="e.g. Cosmic Hackathon 2024"
                            className="bg-slate-950/50 border-slate-800 focus:border-purple-500 h-14 rounded-xl text-lg px-4"
                            value={data.eventName}
                            onChange={(e) => update("eventName", e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-slate-300 font-medium ml-1">Category</Label>
                        <div className="relative">
                            <select
                                className="w-full h-14 rounded-xl border border-slate-800 bg-slate-950/50 px-4 text-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none transition-all cursor-pointer hover:bg-neutral-900"
                                value={data.eventType}
                                onChange={(e) => update("eventType", e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {EVENT_TYPES.map(type => (
                                    <option key={type.id} value={type.id}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-slate-300 font-medium ml-1">Event Mode</Label>
                    <div className="grid grid-cols-2 gap-4">
                        {['offline', 'online'].map((mode) => (
                            <div
                                key={mode}
                                className={`cursor-pointer rounded-xl border p-4 flex items-center justify-center gap-2 transition-all ${data.mode === mode ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900'}`}
                                onClick={() => update("mode", mode)}
                            >
                                {mode === 'offline' ? <MapPin className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                                <span className="capitalize font-medium">{mode}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-slate-300 font-medium ml-1">Start Date</Label>
                        <Input
                            type="datetime-local"
                            className="bg-slate-950/50 border-slate-800 focus:border-purple-500 h-14 rounded-xl px-4 text-slate-300"
                            value={data.startDate}
                            onChange={(e) => update("startDate", e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-slate-300 font-medium ml-1">End Date</Label>
                        <Input
                            type="datetime-local"
                            className="bg-slate-950/50 border-slate-800 focus:border-purple-500 h-14 rounded-xl px-4 text-slate-300"
                            value={data.endDate}
                            onChange={(e) => update("endDate", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Step2({ data, update }: { data: any, update: (field: string, value: any) => void }) {
    return (
        <div className="space-y-10">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Participation & Community</h2>
                <p className="text-slate-400">Define who can join and how they compete.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {[
                    { id: 'individual', title: 'Individual', desc: 'Solo participation', icon: Users },
                    { id: 'team', title: 'Team Based', desc: 'Groups compete together', icon: Users }
                ].map((type) => (
                    <div
                        key={type.id}
                        className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 overflow-hidden group ${data.participationType === type.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-slate-800 bg-neutral-900/50 hover:border-slate-600 hover:bg-neutral-800'
                            }`}
                        onClick={() => update("participationType", type.id)}
                    >
                        <div className="relative z-10 flex items-start justify-between">
                            <div>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${data.participationType === type.id ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    <type.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{type.title}</h3>
                                <p className="text-slate-400 text-sm">{type.desc}</p>
                            </div>
                            {data.participationType === type.id && (
                                <div className="bg-purple-500 rounded-full p-1">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {data.participationType === 'team' && (
                <div className="flex flex-col md:flex-row gap-6 p-8 bg-neutral-900/50 rounded-3xl border border-slate-800">
                    <div className="space-y-3 flex-1">
                        <Label className="text-slate-300 font-medium">Min Members</Label>
                        <Input
                            type="number" min="2"
                            value={data.minTeamSize} onChange={(e) => update("minTeamSize", e.target.value)}
                            className="bg-neutral-950 border-slate-700 h-12 rounded-xl"
                        />
                    </div>
                    <div className="space-y-3 flex-1">
                        <Label className="text-slate-300 font-medium">Max Members</Label>
                        <Input
                            type="number" max="10"
                            value={data.maxTeamSize} onChange={(e) => update("maxTeamSize", e.target.value)}
                            className="bg-neutral-950 border-slate-700 h-12 rounded-xl"
                        />
                    </div>
                </div>
            )}
            <div className="space-y-5 pt-6 border-t border-white/5">
                <Label className="text-lg font-bold text-white">Organizing Community</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-4 transition-all ${data.community === 'independent' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-neutral-900 border-slate-800 hover:border-slate-600'}`}
                        onClick={() => update("community", "independent")}
                    >
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-200">Independent</h4>
                            <p className="text-xs text-slate-500">Global, open event</p>
                        </div>
                        {data.community === 'independent' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    </div>

                    {COMMUNITIES.map(comm => (
                        <div
                            key={comm.id}
                            className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-4 transition-all ${data.community === comm.id ? 'bg-blue-500/10 border-blue-500' : 'bg-neutral-900 border-slate-800 hover:border-slate-600'}`}
                            onClick={() => update("community", comm.id)}
                        >
                            <div className={`w-12 h-12 rounded-full ${comm.color} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-lg`}>
                                {comm.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-bold text-slate-200 truncate">{comm.name}</h4>
                                <p className="text-xs text-slate-500">{comm.members} Members</p>
                            </div>
                            {data.community === comm.id && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function Step3({ data, update }: { data: any, update: (field: string, value: any) => void }) {
    return (
        <div className="space-y-10">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Event Details</h2>
                <p className="text-slate-400">Tell the story. Inspire people to join.</p>
            </div>

            <div className="space-y-8">
                <div className="space-y-3">
                    <Label className="text-slate-300 font-medium ml-1">About the Opportunity</Label>
                    <Textarea
                        placeholder="Describe your event..."
                        className="bg-neutral-950/50 border-slate-800 focus:border-purple-500 min-h-[220px] rounded-2xl resize-none p-6 text-base leading-relaxed"
                        value={data.description}
                        onChange={(e) => update("description", e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-slate-300 font-medium ml-1">Rules & Guidelines</Label>
                    <Textarea
                        placeholder="List specific rules..."
                        className="bg-neutral-950/50 border-slate-800 focus:border-purple-500 min-h-[150px] rounded-2xl resize-none p-6"
                        value={data.rules}
                        onChange={(e) => update("rules", e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-slate-300 font-medium ml-1">Venue / Platform</Label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <Input
                            placeholder="Venue"
                            className="bg-neutral-950/50 border-slate-800 focus:border-purple-500 h-14 rounded-xl pl-12"
                            value={data.venue}
                            onChange={(e) => update("venue", e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <Label className="text-xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" /> Prize Distribution
                    </Label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="text-slate-300 font-medium ml-1 text-yellow-400">1st Place (Gold)</Label>
                            <Input
                                placeholder="e.g. $1000"
                                className="bg-neutral-950/50 border-yellow-500/30 focus:border-yellow-500 h-12 rounded-xl px-4"
                                value={data.prize_first}
                                onChange={(e) => update("prize_first", e.target.value)}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-300 font-medium ml-1 text-slate-400">2nd Place (Silver)</Label>
                            <Input
                                placeholder="e.g. $500"
                                className="bg-neutral-950/50 border-slate-600/30 focus:border-slate-400 h-12 rounded-xl px-4"
                                value={data.prize_second}
                                onChange={(e) => update("prize_second", e.target.value)}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-300 font-medium ml-1 text-orange-400">3rd Place (Bronze)</Label>
                            <Input
                                placeholder="e.g. $250"
                                className="bg-neutral-950/50 border-orange-700/30 focus:border-orange-600 h-12 rounded-xl px-4"
                                value={data.prize_third}
                                onChange={(e) => update("prize_third", e.target.value)}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-300 font-medium ml-1">Others / Participation</Label>
                            <Input
                                placeholder="e.g. Certificates, Swags"
                                className="bg-neutral-950/50 border-slate-800 focus:border-purple-500 h-12 rounded-xl px-4"
                                value={data.prize_others}
                                onChange={(e) => update("prize_others", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3 mt-4">
                        <Label className="text-slate-300 font-medium ml-1">Total Prize Pool Display (Optional)</Label>
                        <Input
                            placeholder="e.g. Worth $5000+"
                            className="bg-neutral-950/50 border-slate-800 focus:border-purple-500 h-12 rounded-xl px-4"
                            value={data.prize}
                            onChange={(e) => update("prize", e.target.value)}
                        />
                        <p className="text-xs text-slate-500">This will be shown as the main prize summary.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Step4({ data }: { data: any }) {
    return (
        <div className="space-y-10">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Review Updates</h2>
                <p className="text-slate-400">Confirm your changes before saving.</p>
            </div>

            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/5 space-y-8 relative overflow-hidden">
                <div className="relative z-10 grid md:grid-cols-2 gap-8">
                    <div>
                        <div className="w-full h-48 bg-slate-800 rounded-2xl mb-6 overflow-hidden relative">
                            {data.eventImage ? (
                                <img src={data.eventImage} alt="Event Banner" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-800">
                                    <ImageIcon className="w-12 h-12 opacity-50" />
                                </div>
                            )}
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">{data.eventName || "Untitled Event"}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/20 uppercase tracking-wide">
                                {data.eventType}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Date & Time</p>
                            <div className="flex items-center gap-3 text-slate-200 bg-white/5 p-4 rounded-xl border border-white/5">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                <span>{data.startDate ? new Date(data.startDate).toLocaleString() : "TBD"}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Venue</p>
                            <div className="flex items-center gap-3 text-slate-200 bg-white/5 p-4 rounded-xl border border-white/5">
                                <MapPin className="w-5 h-5 text-red-400" />
                                <span>{data.venue || "To be announced"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
