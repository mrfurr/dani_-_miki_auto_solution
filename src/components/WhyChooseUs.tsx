import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ShieldCheck, Cpu, Clock, Award } from 'lucide-react';

export const WhyChooseUs: React.FC<{ content?: Record<string,string> }> = ({ content = {} }) => {
  const c = (key: string, fb: string) => content[key] || fb;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const stats = [
    { key: 'stat1', defaultN: '500', defaultS: '+', defaultL: 'VEHICLES SERVICED', defaultD: 'Precision repairs across German, Japanese, and American luxury & performance vehicles.' },
    { key: 'stat2', defaultN: '1000', defaultS: '+', defaultL: 'DIAGNOSTIC SCANS', defaultD: 'Deep level CAN-bus & control module fault extractions with zero false positives.' },
    { key: 'stat3', defaultN: '5', defaultS: '+', defaultL: 'SPECIALIZED DISCIPLINES', defaultD: 'ECU mapping, electronic micro-soldering, key immobilizers, DPF care, and diagnostics.' },
    { key: 'stat4', defaultN: '100', defaultS: '%', defaultL: 'PRECISION RATE', defaultD: 'Rigorous pre-delivery health validation and warranty-backed service execution.' },
  ];

  const pillars = [
    { icon: Cpu, key: 'pillar1', defaultT: 'OEM Equipment & Software', defaultB: 'We invest in genuine factory diagnostic units (Autel Ultra, Bosch KTS, WinOLS, Kess3, PicoScope) to interface directly with vehicle computers.' },
    { icon: ShieldCheck, key: 'pillar2', defaultT: 'Transparent Digital Reports', defaultB: 'Every customer receives an unedited digital telemetry printout detailing live DTC codes, sensor readings, and exact repair roadmaps.' },
    { icon: Clock, key: 'pillar3', defaultT: 'Guaranteed Turnaround', defaultB: 'Structured workflow schedules ensure your vehicle is diagnosed swiftly and returned in pristine operational status without unnecessary delays.' },
  ];

  return (
    <section ref={containerRef} className="relative py-28 sm:py-36 bg-[#08080b] border-t border-zinc-900 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-tech-dots opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-xs font-mono text-red-400 mb-3">
            <Award size={14} className="text-red-500" />
            <span>{c('subtitle', 'MEASURED EXCELLENCE')}</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-white">
            {c('title', 'ENGINEERED')} <span className="text-red-500">{c('title_red', 'FOR TRUST')}</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            {c('intro', "Why Addis Ababa's most discerning motorists trust Dani & Miki Auto Solution with their high-value automotive investments.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s) => (
            <StatCard
              key={s.key}
              target={parseInt(c(`${s.key}_number`, s.defaultN)) || parseInt(s.defaultN)}
              suffix={c(`${s.key}_suffix`, s.defaultS)}
              label={c(`${s.key}_label`, s.defaultL)}
              description={c(`${s.key}_desc`, s.defaultD)}
              startAnimation={isInView}
            />
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, key, defaultT, defaultB }) => (
            <div key={key} className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-red-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <Icon size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">{c(`${key}_title`, defaultT)}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">{c(`${key}_body`, defaultB)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatCard: React.FC<{ target: number; suffix: string; label: string; description: string; startAnimation: boolean }> = ({ target, suffix, label, description, startAnimation }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startAnimation) return;
    let start = 0;
    const stepTime = 20;
    const totalSteps = 1800 / stepTime;
    const increment = target / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, stepTime);
    return () => clearInterval(timer);
  }, [startAnimation, target]);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-white/10 hover:border-red-500/40 transition-all duration-300 group hover:-translate-y-1">
      <div className="font-display font-black text-5xl sm:text-6xl text-red-500 tracking-tight leading-none drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
        {count}<span>{suffix}</span>
      </div>
      <div className="mt-3 font-mono font-bold text-xs uppercase tracking-wider text-white">{label}</div>
      <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{description}</p>
      <div className="w-8 h-1 bg-red-600 rounded-full mt-4 group-hover:w-full transition-all duration-500" />
    </div>
  );
};
