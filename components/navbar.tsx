"use client"

import Link from "next/link"
import { Globe, Menu } from "lucide-react"
import { ModeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion" // <-- Import for animation
import { useState } from "react"

// Define links in an array for cleaner code
const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/explore", label: "Explore" },
  { href: "/community", label: "Community" },
]

export function Navbar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
                 animate-in fade-in slide-in-from-top-4 duration-500" // <-- Page load animation
    >
      {/* THIS DIV IS THE FIX: I removed my broken `max-w-screen-2xl` class */}
      <div className="container flex h-14 items-center">
        
        {/* Brand/Logo */}
        <Button asChild variant="ghost" className="mr-6 px-2 sm:px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Globe className="h-6 w-6" />
            <span className="font-bold sm:inline-block">
              SociaVerse
            </span>
          </Link>
        </Button>
        
        {/* Desktop Nav Links (with "interesting" hover effect) */}
        <nav className="hidden items-center space-x-2 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="link"
              className="relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:no-underline"
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Link href={link.href}>
                {/* This is the magic hover animation */}
                {hoveredLink === link.href && (
                  <motion.span
                    layoutId="navbar-hover"
                    className="absolute inset-0 z-[-1] rounded-md bg-muted"
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
        </nav>
        
        {/* Desktop Right Side */}
        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
          <Button variant="ghost">Login</Button>
          <Button>Sign Up</Button>
          <ModeToggle />
        </div>

        {/* Mobile Menu */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Globe className="h-6 w-6" />
                <span className="font-bold">SociaVerse</span>
              </Link>
              
              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    variant="ghost" // Use "ghost" for a cleaner mobile list
                    className="justify-start text-base"
                  >
                    <Link href={link.href}>
                      {link.label}
                    </Link>
                  </Button>
                ))}
                
                <hr className="my-4 border-border" />
                
                {/* Mobile Auth Buttons */}
                <Button variant="outline" className="w-full justify-start text-base">Login</Button>
                <Button className="w-full justify-start text-base">Sign Up</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
      </div>
    </header>
  )
}