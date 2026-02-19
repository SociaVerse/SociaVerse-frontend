"use client"

import { useAuth } from "@/components/auth-provider"
import { LandingPage } from "@/components/landing-page"
import { HomeFeed } from "@/components/home-feed"
import { useEffect, useState } from "react"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <HomeFeed />
  }

  return <LandingPage />
}
