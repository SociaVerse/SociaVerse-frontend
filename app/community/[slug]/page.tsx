"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Users, Lock, Shield, Globe, Hash, Calendar, Trophy, BookOpen, Crown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface CommunityDetails {
    id: number
    title: string
    description: string
    slug: string
    category: string
    image: string | null
    primary_color: string
    members_count: number
    join_status: 'joined' | 'pending' | 'not_joined'
    is_admin: boolean
    is_moderator: boolean
    privacy_type: 'public' | 'restricted' | 'private'
    college_name: string | null
    engagement_score: number
    rules: string | null
    created_at: string
}

interface Channel {
    id: number
    name: string
    type: 'public' | 'restricted' | 'private'
}

interface Member {
    id: number
    user_id: number
    username: string
    first_name: string
    last_name: string
    is_admin: boolean
    is_moderator: boolean
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function CommunityOverviewPage() {
    const params = useParams()
    const slug = params.slug as string
    const [community, setCommunity] = useState<CommunityDetails | null>(null)
    const [channels, setChannels] = useState<Channel[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("sociaverse_token")
        const headers = { 'Authorization': `Token ${token}` }

        const fetchAll = async () => {
            try {
                const [commRes, chanRes, memRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/channels/`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${slug}/members/`, { headers }),
                ])
                if (commRes.ok) setCommunity(await commRes.json())
                if (chanRes.ok) setChannels(await chanRes.json())
                if (memRes.ok) {
                    const data = await memRes.json()
                    setMembers((data.results ?? data).slice(0, 12))
                }
            } catch { /* ignore */ } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [slug])

    if (loading) return <CommunitySkeleton />

    if (!community) return (
        <div className="flex-1 flex items-center justify-center text-slate-500">Community not found.</div>
    )

    const privacyConfig = {
        private: { icon: Lock, label: 'College Private', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
        restricted: { icon: Shield, label: 'Restricted', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
        public: { icon: Globe, label: 'Public', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    }
    const privacy = privacyConfig[community.privacy_type]
    const PrivacyIcon = privacy.icon
    const joinedAt = new Date(community.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-y-auto p-6 md:p-8 pb-24 md:pb-8 scrollbar-hide"
        >
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Hero Banner */}
                <motion.div
                    variants={item}
                    className="relative rounded-3xl overflow-hidden border border-white/10"
                    style={{ background: `linear-gradient(135deg, ${community.primary_color}20, ${community.primary_color}05)` }}
                >
                    {community.image && (
                        <div className="absolute inset-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={community.image} alt={community.title} className="w-full h-full object-cover opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" />
                        </div>
                    )}
                    <div className="relative z-10 p-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden"
                                style={{ background: `${community.primary_color}30` }}
                            >
                                {community.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={community.image} alt="" className="w-full h-full object-cover" />
                                ) : '🏘️'}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{community.title}</h1>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${privacy.color}`}>
                                        <PrivacyIcon className="w-3 h-3" />
                                        {privacy.label}
                                    </span>
                                    {community.college_name && (
                                        <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full border border-white/5">
                                            {community.college_name}
                                        </span>
                                    )}
                                    <span className="text-xs text-slate-500">Created {joinedAt}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-300 leading-relaxed max-w-2xl mb-6">{community.description}</p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4">
                            <StatCard icon={Users} label="Members" value={community.members_count} />
                            <StatCard icon={Hash} label="Channels" value={channels.length} />
                            <StatCard icon={Trophy} label="Engagement" value={Math.round(community.engagement_score)} />
                        </div>
                    </div>
                </motion.div>

                {/* Rules */}
                {community.rules && (
                    <motion.div
                        variants={item}
                        className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
                    >
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-400" /> Community Rules
                        </h2>
                        <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                            {community.rules}
                        </div>
                    </motion.div>
                )}

                {/* Channels */}
                <motion.div
                    variants={item}
                    className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Hash className="w-5 h-5 text-blue-400" /> Channels
                    </h2>
                    {channels.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {channels.map(ch => (
                                <Link
                                    key={ch.id}
                                    href={`/community/${slug}/chat/${ch.id}`}
                                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/50 border border-white/5 hover:border-blue-500/30 hover:bg-slate-950 transition-all group"
                                >
                                    <Hash className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                    <span className="text-sm text-slate-300 truncate group-hover:text-white transition-colors">{ch.name}</span>
                                    {ch.type !== 'public' && (
                                        <Lock className="w-3 h-3 text-slate-600 ml-auto" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-slate-950/30 rounded-xl border border-dashed border-white/5">
                            <p className="text-slate-500 text-sm">No channels found in this community.</p>
                        </div>
                    )}
                </motion.div>

                {/* Members */}
                {members.length > 0 && (
                    <motion.div
                        variants={item}
                        className="bg-slate-900/60 border border-white/5 rounded-2xl p-6"
                    >
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" /> Members ({community.members_count})
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {members.map(m => (
                                <Link
                                    key={m.id}
                                    href={`/u/${m.username}`}
                                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/50 border border-white/5 hover:border-blue-500/30 hover:bg-slate-900 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                                        {(m.first_name?.[0] || m.username?.[0] || '?').toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-slate-200 truncate font-medium group-hover:text-white transition-colors">
                                            {m.first_name || m.username}
                                        </p>
                                        {m.is_admin && (
                                            <span className="text-[10px] text-blue-400 flex items-center gap-0.5">
                                                <Crown className="w-2.5 h-2.5" /> Admin
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {community.members_count > 12 && (
                            <p className="text-xs text-slate-500 mt-3 text-center">+{community.members_count - 12} more members</p>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

function CommunitySkeleton() {
    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="h-[280px] w-full rounded-3xl bg-slate-900/50 border border-white/5 p-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-full max-w-md" />
                    <Skeleton className="h-4 w-full max-w-sm" />
                    <div className="flex gap-4 pt-4">
                        <Skeleton className="h-16 w-32 rounded-xl" />
                        <Skeleton className="h-16 w-32 rounded-xl" />
                        <Skeleton className="h-16 w-32 rounded-xl" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-12 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: number }) {
    return (
        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-300" />
            </div>
            <div>
                <p className="text-lg font-bold text-white leading-none">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
            </div>
        </div>
    )
}
