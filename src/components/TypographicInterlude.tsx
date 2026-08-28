import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const TypographicInterlude: React.FC<{ content?: Record<string,string> }> = ({ content = {} }) => {
  const c = (key: string, fb: string) => content[key] || fb;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const x2 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.02, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <div ref={containerRef} className="relative py-28 sm:py-36 overflow-hidden bg-[#070709] border-y border-white/5 select-none">
      <div className="absolute inset-0 bg-tech-dots opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[130px] pointer-events-none rounded-full" />

      <motion.div style={{ scale, opacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center gap-6 sm:gap-10">
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 sm:w-16 bg-red-600" />
          <div className="inline-flex items-center gap-2.5 px-4 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-xs font-mono text-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="tracking-[0.25em] uppercase font-bold">{c('title', 'THE DANI & MIKI STANDARD')}</span>
          </div>
          <div className="h-[1px] w-8 sm:w-16 bg-red-600" />
        </div>

        <motion.div style={{ x: x1 }} className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter uppercase leading-tight">
          <span className="text-zinc-500">{c('phrase1_left', "WE DON'T JUST ")} </span>
          <span className="text-stroke-white hover:text-white transition-colors duration-300">{c('phrase1_right', 'FIND THE PROBLEM.')}</span>
        </motion.div>

        <div className="w-24 sm:w-36 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_20px_#e11d48]" />

        <motion.div style={{ x: x2 }} className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase text-white leading-tight">
          <span>{c('phrase2_left', 'WE ENGINEER THE ')} </span>
          <span className="text-red-600 drop-shadow-[0_0_30px_rgba(225,29,72,0.5)]">{c('phrase2_right', 'RIGHT SOLUTION.')}</span>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 mt-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
          <span>{c('spec1', '01 / ZERO GUESSWORK')}</span>
          <span>•</span>
          <span>{c('spec2', '02 / OEM PROTOCOLS')}</span>
          <span>•</span>
          <span>{c('spec3', '03 / DEDICATED PRECISION')}</span>
        </div>
      </motion.div>
    </div>
  );
};
