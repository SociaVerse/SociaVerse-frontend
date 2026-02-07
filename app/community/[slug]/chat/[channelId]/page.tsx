"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Hash, MoreVertical } from "lucide-react"
import { useToast } from "@/components/ui/custom-toast"

interface Message {
    id: number
    content: string
    sender_username: string
    sender_avatar: string
    created_at: string
    is_me: boolean // Helper
}

export default function ChatPage() {
    const params = useParams()
    const channelId = params.channelId as string
    const { user } = useAuth()
    const { toast } = useToast()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

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
                // Process to add is_me flag if needed, though we can check against user object
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
            } else {
                toast({ title: "Error", type: "error", message: "Failed to send message." })
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-14 border-b border-white/5 flex items-center px-4 justify-between bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center">
                    <Hash className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="font-bold text-white">Channel {channelId}</span>
                    {/* Ideally fetch channel name here too or pass from layout context */}
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <MoreVertical className="w-5 h-5" />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading && messages.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">
                        <p>No messages yet.</p>
                        <p className="text-sm">Be the first to say hello!</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = user?.username === msg.sender_username
                        // Note: user object from useAuth might differ in structure, checking username is safe

                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group hover:bg-white/[0.02] p-1 rounded-xl -mx-2 px-2 transition-colors`}>
                                {!isMe && (
                                    <div className="w-8 h-8 rounded-full bg-slate-700 mr-3 flex-shrink-0 overflow-hidden">
                                        <img src={msg.sender_avatar} alt={msg.sender_username} />
                                    </div>
                                )}
                                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                    {!isMe && (
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="text-xs font-bold text-slate-300">{msg.sender_username}</span>
                                            <span className="text-[10px] text-slate-500">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    )}
                                    <div className={`px-4 py-2 rounded-2xl text-sm ${isMe
                                            ? "bg-blue-600 text-white rounded-tr-sm"
                                            : "bg-slate-800 text-slate-200 rounded-tl-sm"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message #${channelId}`}
                        className="bg-slate-950 border-white/10 text-white focus-visible:ring-blue-500/50"
                    />
                    <Button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-500 text-white">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
