
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/custom-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Settings, Lock, Trash2, Mail, Loader2 } from "lucide-react"

export default function AccountSettingsPage() {
    const { user, isAuthenticated, logout } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Password Form State
    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    })

    const [username, setUsername] = useState("")

    useEffect(() => {
        if (user?.username) {
            setUsername(user.username)
        }
    }, [user])

    const handleUpdateUsername = async () => {
        if (!username || username === user?.username) return

        setIsLoading(true)
        try {
            const token = localStorage.getItem('sociaverse_token')
            const formData = new FormData()
            formData.append('username', username)

            const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
                method: 'PATCH',
                headers: { 'Authorization': `Token ${token}` },
                body: formData
            })

            if (response.ok) {
                toast({ title: "Success", message: "Username updated successfully", type: "success" })
                // Force reload to update context or just let user know
                setTimeout(() => window.location.reload(), 1000)
            } else {
                const data = await response.json()
                toast({ title: "Error", message: data.username?.[0] || "Failed to update username", type: "error" })
            }
        } catch (error) {
            toast({ title: "Error", message: "Network error", type: "error" })
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value })
    }

    const handleSubmitPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwords.new_password !== passwords.confirm_password) {
            toast({ title: "Error", message: "New passwords do not match", type: "error" })
            return
        }
        if (passwords.new_password.length < 6) {
            toast({ title: "Error", message: "Password must be at least 6 characters", type: "error" })
            return
        }

        setIsLoading(true)
        try {
            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch('http://127.0.0.1:8000/api/users/change-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    old_password: passwords.old_password,
                    new_password: passwords.new_password
                })
            })

            const data = await response.json()

            if (response.ok) {
                toast({ title: "Success", message: "Password updated successfully", type: "success" })
                setPasswords({ old_password: "", new_password: "", confirm_password: "" })
            } else {
                toast({ title: "Error", message: data.error || "Failed to change password", type: "error" })
            }
        } catch (error) {
            toast({ title: "Error", message: "Network error", type: "error" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        try {
            const token = localStorage.getItem('sociaverse_token')
            const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` }
            })

            if (response.ok) {
                toast({ title: "Account Deleted", message: "Your account has been permanently deleted.", type: "success" })
                logout()
                router.push('/')
            } else {
                toast({ title: "Error", message: "Failed to delete account", type: "error" })
            }
        } catch (error) {
            toast({ title: "Error", message: "Network error", type: "error" })
        } finally {
            setIsDeleting(false)
        }
    }

    if (!user) return null

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
            <div className="border-b border-slate-800 pb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-500" /> Account Settings
                </h1>
                <p className="text-slate-400 mt-1">Manage your login security and account preference.</p>
            </div>

            {/* Username Section */}
            <div className="p-6 bg-slate-900/30 rounded-xl border border-slate-800/50 space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-slate-400" /> Username
                </h3>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-slate-950/50 border-slate-800"
                            placeholder="username"
                        />
                    </div>
                    <Button
                        onClick={handleUpdateUsername}
                        disabled={isLoading || username === user?.username}
                        className="bg-slate-800 hover:bg-slate-700 text-white"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                </div>
                <p className="text-xs text-slate-500">
                    SociaVerse account URL: sociaverse.com/{username}
                </p>
            </div>

            {/* Email Section (Read Only) */}
            <div className="p-6 bg-slate-900/30 rounded-xl border border-slate-800/50 space-y-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-slate-400" /> Email Address
                </h3>
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-slate-300">
                    {user.email}
                </div>
                <p className="text-xs text-slate-500">Your email address is used for login and notifications. It cannot be changed currently.</p>
            </div>

            {/* Change Password Form */}
            <div className="p-6 bg-slate-900/30 rounded-xl border border-slate-800/50 space-y-6">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-slate-400" /> Change Password
                </h3>

                <form onSubmit={handleSubmitPassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="old_password">Current Password</Label>
                        <Input
                            id="old_password"
                            name="old_password"
                            type="password"
                            placeholder="••••••••"
                            value={passwords.old_password}
                            onChange={handlePasswordChange}
                            className="bg-slate-950/50 border-slate-800 focus:border-blue-500/50"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <Input
                                id="new_password"
                                name="new_password"
                                type="password"
                                placeholder="••••••••"
                                value={passwords.new_password}
                                onChange={handlePasswordChange}
                                className="bg-slate-950/50 border-slate-800 focus:border-blue-500/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm New Password</Label>
                            <Input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                placeholder="••••••••"
                                value={passwords.confirm_password}
                                onChange={handlePasswordChange}
                                className="bg-slate-950/50 border-slate-800 focus:border-blue-500/50"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[120px]">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Update Password"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Delete Account Section */}
            <div className="p-6 bg-red-900/10 rounded-xl border border-red-900/20 space-y-4 mt-12">
                <h3 className="text-lg font-medium text-red-400 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" /> Delete Account
                </h3>
                <p className="text-sm text-red-200/70">
                    Once you delete your account, there is no going back. Please be certain.
                </p>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50">
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-950 border-slate-800 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-white">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">
                                {isDeleting ? "Deleting..." : "Yes, delete account"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
