import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { sounds } from '../utils/audio';
import { 
  ArrowRight, 
  Cpu, 
  Activity, 
  Wrench, 
  ShieldCheck, 
  Zap, 
  ChevronDown 
} from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
  onLaunchHUD: () => void;
  backgroundImage?: string;
  content?: Record<string, string>;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreServices,
  onLaunchHUD,
  backgroundImage = 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=2000&q=85',
  content = {},
}) => {
  const c = (key: string, fallback: string) => content[key] || fallback;
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 180]);
  const textY = useTransform(scrollY, [0, 800], [0, 260]);
  const opacityFade = useTransform(scrollY, [0, 600], [1, 0]);
  const scaleImage = useTransform(scrollY, [0, 800], [1, 1.12]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.15,
      },
    },
  };

  const lineVariants = {
    hidden: { y: 60, opacity: 0, filter: 'blur(10px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050507]"
    >
      {/* Layer 1: Background Image - Crystal Clear Full Visibility */}
      <motion.div
        style={{ y: bgY, scale: scaleImage }}
        className="absolute inset-0 z-0 origin-center"
      >
        <img
          src={backgroundImage}
          alt="Dani & Miki Auto Solution Garage and Diagnostic Workshop"
          className="w-full h-full object-cover object-center brightness-95 contrast-105 select-none transition-all duration-700"
          loading="eager"
        />
        {/* Minimal soft top bar shading for navbar legibility & bottom seam fade to section 2 */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050507] to-transparent pointer-events-none" />
      </motion.div>

      {/* Animated subtle laser horizontal line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none" />

      {/* Layer 5: Main Content & Cinematic Kinetic Typography */}
      <motion.div
        style={{ y: textY, opacity: opacityFade }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full flex flex-col items-center text-center"
      >
        {/* Step 3: Top Technical Badge with Laser Lines & Skew Accent */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-[1px] w-8 sm:w-12 bg-red-600" />
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 backdrop-blur-md shadow-[0_0_20px_rgba(225,29,72,0.25)]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-black tracking-[0.3em] uppercase text-red-400">
              {c('badge', 'DANI & MIKI AUTO SOLUTION')}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-600">|</span>
            <span className="hidden sm:inline-block text-[11px] font-mono font-bold text-zinc-300 tracking-wider">{c('badge_right', 'EST. ADDIS ABABA')}</span>
          </div>
          <div className="h-[1px] w-8 sm:w-12 bg-red-600" />
        </motion.div>

        {/* Step 4: Massive Bold Typography Headline */}
        <div className="font-display font-black tracking-tighter uppercase leading-[0.9] select-none text-white my-2">
          {/* Line 1: ADVANCED */}
          <div className="overflow-hidden">
            <motion.h1
              variants={lineVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-tighter drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
            >
              {c('line1', 'ADVANCED')}
            </motion.h1>
          </div>

          {/* Line 2: AUTOMOTIVE (Stroke text in Bold Typography theme) */}
          <div className="overflow-hidden">
            <motion.div
              variants={lineVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-stroke-white-2 tracking-tighter select-none py-0.5 hover:text-white transition-colors duration-500 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
            >
              {c('line2', 'AUTOMOTIVE')}
            </motion.div>
          </div>

          {/* Line 3: SOLUTIONS */}
          <div className="overflow-hidden">
            <motion.div
              variants={lineVariants}
              className="relative inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-red-500 tracking-tighter drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
            >
              <span>{c('line3', 'SOLUTIONS')}</span>
              {/* Red Laser Baseline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
                className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-full shadow-[0_0_20px_#e11d48]"
              />
            </motion.div>
          </div>
        </div>

        {/* Step 5: Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-6 sm:mt-7 max-w-2xl text-sm sm:text-base md:text-lg text-zinc-100 font-medium leading-relaxed text-center px-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        >
          {c('body', 'High-precision computer diagnostics, ECU programming, custom chip tuning, and master auto-electrical engineering for European, Asian, and American vehicles.')}
        </motion.p>

        {/* Step 6: Interactive Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4"
        >
          <button
            id="hero-book-now-btn"
            data-cursor="BOOK"
            onClick={() => {
              sounds.playClick();
              onOpenBooking();
            }}
            onMouseEnter={() => sounds.playHover()}
            className="w-full sm:w-auto relative group overflow-hidden px-8 py-4 rounded-xl font-display font-black text-sm tracking-wider uppercase text-white bg-red-600 hover:bg-red-500 transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span>{c('cta_primary', 'BOOK AN APPOINTMENT')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            id="hero-interactive-hud-btn"
            data-cursor="SCAN"
            onClick={() => {
              sounds.playClick();
              onLaunchHUD();
            }}
            onMouseEnter={() => sounds.playHover()}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase text-zinc-200 hover:text-white border border-white/15 hover:border-red-500/50 bg-zinc-900/60 hover:bg-zinc-900/90 backdrop-blur-md transition-all duration-300 active:scale-95"
          >
            <Activity size={15} className="text-red-500 animate-pulse" />
            <span>{c('cta_secondary', 'LAUNCH DIAGNOSTIC SCANNER')}</span>
          </button>
        </motion.div>

        {/* Step 7: Technical Capability Ticker Badges */}
        <motion.div
          variants={itemVariants}
          className="mt-12 sm:mt-16 pt-6 border-t border-white/10 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-left"
        >
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <Cpu size={18} className="text-red-500 shrink-0" />
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">{c('badge1_sub', 'ENGINE & TCU')}</div>
              <div className="text-xs font-bold text-zinc-200 tracking-wider">{c('badge1_label', 'ECU PROGRAMMING')}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <Activity size={18} className="text-red-500 shrink-0" />
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">{c('badge2_sub', 'ALL-SYSTEM')}</div>
              <div className="text-xs font-bold text-zinc-200 tracking-wider">{c('badge2_label', 'OEM DIAGNOSTICS')}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <Zap size={18} className="text-red-500 shrink-0" />
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">{c('badge3_sub', 'CAN-BUS & SENSORS')}</div>
              <div className="text-xs font-bold text-zinc-200 tracking-wider">{c('badge3_label', 'AUTO ELECTRICAL')}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <ShieldCheck size={18} className="text-red-500 shrink-0" />
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">{c('badge4_sub', 'SECURITY & FOBS')}</div>
              <div className="text-xs font-bold text-zinc-200 tracking-wider">{c('badge4_label', 'KEY PROGRAMMING')}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Down Prompt */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        onClick={onExploreServices}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer text-zinc-500 hover:text-red-400 transition-colors"
      >
        <span className="text-[9px] font-mono tracking-widest uppercase">{c('scroll_label', 'SCROLL TO EXPLORE')}</span>
        <ChevronDown size={14} />
      </motion.div>
    </section>
  );
};
