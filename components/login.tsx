"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaTwitter } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { z } from "zod"

export function Login() {
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })

  const { login } = useAuth()
  const router = useRouter()

  const validateEmail = (email: string) => {
    try {
      z.string().email().parse(email)
      return true
    } catch (e) {
      return false
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ email: "", password: "" })

    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }))
      return
    }

    if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("sociaverse_token", data.token)
        }
        login()
        router.push("/events")
      } else {
        setErrors(prev => ({
          ...prev,
          password: data.error || "Login failed. Please check your credentials."
        }))
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors(prev => ({ ...prev, password: "Network error. Please try again." }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">

      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-12">

            {/* Header */}
            <div className="text-center mb-10">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2"
              >
                Welcome Back
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-sm"
              >
                Enter your details to access your account
              </motion.p>
            </div>

            {/* Auth Options */}
            {!showEmailLogin ? (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    // Explicitly styling for visibility
                    className="w-full h-12 bg-white text-slate-900 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 font-bold text-base relative group overflow-hidden shadow-sm hover:shadow-md transition-all"
                    onClick={() => {
                      console.log("Google Login")
                      login()
                      router.push("/events")
                    }}
                  >
                    <FcGoogle className="w-5 h-5 mr-2" />
                    Continue with Google
                  </Button>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-12 bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300"
                      onClick={() => {
                        login()
                        router.push("/events")
                      }}
                    >
                      <FaGithub className="w-5 h-5" />
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-12 bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300"
                      onClick={() => {
                        login()
                        router.push("/events")
                      }}
                    >
                      <FaTwitter className="w-5 h-5 text-sky-500" />
                    </Button>
                  </motion.div>
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-slate-500 font-medium">Or continue with</span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all"
                    onClick={() => setShowEmailLogin(true)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Sign in with Email
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
                onSubmit={handleEmailLogin}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`h-12 pl-12 bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-blue-500/50 focus:border-blue-500 ${errors.email ? 'border-red-500/50' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-sm font-medium text-slate-300">Password</label>
                      <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</a>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`h-12 pl-12 pr-12 bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:ring-blue-500/50 focus:border-blue-500 ${errors.password ? 'border-red-500/50' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password}</p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => setShowEmailLogin(false)}
                    className="text-slate-400 hover:text-slate-200 text-sm"
                  >
                    Back to all options
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Create one now
                </Link>
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  )
}