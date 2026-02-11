"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
    MessageSquare,
    Hash,
    Volume2,
    Lock,
    Settings,
    Info,
    Calendar,
    HelpCircle,
    ChevronLeft,
    Plus,
    Trash2,
    Loader2,
    Users,
    Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useToast } from "@/components/ui/custom-toast"

interface Channel {
    id: number
    name: string
    type: 'public' | 'restricted' | 'private'
}

interface CommunityDetails {
    title: string
    primary_color: string
    is_admin: boolean
}

export default function CommunityLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const params = useParams()
    const slug = params.slug as string
    const pathname = usePathname()
    const router = useRouter()
    const { toast } = useToast()
    const [channels, setChannels] = useState<Channel[]>([])
    const [community, setCommunity] = useState<CommunityDetails | null>(null)
    const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)
    const [newChannelName, setNewChannelName] = useState("")
    const [newChannelType, setNewChannelType] = useState("public")
    const [isDeleting, setIsDeleting] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        fetchChannels()
        fetchCommunityDetails()
    }, [slug])

    const fetchCommunityDetails = async () => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`http://127.0.0.1:8000/api/communities/${slug}/`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setCommunity(data)
            }
        } catch (error) {
            console.error("Failed to fetch community details", error)
        }
    }

    const fetchChannels = async () => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`http://127.0.0.1:8000/api/communities/${slug}/channels/`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setChannels(data)
            }
        } catch (error) {
            console.error("Failed to fetch channels", error)
        }
    }

    const handleCreateChannel = async () => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`http://127.0.0.1:8000/api/communities/${slug}/channels/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    name: newChannelName,
                    type: newChannelType
                })
            })

            if (response.ok) {
                const newChannel = await response.json()
                setChannels([...channels, newChannel])
                setIsCreateChannelOpen(false)
                setNewChannelName("")
                setNewChannelType("public")
                toast({ title: "Success", type: "success", message: "Channel created!" })
            } else {
                toast({ title: "Error", type: "error", message: "Failed to create channel." })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", type: "error", message: "Something went wrong." })
        }
    }

    const handleDeleteCommunity = async () => {
        setIsDeleting(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`http://127.0.0.1:8000/api/communities/${slug}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            if (response.ok) {
                toast({ title: "Deleted", type: "success", message: "Community deleted successfully." })
                router.push("/community")
            } else {
                toast({ title: "Error", type: "error", message: "Failed to delete community." })
            }
        } catch (error) {
            console.error("Failed to delete community", error)
            toast({ title: "Error", type: "error", message: "Something went wrong." })
        } finally {
            setIsDeleting(false)
        }
    }

    const primaryColor = community?.primary_color || '#3b82f6' // Default blue

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h2 className="font-bold truncate max-w-[150px]" style={{ color: community?.primary_color }}>
                        {community?.title || "Community"}
                    </h2>
                    <Link href="/community" className="text-xs text-slate-500 hover:text-slate-300 flex items-center mt-1">
                        <ChevronLeft className="w-3 h-3 mr-1" /> Back
                    </Link>

                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-3 space-y-6">

                {/* General */}
                <div>
                    <div className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        General
                    </div>
                    <div className="space-y-1">
                        <NavItem href={`/community/${slug}`} icon={Info} label="Overview" active={pathname === `/community/${slug}`} primaryColor={primaryColor} onClick={() => setIsMobileMenuOpen(false)} />
                        <NavItem href={`/community/${slug}/events`} icon={Calendar} label="Events & Announcements" active={pathname.includes('/events')} primaryColor={primaryColor} onClick={() => setIsMobileMenuOpen(false)} />
                        <NavItem href={`/community/${slug}/support`} icon={HelpCircle} label="Help & Support" active={pathname.includes('/support')} primaryColor={primaryColor} onClick={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>

                {/* Chatrooms */}
                <div>
                    <div className="px-2 mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>Chatrooms</span>
                        <Dialog open={isCreateChannelOpen} onOpenChange={setIsCreateChannelOpen}>
                            <DialogTrigger asChild>
                                <button className="hover:text-white transition-colors">
                                    <Plus className="w-3 h-3" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-white/10 text-white">
                                <DialogHeader>
                                    <DialogTitle>Create Channel</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={newChannelName}
                                            onChange={(e) => setNewChannelName(e.target.value)}
                                            className="bg-slate-950 border-white/10"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Type</Label>
                                        <Select value={newChannelType} onValueChange={setNewChannelType}>
                                            <SelectTrigger className="bg-slate-950 border-white/10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="restricted">Restricted (Mods only)</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateChannel} className="bg-blue-600 hover:bg-blue-500 text-white">Create</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="space-y-1">
                        {channels.map(channel => (
                            <NavItem
                                key={channel.id}
                                href={`/community/${slug}/chat/${channel.id}`}
                                icon={channel.type === 'restricted' ? Volume2 : channel.type === 'private' ? Lock : Hash}
                                label={channel.name}
                                active={pathname === `/community/${slug}/chat/${channel.id}`}
                                primaryColor={primaryColor}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                        ))}
                        {channels.length === 0 && (
                            <div className="px-2 text-xs text-slate-600 italic">No channels yet</div>
                        )}
                    </div>
                </div>

                {community?.is_admin && (
                    <div className="pt-4 border-t border-white/5 mt-4">
                        <div className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Admin Zone
                        </div>
                        <ManageMembersDialog slug={slug} />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-2 text-xs">
                                    <Trash2 className="w-3 h-3 mr-2" /> Delete Community
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-400">
                                        This action cannot be undone. This will permanently delete the community
                                        <span className="font-bold text-white"> {community.title} </span>
                                        and all its channels and messages.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteCommunity} className="bg-red-600 text-white hover:bg-red-700">
                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Community"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}

            </div>
        </div>
    )

    return (
        <div className="flex bg-slate-950 text-white overflow-hidden h-[calc(100vh-5rem)] md:h-[calc(100vh-4rem)] pt-4">

            {/* Mobile Header Trigger */}
            <div className="md:hidden absolute top-4 left-4 z-50">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-slate-900/50 backdrop-blur-md border-white/10 text-white h-10 w-10 rounded-full shadow-lg">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72 bg-slate-900 border-r border-white/5 text-slate-200">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside
                className="hidden md:flex w-64 bg-slate-900 border-r border-white/5 flex-col transition-colors duration-500"
                style={{
                    borderRightColor: community?.primary_color ? `${community.primary_color}20` : undefined,
                    backgroundColor: community?.primary_color ? `${community.primary_color}05` : undefined
                }}
            >
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main
                className="flex-1 flex flex-col bg-slate-950/50 backdrop-blur-sm overflow-hidden relative transition-colors duration-500"
                style={{
                    boxShadow: community?.primary_color ? `inset 0 0 100px -50px ${community.primary_color}20` : undefined
                }}
            >
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, icon: Icon, label, active, primaryColor, onClick }: { href: string, icon: any, label: string, active: boolean, primaryColor: string, onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center px-2 py-1.5 rounded-lg text-sm font-medium transition-all ${active
                ? "bg-white/10"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
            style={active ? { color: primaryColor, backgroundColor: `${primaryColor}15` } : {}}
        >
            <Icon className="w-4 h-4 mr-2 opacity-70" />
            <span className="truncate">{label}</span>
        </Link>
    )
}

function ManageMembersDialog({ slug }: { slug: string }) {
    const [members, setMembers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const fetchMembers = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`http://127.0.0.1:8000/api/communities/${slug}/members/`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setMembers(data)
            }
        } catch (error) {
            console.error("Failed to fetch members", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePromote = async (userId: number) => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`http://127.0.0.1:8000/api/communities/${slug}/promote/${userId}/`, {
                method: 'POST',
                headers: { 'Authorization': `Token ${token}` }
            })

            if (response.ok) {
                toast({ title: "Success", type: "success", message: "Member promoted to admin." })
                fetchMembers() // Refresh list
            } else {
                toast({ title: "Error", type: "error", message: "Failed to promote member." })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", type: "error", message: "Something went wrong." })
        }
    }

    return (
        <Dialog onOpenChange={(open) => { if (open) fetchMembers() }}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 h-8 px-2 text-xs mb-1">
                    <Users className="w-3 h-3 mr-2" /> Manage Members
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Manage Members</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Promote members to admin status.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto space-y-4 py-4">
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
                        </div>
                    ) : members.length === 0 ? (
                        <p className="text-center text-slate-500 text-sm">No members found.</p>
                    ) : (
                        members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-white/5">
                                <div>
                                    <p className="font-medium text-sm">{member.user.first_name} {member.user.last_name}</p>
                                    <p className="text-xs text-slate-500">{member.user.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {member.is_admin ? (
                                        <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">
                                            Admin
                                        </span>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs border-slate-700 hover:bg-slate-800"
                                            onClick={() => handlePromote(member.user.id)}
                                        >
                                            Promote
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
