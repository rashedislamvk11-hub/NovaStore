import React from "react";
import { Sparkles, ArrowRight, Play, Compass } from "lucide-react";
import { BannerSettings } from "../types";

interface HeroSectionProps {
  settings: BannerSettings;
  onExploreClick: () => void;
}

export default function HeroSection({ settings, onExploreClick }: HeroSectionProps) {
  return (
    <div id="hero-banner" className="relative flex items-center justify-center overflow-hidden pt-10 pb-6 px-4 sm:px-6 lg:px-8">
      
      {/* Absolute background immersive video container */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-35 transition-opacity duration-1000"
        >
          <source src={settings.videoBannerUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      {/* Floating orbital abstract background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse-glow" />

      {/* Hero Typography & CTA Block */}
      <div className="relative z-10 text-center max-w-4xl space-y-8">
        
        {/* Floating curated crown badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-400/25 shadow-gold-glow animate-bounce">
          <Sparkles className="h-4 w-4 text-gold-400" />
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-300">
            ডিজিটাল এলিটদের জন্য বিশেষভাবে সংগৃহীত
          </span>
        </div>

        {/* Dynamic visual bold headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.1] text-glow">
          {settings.headline || "বিশ্বমানের ডিজিটাল মার্কেটপ্লেস"}
        </h1>

        {/* Responsive sub-headline context */}
        <p className="text-sm sm:text-lg text-slate-400 dark:text-slate-400 light:text-slate-700 max-w-2xl mx-auto leading-relaxed">
          {settings.subheadline || "প্রিমিয়াম হাই-ফিডেলিটি ডেভেলপার এসেটস, ফটোগ্রাফি প্রিসেট এবং এক্সক্লুসিভ পোর্টফোলিও সহজে ডাউনলোড বা ক্রয় করুন।"}
        </p>

        {/* Dual button curation grid */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            id="hero-explore-btn"
            onClick={onExploreClick}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-white font-bold tracking-wider text-xs uppercase shadow-gold-glow hover:scale-[1.03] transition-all transform duration-300"
          >
            <Compass className="h-4.5 w-4.5 text-gold-200" />
            <span>{settings.ctaText || "কালেকশন এক্সপ্লোর করুন"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            id="hero-scroll-btn"
            onClick={() => {
              document.getElementById("why-choose-us")?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider"
          >
            <Play className="h-4 w-4 text-slate-400 group-hover:text-white" />
            <span>আমাদের পরিচিতি</span>
          </button>
        </div>

      </div>
    </div>
  );
}
