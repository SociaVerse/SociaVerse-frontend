
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/custom-toast"
import { Shield, Lock, Users, Ban, Loader2 } from "lucide-react"

export default function PrivacySettingsPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [isPrivate, setIsPrivate] = useState(false)
    const [blockedUsers, setBlockedUsers] = useState<any[]>([])

    useEffect(() => {
        if (isAuthenticated) {
            fetchPrivacySettings()
        }
    }, [isAuthenticated])

    const fetchPrivacySettings = async () => {
        try {
            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setIsPrivate(data.is_private)
                // Assuming blocked_users comes as a list of objects or IDs. 
                // For now, let's mock the blocked users list or handle if backend returns it.
                // If backend returns IDs, we might need to fetch their details. 
                // For this implementation, we will assume empty list if not provided precisely.
                setBlockedUsers(data.blocked_users || [])
            }
        } catch (error) {
            console.error("Error fetching privacy settings:", error)
        } finally {
            setFetching(false)
        }
    }

    const handlePrivacyToggle = async (checked: boolean) => {
        setIsPrivate(checked) // Optimistic update
        try {
            const token = localStorage.getItem('sociaverse_token')
            const formData = new FormData()
            formData.append('is_private', checked.toString())

            const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
                method: 'PATCH',
                headers: { 'Authorization': `Token ${token}` },
                body: formData
            })

            if (!response.ok) {
                throw new Error("Failed to update")
            }
            toast({
                title: checked ? "Account Private" : "Account Public",
                message: checked ? "Only followers can see your posts." : "Anyone can see your posts.",
                type: "success"
            })
        } catch (error) {
            setIsPrivate(!checked) // Revert
            toast({ title: "Error", message: "Failed to update privacy settings", type: "error" })
        }
    }

    const MockBlockedUser = ({ name, refresh }: { name: string, refresh: () => void }) => (
        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                    <Ban className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-200">{name}</span>
            </div>
            <Button variant="outline" size="sm" className="text-xs border-slate-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50">
                Unblock
            </Button>
        </div>
    )

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="border-b border-slate-800 pb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-6 h-6 text-green-500" /> Privacy & Safety
                </h1>
                <p className="text-slate-400 mt-1">Manage who can see your content and interact with you.</p>
            </div>

            {/* Account Privacy */}
            <div className="p-6 bg-slate-900/30 rounded-xl border border-slate-800/50 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label className="text-lg font-medium text-white flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-400" /> Private Account
                        </Label>
                        <p className="text-sm text-slate-400 max-w-md">
                            When your account is private, only people you approve can see your photos and videos. Your existing followers won't be affected.
                        </p>
                    </div>
                    <Switch
                        checked={isPrivate}
                        onCheckedChange={handlePrivacyToggle}
                        className="data-[state=checked]:bg-blue-600"
                    />
                </div>
            </div>

            {/* Blocked Users */}
            <div className="p-6 bg-slate-900/30 rounded-xl border border-slate-800/50 space-y-6">
                <div>
                    <Label className="text-lg font-medium text-white flex items-center gap-2">
                        <Ban className="w-4 h-4 text-red-400" /> Blocked Users
                    </Label>
                    <p className="text-sm text-slate-400 mt-1">
                        They won't be able to find your profile, posts, or story on SociaVerse. SociaVerse won't let them know you blocked them.
                    </p>
                </div>

                <div className="space-y-3">
                    {blockedUsers.length > 0 ? (
                        blockedUsers.map((user: any) => (
                            <div key={user.id} className="text-slate-300">{user.username}</div>
                        ))
                    ) : (
                        // Mock Data for demonstration since we don't have real blocked flow yet
                        <>
                            <p className="text-sm text-slate-500 italic pb-2">No blocked users found.</p>
                            {/* Hidden mock for UI preview */}
                            {/* <MockBlockedUser name="@spammer123" refresh={() => {}} /> */}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
