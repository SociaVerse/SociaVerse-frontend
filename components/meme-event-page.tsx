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
        
        {/* Premium Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 mt-10">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 px-5 backdrop-blur-md shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs font-semibold tracking-widest text-slate-200 uppercase">SociaVerse Presents</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 py-1.5 px-5 backdrop-blur-md">
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase"> 100% Free Entry</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/5 py-1.5 px-5 backdrop-blur-md">
            <span className="text-xs font-bold tracking-widest text-fuchsia-400 uppercase">🎯 Exclusive for LPU</span>
          </div>
        </div>

        {/* Hero Title (Vibrant & Professional) */}
        <div className="relative mb-8 w-full flex justify-center pb-2">
          {/* Subtle background glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[120%] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <h1 className="relative text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">MEME</span>
            <span className="ml-3 sm:ml-4 text-transparent bg-clip-text bg-gradient-to-b from-fuchsia-400 to-rose-600 drop-shadow-[0_0_20px_rgba(217,70,239,0.3)]">WAR</span>
          </h1>
        </div>
        
        {/* Sleek Date Display */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex items-center gap-3 relative px-8 py-3 rounded-full border border-indigo-500/30 bg-[#0b1021]/80 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(99,102,241,0.4)] hover:border-indigo-500/60 transition-colors">
            <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-20 blur-sm"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-base sm:text-lg font-semibold tracking-wide text-indigo-100 relative z-10">
              March 24 <span className="text-indigo-400/50 mx-2">—</span> March 29, 2026
            </span>
          </div>
        </div>

        <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-16 max-w-2xl font-medium leading-relaxed">
          The ultimate campus showdown. Bring your best memes and battle it out for glory, exclusive merchandise, and cash prizes.
        </p>

        {/* How to Register Section - Floating Orbs Design */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-6 mb-20 mt-6 w-full max-w-5xl text-left relative z-10 px-4 sm:px-0">
          
          {/* Step 1 */}
          <div className="flex-1 group relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative h-full bg-[#0b0f19]/80 backdrop-blur-xl rounded-[2rem] border border-blue-500/20 p-6 sm:p-8 pt-10 sm:pt-8 sm:pl-14 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40">
              
              <div className="absolute -top-6 left-6 sm:top-1/2 sm:-translate-y-1/2 sm:-left-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-xl font-black text-white border-[4px] border-[#03040b] shadow-[0_0_30px_rgba(59,130,246,0.5)] group-hover:rotate-[10deg] group-hover:scale-110 transition-transform">
                1
              </div>

              <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Join the Platform</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Sign up and create your free SociaVerse account to access the campus network.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex-1 group relative md:mt-12 md:-mb-12">
            <div className="absolute inset-0 bg-fuchsia-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative h-full bg-[#0b0f19]/80 backdrop-blur-xl rounded-[2rem] border border-fuchsia-500/20 p-6 sm:p-8 pt-10 sm:pt-8 sm:pl-14 shadow-[inset_0_0_20px_rgba(217,70,239,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-fuchsia-500/40">
              
              <div className="absolute -top-6 left-6 sm:top-1/2 sm:-translate-y-1/2 sm:-left-6 w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 flex items-center justify-center text-xl font-black text-white border-[4px] border-[#03040b] shadow-[0_0_30px_rgba(217,70,239,0.5)] group-hover:-rotate-[10deg] group-hover:scale-110 transition-transform">
                2
              </div>

              <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Go to Events</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Once logged in, navigate to the <span className="text-fuchsia-400 font-semibold">Events</span> tab in your dashboard.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex-1 group relative">
            <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative h-full bg-[#0b0f19]/80 backdrop-blur-xl rounded-[2rem] border border-cyan-500/20 p-6 sm:p-8 pt-10 sm:pt-8 sm:pl-14 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40">
              
              <div className="absolute -top-6 left-6 sm:top-1/2 sm:-translate-y-1/2 sm:-left-6 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-xl font-black text-white border-[4px] border-[#03040b] shadow-[0_0_30px_rgba(6,182,212,0.5)] group-hover:rotate-[10deg] group-hover:scale-110 transition-transform">
                3
              </div>

              <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Register & Battle</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Find 'Meme War', click register, and submit your dankest creation to the feed!</p>
            </div>
          </div>

        </div>

        {/* CTA Button */}
        <div className="mt-4 md:mt-16 w-full flex justify-center z-20">
          <a 
            href="/signup" 
            className="group relative inline-flex items-center justify-center px-16 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xl tracking-wide transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] border border-purple-400/20 hover:border-purple-400/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              Register Now <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
        </div>

        {/* Prize Pool Section */}
        <div className="mt-32 w-full max-w-4xl relative z-10">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              The Prize Pool
            </h2>
            <p className="text-slate-400 text-lg">Bring your best meme game and win absolute glory.</p>
          </div>

          <div className="flex flex-col gap-10 sm:gap-6 w-full px-4 sm:px-0">
            
            {/* 1st Place - Best Overall */}
            <div className="group relative rounded-[2rem] sm:rounded-full bg-gradient-to-r from-yellow-500/30 via-orange-500/10 to-transparent p-[1px] transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-600/10 blur-xl opacity-50 group-hover:opacity-100 transition-opacity rounded-[2rem] sm:rounded-full pointer-events-none" />
              <div className="relative bg-[#0b0f19]/90 backdrop-blur-xl rounded-[2rem] sm:rounded-full p-5 sm:p-6 sm:pr-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 border border-yellow-500/30 shadow-[inset_0_0_30px_rgba(250,204,21,0.05)] text-left">
                
                {/* Floating Trophy Icon (Overlaps Top Left on Mobile) */}
                <div className="absolute -top-6 left-4 sm:static sm:top-auto sm:left-auto w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl sm:text-4xl border-[4px] border-[#0b0f19] shadow-[0_0_30px_rgba(250,204,21,0.4)] group-hover:rotate-12 transition-transform z-10">
                  🏆
                </div>
                
                <div className="flex-1 mt-6 sm:mt-0 w-full pl-2 sm:pl-0">
                  <div className="inline-flex px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3">
                    Grand Champion
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-1.5 tracking-tight">Best Overall</h3>
                  <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
                    Awarded to the most legendary and creative meme of the entire event.
                  </p>
                </div>
                
                <div className="w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 sm:pl-8 border-t sm:border-t-0 sm:border-l border-yellow-500/20 text-left sm:text-right shrink-0">
                  <span className="block text-[10px] text-yellow-500/80 font-bold uppercase tracking-widest mb-1 sm:mb-0.5">Prize</span>
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 tracking-tighter drop-shadow-md">
                    ₹1200
                  </span>
                </div>
              </div>
            </div>

            {/* 2nd Place - Most Relatable */}
            <div className="group relative rounded-[2rem] sm:rounded-full bg-gradient-to-r from-fuchsia-500/30 to-transparent p-[1px] transition-all duration-300 hover:scale-[1.02] sm:ml-8 md:ml-12">
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-transparent blur-xl opacity-30 group-hover:opacity-60 transition-opacity rounded-[2rem] sm:rounded-full pointer-events-none" />
              <div className="relative bg-[#0b0f19]/90 backdrop-blur-xl rounded-[2rem] sm:rounded-full p-5 sm:p-5 sm:pr-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 border border-fuchsia-500/20 shadow-[inset_0_0_20px_rgba(217,70,239,0.05)] text-left">
                
                {/* Floating Icon */}
                <div className="absolute -top-5 left-4 sm:static sm:top-auto sm:left-auto w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 flex items-center justify-center text-2xl sm:text-3xl border-[4px] border-[#0b0f19] shadow-[0_0_20px_rgba(217,70,239,0.3)] group-hover:-rotate-12 transition-transform z-10">
                  ⚡
                </div>
                
                <div className="flex-1 mt-5 sm:mt-0 w-full pl-2 sm:pl-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">Most Relatable</h3>
                  <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                    For the meme that hits right in the campus feels and everyday student struggles.
                  </p>
                </div>
                
                <div className="w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-fuchsia-500/20 text-left sm:text-right shrink-0">
                  <span className="block text-[10px] text-fuchsia-400/80 font-bold uppercase tracking-widest mb-1 sm:mb-0.5">Prize</span>
                  <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-300 to-fuchsia-600 tracking-tighter drop-shadow-md">
                    ₹1000
                  </span>
                </div>
              </div>
            </div>

            {/* 3rd Place - Most Liked */}
            <div className="group relative rounded-[2rem] sm:rounded-full bg-gradient-to-r from-cyan-500/30 to-transparent p-[1px] transition-all duration-300 hover:scale-[1.02] sm:ml-16 md:ml-24">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent blur-xl opacity-30 group-hover:opacity-60 transition-opacity rounded-[2rem] sm:rounded-full pointer-events-none" />
              <div className="relative bg-[#0b0f19]/90 backdrop-blur-xl rounded-[2rem] sm:rounded-full p-5 sm:p-5 sm:pr-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] text-left">
                
                {/* Floating Icon */}
                <div className="absolute -top-5 left-4 sm:static sm:top-auto sm:left-auto w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-2xl sm:text-3xl border-[4px] border-[#0b0f19] shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:rotate-12 transition-transform z-10">
                  🔥
                </div>
                
                <div className="flex-1 mt-5 sm:mt-0 w-full pl-2 sm:pl-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">Most Liked</h3>
                  <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                    The undisputed crowd favorite, voted directly by the SociaVerse community.
                  </p>
                </div>
                
                <div className="w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-cyan-500/20 text-left sm:text-right shrink-0">
                  <span className="block text-[10px] text-cyan-400/80 font-bold uppercase tracking-widest mb-1 sm:mb-0.5">Prize</span>
                  <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-cyan-600 tracking-tighter drop-shadow-md">
                    ₹500
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}