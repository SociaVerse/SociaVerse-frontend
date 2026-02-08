"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/custom-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2, UserPlus, Check, X, Bell } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Notification {
    id: number
    sender: {
        id: number
        username: string
        first_name: string
        last_name: string
        profile_picture: string | null
        is_verified: boolean
    }
    notification_type: 'follow_request' | 'new_follower' | 'like' | 'comment'
    post: number | null
    is_read: boolean
    created_at: string
    follow_status?: 'pending' | 'accepted' | 'none'
}

export default function NotificationsPage() {
    const { isAuthenticated } = useAuth()
    const { toast } = useToast()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState<number | null>(null)

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications()
        }
    }, [isAuthenticated])

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch('http://127.0.0.1:8000/api/notifications/', {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setNotifications(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRequest = async (notificationId: number, senderId: number, action: 'accept' | 'decline') => {
        setProcessingId(notificationId)
        try {
            const token = localStorage.getItem('sociaverse_token')
            // Using the ManageFollowRequestView endpoint: /api/users/requests/<user_id>/<action>/
            // user_id is the SENDER of the request
            const response = await fetch(`http://127.0.0.1:8000/api/users/requests/${senderId}/${action}/`, {
                method: 'POST',
                headers: { 'Authorization': `Token ${token}` }
            })

            if (response.ok) {
                toast({
                    title: action === 'accept' ? "Accepted" : "Declined",
                    message: `Follow request ${action}ed.`,
                    type: "success"
                })

                // Update local state
                setNotifications(prev => prev.map(n => {
                    if (n.sender.id === senderId && n.notification_type === 'follow_request') {
                        return { ...n, follow_status: action === 'accept' ? 'accepted' : 'none' } // If declined, row might disappear or show 'Declined'
                    }
                    return n
                }))

                // Also mark notification as read? 
                // Ideally backend does this, but we can do it manually or just refreshing list.
                // Let's mark as read
                await markAsRead(notificationId)

            } else {
                toast({ title: "Error", message: "Action failed", type: "error" })
            }
        } catch (error) {
            toast({ title: "Error", message: "Network error", type: "error" })
        } finally {
            setProcessingId(null)
        }
    }

    const markAsRead = async (id: number) => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            await fetch(`http://127.0.0.1:8000/api/notifications/${id}/read/`, {
                method: 'POST',
                headers: { 'Authorization': `Token ${token}` }
            })
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        } catch (e) { console.error(e) }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return `${diffInSeconds}s`
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
        return `${Math.floor(diffInSeconds / 86400)}d`
    }

    // Filter Logic
    const followRequests = notifications.filter(n => n.notification_type === 'follow_request' && n.follow_status === 'pending')
    const otherNotifications = notifications.filter(n => !(n.notification_type === 'follow_request' && n.follow_status === 'pending'))

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-blue-500" />
                    <h1 className="text-2xl font-bold text-white">Notifications</h1>
                </div>

                {/* Follow Requests Section */}
                {followRequests.length > 0 && (
                    <div className="space-y-4 animate-in slide-in-from-top duration-500">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">Follow Requests</h2>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
                            {followRequests.map(notification => (
                                <motion.div
                                    layout
                                    key={notification.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Link href={`/u/${notification.sender.username}`}>
                                            <Avatar className="w-10 h-10 border border-slate-700">
                                                <AvatarImage src={notification.sender.profile_picture ? (notification.sender.profile_picture.startsWith('http') ? notification.sender.profile_picture : `http://127.0.0.1:8000${notification.sender.profile_picture}`) : undefined} />
                                                <AvatarFallback>{notification.sender.username[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div>
                                            <div className="font-semibold text-white flex items-center gap-1">
                                                {notification.sender.first_name || notification.sender.username}
                                                {notification.sender.is_verified && <Check className="w-3 h-3 text-blue-500 bg-blue-500/10 rounded-full p-0.5" />}
                                            </div>
                                            <p className="text-sm text-slate-400">@{notification.sender.username} • {formatDate(notification.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleRequest(notification.id, notification.sender.id, 'accept')}
                                            disabled={processingId === notification.id}
                                            className="bg-blue-600 hover:bg-blue-500 text-white h-8 px-3"
                                        >
                                            {processingId === notification.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRequest(notification.id, notification.sender.id, 'decline')}
                                            disabled={processingId === notification.id}
                                            className="border-slate-700 hover:bg-slate-800 text-slate-400 h-8 px-3"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Other Notifications */}
                <div className="space-y-4">
                    {followRequests.length > 0 && <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">Earlier</h2>}

                    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
                        {otherNotifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No notifications yet.
                            </div>
                        ) : (
                            otherNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-4 flex items-start gap-4 hover:bg-slate-800/30 transition-colors ${!notification.is_read ? 'bg-blue-500/5' : ''}`}
                                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                                >
                                    <div className="mt-1">
                                        {notification.notification_type === 'new_follower' && <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500"><UserPlus className="w-4 h-4" /></div>}
                                        {notification.notification_type === 'follow_request' && <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300"><UserPlus className="w-4 h-4" /></div>}
                                        {/* Add icons for like/comment if needed */}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-slate-200 text-sm">
                                            <span className="font-semibold text-white">{notification.sender.first_name || notification.sender.username}</span>
                                            {" "}
                                            {notification.notification_type === 'follow_request' && "requested to follow you."}
                                            {notification.notification_type === 'new_follower' && "started following you."}
                                            {notification.notification_type === 'like' && "liked your post."}
                                            {notification.notification_type === 'comment' && "commented on your post."}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">{formatDate(notification.created_at)}</p>
                                    </div>
                                    {notification.notification_type === 'follow_request' && (
                                        <div className="text-xs font-medium px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                                            {notification.follow_status === 'accepted' ? 'Accepted' : 'Declined'}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
