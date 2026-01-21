"use client"

import Link from "next/link"
import Image from "next/image"
import { Globe, Menu, Search, Bell, User, Sparkles } from "lucide-react"
import { ModeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

// Define links in an array for cleaner code
const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/events", label: "Events" },
  { href: "/explore", label: "Explore" },
  { href: "/community", label: "Community" },
]

export function Navbar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

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
          <Button variant="ghost" size="icon" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:scale-110 transition-all">
            <Bell className="h-5 w-5" />
          </Button>
          <motion.div
            className="bg-slate-800/50 backdrop-blur-sm rounded-full px-1 py-1 border border-slate-700/50 shadow-sm ml-2 flex items-center"
            whileHover={{ scale: 1.03 }}
          >
            <Button asChild variant="ghost" className="rounded-full text-slate-200 hover:bg-slate-700/50 hover:text-blue-400 transition-all">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
              <Link href="/signup">Sign Up</Link>
            </Button>
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
                </div>

                <motion.div
                  className="mt-auto space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Button asChild variant="ghost" className="w-full justify-start rounded-full hover:bg-slate-800/70 text-slate-200 group">
                    <Link href="/login" className="flex items-center">
                      <User className="mr-2 h-5 w-5 group-hover:text-blue-400 transition-colors" />
                      <span className="group-hover:text-blue-400 transition-colors">Login</span>
                    </Link>
                  </Button>
                  <Button asChild className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] transition-all">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </SheetContent>
          </Sheet>
        </motion.div>

      </div>
    </motion.header>
  )
}