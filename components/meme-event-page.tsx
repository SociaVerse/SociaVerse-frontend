import React from 'react';

export function MemeEventPage() {
  return (
    <div className="min-h-screen bg-[#03040b] text-white flex flex-col items-center relative overflow-hidden font-sans pb-24">
      
      {/* Enhanced Vibrant Background Glows (Animations Removed) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 flex flex-col items-center text-center">
        
        {/* Badges Section */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="rounded-full border border-slate-700/80 bg-slate-800/40 px-4 py-1.5 text-xs font-semibold tracking-widest text-slate-300 backdrop-blur-md uppercase">
              SociaVerse Presents
            </span>
            <span className="rounded-full border border-green-500/50 bg-green-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-green-400 backdrop-blur-md uppercase shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              100% Free Entry
            </span>
            <span className="rounded-full border border-fuchsia-500/50 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-fuchsia-400 backdrop-blur-md uppercase shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              Exclusive for LPU
            </span>
        </div>
        
        {/* Hero Title (Vibrant & Static) */}
        <div className="relative mb-6">
          <h1 className="text-7xl md:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500 pb-2 drop-shadow-[0_0_25px_rgba(217,70,239,0.4)]">
            MEME WAR
          </h1>
        </div>
        
        {/* Date Banner */}
        <div className="flex items-center gap-3 mb-8 text-lg md:text-xl font-medium text-cyan-100 bg-cyan-950/40 px-8 py-3 rounded-2xl border border-cyan-500/50 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          🗓️ March 24, 2026 — March 29, 2026
        </div>

        <p className="text-lg md:text-xl text-slate-300 mb-16 max-w-2xl font-light leading-relaxed">
          The ultimate campus showdown. Bring your best memes and battle it out for glory, exclusive merchandise, and cash prizes.
        </p>

        {/* How to Register Section */}
        <div className="flex flex-col md:flex-row gap-5 mb-16 w-full max-w-4xl text-left">
          <div className="flex-1 bg-gradient-to-b from-[#0b0f19] to-[#080f1e] backdrop-blur-sm border-2 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:border-blue-500/60 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)]">
            <div className="text-blue-500/20 font-black text-5xl mb-4 absolute -right-2 -top-2">01</div>
            <h3 className="text-white font-semibold text-lg mb-2 relative z-10">Join the Platform</h3>
            <p className="text-slate-400 text-sm relative z-10">Sign up and create your free SociaVerse account to access the campus network.</p>
          </div>
          
          <div className="flex-1 bg-gradient-to-b from-[#0b0f19] to-[#120a14] backdrop-blur-sm border-2 border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:border-fuchsia-500/60 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(217,70,239,0.2)]">
            <div className="text-fuchsia-500/20 font-black text-5xl mb-4 absolute -right-2 -top-2">02</div>
            <h3 className="text-white font-semibold text-lg mb-2 relative z-10">Go to Events</h3>
            <p className="text-slate-400 text-sm relative z-10">Once logged in, navigate to the <span className="text-fuchsia-400 font-medium">Events</span> tab in your dashboard.</p>
          </div>
          
          <div className="flex-1 bg-gradient-to-b from-[#0b0f19] to-[#081317] backdrop-blur-sm border-2 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-cyan-500/60 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.2)]">
            <div className="text-cyan-500/20 font-black text-5xl mb-4 absolute -right-2 -top-2">03</div>
            <h3 className="text-white font-semibold text-lg mb-2 relative z-10">Register & Battle</h3>
            <p className="text-slate-400 text-sm relative z-10">Find 'Meme War', click register, and submit your dankest creation to the feed!</p>
          </div>
        </div>

        {/* CTA Button */}
        <a 
          href="/signup" 
          className="relative inline-flex items-center justify-center px-16 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xl tracking-wide transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] border border-purple-400/20 hover:border-purple-400/50"
        >
          Register
        </a>

        {/* Prize Pool Section (Permanently Vibrant Cards) */}
        <div className="mt-32 w-full max-w-5xl">
            <h2 className="text-4xl md:text-5xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 text-center">
              The Prize Pool
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
              
              {/* Best Overall Card */}
              <div className="group flex flex-col p-8 rounded-[2rem] bg-gradient-to-b from-[#0b0f19] to-[#1a150b] backdrop-blur-md border-2 border-yellow-500/40 shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 flex items-center justify-center mb-6 border border-yellow-500/60 text-2xl group-hover:scale-110 transition-transform">
                  🏆
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Best Overall</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">Awarded to the most legendary and creative meme of the entire event.</p>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 mt-auto tracking-tight drop-shadow-lg">
                  ₹1200
                </span>
              </div>

              {/* Most Relatable Card */}
              <div className="group flex flex-col p-8 rounded-[2rem] bg-gradient-to-b from-[#0b0f19] to-[#1a0b18] backdrop-blur-md border-2 border-fuchsia-500/40 shadow-[0_0_20px_rgba(217,70,239,0.15)] hover:border-fuchsia-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(217,70,239,0.3)]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-400/30 to-fuchsia-600/30 flex items-center justify-center mb-6 border border-fuchsia-500/60 text-2xl group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Most Relatable</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">For the meme that hits right in the campus feels and everyday student struggles.</p>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-300 to-fuchsia-600 mt-auto tracking-tight drop-shadow-lg">
                  ₹1000
                </span>
              </div>

              {/* Most Liked Card */}
              <div className="group flex flex-col p-8 rounded-[2rem] bg-gradient-to-b from-[#0b0f19] to-[#0b171a] backdrop-blur-md border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-cyan-600/30 flex items-center justify-center mb-6 border border-cyan-500/60 text-2xl group-hover:scale-110 transition-transform">
                  🔥
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Most Liked</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">The undisputed crowd favorite, voted directly by the SociaVerse community.</p>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-cyan-600 mt-auto tracking-tight drop-shadow-lg">
                  ₹500
                </span>
              </div>
              
            </div>
        </div>

      </div>
    </div>
  );
}