"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Globe, Zap, Shield, ArrowRight, Activity, Users, Star, Search, MessageCircle, Heart, Wifi, Battery, Signal, Rocket, Laptop, GraduationCap, FileText, PlaySquare, Calendar, Download, Share2, ArrowUp, Repeat } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LandingCarousel } from "@/components/landing-carousel";
import { MouseSpotlight } from "@/components/mouse-spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { Meteors } from "@/components/ui/meteors";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { MouseEvent } from "react";

function PhoneMockup() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Reflection gradient movement
    const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;

        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[320px] mx-auto aspect-[9/19] bg-slate-950 rounded-[3rem] border-[4px] border-slate-700 shadow-2xl overflow-hidden cursor-pointer group perspective-1000 select-none ring-1 ring-white/10"
        >
            {/* Outer Frame Glow */}
            <div className="absolute -inset-[2px] bg-gradient-to-b from-slate-600 to-slate-900 rounded-[3.2rem] -z-10" />
            <div className="absolute -inset-[8px] bg-slate-950 rounded-[3.5rem] -z-20 shadow-2xl" />

            {/* Dynamic Island Area */}
            <div className="absolute top-0 left-0 w-full h-14 z-50 flex justify-center items-start pt-3 pointer-events-none">
                <div className="w-28 h-8 bg-black rounded-full flex items-center justify-between px-3 z-50">
                    <div className="w-2 h-2 rounded-full bg-slate-900/50" />
                    <div className="w-16 h-16 bg-black rounded-full absolute -top-8 left-1/2 -translate-x-1/2 blur-md opacity-50" />
                </div>
            </div>

            {/* Status Bar */}
            <div className="absolute top-0 left-0 w-full h-14 z-40 flex justify-between items-center px-6 pt-2 text-[10px] font-bold text-white/90">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-4 h-4" />
                </div>
            </div>

            {/* Screen Reflection */}
            <motion.div
                style={{
                    background: useTransform(
                        [glareX, glareY],
                        ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.15) 0%, transparent 60%)`
                    )
                }}
                className="absolute inset-0 pointer-events-none z-[60] mix-blend-overlay opacity-50 transition-opacity duration-300"
            />

            {/* Buttons */}
            <div className="absolute top-24 -left-[6px] w-[3px] h-8 bg-slate-700 rounded-l-md" /> {/* Mute */}
            <div className="absolute top-40 -left-[6px] w-[3px] h-14 bg-slate-700 rounded-l-md" /> {/* Vol Up */}
            <div className="absolute top-56 -left-[6px] w-[3px] h-14 bg-slate-700 rounded-l-md" /> {/* Vol Down */}
            <div className="absolute top-48 -right-[6px] w-[3px] h-20 bg-slate-700 rounded-r-md" /> {/* Power */}


            {/* App Content */}
            <div className="absolute inset-0 pt-20 px-4 bg-slate-950">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-black border border-slate-800 flex items-center justify-center overflow-hidden">
                            <img src="/logo.png" alt="SociaVerse" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-sm tracking-tight text-white">SociaVerse</span>
                    </div>
                    <Search className="w-5 h-5 text-slate-400" />
                </div>

                {/* Stories */}
                <div className="flex gap-4 mb-8 overflow-hidden pl-1">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500">
                                <div className="w-full h-full rounded-full bg-slate-900 border-2 border-slate-950" />
                            </div>
                            <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
                        </div>
                    ))}
                </div>

                {/* Feed Card */}
                <motion.div
                    className="w-full bg-slate-900/80 backdrop-blur-md rounded-3xl p-4 mb-4 border border-white/5 relative z-10 shadow-lg"
                    transformTemplate={({ z }) => `translateZ(${z})`}
                    style={{ translateZ: 10 }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700" />
                        <div className="flex-1 space-y-1.5">
                            <div className="w-24 h-2.5 bg-slate-800 rounded-sm" />
                            <div className="w-16 h-2 bg-slate-800/50 rounded-sm" />
                        </div>
                    </div>
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl mb-3 border border-white/5 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/5 blur-xl" />
                        <Zap className="w-8 h-8 text-indigo-400/50 relative z-10" />
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <div className="flex gap-4">
                            <Heart className="w-5 h-5 text-slate-500 hover:text-red-500 transition-colors" />
                            <MessageCircle className="w-5 h-5 text-slate-500 hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="w-4 h-4 bg-slate-800 rounded-full" />
                    </div>
                </motion.div>

                {/* Dynamic Notification */}
                <motion.div
                    style={{
                        x: useTransform(mouseX, [-0.5, 0.5], [15, -15]),
                        y: useTransform(mouseY, [-0.5, 0.5], [15, -15]),
                        translateZ: 40
                    }}
                    className="absolute bottom-24 left-4 right-4 bg-slate-800/95 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl z-40 flex items-center gap-3"
                >
                    <div className="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/20">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white mb-0.5">Event Starting Soon!</p>
                        <p className="text-[10px] text-slate-400 font-medium">Campus Hackathon • Room 304</p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export function LandingPage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-950 text-slate-100 overflow-hidden w-full relative">

            {/* Dynamic Backgrounds */}
            <BackgroundBeams className="opacity-40" />
            <MouseSpotlight />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0" />
            <FloatingParticles />


            {/* Hero Section */}
            <section className="relative w-full pt-36 pb-16 md:pt-40 md:pb-24 px-4 z-10 overflow-hidden">

                <div className="absolute inset-0 h-full w-full pointer-events-none">
                    <Meteors number={20} />
                </div>

                {/* Floating Background Icons & Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Ambient Glowing Orbs */}
                    <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                    <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-1000" />

                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-32 md:top-20 left-[5%] md:left-[10%] opacity-20 text-blue-500"
                    >
                        <Rocket className="w-12 h-12 md:w-16 md:h-16" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-40 right-[8%] md:right-[15%] opacity-20 text-purple-500"
                    >
                        <Laptop className="w-14 h-14 md:w-20 md:h-20" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute top-52 md:top-40 right-[2%] md:right-[5%] opacity-10 text-indigo-500"
                    >
                        <GraduationCap className="w-8 h-8 md:w-12 md:h-12" />
                    </motion.div>

                    {/* Left side floating UI Graphic */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="hidden xl:flex absolute top-[15%] left-[2%] 2xl:left-[6%] flex-col gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-md shadow-2xl z-0 w-64 opacity-80 hover:opacity-100 transition-opacity"
                    >
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white leading-tight">CS 101 Study Group</p>
                                <p className="text-xs text-slate-400">12 members active</p>
                            </div>
                        </div>
                        <div className="flex -space-x-2 px-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 overflow-hidden">
                                    <div className={`w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 opacity-${i * 20}`} />
                                </div>
                            ))}
                            <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[9px] text-slate-300 font-bold z-10">+8</div>
                        </div>
                    </motion.div>

                    {/* Right side floating UI Graphic */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="hidden xl:flex absolute bottom-[15%] right-[2%] 2xl:right-[5%] flex-col p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-md shadow-2xl z-0 w-[260px] opacity-80 hover:opacity-100 transition-opacity"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">Live Event</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">Now</span>
                        </div>
                        <p className="text-base font-bold text-white mb-1">Campus Hackathon</p>
                        <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-slate-400" /> Innovation Hub
                        </p>
                        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                            <span>Capacity</span>
                            <span className="text-blue-400">54 / 100</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 w-[54%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>
                    </motion.div>
                </div>

                <div className="container max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">

                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-md text-blue-400 text-xs font-medium mb-6 hover:bg-slate-800/80 transition-all cursor-default shadow-lg shadow-blue-500/10">
                                <Star className="w-3 h-3 fill-blue-400" />
                                <span>The Social Platform for Students</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.15]">
                                Your Campus, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 animate-gradient-x">
                                    Connected.
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Join the decentralized universe built for students. Connect with peers, find events, and build your legacy.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                {process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true' ? (
                                    <>
                                        <Button asChild className="h-11 px-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition-all shadow-lg shadow-blue-500/25 border-none">
                                            <Link href="/join-waitlist">
                                                Join Waitlist <ArrowRight className="ml-2 w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="h-11 px-8 rounded-full border-slate-700 bg-slate-900/50 backdrop-blur-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                                            <Link href="/features">
                                                View Features
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button asChild className="h-11 px-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition-all shadow-lg shadow-blue-500/25 border-none">
                                            <Link href="/signup">
                                                Get Started <ArrowRight className="ml-2 w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="h-11 px-8 rounded-full border-slate-700 bg-slate-900/50 backdrop-blur-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
                                            <Link href="/explore">
                                                Explore Features
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>

                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-500">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-950 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[10px] text-white z-${10 - i}`}>
                                            <Users className="w-3 h-3" />
                                        </div>
                                    ))}
                                </div>
                                <p>Join 10k+ students</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Visual - Interactive High-Fidelity Mockup */}
                    <div className="flex-1 relative hidden lg:flex justify-center perspective-[2000px] z-30">
                        <PhoneMockup />
                    </div>
                </div>
            </section>

            {/* Marquee - Subtle */}
            <section className="w-full py-8 bg-slate-950 border-y border-slate-900 overflow-hidden opacity-80">
                <div className="flex overflow-hidden select-none group">
                    {/* First Marquee Container */}
                    <div className="flex shrink-0 items-center justify-around gap-16 min-w-full animate-marquee whitespace-nowrap px-8">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-widest px-4">Welcome to SociaVerse</span>
                        {["IIT", "BITS", "LPU", "NFSU", "IIM", "NIT", "MIT", "IISER"].map((college, i) => (
                            <span key={i} className="text-xl font-bold text-slate-700 uppercase tracking-widest hover:text-slate-500 transition-colors">{college}</span>
                        ))}
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-widest px-4">Welcome to SociaVerse</span>
                        {["IIT", "BITS", "LPU", "NFSU", "IIM", "NIT", "MIT", "IISER"].map((college, i) => (
                            <span key={`dup-${i}`} className="text-xl font-bold text-slate-700 uppercase tracking-widest hover:text-slate-500 transition-colors">{college}</span>
                        ))}
                    </div>

                    {/* Second Marquee Container (Duplicate for seamless loop) */}
                    <div className="flex shrink-0 items-center justify-around gap-16 min-w-full animate-marquee whitespace-nowrap px-8" aria-hidden="true">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-widest px-4">Welcome to SociaVerse</span>
                        {["IIT", "BITS", "LPU", "NFSU", "IIM", "NIT", "MIT", "IISER"].map((college, i) => (
                            <span key={i} className="text-xl font-bold text-slate-700 uppercase tracking-widest hover:text-slate-500 transition-colors">{college}</span>
                        ))}
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-widest px-4">Welcome to SociaVerse</span>
                        {["IIT", "BITS", "LPU", "NFSU", "IIM", "NIT", "MIT", "IISER"].map((college, i) => (
                            <span key={`dup-${i}`} className="text-xl font-bold text-slate-700 uppercase tracking-widest hover:text-slate-500 transition-colors">{college}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Proposition Grid */}
            <section className="w-full py-20 bg-slate-900/20 z-10 relative overflow-hidden">
                {/* Ambient side blurs */}
                <div className="absolute top-[20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute top-[30%] right-[-20%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="container max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-2xl md:text-4xl font-bold mb-4">Why We Built This</h2>
                        <p className="text-slate-400 max-w-xl mx-auto text-base">
                            Existing networks are too noisy. SociaVerse is focused on your campus life.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {[
                            {
                                icon: <Globe className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />,
                                title: "Find Your Tribe",
                                description: "Connect with students who actually share your interests.",
                                gradientClass: "from-blue-500/10 via-transparent to-transparent",
                                ringClass: "group-hover:ring-blue-500/30"
                            },
                            {
                                icon: <Zap className="h-6 w-6 text-amber-400 group-hover:text-amber-300 transition-colors" />,
                                title: "Instant Collab",
                                description: "Real-time sharing of notes and ideas with zero friction.",
                                gradientClass: "from-amber-500/10 via-transparent to-transparent",
                                ringClass: "group-hover:ring-amber-500/30"
                            },
                            {
                                icon: <Shield className="h-6 w-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />,
                                title: "Verified & Safe",
                                description: "Verified student-only spaces for authentic connection.",
                                gradientClass: "from-emerald-500/10 via-transparent to-transparent",
                                ringClass: "group-hover:ring-emerald-500/30"
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`group relative w-full flex flex-col p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:bg-slate-800/40 hover:-translate-y-1 ring-1 ring-transparent ${item.ringClass} overflow-hidden shadow-lg`}
                            >
                                {/* Glowing gradient background on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Top highlight line */}
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative z-10 flex flex-col items-start text-left">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-100 mb-3 tracking-tight">{item.title}</h3>
                                    <p className="text-slate-400 text-[15px] leading-relaxed font-light">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Feed Section - Compact */}
            <section className="w-full py-20 relative z-10 overflow-hidden bg-slate-950/50">
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Campus <span className="text-blue-400">Pulse</span>
                        </h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold">
                            <Activity className="w-3 h-3" /> LIVE
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 relative z-10 max-w-5xl mx-auto">

                        {/* Column 1 */}
                        <div className="flex flex-col gap-6">

                            {/* Post 1: Resource Share (Ananya) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="p-5 md:p-6 rounded-3xl bg-slate-900/60 border border-slate-700/50 hover:border-blue-500/30 transition-all backdrop-blur-xl shadow-lg relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FileText className="w-24 h-24 text-blue-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 p-[2px]">
                                                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-sm">AV</div>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-100 text-sm flex items-center gap-1.5">Ananya V. <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md font-semibold">NLSIU Bangalore</span></p>
                                                <p className="text-xs text-slate-400">B.A. LL.B • 1h ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-300 mb-4 text-left text-sm leading-relaxed">
                                        Compiling all the landmark Supreme Court judgments we need for the upcoming Constitutional Law moot. I've highlighted the dissenting opinions too. Hope this helps everyone preparing!
                                    </p>

                                    {/* Attachment */}
                                    <div className="flex items-center gap-4 bg-slate-950/50 border border-slate-800 rounded-2xl p-3 mb-5 hover:bg-slate-800/50 transition-colors cursor-pointer group/file">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                                            <FileText className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="flex-1 overflow-hidden text-left">
                                            <p className="text-sm font-semibold text-slate-200 truncate group-hover/file:text-blue-400 transition-colors">Consti_Law_Moot_Briefs.pdf</p>
                                            <p className="text-xs text-slate-500">Document • 4.1 MB</p>
                                        </div>
                                        <div className="shrink-0 text-slate-500 pr-2">
                                            <Download className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="flex gap-1 text-slate-400 text-xs font-semibold">
                                        <button className="flex items-center gap-1.5 hover:text-blue-400 hover:bg-blue-500/10 px-3 py-1.5 rounded-full transition-all text-blue-400/80 bg-blue-500/5"><ArrowUp className="w-4 h-4" /> 312</button>
                                        <button className="flex items-center gap-1.5 hover:text-slate-200 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-all"><MessageCircle className="w-4 h-4" /> 48</button>
                                        <button className="flex items-center gap-1.5 hover:text-slate-200 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-all"><Repeat className="w-4 h-4" /> 55</button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Post 3: Event Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="p-[1px] rounded-3xl bg-gradient-to-br from-emerald-500/30 to-teal-500/10 relative overflow-hidden group shadow-lg"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent z-0"></div>
                                <div className="bg-slate-900/90 backdrop-blur-xl p-5 md:p-6 rounded-[calc(1.5rem-1px)] relative z-10 w-full h-full border border-emerald-500/20 text-left">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="bg-orange-500/10 text-orange-400 text-[10px] font-bold px-2 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
                                            <Activity className="w-3 h-3" /> Few Spots Left
                                        </div>
                                    </div>

                                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Creative Collective</p>
                                    <h3 className="text-xl font-bold text-white mb-3">Annual Campus Art & Design Mixer</h3>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {["In-Person", "Networking", "Portfolio Review"].map(tag => (
                                            <span key={tag} className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                                            <span>Attending</span>
                                            <span className="text-emerald-400">{450} / {500}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[90%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                        </div>
                                    </div>

                                    <button className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors decoration-none">
                                        RSVP Now
                                    </button>
                                </div>
                            </motion.div>

                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-6 md:mt-8">

                            {/* Post 4: Resource Share (Kavya - Video) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="p-5 md:p-6 rounded-3xl bg-slate-900/60 border border-slate-700/50 hover:border-purple-500/30 transition-all backdrop-blur-xl shadow-lg relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <PlaySquare className="w-24 h-24 text-purple-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 p-[2px]">
                                                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-sm">KS</div>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-100 text-sm flex items-center gap-1.5">Kavya S. <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-md font-semibold">NID Ahmedabad</span></p>
                                                <p className="text-xs text-slate-400">B.Des Animation • 5h ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-300 mb-4 text-left text-sm leading-relaxed">
                                        Just finished my final project rendering! Trying out some new Ghibli-style environment shading techniques in Blender. Would love some brutal feedback from the animation crowd here.
                                    </p>

                                    {/* Video Attachment Mockup */}
                                    <div className="w-full aspect-video bg-slate-950 border border-slate-800 rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden group/video cursor-pointer">
                                        {/* Mock Video Thumbnail blur */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-blue-900/40 to-purple-900/40 opacity-80 mix-blend-screen scale-110 blur-xl group-hover/video:scale-125 transition-transform duration-700"></div>
                                        <div className="absolute inset-0 bg-slate-900/40 group-hover/video:bg-slate-900/20 transition-colors"></div>
                                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 z-10 group-hover/video:scale-110 transition-transform">
                                            <PlaySquare className="w-5 h-5 text-white ml-1" />
                                        </div>
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                            <PlaySquare className="w-3 h-3 text-purple-400" />
                                            <span className="text-[10px] font-medium text-slate-200">ghibli_render_v2.mp4</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-1 text-slate-400 text-xs font-semibold">
                                        <button className="flex items-center gap-1.5 hover:text-purple-400 hover:bg-purple-500/10 px-3 py-1.5 rounded-full transition-all text-purple-400/80 bg-purple-500/5"><ArrowUp className="w-4 h-4" /> 540</button>
                                        <button className="flex items-center gap-1.5 hover:text-slate-200 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-all"><MessageCircle className="w-4 h-4" /> 89</button>
                                        <button className="flex items-center gap-1.5 hover:text-slate-200 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-all"><Repeat className="w-4 h-4" /> 102</button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Post 2: Collaboration Request (Rohan) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="p-5 md:p-6 rounded-3xl bg-slate-900/60 border border-slate-700/50 hover:border-amber-500/30 transition-all backdrop-blur-xl shadow-lg relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users className="w-24 h-24 text-amber-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-[2px]">
                                                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-sm">RK</div>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-100 text-sm flex items-center gap-1.5">Rohan K. <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-md font-semibold">NMIMS Mumbai</span></p>
                                                <p className="text-xs text-slate-400">BBA • 3h ago</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="inline-block px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] uppercase tracking-wider font-bold text-amber-400 mb-3">
                                        Collaboration Needed
                                    </div>

                                    <p className="text-slate-300 mb-6 text-left text-sm leading-relaxed">
                                        Working on a go-to-market strategy for the upcoming Hult Prize pitch. We have the business model locked down, but we urgently need a tech co-founder to help us prototype the app. Anyone interested in joining the squad?
                                    </p>

                                    <div className="flex gap-1 text-slate-400 text-xs font-semibold">
                                        <button className="flex items-center gap-1.5 hover:text-amber-400 hover:bg-amber-500/10 px-3 py-1.5 rounded-full transition-all text-amber-400/80 bg-amber-500/5"><ArrowUp className="w-4 h-4" /> 189</button>
                                        <button className="flex items-center gap-1.5 hover:text-slate-200 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-all"><MessageCircle className="w-4 h-4" /> 62</button>
                                        <button className="flex items-center gap-1.5 hover:text-slate-200 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-all"><Repeat className="w-4 h-4" /> 14</button>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Carousel Section */}
            <section className="w-full py-20 relative overflow-hidden z-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4">
                            Everything in <span className="text-blue-400">One Place</span>
                        </h2>
                    </div>
                    <LandingCarousel />
                </div>
            </section>

            {/* Final CTA - Compact */}
            <section className="w-full py-20 px-4 z-10 pb-32">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-[2rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-10 text-center overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-500/5 blur-3xl" />
                        <div className="relative z-10">
                            {process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true' ? (
                                <>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                                        Secure Your Spot
                                    </h2>
                                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                        Join thousands of students on the waitlist. Be the first to experience the new SociaVerse.
                                    </p>
                                    <Link href="/join-waitlist">
                                        <Button size="lg" className="px-10 py-6 rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-colors font-bold text-base shadow-lg shadow-white/20">
                                            Join Waitlist
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                                        Start Your Journey
                                    </h2>
                                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                        Join thousands of students on SociaVerse. No fees. Just connection.
                                    </p>
                                    <Link href="/signup">
                                        <Button size="lg" className="px-10 py-6 rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-colors font-bold text-base">
                                            Join the Community
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

        </div >
    )
}
