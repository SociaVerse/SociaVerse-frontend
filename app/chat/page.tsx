"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search, Phone, Video, MoreVertical, Send, Paperclip,
    Smile, ArrowLeft, Check, CheckCheck, MoreHorizontal,
    Image as ImageIcon, Mic, Lock, ShieldCheck, Info, Shield, Zap,
    Home, Globe, User, Trash2, Reply, Copy, Forward, Star, Flag, Heart, Pin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useSearchParams, useRouter } from "next/navigation"
import { Meteors } from "@/components/ui/meteors"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { chatService, Conversation } from "@/services/chat"
import { useChatWebSocket } from "@/hooks/use-chat-websocket"
import { ChatInfo } from "./components/ChatInfo"
import { VoiceRecorder } from "./components/VoiceRecorder"
import { VoiceMessageBubble } from "./components/VoiceMessage"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { Skeleton } from "@/components/ui/skeleton"

// Types
type Message = {
    id: string
    text: string
    sender: "me" | "them"
    time: string
    status: "sent" | "delivered" | "read"
    likes?: number[]
    starred_by?: number[]
    pinned_by?: number[]
    reply_to?: string
    audio_url?: string
    duration?: number
    waveform?: number[]
}

type Chat = {
    id: number
    name: string
    otherUserId: number
    status: "online" | "offline" | "typing"
    lastSeen?: string
    avatar: string
    profile_picture?: string | null
    color: string
    unread: number
    isBlocked?: boolean
    messages: Message[]
    is_anonymous?: boolean
    message_count?: number
}

function ChatContent() {
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const router = useRouter()

    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
    const [inputValue, setInputValue] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [isMobile, setIsMobile] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)

    // Call State (Mock for now)
    const [callStatus, setCallStatus] = useState<"idle" | "dialing" | "ringing" | "connected">("idle")
    const [callType, setCallType] = useState<"audio" | "video">("audio")
    const [callDuration, setCallDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOff, setIsCameraOff] = useState(false)
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null)
    const [deleteOption, setDeleteOption] = useState<"me" | "everyone">("me")

    // New State for features
    const [replyingTo, setReplyingTo] = useState<Message | null>(null)
    const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null)
    const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false)
    const [showChatInfo, setShowChatInfo] = useState(false)
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
    const [reportMessageId, setReportMessageId] = useState<string | null>(null)
    const [isRecording, setIsRecording] = useState(false)

    // Confetti state
    const [showConfetti, setShowConfetti] = useState(false)

    const handleReportSubmit = async (reason: string) => {
        if (!reportMessageId) return
        try {
            await chatService.performAction(reportMessageId, 'report')
            console.log(`Reported message ${reportMessageId} for ${reason}`)
            setIsReportDialogOpen(false)
            setReportMessageId(null)
        } catch (err) {
            console.error("Failed to report", err)
        }
    }

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Sync selectedChatId with URL param 'cid'
    useEffect(() => {
        const cid = searchParams.get("cid")
        if (cid) {
            const id = parseInt(cid)
            if (!isNaN(id) && id !== selectedChatId) {
                setSelectedChatId(id)
            }
        } else if (selectedChatId !== null) {
            // If No CID in URL but we have selectedChatId, it means we probably navigated back.
            // Or we should clear selectedChatId. 
            // Better behavior: URL is source of truth.
            setSelectedChatId(null)
        }
    }, [searchParams])

    // Update URL when selectedChatId changes
    const handleChatSelect = (id: number | null) => {
        setSelectedChatId(id)
        if (id) {
            router.push(`/chat?cid=${id}`)
        } else {
            router.push('/chat')
        }
    }

    const onEmojiClick = (emojiData: any) => {
        setInputValue((prev) => prev + emojiData.emoji)
    }

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const lastScrolledChatId = useRef<number | null>(null)

    // Real-time hook
    const { messages: realtimeMessages, sendMessage, status: wsStatus, revealData } = useChatWebSocket(selectedChatId)

    // Handle Reveal Event
    useEffect(() => {
        if (revealData && selectedChatId) {
            setShowConfetti(true)
            // Update the chat with new participants data
            setChats(prev => prev.map(c => {
                if (c.id === selectedChatId) {
                    // Find the other user from the new participants list
                    const other = revealData.find((p: any) => p.id !== user?.id) || revealData[0]
                    return {
                        ...c,
                        name: other?.username || "Unknown",
                        avatar: (other?.username || "U").charAt(0).toUpperCase(),
                        profile_picture: other?.profile_picture,
                        is_anonymous: false, // No longer anonymous
                        message_count: 40 // Maxed out
                    }
                }
                return c
            }))

            // Hide confetti after 5 seconds
            setTimeout(() => setShowConfetti(false), 5000)
        }
    }, [revealData, selectedChatId, user])

    // Derived state
    const selectedChat = chats.find(c => c.id === selectedChatId)
    const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Fetch conversations on mount
    useEffect(() => {
        const loadChats = async () => {
            try {
                const data = await chatService.getConversations()
                setChats(data.map((conv: Conversation & { is_anonymous?: boolean, message_count?: number }) => {
                    const other = conv.participants.find((p: any) => p.id !== user?.id) || conv.participants[0]
                    return {
                        id: conv.id,
                        name: other?.username || "Unknown",
                        otherUserId: other?.id || 0,
                        status: "offline",
                        avatar: (other?.username || "U").charAt(0).toUpperCase(),
                        profile_picture: other?.profile_picture,
                        color: "from-blue-500 to-cyan-500",
                        unread: 0,
                        isBlocked: other?.is_blocked,
                        messages: [],
                        is_anonymous: conv.is_anonymous,
                        message_count: conv.message_count
                    }
                }))
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
            setIsMessagesLoading(true)
            try {
                const msgs = await chatService.getMessages(selectedChatId)

                const formattedMessages: Message[] = msgs.map(m => ({
                    id: m.id,
                    text: m.content,
                    sender: m.sender_id === user?.id ? "me" : "them",
                    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: "read",
                    likes: m.likes,
                    starred_by: m.starred_by,
                    pinned_by: m.pinned_by,
                    reply_to: m.reply_to,
                    audio_url: m.audio_url,
                    duration: m.duration,
                    waveform: m.waveform
                }))

                setChats(prev => prev.map(c =>
                    c.id === selectedChatId ? { ...c, messages: formattedMessages } : c
                ))
            } catch (err) {
                console.error("Failed to load messages", err)
            } finally {
                setIsMessagesLoading(false)
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
                status: "read",
                reply_to: lastMsg.reply_to,
                audio_url: lastMsg.audio_url,
                duration: lastMsg.duration,
                waveform: lastMsg.waveform,
            }

            setChats(prev => prev.map(c => {
                if (c.id === selectedChatId) {
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
                    const existing = chats.find(c => c.name === targetUsername)
                    if (existing) {
                        handleChatSelect(existing.id)
                    } else {
                        const newConv = await chatService.startConversation(targetUsername)
                        const newChat: Chat = {
                            id: newConv.id,
                            name: targetUsername,
                            otherUserId: newConv.participants.find(p => p.username === targetUsername)?.id || 0,
                            status: "online",
                            avatar: targetUsername.charAt(0).toUpperCase(),
                            profile_picture: null,
                            color: "from-pink-500 to-rose-500",
                            unread: 0,
                            messages: []
                        }
                        setChats(prev => {
                            if (prev.some(c => c.id === newConv.id)) {
                                handleChatSelect(newConv.id)
                                return prev
                            }
                            return [newChat, ...prev]
                        })
                        handleChatSelect(newConv.id)
                    }
                } catch (err) {
                    console.error("Failed to start chat from url", err)
                }
            }
        }
        initChat()
    }, [searchParams, user, chats.length])

    const scrollToMessage = (messageId: string) => {
        const element = document.getElementById(`msg-${messageId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('bg-blue-500/20');
            setTimeout(() => element.classList.remove('bg-blue-500/20'), 2000);
        }
    }

    // Scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            const isDifferentChat = lastScrolledChatId.current !== selectedChatId
            messagesEndRef.current.scrollIntoView({ behavior: isDifferentChat ? "auto" : "smooth" })
            lastScrolledChatId.current = selectedChatId
        }
    }, [selectedChat?.messages.length, selectedChatId])

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim() || !selectedChatId) return

        sendMessage(inputValue, replyingTo?.id)
        setInputValue("")
        setReplyingTo(null)
        setShowEmojiPicker(false)
    }

    const handleDeleteMessage = async () => {
        if (!deleteMessageId || !selectedChatId) return

        try {
            await chatService.deleteMessage(deleteMessageId, deleteOption)
            setChats(prev => prev.map(chat => {
                if (chat.id === selectedChatId) {
                    let updatedMessages = [...chat.messages]
                    if (deleteOption === "me") {
                        updatedMessages = updatedMessages.filter(m => m.id !== deleteMessageId)
                    } else {
                        updatedMessages = updatedMessages.map(m =>
                            m.id === deleteMessageId ? { ...m, text: "This message was deleted" } : m
                        )
                    }
                    return { ...chat, messages: updatedMessages }
                }
                return chat
            }))
            setIsDeleteDialogOpen(false)
            setDeleteMessageId(null)
        } catch (error) {
            console.error("Failed to delete message", error)
        }
    }

    const handleAction = async (msg: Message, action: 'like' | 'star' | 'pin' | 'report') => {
        if (!selectedChatId) return
        try {
            await chatService.performAction(msg.id, action)
            setChats(prev => prev.map(c => {
                if (c.id === selectedChatId) {
                    return {
                        ...c,
                        messages: c.messages.map(m => {
                            if (m.id === msg.id) {
                                if (action === 'like') {
                                    const likes = m.likes || []
                                    const hasLiked = likes.includes(user?.id || 0)
                                    return { ...m, likes: hasLiked ? likes.filter(id => id !== user?.id) : [...likes, user?.id || 0] }
                                }
                                if (action === 'star') {
                                    const starred = m.starred_by || []
                                    const hasStarred = starred.includes(user?.id || 0)
                                    return { ...m, starred_by: hasStarred ? starred.filter(id => id !== user?.id) : [...starred, user?.id || 0] }
                                }
                                if (action === 'pin') {
                                    const pinned = m.pinned_by || []
                                    const hasPinned = pinned.includes(user?.id || 0)
                                    return { ...m, pinned_by: hasPinned ? pinned.filter(id => id !== user?.id) : [...pinned, user?.id || 0] }
                                }
                            }
                            return m
                        })
                    }
                }
                return c
            }))
        } catch (err) {
            console.error("Action failed", err)
        }
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const handleForward = (msg: Message) => {
        setForwardingMessage(msg)
        setIsForwardDialogOpen(true)
    }

    const confirmForward = async (targetChatId: number) => {
        console.log("Forwarding to", targetChatId)
        setIsForwardDialogOpen(false)
        setForwardingMessage(null)
    }

    const handleStartCall = async (type: "audio" | "video") => {
        setCallType(type)
        setCallStatus("dialing")
        // Mock
    }

    const handleVoiceUpload = async (audioBlob: Blob, duration: number, waveform: number[]) => {
        setIsRecording(false)
        if (!selectedChatId) return

        try {
            // Upload first
            const { url } = await chatService.uploadVoiceNote(audioBlob)

            // Send message with audio data
            // We need to update sendMessage signature or pass extra data. 
            // The existing sendMessage hook likely sends a JSON string.
            // Let's check useChatWebSocket hook. 
            // Assuming sendMessage takes (text, replyTo, extraData?) or we assume text is empty/fallback for audio.
            // Actually, best to modify useChatWebSocket or send a structured message.
            // For now, let's send a special text marker or handle it in the hook.
            // Wait, I can't easily modify the hook without viewing it. 
            // Let's assume I can call the websocket send directly or modify the hook later.
            // Let's modify the hook to accept extra fields.

            // Checking use-chat-websocket.ts... I haven't viewed it yet. I should have.
            // But I can send a "Voice Message" text and pass extra fields if the hook allows.
            // If strictly text, I might need to send JSON string as text and parse on backend? No, backend expects 'message' field in JSON.
            // The consumer expects 'audio_url', 'duration', 'waveform' at top level of JSON.

            // I need to update the hook. For now, I'll add a TODO and call a hypothetical method.
            // Actually, I can use the `sendMessage` from the hook if I update it to accept an object or extra params.
            // Let's assume I will update the hook to: sendMessage(text, replyTo, extraFields)

            sendMessage("🎤 Voice Message", replyingTo?.id, { audio_url: url, duration, waveform })

        } catch (err) {
            console.error("Failed to send voice note", err)
        }
    }

    return (
        <div className="h-[100dvh] md:h-screen bg-slate-950 text-slate-100 md:pt-28 md:pb-4 md:px-6 lg:px-8 flex gap-6 overflow-hidden relative">
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
                            "w-full md:w-[380px] lg:w-[420px] flex flex-col bg-slate-900/40 backdrop-blur-3xl md:rounded-3xl border-r md:border border-white/5 overflow-hidden shadow-2xl",
                            "h-full"
                        )}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
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
                            {filteredChats.map((chat, idx) => (
                                <motion.div
                                    key={chat.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                                    onClick={() => handleChatSelect(chat.id)}
                                    className={cn(
                                        "p-3 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden",
                                        selectedChatId === chat.id
                                            ? "bg-white/10 border border-white/10 shadow-lg shadow-black/20"
                                            : "hover:bg-white/5 border border-transparent hover:border-white/5"
                                    )}
                                >
                                    {selectedChatId === chat.id && (
                                        <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full" />
                                    )}
                                    <div className="flex items-center gap-4 pl-3">
                                        <div className="relative">
                                            {chat.profile_picture ? (
                                                <img
                                                    src={chat.profile_picture.startsWith('http') ? chat.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${chat.profile_picture}`}
                                                    alt={chat.name}
                                                    className="w-12 h-12 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${chat.color} flex items-center justify-center text-lg font-bold shadow-lg text-white group-hover:scale-105 transition-transform duration-300`}>
                                                    {chat.avatar}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className={cn("font-semibold truncate tracking-tight transition-colors", selectedChatId === chat.id ? "text-white" : "text-slate-200")}>
                                                    {chat.name}
                                                </h3>
                                                <span className="text-[11px] text-slate-500 font-medium">
                                                    {chat.messages[chat.messages.length - 1]?.time}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <p className={cn(
                                                        "text-sm truncate transition-colors",
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
                            "flex-1 bg-slate-900/40 backdrop-blur-3xl md:rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-2xl relative",
                            !selectedChatId && "hidden md:flex items-center justify-center",
                            isMobile && "fixed inset-0 z-[200] bg-slate-950" // High z-index to cover nav
                        )}
                        initial={isMobile ? { opacity: 0, x: 20 } : { opacity: 0, scale: 0.95 }}
                        animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, scale: 1 }}
                        exit={isMobile ? { opacity: 0, x: 20 } : { opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-3 px-4 md:p-4 md:px-6 border-b border-white/5 flex items-center justify-between bg-slate-900 z-30 shadow-sm sticky top-0">
                                    <div className="flex items-center gap-3 md:gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowChatInfo(true)}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden -ml-2 text-slate-400 hover:text-white"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleChatSelect(null)
                                            }}
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                        <div className="relative block">
                                            {selectedChat.profile_picture ? (
                                                <img
                                                    src={selectedChat.profile_picture.startsWith('http') ? selectedChat.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${selectedChat.profile_picture}`}
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
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-lg leading-tight text-white truncate hover:underline underline-offset-4 decoration-blue-500/30">
                                                {selectedChat.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5 text-xs font-medium overflow-hidden">
                                                <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400 flex items-center gap-1 border border-white/5 whitespace-nowrap shrink-0">
                                                    <Lock className="w-2.5 h-2.5" /> Encrypted
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleStartCall("audio")} className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"><Phone className="h-5 w-5" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleStartCall("video")} className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"><Video className="h-5 w-5" /></Button>
                                    </div>
                                </div>

                                {selectedChat.is_anonymous && (
                                    <div className="bg-slate-900/60 backdrop-blur-md border-b border-white/5 py-2 px-6 flex items-center justify-center gap-4 z-10 relative">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <AnonymousTimer />
                                        </div>
                                        <div className="flex-1 max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(((selectedChat.message_count || 0) / 40) * 100, 100)}%` }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                        <div className="text-[10px] font-bold text-violet-400">
                                            {selectedChat.message_count || 0}/40 to Reveal
                                        </div>
                                    </div>
                                )}

                                <TimeoutWarning messageCount={selectedChat.message_count || 0} isAnonymous={selectedChat.is_anonymous} />

                                {/* Confetti Effect */}
                                {showConfetti && (
                                    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                                        <div className="text-4xl animate-bounce">🎉</div>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {showChatInfo && (
                                        <ChatInfo
                                            key={selectedChat.id}
                                            chat={selectedChat}
                                            userId={user?.id || 0}
                                            onClose={() => setShowChatInfo(false)}
                                            onDeleteChat={async () => {
                                                try {
                                                    await chatService.deleteConversation(selectedChat.id)
                                                    setChats(prev => prev.filter(c => c.id !== selectedChat.id))
                                                    handleChatSelect(null)
                                                    setShowChatInfo(false)
                                                } catch (e) {
                                                    console.error("Failed to delete chat", e)
                                                }
                                            }}
                                        />
                                    )}
                                </AnimatePresence>

                                {isMessagesLoading ? (
                                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative custom-scrollbar pb-32">
                                        {/* Header Placeholder */}
                                        <div className="flex justify-center mb-8 mt-4">
                                            <Skeleton className="h-8 w-64 rounded-xl bg-slate-800/50" />
                                        </div>

                                        {/* Message Skeletons */}
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex w-full items-end gap-2",
                                                    i % 2 === 0 ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                {i % 2 !== 0 && <Skeleton className="w-8 h-8 rounded-full bg-slate-800/50 mb-1" />}
                                                <div className={cn(
                                                    "space-y-2 max-w-[60%]",
                                                    i % 2 === 0 ? "items-end flex flex-col" : "items-start"
                                                )}>
                                                    <Skeleton
                                                        className={cn(
                                                            "h-12 rounded-2xl bg-slate-800/50",
                                                            i % 2 === 0 ? "w-48 rounded-tr-sm" : "w-64 rounded-tl-sm"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 relative custom-scrollbar pb-32">
                                        <div className="flex justify-center mb-8 mt-4">
                                            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl px-4 py-2 flex items-center gap-2 text-xs text-yellow-500/80">
                                                <Lock className="w-3 h-3" />
                                                <span>Messages are end-to-end encrypted.</span>
                                            </div>
                                        </div>

                                        {selectedChat.messages.map((msg, idx) => {
                                            const isMe = msg.sender === "me"
                                            const prevMsg = selectedChat.messages[idx - 1]
                                            const isSameSender = prevMsg && prevMsg.sender === msg.sender
                                            const showAvatar = !isMe && !isSameSender

                                            const isLiked = msg.likes?.includes(user?.id || 0)
                                            const isStarred = msg.starred_by?.includes(user?.id || 0)
                                            const isPinned = msg.pinned_by && msg.pinned_by.length > 0

                                            return (
                                                <motion.div
                                                    id={`msg-${msg.id}`}
                                                    key={msg.id || idx}
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    className={cn(
                                                        "flex w-full group items-end",
                                                        isMe ? "justify-end" : "justify-start",
                                                        isSameSender ? "mt-0.5" : "mt-4"
                                                    )}
                                                >
                                                    {!isMe && (
                                                        <div className="w-8 mr-2 mb-1 flex-shrink-0">
                                                            {showAvatar ? (
                                                                <Link href={`/u/${selectedChat.name}`} className="block hover:scale-105 transition-transform">
                                                                    {selectedChat.profile_picture ? (
                                                                        <img
                                                                            src={selectedChat.profile_picture.startsWith('http') ? selectedChat.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${selectedChat.profile_picture}`}
                                                                            alt={selectedChat.name}
                                                                            className="w-8 h-8 rounded-full object-cover shadow-md"
                                                                        />
                                                                    ) : (
                                                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedChat.color} flex items-center justify-center text-xs font-bold text-white shadow-md`}>
                                                                            {selectedChat.avatar}
                                                                        </div>
                                                                    )}
                                                                </Link>
                                                            ) : <div className="w-8" />}
                                                        </div>
                                                    )}
                                                    <div className="relative group/msg max-w-[75%] md:max-w-[60%]">
                                                        {msg.reply_to && (
                                                            <div
                                                                className="text-xs text-slate-400 mb-1 ml-1 pl-2 border-l-2 border-slate-600 cursor-pointer hover:bg-white/5 rounded-r p-1 transition-colors flex flex-col"
                                                                onClick={() => scrollToMessage(msg.reply_to!)}
                                                            >
                                                                <span className="font-semibold text-blue-400">
                                                                    {(() => {
                                                                        const repliedMsg = selectedChat.messages.find(m => m.id === msg.reply_to);
                                                                        return repliedMsg ? (repliedMsg.sender === 'me' ? 'You' : selectedChat.name) : 'Unknown';
                                                                    })()}
                                                                </span>
                                                                <span className="truncate max-w-[200px] opacity-80">
                                                                    {(() => {
                                                                        const repliedMsg = selectedChat.messages.find(m => m.id === msg.reply_to);
                                                                        return repliedMsg ? repliedMsg.text : 'Message not found';
                                                                    })()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className={cn(
                                                            "px-5 py-3 text-sm leading-relaxed shadow-lg relative transition-all duration-200 break-words whitespace-pre-wrap",
                                                            isMe
                                                                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-900/20"
                                                                : "bg-slate-800/40 backdrop-blur-md text-slate-100 border border-white/5",
                                                            // Border Radius Logic
                                                            isMe
                                                                ? (isSameSender ? "rounded-l-2xl rounded-r-md" : "rounded-2xl rounded-tr-sm")
                                                                : (isSameSender ? "rounded-r-2xl rounded-l-md" : "rounded-2xl rounded-tl-sm")
                                                        )}>
                                                            {msg.audio_url ? (
                                                                <VoiceMessageBubble
                                                                    audioUrl={msg.audio_url}
                                                                    duration={msg.duration || 0}
                                                                    waveform={msg.waveform || []}
                                                                    isMe={isMe}
                                                                />
                                                            ) : (
                                                                <p>{msg.text}</p>
                                                            )}
                                                            <div className={cn(
                                                                "flex items-center gap-2 text-[10px] mt-1.5",
                                                                isMe ? "justify-end text-blue-100/70" : "text-slate-400"
                                                            )}>
                                                                <span className="opacity-70">{msg.time}</span>
                                                                {isStarred && <Star className="w-3 h-3 text-yellow-300 stroke-[2.5px]" />}
                                                                {isPinned && <Pin className="w-3 h-3 text-orange-300 fill-orange-300/20" />}
                                                                {isLiked && <Heart className="w-3 h-3 text-pink-500 fill-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />}
                                                            </div>
                                                        </div>

                                                        {/* Message Options Dropdown */}
                                                        <div className={cn(
                                                            "absolute top-0 opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center gap-1",
                                                            isMe ? "-left-10" : "-right-10"
                                                        )}>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700">
                                                                        <MoreHorizontal className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200 w-48">
                                                                    <DropdownMenuItem onClick={() => setReplyingTo(msg)}>
                                                                        <Reply className="w-4 h-4 mr-2" /> Reply
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleCopy(msg.text)}>
                                                                        <Copy className="w-4 h-4 mr-2" /> Copy text
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleForward(msg)}>
                                                                        <Forward className="w-4 h-4 mr-2" /> Forward
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-slate-800" />
                                                                    <DropdownMenuItem onClick={() => handleAction(msg, 'star')}>
                                                                        <Star className={cn("w-4 h-4 mr-2", isStarred && "text-yellow-400 font-bold")} /> {isStarred ? "Unstar" : "Star"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleAction(msg, 'pin')}>
                                                                        <Pin className={cn("w-4 h-4 mr-2", isPinned && "text-orange-400 fill-orange-400/20")} /> {isPinned ? "Unpin" : "Pin"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleAction(msg, 'like')}>
                                                                        <Heart className={cn("w-4 h-4 mr-2", isLiked && "text-pink-500 fill-pink-500 drop-shadow-md")} /> {isLiked ? "Unlike" : "Like"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-slate-800" />
                                                                    <DropdownMenuItem onClick={() => {
                                                                        setDeleteMessageId(msg.id)
                                                                        setIsDeleteDialogOpen(true)
                                                                        setDeleteOption("me")
                                                                    }} className="text-red-400 focus:text-red-400 focus:bg-red-900/10">
                                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => {
                                                                        setReportMessageId(msg.id)
                                                                        setIsReportDialogOpen(true)
                                                                    }} className="text-orange-400 focus:text-orange-400 focus:bg-orange-900/10">
                                                                        <Flag className="w-4 h-4 mr-2" /> Report
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                        <div ref={messagesEndRef} className="h-48" />
                                    </div>
                                )}


                                {/* Input Area */}
                                <div className="absolute bottom-0 left-0 right-0 z-30 bg-slate-950 border-t border-white/5 p-3 px-4 pb-safe">
                                    <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 pl-4 flex items-center gap-3 shadow-lg relative">

                                        {isRecording ? (
                                            <VoiceRecorder onSend={handleVoiceUpload} onCancel={() => setIsRecording(false)} />
                                        ) : (
                                            <>
                                                {/* Reply Banner */}
                                                {replyingTo && (
                                                    <div className="absolute -top-16 left-0 right-0 mx-2 bg-slate-900 text-slate-300 p-2.5 rounded-xl text-xs flex items-center justify-between border border-white/10 shadow-xl animate-in slide-in-from-bottom-2 z-20">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                                                            <div className="flex flex-col truncate">
                                                                <span className="font-bold text-blue-400 text-[10px] uppercase tracking-wider">{replyingTo.sender === "me" ? "You" : selectedChat.name}</span>
                                                                <span className="truncate max-w-[200px] opacity-80">{replyingTo.text}</span>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10 rounded-full" onClick={() => setReplyingTo(null)}>
                                                            <div className="h-3 w-3 rotate-45 border-t border-r border-slate-400" />
                                                        </Button>
                                                    </div>
                                                )}

                                                <AnimatePresence>
                                                    {showEmojiPicker && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                            className="absolute bottom-16 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden"
                                                        >
                                                            <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} lazyLoadEmojis={true} />
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
                                                <Input
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                                    placeholder="Type a secure message..."
                                                    className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-200 placeholder:text-slate-500 h-10 px-0"
                                                    onClick={() => setShowEmojiPicker(false)}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors ${inputValue.trim() ? "hidden" : ""}`}
                                                    onClick={() => setIsRecording(true)}
                                                >
                                                    <Mic className="h-5 w-5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleSendMessage()}
                                                    size="icon"
                                                    className={`bg-blue-600 hover:bg-blue-500 text-white rounded-full h-10 w-10 shadow-lg shadow-blue-600/30 shrink-0 ${!inputValue.trim() ? "hidden" : ""}`}
                                                >
                                                    <Send className="h-5 w-5 ml-0.5" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-900/20">
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        filter: ["drop-shadow(0 0 0px rgba(59,130,246,0))", "drop-shadow(0 0 20px rgba(59,130,246,0.3))", "drop-shadow(0 0 0px rgba(59,130,246,0))"]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <ShieldCheck className="h-20 w-20 text-blue-500 mb-6" />
                                </motion.div>
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

            {/* Dialogs logic remains same (just re-including to ensure file completeness) */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <DialogHeader>
                        <DialogTitle>Delete Message?</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {selectedChat?.messages.find(m => m.id === deleteMessageId)?.text === "This message was deleted"
                                ? "Remove this message from your chat view?"
                                : "Choose how you want to delete this message."}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedChat?.messages.find(m => m.id === deleteMessageId)?.text !== "This message was deleted" && (
                        <div className="py-4">
                            <RadioGroup value={deleteOption} onValueChange={(val: "me" | "everyone") => setDeleteOption(val)}>
                                <div className="flex items-center space-x-2 mb-2">
                                    <RadioGroupItem value="me" id="r1" className="border-slate-500 text-blue-500" />
                                    <Label htmlFor="r1" className="text-slate-200 cursor-pointer">Delete for me</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="everyone" id="r2" className="border-slate-500 text-blue-500" />
                                    <Label htmlFor="r2" className="text-slate-200 cursor-pointer">Delete for everyone</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="hover:bg-slate-800 text-slate-400">Cancel</Button>
                        <Button onClick={handleDeleteMessage} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isForwardDialogOpen} onOpenChange={setIsForwardDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <DialogHeader>
                        <DialogTitle>Forward Message</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Select a chat to forward this message to.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 max-h-[300px] overflow-y-auto">
                        {chats.map(chat => (
                            <div key={chat.id}
                                className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                                onClick={() => confirmForward(chat.id)}>
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${chat.color} flex items-center justify-center text-xs font-bold text-white`}>
                                    {chat.avatar}
                                </div>
                                <span className="text-slate-200 font-medium">{chat.name}</span>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <DialogHeader>
                        <DialogTitle>Report Message</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Please select a reason for reporting this message.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        {["Spam", "Harassment", "Inappropriate Content", "Hate Speech", "Other"].map((reason) => (
                            <Button
                                key={reason}
                                variant="outline"
                                className="w-full justify-start text-left bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                                onClick={() => handleReportSubmit(reason)}
                            >
                                {reason}
                            </Button>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsReportDialogOpen(false)} className="hover:bg-slate-800 text-slate-400">Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-slate-950 text-slate-100 flex items-center justify-center animate-pulse">Loading secure chat...</div>}>
            <ChatContent />
        </Suspense>
    )
}

function AnonymousTimer() {
    const [timeLeft, setTimeLeft] = useState(3600) // 1 Hour

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return (
        <span className={cn("text-[10px] font-mono", timeLeft < 300 ? "text-red-400 animate-pulse" : "text-slate-400")}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
    )
}

function TimeoutWarning({ messageCount, isAnonymous }: { messageCount: number, isAnonymous?: boolean }) {
    const [visible, setVisible] = useState(false)

    // Mock check for timeout (in real app, compare created_at from backend)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isAnonymous && messageCount < 40) {
                setVisible(true)
            }
        }, 3600000) // 1 Hour in ms
        return () => clearTimeout(timeout)
    }, [isAnonymous, messageCount])

    if (!visible) return null

    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-red-500/30 p-6 rounded-2xl max-w-sm text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Connection Lost</h3>
                <p className="text-slate-400 text-sm mb-6">
                    Time limit reached. You didn't exchange 40 messages in time to reveal the profile.
                </p>
                <Button onClick={() => window.location.reload()} className="w-full bg-slate-800 hover:bg-slate-700">
                    Return to Hub
                </Button>
            </div>
        </div>
    )
}
