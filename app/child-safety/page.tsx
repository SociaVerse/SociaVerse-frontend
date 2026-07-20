"use client"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { motion } from "framer-motion"
import { ShieldAlert, AlertOctagon, FileWarning, Eye, ShieldAlert as EnforcementIcon, Scale, Users, Shield, Mail, CalendarRange, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ChildSafetyPage() {
  const sections = [
    {
      icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
      title: "1. Introduction",
      content: (
        <>
          <p className="mb-2">
            SociaVerse is deeply committed to providing a safe, secure, and respectful environment for our campus communities. We maintain a strict, zero-tolerance policy against any form of Child Sexual Exploitation and Abuse (CSAE) and Child Sexual Abuse Material (CSAM).
          </p>
          <p>
            Our dedication to child safety is absolute, and we employ proactive monitoring, robust reporting channels, and direct cooperation with international law enforcement to protect minors.
          </p>
        </>
      )
    },
    {
      icon: <AlertOctagon className="w-6 h-6 text-rose-500" />,
      title: "2. Zero-Tolerance Policy",
      content: (
        <p>
          Any behavior or content that involves, facilitates, or promotes the sexual abuse, exploitation, grooming, trafficking, or sexualization of minors is strictly prohibited. Violating this policy will result in immediate termination of the offending account, preservation of evidence, and direct referral to appropriate legal authorities.
        </p>
      )
    },
    {
      icon: <FileWarning className="w-6 h-6 text-amber-400" />,
      title: "3. Prohibited Content",
      content: (
        <>
          <p className="mb-2">Prohibited content and actions include, but are not limited to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
            <li><strong className="text-slate-200">Child Sexual Abuse Material (CSAM):</strong> Creating, uploading, sharing, storing, or linking to CSAM.</li>
            <li><strong className="text-slate-200">Grooming Behavior:</strong> Direct or indirect actions intended to build a relationship with a minor to prepare them for sexual exploitation or abuse.</li>
            <li><strong className="text-slate-200">Sexual Exploitation:</strong> Pressuring or coercing minors into sexual activity or depicting minors in sexually suggestive or explicit situations.</li>
            <li><strong className="text-slate-200">Solicitation:</strong> Any attempt to solicit sexual content or interactions from minors.</li>
            <li><strong className="text-slate-200">Trafficking of Minors:</strong> Advertising or facilitating child trafficking, recruitment, or exploitation.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Eye className="w-6 h-6 text-sky-400" />,
      title: "4. Reporting Mechanisms",
      content: (
        <>
          <p className="mb-2">
            We provide multiple ways for our community to immediately flag potential policy violations:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
            <li><strong className="text-slate-200">In-App Flagging:</strong> You can report posts, comments, profiles, and messages directly inside the SociaVerse application. Every post has a &quot;Report&quot; button to alert moderation teams.</li>
            <li><strong className="text-slate-200">Direct Email:</strong> You can report child safety concerns directly by emailing our response team at <a href="mailto:sociaverse7@gmail.com" className="text-rose-400 hover:underline">sociaverse7@gmail.com</a>.</li>
          </ul>
        </>
      )
    },
    {
      icon: <EnforcementIcon className="w-6 h-6 text-indigo-400" />,
      title: "5. Moderation & Enforcement",
      content: (
        <>
          <p className="mb-2">
            All reported flags undergo a rigorous evaluation process:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
            <li><strong className="text-slate-200">Content Review:</strong> Reports are evaluated by trained moderation personnel and automated inspection systems.</li>
            <li><strong className="text-slate-200">Immediate Removal:</strong> Any content confirmed to violate our child safety standards is taken down immediately.</li>
            <li><strong className="text-slate-200">Account Enforcement:</strong> Offending accounts are suspended immediately, permanently banned, and prevented from creating future accounts.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Scale className="w-6 h-6 text-purple-400" />,
      title: "6. Cooperation with Authorities",
      content: (
        <p>
          SociaVerse cooperates fully with national and international law enforcement agencies, including reporting CSAM/CSAE incidents directly to the National Center for Missing &amp; Exploited Children (NCMEC) and local police departments. We will preserve relevant telemetry data, IP addresses, and metadata to assist in investigations as required by applicable laws.
        </p>
      )
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      title: "7. Age Requirements",
      content: (
        <p>
          SociaVerse is designed for campus and university-level connection. You must be at least <strong className="text-slate-100">18 years of age or older</strong> to create an account and access the platform. We do not knowingly collect, request, or maintain information from anyone under this age limit.
        </p>
      )
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "8. Privacy & Protection",
      content: (
        <>
          <p className="mb-2">
            We are dedicated to safeguarding personal data:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
            <li>Personal information of minors must never be shared, stored, or distributed on our platform without explicit, validated authorization.</li>
            <li>We utilize automated scanning tools alongside user reports to proactively identify and flag potentially harmful content, ensuring secure data handling protocols.</li>
            <li>SociaVerse encourages educational, respectful discussion and responsible online behavior. We actively promote digital citizenship across campus networks.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Mail className="w-6 h-6 text-cyan-400" />,
      title: "9. Contact Information",
      content: (
        <>
          <p className="mb-2">If you have any questions or would like to report a safety concern, please get in touch:</p>
          <ul className="list-none space-y-2 mt-2 text-slate-400">
            <li><strong>Safety Email:</strong> <a href="mailto:sociaverse7@gmail.com" className="text-cyan-400 hover:underline">sociaverse7@gmail.com</a></li>
            <li><strong>Support Email:</strong> <a href="mailto:sociaverse7@gmail.com" className="text-cyan-400 hover:underline">sociaverse7@gmail.com</a></li>
            <li><strong>Website URL:</strong> <a href="https://sociaverse.app" className="text-cyan-400 hover:underline">https://sociaverse.app</a></li>
          </ul>
        </>
      )
    },
    {
      icon: <CalendarRange className="w-6 h-6 text-teal-400" />,
      title: "10. Policy Updates",
      content: (
        <p>
          These Child Safety Standards are reviewed and updated periodically to align with evolving legal frameworks, Google Play Developer policies, and security best practices. Any updates will be published directly on this page.
        </p>
      )
    }
  ]

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
          <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-2xl border border-red-500/20 mb-4">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-orange-400 tracking-tight">
            Child Safety Standards
          </h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
            Last Updated: May 2026
          </p>
        </motion.header>

        {/* Content */}
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

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center pt-8 text-slate-500 text-sm"
        >
          <p>
            For further inquiries regarding platform safety, please contact the Child Safety response team.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
