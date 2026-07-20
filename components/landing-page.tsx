"use client"

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  EyeOff,
  MessageCircle,
  Vote,
  Gift,
  ArrowRight,
  ArrowUp,
  Lock,
  Sparkles,
  TrendingUp,
  Heart,
  User,
  Share2,
  Coins,
  Shield,
  Smartphone,
  CheckCircle2,
  Trophy,
  Flame,
  ChevronRight,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ─── Animated Counter ─── */
function AnimatedNumber({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

/* ─── Feature Card ─── */
function FeatureCard({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full p-8 md:p-10 rounded-3xl bg-zinc-950/80 border border-zinc-800/60 hover:border-red-900/40 transition-all duration-500">
        <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-900/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-950/60 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-zinc-500 text-[15px] leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

/* ─── Main Landing Page ─── */
export function LandingPage() {
  const [pollVoted, setPollVoted] = useState(false);
  const [pollChoice, setPollChoice] = useState<"a" | "b" | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const handlePollVote = (choice: "a" | "b") => {
    if (pollVoted) return;
    setPollChoice(choice);
    setPollVoted(true);
  };

  const pollData = {
    a: { label: "Yes — AI search will dominate", base: 62 },
    b: { label: "No — keywords still king", base: 38 },
  };
  const getPercent = (opt: "a" | "b") => {
    if (!pollVoted) return 0;
    return pollChoice === opt ? pollData[opt].base + 1 : pollData[opt].base - 1;
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-black text-white overflow-hidden w-full relative selection:bg-red-600/30">

      {/* ═══════════════════════════════════════════════════ */}
      {/*  HERO SECTION                                      */}
      {/* ═══════════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative w-full min-h-[100vh] flex items-center justify-center px-6 overflow-hidden"
      >
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-600/[0.07] rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-zinc-800/20 rounded-full blur-[100px]" />
        </div>

        {/* Grid lines effect */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center pt-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-red-500 text-xs font-bold tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5" />
              The Anonymous Social Network
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8"
          >
            <span className="block text-white">Where Your</span>
            <span className="block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-400">
                Voice Matters
              </span>
              <span className="text-red-500">.</span>
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Post anonymously. Predict real-world outcomes. Earn gold coins.
            <br className="hidden md:block" />
            Redeem exciting rewards. No judgment. No bias.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild className="h-14 px-10 rounded-full bg-red-600 hover:bg-red-500 text-white text-base font-bold transition-all shadow-[0_0_40px_rgba(220,38,38,0.35)] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] border-none hover:scale-105">
              <Link href="/signup">
                Join SociaVerse <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 px-10 rounded-full border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all text-base">
              <Link href="/features">
                Learn More
              </Link>
            </Button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-20 flex flex-wrap justify-center gap-12 text-center"
          >
            {[
              { value: 25000, suffix: "+", label: "Active Users" },
              { value: 180000, suffix: "+", label: "Anonymous Posts" },
              { value: 45000, suffix: "+", label: "Predictions Made" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-black text-white tabular-nums">
                  <AnimatedNumber target={stat.value} />{stat.suffix}
                </div>
                <div className="text-xs text-zinc-600 font-medium mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-zinc-800 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-red-500 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  HOW IT WORKS                                       */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="w-full py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/50 to-black pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-xs text-red-500 font-bold uppercase tracking-[0.2em] mb-4 block">How It Works</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Speak. Predict. <span className="text-red-500">Earn.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              index={0}
              icon={<EyeOff className="w-6 h-6 text-red-500" />}
              title="Anonymous Posting"
              description="Share your raw unfiltered thoughts without fear. Your identity is cryptographically protected. No one — not even us — can trace posts back to you."
            />
            <FeatureCard
              index={1}
              icon={<Vote className="w-6 h-6 text-red-500" />}
              title="Prediction Polls"
              description="Stake gold coins on real-world outcomes. From crypto prices to pop culture events — predict correctly and multiply your earnings with 2x payouts."
            />
            <FeatureCard
              index={2}
              icon={<Gift className="w-6 h-6 text-red-500" />}
              title="Rewards Store"
              description="Redeem coins for physical merchandise, gift vouchers, tech gear, and premium subscriptions. Your engagement literally pays off."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  INTERACTIVE DEMO                                   */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="w-full py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-500 font-bold uppercase tracking-[0.2em]">Live Preview</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Try It Right Now
            </h2>
            <p className="text-zinc-500 text-lg max-w-lg mx-auto">
              Click to vote. This is what SociaVerse feels like.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* ─── Live Poll Card ─── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-zinc-950 border border-zinc-800/60 p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/5 rounded-full blur-[80px] group-hover:bg-red-600/10 transition-all duration-700" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-red-950/60 text-red-400 border border-red-900/30">
                    ⚡ Prediction Market
                  </span>
                  <span className="text-xs text-zinc-600 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 inline mr-1 text-red-500" />Ends in 6h
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                  Will AI fully replace traditional search engines by 2027?
                </h3>
                <p className="text-sm text-zinc-600 mb-8">
                  Pool: 350,000 Gold Coins • 2x multiplier
                </p>

                <div className="space-y-3">
                  {(["a", "b"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePollVote(opt)}
                      disabled={pollVoted}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                        pollVoted && pollChoice === opt
                          ? "bg-red-950/20 border-red-800/40"
                          : pollVoted
                          ? "bg-zinc-950 border-zinc-800/40 opacity-60"
                          : "bg-zinc-900/40 border-zinc-800/50 hover:border-red-900/40 hover:bg-zinc-900/60 cursor-pointer"
                      }`}
                    >
                      {pollVoted && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getPercent(opt)}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`absolute left-0 top-0 bottom-0 ${
                            pollChoice === opt ? "bg-red-600/15" : "bg-zinc-800/20"
                          }`}
                        />
                      )}
                      <div className="flex justify-between items-center relative z-10">
                        <span className="text-sm font-semibold text-zinc-200">{pollData[opt].label}</span>
                        {pollVoted && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-sm font-black ${pollChoice === opt ? "text-red-400" : "text-zinc-600"}`}
                          >
                            {getPercent(opt)}%
                          </motion.span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {pollVoted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-center gap-2 text-xs text-red-500/80"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">Your prediction has been recorded</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* ─── Anonymous Post Card ─── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-zinc-950 border border-zinc-800/60 p-8 relative overflow-hidden group flex flex-col"
            >
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-zinc-800/10 rounded-full blur-[80px]" />

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <EyeOff className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Anonymous</span>
                    <span className="text-[11px] text-zinc-600">Career Confessions • 4h ago</span>
                  </div>
                  <span className="ml-auto text-[9px] font-extrabold tracking-widest text-zinc-700 uppercase border border-zinc-800 px-2 py-0.5 rounded-full">Ghost</span>
                </div>

                <p className="text-[15px] text-zinc-400 leading-relaxed flex-1 mb-6">
                  "I turned down a big tech offer to join a 5-person startup for half the salary. My parents think I've lost it. But I've learned more in 3 weeks than 4 years of university. Sometimes the scariest choice is the right one."
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["#StartupLife", "#Decisions", "#NoRegrets"].map(tag => (
                    <span key={tag} className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-500 border border-zinc-800/60">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-zinc-800/40">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1.5 text-red-500/80 text-xs font-bold bg-red-950/20 border border-red-900/20 px-3 py-1.5 rounded-full">
                      <ArrowUp className="w-3.5 h-3.5" /> 843
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-600 text-xs font-bold">
                      <MessageCircle className="w-3.5 h-3.5" /> 112
                    </span>
                  </div>
                  <Share2 className="w-4 h-4 text-zinc-700 hover:text-zinc-400 transition-colors cursor-pointer" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  REWARDS SHOWCASE                                   */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="w-full py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/30 to-black pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-xs text-red-500 font-bold uppercase tracking-[0.2em] mb-4 block">
              <Trophy className="w-3.5 h-3.5 inline mr-1" />Gold Coins Economy
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Real Rewards. <span className="text-red-500">Real Value.</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              Every post, vote, and prediction earns you Gold Coins. Redeem them for physical and digital rewards shipped to your door.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Gaming Headset", category: "Tech Gear", cost: "75,000", badge: "Popular", emoji: "🎧" },
              { title: "₹1,000 Amazon Voucher", category: "Gift Cards", cost: "25,000", badge: "Hot", emoji: "🎁" },
              { title: "Premium Hoodie", category: "Merch", cost: "50,000", badge: "Limited", emoji: "👕" },
              { title: "Spotify Premium", category: "Subscription", cost: "12,000", badge: "Fast", emoji: "🎵" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl bg-zinc-950 border border-zinc-800/60 hover:border-red-900/30 transition-all duration-300 overflow-hidden"
              >
                {/* Visual header */}
                <div className="h-36 bg-zinc-900/50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950 z-10" />
                  <span className="text-5xl z-20 group-hover:scale-125 transition-transform duration-500">{item.emoji}</span>
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded z-20">
                    {item.badge}
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{item.category}</span>
                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-red-400 transition-colors truncate">{item.title}</h3>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-800/40">
                    <span className="text-[10px] text-zinc-600">COST</span>
                    <span className="text-sm text-red-500 font-black flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />{item.cost}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  DOWNLOAD CTA                                       */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="w-full py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-900/30 flex items-center justify-center mx-auto mb-8">
              <Smartphone className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Get the App
            </h2>
            <p className="text-zinc-500 text-lg mb-12 max-w-md mx-auto">
              Full prediction markets, push notifications, anonymous discussions, and your wallet — all in your pocket.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#" className="w-52 h-14 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center px-5 gap-3 transition-all group">
                <span className="text-2xl">▶</span>
                <div className="text-left leading-tight">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-widest block">Get it on</span>
                  <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">Google Play</span>
                </div>
              </a>
              <a href="#" className="w-52 h-14 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center px-5 gap-3 transition-all group">
                <span className="text-2xl"></span>
                <div className="text-left leading-tight">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-widest block">Download on the</span>
                  <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">App Store</span>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  PRIVACY / TRUST BANNER                             */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="w-full py-20 px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-8 p-10 rounded-3xl bg-zinc-950 border border-zinc-800/60 hover:border-red-900/20 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-900/30 flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                Absolute Privacy <CheckCircle2 className="w-5 h-5 text-red-500" />
              </h3>
              <p className="text-zinc-500 text-[15px] leading-relaxed">
                Your anonymous posts are cryptographically isolated. We don't track, sell, or link your data.
                SociaVerse is built on the principle that free expression requires absolute privacy protection.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
