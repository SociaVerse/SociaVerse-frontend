"use client"

import { motion } from "framer-motion"
import {
    X, User, Phone, Video, Shield, ShieldAlert, Bell, LogOut,
    Image as ImageIcon, FileText, Star, ChevronRight, Lock,
    MoreVertical, Flag, Ban, Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
// We'll define types here or import if needed to avoid circular dep issues with page.tsx
// But simpler to just redefine minimal interface for props
interface Message {
    id: string
    text: string
    time: string
    sender: "me" | "them"
    likes?: number[]
    starred_by?: number[]
    pinned_by?: number[]
}

interface Chat {
    id: number
    name: string
    otherUserId: number
    avatar: string
    profile_picture?: string | null
    color: string
    isBlocked?: boolean
    messages: Message[]
}

interface ChatInfoProps {
    chat: Chat
    userId: number
    onClose: () => void
    onDeleteChat: () => void
}

import { chatService } from "@/services/chat"

export function ChatInfo({ chat, userId, onClose, onDeleteChat }: ChatInfoProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    const [isBlocked, setIsBlocked] = useState(chat.isBlocked || false)

    const handleMute = async () => {
        try {
            const res = await chatService.muteConversation(chat.id)
            setIsMuted(res.is_muted)
        } catch (e: any) {
            console.error("Failed to mute", e)
            alert(e.message || "Failed to mute conversation")
        }
    }

    const handleBlock = async () => {
        try {
            await chatService.blockUser(chat.otherUserId)
            setIsBlocked(true)
            setIsBlockDialogOpen(false)
            // Ideally we should close ChatInfo or redirect, but for now just close dialog
            onClose()
        } catch (e: any) {
            console.error("Failed to block", e)
            alert(e.message || "Failed to block user. You cannot block yourself.")
        }
    }

    const handleUnblock = async () => {
        try {
            await chatService.unblockUser(chat.otherUserId)
            setIsBlocked(false)
            alert("User unblocked successfully.")
        } catch (e: any) {
            console.error("Failed to unblock", e)
            alert(e.message || "Failed to unblock user.")
        }
    }



    const handleReport = async (reason: string) => {
        try {
            await chatService.reportUser(chat.otherUserId, reason)
            setIsReportDialogOpen(false)
            alert("User reported successfully.")
        } catch (e: any) {
            console.error("Failed to report", e)
            alert(e.message || "Failed to report user.")
        }
    }

    // Filter content
    const mediaMessages = chat.messages.filter(m => m.text.match(/\.(jpeg|jpg|gif|png)$/) != null || m.text.includes("image"))
    const starredMessages = chat.messages.filter(m => m.starred_by?.includes(userId))
    const linkMessages = chat.messages.filter(m => m.text.match(/https?:\/\//))

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl border-l border-white/5 flex flex-col"
        >
            {/* Header */}
            <div className="p-4 flex items-center gap-4 border-b border-white/5 bg-slate-900/40">
                <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </Button>
                <h2 className="text-lg font-semibold text-slate-200">Contact Info</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-6 flex flex-col items-center text-center">
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${chat.color} flex items-center justify-center mb-4 shadow-2xl`}>
                        {chat.profile_picture ? (
                            <img src={chat.profile_picture} alt={chat.name} className="w-full h-full object-cover rounded-3xl" />
                        ) : (
                            <span className="text-3xl font-bold text-white">{chat.avatar}</span>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{chat.name}</h3>
                    <p className="text-slate-500 text-sm mb-6">@{chat.name.toLowerCase().replace(/\s/g, '')}</p>

                    <div className="flex gap-4 w-full justify-center mb-8">
                        <div className="flex flex-col items-center gap-2">
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                                <Phone className="w-5 h-5" />
                            </Button>
                            <span className="text-xs text-slate-400">Audio</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                                <Video className="w-5 h-5" />
                            </Button>
                            <span className="text-xs text-slate-400">Video</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                                <Shield className="w-5 h-5" />
                            </Button>
                            <span className="text-xs text-slate-400">Verify</span>
                        </div>
                    </div>

                    <div className="w-full text-left space-y-6">
                        <Tabs defaultValue="media" className="w-full">
                            <TabsList className="w-full bg-slate-900/50 p-1 h-10 rounded-xl border border-white/5 mb-4 grid grid-cols-3">
                                <TabsTrigger value="media" className="rounded-lg data-[state=active]:bg-slate-800 text-xs">Media</TabsTrigger>
                                <TabsTrigger value="starred" className="rounded-lg data-[state=active]:bg-slate-800 text-xs">Starred</TabsTrigger>
                                <TabsTrigger value="docs" className="rounded-lg data-[state=active]:bg-slate-800 text-xs">Links & Docs</TabsTrigger>
                            </TabsList>

                            <TabsContent value="media" className="mt-0">
                                {mediaMessages.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {mediaMessages.map(m => (
                                            <div key={m.id} className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-white/5">
                                                <ImageIcon className="text-slate-600" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-slate-500 text-sm border-2 border-dashed border-white/5 rounded-xl">
                                        No media shared
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="starred" className="mt-0 space-y-2">
                                {starredMessages.length > 0 ? (
                                    starredMessages.map(m => (
                                        <div key={m.id} className="bg-slate-900/50 p-3 rounded-xl border border-white/5 text-sm text-slate-300">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] text-slate-500">{m.time}</span>
                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            </div>
                                            {m.text}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-slate-500 text-sm border-2 border-dashed border-white/5 rounded-xl">
                                        No starred messages
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="docs" className="mt-0 space-y-2">
                                {linkMessages.length > 0 ? (
                                    linkMessages.map(m => (
                                        <div key={m.id} className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-slate-300 truncate">{m.text}</p>
                                                <p className="text-[10px] text-slate-500">{m.sender === "me" ? "You" : chat.name} • {m.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-slate-500 text-sm border-2 border-dashed border-white/5 rounded-xl">
                                        No links or docs
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>

                        {/* Actions */}
                        <div className="space-y-2 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group" onClick={handleMute}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                                        <Bell className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">Mute Notifications</span>
                                </div>
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isMuted ? "bg-blue-600" : "bg-slate-700"}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isMuted ? "translate-x-4" : "translate-x-0"}`} />
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                className="w-full justify-start p-3 h-auto hover:bg-orange-500/10 hover:text-orange-400 text-slate-400 gap-3 rounded-xl"
                                onClick={() => setIsReportDialogOpen(true)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-inherit">
                                    <Flag className="w-4 h-4" />
                                </div>
                                Report {chat.name}
                            </Button>

                            {isBlocked ? (
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start p-3 h-auto hover:bg-green-500/10 hover:text-green-400 text-slate-400 gap-3 rounded-xl"
                                    onClick={handleUnblock}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-inherit">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    Unblock {chat.name}
                                </Button>
                            ) : (
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start p-3 h-auto hover:bg-red-500/10 hover:text-red-400 text-slate-400 gap-3 rounded-xl"
                                    onClick={() => setIsBlockDialogOpen(true)}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-inherit">
                                        <Ban className="w-4 h-4" />
                                    </div>
                                    Block {chat.name}
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                className="w-full justify-start p-3 h-auto hover:bg-red-500/10 hover:text-red-400 text-slate-400 gap-3 rounded-xl"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-inherit">
                                    <Trash2 className="w-4 h-4" />
                                </div>
                                Delete Chat
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <DialogHeader>
                        <DialogTitle>Delete Conversation?</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            This will remove the conversation for you. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="hover:bg-slate-800 text-slate-400">Cancel</Button>
                        <Button onClick={onDeleteChat} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <DialogHeader>
                        <DialogTitle>Block {chat.name}?</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            They wont be able to message you or see your profile.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsBlockDialogOpen(false)} className="hover:bg-slate-800 text-slate-400">Cancel</Button>
                        <Button onClick={handleBlock} className="bg-red-600 hover:bg-red-700 text-white">Block</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <DialogHeader>
                        <DialogTitle>Report {chat.name}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Select a reason for reporting this user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        {["Spam", "Harassment", "Fake Account", "Other"].map((reason) => (
                            <Button
                                key={reason}
                                variant="outline"
                                className="w-full justify-start text-left bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                                onClick={() => handleReport(reason)}
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
        </motion.div>
    )
}
