"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search, Phone, Video, MoreVertical, Send, Paperclip,
    Smile, ArrowLeft, Check, CheckCheck, MoreHorizontal,
    Image as ImageIcon, Mic, Lock, ShieldCheck, Info, Shield, Zap,
    Home, Globe, User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { Meteors } from "@/components/ui/meteors"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { chatService, Conversation } from "@/services/chat"
import { useChatWebSocket } from "@/hooks/use-chat-websocket"
import EmojiPicker, { Theme } from "emoji-picker-react"

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
    profile_picture?: string | null
    color: string
    unread: number
    messages: Message[]
}

function ChatContent() {
    const { user } = useAuth()
    const searchParams = useSearchParams()

    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
    const [inputValue, setInputValue] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [isMobile, setIsMobile] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Call State (Mock for now)
    const [callStatus, setCallStatus] = useState<"idle" | "dialing" | "ringing" | "connected">("idle")
    const [callType, setCallType] = useState<"audio" | "video">("audio")
    const [callDuration, setCallDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOff, setIsCameraOff] = useState(false)
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const onEmojiClick = (emojiData: any) => {
        setInputValue((prev) => prev + emojiData.emoji)
    }

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Real-time hook
    const { messages: realtimeMessages, sendMessage, status: wsStatus } = useChatWebSocket(selectedChatId)

    // Derived state
    const selectedChat = chats.find(c => c.id === selectedChatId)
    const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Fetch conversations on mount
    useEffect(() => {
        const loadChats = async () => {
            try {
                const conversations = await chatService.getConversations()
                const formattedChats: Chat[] = conversations.map(conv => {
                    const other = conv.participants.find(p => p.id !== user?.id) || conv.participants[0]
                    return {
                        id: conv.id,
                        name: other?.username || "Unknown",
                        status: "offline",
                        avatar: (other?.username || "U").charAt(0).toUpperCase(),
                        profile_picture: other?.profile_picture,
                        color: "from-blue-500 to-cyan-500",
                        unread: 0,
                        messages: []
                    }
                })
                setChats(formattedChats)
            } catch (err) {
                console.error("Failed to load chats", err)
            } finally {
                setIsLoading(false)
            }
        }
        if (user) loadChats()
    }, [user])

    // Fetch messages when chat selected
    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedChatId) return
            try {
                const msgs = await chatService.getMessages(selectedChatId)

                const formattedMessages: Message[] = msgs.map(m => ({
                    id: m.id,
                    text: m.content,
                    sender: m.sender_id === user?.id ? "me" : "them",
                    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: "read"
                }))

                setChats(prev => prev.map(c =>
                    c.id === selectedChatId ? { ...c, messages: formattedMessages } : c
                ))
            } catch (err) {
                console.error("Failed to load messages", err)
            }
        }
        loadMessages()
    }, [selectedChatId, user])

    // Append Real-time messages
    useEffect(() => {
        if (realtimeMessages.length > 0 && selectedChatId) {
            const lastMsg = realtimeMessages[realtimeMessages.length - 1]
            const newMessage: Message = {
                id: Date.now().toString(), // Temp ID
                text: lastMsg.message,
                sender: lastMsg.sender_id === user?.id ? "me" : "them",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: "read"
            }

            setChats(prev => prev.map(c => {
                if (c.id === selectedChatId) {
                    // Check duplication roughly
                    if (c.messages.some(m => m.text === newMessage.text && m.sender === newMessage.sender && m.time === newMessage.time)) {
                        return c
                    }
                    return { ...c, messages: [...c.messages, newMessage] }
                }
                return c
            }))
        }
    }, [realtimeMessages, selectedChatId, user])


    // Handle incoming inquiry from Marketplace or Profile
    useEffect(() => {
        const sellerUsername = searchParams.get("seller")
        const targetUsername = searchParams.get("user") || sellerUsername

        const initChat = async () => {
            if (targetUsername && user) {
                try {
                    // Check if chat exists
                    const existing = chats.find(c => c.name === targetUsername)
                    if (existing) {
                        setSelectedChatId(existing.id)
                    } else {
                        // Start new conversation API
                        const newConv = await chatService.startConversation(targetUsername)
                        const newChat: Chat = {
                            id: newConv.id,
                            name: targetUsername,
                            status: "online",
                            avatar: targetUsername.charAt(0).toUpperCase(),
                            profile_picture: null, // Initial unknown
                            color: "from-pink-500 to-rose-500",
                            unread: 0,
                            messages: []
                        }
                        setChats(prev => {
                            if (prev.some(c => c.id === newConv.id)) {
                                setSelectedChatId(newConv.id)
                                return prev
                            }
                            return [newChat, ...prev]
                        })
                        setSelectedChatId(newConv.id)
                    }
                } catch (err) {
                    console.error("Failed to start chat from url", err)
                }
            }
        }
        initChat()
    }, [searchParams, user, chats.length])

    // Scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [selectedChat?.messages])

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim() || !selectedChatId) return

        sendMessage(inputValue)
        setInputValue("")
        setShowEmojiPicker(false)
    }

    // Call handlers (Keep mock for demo)
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
            } catch (err) { console.error(err) }
        }
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

    return (
        <div className="h-screen bg-slate-950 text-slate-100 pt-4 md:pt-28 pb-20 md:pb-4 px-4 md:px-6 lg:px-8 flex gap-6 overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 mobile-only-hide">
                <Meteors number={10} />
            </div>

            {/* Sidebar */}
            <AnimatePresence mode="popLayout">
                {(!isMobile || !selectedChatId) && (
                    <motion.div
                        className={cn(
                            "w-full md:w-[380px] lg:w-[420px] flex flex-col bg-slate-900/40 backdrop-blur-3xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl",
                            "h-full"
                        )}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-slate-900/20">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Messages</h1>
                                    <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                        <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest">Secure</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search encrypted chats..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/30 focus:bg-white/10 transition-all placeholder:text-slate-600 text-slate-200"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                            {isLoading ? (
                                <div className="text-center p-4 text-slate-500">Loading conversations...</div>
                            ) : filteredChats.length === 0 ? (
                                <div className="text-center p-4 text-slate-500">No conversations found.</div>
                            ) : filteredChats.map((chat) => (
                                <motion.div
                                    key={chat.id}
                                    layout
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={cn(
                                        "p-3 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden",
                                        selectedChatId === chat.id
                                            ? "bg-white/10 border border-white/10 shadow-lg shadow-black/20"
                                            : "hover:bg-white/5 border border-transparent hover:border-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-4 pl-3">
                                        <Link href={`/u/${chat.name}`} onClick={(e) => e.stopPropagation()} className="relative z-10 block">
                                            {chat.profile_picture ? (
                                                <img
                                                    src={chat.profile_picture.startsWith('http') ? chat.profile_picture : `http://127.0.0.1:8000${chat.profile_picture}`}
                                                    alt={chat.name}
                                                    className="w-12 h-12 rounded-2xl object-cover shadow-lg hover:opacity-80 transition-opacity"
                                                />
                                            ) : (
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${chat.color} flex items-center justify-center text-lg font-bold shadow-lg text-white hover:opacity-80 transition-opacity`}>
                                                    {chat.avatar}
                                                </div>
                                            )}
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className={cn("font-semibold truncate tracking-tight", selectedChatId === chat.id ? "text-white" : "text-slate-200")}>
                                                    {chat.name}
                                                </h3>
                                                <span className="text-[11px] text-slate-500 font-medium">
                                                    {chat.messages[chat.messages.length - 1]?.time}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <p className={cn(
                                                        "text-sm truncate",
                                                        selectedChatId === chat.id ? "text-slate-300" : "text-slate-400 group-hover:text-slate-300"
                                                    )}>
                                                        {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Start chatting"}
                                                    </p>
                                                </div>
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
                        className={cn(
                            "flex-1 bg-slate-900/40 backdrop-blur-3xl rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-2xl relative",
                            !selectedChatId && "hidden md:flex items-center justify-center"
                        )}
                    >
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 px-6 border-b border-white/5 flex items-center justify-between bg-slate-900/40 backdrop-blur-xl z-10 glass-header">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden -ml-2 text-slate-400 hover:text-white"
                                            onClick={() => setSelectedChatId(null)}
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                        <Link href={`/u/${selectedChat.name}`} className="relative block hover:opacity-80 transition-opacity">
                                            {selectedChat.profile_picture ? (
                                                <img
                                                    src={selectedChat.profile_picture.startsWith('http') ? selectedChat.profile_picture : `http://127.0.0.1:8000${selectedChat.profile_picture}`}
                                                    alt={selectedChat.name}
                                                    className="w-10 h-10 rounded-2xl object-cover shadow-md"
                                                />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${selectedChat.color} flex items-center justify-center font-bold shadow-md text-white`}>
                                                    {selectedChat.avatar}
                                                </div>
                                            )}
                                            {wsStatus === "connected" && (
                                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                </div>
                                            )}
                                        </Link>
                                        <div className="min-w-0 flex-1">
                                            <Link href={`/u/${selectedChat.name}`} className="font-bold text-lg leading-tight text-white truncate hover:underline underline-offset-4 decoration-blue-500/30">
                                                {selectedChat.name}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-0.5 text-xs font-medium overflow-hidden">
                                                <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400 flex items-center gap-1 border border-white/5 whitespace-nowrap shrink-0">
                                                    <Lock className="w-2.5 h-2.5" /> Encrypted
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Call Buttons (Mock) */}
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleStartCall("audio")} className="text-slate-400 hover:text-white"><Phone className="h-5 w-5" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleStartCall("video")} className="text-slate-400 hover:text-white"><Video className="h-5 w-5" /></Button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative custom-scrollbar">
                                    <div className="flex justify-center mb-8 mt-4">
                                        <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl px-4 py-2 flex items-center gap-2 text-xs text-yellow-500/80">
                                            <Lock className="w-3 h-3" />
                                            <span>Messages are end-to-end encrypted.</span>
                                        </div>
                                    </div>

                                    {selectedChat.messages.map((msg, idx) => {
                                        const isMe = msg.sender === "me"
                                        return (
                                            <motion.div
                                                key={msg.id || idx}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={cn(
                                                    "flex w-full group items-end",
                                                    isMe ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                {!isMe && (
                                                    <Link href={`/u/${selectedChat.name}`} className="mr-2 mb-1 block hover:scale-105 transition-transform">
                                                        {selectedChat.profile_picture ? (
                                                            <img
                                                                src={selectedChat.profile_picture.startsWith('http') ? selectedChat.profile_picture : `http://127.0.0.1:8000${selectedChat.profile_picture}`}
                                                                alt={selectedChat.name}
                                                                className="w-8 h-8 rounded-full object-cover shadow-md"
                                                            />
                                                        ) : (
                                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedChat.color} flex items-center justify-center text-xs font-bold text-white shadow-md`}>
                                                                {selectedChat.avatar}
                                                            </div>
                                                        )}
                                                    </Link>
                                                )}
                                                <div className={cn(
                                                    "max-w-[75%] md:max-w-[60%] px-5 py-3 text-sm leading-relaxed shadow-lg relative transition-all duration-200",
                                                    isMe
                                                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-blue-900/20"
                                                        : "bg-slate-800/60 backdrop-blur-md text-slate-100 rounded-2xl rounded-tl-sm border border-white/5"
                                                )}>
                                                    <p>{msg.text}</p>
                                                    <div className={cn(
                                                        "flex items-center gap-1 text-[10px] mt-1.5",
                                                        isMe ? "justify-end text-blue-100/70" : "text-slate-400"
                                                    )}>
                                                        <span>{msg.time}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 md:p-6 bg-slate-900/40 backdrop-blur-xl border-t border-white/5">
                                    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-2 pl-4 flex items-center gap-3 shadow-xl relative">
                                        <div className="relative">
                                            <AnimatePresence>
                                                {showEmojiPicker && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        className="absolute bottom-16 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden"
                                                    >
                                                        <EmojiPicker
                                                            theme={Theme.DARK}
                                                            onEmojiClick={onEmojiClick}
                                                            lazyLoadEmojis={true}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn("text-slate-400 hover:text-white rounded-full transition-colors", showEmojiPicker && "text-blue-400 bg-blue-500/10")}
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            >
                                                <Smile className="h-6 w-6" />
                                            </Button>
                                        </div>
                                        <Input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                            placeholder="Type a secure message..."
                                            className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-200 placeholder:text-slate-500 h-10 px-0"
                                            onClick={() => setShowEmojiPicker(false)}
                                        />
                                        <div className="flex items-center gap-2 pr-1">
                                            <Button
                                                onClick={() => handleSendMessage()}
                                                size="icon"
                                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-full h-10 w-10 shadow-lg shadow-blue-600/30"
                                            >
                                                <Send className="h-5 w-5 ml-0.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-900/20">
                                <ShieldCheck className="h-16 w-16 text-blue-500 mb-4" />
                                <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">SociaVerse Secure Chat</h3>
                                <p className="max-w-sm text-slate-400 text-lg leading-relaxed">
                                    Select a conversation to start messaging. <br />
                                    <span className="text-sm opacity-70">Your private messages are end-to-end encrypted.</span>
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
        <Suspense fallback={<div className="h-screen bg-slate-950 text-slate-100 flex items-center justify-center animate-pulse">Loading secure chat...</div>}>
            <ChatContent />
        </Suspense>
    )
}

// Verified syntax fix
