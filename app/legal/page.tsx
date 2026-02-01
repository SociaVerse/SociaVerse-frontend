"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Scale, ArrowLeft, Lock, FileText, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LegalPage() {
    const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms")

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">

            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900">
                <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Button asChild variant="ghost" className="text-slate-400 hover:text-white -ml-4">
                        <Link href="/">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                    <div className="font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        SociaVerse Legal Center
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full max-w-4xl mx-auto px-4 pt-32 pb-20 relative z-10">

                {/* Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Transparency &amp; Trust
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        We believe in open communication. Here's everything you need to know about how we operate and handle your data.
                    </p>
                </motion.div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="grid grid-cols-2 p-1.5 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-md relative">
                        <button
                            onClick={() => setActiveTab("terms")}
                            className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-colors z-10 ${activeTab === "terms" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            {activeTab === "terms" && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative flex items-center gap-2">
                                <Scale className="w-4 h-4" /> Terms of Service
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab("privacy")}
                            className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-colors z-10 ${activeTab === "privacy" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            {activeTab === "privacy" && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-purple-600 rounded-xl shadow-lg shadow-purple-500/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Privacy Policy
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl"
                >
                    {activeTab === "terms" ? <TermsContent /> : <PrivacyContent />}
                </motion.div>

                {/* Footer Note */}
                <div className="text-center mt-12 text-slate-500 text-sm">
                    Last updated: January 22, 2026. Questions? Contact legal@sociaverse.com
                </div>
            </div>
        </div>
    )
}

function TermsContent() {
    return (
        <div className="space-y-8 prose prose-invert max-w-none text-slate-300">
            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Terms of Service</h2>
                    <p className="text-slate-400 m-0 text-lg">The rules of the road for using SociaVerse.</p>
                </div>
            </div>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">1. Acceptance of Terms</h3>
                <p>
                    By accessing or using SociaVerse ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">2. User Conduct &amp; Safety</h3>
                <p>
                    SociaVerse is a community-driven platform. We strictly prohibit:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Harassment, bullying, or hate speech.</li>
                    <li>Posting illegal, violent, or sexually explicit content.</li>
                    <li>Impersonation of others or unauthorized access to accounts.</li>
                    <li>Spamming or automated data collection (scraping).</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">3. Content Ownership</h3>
                <p>
                    You retain all rights to the content you post on SociaVerse. However, by posting, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display your content solely for the purpose of operating and improving the Platform.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">4. Account Termination</h3>
                <p>
                    We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">5. Limitation of Liability</h3>
                <p>
                    SociaVerse is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform or interactions with other users.
                </p>
            </section>
        </div>
    )
}

function PrivacyContent() {
    return (
        <div className="space-y-8 prose prose-invert max-w-none text-slate-300">
            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Lock className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Privacy Policy</h2>
                    <p className="text-slate-400 m-0 text-lg">How we protect and handle your personal data.</p>
                </div>
            </div>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">1. Information We Collect</h3>
                <p>
                    We collect information to provide a better experience:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Account Info:</strong> Username, email, and profile details provided during signup.</li>
                    <li><strong>Usage Data:</strong> Interactions, posts, and engagement metrics.</li>
                    <li><strong>Device Data:</strong> IP address, browser type, and operating system for security and optimization.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">2. How We Use Your Data</h3>
                <p>
                    Your data is used strictly to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Operate and maintain the SociaVerse service.</li>
                    <li>Personalize your feed and recommendations.</li>
                    <li>Detect and prevent fraud or abuse.</li>
                    <li>Communicate with you regarding updates or support.</li>
                </ul>
                <p className="mt-4 text-purple-400 font-medium">
                    We do NOT sell your personal data to third-party advertisers.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">3. Data Security</h3>
                <p>
                    We employ industry-standard encryption and security measures to protect your unauthorized access. However, no method of transmission over the internet is 100% secure.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">4. Cookies &amp; Tracking</h3>
                <p>
                    We use essential cookies to keep you logged in and functional cookies to remember your preferences (like your theme). You can control cookie settings through your browser.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">5. Your Rights</h3>
                <p>
                    You have the right to access, correct, or delete your personal data. You can manage your account settings directly or contact us for a full data export/deletion request.
                </p>
            </section>
        </div >
    )
}
