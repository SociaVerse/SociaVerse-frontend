"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Globe, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { LandingCarousel } from "@/components/landing-carousel";

export default function Home() {
  return (
    // This div will grow to fill the available space
    <main className="flex-1 flex flex-col items-center justify-center text-center p-4">

      <section className="container max-w-4xl py-20 md:py-32">

        {/* Animated Headline */}
        <h1
          className="text-5xl md:text-7xl font-bold animate-in fade-in slide-in-from-bottom-12 duration-1000"
        >
          Welcome to the <span className="text-primary">SociaVerse</span>
        </h1>

        {/* Sub-headline */}
        <p
          className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200"
        >
          Connect, create, and explore in a decentralized universe.
          Your new digital identity awaits.
        </p>

        {/* Call-to-Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400"
        >
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/signup">Join the Beta</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/explore">Learn More</Link>
          </Button>
        </div>


      </section>

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
  )
}