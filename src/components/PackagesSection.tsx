import React from 'react';
import { motion } from 'motion/react';
import { ServicePackage } from '../types';
import { sounds } from '../utils/audio';
import { Check, Zap, Sparkles, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface PackagesSectionProps {
  packages: ServicePackage[];
  onSelectPackage: (packageId: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  onSelectPackage,
}) => {
  return (
    <section id="packages" className="relative py-28 sm:py-36 bg-[#08080b] border-t border-zinc-900 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-tech-dots opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-xs font-mono text-red-400 mb-3">
            <Sparkles size={14} className="text-red-500" />
            <span>TRANSPARENT WORKSHOP PACKAGES</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-white">
            SERVICE <span className="text-red-500">TIERS</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Clear, all-inclusive pricing with fixed deposit protection (200 ETB). No hidden diagnostic fees or unexpected surcharges.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {packages.map((pkg) => {
            const isPopular = pkg.isPopular;
            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#140b0e] to-[#0c0a0c] border-2 border-red-500/80 shadow-[0_15px_40px_rgba(239,68,68,0.25)]'
                    : 'bg-[#0b0b0f] border border-white/10 hover:border-red-500/50 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* Popular Highlight Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-red-600 text-white font-mono font-bold text-[10px] uppercase tracking-wider shadow-[0_0_15px_#ef4444]">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  {/* Target Issue Tag */}
                  <div className="text-[10px] font-mono text-red-400/90 uppercase tracking-wider mb-2 font-bold line-clamp-1">
                    {pkg.targetIssue}
                  </div>

                  {/* Package Title */}
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight group-hover:text-red-400 transition-colors">
                    {pkg.name}
                  </h3>

                  {/* Duration Indicator */}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mt-2 mb-4">
                    <Clock size={13} className="text-red-400" />
                    <span>Est. Turnaround: {pkg.duration}</span>
                  </div>

                  {/* Price Block */}
                  <div className="my-6 p-4 rounded-2xl bg-black/40 border border-white/5 flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-400 uppercase">Standard Rate</div>
                      <div className="font-display font-black text-3xl text-white">
                        {pkg.priceEtb.toLocaleString()}{' '}
                        <span className="text-xs font-mono text-red-500 font-bold">ETB</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase">Deposit</div>
                      <div className="font-mono font-bold text-sm text-emerald-400">
                        {pkg.depositEtb} ETB
                      </div>
                    </div>
                  </div>

                  {/* Package Description */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                    {pkg.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-2 border-t border-zinc-800/80 mb-8">
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <div className="w-4 h-4 rounded-full bg-red-950 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                          <Check size={10} />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  id={`select-pkg-${pkg.id}-btn`}
                  data-cursor="BOOK"
                  onClick={() => {
                    sounds.playClick();
                    onSelectPackage(pkg.id);
                  }}
                  className={`w-full py-3.5 px-6 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-95'
                      : 'bg-zinc-900 hover:bg-red-600 text-zinc-200 hover:text-white border border-white/10 hover:border-red-500 active:scale-95'
                  }`}
                >
                  <span>BOOK THIS SERVICE</span>
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
