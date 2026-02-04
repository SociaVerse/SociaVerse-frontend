"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    college: string
}

interface AuthContextType {
    isAuthenticated: boolean
    user: User | null
    login: () => void
    logout: () => void
    isLoading: boolean
    checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const checkAuth = async () => {
        const token = localStorage.getItem("sociaverse_token")
        if (token) {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                })
                if (response.ok) {
                    const userData = await response.json()
                    setUser(userData)
                    setIsAuthenticated(true)
                } else {
                    // Token invalid or expired
                    localStorage.removeItem("sociaverse_token")
                    setIsAuthenticated(false)
                    setUser(null)
                }
            } catch (error) {
                console.error("Auth check failed:", error)
            }
        }
        setIsLoading(false)
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const login = () => {
        // localStorage.setItem("sociaverse_auth", "true") // Legacy
        // We assume token is set by the Login component before calling this
        checkAuth()
    }

    const logout = () => {
        localStorage.removeItem("sociaverse_token")
        localStorage.removeItem("sociaverse_auth")
        setIsAuthenticated(false)
        setUser(null)
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
