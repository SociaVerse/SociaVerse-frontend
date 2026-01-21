"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LandingCarousel } from "@/components/landing-carousel"
import { ArrowRight, Sparkles, Globe, Shield, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-blue-500/30">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 5
          }}
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30%] h-[30%] rounded-full bg-purple-600/5 blur-[120px]"
        />
      </div>

      <main className="relative z-10 flex flex-col items-center w-full">

        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-32 flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-sm mb-8 hover:border-blue-500/50 transition-colors cursor-default -rotate-1 hover:rotate-0"
          >
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Your Campus, Unlocked 🔓</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
          >
            Where Students <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
              Actually Hang Out.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Ditch the boring group chats. Find your people, share your notes, and actually enjoy campus life.
            No corporate BS, just vibes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:scale-105 group">
                Join SociaVerse
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                Explore Features
              </Button>
            </Link>
          </motion.div>

        </section>

        {/* Trending Topics */}
        <div className="w-full bg-slate-900/40 border-y border-slate-800/50 backdrop-blur-sm py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <span className="text-slate-400 font-medium text-sm uppercase tracking-wider">Trending Now:</span>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: "#Hackathons 🚀", color: "from-orange-500 to-red-500" },
                  { label: "#ExamSeason 📚", color: "from-blue-500 to-cyan-500" },
                  { label: "#CampusLife 🎓", color: "from-purple-500 to-pink-500" },
                  { label: "#Gaming 🎮", color: "from-green-500 to-emerald-500" },
                  { label: "#Design 🎨", color: "from-yellow-500 to-orange-500" },
                ].map((topic, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:border-slate-600 transition-colors relative group overflow-hidden"
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-linear-to-r ${topic.color}`} />
                    <span className="text-slate-200 text-sm font-medium relative z-10">{topic.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Motive Section */}
        <section className="w-full py-20 bg-slate-900/30 border-y border-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why we built this</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Because existing social networks feel like a LinkedIn fever dream. We wanted something real.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Globe className="h-8 w-8 text-blue-400" />,
                  title: "Find Your Tribe",
                  description: "Break campus walls and connect with students who actually get your niche interests."
                },
                {
                  icon: <Zap className="h-8 w-8 text-yellow-400" />,
                  title: "Instant Collaboration",
                  description: "Real-time sharing of notes, projects, and ideas with zero friction."
                },
                {
                  icon: <Shield className="h-8 w-8 text-green-400" />,
                  title: "Safe & Secure",
                  description: "A verified community environment ensuring authentic interactions."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-slate-800/20 border border-slate-700/50 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="mb-4 p-3 rounded-xl bg-slate-900/50 w-fit border border-slate-700/50">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-200">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Feed Preview */}
        <section className="w-full py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                What's <span className="text-blue-400">Trending</span>?
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                See what students are talking about right now.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  user: "David Chen",
                  handle: "@david_c",
                  content: "Just finished the final project for CS50! 🚀 Who else is pulling an all-nighter?",
                  likes: "2.4k",
                  comments: "142",
                  time: "2h ago"
                },
                {
                  user: "Sarah Miller",
                  handle: "@sarah_m",
                  content: "Found this amazing study spot in the library. Quiet, great view, and fast wifi! 📚✨",
                  likes: "1.8k",
                  comments: "89",
                  time: "4h ago"
                },
                {
                  user: "Tech Club",
                  handle: "@tech_club",
                  content: "📢 Hackathon registration is now OPEN! Sign up with your team before Friday.",
                  likes: "5.2k",
                  comments: "320",
                  time: "1h ago"
                }
              ].map((post, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    rotateX: 5,
                    rotateY: 5,
                    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.2)"
                  }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                  className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm hover:border-blue-500/30 transition-colors group perspective-1000"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-b from-blue-500 to-purple-500" />
                    <div>
                      <p className="font-bold text-slate-200">{post.user}</p>
                      <p className="text-sm text-slate-500">{post.handle} · {post.time}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4">{post.content}</p>
                  <div className="flex gap-6 text-slate-500 text-sm">
                    <span className="flex items-center gap-1 hover:text-red-400 cursor-pointer transition-colors">❤️ {post.likes}</span>
                    <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition-colors">💬 {post.comments}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="w-full py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Everything you need to <span className="text-blue-400">excel</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Discover the features that make SociaVerse the preferred choice for students everywhere.
              </p>
            </motion.div>

            <LandingCarousel />
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-20 pb-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-12 rounded-3xl bg-linear-to-b from-blue-900/20 to-slate-900/20 border border-blue-500/20 backdrop-blur-sm"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your journey?</h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join thousands of students who are already shaping their future on SociaVerse.
              </p>
              <Link href="/login">
                <Button size="lg" className="text-lg px-10 py-6 rounded-full bg-white text-slate-900 hover:bg-slate-200 transition-all hover:scale-105 font-bold shadow-xl shadow-white/10">
                  Get Started Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  )
}