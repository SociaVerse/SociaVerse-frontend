"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, Rocket, HelpCircle } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden p-4">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] rounded-full bg-blue-600/20 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -45, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", delay: 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60vh] h-[60vh] rounded-full bg-purple-600/20 blur-[120px]"
                />
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="mb-8 relative"
                >
                    <h1 className="text-[10rem] md:text-[14rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-700 to-slate-900 select-none">
                        404
                    </h1>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center font-bold text-4xl md:text-6xl text-slate-100 pointer-events-none"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-2xl">
                            Lost in Space?
                        </span>
                    </motion.div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-slate-400 mb-10 max-w-md mx-auto"
                >
                    The page you're looking for seems to have drifted into a black hole. Let's get you back to safety.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button asChild className="h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 text-base font-semibold transition-all hover:scale-105">
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Return Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 px-8 rounded-full border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                        <Link href="/community">
                            <Rocket className="mr-2 h-5 w-5" />
                            Explore Communities
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Floating Astronaut/Icon Decoration */}
            <motion.div
                animate={{
                    y: [-20, 20, -20],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-[10%] opacity-20 hidden lg:block"
            >
                <HelpCircle className="w-24 h-24 text-slate-600" />
            </motion.div>
        </div>
    )
}
