"use client"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { motion } from "framer-motion"
import { ShieldCheck, Database, Fingerprint, LockKeyhole, Share2, FileWarning, HelpCircle } from "lucide-react"

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <HelpCircle className="w-6 h-6 text-indigo-400" />,
      title: "1. Introduction",
      content: "Welcome to SociaVerse. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you."
    },
    {
      icon: <Database className="w-6 h-6 text-blue-400" />,
      title: "2. The Data We Collect About You",
      content: (
        <>
          <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
            <li><strong className="text-slate-200">Identity Data:</strong> first name, last name, username, and date of birth.</li>
            <li><strong className="text-slate-200">Contact Data:</strong> email address.</li>
            <li><strong className="text-slate-200">Academic Data:</strong> your college, university, or educational institution affiliation.</li>
            <li><strong className="text-slate-200">Profile Data:</strong> your purchases or orders made by you, your interests, preferences, and biographical information.</li>
            <li><strong className="text-slate-200">Usage Data:</strong> information about how you use our website, events, and study hubs.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Fingerprint className="w-6 h-6 text-emerald-400" />,
      title: "3. How We Use Your Personal Data",
      content: (
        <>
          <p className="mb-2">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>To register you as a new user.</li>
            <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
            <li>To administer and protect our business and this website.</li>
            <li>To deliver relevant event content and study materials tailored to your university network.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Share2 className="w-6 h-6 text-purple-400" />,
      title: "4. University-Specific Data Sharing",
      content: "SociaVerse hosts 'University Modes' which allow posts, events, and study materials to be securely partitioned to members of your specific academic institution. By joining a university network on SociaVerse, you consent to your profile and relevant interactions being visible to other verified members of that same institution, acting under the restrictions of our visibility modes."
    },
    {
      icon: <LockKeyhole className="w-6 h-6 text-rose-400" />,
      title: "5. Data Security",
      content: "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality."
    },
    {
      icon: <FileWarning className="w-6 h-6 text-amber-400" />,
      title: "6. Data Retention",
      content: "We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the data, the potential risk of harm from unauthorised use."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      title: "7. Your Legal Rights",
      content: "Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to: Request access to your personal data, request correction of your personal data, request erasure of your personal data, object to processing of your personal data, request restriction of processing your personal data, and request transfer of your personal data."
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
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-4">
            <ShieldCheck className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 tracking-tight">
            Privacy Policy
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
            <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </motion.div>
      </div>
    </div>
  )
}
