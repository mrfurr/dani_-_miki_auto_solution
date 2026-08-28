import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceItem } from '../types';
import { sounds } from '../utils/audio';
import { 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  Gauge, 
  Terminal, 
  ChevronRight 
} from 'lucide-react';

interface ServicesShowcaseProps {
  services: ServiceItem[];
  onSelectServiceForBooking: (serviceId: string) => void;
  sectionContent?: { title?: string; subtitle?: string; ctaText?: string };
}

export const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({
  services,
  onSelectServiceForBooking,
  sectionContent = {},
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeService = services[activeIdx] || services[0];

  const handleSelectService = (idx: number) => {
    if (idx === activeIdx) return;
    sounds.playClick();
    setActiveIdx(idx);
  };

  return (
    <section id="services" className="relative py-28 sm:py-36 bg-[#09090c] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/25 bg-red-950/30 text-xs font-mono text-red-400 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>{sectionContent.subtitle || 'SPECIALIZED WORKSHOP DISCIPLINES'}</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-white">
              {(sectionContent.title || 'CORE SOLUTIONS').replace(' ', ' ').split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-red-500">{(sectionContent.title || 'CORE SOLUTIONS').split(' ').slice(-1)[0]}</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md font-normal leading-relaxed">
            Engineered diagnostic workflows and manufacturer-grade programming protocols tailored for complex vehicle systems.
          </p>
        </div>

        {/* Service Navigation Pill Strip / Index Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-12 no-scrollbar border-b border-zinc-800/80">
          {services.map((srv, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={srv.id}
                id={`service-tab-${srv.numberCode}`}
                onClick={() => handleSelectService(idx)}
                onMouseEnter={() => sounds.playHover()}
                className={`relative flex items-center gap-3 px-4 sm:px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-mono text-xs ${
                  isActive
                    ? 'bg-red-600 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                    : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/5'
                }`}
              >
                <span className={`font-bold ${isActive ? 'text-white' : 'text-red-500'}`}>
                  {srv.numberCode}
                </span>
                <span>{srv.title}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Showcase Theater Layout: Left Details, Right Cinematic Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Rich Service Specs & Details (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Number & Tagline */}
                <div className="flex items-center gap-4">
                  <span className="font-display font-black text-4xl sm:text-5xl text-red-500/80 font-mono">
                    {activeService.numberCode}
                  </span>
                  <div className="h-6 w-[1px] bg-zinc-700" />
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                    {activeService.tagline}
                  </span>
                </div>

                {/* Main Service Title */}
                <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
                  {activeService.title}
                </h3>

                {/* Service Description */}
                <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
                  {activeService.description}
                </p>

                {/* Feature Bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeService.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/40 border border-white/5"
                    >
                      <CheckCircle2 size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-zinc-300 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Technical Specifications Bar */}
                <div className="p-4 rounded-xl glass-panel border border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase">
                      <Clock size={12} className="text-red-400" />
                      <span>Turnaround</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-1">
                      {activeService.techDetails.turnaround}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase">
                      <Gauge size={12} className="text-red-400" />
                      <span>Accuracy</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-1">
                      {activeService.techDetails.accuracyRate}
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase">
                      <Terminal size={12} className="text-red-400" />
                      <span>Tooling</span>
                    </div>
                    <div className="text-xs font-mono text-zinc-300 mt-1 truncate">
                      {activeService.techDetails.equipmentUsed}
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    id={`book-service-${activeService.id}-btn`}
                    data-cursor="BOOK"
                    onClick={() => { sounds.playClick(); onSelectServiceForBooking(activeService.id); }}
                    className="flex items-center gap-3 px-6 py-3.5 rounded-xl font-display font-bold text-xs tracking-wider uppercase text-white bg-red-600 hover:bg-red-500 shadow-[0_0_25px_rgba(220,38,38,0.45)] transition-all active:scale-95"
                  >
                    <span>{sectionContent.ctaText || 'BOOK THIS SERVICE'}</span>
                    <ArrowRight size={14} />
                  </button>

                  <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Workshop Slots Ready</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Cinematic Image with Red Flash Transition (5 Columns) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-zinc-950">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ scale: 1.12, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="w-full h-full object-cover object-center contrast-125 brightness-90"
                    loading="lazy"
                  />
                  {/* Subtle Dark Vignette & Red Light Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-black/40" />
                  <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay" />
                </motion.div>
              </AnimatePresence>

              {/* Red Flash Laser Sweep Effect on Change */}
              <motion.div
                key={`laser-${activeService.id}`}
                initial={{ left: '-100%', opacity: 0.8 }}
                animate={{ left: '200%', opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-red-500/50 to-transparent skew-x-12 pointer-events-none z-20"
              />

              {/* Live Overlay Diagnostic Watermark */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300">
                  <span>DISCIPLINE: </span>
                  <span className="text-red-400 font-bold">{activeService.category}</span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg bg-red-950/80 backdrop-blur-md border border-red-500/30 text-[10px] font-mono text-red-300">
                  CALIBRATED
                </div>
              </div>
            </div>

            {/* Quick Next Service Trigger */}
            <button
              onClick={() => handleSelectService((activeIdx + 1) % services.length)}
              className="mt-4 flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors ml-auto"
            >
              <span>NEXT DISCIPLINE</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
