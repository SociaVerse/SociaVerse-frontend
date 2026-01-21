"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Phone, Video, MoreVertical, Send, Paperclip, Smile, ArrowLeft, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState<number | null>(null)

    const friends = [
        { id: 1, name: "Alex Rivera", status: "online", lastMessage: "Yo, did you finish the calc pset?", time: "2m", avatar: "A", color: "from-blue-500 to-cyan-500" },
        { id: 2, name: "Sarah Chen", status: "offline", lastMessage: "Sent a photo", time: "1h", avatar: "S", color: "from-purple-500 to-pink-500" },
        { id: 3, name: "Design Club", status: "online", lastMessage: "Meeting at 5pm today!", time: "3h", avatar: "D", color: "from-orange-500 to-red-500" },
        { id: 4, name: "Marcus Johnson", status: "online", lastMessage: "Let's hack this weekend 🚀", time: "5h", avatar: "M", color: "from-green-500 to-emerald-500" },
        { id: 5, name: "Priya Patel", status: "offline", lastMessage: "Thanks for the notes!", time: "1d", avatar: "P", color: "from-yellow-500 to-orange-500" },
    ]

    const messages = [
        { id: 1, sender: "them", text: "Yo, did you finish the calc pset?", time: "10:30 AM" },
        { id: 2, sender: "me", text: "Almost! Just stuck on the last problem.", time: "10:31 AM" },
        { id: 3, sender: "them", text: "Same here. It's brutal 💀", time: "10:32 AM" },
        { id: 4, sender: "me", text: "Wanna hop on a call and figure it out?", time: "10:32 AM" },
    ]

    return (
        <div className="h-screen bg-slate-950 text-slate-100 pt-20 pb-4 px-4 md:px-8 flex gap-6 overflow-hidden">

            {/* Friends Sidebar */}
            <div className={cn(
                "w-full md:w-1/3 lg:w-1/4 flex flex-col bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 overflow-hidden transition-all duration-300",
                selectedChat !== null ? "hidden md:flex" : "flex"
            )}>
                {/* Sidebar Header */}
                <div className="p-6 border-b border-slate-800/50">
                    <h1 className="text-2xl font-bold mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search friends..."
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Friends List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {friends.map((friend) => (
                        <motion.div
                            key={friend.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedChat(friend.id)}
                            className={cn(
                                "p-3 rounded-2xl cursor-pointer transition-colors flex items-center gap-4",
                                selectedChat === friend.id ? "bg-blue-600/10 border border-blue-500/20" : "hover:bg-slate-800/30 border border-transparent"
                            )}
                        >
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${friend.color} flex items-center justify-center text-lg font-bold`}>
                                    {friend.avatar}
                                </div>
                                {friend.status === "online" && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-semibold truncate">{friend.name}</h3>
                                    <span className="text-xs text-slate-500">{friend.time}</span>
                                </div>
                                <p className="text-sm text-slate-400 truncate">{friend.lastMessage}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className={cn(
                "flex-1 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 overflow-hidden flex-col transition-all duration-300",
                selectedChat !== null ? "flex" : "hidden md:flex"
            )}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/80">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedChat(null)}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${friends.find(f => f.id === selectedChat)?.color} flex items-center justify-center font-bold`}>
                                    {friends.find(f => f.id === selectedChat)?.avatar}
                                </div>
                                <div>
                                    <h2 className="font-bold">{friends.find(f => f.id === selectedChat)?.name}</h2>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-xs text-slate-400">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full">
                                    <Phone className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full">
                                    <Video className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/30">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full",
                                        msg.sender === "me" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "max-w-[70%] rounded-2xl px-5 py-3 text-sm leading-relaxed",
                                        msg.sender === "me"
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : "bg-slate-800 text-slate-200 rounded-tl-none"
                                    )}>
                                        <p>{msg.text}</p>
                                        <p className={cn("text-[10px] mt-1 opacity-70", msg.sender === "me" ? "text-blue-100" : "text-slate-400")}>
                                            {msg.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-900/80 border-t border-slate-800/50">
                            <div className="flex items-center gap-2 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-700/50">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-full h-8 w-8">
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-500"
                                />
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white rounded-full h-8 w-8">
                                    <Smile className="h-4 w-4" />
                                </Button>
                                <Button size="icon" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full h-8 w-8">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                        <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                            <Send className="h-10 w-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">Your Messages</h3>
                        <p className="max-w-xs">Select a chat to start messaging your friends or start a new conversation.</p>
                    </div>
                )}
            </div>

        </div>
    )
}
