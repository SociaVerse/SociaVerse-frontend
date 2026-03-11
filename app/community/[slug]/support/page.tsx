"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HelpCircle, MessageCircle, Mail, ChevronDown, ChevronUp } from "lucide-react"

const FAQ = [
    {
        q: "How do I join a restricted community?",
        a: "Click 'Request to Join' on the community card. The admin will review your request and approve or decline it. You'll get a notification once decided."
    },
    {
        q: "Can I create my own community?",
        a: "Yes! Click the '+ Create' button on the communities explore page. Choose a name, category, and privacy setting. You'll automatically become the admin."
    },
    {
        q: "What's the difference between public, restricted, and private?",
        a: "Public: anyone can view and join instantly. Restricted: anyone can see it, but needs admin approval to join. Private (College Only): only visible and joinable by students from the same college as the creator."
    },
    {
        q: "How do channel types work?",
        a: "Public channels: all community members can read and post. Restricted channels: all members can read, but only admins/mods can post. Private channels: invite-only, only allowed members can view or post."
    },
    {
        q: "How do I become an admin?",
        a: "An existing admin can promote you via the 'Admin Zone → Manage Members' panel in the sidebar. Admins can also demote members back to regular status."
    },
    {
        q: "Can I leave a community?",
        a: "Yes, click the 'Joined ✓' button on the community card in the explore page to leave. If you're the last admin, you must promote another member first."
    },
]

export default function SupportPage() {
    const [open, setOpen] = useState<number | null>(null)

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-24 md:pb-8 scrollbar-hide">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-blue-400" />
                        Help &amp; Support
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Frequently asked questions about communities.</p>
                </div>

                {/* FAQ */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">FAQ</h2>
                    {FAQ.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden"
                        >
                            <button
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                                onClick={() => setOpen(open === i ? null : i)}
                            >
                                <span className="text-sm font-medium text-slate-200">{item.q}</span>
                                {open === i ? (
                                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                )}
                            </button>
                            {open === i && (
                                <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                                    {item.a}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Contact */}
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-blue-400" />
                        Still need help?
                    </h2>
                    <p className="text-slate-400 text-sm mb-4">
                        If your issue isn't covered above, reach out to our team.
                    </p>
                    <a
                        href="mailto:support@sociaverse.app"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-medium"
                    >
                        <Mail className="w-4 h-4" />
                        support@sociaverse.app
                    </a>
                </div>
            </div>
        </div>
    )
}
