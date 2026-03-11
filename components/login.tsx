"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { z } from "zod"

export function Login() {
  const [showEmailLogin, setShowEmailLogin] = useState(true)
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

  const [showWelcome, setShowWelcome] = useState(false)
  const [userData, setUserData] = useState<any>(null)

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(`Server Error: ${response.status} ${response.statusText}`);
        }
      }

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("sociaverse_token", data.token)

          // Fetch user details for welcome screen
          try {
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, {
              headers: {
                'Authorization': `Token ${data.token}`
              }
            })
            if (userResponse.ok) {
              const userDetails = await userResponse.json()
              setUserData(userDetails)
              setShowWelcome(true)

              // Login context update
              login()

              // Delay redirect
              setTimeout(() => {
                router.push("/events")
              }, 2000)
              return // Stop execution here to show welcome screen
            }
          } catch (err) {
            console.error("Failed to fetch user details", err)
          }
        }

        // Fallback if user fetch fails
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
      if (!showWelcome) setIsLoading(false)
    }
  }

  if (showWelcome && userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-2xl overflow-hidden mb-6 relative"
          >
            <img
              src={userData.profile_picture || `https://ui-avatars.com/?name=${userData.username}`}
              alt={userData.username}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2"
          >
            Welcome, <span className="text-blue-400">{userData.username}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400 text-lg"
          >
            Entering SociaVerse...
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 0.6, duration: 1.5 }}
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-8 rounded-full"
          />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 pt-20 md:pt-24 py-12 px-4 sm:px-6 lg:px-8">

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
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-transparent border shadow-blue-500/20 flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden bg-transparent flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="SociaVerse Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
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

            {/* Auth Options Removed */}
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
                      <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</Link>
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

              </motion.form>

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