"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Hash, MoreVertical, Lock, Volume2, Loader2, Smile } from "lucide-react"
import { useToast } from "@/components/ui/custom-toast"
import { motion, AnimatePresence } from "framer-motion"
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"

interface Message {
    id: number
    content: string
    sender_username: string
    sender_avatar: string
    created_at: string
    is_me: boolean // Helper
}

interface Channel {
    id: number
    name: string
    type: 'public' | 'restricted' | 'private'
    description?: string
}

export default function ChatPage() {
    const params = useParams()
    const channelId = params.channelId as string
    const { user } = useAuth()
    const { toast } = useToast()
    const [messages, setMessages] = useState<Message[]>([])
    const [channel, setChannel] = useState<Channel | null>(null)
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Fetch Channel Details
    useEffect(() => {
        const fetchChannelDetails = async () => {
            try {
                const token = localStorage.getItem("sociaverse_token")
                const response = await fetch(`http://127.0.0.1:8000/api/communities/channels/${channelId}/`, {
                    headers: { 'Authorization': `Token ${token}` }
                })
                if (response.ok) {
                    const data = await response.json()
                    setChannel(data)
                }
            } catch (error) {
                console.error("Failed to fetch channel details", error)
            }
        }
        fetchChannelDetails()
    }, [channelId])

    // Poll for messages
    useEffect(() => {
        fetchMessages()
        const interval = setInterval(fetchMessages, 3000) // Poll every 3s
        return () => clearInterval(interval)
    }, [channelId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`http://127.0.0.1:8000/api/communities/channels/${channelId}/messages/`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setMessages(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`http://127.0.0.1:8000/api/communities/channels/${channelId}/messages/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ content: newMessage })
            })

            if (response.ok) {
                setNewMessage("")
                fetchMessages() // Update immediately
                setShowEmojiPicker(false)
            } else {
                toast({ title: "Error", type: "error", message: "Failed to send message." })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji)
    }

    return (
        <div className="flex flex-col h-full bg-slate-950/30">
            {/* Header */}
            <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/5 shadow-inner">
                        {channel?.type === 'private' ? <Lock className="w-5 h-5 text-slate-400" /> :
                            channel?.type === 'restricted' ? <Volume2 className="w-5 h-5 text-slate-400" /> :
                                <Hash className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-lg flex items-center gap-2">
                            {channel ? channel.name : <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />}
                            {channel?.type !== 'public' && (
                                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                                    {channel?.type}
                                </span>
                            )}
                        </h1>
                        <p className="text-xs text-slate-500">
                            Welcome to the beginning of the <span className="text-slate-300 font-medium">#{channel?.name || "..."}</span> channel.
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full">
                    <MoreVertical className="w-5 h-5" />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
                {isLoading && messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-slate-500 text-sm">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50"
                    >
                        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/5">
                            <Hash className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">No messages yet</h3>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm">
                            This is the start of the <span className="font-mono text-slate-400">#{channel?.name}</span> channel. Be the first to say hello!
                        </p>
                    </motion.div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = user?.username === msg.sender_username
                        const showAvatar = !isMe && (i === 0 || messages[i - 1].sender_username !== msg.sender_username)

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start items-end'} group`}
                            >
                                {!isMe && (
                                    <div className="w-8 h-8 mr-3 flex-shrink-0">
                                        {showAvatar ? (
                                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-900 bg-slate-800">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={msg.sender_avatar} alt={msg.sender_username} className="w-full h-full object-cover" />
                                            </div>
                                        ) : <div className="w-8" />}
                                    </div>
                                )}

                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                    {!isMe && showAvatar && (
                                        <div className="flex items-center space-x-2 mb-1 ml-1">
                                            <span className="text-xs font-bold text-slate-300 shadow-sm">{msg.sender_username}</span>
                                            <span className="text-[10px] text-slate-500">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    )}

                                    <div
                                        className={`px-4 py-2.5 shadow-sm text-sm leading-relaxed relative ${isMe
                                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm"
                                            : "bg-slate-800/80 backdrop-blur-sm border border-white/5 text-slate-200 rounded-2xl rounded-tl-sm hover:bg-slate-800 transition-colors"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>

                                    {isMe && (
                                        <span className="text-[10px] text-slate-600 mt-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 pb-6 pt-2 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                <div className="relative max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 flex items-end gap-2 ring-1 ring-white/5 focus-within:ring-blue-500/30 transition-shadow">
                    <div className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-xl h-10 w-10 transition-colors"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <Smile className="w-5 h-5" />
                        </Button>
                        <AnimatePresence>
                            {showEmojiPicker && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="absolute bottom-14 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/10"
                                >
                                    <EmojiPicker
                                        theme={Theme.DARK}
                                        onEmojiClick={onEmojiClick}
                                        lazyLoadEmojis={true}
                                        searchPlaceholder="Search emojis..."
                                        width={320}
                                        height={400}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <form onSubmit={handleSendMessage} className="flex-1 flex gap-2 items-center">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message #${channel ? channel.name : '...'}`}
                            className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-slate-500 py-6 text-base"
                        />
                        <Button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-10 w-10 p-0 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
