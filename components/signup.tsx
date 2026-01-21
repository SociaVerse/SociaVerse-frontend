"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import { MdEmail, MdPerson } from "react-icons/md"
import {
  FaLock,
  FaFacebook,
  FaTwitter,
  FaApple,
  FaSchool,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"
import { z } from "zod"
import Image from "next/image"
import Link from "next/link"

export function Signup() {
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [college, setCollege] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("")
  const [errors, setErrors] = useState({
    fullName: "",
    dob: "",
    email: "",
    password: "",
    college: "",
    terms: "",
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    // Check password strength
    if (password) {
      const hasLowerCase = /[a-z]/.test(password)
      const hasUpperCase = /[A-Z]/.test(password)
      const hasNumbers = /\d/.test(password)
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)
      const length = password.length

      if (length < 6) {
        setPasswordStrength("weak")
      } else if (
        length >= 8 &&
        hasLowerCase &&
        hasUpperCase &&
        hasNumbers &&
        hasSpecialChars
      ) {
        setPasswordStrength("strong")
      } else if (
        length >= 6 &&
        ((hasLowerCase && hasUpperCase) ||
          (hasLowerCase && hasNumbers) ||
          (hasUpperCase && hasNumbers))
      ) {
        setPasswordStrength("good")
      } else {
        setPasswordStrength("weak")
      }
    } else {
      setPasswordStrength("")
    }
  }, [password])

  const validateEmail = (email: string) => {
    const emailSchema = z.string().email("Please enter a valid email address")
    try {
      emailSchema.parse(email)
      return true
    } catch (error) {
      return false
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    const newErrors = {
      fullName: "",
      dob: "",
      email: "",
      password: "",
      college: "",
      terms: "",
    }

    let hasError = false

    // Validate required fields
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
      hasError = true
    }

    if (!dob.trim()) {
      newErrors.dob = "Date of birth is required"
      hasError = true
    }

    if (!college.trim()) {
      newErrors.college = "College name is required"
      hasError = true
    }

    // Validate email
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
      hasError = true
    }

    // Validate password
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      hasError = true
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions"
      hasError = true
    }

    setErrors(newErrors)

    if (!hasError) {
      // Handle signup logic here
      console.log("Signing up with:", {
        fullName,
        dob,
        email,
        password,
        college,
      })
    }
  }

  const handleGoogleSignup = () => {
    // Handle Google signup logic here
    console.log("Signing up with Google")
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden px-4 sm:px-6 py-6">
      <div
        className={`grid w-full max-w-[1000px] grid-cols-1 overflow-hidden rounded-xl border border-slate-700 bg-slate-800/90 shadow-2xl lg:grid-cols-2 animate-blurIn mx-auto`}
      >
        {/* Left Column - Signup Form */}
        <div className="flex flex-col justify-center p-5 sm:p-8 md:p-12 animate-slideInLeft animation-delay-150">
          <div className="mb-6 sm:mb-8 animate-slideInUp animation-delay-300">
            <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-bold text-white">
              Join SociaVerse
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Create your account to get started
            </p>
          </div>

          <form
            onSubmit={handleSignup}
            className="flex flex-col gap-4 sm:gap-5 animate-fadeIn"
          >
            {/* Full Name */}
            <div className="animate-slideInUp animation-delay-150">
              <label
                htmlFor="fullName"
                className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-300"
              >
                Full Name *
              </label>
              <div className="relative group">
                <MdPerson className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-500 transition-colors duration-200 group-focus-within:text-blue-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`pl-10 bg-slate-900/50 border-slate-700 text-white text-sm sm:text-base py-5 sm:py-6 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 hover:border-slate-500 ${
                    errors.fullName
                      ? "border-red-500 focus:ring-red-500/50"
                      : "focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* College & DOB Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* College */}
              <div className="animate-slideInUp animation-delay-300">
                <label
                  htmlFor="college"
                  className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-300"
                >
                  College Name *
                </label>
                <div className="relative group">
                  <FaSchool className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-500 transition-colors duration-200 group-focus-within:text-blue-400" />
                  <Input
                    id="college"
                    type="text"
                    placeholder="University of Example"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className={`pl-10 bg-slate-900/50 border-slate-700 text-white text-sm sm:text-base py-5 sm:py-6 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 hover:border-slate-500 ${
                      errors.college
                        ? "border-red-500 focus:ring-red-500/50"
                        : "focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.college && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {errors.college}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="animate-slideInUp animation-delay-350">
                <label
                  htmlFor="dob"
                  className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-300"
                >
                  Date of Birth *
                </label>
                <div className="relative group">
                  <FaCalendarAlt className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-500 transition-colors duration-200 group-focus-within:text-blue-400" />
                  <Input
                    id="dob"
                    type="date"
                    placeholder="YYYY-MM-DD"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`pl-10 bg-slate-900/50 border-slate-700 text-white text-sm sm:text-base py-5 sm:py-6 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 hover:border-slate-500 ${
                      errors.dob
                        ? "border-red-500 focus:ring-red-500/50"
                        : "focus:border-blue-500"
                    } text-slate-400`} // Added text-slate-400 for placeholder feel
                  />
                </div>
                {errors.dob && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {errors.dob}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="animate-slideInUp animation-delay-550">
              <label
                htmlFor="email"
                className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-300"
              >
                Email address *
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

            {/* Password */}
            <div className="animate-slideInUp animation-delay-600">
              <label
                htmlFor="password"
                className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-300"
              >
                Password *
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

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ease-in-out ${
                          passwordStrength === "weak"
                            ? "bg-red-500 w-1/3"
                            : passwordStrength === "good"
                            ? "bg-yellow-500 w-2/3"
                            : "bg-green-500 w-full"
                        }`}
                      ></div>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength === "weak"
                          ? "text-red-500"
                          : passwordStrength === "good"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {passwordStrength.charAt(0).toUpperCase() +
                        passwordStrength.slice(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center animate-slideInUp animation-delay-650">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-3 w-3 sm:h-4 sm:w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 transition-colors duration-200"
              />
              <label
                htmlFor="terms"
                className="ml-2 text-xs sm:text-sm text-slate-400"
              >
                I accept the{" "}
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">
                {errors.terms}
              </p>
            )}

            <Button
              type="submit"
              className="mt-4 bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-blue-500/50 animate-scaleIn animation-delay-700 text-sm sm:text-base py-5 sm:py-6"
            >
              Create Account
            </Button>

            <div className="my-4 sm:my-6 flex items-center animate-fadeIn animation-delay-750">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="mx-3 sm:mx-4 text-xs sm:text-sm text-slate-500">
                OR
              </span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>

            <Button
              onClick={handleGoogleSignup}
              className="flex w-full items-center justify-center gap-2 bg-white text-slate-800 hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] animate-scaleIn animation-delay-800 text-sm sm:text-base py-5 sm:py-6"
            >
              <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5" />
              Sign up with Google
            </Button>

            <div className="grid grid-cols-3 gap-2 mt-3 sm:mt-4 animate-fadeIn animation-delay-850">
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

            <p className="text-center text-xs sm:text-sm text-slate-400 mt-4 animate-fadeIn animation-delay-900">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Right side - Image/Branding */}
        <div className="hidden bg-slate-950 lg:block animate-slideInRight animation-delay-300">
          <div className="flex h-full flex-col items-center justify-start p-8 pt-16 sm:pt-24 text-center">
            {/* Logo with proper spacing */}
            <div className="flex justify-center animate-scaleIn animation-delay-450">
              <div className="relative h-20 w-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-slate-800 animate-pulse-slow"></div>
                <Image
                  src="/socialverse_logo.png"
                  alt="SociaVerse Logo"
                  width={80}
                  height={80}
                  className="relative z-10 drop-shadow-xl rounded-full object-cover"
                />
              </div>
            </div>

            {/* Professional heading */}
            <h2 className="mt-4 mb-3 text-3xl font-bold text-white animate-slideInUp animation-delay-600">
              Join SociaVerse
            </h2>

            {/* Description */}
            <p className="mb-8 text-slate-300 animate-slideInUp animation-delay-750 max-w-md">
              Your exclusive social network to connect, share, and discover on
              campus.
            </p>

            {/* Feature list with professional styling */}
            <div className="space-y-4 w-full max-w-md">
              <div className="flex items-center space-x-3 transition-all duration-300 hover:translate-x-1 animate-slideInLeft animation-delay-600 bg-slate-800/40 p-3 rounded-lg">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-left text-slate-200">
                  Connect with students from your college
                </p>
              </div>

              <div className="flex items-center space-x-3 transition-all duration-300 hover:translate-x-1 animate-slideInLeft animation-delay-750 bg-slate-800/40 p-3 rounded-lg">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-left text-slate-200">
                  Discover events and activities on campus
                </p>
              </div>

              <div className="flex items-center space-x-3 transition-all duration-300 hover:translate-x-1 animate-slideInLeft animation-delay-900 bg-slate-800/40 p-3 rounded-lg">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13H2m6 0h4m2 0h2m-6 4v-4m0 0h-2m2 0h2"
                    />
                  </svg>
                </div>
                <p className="text-left text-slate-200">
                  Build your academic and social network
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}