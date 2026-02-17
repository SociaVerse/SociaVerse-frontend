"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, User, Calendar, School, ArrowRight, Loader2, Sparkles, Check } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaTwitter } from "react-icons/fa"
import Link from "next/link"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { BackgroundBeams } from "@/components/ui/background-beams"
import Image from "next/image"

export function Signup() {
  const router = useRouter()
  const { login } = useAuth()

  // States
  const [step, setStep] = useState<"signup" | "verify" | "success">("signup")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    college: "",
    dob: "",
    email: "",
    password: "",
    agreeToTerms: false
  })

  const [otp, setOtp] = useState("")
  const [passwordStrength, setPasswordStrength] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Password Strength Logic
  useEffect(() => {
    const pwd = formData.password
    if (!pwd) {
      setPasswordStrength("")
      return
    }
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++

    if (strength <= 1) setPasswordStrength("Weak")
    else if (strength === 2 || strength === 3) setPasswordStrength("Medium")
    else setPasswordStrength("Strong")
  }, [formData.password])

  // Validation
  const validateForm = () => {
    let newErrors: Record<string, string> = {}
    let isValid = true

    if (!formData.fullName.trim()) { newErrors.fullName = "Name is required"; isValid = false }
    if (!formData.college.trim()) { newErrors.college = "College is required"; isValid = false }
    if (!formData.dob) { newErrors.dob = "Date of birth is required"; isValid = false }
    try {
      z.string().email().parse(formData.email)
    } catch {
      newErrors.email = "Invalid email address"; isValid = false
    }
    if (formData.password.length < 8) {
      newErrors.password = "Min 8 chars"; isValid = false
    }
    if (!formData.agreeToTerms) {
      newErrors.terms = "Required"; isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const username = formData.email.split('@')[0] + Math.floor(Math.random() * 10000)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          college: formData.college,
          date_of_birth: formData.dob,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep("verify")
      } else {
        console.error("Signup failed:", data)
        let errorMessage = "Something went wrong."
        if (data.username) errorMessage = `Username: ${data.username[0]}`
        else if (data.email) errorMessage = `Email: ${data.email[0]}`
        else if (data.password) errorMessage = `Password: ${data.password[0]}`
        else if (data.detail) errorMessage = data.detail
        setErrors({ general: errorMessage })
      }
    } catch (error) {
      console.error("Network error:", error)
      setErrors({ general: "Network error. Please check your connection." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.token) localStorage.setItem("sociaverse_token", data.token)
        login()
        setStep("success")
        setTimeout(() => router.push("/events"), 3000)
      } else {
        setErrors({ verify: data.error || "Verification failed" })
      }
    } catch (error) {
      setErrors({ verify: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans selection:bg-blue-500/30">
      <BackgroundBeams className="z-0 opacity-40" />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full p-4 flex justify-center">
        <AnimatePresence mode="wait">
          {step === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5"
            >
              {/* Left Side: Brand & Visuals (Stable 2D) */}
              <div className="col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                <div className="relative z-10">
                  <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 mb-6">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Join the Future</h1>
                  <p className="text-blue-100/80 text-sm leading-relaxed">
                    Connect with students, join events, and build your digital campus identity with SociaVerse.
                  </p>
                </div>

                <div className="relative z-10 glass-card p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md mt-12 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex -space-x-3 mb-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-500 bg-slate-800 flex items-center justify-center text-[10px] overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                      +2k
                    </div>
                  </div>
                  <p className="text-xs text-white/90 font-medium">"Best platform for college events!"</p>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                </div>
              </div>

              {/* Right Side: Form (Stable 2D) */}
              <div className="col-span-3 p-8 md:p-10 flex flex-col justify-center bg-slate-950/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Join SociaVerse</h2>
                  <Link href="/login" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer">Log In &rarr;</Link>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="w-full">
                    <div className="flex w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <Button type="button" variant="ghost" className="flex-1 h-12 hover:bg-white/10 hover:text-white text-slate-300 transition-all rounded-none border-r border-white/10">
                        <FcGoogle className="w-5 h-5" />
                      </Button>
                      <Button type="button" variant="ghost" className="flex-1 h-12 hover:bg-white/10 hover:text-white text-slate-300 transition-all rounded-none border-r border-white/10">
                        <FaGithub className="w-5 h-5" />
                      </Button>
                      <Button type="button" variant="ghost" className="flex-1 h-12 hover:bg-white/10 hover:text-white text-slate-300 transition-all rounded-none">
                        <FaTwitter className="w-5 h-5 text-blue-400" />
                      </Button>
                    </div>
                  </div>

                  <div className="relative py-1 w-full flex items-center justify-center">
                    <div className="absolute inset-x-0 h-px bg-white/10" />
                    <span className="relative text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900 px-2 rounded-full border border-white/5">or</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
                    <InputItem label="Full Name" icon={User} placeholder="Enter name" value={formData.fullName} onChange={(e: any) => handleInputChange("fullName", e.target.value)} error={errors.fullName} />
                    <InputItem label="College" icon={School} placeholder="Enter college" value={formData.college} onChange={(e: any) => handleInputChange("college", e.target.value)} error={errors.college} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
                    <InputItem label="Birthday" icon={Calendar} type="date" value={formData.dob} onChange={(e: any) => handleInputChange("dob", e.target.value)} error={errors.dob} />
                    <InputItem label="Email" icon={Mail} type="email" placeholder="edu@mail.com" value={formData.email} onChange={(e: any) => handleInputChange("email", e.target.value)} error={errors.email} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                        <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pl-10 pr-10 h-12 text-sm bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900/60 focus:ring-0 transition-all rounded-xl ${errors.password ? 'border-red-500/50' : ''}`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300">
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <div className="flex gap-0.5 h-0.5 mt-1 px-1 opacity-50">
                      <div className={`flex-1 rounded-full transition-colors ${['Weak', 'Medium', 'Strong'].includes(passwordStrength) ? (passwordStrength === 'Weak' ? 'bg-red-500' : 'bg-indigo-500') : 'bg-slate-800'}`} />
                      <div className={`flex-1 rounded-full transition-colors ${['Medium', 'Strong'].includes(passwordStrength) ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                      <div className={`flex-1 rounded-full transition-colors ${['Strong'].includes(passwordStrength) ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                    </div>
                    {errors.password && <p className="text-[10px] text-red-400 ml-1">{errors.password}</p>}
                  </div>

                  <div className="flex items-center pt-1 w-full">
                    <input id="terms" type="checkbox" checked={formData.agreeToTerms} onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)} className="h-3 w-3 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50" />
                    <label htmlFor="terms" className="ml-2 text-[10px] text-slate-400">I agree to the <a href="#" className="text-indigo-400 hover:underline">Terms</a> & <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a></label>
                  </div>
                  {errors.terms && <p className="text-[10px] text-red-400 ml-5 -mt-2">Required</p>}

                  {errors.general && <div className="w-full text-center text-xs text-red-400 bg-red-500/10 p-2 rounded">{errors.general}</div>}

                  <div className="w-full pt-2">
                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all rounded-xl border border-white/10 group">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="flex items-center">Create Account <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></span>}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {step === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="w-full max-w-sm bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verify Email</h2>
              <p className="text-slate-400 text-xs mb-8">Code sent to <span className="text-white">{formData.email}</span></p>

              <form onSubmit={handleVerify} className="space-y-6">
                <Input placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} className="text-center text-2xl tracking-[0.5em] font-mono h-14 bg-slate-950/50 border-white/10 text-white focus:border-blue-500/50 focus:ring-0 rounded-xl" maxLength={6} />
                {errors.verify && <p className="text-xs text-red-400">{errors.verify}</p>}
                <Button type="submit" disabled={isLoading || otp.length < 6} className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20">{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Now"}</Button>
              </form>
              <div className="mt-4">
                <button onClick={() => setStep("signup")} className="text-xs text-slate-500 hover:text-slate-400">Wrong email?</button>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 text-center max-w-md shadow-2xl">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">You're In!</h2>
              <p className="text-slate-400 mb-8">Redirecting you to the hub...</p>
              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Input Helper
const InputItem = ({ label, icon: Icon, error, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
        <Icon className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
      </div>
      <Input
        {...props}
        className={`pl-10 h-12 text-sm bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-900/60 focus:ring-0 transition-all rounded-xl ${error ? 'border-red-500/50' : ''}`}
      />
    </div>
    {error && <p className="text-[10px] text-red-400 ml-1">{error}</p>}
  </div>
)

function StarIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
  )
}