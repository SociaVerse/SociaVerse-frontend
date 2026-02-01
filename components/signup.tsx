"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, User, Calendar, School, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export function Signup() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [college, setCollege] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const [passwordStrength, setPasswordStrength] = useState("")
  const [errors, setErrors] = useState({
    fullName: "",
    dob: "",
    college: "",
    email: "",
    password: "",
    terms: ""
  })

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength("")
      return
    }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 1) setPasswordStrength("Weak")
    else if (strength === 2 || strength === 3) setPasswordStrength("Medium")
    else setPasswordStrength("Strong")
  }, [password])

  const validateForm = () => {
    let newErrors = { fullName: "", dob: "", college: "", email: "", password: "", terms: "" }
    let isValid = true

    if (!fullName.trim()) { newErrors.fullName = "Name is required"; isValid = false }
    if (!college.trim()) { newErrors.college = "College is required"; isValid = false }
    if (!dob) { newErrors.dob = "Date of birth is required"; isValid = false }

    try {
      z.string().email().parse(email)
    } catch {
      newErrors.email = "Invalid email address"
      isValid = false
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the Terms"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({ ...errors, terms: "" })

    try {
      const username = email.split('@')[0] + Math.floor(Math.random() * 10000)

      const response = await fetch("http://127.0.0.1:8000/api/users/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName,
          college,
          date_of_birth: dob,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsEmailSent(true)
      } else {
        console.error("Signup failed:", data)
        let errorMessage = "Something went wrong. Please try again."
        if (data.username) errorMessage = `Username: ${data.username[0]}`
        else if (data.email) errorMessage = `Email: ${data.email[0]}`
        else if (data.password) errorMessage = `Password: ${data.password[0]}`
        else if (data.detail) errorMessage = data.detail

        setErrors(prev => ({ ...prev, terms: errorMessage }))
      }
    } catch (error) {
      console.error("Network error:", error)
      setErrors(prev => ({ ...prev, terms: "Network error. Please check your connection." }))
    } finally {
      setIsLoading(false)
    }
  }

  const { login } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)
  const [otp, setOtp] = useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({ ...errors, terms: "" })

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        // Success! Auto-login and show success message
        // Save token to localStorage if needed, or just rely on the boolean logic
        if (data.token) {
          localStorage.setItem("sociaverse_token", data.token)
        }

        login() // Sets authenticated state
        setIsSuccess(true)

        // Redirect after delay
        setTimeout(() => {
          router.push("/events")
        }, 3000)

      } else {
        setErrors(prev => ({ ...prev, terms: data.error || "Verification failed" }))
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, terms: "Network error. Please try again." }))
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 px-4">
        {/* Confetti or Celebration Effect Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center max-w-lg w-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-green-500/20"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Welcome Aboard!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-300 text-lg mb-8 leading-relaxed"
          >
            You're now part of the <span className="text-blue-400 font-semibold">SociaVerse</span> community.
            <br />Prepare for launch...
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-slate-500 text-sm mt-3">Redirecting to your dashboard...</p>
          </motion.div>

        </motion.div>
      </div>
    )
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 text-center shadow-2xl relative z-10"
        >
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify Account</h2>
          <p className="text-slate-400 mb-6">
            We've sent a 6-digit code to <span className="text-white font-medium">{email}</span>.
            Enter it below to confirm your account.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative group">
              <Input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest h-14 bg-slate-950/50 border-slate-800 text-slate-200 focus:ring-blue-500/50"
                maxLength={6}
              />
            </div>

            {errors.terms && <p className="text-sm text-red-400">{errors.terms}</p>}

            <Button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
            </Button>
          </form>

          <Button
            variant="link"
            onClick={() => setIsEmailSent(false)}
            className="mt-4 text-slate-500 hover:text-slate-300"
          >
            Wrong email? Go back
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px] animate-pulse-slow delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden">

          {/* Form Side */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-400">Join the SociaVerse community today.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">

              <div className="space-y-4">
                <Button
                  type="button"
                  // Explicitly styling for visibility, removing variant="outline"
                  className="w-full h-12 bg-white text-slate-900 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 font-bold mb-2 transition-all shadow-sm hover:shadow-md"
                >
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Sign up with Google
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-700/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-slate-500 font-medium">Or register with email</span>
                  </div>
                </div>
              </div>

              {/* Name & College Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <Input
                      placeholder="Username"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`pl-10 h-11 bg-slate-950/50 border-slate-800 text-slate-200 focus:ring-blue-500/50 ${errors.fullName ? 'border-red-500/50' : ''}`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-400 ml-1">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300 ml-1">College / University</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <School className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <Input
                      placeholder="College Name"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className={`pl-10 h-11 bg-slate-950/50 border-slate-800 text-slate-200 focus:ring-blue-500/50 ${errors.college ? 'border-red-500/50' : ''}`}
                    />
                  </div>
                  {errors.college && <p className="text-xs text-red-400 ml-1">{errors.college}</p>}
                </div>
              </div>

              {/* DOB & Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300 ml-1">Date of Birth</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <Input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={`pl-10 h-11 bg-slate-950/50 border-slate-800 text-slate-200 focus:ring-blue-500/50 ${errors.dob ? 'border-red-500/50' : ''}`}
                    />
                  </div>
                  {errors.dob && <p className="text-xs text-red-400 ml-1">{errors.dob}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <Input
                      type="email"
                      placeholder="you@edu.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 h-11 bg-slate-950/50 border-slate-800 text-slate-200 focus:ring-blue-500/50 ${errors.email ? 'border-red-500/50' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email}</p>}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 h-11 bg-slate-950/50 border-slate-800 text-slate-200 focus:ring-blue-500/50 ${errors.password ? 'border-red-500/50' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {password && (
                  <div className="flex gap-1 h-1 mt-1">
                    <div className={`flex-1 rounded-full ${passwordStrength === 'Weak' || passwordStrength === 'Medium' || passwordStrength === 'Strong' ? 'bg-red-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 rounded-full ${passwordStrength === 'Medium' || passwordStrength === 'Strong' ? 'bg-yellow-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 rounded-full ${passwordStrength === 'Strong' ? 'bg-green-500' : 'bg-slate-800'}`} />
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="space-y-1">
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/50"
                  />
                  <label htmlFor="terms" className="ml-2 text-xs text-slate-400 leading-relaxed">
                    By signing up, you agree to our <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>.
                  </label>
                </div>
                {errors.terms && <p className="text-xs text-red-400 ml-6">{errors.terms}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all font-semibold"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* Art/Image Side */}
          <div className="hidden lg:block relative bg-slate-900 border-l border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                className="w-48 h-48 rounded-full bg-slate-950/50 backdrop-blur-3xl border border-slate-700 flex items-center justify-center mb-8 shadow-2xl relative"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 opacity-20 animate-pulse-slow" />
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=300"
                  alt="Community"
                  width={150}
                  height={150}
                  className="rounded-full object-cover border-4 border-slate-800"
                />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-4">Find Your Tribe</h3>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Join thousands of students connecting, collaborating, and creating the future together on SociaVerse.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-xs">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-blue-400">10k+</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Students</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-indigo-400">500+</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Colleges</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}