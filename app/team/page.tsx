"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Mail, ExternalLink, Sparkles } from "lucide-react"
import Link from "next/link"

const teamMembers = [
    {
        name: "Yashdeep",
        role: "Chief Executive Officer",
        shortRole: "CEO",
        bio: "Visionary leader steering SociaVerse towards a digital future, with a passion for innovation and community building.",
        image: "/Yash.jpg",
        color: "from-blue-500 to-indigo-600",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
        delay: 0.1,
        socials: {
            twitter: "n/a",
            linkedin: "https://www.linkedin.com/in/yashdeep-singh-01b91a257/",
            mail: "abyash14@gmail.com"
        }
    },
    {
        name: "Waqas",
        role: "Chief Marketing Officer",
        shortRole: "CMO",
        bio: "Mastermind behind SociaVerse's growth and community engagement.",
        image: "/Waqas.jpeg",
        color: "from-amber-500 to-orange-600",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
        delay: 0.2,
        socials: {
            twitter: "#",
            linkedin: "#",
            mail: "#"
        }
    },
    {
        name: "Sparsh",
        role: "Chief Technology Officer",
        shortRole: "CTO",
        bio: "Architecting the robust and secure infrastructure of SociaVerse.",
        image: "/Sparsh.jpeg",
        color: "from-emerald-400 to-teal-600",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]",
        delay: 0.3,
        socials: {
            github: "#",
            linkedin: "#",
            mail: "#"
        }
    }
]

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden relative selection:bg-blue-500/30">

            {/* Optimized Background Elements (Static gradients) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.05)_0%,transparent_70%)] mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,transparent_70%)] mix-blend-screen" />
            </div>

            <main className="container mx-auto px-4 pt-48 pb-32 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-center mb-24 flex flex-col items-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 border border-white/10 text-white text-xs font-bold tracking-widest mb-8 shadow-lg uppercase relative overflow-hidden group"
                    >
                        The ArchiteXts
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-[1.1] relative group">
                        <span className="inline-block whitespace-nowrap">
                            {"Architecting".split("").map((char, index) => (
                                <motion.span
                                    key={`text1-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.04 + 0.3 }}
                                    className="inline-block"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                        <br className="hidden md:block" />
                        <span className="inline-block whitespace-nowrap">
                            {" The ".split("").map((char, index) => (
                                <motion.span
                                    key={`text2-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: ("Architecting".length + index) * 0.04 + 0.3 }}
                                    className="inline-block"
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </span>
                        <span className="inline-block whitespace-nowrap">
                            {"Future".split("").map((char, index) => (
                                <motion.span
                                    key={`text3-${index}`}
                                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ duration: 0.5, delay: ("Architecting The ".length + index) * 0.04 + 0.3 }}
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 inline-block relative"
                                >
                                    {char}
                                </motion.span>
                            ))}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 inline-block relative">
                                .
                                {/* CSS Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-shine transition-all duration-1000 w-1/2 h-full opacity-0 group-hover:opacity-100 pointer-events-none" />
                            </span>
                        </span>
                    </h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Meet the radical minds working tirelessly to forge a decentralized, connected universe for students worldwide.
                    </motion.p>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto mb-32">
                    {teamMembers.map((member) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
                            transition={{ duration: 0.5, delay: member.delay, ease: "easeOut" }}
                            className={`group relative h-full rounded-[2.5rem] ${member.glowColor} transition-all duration-300`}
                        >
                            {/* Inner Content Area - Pure CSS Hover Animations */}
                            <div className="relative h-full bg-slate-900/40 border border-slate-800 rounded-[2.5rem] z-10 overflow-hidden transition-all duration-300 group-hover:bg-slate-900/80 hover:-translate-y-2 group-hover:border-slate-700">

                                <div className="p-8 flex flex-col items-center text-center h-full">

                                    {/* Floating Role Badge */}
                                    <div className="absolute top-6 left-6 transition-transform duration-300 group-hover:scale-110 origin-top-left">
                                        <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${member.color} text-white text-xs font-black tracking-widest uppercase shadow-lg`}>
                                            {member.shortRole}
                                        </div>
                                    </div>

                                    {/* Avatar Container */}
                                    <div className="relative mb-8 mt-10">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${member.color} blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500 rounded-full`}></div>
                                        <div className="w-40 h-40 rounded-full p-1.5 bg-slate-950 relative z-10 shadow-xl transition-transform duration-500 group-hover:scale-105">
                                            <div className={`w-full h-full rounded-full bg-gradient-to-br ${member.color} p-[2px]`}>
                                                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden relative">
                                                    {member.image ? (
                                                        <img
                                                            src={member.image}
                                                            alt={member.name}
                                                            className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500 ease-out"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                            <span className="text-4xl text-slate-500 font-bold">{member.name[0]}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight transition-colors duration-300">
                                        {member.name}
                                    </h3>
                                    <p className={`text-transparent bg-clip-text bg-gradient-to-r ${member.color} font-bold tracking-wide mb-6 uppercase text-xs md:text-sm`}>{member.role}</p>

                                    <p className="text-slate-400 leading-relaxed mb-8 flex-1 text-sm font-medium group-hover:text-slate-300 transition-colors duration-300">
                                        {member.bio}
                                    </p>

                                    {/* Social Links */}
                                    <div className="flex items-center justify-center gap-3 mt-auto w-full pt-6 border-t border-slate-800/50">
                                        {member.socials.twitter && member.socials.twitter !== "n/a" && (
                                            <Link href={member.socials.twitter} className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all hover:-translate-y-1 hover:shadow-lg">
                                                <Twitter className="w-4 h-4" />
                                            </Link>
                                        )}
                                        {member.socials.linkedin && member.socials.linkedin !== "n/a" && (
                                            <Link href={member.socials.linkedin} className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all hover:-translate-y-1 hover:shadow-lg">
                                                <Linkedin className="w-4 h-4" />
                                            </Link>
                                        )}
                                        {member.socials.github && member.socials.github !== "n/a" && (
                                            <Link href={member.socials.github} className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all hover:-translate-y-1 hover:shadow-lg">
                                                <Github className="w-4 h-4" />
                                            </Link>
                                        )}
                                        {member.socials.mail && member.socials.mail !== "n/a" && (
                                            <Link href={member.socials.mail} className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all hover:-translate-y-1 hover:shadow-lg">
                                                <Mail className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Join Us CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center relative max-w-3xl mx-auto"
                >
                    <div className="absolute inset-x-0 -top-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                    <h2 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight">Ready to join the SociaVerse?</h2>

                    <Link href="/join-waitlist" className="relative group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-extrabold text-[15px] md:text-lg rounded-[2rem] overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1 duration-300">
                        <span className="relative z-10">Join the Waitlist</span>
                        <ExternalLink className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </Link>
                </motion.div>
            </main>
        </div>
    )
}
