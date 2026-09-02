import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { sounds } from '../utils/audio';
import { Activity, ArrowUp, Facebook, Instagram, Youtube, Twitter, Linkedin, ExternalLink } from 'lucide-react';

// Inline SVG icons for platforms not in lucide
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.82 1.54V6.78a4.84 4.84 0 0 1-1.05-.09z"/>
  </svg>
);

function getSocialIcon(platform: string): { Icon: any; color: string } {
  const p = platform.toLowerCase();
  if (p.includes('facebook'))  return { Icon: Facebook,    color: 'hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10' };
  if (p.includes('instagram')) return { Icon: Instagram,   color: 'hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10' };
  if (p.includes('telegram'))  return { Icon: TelegramIcon, color: 'hover:text-sky-400 hover:border-sky-500/40 hover:bg-sky-500/10' };
  if (p.includes('whatsapp'))  return { Icon: WhatsAppIcon, color: 'hover:text-green-400 hover:border-green-500/40 hover:bg-green-500/10' };
  if (p.includes('tiktok'))    return { Icon: TikTokIcon,  color: 'hover:text-zinc-200 hover:border-zinc-500/40 hover:bg-zinc-500/10' };
  if (p.includes('youtube'))   return { Icon: Youtube,     color: 'hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10' };
  if (p.includes('twitter') || p.includes('x.com')) return { Icon: Twitter, color: 'hover:text-zinc-200 hover:border-zinc-500/40 hover:bg-zinc-500/10' };
  if (p.includes('linkedin'))  return { Icon: Linkedin,   color: 'hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10' };
  return { Icon: ExternalLink, color: 'hover:text-zinc-200 hover:border-zinc-500/40 hover:bg-zinc-500/10' };
}

interface SocialLink { id: string; platform: string; url: string; isActive: boolean }

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenBooking: () => void;
  content?: Record<string, string>;
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenBooking, content = {}, logoUrl }) => {
  const c = (key: string, fb: string) => content[key] || fb;
  const scrollToTop = () => { sounds.playClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  useEffect(() => {
    fetch('/api/social')
      .then(r => r.ok ? r.json() : { links: [] })
      .then(d => setSocialLinks(d.links || []))
      .catch(() => {});
  }, []);

  return (
    <footer className="relative bg-[#040406] text-zinc-400 overflow-hidden border-t border-zinc-900 pt-16 pb-12">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-zinc-900 overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-500 to-transparent animate-laser shadow-[0_0_15px_#ef4444]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/5">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" imageUrl={logoUrl || null} />
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed font-normal">
              {c('tagline', 'Precision automotive electronic engineering, deep OEM computer diagnostics, custom ECU calibrations, and immobilizer cryptographic solutions in Addis Ababa.')}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/20 text-[11px] font-mono text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{c('status_badge', 'DIAGNOSTIC BAYS ACTIVE')}</span>
            </div>

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {socialLinks.map(link => {
                  const { Icon, color } = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sounds.playClick()}
                      title={link.platform}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border border-white/8 bg-zinc-900/50 text-zinc-500 transition-all hover:scale-110 active:scale-95 ${color}`}
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Disciplines */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-white">DISCIPLINES</div>
            <ul className="space-y-2 text-xs font-mono">
              {['Computer Diagnostics','ECU Programming','Auto Electrical & Wiring','Smart Key Programming','DPF Chemical Flush'].map((item) => (
                <li key={item}>
                  <button onClick={() => { sounds.playClick(); onNavigateSection('services'); }} className="hover:text-red-400 transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Exploration */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-white">EXPLORATION</div>
            <ul className="space-y-2 text-xs font-mono">
              {[
                { label: 'Diagnostic Scanner HUD', section: 'diagnostics', icon: true },
                { label: 'Engineer Roster',         section: 'mechanics'  },
                { label: 'Service Pricing',          section: 'packages'   },
                { label: 'Client Reviews',           section: 'reviews'    },
              ].map(({ label, section, icon }) => (
                <li key={label}>
                  <button onClick={() => { sounds.playClick(); onNavigateSection(section); }} className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                    {icon && <Activity size={12} className="text-red-500" />}
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Workshop */}
          <div className="space-y-3 font-mono text-xs">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-white">WORKSHOP</div>
            <div className="space-y-1 text-zinc-300">
              <div>{c('address_line1', 'Bole Medhanialem')}</div>
              <div className="text-zinc-500">{c('address_line2', 'Addis Ababa, Ethiopia')}</div>
            </div>
            <div className="text-red-400 font-bold text-sm">{c('phone', '+251 911 234 567')}</div>
            <button
              onClick={() => { sounds.playClick(); onOpenBooking(); }}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
            >
              {c('cta', 'BOOK ONLINE')}
            </button>
          </div>
        </div>

        {/* Watermark */}
        <div className="py-10 sm:py-14 text-center select-none overflow-hidden relative">
          <div className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase text-stroke-white select-none opacity-20 hover:opacity-40 transition-opacity duration-500 leading-none">
            DANI &amp; MIKI
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-8 sm:w-16 bg-red-600/40" />
            <div className="font-mono text-xs sm:text-sm font-bold tracking-[0.4em] uppercase text-red-500/80">
              {c('subtitle', 'AUTO SOLUTION · PRECISION IN EVERY DETAIL')}
            </div>
            <div className="h-[1px] w-8 sm:w-16 bg-red-600/40" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-500">
          <div suppressHydrationWarning>© {new Date().getFullYear()} {c('copyright', 'DANI & MIKI AUTO SOLUTION. ALL RIGHTS RESERVED.')}</div>
          <div className="flex items-center gap-6">
            <button onClick={scrollToTop} className="flex items-center gap-1.5 text-zinc-400 hover:text-red-400 transition-colors">
              <span>BACK TO TOP</span><ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
