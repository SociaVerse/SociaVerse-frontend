"use client"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { motion } from "framer-motion"
import { ScrollText, Users, Shield, BookOpen, AlertCircle, Scale, Building2, Gavel } from "lucide-react"

export default function TermsOfService() {
  const sections = [
    {
      icon: <ScrollText className="w-6 h-6 text-indigo-400" />,
      title: "1. Agreement to Terms",
      content: "By accessing or using SociaVerse, a platform dedicated to university events and student communities, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "2. Description of Service",
      content: "SociaVerse provides a digital campus platform that allows students to discover events, share study materials, interact in communities, and connect with peers both globally and within their specific universities."
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "3. User Accounts & Registration",
      content: (
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>You must provide accurate, complete, and current information when registering for an account.</li>
          <li>You are responsible for safeguarding your login credentials and tracking any activity under your account.</li>
          <li>You must immediately notify SociaVerse of any unauthorized use or security breaches regarding your account.</li>
        </ul>
      )
    },
    {
      icon: <Building2 className="w-6 h-6 text-purple-400" />,
      title: "4. University Affiliation & Verification",
      content: "Certain features of SociaVerse, such as internal college events and study hubs, are restricted based on your declared university affiliation. You agree not to misrepresent your educational institution. SociaVerse reserves the right to verify your academic status and revoke college-specific privileges if fraudulent activity is detected."
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-red-400" />,
      title: "5. Community Guidelines & Acceptable Use",
      content: (
        <>
          <p className="mb-2">You agree not to use the platform to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.</li>
            <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation.</li>
            <li>Upload or distribute virues, malware, or any other malicious code.</li>
            <li>Harvest or collect email addresses or other contact information of other users without their consent.</li>
            <li>Distribute copyrighted academic materials to which you do not have distribution rights.</li>
          </ul>
        </>
      )
    },
    {
      icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
      title: "6. Content Ownership & Licenses",
      content: "You retain your rights to any content you submit, post, or display on or through SociaVerse. By submitting content (including event details, notes, and profile information), you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content in any and all media or distribution methods."
    },
    {
      icon: <Gavel className="w-6 h-6 text-rose-400" />,
      title: "7. Termination",
      content: "We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability."
    },
    {
      icon: <Scale className="w-6 h-6 text-amber-400" />,
      title: "8. Changes to Terms",
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice via the platform or email before any material changes take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms."
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
            Last Updated: March 2026
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
                <div className="space-y-3 pt-1">
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
            <p>If you have any questions about these Terms, please contact us.</p>
        </motion.div>
      </div>
    </div>
  )
}
