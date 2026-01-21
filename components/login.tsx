"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import { MdEmail } from "react-icons/md"
import {
  FaLock,
  FaFacebook,
  FaTwitter,
  FaApple,
  FaUserFriends,
  FaImage,
  FaGlobeAmericas,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"
import { z } from "zod"
import Image from "next/image"
import Link from "next/link" // Import Link

export function Login() {
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false) // Added state for password toggle
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const validateEmail = (email: string) => {
    const emailSchema = z.string().email("Please enter a valid email address")
    try {
      emailSchema.parse(email)
      return true
    } catch (error) {
      return false
    }
  }

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({ email: "", password: "" })

    // Validate email
    if (!validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }))
      return
    }

    // Validate password
    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }))
      return
    }

    // Handle login logic here
    console.log("Logging in with email:", email)
  }

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log("Logging in with Google")
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden px-4 sm:px-6 py-6">
      <div
        className={`grid w-full max-w-[1000px] grid-cols-1 overflow-hidden rounded-xl border border-slate-700 bg-slate-800/90 shadow-2xl lg:grid-cols-2 animate-blurIn mx-auto`}
      >
        {/* Left Column - Login Form */}
        <div className="flex flex-col justify-center p-5 sm:p-8 md:p-12 animate-slideInLeft animation-delay-150">
          <div className="mb-6 sm:mb-8 animate-slideInUp animation-delay-300">
            <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-bold text-white">
              Welcome to SociaVerse
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Sign in to continue to your account
            </p>
          </div>

          {!showEmailLogin ? (
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-2 bg-white text-slate-800 hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] animate-scaleIn animation-delay-450 text-sm sm:text-base py-5 sm:py-6"
              >
                <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5" />
                Continue with Google
              </Button>

              <Button
                onClick={() => setShowEmailLogin(true)}
                variant="outline"
                className="flex w-full items-center justify-center gap-2 border-slate-600 bg-transparent text-white hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02] animate-scaleIn animation-delay-600 text-sm sm:text-base py-5 sm:py-6"
              >
                <MdEmail className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
                Continue with Email
              </Button>

              <div className="grid grid-cols-3 gap-2 mt-3 sm:mt-4 animate-fadeIn animation-delay-750">
                <Button
                  variant="outline"
                  className="flex items-center justify-center border-slate-600 bg-transparent text-white hover:bg-slate-700 transition-all duration-200 hover:scale-[1.05] p-2 sm:p-3"
                >
                  <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center border-slate-600 bg-transparent text-white hover:bg-slate-700 transition-all duration-200 hover:scale-[1.05] p-2 sm:p-3"
                >
                  <FaTwitter className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center border-slate-600 bg-transparent text-white hover:bg-slate-700 transition-all duration-200 hover:scale-[1.05] p-2 sm:p-3"
                >
                  <FaApple className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </Button>
              </div>

              <div className="my-4 sm:my-6 flex items-center animate-fadeIn animation-delay-900">
                <div className="flex-grow border-t border-slate-700"></div>
                <span className="mx-3 sm:mx-4 text-xs sm:text-sm text-slate-500">
                  OR
                </span>
                <div className="flex-grow border-t border-slate-700"></div>
              </div>

              <p className="text-center text-xs sm:text-sm text-slate-400 animate-fadeIn animation-delay-900">
                New to SociaVerse?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Create an account
                </Link>
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleEmailLogin}
              className="flex flex-col gap-4 sm:gap-5 animate-fadeIn"
            >
              <div className="animate-slideInUp animation-delay-150">
                <label
                  htmlFor="email"
                  className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-300"
                >
                  Email address
                </label>
                <div className="relative group">
                  <MdEmail className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-500 transition-colors duration-200 group-focus-within:text-blue-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 bg-slate-900/50 border-slate-700 text-white text-sm sm:text-base py-5 sm:py-6 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 hover:border-slate-500 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500/50"
                        : "focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="animate-slideInUp animation-delay-300">
                <label
                  htmlFor="password"
                  className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <div className="relative group">
                  <FaLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors duration-200 group-focus-within:text-blue-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 bg-slate-900/50 border-slate-700 text-white text-sm sm:text-base py-5 sm:py-6 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 hover:border-slate-500 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500/50"
                        : "focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between animate-slideInUp animation-delay-450">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-3 w-3 sm:h-4 sm:w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 text-xs sm:text-sm text-slate-400"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="mt-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-blue-500/50 animate-scaleIn animation-delay-600 text-sm sm:text-base py-5 sm:py-6"
              >
                Sign In
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEmailLogin(false)}
                className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400 hover:bg-slate-700/50 transition-colors duration-200 animate-fadeIn animation-delay-750"
              >
                Back to login options
              </Button>
            </form>
          )}
        </div>

        {/* Right side - Branding */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-95"></div>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 text-center">
            <div className="relative mb-6 md:mb-8 h-20 w-20 md:h-24 md:w-24 animate-float">
              <div className="absolute inset-0 rounded-full bg-linear-to-b from-slate-700 to-slate-600 opacity-30 blur-xl animate-pulse-slow"></div>
              <div className="absolute inset-2 rounded-full bg-linear-to-b from-blue-500/20 to-slate-600/20 opacity-30 blur-md animate-pulse-slow animation-delay-150"></div>
              <Image
                src="/socialverse_logo.png"
                alt="SociaVerse Logo"
                width={96}
                height={96}
                className="relative z-10 rounded-full drop-shadow-xl object-cover"
              />
            </div>
            <h3 className="mb-3 md:mb-4 text-3xl md:text-4xl font-bold text-white animate-slideInUp animation-delay-300">
              SociaVerse
            </h3>
            <p className="mb-6 md:mb-8 text-base md:text-lg text-slate-300 animate-slideInUp animation-delay-450">
              Connect with friends, share moments, and discover new experiences
              in our social universe.
            </p>
            <div className="flex flex-col gap-3 md:gap-4 animate-fadeIn animation-delay-600">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-700/70">
                  <FaUserFriends className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                </div>
                <p className="text-left text-sm md:text-base text-slate-300">
                  Connect with friends and family
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-700/70">
                  <FaImage className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                </div>
                <p className="text-left text-sm md:text-base text-slate-300">
                  Share your favorite moments
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-700/70">
                  <FaGlobeAmericas className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                </div>
                <p className="text-left text-sm md:text-base text-slate-300">
                  Discover content from around the world
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}