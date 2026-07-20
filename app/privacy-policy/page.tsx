"use client"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { motion } from "framer-motion"
import { ShieldCheck, Database, Fingerprint, LockKeyhole, Share2, FileWarning, HelpCircle, Mail } from "lucide-react"

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <Database className="w-6 h-6 text-indigo-400" />,
      title: "1. Information We Collect",
      content: (
        <>
          <p className="mb-2">We collect information that you directly provide to us, as well as information automatically generated through your platform activity:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
            <li><strong className="text-slate-200">Account Data:</strong> Full name, username, email address, password, date of birth, and location provided during registration.</li>
            <li><strong className="text-slate-200">Social Profile Info:</strong> Profile picture (avatar), bio, followers/following relations, and other details you select to display.</li>
            <li><strong className="text-slate-200">Content:</strong> Posts, photos, videos, comments, and messages sent within the application.</li>
            <li><strong className="text-slate-200">OAuth Sign-In:</strong> If you use &quot;Continue with Google&quot;, we receive basic profile info (email, name, picture) via Firebase Auth.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Fingerprint className="w-6 h-6 text-blue-400" />,
      title: "2. How We Use Your Information",
      content: (
        <>
          <p className="mb-2">We use your information for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
            <li>To authenticate and manage your user account.</li>
            <li>To customize and display your social feed, profile page, and connection suggestions.</li>
            <li>To facilitate wallet features, coin balances (Blue/Gold), marketplace listings, and prediction transactions.</li>
            <li>To verify accounts via KYC compliance processes where necessary.</li>
            <li>To send platform notifications, security alerts, and system updates.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Share2 className="w-6 h-6 text-purple-400" />,
      title: "3. Information Sharing & Disclosure",
      content: (
        <>
          <p className="mb-2">We do not sell your personal data. We may share information under the following limited circumstances:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
            <li><strong className="text-slate-200">Public Profile:</strong> Your username, posts, and display details are visible to other users depending on your privacy settings.</li>
            <li><strong className="text-slate-200">Service Providers:</strong> With third-party infrastructure hosts, authentication systems (Firebase), and database providers.</li>
            <li><strong className="text-slate-200">Legal Obligations:</strong> If required by law, regulation, or legal subpoena to comply with financial transparency or platform safety protocols.</li>
          </ul>
        </>
      )
    },
    {
      icon: <LockKeyhole className="w-6 h-6 text-rose-400" />,
      title: "4. Data Security & Storage",
      content: "We implement technical and organizational security measures to protect your data from unauthorized access, loss, or alteration. However, please note that no method of transmission over the internet or mobile network is 100% secure."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "5. Your Rights & Choices",
      content: (
        <>
          <p className="mb-2">You have control over your data:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
            <li>You can update your profile info and avatar in the App Settings.</li>
            <li>You can switch your account between Public and Private status.</li>
            <li>You can permanently delete your account through the Settings menu, which removes all associated posts, media, and records. Alternatively, you can request account deletion via email.</li>
          </ul>
        </>
      )
    },
    {
      icon: <FileWarning className="w-6 h-6 text-amber-400" />,
      title: "6. Children's Privacy (Age Restriction)",
      content: "SociaVerse is strictly restricted to users who are 18 years of age or older. We do not knowingly collect or solicit personal information from anyone under the age of 18. If we learn that we have collected personal data from a child under 18 without verification, we will deactivate the account and delete that information as quickly as possible."
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-cyan-400" />,
      title: "7. Contact Us",
      content: (
        <>
          <p className="mb-2">If you have questions or concerns regarding this Privacy Policy or our data handling practices, please reach out to us:</p>
          <p className="font-semibold text-slate-200 flex items-center gap-2 mt-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            Email: <a href="mailto:sociaverse7@gmail.com" className="text-emerald-400 hover:underline">sociaverse7@gmail.com</a>
          </p>
        </>
      )
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
            <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </motion.div>
      </div>
    </div>
  )
}
