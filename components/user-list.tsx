"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BadgeCheck } from "lucide-react"

interface User {
    id: number
    username: string
    first_name: string
    last_name: string
    profile_picture: string | null
    is_verified: boolean
    bio: string
}

interface UserListProps {
    endpoint: string
    emptyMessage?: string
}

export function UserList({ endpoint, emptyMessage = "No users found" }: UserListProps) {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('sociaverse_token')
                const headers: HeadersInit = {}
                if (token) headers['Authorization'] = `Token ${token}`

                const response = await fetch(endpoint, { headers })
                if (response.ok) {
                    const data = await response.json()
                    setUsers(data)
                }
            } catch (error) {
                console.error("Error fetching users:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    }, [endpoint])

    if (isLoading) {
        return <div className="text-center py-8 text-slate-500">Loading...</div>
    }

    if (users.length === 0) {
        return <div className="text-center py-8 text-slate-500">{emptyMessage}</div>
    }

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-800/50"
                >
                    <Link href={`/u/${user.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Avatar className="h-12 w-12 border border-slate-700">
                            <AvatarImage src={user.profile_picture || ""} className="object-cover" />
                            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-1">
                                <h4 className="font-semibold text-slate-200">
                                    {user.first_name} {user.last_name}
                                </h4>
                                {user.is_verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                            </div>
                            <p className="text-sm text-slate-500">@{user.username}</p>
                        </div>
                    </Link>
                    {/* Future: Add Follow/Unfollow button here */}
                </motion.div>
            ))}
        </div>
    )
}
