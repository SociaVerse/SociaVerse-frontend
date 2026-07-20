"use client"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { motion } from "framer-motion"
import { ScrollText, Users, Shield, BookOpen, AlertCircle, Scale, Gavel, Coins, Mail } from "lucide-react"

export default function TermsOfService() {
  const sections = [
    {
      icon: <ScrollText className="w-6 h-6 text-indigo-400" />,
      title: "1. Acceptance of Terms",
      content: "By creating an account, registering, or accessing SociaVerse, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our services."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "2. Account Registration & Security",
      content: "You must be at least 18 years old to use this platform. By registering or using SociaVerse, you represent and warrant that you are at least 18 years of age. You agree to provide accurate and complete registration details. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      title: "3. User Content & Conduct",
      content: (
        <>
          <p className="mb-2">You retain ownership of any posts, comments, media, or other content you upload to SociaVerse. However, you grant SociaVerse a worldwide, non-exclusive, royalty-free license to host, display, and distribute your content.</p>
          <p>You agree not to upload content that is illegal, defamatory, abusive, hateful, or infringes on any third-party rights. We reserve the right to remove any content at our sole discretion.</p>
        </>
      )
    },
    {
      icon: <Coins className="w-6 h-6 text-yellow-400" />,
      title: "4. Tokens, Coins & Wallet",
      content: (
        <>
          <p className="mb-2">SociaVerse features Blue and Gold coins as part of its interactive marketplace, rewards, and predictions. These coins represent virtual platform values:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
            <li><strong className="text-slate-200">Blue Coins:</strong> Used primarily for prediction participation and engagement rewards.</li>
            <li><strong className="text-slate-200">Gold Coins:</strong> Used for premium marketplace items and rewards. Transactions are subject to withdrawal requests, which are processed according to verification protocols (KYC).</li>
          </ul>
        </>
      )
    },
    {
      icon: <Gavel className="w-6 h-6 text-purple-400" />,
      title: "5. Account Termination",
      content: "We reserve the right to suspend or terminate your account and access to the platform at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests."
    },
    {
      icon: <Scale className="w-6 h-6 text-rose-400" />,
      title: "6. Limitation of Liability",
      content: "SociaVerse is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties, express or implied, regarding platform availability, accuracy of information, or freedom from errors. To the fullest extent permitted by law, SociaVerse shall not be liable for any indirect, incidental, or consequential damages."
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-amber-400" />,
      title: "7. Changes to Terms",
      content: "We may revise these Terms from time to time. The most current version will always be posted in the app. Your continued use of the platform after changes become effective constitutes your acceptance of the new Terms."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 relative overflow-hidden py-24 px-6 sm:px-12">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundBeams className="opacity-40" />
      </div>
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-4">
            <ScrollText className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
            Last Updated: May 2026
          </p>
        </motion.header>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-colors rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5 flex-shrink-0">
                  {section.icon}
                </div>
                <div className="space-y-3 pt-1 w-full">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-100">
                    {section.title}
                  </h2>
                  <div className="text-slate-400 leading-relaxed text-sm md:text-base">
                    {section.content}
                  </div>
                </div>
              </div>
            </motion.section>
          ))}
        </div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center pt-8 text-slate-500 text-sm"
        >
            <p className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              If you have any questions regarding these Terms, please contact us at: <a href="mailto:sociaverse7@gmail.com" className="text-indigo-400 hover:underline">sociaverse7@gmail.com</a>
            </p>
        </motion.div>
      </div>
    </div>
  )
}
