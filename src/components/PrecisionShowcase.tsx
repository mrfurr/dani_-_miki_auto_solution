import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const PrecisionShowcase: React.FC<{ content?: Record<string,string> }> = ({ content = {} }) => {
  const c = (key: string, fb: string) => content[key] || fb;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.4], ['32px', '0px']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.75, 0.35, 0.65]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  const imgSrc = content['imageUrl'] || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=2000&q=90';

  return (
    <section ref={containerRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-black py-20">
      <motion.div style={{ borderRadius }} className="absolute inset-0 z-0 overflow-hidden mx-auto max-w-[1920px]">
        <motion.img style={{ scale }} src={imgSrc} alt="Dani & Miki Precision Workshop" className="w-full h-full object-cover object-center contrast-125 select-none" />
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div style={{ y: titleY }} className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/40 bg-red-950/60 backdrop-blur-md text-xs font-mono font-bold text-red-300 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{c('subtitle', 'UNCOMPROMISING STANDARDS')}</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight uppercase text-white leading-tight">
            {c('title', 'PRECISION IN')} <span className="text-red-500">{c('title_red', 'EVERY DETAIL.')}</span>
          </h2>

          <p className="max-w-2xl mx-auto text-zinc-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
            {c('body', 'From microscopic EEPROM soldering to high-load dynamometer tuning, our workshop operates at the intersection of mechanical craftsmanship and digital science.')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs font-mono text-zinc-400">
            <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
              <span className="text-red-500 font-bold">{c('stat1_value', '100%')}</span> {c('stat1_label', 'FACTORY OEM WIRE LOOM MAPPING')}
            </div>
            <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
              <span className="text-red-500 font-bold">{c('stat2_value', '0.01A')}</span> {c('stat2_label', 'PARASITIC DRAIN ISOLATION')}
            </div>
            <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
              <span className="text-red-500 font-bold">{c('stat3_value', 'LIFETIME')}</span> {c('stat3_label', 'ECU MAP CLOUD BACKUPS')}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
