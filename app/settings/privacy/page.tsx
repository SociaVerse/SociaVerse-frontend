"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/custom-toast"
import { Loader2, Ban, EyeOff, UserX } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export default function PrivacySettingsPage() {
    const [blockedUsers, setBlockedUsers] = useState<any[]>([])
    const [restrictedUsers, setRestrictedUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        if (isAuthenticated) {
            fetchData()
        }
    }, [isAuthenticated])

    const fetchData = async () => {
        setIsLoading(true)
        const token = localStorage.getItem('sociaverse_token')
        const headers: HeadersInit = {}
        if (token) headers['Authorization'] = `Token ${token}`

        try {
            const [blockedRes, restrictedRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/blocked-users/`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/restricted-users/`, { headers })
            ])

            if (blockedRes.ok) setBlockedUsers(await blockedRes.json())
            if (restrictedRes.ok) setRestrictedUsers(await restrictedRes.json())

        } catch (error) {
            console.error("Error fetching privacy data", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUnblock = async (userId: number) => {
        const token = localStorage.getItem('sociaverse_token')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/block/${userId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                setBlockedUsers(prev => prev.filter(u => u.id !== userId))
                toast({ title: "Unblocked", message: "User has been unblocked.", type: "success" })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleUnrestrict = async (userId: number) => {
        const token = localStorage.getItem('sociaverse_token')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/restrict/${userId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                setRestrictedUsers(prev => prev.filter(u => u.id !== userId))
                toast({ title: "Unrestricted", message: "User has been unrestricted.", type: "success" })
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-white">Privacy & Safety</h3>
                <p className="text-sm text-slate-400">
                    Manage accounts that you have blocked or restricted.
                </p>
            </div>

            <Tabs defaultValue="blocked" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                    <TabsTrigger value="blocked">Blocked Accounts</TabsTrigger>
                    <TabsTrigger value="restricted">Restricted Accounts</TabsTrigger>
                </TabsList>

                <TabsContent value="blocked" className="mt-4 space-y-4">
                    <Card className="bg-slate-900 border-slate-800 text-slate-200">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Ban className="w-5 h-5 text-red-500" /> Blocked Users
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Users you block cannot see your profile, posts, or interact with you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {blockedUsers.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <UserX className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>You haven't blocked anyone yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {blockedUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.profile_picture ? (user.profile_picture.startsWith('http') ? user.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture}`) : `https://ui-avatars.com/api/?name=${user.username}`}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    alt=""
                                                />
                                                <div>
                                                    <p className="font-semibold text-white">{user.username}</p>
                                                    <p className="text-xs text-slate-400">{user.first_name} {user.last_name}</p>
                                                </div>
                                            </div>
                                            <Button variant="destructive" size="sm" onClick={() => handleUnblock(user.id)}>
                                                Unblock
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="restricted" className="mt-4 space-y-4">
                    <Card className="bg-slate-900 border-slate-800 text-slate-200">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <EyeOff className="w-5 h-5 text-orange-500" /> Restricted Accounts
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                You won't see notifications from restricted accounts, but they can still see your posts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {restrictedUsers.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <EyeOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>You haven't restricted anyone yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {restrictedUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.profile_picture ? (user.profile_picture.startsWith('http') ? user.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${user.profile_picture}`) : `https://ui-avatars.com/api/?name=${user.username}`}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    alt=""
                                                />
                                                <div>
                                                    <p className="font-semibold text-white">{user.username}</p>
                                                    <p className="text-xs text-slate-400">{user.first_name} {user.last_name}</p>
                                                </div>
                                            </div>
                                            <Button variant="secondary" size="sm" onClick={() => handleUnrestrict(user.id)}>
                                                Unrestrict
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
