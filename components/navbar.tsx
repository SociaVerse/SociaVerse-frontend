"use client"

import Link from "next/link"
import Image from "next/image"
import { Globe, Menu, Search, Bell, User, Sparkles, MessageCircle, UserPlus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const regularNavLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/events", label: "Events" },
  { href: "/explore", label: "Explore" },
  { href: "/community", label: "Community" },
]

const waitlistNavLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/team", label: "Team" },
  { href: "/join-waitlist", label: "Waitlist" },
]

import { usePathname } from "next/navigation"

export function Navbar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const isChatPage = pathname === "/chat" || pathname?.startsWith("/chat/")
  const isCreatePage = pathname === "/create"
  const isProfilePage = pathname === "/profile" || pathname?.startsWith("/u/")
  const isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';
  const navLinks = isWaitlistMode ? waitlistNavLinks : regularNavLinks;



  const handleLogout = () => {
    setShowLogoutConfirm(false)
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      setIsLoggingOut(false)
    }, 2000)
  }

  // Add scroll effect
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Animation entrance effect
  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (isCreatePage) return null

  return (
    <>
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950"
          >
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
              <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center z-10 relative"
            >
              <div className="mb-6 relative w-24 h-24 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full rounded-full border-t-4 border-r-4 border-blue-500 border-b-4 border-slate-800 border-l-4 border-slate-800"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">See you soon, {user?.first_name || user?.username}!</h2>
              <p className="text-slate-400">Logging out safely...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutConfirm(false)} className="bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">Log Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -20,
          transition: { duration: 0.5, ease: "easeOut" }
        }}
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[95%] rounded-full transition-all duration-300",
          scrolled
            ? "bg-slate-900/90 backdrop-blur-lg shadow-lg border border-slate-700/50 shadow-blue-500/10"
            : "bg-slate-900/70 backdrop-blur-md",
          isChatPage || isProfilePage ? "hidden md:block" : "" // Hide on mobile if on chat or profile page
        )}
      >
        <div className="px-6 flex h-16 items-center justify-between">

          {/* Brand/Logo */}
          <motion.div
            className="flex items-center"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-transparent border  shadow-md group-hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img
                  src="/logo.png"
                  alt="SociaVerse Logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.span
                className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                SociaVerse
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Nav Links (with glass effect) */}
          <motion.nav
            className="hidden md:flex items-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-full px-2 py-1 border border-slate-700/50 shadow-sm">
              <AnimatePresence>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
                  return (
                    <Button
                      key={link.href}
                      asChild
                      variant="ghost"
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                        isActive
                          ? "bg-slate-950 text-blue-400 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] scale-[0.96] border border-white/5"
                          : "text-slate-200 hover:bg-slate-700/50 hover:text-white"
                      )}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <Link href={link.href} className="flex items-center">
                        {hoveredLink === link.href && !isActive && (
                          <motion.span
                            layoutId="navbar-hover"
                            className="absolute inset-0 z-[-1] rounded-full bg-slate-700 shadow-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                        {link.label}
                      </Link>
                    </Button>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.nav>

          {/* Desktop Right Side */}
          <motion.div
            className="hidden md:flex items-center space-x-1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {!isWaitlistMode && (
              <>
                <Button variant="ghost" size="icon" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:scale-110 transition-all">
                  <Search className="h-5 w-5" />
                </Button>

                {/* SociaLink Entry Point */}
                <Button asChild variant="ghost" size="icon" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:text-violet-400 hover:scale-110 transition-all relative group">
                  <Link href="/socialink">
                    <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse"></div>
                    <Globe className="h-5 w-5 group-hover:animate-spin-slow" />
                  </Link>
                </Button>
              </>
            )}

            {!isWaitlistMode && (
              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm rounded-full px-1 py-1 border border-slate-700/50 shadow-sm ml-2 flex items-center"
                whileHover={{ scale: 1.03 }}
              >
                {isAuthenticated ? (
                  <>
                    {/* Chat Icon - Functional */}
                    <Button asChild variant="ghost" size="icon" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:text-blue-400 transition-all">
                      <Link href="/chat">
                        <MessageCircle className="h-5 w-5" />
                      </Link>
                    </Button>

                    {/* Notification Bell - Functional Dropdown */}
                    <NavbarNotifications />

                    <div className="w-px h-6 bg-slate-700 mx-1"></div>

                    <Button variant="ghost" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:text-red-400 transition-all font-medium text-xs px-3" onClick={() => setShowLogoutConfirm(true)}>
                      Logout
                    </Button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 ml-1 flex items-center justify-center border-2 border-slate-800 cursor-pointer hover:scale-110 transition-transform overflow-hidden">
                      <Link href="/profile" className="w-full h-full flex items-center justify-center">
                        {user?.profile_picture ? (
                          <img src={user.profile_picture} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:text-blue-400 transition-all">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </motion.div>
            )}

            {isWaitlistMode && (
              <motion.div
                className="ml-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button asChild className="rounded-full bg-white text-black hover:bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all font-semibold">
                  <Link href="/join-waitlist">Join Waitlist</Link>
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Right Side */}
          {!isWaitlistMode && (
            <div className="flex md:hidden items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* SociaLink Entry Point - Mobile */}
                  <Button asChild variant="ghost" size="icon" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:text-violet-400 transition-all relative group">
                    <Link href="/socialink">
                      <div className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse"></div>
                      <Globe className="h-5 w-5" />
                    </Link>
                  </Button>
                  <NavbarNotifications />
                  <Link href="/profile" className="relative group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[2px]">
                      <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden relative">
                        {user?.profile_picture ? (
                          <img src={user.profile_picture} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <User className="h-4 w-4 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </>
              ) : (
                <Button asChild size="sm" className="rounded-full bg-blue-600 text-white px-4 h-8 text-xs">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          )}

          {isWaitlistMode && (
            <div className="flex md:hidden items-center gap-2">
              <Button asChild size="sm" className="rounded-full bg-white text-black hover:bg-slate-200 text-xs font-semibold">
                <Link href="/join-waitlist">Join</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu - Hidden as replaced by Bottom Nav */}
          <div className="hidden"></div>

        </div>
      </motion.header>
    </>
  )
}

function NavbarNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('sociaverse_token')
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/notifications/', {
        headers: { 'Authorization': `Token ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.slice(0, 5)) // Show top 5
        setUnreadCount(data.filter((n: any) => !n.is_read).length)
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error)
    }
  }

  // Initial fetch for badge
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [isAuthenticated])

  // Fetch when opening dropdown
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  // Poll every 5 minutes (reduced frequency)
  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(fetchNotifications, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [isAuthenticated])


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:text-yellow-400 transition-all relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-800 text-slate-200 p-0 overflow-hidden shadow-xl shadow-black/50">
        <div className="p-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex justify-between items-center">
          <h3 className="font-bold text-sm">Notifications</h3>
          <Link href="/notifications" className="text-xs text-blue-400 hover:text-blue-300" onClick={() => setIsOpen(false)}>View all</Link>
        </div>

        <div className="max-h-[350px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <Link href={n.notification_type === 'follow_request' ? '/notifications' : `/u/${n.sender.username}`} key={n.id} onClick={() => setIsOpen(false)}>
                <div className={`p-3 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors flex gap-3 ${!n.is_read ? 'bg-slate-800/20' : ''}`}>
                  <div className="shrink-0 mt-1">
                    {n.notification_type === 'follow_request' ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <UserPlus className="w-4 h-4" />
                      </div>
                    ) : n.sender.profile_picture ? (
                      <img src={n.sender.profile_picture.startsWith('http') ? n.sender.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${n.sender.profile_picture}`} className="w-8 h-8 rounded-full object-cover" alt="" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 leading-snug">
                      <span className="font-semibold text-white">{n.sender.username}</span>
                      {" "}
                      {n.notification_type === 'follow_request' && 'requested to follow you.'}
                      {n.notification_type === 'new_follower' && 'started following you.'}
                      {n.notification_type === 'like' && 'liked your post.'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">{formatDate(n.created_at)}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>}
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="p-2 border-t border-slate-800 bg-slate-900/50 text-center">
          <Link href="/notifications" className="text-xs text-slate-400 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
            See earlier notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}