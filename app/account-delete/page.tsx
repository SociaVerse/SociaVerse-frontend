"use client"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { motion } from "framer-motion"
import { UserX, Mail, Smartphone, AlertTriangle, ShieldCheck, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AccountDeletePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 relative overflow-hidden py-24 px-6 sm:px-12">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundBeams className="opacity-40" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button asChild variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-900 -ml-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 mb-4">
            <UserX className="w-12 h-12 text-rose-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-orange-400 tracking-tight">
            Account Deletion
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            We are sorry to see you go. If you wish to delete your SociaVerse account, please review the methods below. Deletion is permanent and cannot be undone.
          </p>
        </motion.header>

        {/* WARNING SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-red-950/20 border border-red-500/30 rounded-3xl p-6 md:p-8 flex items-start gap-4"
        >
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-red-200">What Happens When You Delete Your Account?</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400 text-sm md:text-base">
              <li>Your personal profile (name, username, email, avatar, and bio) is permanently deleted.</li>
              <li>All your post history, photos, videos, comments, and private messages are wiped from our active servers.</li>
              <li>Your follower and following lists are cleared.</li>
              <li>Your wallet balance (including all Gold and Blue coins) and transaction records are permanently deleted.</li>
              <li>You will no longer be able to log in to the SociaVerse platform.</li>
            </ul>
          </div>
        </motion.section>

        {/* METHODS SECTION */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* METHOD 1: IN-APP */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all rounded-3xl p-6 md:p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 w-fit">
                <Smartphone className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-100">
                Method 1: In-App Deletion
              </h2>
              <p className="text-indigo-300 font-semibold text-sm">Recommended &amp; Instant</p>
              <p className="text-slate-400 text-sm md:text-base">
                You can delete your account instantly directly from within the SociaVerse mobile application:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-slate-400 text-sm md:text-base">
                <li>Open the <strong>SociaVerse app</strong> on your mobile device.</li>
                <li>Go to your <strong>Profile</strong> tab (located in the bottom navigation bar).</li>
                <li>Tap on <strong>Settings</strong> or edit your profile.</li>
                <li>Select the <strong>Delete Account</strong> option at the bottom.</li>
                <li>Confirm your request to complete the deletion process.</li>
              </ol>
            </div>
          </motion.div>

          {/* METHOD 2: EMAIL REQUEST */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all rounded-3xl p-6 md:p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 w-fit">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-100">
                Method 2: Email Request
              </h2>
              <p className="text-blue-300 font-semibold text-sm">Processed within 3-5 Business Days</p>
              <p className="text-slate-400 text-sm md:text-base">
                If you do not have the app installed or cannot access your account, you can request manual deletion via email:
              </p>
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-2">
                <p className="text-sm text-slate-400">
                  Send an email from your <strong>registered email address</strong> to:
                </p>
                <p className="font-mono text-center text-rose-400 select-all font-bold text-base md:text-lg break-all">
                  sociaverse7@gmail.com
                </p>
              </div>
              <div className="space-y-2 text-slate-400 text-xs md:text-sm">
                <p className="font-semibold text-slate-300">Please include in your email:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your SociaVerse username</li>
                  <li>Your registered email address</li>
                  <li>A clear statement requesting permanent deletion</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SECURITY & DATA CONTROL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-slate-900/20 border border-slate-800 rounded-3xl p-6 text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-5 h-5" />
            Your Data Control Rights
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            In compliance with our Privacy Policy and international data rights regulations, we respect your right to decide how your personal data is handled. Once you delete your account or send a request, we will ensure all personal identifier links are permanently severed.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center pt-8 text-slate-500 text-sm"
        >
          <p>Have questions or need assistance? Contact us at <a href="mailto:support@sociaverse.com" className="text-indigo-400 hover:underline">support@sociaverse.com</a></p>
        </motion.div>
      </div>
    </div>
  )
}
