"use client"

import Link from "next/link"
import Image from "next/image"
import { Globe, Menu, Search, Bell, User, Sparkles, MessageCircle } from "lucide-react"
import { ModeToggle } from "@/components/theme-toggle"
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

// Define links in an array for cleaner code
const navLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/events", label: "Events" },
  { href: "/explore", label: "Explore" },
  { href: "/community", label: "Community" },
]

export function Navbar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      setIsLoggingOut(false)
    }, 2000)
  }

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
          "sticky top-4 z-50 w-full mx-auto max-w-[95%] rounded-full transition-all duration-300",
          scrolled
            ? "bg-slate-900/90 backdrop-blur-lg shadow-lg border border-slate-700/50 shadow-blue-500/10"
            : "bg-slate-900/70 backdrop-blur-md"
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
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md group-hover:shadow-blue-500/20 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Globe className="h-5 w-5 text-white" />
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
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    variant="ghost"
                    className="relative px-4 py-2 text-sm font-medium text-slate-200 rounded-full transition-all duration-200 hover:bg-slate-700/50"
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <Link href={link.href} className="flex items-center">
                      {/* {link.icon && link.icon} */}
                      {/* Commented out link.icon call since it's not in the object definition above, mimicking user snippet but avoiding crash if undefined */}
                      {hoveredLink === link.href && (
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
                ))}
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
            <Button variant="ghost" size="icon" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:scale-110 transition-all">
              <Search className="h-5 w-5" />
            </Button>

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:text-yellow-400 transition-all relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-800 text-slate-200 p-2">
                      <DropdownMenuLabel className="font-bold text-lg mb-2">Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <div className="max-h-[300px] overflow-y-auto space-y-1">
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 rounded-lg p-3 flex flex-col items-start gap-1">
                          <div className="flex justify-between w-full">
                            <span className="font-semibold text-blue-400 text-sm">New Message</span>
                            <span className="text-[10px] text-slate-500">2 min ago</span>
                          </div>
                          <p className="text-xs text-slate-400">Alex sent you an inquiry about "iPad Pro".</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 rounded-lg p-3 flex flex-col items-start gap-1">
                          <div className="flex justify-between w-full">
                            <span className="font-semibold text-green-400 text-sm">Item Listing</span>
                            <span className="text-[10px] text-slate-500">1 hour ago</span>
                          </div>
                          <p className="text-xs text-slate-400">Your "Calculus Textbook" is now live on the marketplace.</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 rounded-lg p-3 flex flex-col items-start gap-1">
                          <div className="flex justify-between w-full">
                            <span className="font-semibold text-purple-400 text-sm">Welcome!</span>
                            <span className="text-[10px] text-slate-500">1 day ago</span>
                          </div>
                          <p className="text-xs text-slate-400">Welcome to SociaVerse! Explore events and connect.</p>
                        </DropdownMenuItem>
                      </div>
                      <DropdownMenuSeparator className="bg-slate-700 mt-2" />
                      <Button variant="ghost" className="w-full text-xs text-slate-400 hover:text-white mt-1 h-8">
                        Mark all as read
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>

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
          </motion.div>

          {/* Mobile Menu */}
          <motion.div
            className="flex items-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 rounded-full hover:bg-slate-800/70 hover:scale-110 transition-all">
                  <Menu className="h-5 w-5 text-slate-200" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6 bg-slate-900/95 backdrop-blur-lg border-l border-slate-700/50">
                <motion.div
                  className="flex flex-col h-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/" className="flex items-center space-x-2 mb-8 group">
                    <motion.div
                      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Globe className="h-5 w-5 text-white" />
                    </motion.div>
                    <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                      SociaVerse
                    </span>
                  </Link>

                  {/* Mobile Nav Links */}
                  <div className="flex flex-col gap-2 mb-8">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                      >
                        <Button
                          asChild
                          variant="ghost"
                          className="justify-start text-base rounded-full py-6 hover:bg-slate-800/70 text-slate-200 w-full group"
                        >
                          <Link href={link.href} className="flex items-center">
                            {/* {link.icon && <motion.span whileHover={{ rotate: 15 }} className="mr-2">{link.icon}</motion.span>} */}
                            <span className="group-hover:text-blue-400 transition-colors">{link.label}</span>
                          </Link>
                        </Button>
                      </motion.div>
                    ))}

                    {/* Mobile Chat Link (Auth only) */}
                    {isAuthenticated && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        <Button
                          asChild
                          variant="ghost"
                          className="justify-start text-base rounded-full py-6 hover:bg-slate-800/70 text-slate-200 w-full group"
                        >
                          <Link href="/chat" className="flex items-center">
                            <MessageCircle className="mr-2 h-5 w-5 text-blue-400 group-hover:text-blue-300" />
                            <span className="group-hover:text-blue-400 transition-colors">Messages</span>
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>

                  <motion.div
                    className="mt-auto space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    {isAuthenticated ? (
                      <Button variant="ghost" className="w-full justify-start rounded-full hover:bg-slate-800/70 text-slate-200 group" onClick={() => setShowLogoutConfirm(true)}>
                        <span className="flex items-center text-red-400 group-hover:text-red-300 transition-colors">
                          <User className="mr-2 h-5 w-5" />
                          Logout
                        </span>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="ghost" className="w-full justify-start rounded-full hover:bg-slate-800/70 text-slate-200 group">
                          <Link href="/login" className="flex items-center">
                            <User className="mr-2 h-5 w-5 group-hover:text-blue-400 transition-colors" />
                            <span className="group-hover:text-blue-400 transition-colors">Login</span>
                          </Link>
                        </Button>
                        <Button asChild className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] transition-all">
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              </SheetContent>
            </Sheet>
          </motion.div>

        </div>
      </motion.header>
    </>
  )
}