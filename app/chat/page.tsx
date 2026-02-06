"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search, Phone, Video, MoreVertical, Send, Paperclip,
    Smile, ArrowLeft, Check, CheckCheck, MoreHorizontal,
    Image as ImageIcon, Mic
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Types
type Message = {
    id: string
    text: string
    sender: "me" | "them"
    time: string
    status: "sent" | "delivered" | "read"
}

type Chat = {
    id: number
    name: string
    status: "online" | "offline" | "typing"
    lastSeen?: string
    avatar: string
    color: string
    unread: number
    messages: Message[]
}

// Mock Data Initializer
const initialChats: Chat[] = [
    {
        id: 1,
        name: "Alex Rivera",
        status: "online",
        avatar: "A",
        color: "from-blue-500 to-cyan-500",
        unread: 2,
        messages: [
            { id: "1", sender: "them", text: "Yo, did you finish the calc pset?", time: "10:30 AM", status: "read" },
            { id: "2", sender: "me", text: "Almost! Just stuck on the last problem.", time: "10:31 AM", status: "read" },
            { id: "3", sender: "them", text: "Same here. It's brutal 💀", time: "10:32 AM", status: "read" },
            { id: "4", sender: "me", text: "Wanna hop on a call? maybe we can solve it together", time: "10:32 AM", status: "read" },
        ]
    },
    {
        id: 2,
        name: "Sarah Chen",
        status: "offline",
        lastSeen: "2h ago",
        avatar: "S",
        color: "from-purple-500 to-pink-500",
        unread: 0,
        messages: [
            { id: "1", sender: "me", text: "Hey Sarah, are you coming to the hackathon?", time: "Yesterday", status: "read" },
            { id: "2", sender: "them", text: "Def! I've got a team ready.", time: "Yesterday", status: "read" },
        ]
    },
    {
        id: 3,
        name: "Design Club",
        status: "online",
        avatar: "D",
        color: "from-orange-500 to-red-500",
        unread: 5,
        messages: [
            { id: "1", sender: "them", text: "Meeting at 5pm today! Don't forget.", time: "1:00 PM", status: "read" },
        ]
    },
    {
        id: 4,
        name: "Marcus Johnson",
        status: "typing",
        avatar: "M",
        color: "from-green-500 to-emerald-500",
        unread: 0,
        messages: [
            { id: "1", sender: "them", text: "Let's hack this weekend 🚀", time: "09:41 AM", status: "read" },
            { id: "2", sender: "me", text: "I'm down! What are we building?", time: "09:45 AM", status: "read" },
        ]
    },
]

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

// ... (existing imports and types and initialChats can stay, 
// actually I'll just rewrite the component part and keep imports if I can matching the lines)
// wait, I need to add useSearchParams to imports. 

function ChatContent() {
    const searchParams = useSearchParams()
    const [chats, setChats] = useState<Chat[]>(initialChats)
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
    const [inputValue, setInputValue] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [isMobile, setIsMobile] = useState(false)

    // Call State
    const [callStatus, setCallStatus] = useState<"idle" | "dialing" | "ringing" | "connected">("idle")
    const [callType, setCallType] = useState<"audio" | "video">("audio")
    const [callDuration, setCallDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOff, setIsCameraOff] = useState(false)
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const selectedChat = chats.find(c => c.id === selectedChatId)
    const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Handle incoming inquiry from Marketplace
    useEffect(() => {
        const sellerUsername = searchParams.get("seller")
        const sellerName = searchParams.get("sellerName")
        const productTitle = searchParams.get("product")

        if (sellerUsername && sellerName && productTitle) {
            // Check if chat already exists (mock check by name for now as we don't have usernames in mock data)
            // In a real app we'd check by ID or Username
            const existingChat = chats.find(c => c.name === sellerName)

            if (existingChat) {
                setSelectedChatId(existingChat.id)
                setInputValue(`Hi, I'm interested in your ${productTitle}! Is it still available?`)
            } else {
                // Create new mock chat
                const newChatId = Math.max(...chats.map(c => c.id)) + 1
                const newChat: Chat = {
                    id: newChatId,
                    name: sellerName,
                    status: "online",
                    avatar: sellerName.charAt(0).toUpperCase(),
                    color: "from-pink-500 to-rose-500", // Default color for new chats
                    unread: 0,
                    messages: []
                }
                setChats(prev => [newChat, ...prev])
                setSelectedChatId(newChat.id)
                setInputValue(`Hi, I'm interested in your ${productTitle}! Is it still available?`)
            }
        }
    }, [searchParams]) // Run once when params are available/change

    // Handle resize for responsive layout
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [selectedChat?.messages])

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim() || !selectedChatId) return

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "sent"
        }

        setChats(prev => prev.map(chat => {
            if (chat.id === selectedChatId) {
                return { ...chat, messages: [...chat.messages, newMessage] }
            }
            return chat
        }))

        setInputValue("")

        // Simulate reply
        setTimeout(() => {
            setChats(prev => prev.map(chat => {
                if (chat.id === selectedChatId) {
                    return { ...chat, status: "typing" } as Chat
                }
                return chat
            }))

            setTimeout(() => {
                const replyText = selectedChat?.messages.length === 0
                    ? "Hey! Yes, it is still available. Are you on campus?"
                    : "That sounds awesome! Let me check my schedule and get back to you shortly."

                const reply: Message = {
                    id: (Date.now() + 1).toString(),
                    text: replyText,
                    sender: "them",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: "read"
                }

                setChats(prev => prev.map(chat => {
                    if (chat.id === selectedChatId) {
                        return {
                            ...chat,
                            status: "online",
                            messages: [...chat.messages, reply]
                        } as Chat
                    }
                    return chat
                }))
            }, 2000)
        }, 1000)
    }

    // Call Handlers
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (callStatus === "connected") {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [callStatus])

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleStartCall = async (type: "audio" | "video") => {
        setCallType(type)
        setCallStatus("dialing")
        setCallDuration(0)

        if (type === "video") {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                setLocalStream(stream)
            } catch (err) {
                console.error("Failed to access media devices", err)
            }
        }

        // Simulate connection sequence
        setTimeout(() => setCallStatus("ringing"), 2000)
        setTimeout(() => setCallStatus("connected"), 4000)
    }

    const handleEndCall = () => {
        setCallStatus("idle")
        setCallDuration(0)
        setIsMuted(false)
        setIsCameraOff(false)

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop())
            setLocalStream(null)
        }
    }

    useEffect(() => {
        if (videoRef.current && localStream) {
            videoRef.current.srcObject = localStream
        }
    }, [localStream, isCameraOff])

    return (
        <div className="h-screen bg-slate-950 text-slate-100 pt-20 pb-4 px-4 md:px-6 lg:px-8 flex gap-6 overflow-hidden relative">

            {/* Call Overlay */}
            <AnimatePresence>
                {callStatus !== "idle" && selectedChat && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-3xl"
                    >
                        {/* Background ambience */}
                        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${selectedChat.color} animate-pulse`} />

                        <div className="relative w-full max-w-4xl h-[80vh] bg-black/40 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center">

                            {/* Main Display */}
                            <div className="flex-1 w-full relative flex items-center justify-center">
                                {callType === "video" && callStatus === "connected" ? (
                                    // Video Call Layout
                                    <div className="w-full h-full relative">
                                        {/* Remote Stream (Mock) */}
                                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                                            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${selectedChat.color} flex items-center justify-center text-4xl font-bold shadow-2xl animate-pulse`}>
                                                {selectedChat.avatar}
                                            </div>
                                        </div>

                                        {/* Local Stream (PIP) */}
                                        <motion.div
                                            drag
                                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                            className="absolute md:top-8 md:right-8 top-4 right-4 w-32 md:w-48 aspect-[3/4] bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-white/20 cursor-grab active:cursor-grabbing"
                                        >
                                            {!isCameraOff && localStream ? (
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    muted
                                                    playsInline
                                                    className="w-full h-full object-cover mirror-mode"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                                                    <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center">
                                                        <Video className="w-6 h-6 rotate-45" />
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                ) : (
                                    // Audio Call / Dialing Layout
                                    <div className="flex flex-col items-center gap-8 z-10">
                                        <div className="relative">
                                            <motion.div
                                                animate={{
                                                    scale: callStatus === "ringing" || callStatus === "dialing" ? [1, 1.2, 1] : 1,
                                                    opacity: [0.5, 0.8, 0.5]
                                                }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className={`absolute inset-0 rounded-full bg-gradient-to-br ${selectedChat.color} blur-3xl opacity-40`}
                                            />
                                            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${selectedChat.color} flex items-center justify-center text-5xl font-bold shadow-2xl border-4 border-slate-900/50`}>
                                                {selectedChat.avatar}
                                            </div>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h2 className="text-3xl font-bold text-white tracking-tight">{selectedChat.name}</h2>
                                            <p className="text-slate-400 text-lg font-medium">
                                                {callStatus === "dialing" ? "Calling..." :
                                                    callStatus === "ringing" ? "Ringing..." :
                                                        formatDuration(callDuration)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Controls Bar */}
                            <div className="w-full p-8 md:p-10 flex items-center justify-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={cn(
                                        "h-14 w-14 rounded-full border-none transition-all duration-300",
                                        isMuted ? "bg-white text-slate-900 hover:bg-slate-200" : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
                                    )}
                                    onClick={() => setIsMuted(!isMuted)}
                                >
                                    <Mic className={cn("h-6 w-6", isMuted && "fill-current")} />
                                </Button>

                                {callType === "video" && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={cn(
                                            "h-14 w-14 rounded-full border-none transition-all duration-300",
                                            isCameraOff ? "bg-white text-slate-900 hover:bg-slate-200" : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
                                        )}
                                        onClick={() => setIsCameraOff(!isCameraOff)}
                                    >
                                        <Video className={cn("h-6 w-6", isCameraOff && "fill-current")} />
                                    </Button>
                                )}

                                <Button
                                    size="icon"
                                    className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/20 hover:scale-105 transition-all duration-300"
                                    onClick={handleEndCall}
                                >
                                    <Phone className="h-8 w-8 rotate-[135deg]" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Friends Sidebar */}
            <AnimatePresence mode="popLayout">
                {(!isMobile || !selectedChatId) && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={cn(
                            "w-full md:w-[380px] lg:w-[420px] flex flex-col bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-800/60 overflow-hidden shadow-2xl",
                            "h-full"
                        )}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800/60 bg-slate-900/40">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Messages</h1>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-800/50">
                                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                </Button>
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                            {filteredChats.map((chat) => (
                                <motion.div
                                    key={chat.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={cn(
                                        "p-3 rounded-2xl cursor-pointer transition-all duration-200 group relative overflow-hidden",
                                        selectedChatId === chat.id
                                            ? "bg-blue-600/10 border border-blue-500/20 shadow-lg shadow-blue-900/10"
                                            : "hover:bg-slate-800/40 border border-transparent hover:border-slate-800"
                                    )}
                                >
                                    {/* Active Indicator Bar */}
                                    {selectedChatId === chat.id && (
                                        <motion.div
                                            layoutId="activeBar"
                                            className="absolute left-0 top-3 bottom-0 w-1 h-8 my-auto bg-blue-500 rounded-r-full"
                                        />
                                    )}

                                    <div className="flex items-center gap-4 pl-2">
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${chat.color} flex items-center justify-center text-lg font-bold shadow-lg`}>
                                                {chat.avatar}
                                            </div>
                                            {chat.status === "online" && (
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-[3px] border-slate-900" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className={cn("font-semibold truncate", selectedChatId === chat.id ? "text-blue-100" : "text-slate-200")}>
                                                    {chat.name}
                                                </h3>
                                                <span className="text-xs text-slate-500 font-medium">
                                                    {chat.messages[chat.messages.length - 1]?.time}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className={cn(
                                                    "text-sm truncate max-w-[85%]",
                                                    selectedChatId === chat.id ? "text-blue-200/70" : "text-slate-400 group-hover:text-slate-300",
                                                    chat.status === "typing" && "text-blue-400 font-medium animate-pulse"
                                                )}>
                                                    {chat.status === "typing" ? "Typing..." : chat.messages[chat.messages.length - 1]?.text}
                                                </p>
                                                {chat.unread > 0 && (
                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-lg shadow-blue-500/20">
                                                        {chat.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Area */}
            <AnimatePresence mode="popLayout">
                {(!isMobile || selectedChatId) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            "flex-1 bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-800/60 overflow-hidden flex flex-col shadow-2xl relative",
                            !selectedChatId && "hidden md:flex items-center justify-center"
                        )}
                    >
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 px-6 border-b border-slate-800/60 flex items-center justify-between bg-slate-900/40 backdrop-blur-xl z-10">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden -ml-2 text-slate-400 hover:text-white"
                                            onClick={() => setSelectedChatId(null)}
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                        <div className="relative">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedChat.color} flex items-center justify-center font-bold shadow-md`}>
                                                {selectedChat.avatar}
                                            </div>
                                            {selectedChat.status === "online" && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg leading-tight">{selectedChat.name}</h2>
                                            <div className="flex items-center gap-2">
                                                {selectedChat.status === "online" ? (
                                                    <span className="text-xs text-emerald-400 font-medium">Online</span>
                                                ) : selectedChat.status === "typing" ? (
                                                    <span className="text-xs text-blue-400 font-medium animate-pulse">Typing...</span>
                                                ) : (
                                                    <span className="text-xs text-slate-500">Last seen {selectedChat.lastSeen}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full"
                                            onClick={() => handleStartCall("audio")}
                                        >
                                            <Phone className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full"
                                            onClick={() => handleStartCall("video")}
                                        >
                                            <Video className="h-5 w-5" />
                                        </Button>
                                        <div className="w-px h-6 bg-slate-800 mx-2" />
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full">
                                            <MoreVertical className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative">
                                    {/* Chat background decoration */}
                                    <div className="absolute inset-0 bg-[url('/chat-pattern.svg')] opacity-[0.03] pointer-events-none" />

                                    {selectedChat.messages.map((msg, idx) => {
                                        const isMe = msg.sender === "me"
                                        const isLast = idx === selectedChat.messages.length - 1
                                        return (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={cn(
                                                    "flex w-full group",
                                                    isMe ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                {!isMe && (
                                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedChat.color} flex items-center justify-center text-xs font-bold mr-2 mt-auto shadow-sm self-end mb-1`}>
                                                        {selectedChat.avatar}
                                                    </div>
                                                )}
                                                <div className={cn(
                                                    "max-w-[75%] md:max-w-[60%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm relative",
                                                    isMe
                                                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm"
                                                        : "bg-slate-800/80 text-slate-100 rounded-tl-sm border border-slate-700/50"
                                                )}>
                                                    <p>{msg.text}</p>
                                                    <div className={cn(
                                                        "flex items-center gap-1 text-[10px] mt-1.5 opacity-70",
                                                        isMe ? "justify-end text-blue-100" : "text-slate-400"
                                                    )}>
                                                        <span>{msg.time}</span>
                                                        {isMe && (
                                                            msg.status === "read" ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 md:p-5 bg-slate-900/40 border-t border-slate-800/60 backdrop-blur-md">
                                    <form
                                        onSubmit={handleSendMessage}
                                        className="flex items-center gap-3 bg-slate-800/40 rounded-3xl p-2 pl-4 border border-slate-700/40 focus-within:border-blue-500/30 focus-within:bg-slate-800/60 transition-all shadow-lg"
                                    >
                                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-full h-9 w-9 hover:bg-slate-700/50 transition-colors">
                                            <Paperclip className="h-5 w-5" />
                                        </Button>
                                        <Input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-200 placeholder:text-slate-500 h-10 px-0"
                                        />
                                        <div className="flex items-center gap-1 pr-1">
                                            <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-full h-9 w-9 hover:bg-slate-700/50 transition-colors">
                                                <Smile className="h-5 w-5" />
                                            </Button>
                                            <AnimatePresence>
                                                {inputValue.trim() ? (
                                                    <motion.div
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0, opacity: 0 }}
                                                    >
                                                        <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full h-9 w-9 shadow-lg shadow-blue-600/20">
                                                            <Send className="h-4 w-4 ml-0.5" />
                                                        </Button>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0, opacity: 0 }}
                                                    >
                                                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-full h-9 w-9 hover:bg-slate-700/50">
                                                            <Mic className="h-5 w-5" />
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-900/20">
                                <div className="relative mb-8 group">
                                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
                                    <div className="w-24 h-24 rounded-3xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center relative shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
                                        <Send className="h-10 w-10 text-blue-400" />
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shadow-xl transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500 delay-75">
                                        <Smile className="h-7 w-7 text-purple-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-200 mb-3">Welcome to SociaVerse Chat</h3>
                                <p className="max-w-xs text-slate-400 leading-relaxed">
                                    Select a conversation from the sidebar to start messaging your friends.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Loading chat...</div>}>
            <ChatContent />
        </Suspense>
    )
}
