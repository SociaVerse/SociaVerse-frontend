"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] cursor-pointer"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl pointer-events-auto relative overflow-hidden"
                        >
                            {/* Background Decor */}
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                                <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[60px]" />
                                <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[60px]" />
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-20"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative z-10 text-center">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-700 shadow-lg">
                                    <Lock className="w-7 h-7 text-blue-400" />
                                </div>

                                <h2 className="text-2xl font-bold mb-2">Join the Community</h2>
                                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                                    You need to be signed in to connect with students and access exclusive features.
                                </p>

                                <div className="space-y-3">
                                    <Button asChild className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">
                                        <Link href="/login">
                                            Log In
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full h-11 border-slate-700 hover:bg-slate-800 text-slate-300">
                                        <Link href="/signup">
                                            Create Account
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
