"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Scale, ArrowLeft, Lock, FileText, Mail } from "lucide-react"
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
                    <div className="font-bold bg-gradient-to-r from-blue-400 to-purple-505 bg-clip-text text-transparent">
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
                        We believe in open communication. Here&apos;s everything you need to know about how we operate and handle your data.
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
                    Last updated: May 2026. Questions? Contact <a href="mailto:sociaverse7@gmail.com" className="text-blue-400 hover:underline">sociaverse7@gmail.com</a>
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
                    By creating an account, registering, or accessing SociaVerse, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our services.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">2. Account Registration &amp; Security</h3>
                <p>
                    You must be at least 18 years old to use this platform. By registering or using SociaVerse, you represent and warrant that you are at least 18 years of age. You agree to provide accurate and complete registration details. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">3. User Content &amp; Conduct</h3>
                <p>
                    You retain ownership of any posts, comments, media, or other content you upload to SociaVerse. However, you grant SociaVerse a worldwide, non-exclusive, royalty-free license to host, display, and distribute your content.
                </p>
                <p className="mt-4">
                    You agree not to upload content that is illegal, defamatory, abusive, hateful, or infringes on any third-party rights. We reserve the right to remove any content at our sole discretion.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">4. Tokens, Coins &amp; Wallet</h3>
                <p>
                    SociaVerse features Blue and Gold coins as part of its interactive marketplace, rewards, and predictions. These coins represent virtual platform values:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Blue Coins:</strong> Used primarily for prediction participation and engagement rewards.</li>
                    <li><strong>Gold Coins:</strong> Used for premium marketplace items and rewards. Transactions are subject to withdrawal requests, which are processed according to verification protocols (KYC).</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">5. Account Termination</h3>
                <p>
                    We reserve the right to suspend or terminate your account and access to the platform at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">6. Limitation of Liability</h3>
                <p>
                    SociaVerse is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties, express or implied, regarding platform availability, accuracy of information, or freedom from errors. To the fullest extent permitted by law, SociaVerse shall not be liable for any indirect, incidental, or consequential damages.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">7. Changes to Terms</h3>
                <p>
                    We may revise these Terms from time to time. The most current version will always be posted in the app. Your continued use of the platform after changes become effective constitutes your acceptance of the new Terms.
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
                    We collect information that you directly provide to us, as well as information automatically generated through your platform activity:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Account Data:</strong> Full name, username, email address, password, date of birth, and location provided during registration.</li>
                    <li><strong>Social Profile Info:</strong> Profile picture (avatar), bio, followers/following relations, and other details you select to display.</li>
                    <li><strong>Content:</strong> Posts, photos, videos, comments, and messages sent within the application.</li>
                    <li><strong>OAuth Sign-In:</strong> If you use &quot;Continue with Google&quot;, we receive basic profile info (email, name, picture) via Firebase Auth.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">2. How We Use Your Information</h3>
                <p>
                    We use your information for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>To authenticate and manage your user account.</li>
                    <li>To customize and display your social feed, profile page, and connection suggestions.</li>
                    <li>To facilitate wallet features, coin balances (Blue/Gold), marketplace listings, and prediction transactions.</li>
                    <li>To verify accounts via KYC compliance processes where necessary.</li>
                    <li>To send platform notifications, security alerts, and system updates.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">3. Information Sharing &amp; Disclosure</h3>
                <p>
                    We do not sell your personal data. We may share information under the following limited circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Public Profile:</strong> Your username, posts, and display details are visible to other users depending on your privacy settings.</li>
                    <li><strong>Service Providers:</strong> With third-party infrastructure hosts, authentication systems (Firebase), and database providers.</li>
                    <li><strong>Legal Obligations:</strong> If required by law, regulation, or legal subpoena to comply with financial transparency or platform safety protocols.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">4. Data Security &amp; Storage</h3>
                <p>
                    We implement technical and organizational security measures to protect your data from unauthorized access, loss, or alteration. However, please note that no method of transmission over the internet or mobile network is 100% secure.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">5. Your Rights &amp; Choices</h3>
                <p>
                    You have control over your data:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>You can update your profile info and avatar in the App Settings.</li>
                    <li>You can switch your account between Public and Private status.</li>
                    <li>You can permanently delete your account through the Settings menu, which removes all associated posts, media, and records. Alternatively, you can request account deletion via email.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">6. Children&apos;s Privacy (Age Restriction)</h3>
                <p>
                    SociaVerse is strictly restricted to users who are 18 years of age or older. We do not knowingly collect or solicit personal information from anyone under the age of 18. If we learn that we have collected personal data from a child under 18 without verification, we will deactivate the account and delete that information as quickly as possible.
                </p>
            </section>

            <section>
                <h3 className="text-white text-xl font-bold mb-4">7. Contact Us</h3>
                <p>
                    If you have questions or concerns regarding this Privacy Policy or our data handling practices, please reach out to us:
                </p>
                <p className="mt-4 flex items-center gap-2 font-semibold text-white">
                    <Mail className="w-4 h-4 text-purple-400" />
                    Email: <a href="mailto:sociaverse7@gmail.com" className="text-purple-400 hover:underline">sociaverse7@gmail.com</a>
                </p>
            </section>
        </div>
    )
}
