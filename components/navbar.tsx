"use client"

import Link from "next/link"
import { User, MessageCircle, Bell, UserPlus, Tag } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { usePathname } from "next/navigation"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const isChatPage = pathname === "/chat" || pathname?.startsWith("/chat/")
  const isCreatePage = pathname === "/create"
  const isProfilePage = pathname === "/profile" || pathname?.startsWith("/u/")

  const isChatPageConfig = (pathname === "/chat" || pathname?.startsWith("/chat/")) && isAuthenticated;

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      setIsLoggingOut(false)
    }, 2000)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (isCreatePage) return null

  return (
    <>
      {/* Logout Animation Overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
              <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-950/10 rounded-full blur-[120px]" />
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
                  className="w-full h-full rounded-full border-t-4 border-r-4 border-red-500 border-b-4 border-zinc-900 border-l-4 border-zinc-900"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-zinc-400" />
                  )}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">See you soon, {user?.first_name || user?.username}!</h2>
              <p className="text-zinc-500">Logging out safely...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirm Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutConfirm(false)} className="bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white border-zinc-800">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">Log Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -20,
          transition: { duration: 0.5, ease: "easeOut" }
        }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 pt-safe",
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-zinc-800/50 shadow-lg shadow-black/50"
            : "bg-black/50 backdrop-blur-md border-b border-transparent",
          isChatPageConfig || isProfilePage ? "hidden md:block" : ""
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between">

          {/* Brand/Logo */}
          <motion.div
            className="flex items-center"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center group ml-2">
              <motion.div
                className="relative flex h-10 sm:h-12 w-auto items-center justify-start bg-transparent transition-all duration-300 -translate-y-[2px]"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img
                  src="/logo.png"
                  alt="SociaVerse Logo"
                  className="h-full w-auto object-contain object-left scale-[1.1] sm:scale-[1.4] origin-left drop-shadow-md group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.5)] transition-all"
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Right Side */}
          <motion.div
            className="flex items-center space-x-1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {isAuthenticated ? (
              <div className="flex items-center gap-1 bg-zinc-900/60 backdrop-blur-sm rounded-full px-1.5 py-1 border border-zinc-800/50">
                {/* Chat */}
                <Button asChild variant="ghost" size="icon" className="rounded-full text-zinc-300 hover:bg-zinc-800 hover:text-red-500 transition-all">
                  <Link href="/chat">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Notifications */}
                <NavbarNotifications />

                <div className="w-px h-6 bg-zinc-800 mx-0.5" />

                {/* Logout */}
                <Button variant="ghost" className="rounded-full text-zinc-300 hover:bg-zinc-800 hover:text-red-400 transition-all font-medium text-xs px-3" onClick={() => setShowLogoutConfirm(true)}>
                  Logout
                </Button>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-red-500 ml-0.5 flex items-center justify-center border-2 border-zinc-900 cursor-pointer hover:scale-110 transition-transform overflow-hidden">
                  <Link href="/profile" className="w-full h-full flex items-center justify-center">
                    {user?.profile_picture ? (
                      <img src={user.profile_picture} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="rounded-full text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all text-sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="rounded-full bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300 hover:scale-105 text-sm font-semibold border-none">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </motion.div>

          {/* Mobile Right Side */}
          <div className="flex md:hidden items-center gap-3" style={{ display: 'none' }}>
            {/* Hidden since desktop view handles this */}
          </div>
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

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('sociaverse_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/`, {
        headers: { 'Authorization': `Token ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.slice(0, 5))
        setUnreadCount(data.filter((n: any) => !n.is_read).length)
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem('sociaverse_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` }
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark as read", error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) fetchNotifications()
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && isOpen) fetchNotifications()
  }, [isOpen])

  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(fetchNotifications, 300000)
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
        <Button variant="ghost" size="icon" className="rounded-full text-zinc-300 hover:bg-zinc-800 hover:text-red-400 transition-all relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-900"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-zinc-950 border-zinc-800 text-zinc-200 p-0 overflow-hidden shadow-xl shadow-black/50">
        <div className="p-3 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex justify-between items-center">
          <h3 className="font-bold text-sm">Notifications</h3>
          <Link href="/notifications" className="text-xs text-red-400 hover:text-red-300" onClick={() => setIsOpen(false)}>View all</Link>
        </div>

        <div className="max-h-[350px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => {
              let linkHref = `/u/${n.sender?.username || 'user'}`
              if (n.notification_type === 'follow_request') linkHref = '/notifications'
              else if (n.notification_type === 'marketplace_contact') linkHref = '/chat'
              else if (n.post) linkHref = `/post/${n.post}`

              return (
                <Link
                  href={linkHref}
                  key={n.id}
                  onClick={() => {
                    setIsOpen(false);
                    if (!n.is_read) markAsRead(n.id);
                  }}
                >
                  <div className={`p-3 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors flex gap-3 ${!n.is_read ? 'bg-zinc-900/30' : ''}`}>
                    <div className="shrink-0 mt-1">
                      {n.notification_type === 'follow_request' ? (
                        <div className="w-8 h-8 rounded-full bg-red-500/15 text-red-500 flex items-center justify-center">
                          <UserPlus className="w-4 h-4" />
                        </div>
                      ) : n.notification_type === 'marketplace_contact' ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                          <Tag className="w-4 h-4" />
                        </div>
                      ) : n.sender?.profile_picture ? (
                        <img src={n.sender.profile_picture.startsWith('http') ? n.sender.profile_picture : `${process.env.NEXT_PUBLIC_API_URL}${n.sender.profile_picture}`} className="w-8 h-8 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-zinc-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 leading-snug">
                        <span className="font-semibold text-white">{n.sender?.username || 'A user'}</span>
                        {" "}
                        {n.notification_type === 'follow_request' && 'requested to follow you.'}
                        {n.notification_type === 'new_follower' && 'started following you.'}
                        {n.notification_type === 'like' && 'liked your post.'}
                        {n.notification_type === 'comment' && 'commented on your post.'}
                        {n.notification_type === 'reply' && 'replied to your comment.'}
                        {n.notification_type === 'marketplace_contact' && 'wants to buy your item.'}
                      </p>
                      <span className="text-xs text-zinc-600 mt-1 block">{formatDate(n.created_at)}</span>
                    </div>
                    {!n.is_read && <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>}
                  </div>
                </Link>
              )
            })
          )}
        </div>

        <div className="p-2 border-t border-zinc-800 bg-zinc-950/80 text-center">
          <Link href="/notifications" className="text-xs text-zinc-500 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
            See earlier notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
