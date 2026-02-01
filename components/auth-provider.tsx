"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check local storage on mount
        const storedAuth = localStorage.getItem("sociaverse_auth")
        if (storedAuth === "true") {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [])

    const login = () => {
        localStorage.setItem("sociaverse_auth", "true")
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem("sociaverse_auth")
        setIsAuthenticated(false)
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
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
