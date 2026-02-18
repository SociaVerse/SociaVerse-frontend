"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Globe, Zap, Shield, ArrowRight, Activity, Users, Star, Search, MessageCircle, Heart, Wifi, Battery, Signal, Rocket, Laptop, GraduationCap } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LandingCarousel } from "@/components/landing-carousel";
import { MouseSpotlight } from "@/components/mouse-spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { Meteors } from "@/components/ui/meteors";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { MouseEvent, useEffect, useState } from "react";






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

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-950 text-slate-100 overflow-hidden w-full relative">

      {/* Dynamic Backgrounds */}
      <BackgroundBeams className="opacity-40" />
      <MouseSpotlight />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150 mix-blend-overlay pointer-events-none z-0" />
      <FloatingParticles />


      {/* Hero Section */}
      <section className="relative w-full pt-28 pb-16 md:pt-36 md:pb-24 px-4 z-10 overflow-hidden">

        <div className="absolute inset-0 h-full w-full pointer-events-none">
          <Meteors number={20} />
        </div>

        {/* Floating Background Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] opacity-20 text-blue-500"
          >
            <Rocket className="w-16 h-16" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-40 right-[15%] opacity-20 text-purple-500"
          >
            <Laptop className="w-20 h-20" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-40 right-[5%] opacity-10 text-indigo-500"
          >
            <GraduationCap className="w-12 h-12" />
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
      <section className="w-full py-20 bg-slate-900/20 z-10">
        <div className="container max-w-5xl mx-auto px-4">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Globe className="h-10 w-10 text-blue-400 group-hover/card:text-white transition-colors" />,
                title: "Find Your Tribe",
                description: "Connect with students who actually share your interests.",
                gradient: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: <Zap className="h-10 w-10 text-amber-400 group-hover/card:text-white transition-colors" />,
                title: "Instant Collab",
                description: "Real-time sharing of notes and ideas with zero friction.",
                gradient: "from-amber-500/20 to-orange-500/20"
              },
              {
                icon: <Shield className="h-10 w-10 text-emerald-400 group-hover/card:text-white transition-colors" />,
                title: "Verified & Safe",
                description: "Verified student-only spaces for authentic connection.",
                gradient: "from-emerald-500/20 to-green-500/20"
              }
            ].map((item, index) => (
              <CardContainer key={index} className="inter-var w-full h-full" containerClassName="block">
                <CardBody className="bg-slate-900/40 relative group/card border-slate-800 w-full h-full rounded-xl p-6 border hover:border-slate-700 transition-colors">
                  <CardItem
                    translateZ="50"
                    className="w-full mt-4"
                  >
                    <div className={`p-4 rounded-2xl bg-slate-950/50 w-fit border border-slate-700 mb-6 ${item.gradient}`}>
                      {item.icon}
                    </div>
                  </CardItem>
                  <CardItem
                    as="h3"
                    translateZ="60"
                    className="text-xl font-bold text-slate-200"
                  >
                    {item.title}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="40"
                    className="text-slate-400 text-sm max-w-sm mt-2 leading-relaxed"
                  >
                    {item.description}
                  </CardItem>
                  <div className="flex justify-between items-center mt-10">
                    <CardItem
                      translateZ={20}
                      as="button"
                      className="px-4 py-2 rounded-xl text-xs font-normal text-white"
                    >
                      Learn more →
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </section>

      {/* Live Feed Section - Compact */}
      <section className="w-full py-20 relative z-10">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Campus <span className="text-blue-400">Pulse</span>
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold">
              <Activity className="w-3 h-3" /> LIVE
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                user: "David Chen",
                handle: "@david_c",
                content: "Just finished the final project! 🚀 Who else is awake?",
                likes: "2.4k",
                comments: "142",
                time: "20m ago",
                color: "from-blue-500 to-cyan-500"
              },
              {
                user: "Sarah M.",
                handle: "@sarah_m",
                content: "Library 4th floor is the best study spot. 📚✨",
                likes: "1.8k",
                comments: "89",
                time: "1h ago",
                color: "from-purple-500 to-pink-500"
              },
              {
                user: "Tech Club",
                handle: "@tech_club",
                content: "Hackathon starts tomorrow! Prize pool $5k 🏆",
                likes: "5.2k",
                comments: "320",
                time: "2h ago",
                color: "from-orange-500 to-red-500"
              }
            ].map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${post.color}`} />
                  <div className="text-left">
                    <p className="font-bold text-slate-200 text-sm">{post.user}</p>
                    <p className="text-xs text-slate-500">{post.handle} · {post.time}</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-4 text-left text-sm">{post.content}</p>
                <div className="flex gap-4 text-slate-500 text-xs">
                  <span className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
                    ❤️ {post.likes}
                  </span>
                  <span className="flex items-center gap-1 hover:text-slate-300 cursor-pointer">
                    💬 {post.comments}
                  </span>
                </div>
              </motion.div>
            ))}
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 bg-slate-950 border-t border-slate-900 z-10 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="font-bold text-slate-300">SociaVerse</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-6">
            <Link href="/features" className="hover:text-slate-300 transition-colors">Features</Link>
            <Link href="/events" className="hover:text-slate-300 transition-colors">Events</Link>
            <Link href="/explore" className="hover:text-slate-300 transition-colors">Explore</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}