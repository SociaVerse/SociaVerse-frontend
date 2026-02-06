"use client"

import { useState } from "react"
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Calendar, Users, MapPin, Trophy, Image as ImageIcon,
    ArrowRight, ArrowLeft, Check, Copy, Share2, Globe, Lock,
    CheckCircle2, Sparkles, Zap, Smartphone, Monitor
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/custom-toast"

// Steps Definition
const STEPS = [
    { id: 1, title: "Essentials", icon: Sparkles },
    { id: 2, title: "Participation", icon: Users },
    { id: 3, title: "Details", icon: Zap },
    { id: 4, title: "Review", icon: CheckCircle2 },
]

const EVENT_TYPES = [
    { id: "hackathon", label: "Hackathon", icon: "💻", color: "from-blue-500 to-cyan-500" },
    { id: "workshop", label: "Workshop", icon: "📚", color: "from-purple-500 to-pink-500" },
    { id: "seminar", label: "Seminar", icon: "🎤", color: "from-orange-500 to-red-500" },
    { id: "cultural", label: "Cultural", icon: "🎨", color: "from-pink-500 to-rose-500" },
    { id: "gaming", label: "Gaming", icon: "🎮", color: "from-green-500 to-emerald-500" },
    { id: "sports", label: "Sports", icon: "⚽", color: "from-blue-600 to-indigo-600" },
]

const COMMUNITIES = [
    { id: "gdsc", name: "Google Developer Student Clubs", members: 1200, color: "bg-blue-500" },
    { id: "acm", name: "ACM Student Chapter", members: 850, color: "bg-indigo-500" },
    { id: "ieee", name: "IEEE Student Branch", members: 900, color: "bg-sky-600" },
    { id: "ecell", name: "Entrepreneurship Cell", members: 600, color: "bg-yellow-500" },
]

export default function CreateEventPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = useState(1)
    const [isPublished, setIsPublished] = useState(false)
    const [formData, setFormData] = useState({
        // Step 1
        eventName: "",
        eventType: "",
        eventImage: "",
        startDate: "",
        endDate: "",

        // Step 2
        participationType: "individual", // or 'team'
        minTeamSize: 1,
        maxTeamSize: 4,
        community: "independent", // or community ID
        mode: "offline",

        // Step 3
        description: "",
        rules: "",
        venue: "",
        prize: "", // Total Pool (optional/summary)
        prize_first: "",
        prize_second: "",
        prize_third: "",
        prize_others: "",

        // Step 3 (Registration Config)
        registrationFields: ["Name", "Email"], // Default fields
        webhookUrl: "",
    })

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const [isLoading, setIsLoading] = useState(false)

    const handlePublish = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            if (!token) {
                alert("You must be logged in to publish an event.")
                setIsLoading(false)
                return
            }

            if (!formData.startDate || !formData.endDate) {
                alert("Please select both start and end dates.")
                setIsLoading(false)
                return
            }

            const payload = {
                title: formData.eventName,
                description: formData.description,
                category: formData.eventType,
                image: formData.eventImage || null, // Handle empty string
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
                registration_fields: formData.registrationFields,
                webhook_url: formData.webhookUrl || null,
            }

            const response = await fetch("http://127.0.0.1:8000/api/events/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                const data = await response.json()
                setCreatedEventId(data.event_id)
                setShowVerification(true)
                toast({
                    type: "success",
                    title: "Verification Sent",
                    message: "Please verify your email to publish the event."
                })
            } else {
                const errorData = await response.json()
                console.error("Submission failed:", errorData)
                alert("Failed to create event: " + JSON.stringify(errorData))
            }
        } catch (error) {
            console.error("Network error:", error)
            alert("Network error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isPublished) {
        return <SuccessView eventName={formData.eventName} />
    }

    const [showVerification, setShowVerification] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [createdEventId, setCreatedEventId] = useState<string | null>(null)
    const [otp, setOtp] = useState(["", "", "", "", "", ""])

    const handleVerify = async () => {
        setIsPublishing(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const otpValue = otp.join("")

            const response = await fetch("http://127.0.0.1:8000/api/events/verify/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({ event_id: createdEventId, otp: otpValue })
            })

            if (response.ok) {
                toast({
                    type: "success",
                    title: "Event Verified!",
                    message: "Your event has been successfully published."
                })
                router.push(`/events/${createdEventId}`)
            } else {
                const errorData = await response.json()
                toast({
                    type: "error",
                    title: "Verification Failed",
                    message: errorData.error || "Invalid OTP"
                })
            }
        } catch (error) {
            console.error("Verification error:", error)
            toast({ type: "error", title: "Network Error", message: "Failed to verify event." })
        } finally {
            setIsPublishing(false)
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    if (showVerification) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-400">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verify Your Event</h2>
                        <p className="text-slate-400">We've sent a 6-digit code to your email. Enter it below to publish your event.</p>
                    </div>

                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                id={`otp-${index}`}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-xl font-bold bg-neutral-800 border-white/10 focus:border-blue-500 rounded-xl"
                                maxLength={1}
                            />
                        ))}
                    </div>

                    <Button
                        onClick={handleVerify}
                        disabled={isPublishing || otp.join("").length !== 6}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl font-bold"
                    >
                        {isPublishing ? "Verifying..." : "Verify & Publish"}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-20 px-4 relative overflow-hidden selection:bg-purple-500/30">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-emerald-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-5xl relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 drop-shadow-sm">
                            Create Experience
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Design an unforgettable event in minutes. We'll handle the logistics; you bring the vision.
                        </p>
                    </motion.div>
                </div>

                {/* Progress Stepper */}
                <div className="mb-16 hidden md:block">
                    <div className="relative max-w-3xl mx-auto">
                        {/* Connecting Lines - Absolute positioning relative to the icons which are 56px (h-14) height */}
                        {/* Top 7 = 1.75rem. Centered relative to h-14 (3.5rem) */}
                        <div className="absolute top-7 left-0 w-full h-0.5 bg-slate-800 -z-10 rounded-full transform -translate-y-1/2" />
                        <motion.div
                            className="absolute top-7 left-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 -z-10 rounded-full origin-left transform -translate-y-1/2"
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

                                        {isActive && <motion.div layoutId="activeStepGlow" className="absolute inset-0 bg-purple-500/30 blur-2xl -z-10 rounded-full" />}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile Stepper */}
                <div className="md:hidden mb-10 px-4">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-white font-bold text-lg">Step {currentStep}</span>
                        <span className="text-slate-500 text-sm uppercase tracking-wider font-medium">{STEPS[currentStep - 1].title}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${(currentStep / STEPS.length) * 100}%` }} />
                    </div>
                </div>

                {/* Main Card */}
                <motion.div
                    layout
                    className="bg-neutral-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

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
                                <Step4 data={formData} onSubmit={handlePublish} />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-16 pt-8 border-t border-white/5">
                        <Button
                            variant="ghost"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`text-slate-400 hover:text-white hover:bg-white/5 rounded-full h-14 px-8 text-base font-medium transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" /> Back
                        </Button>

                        {currentStep < STEPS.length ? (
                            <Button
                                onClick={nextStep}
                                className="group relative bg-white text-black hover:bg-slate-200 rounded-full h-16 px-12 text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center">
                                    Continue <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePublish}
                                className="group relative bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full h-16 px-12 text-lg font-bold shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] transition-all transform hover:-translate-y-1"
                            >
                                <span className="flex items-center">
                                    {isLoading ? "Publishing..." : "Publish Event"} <Trophy className={`w-5 h-5 ml-2 group-hover:rotate-12 transition-transform ${isLoading ? 'animate-pulse' : ''}`} />
                                </span>
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

// ------------------- STEPS -------------------

function Step1({ data, update }: { data: any, update: (field: string, value: any) => void }) {
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                update("eventImage", reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Event Basic Info</h2>
                <p className="text-slate-400">Let's start with the core details of your event.</p>
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
                                <p className="text-sm text-slate-500 mt-1">Recommended: 1920x1080 (PNG, JPG)</p>
                            </div>
                        )}

                        {data.eventImage && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-bold">Click to Change</p>
                            </div>
                        )}
                    </div>
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
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>
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
                            {mode === 'offline' ? <MapPin className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
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

    )
}

function Step2({ data, update }: { data: any, update: (field: string, value: any) => void }) {
    return (
        <div className="space-y-10">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Participation & Community</h2>
                <p className="text-slate-400">Define who can join and how they compete.</p>
            </div>

            {/* Participation Type */}
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
                        {data.participationType === type.id && (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
                        )}
                    </div>
                ))}
            </div>

            {data.participationType === 'team' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex flex-col md:flex-row gap-6 p-8 bg-neutral-900/50 rounded-3xl border border-slate-800"
                >
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
                </motion.div>
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
                    <div className="relative">
                        <Textarea
                            placeholder="Describe your event, rules, eligibility, etc..."
                            className="bg-neutral-950/50 border-slate-800 focus:border-purple-500 min-h-[220px] rounded-2xl resize-none p-6 text-base leading-relaxed"
                            value={data.description}
                            onChange={(e) => update("description", e.target.value)}
                        />
                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="sm" className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 text-xs h-8 rounded-lg border border-purple-500/20">
                                <Sparkles className="w-3 h-3 mr-1.5" /> AI Enhance
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-slate-300 font-medium ml-1">Rules & Guidelines</Label>
                    <Textarea
                        placeholder="List specific rules for the event...
1. No cheating
2. Team size strict
3. Submissions deadline"
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
                            placeholder="e.g. Main Auditorium or Zoom Link"
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

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <Label className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" /> Registration Configuration
                    </Label>
                    <p className="text-sm text-slate-400">Customize what information you need from participants.</p>

                    <div className="space-y-4">
                        <Label className="text-slate-300 font-medium ml-1">Required Fields</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {['Name', 'Email', 'College', 'Discord ID', 'Phone', 'LinkedIn', 'GitHub'].map((field) => (
                                <div
                                    key={field}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${data.registrationFields.includes(field)
                                        ? 'bg-blue-500/10 border-blue-500 text-white'
                                        : 'bg-neutral-900 border-slate-800 text-slate-400 hover:bg-neutral-800'
                                        }`}
                                    onClick={() => {
                                        const newFields = data.registrationFields.includes(field)
                                            ? data.registrationFields.filter((f: any) => f !== field)
                                            : [...data.registrationFields, field]
                                        update("registrationFields", newFields)
                                    }}
                                >
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${data.registrationFields.includes(field) ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
                                        }`}>
                                        {data.registrationFields.includes(field) && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span className="text-sm font-medium">{field}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 mt-4">
                        <Label className="text-slate-300 font-medium ml-1 flex items-center gap-2">
                            Webhook URL <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                        </Label>
                        <Input
                            placeholder="https://discord.com/api/webhooks/..."
                            className="bg-neutral-950/50 border-slate-800 focus:border-purple-500 h-12 rounded-xl px-4 font-mono text-sm"
                            value={data.webhookUrl}
                            onChange={(e) => update("webhookUrl", e.target.value)}
                        />
                        <p className="text-xs text-slate-500">We'll send a JSON payload here whenever someone registers.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Step4({ data }: { data: any, onSubmit: () => void }) {
    return (
        <div className="space-y-10">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Review & Publish</h2>
                <p className="text-slate-400">One last look before you go live.</p>
            </div>

            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/5 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

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
                                {data.eventType || "Event"}
                            </span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/20 uppercase tracking-wide">
                                {data.participationType}
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
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Community</p>
                            <div className="flex items-center gap-3 text-slate-200 bg-white/5 p-4 rounded-xl border border-white/5">
                                <Globe className="w-5 h-5 text-green-400" />
                                <span className="capitalize">{data.community === 'independent' ? 'Independent Event' : data.community}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl text-yellow-200/80 text-sm">
                <Sparkles className="w-5 h-5 shrink-0 text-yellow-400" />
                <p>Pro Tip: After publishing, share the event link on your social media for maximum reach.</p>
            </div>
        </div>
    )
}

function SuccessView({ eventName }: { eventName: string }) {
    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Celebration Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full blur-[100px] animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-xl w-full bg-neutral-900/60 backdrop-blur-2xl rounded-[2.5rem] p-12 border border-white/10 text-center shadow-2xl relative z-10"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-green-400 to-emerald-600 opacity-80" />

                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="w-24 h-24 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30"
                >
                    <Check className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Event Published!</h2>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                    <span className="text-white font-semibold">{eventName}</span> is now live. Let the world know about it!
                </p>

                <div className="space-y-4">
                    <div className="bg-black/40 rounded-2xl p-2 pl-5 flex items-center justify-between border border-white/10 group hover:border-white/20 transition-all">
                        <div className="text-slate-400 font-mono text-sm truncate pr-4">
                            sociaverse.com/event/new-launch
                        </div>
                        <Button size="icon" className="h-10 w-10 bg-slate-800 text-white hover:bg-slate-700 rounded-xl">
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-12 rounded-xl border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300">
                            <Share2 className="w-4 h-4 mr-2" /> WhatsApp
                        </Button>
                        <Button variant="outline" className="h-12 rounded-xl border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300">
                            <Share2 className="w-4 h-4 mr-2" /> LinkedIn
                        </Button>
                    </div>
                </div>

                <div className="mt-10 pt-10 border-t border-white/5">
                    <Button asChild variant="link" className="text-slate-500 hover:text-white">
                        <Link href="/events">
                            Return to Events Dashboard
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
