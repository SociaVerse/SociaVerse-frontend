"use client"

import { useState, useEffect, createContext, useContext } from "react"
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
    Menu,
    Edit2,
    ShieldOff,
    UserX
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

// Context so child pages (chat, etc.) can open the sidebar Sheet on mobile
export const CommunitySidebarContext = createContext<{
    openSidebar: () => void
}>({ openSidebar: () => { } })

export function useCommunitySidebar() {
    return useContext(CommunitySidebarContext)
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
    const [isDeleting, setIsDeleting] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [pendingCount, setPendingCount] = useState(0)

    useEffect(() => {
        fetchChannels()
        fetchCommunityDetails()
    }, [slug])

    // Pre-load pending count for badge (#21)
    useEffect(() => {
        if (!community?.is_admin) return
        const fetchCount = async () => {
            try {
                const token = localStorage.getItem("sociaverse_token")
                const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/pending-count/`, {
                    headers: { 'Authorization': `Token ${token}` }
                })
                if (r.ok) {
                    const data = await r.json()
                    setPendingCount(data.count)
                }
            } catch { /* ignore */ }
        }
        fetchCount()
    }, [slug, community?.is_admin])

    const fetchCommunityDetails = async () => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/`, {
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/channels/`, {
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

    const handleCreateChannel = async (name: string, type: string, onSuccess: () => void) => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/channels/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ name, type })
            })

            if (response.ok) {
                const newChannel = await response.json()
                setChannels(prev => [...prev, newChannel])
                onSuccess()
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/`, {
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
                        {/* CreateChannelButton is a module-level component — avoids re-mount on parent re-render */}
                        <CreateChannelButton onCreated={handleCreateChannel} />
                    </div>
                    <div className="space-y-1">
                        {channels.map(channel => (
                            <ChannelNavItem
                                key={channel.id}
                                channel={channel}
                                slug={slug}
                                pathname={pathname}
                                primaryColor={primaryColor}
                                isAdmin={!!community?.is_admin}
                                onDelete={(id) => setChannels(prev => prev.filter(c => c.id !== id))}
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
                        <PendingRequestsDialog
                            slug={slug}
                            initialCount={pendingCount}
                            onCountChange={setPendingCount}
                        />
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
        <div
            // Navbar is fixed, top-4 (16px) + h-16 (64px) = 80px from top.
            // Use mt-20 + h-[calc(100vh-5rem)] so content always starts below the navbar.
            className="flex bg-slate-950 text-white overflow-hidden mt-20 h-[calc(100vh-5rem)]"
            style={community?.primary_color ? ({
                '--primary': community.primary_color,
                '--ring': community.primary_color,
                '--sidebar-primary': community.primary_color,
                '--sidebar-ring': community.primary_color,
                '--sidebar-accent-foreground': community.primary_color,
            } as React.CSSProperties) : {}}
        >

            <CommunitySidebarContext.Provider value={{ openSidebar: () => setIsMobileMenuOpen(true) }}>
                {/* Mobile Sheet — opened via context or sticky header button */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetContent side="left" className="p-0 w-[80vw] max-w-xs bg-slate-900/80 backdrop-blur-xl border-r border-white/5 text-slate-200">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>

                {/* Desktop Sidebar */}
                <aside
                    className="hidden md:flex w-64 bg-slate-900/40 backdrop-blur-md border-r border-white/5 flex-col transition-colors duration-500"
                    style={{
                        borderRightColor: community?.primary_color ? `${community.primary_color}20` : undefined,
                        backgroundColor: community?.primary_color ? `${community.primary_color}08` : undefined
                    }}
                >
                    <SidebarContent />
                </aside>

                {/* Main Content */}
                <main
                    className="flex-1 flex flex-col bg-slate-950/20 backdrop-blur-sm overflow-hidden relative transition-colors duration-500"
                    style={{
                        boxShadow: community?.primary_color ? `inset 0 0 160px -80px ${community.primary_color}25` : undefined
                    }}
                >
                    {/* Mobile sticky top bar — always visible on mobile across all community sub-pages */}
                    <div className="md:hidden flex items-center h-12 px-2 gap-2 border-b border-white/5 bg-slate-950/90 backdrop-blur-md shrink-0 z-10">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                            aria-label="Open channel list"
                        >
                            <Menu className="w-5 h-5" />
                            <span className="text-xs font-medium">Channels</span>
                        </button>
                        <div className="flex-1" />
                        <Link
                            href="/community"
                            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors flex-shrink-0 text-xs"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Communities</span>
                        </Link>
                    </div>
                    {children}
                </main>
            </CommunitySidebarContext.Provider>
        </div>
    )
}

function CreateChannelButton({ onCreated }: {
    onCreated: (name: string, type: string, onSuccess: () => void) => void
}) {
    // All state lives HERE, not in parent — prevents parent re-render from unmounting the input
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [type, setType] = useState("public")

    const handleSubmit = () => {
        if (!name.trim()) return
        onCreated(name.trim(), type, () => {
            setOpen(false)
            setName("")
            setType("public")
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="hover:text-white transition-colors" title="Create channel">
                    <Plus className="w-3 h-3" />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Create Channel</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="channel-name">Name</Label>
                        <Input
                            id="channel-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className="bg-slate-950 border-white/10"
                            placeholder="e.g. general"
                            maxLength={100}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="bg-slate-950 border-white/10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                <SelectItem value="public">🌐 Public — everyone can read &amp; post</SelectItem>
                                <SelectItem value="restricted">🔊 Restricted — admins/mods post only</SelectItem>
                                <SelectItem value="private">🔒 Private — invite only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)} className="text-slate-400">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        Create Channel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function NavItem({ href, icon: Icon, label, active, primaryColor, onClick }: { href: string, icon: any, label: string, active: boolean, primaryColor: string, onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${active
                ? "bg-white/10 shadow-[0_0_20px_-5px_var(--primary-half)]"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
            style={active ? {
                color: primaryColor,
                backgroundColor: `${primaryColor}20`,
                '--primary-half': `${primaryColor}80`
            } as any : {}}
        >
            <Icon className={`w-4 h-4 mr-2.5 transition-colors ${active ? "opacity-100" : "opacity-50"}`} />
            <span className="truncate">{label}</span>
        </Link>
    )
}

// #14 — channel nav item with optional delete button for admins
function ChannelNavItem({
    channel,
    slug,
    pathname,
    primaryColor,
    isAdmin,
    onDelete,
    onClick,
}: {
    channel: Channel
    slug: string
    pathname: string
    primaryColor: string
    isAdmin: boolean
    onDelete: (id: number) => void
    onClick?: () => void
}) {
    const { toast } = useToast()
    const [deleting, setDeleting] = useState(false)
    const href = `/community/${slug}/chat/${channel.id}`
    const active = pathname === href
    const Icon = channel.type === 'restricted' ? Volume2 : channel.type === 'private' ? Lock : Hash

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDeleting(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/channels/${channel.id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` }
            })
            if (r.ok) {
                onDelete(channel.id)
                toast({ title: "Deleted", type: "success", message: `#${channel.name} deleted.` })
            } else {
                toast({ title: "Error", type: "error", message: "Failed to delete channel." })
            }
        } catch {
            toast({ title: "Error", type: "error", message: "Something went wrong." })
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="group flex items-center rounded-lg overflow-hidden">
            <Link
                href={href}
                onClick={onClick}
                className={`flex-1 flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 rounded-xl ${active
                    ? "bg-white/10 shadow-[0_0_20px_-5px_var(--primary-half)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                style={active ? {
                    color: primaryColor,
                    backgroundColor: `${primaryColor}20`,
                    '--primary-half': `${primaryColor}80`
                } as any : {}}
            >
                <Icon className={`w-4 h-4 mr-2.5 transition-colors flex-shrink-0 ${active ? "opacity-100" : "opacity-50"}`} />
                <span className="truncate">{channel.name}</span>
            </Link>
            {isAdmin && (
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-md mr-1 flex-shrink-0"
                    title="Delete channel"
                >
                    {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </button>
            )}
        </div>
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
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/members/`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (r.ok) {
                const data = await r.json()
                setMembers(data.results ?? data)
            }
        } catch { /* ignore */ } finally {
            setIsLoading(false)
        }
    }

    const doAction = async (url: string, method = 'POST', successMsg: string) => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const r = await fetch(url, { method, headers: { 'Authorization': `Token ${token}` } })
            if (r.ok) {
                toast({ title: "Success", type: "success", message: successMsg })
                fetchMembers()
            } else {
                const err = await r.json().catch(() => ({}))
                toast({ title: "Error", type: "error", message: err.error || "Action failed." })
            }
        } catch {
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
                    <DialogDescription className="text-slate-400">Promote, demote, or kick members.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[320px] overflow-y-auto space-y-3 py-4">
                    {isLoading ? (
                        <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></div>
                    ) : members.length === 0 ? (
                        <p className="text-center text-slate-500 text-sm">No members found.</p>
                    ) : (
                        members.map((m) => (
                            <div key={m.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-white/5">
                                <div>
                                    <p className="font-medium text-sm">{m.first_name || m.username}</p>
                                    <p className="text-xs text-slate-500">{m.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {m.is_admin ? (
                                        <>
                                            <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">Admin</span>
                                            {/* #19 demote */}
                                            <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-white"
                                                onClick={() => doAction(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/demote/${m.user_id}/`, 'POST', 'Demoted to member.')}>
                                                <ShieldOff className="w-3 h-3 mr-1" /> Demote
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700 hover:bg-slate-800"
                                                onClick={() => doAction(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/promote/${m.user_id}/`, 'POST', 'Promoted to admin.')}>
                                                Promote
                                            </Button>
                                            {/* #19 kick */}
                                            <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                                onClick={() => doAction(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/kick/${m.user_id}/`, 'POST', 'Member kicked.')}>
                                                <UserX className="w-3 h-3 mr-1" /> Kick
                                            </Button>
                                        </>
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

// #21 — accepts initialCount and onCountChange so badge shows before dialog is opened
function PendingRequestsDialog({ slug, initialCount, onCountChange }: { slug: string, initialCount: number, onCountChange: (n: number) => void }) {
    const [pending, setPending] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const fetchPending = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem("sociaverse_token")
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/pending/`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            if (r.ok) {
                const data = await r.json()
                setPending(data)
                onCountChange(data.length)
            }
        } catch { /* ignore */ } finally {
            setIsLoading(false)
        }
    }

    const handleAction = async (userId: number, action: 'approve' | 'reject') => {
        try {
            const token = localStorage.getItem("sociaverse_token")
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/pending/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
                body: JSON.stringify({ user_id: userId, action })
            })
            if (r.ok) {
                toast({ title: action === 'approve' ? "Approved!" : "Rejected", type: "success", message: action === 'approve' ? "Member approved." : "Request rejected." })
                const newPending = pending.filter(p => p.user_id !== userId)
                setPending(newPending)
                onCountChange(newPending.length)
            } else {
                toast({ title: "Error", type: "error", message: "Failed to process request." })
            }
        } catch {
            toast({ title: "Error", type: "error", message: "Something went wrong." })
        }
    }

    const badgeCount = isLoading ? initialCount : (pending.length || initialCount)

    return (
        <Dialog onOpenChange={(open) => { if (open) fetchPending() }}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 h-8 px-2 text-xs mb-1">
                    <Users className="w-3 h-3 mr-2" /> Join Requests
                    {badgeCount > 0 && (
                        <span className="ml-auto bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            {badgeCount}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Pending Join Requests</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Approve or reject membership requests.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[380px] overflow-y-auto space-y-3 py-4">
                    {isLoading ? (
                        <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></div>
                    ) : pending.length === 0 ? (
                        <p className="text-center text-slate-500 text-sm py-8">No pending requests 🎉</p>
                    ) : (
                        pending.map((req) => (
                            <div key={req.user_id} className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    {req.profile_picture ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={req.profile_picture} alt={req.username} className="w-9 h-9 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                                            {req.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-sm">{req.username}</p>
                                        {req.college && <p className="text-[10px] text-slate-500">{req.college}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3" onClick={() => handleAction(req.user_id, 'approve')}>Approve</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 px-3" onClick={() => handleAction(req.user_id, 'reject')}>Reject</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

