"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, ArrowRight, Loader2, KeyRound, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            z.string().email().parse(email)
        } catch (e) {
            setError("Please enter a valid email address")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/password-reset/request/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setStep(2)
            } else {
                setError(data.error || "Something went wrong")
            }
        } catch (e) {
            setError("Network error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/password-reset/verify/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            })

            const data = await response.json()

            if (response.ok) {
                setStep(3)
            } else {
                setError(data.error || "Invalid OTP")
            }
        } catch (e) {
            setError("Network error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/password-reset/confirm/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, new_password: newPassword }),
            })

            const data = await response.json()

            if (response.ok) {
                setStep(4)
            } else {
                setError(data.error || "Failed to reset password")
            }
        } catch (e) {
            setError("Network error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-12">

                    <div className="text-center mb-10">
                        <motion.h2
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2"
                        >
                            {step === 1 && "Forgot Password?"}
                            {step === 2 && "Enter OTP"}
                            {step === 3 && "Reset Password"}
                            {step === 4 && "Success!"}
                        </motion.h2>
                        <motion.p
                            key={`desc-${step}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-400 text-sm"
                        >
                            {step === 1 && "Start the recovery process"}
                            {step === 2 && `Code sent to ${email}`}
                            {step === 3 && "Create a strong new password"}
                            {step === 4 && "Your password has been updated"}
                        </motion.p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                                onSubmit={handleEmailSubmit}
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 pl-12 bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-blue-500/50 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-xs text-red-400 text-center">{error}</p>}

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Code"}
                                </Button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                                onSubmit={handleOtpSubmit}
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Verification Code</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <Input
                                            type="text"
                                            placeholder="XXXXXX"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="h-12 pl-12 bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-blue-500/50 focus:border-blue-500 tracking-widest text-lg"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-xs text-red-400 text-center">{error}</p>}

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
                                </Button>

                                <div className="text-center">
                                    <button type="button" onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-slate-300">
                                        Change email
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                                onSubmit={handlePasswordSubmit}
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">New Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="h-12 pl-12 bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-blue-500/50 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-xs text-red-400 text-center">{error}</p>}

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                                </Button>
                            </motion.form>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="rounded-full bg-green-500/10 p-4">
                                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-white mb-2">Password Reset Complete</h3>
                                <p className="text-slate-400 mb-8">You can now sign in with your new password.</p>

                                <Button
                                    onClick={() => router.push("/login")}
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    Sign In <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {step !== 4 && (
                        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2">
                                ← Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
