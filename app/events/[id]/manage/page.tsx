"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Download, ShieldAlert, CheckCircle2, UserX, Clock, Settings, UserPlus, X, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/custom-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ManageEventPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user, isAuthenticated } = useAuth()
    const { toast } = useToast()

    const [event, setEvent] = useState<any>(null)
    const [registrations, setRegistrations] = useState<any[]>([])
    const [collaborators, setCollaborators] = useState<any[]>([])

    const [isLoading, setIsLoading] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const [collabUsername, setCollabUsername] = useState("")
    const [collabRole, setCollabRole] = useState("checkin_staff")
    const [isAddingCollab, setIsAddingCollab] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login")
            return
        }

        const fetchAll = async () => {
            setIsLoading(true)
            try {
                const token = localStorage.getItem("sociaverse_token")
                const headers = { "Authorization": `Token ${token}` }

                // Fetch Event
                const evRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/`, { headers })
                if (!evRes.ok) throw new Error("Event not found")
                setEvent(await evRes.json())

                // Fetch Registrations
                const regRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/manage/registrations/`, { headers })
                if (regRes.ok) setRegistrations(await regRes.json())

                // Fetch Collaborators
                const colRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/manage/collaborators/`, { headers })
                if (colRes.ok) setCollaborators(await colRes.json())

            } catch (error) {
                console.error(error)
                toast({ type: "error", title: "Wait a sec", message: "You don't have access to manage this event." })
                router.push(`/events/${id}`)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAll()
    }, [id, isAuthenticated, router, toast])

    const updateRegistrationStatus = async (regId: number, status: string) => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/manage/registrations/${regId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({ status })
            })

            if (response.ok) {
                setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status } : r))
                toast({ type: "success", title: "Status Updated", message: `Attendee is now ${status}` })
            } else {
                toast({ type: "error", title: "Failed", message: "Could not update status." })
            }
        } catch (e) {
            toast({ type: "error", title: "Error", message: "Network error." })
        }
    }

    const exportCSV = async () => {
        setIsExporting(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await window.fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/manage/export/`, {
                headers: { "Authorization": `Token ${token}` }
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `event_${id}_attendees.csv`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
                toast({ type: "success", title: "Exported", message: "CSV downloaded successfully." })
            } else {
                toast({ type: "error", title: "Failed", message: "Could not export data." })
            }
        } catch (e) {
            toast({ type: "error", title: "Error", message: "Network error." })
        } finally {
            setIsExporting(false)
        }
    }

    const addCollaborator = async () => {
        if (!collabUsername) return
        setIsAddingCollab(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/manage/collaborators/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({ username: collabUsername, role: collabRole })
            })

            if (response.ok) {
                const resData = await response.json()
                toast({ type: "success", title: "Added", message: "Team member updated." })
                setCollabUsername("")

                // Refresh collaborators
                const colRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/manage/collaborators/`, {
                    headers: { "Authorization": `Token ${token}` }
                })
                if (colRes.ok) setCollaborators(await colRes.json())
            } else {
                const errorData = await response.json()
                toast({ type: "error", title: "Failed", message: errorData.error || "Could not add member" })
            }
        } catch (e) {
            toast({ type: "error", title: "Error", message: "Network error." })
        } finally {
            setIsAddingCollab(false)
        }
    }

    const removeCollaborator = async (userId: number) => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/manage/collaborators/${userId}/`, {
                method: "DELETE",
                headers: { "Authorization": `Token ${token}` }
            })

            if (response.ok) {
                setCollaborators(prev => prev.filter(c => c.user !== userId))
                toast({ type: "success", title: "Removed", message: "Team member removed." })
            } else {
                toast({ type: "error", title: "Failed", message: "Could not remove member" })
            }
        } catch (e) {
            toast({ type: "error", title: "Error", message: "Network error." })
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (!event) return null

    const StatsCard = ({ title, value, icon: Icon, colorClass }: any) => (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <p className="text-slate-400 font-medium text-sm">{title}</p>
                <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Settings className="w-8 h-8 text-blue-500" />
                            Manage Event
                        </h1>
                        <p className="text-slate-400 mt-1">{event.title} Dashboard</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-slate-700 hover:bg-slate-800"
                            onClick={() => router.push(`/events/${id}`)}
                        >
                            View Public Page
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                            onClick={exportCSV}
                            disabled={isExporting}
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Registrations"
                        value={registrations.length}
                        icon={Users}
                        colorClass="bg-blue-500/20 text-blue-500"
                    />
                    <StatsCard
                        title="Approved"
                        value={registrations.filter(r => r.status === 'approved').length}
                        icon={CheckCircle2}
                        colorClass="bg-emerald-500/20 text-emerald-500"
                    />
                    <StatsCard
                        title="Pending"
                        value={registrations.filter(r => r.status === 'pending').length}
                        icon={Clock}
                        colorClass="bg-amber-500/20 text-amber-500"
                    />
                    <StatsCard
                        title="Waitlisted"
                        value={registrations.filter(r => r.status === 'waitlisted').length}
                        icon={ShieldAlert}
                        colorClass="bg-purple-500/20 text-purple-500"
                    />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="attendees" className="w-full">
                    <TabsList className="bg-slate-900 border border-slate-800 p-1 mb-6 rounded-xl w-full justify-start overflow-x-auto">
                        <TabsTrigger value="attendees" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6 py-2">Attendees</TabsTrigger>
                        <TabsTrigger value="team" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6 py-2">Organizing Team</TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6 py-2">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="attendees" className="space-y-6 animate-in fade-in duration-500">
                        {/* Attendee List */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                                <h3 className="font-semibold text-white">Guest List</h3>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <Input placeholder="Search attendees..." className="pl-9 bg-slate-950 border-slate-800 h-9 w-64 text-sm" />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-400">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-950 border-b border-slate-800">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Attendee</th>
                                            <th className="px-6 py-4 font-medium">Fields</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {registrations.map(reg => (
                                            <tr key={reg.id} className="hover:bg-slate-800/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden flex-shrink-0">
                                                            {reg.profile_picture ? (
                                                                <img src={reg.profile_picture.startsWith('http') ? reg.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${reg.profile_picture}`} className="w-full h-full object-cover" alt="" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-xs">{reg.user_name[0].toUpperCase()}</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-200">{reg.first_name || reg.user_name} {reg.last_name}</div>
                                                            <div className="text-xs text-slate-500">{reg.user_email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 max-w-xs truncate">
                                                    {Object.entries(reg.data).map(([k, v]: any) => (
                                                        <span key={k} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">
                                                            <span className="text-slate-500">{k}:</span> {v}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${reg.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            reg.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                reg.status === 'waitlisted' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                        }`}>
                                                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    {reg.status !== 'approved' && (
                                                        <Button size="sm" variant="ghost" onClick={() => updateRegistrationStatus(reg.id, 'approved')} className="h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">Approve</Button>
                                                    )}
                                                    {reg.status !== 'rejected' && (
                                                        <Button size="sm" variant="ghost" onClick={() => updateRegistrationStatus(reg.id, 'rejected')} className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">Reject</Button>
                                                    )}
                                                    {reg.status === 'pending' && (
                                                        <Button size="sm" variant="ghost" onClick={() => updateRegistrationStatus(reg.id, 'waitlisted')} className="h-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">Waitlist</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {registrations.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                    No registrations found yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="team" className="space-y-6 animate-in fade-in duration-500">
                        {/* Team Management */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 space-y-4">
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                        <UserPlus className="w-5 h-5 text-blue-500" />
                                        Add Member
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-4">Grant event access to other SociaVerse users.</p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-slate-300 mb-1 block">Username</label>
                                            <Input
                                                placeholder="e.g. johndoe"
                                                className="bg-slate-950 border-slate-800"
                                                value={collabUsername}
                                                onChange={(e) => setCollabUsername(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-300 mb-1 block">Role</label>
                                            <select
                                                className="w-full h-10 px-3 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={collabRole}
                                                onChange={(e) => setCollabRole(e.target.value)}
                                            >
                                                <option value="admin">Admin (Can edit event)</option>
                                                <option value="checkin_staff">Check-in Staff (Can only scan tickets)</option>
                                            </select>
                                        </div>
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-500"
                                            onClick={addCollaborator}
                                            disabled={isAddingCollab || !collabUsername}
                                        >
                                            {isAddingCollab ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Team"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                                        <h3 className="font-semibold text-white">Event Team</h3>
                                    </div>
                                    <div className="divide-y divide-slate-800/50">
                                        {/* Main Organizer */}
                                        <div className="p-4 flex items-center justify-between bg-slate-800/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">
                                                    {event.organizer_name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-200">{event.organizer_name} <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-2">Creator</span></div>
                                                    <div className="text-xs text-slate-500">Main Organizer</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Collaborators */}
                                        {collaborators.map(collab => (
                                            <div key={collab.id} className="p-4 flex items-center justify-between hover:bg-slate-800/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                                                        {collab.user_name[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-200">{collab.user_name}</div>
                                                        <div className="text-xs text-slate-500">{collab.role === 'admin' ? 'Event Admin' : 'Check-in Staff'}</div>
                                                    </div>
                                                </div>
                                                <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8" onClick={() => removeCollaborator(collab.user)}>
                                                    <UserX className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6 animate-in fade-in duration-500">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4">Registration Settings</h3>
                            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                                <Settings className="w-8 h-8 mb-2 opacity-50" />
                                <p>Form Builder & Settings coming soon.</p>
                                <p className="text-xs mt-1">Configure custom questions, waitlist limits, and permissions.</p>
                            </div>
                        </div>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    )
}
