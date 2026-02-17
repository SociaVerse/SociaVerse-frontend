"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, ArrowLeft, MoreVertical, Shield, Lock, Ghost } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DemoChatProps {
    onExit: () => void
}

type Message = {
    id: string
    text: string
    sender: "me" | "them"
    time: string
}

export function DemoChat({ onExit }: DemoChatProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Initial greeting
    useEffect(() => {
        const initialTimer = setTimeout(() => {
            setIsTyping(true)
            setTimeout(() => {
                addMessage("them", "Hey there! 👋 Welcome to SociaLink.")
                setIsTyping(false)
            }, 1500)
        }, 500)

        return () => clearTimeout(initialTimer)
    }, [])

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping])

    const addMessage = (sender: "me" | "them", text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            sender,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, newMessage])
    }

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim()) return

        const userText = inputValue
        addMessage("me", userText)
        setInputValue("")

        // Simulated bot response
        setIsTyping(true)
        setTimeout(() => {
            const botResponse = getBotResponse(userText)
            addMessage("them", botResponse)
            setIsTyping(false)
        }, 1500 + Math.random() * 1000)
    }

    const getBotResponse = (text: string): string => {
        const lower = text.toLowerCase()
        if (lower.includes("hi") || lower.includes("hello")) return "Hi! How's your day going?"
        if (lower.includes("how are you")) return "I'm just a demo bot 🤖, but I'm doing great! You?"
        if (lower.includes("cool") || lower.includes("awesome")) return "I know, right? SociaVerse is pretty neat."
        if (lower.includes("name")) return "I'm Anonymous... just like you 😉"
        if (lower.includes("bye")) return "See ya! Don't forget to sign up for the real thing."
        return "That's interesting! Tell me more."
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md h-[600px] bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onExit} className="text-slate-400 hover:text-white rounded-full h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <Ghost className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-slate-900 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Anonymous User</h3>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                            <Shield className="w-3 h-3" />
                            Encrypted Connection
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/30">
                <div className="text-center my-4">
                    <span className="text-[10px] bg-slate-800/50 text-slate-400 px-3 py-1 rounded-full border border-white/5">
                        Start of Demo Conversation
                    </span>
                </div>

                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex w-full",
                            msg.sender === "me" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={cn(
                            "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm relative",
                            msg.sender === "me"
                                ? "bg-violet-600 text-white rounded-tr-sm"
                                : "bg-slate-800 text-slate-100 rounded-tl-sm border border-white/5"
                        )}>
                            {msg.text}
                            <div className={cn(
                                "text-[10px] mt-1 opacity-70 flex justify-end",
                                msg.sender === "me" ? "text-violet-200" : "text-slate-400"
                            )}>
                                {msg.time}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center h-10 w-16 justify-center">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/80 backdrop-blur-md border-t border-white/5 flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-violet-500/50"
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim()}
                    className="bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>

            <div className="absolute top-0 right-0 m-2 mt-[60px] z-10">
                <div className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-500 font-mono uppercase tracking-widest">
                    Demo Mode
                </div>
            </div>
        </motion.div>
    )
}
