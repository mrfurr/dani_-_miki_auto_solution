import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';
import {
  Phone, MapPin, Clock, ArrowRight, Calendar,
  Send, CheckCircle2, AlertCircle, User, Mail, MessageSquare,
  Facebook, Instagram, Youtube, Twitter, Linkedin, ExternalLink
} from 'lucide-react';

// Telegram, TikTok, WhatsApp icons as SVGs (not in lucide)
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.82 1.54V6.78a4.84 4.84 0 0 1-1.05-.09z"/>
  </svg>
);

// Map platform name → icon component + brand color
function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('facebook'))  return { Icon: Facebook,    color: 'hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-600/30' };
  if (p.includes('instagram')) return { Icon: Instagram,   color: 'hover:bg-pink-600/20 hover:text-pink-400 hover:border-pink-600/30' };
  if (p.includes('telegram'))  return { Icon: TelegramIcon, color: 'hover:bg-sky-600/20 hover:text-sky-400 hover:border-sky-600/30' };
  if (p.includes('whatsapp'))  return { Icon: WhatsAppIcon, color: 'hover:bg-green-600/20 hover:text-green-400 hover:border-green-600/30' };
  if (p.includes('tiktok'))    return { Icon: TikTokIcon,  color: 'hover:bg-zinc-600/20 hover:text-zinc-200 hover:border-zinc-500/30' };
  if (p.includes('youtube'))   return { Icon: Youtube,     color: 'hover:bg-red-600/20 hover:text-red-400 hover:border-red-600/30' };
  if (p.includes('twitter') || p.includes('x.com')) return { Icon: Twitter, color: 'hover:bg-zinc-600/20 hover:text-zinc-200 hover:border-zinc-500/30' };
  if (p.includes('linkedin'))  return { Icon: Linkedin,   color: 'hover:bg-blue-700/20 hover:text-blue-400 hover:border-blue-700/30' };
  return { Icon: ExternalLink, color: 'hover:bg-zinc-600/20 hover:text-zinc-200 hover:border-zinc-500/30' };
}

interface SocialLink { id: string; platform: string; url: string; isActive: boolean }

interface ContactSectionProps {
  onOpenBooking: () => void;
  content?: Record<string, string>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking, content = {} }) => {
  const c = (key: string, fb: string) => content[key] || fb;

  // Social links from DB
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  useEffect(() => {
    fetch('/api/social')
      .then(r => r.ok ? r.json() : { links: [] })
      .then(d => setSocialLinks(d.links || []))
      .catch(() => {});
  }, []);

  // Contact form state
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [formErr,  setFormErr]  = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();

    if (!name.trim() || name.trim().length < 2) { setFormErr('Please enter your full name.'); return; }
    if (!email.trim() || !email.includes('@')) { setFormErr('Please enter a valid email address.'); return; }
    if (!message.trim() || message.trim().length < 10) { setFormErr('Message must be at least 10 characters.'); return; }

    setSending(true); setFormErr('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() || undefined, email: email.trim(), message: message.trim() }),
      });
      if (res.ok) {
        setSent(true);
        setName(''); setPhone(''); setEmail(''); setMessage('');
        // Reset the success state after 6 seconds
        setTimeout(() => setSent(false), 6000);
      } else {
        const d = await res.json();
        setFormErr(d.error || 'Failed to send. Please try again.');
      }
    } catch {
      setFormErr('Network error. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full bg-zinc-900/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10 transition-all";

  return (
    <section id="contact" className="relative py-28 sm:py-36 bg-[#07070a] border-t border-zinc-900 overflow-hidden">
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-xs font-mono text-red-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>{c('subtitle', 'DIRECT WORKSHOP COMMUNICATIONS')}</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-white leading-tight max-w-3xl mx-auto">
            {c('title', "LET'S GET YOUR VEHICLE MOVING.")}
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
            {c('body', "Whether diagnosing an elusive electrical error, programming a replacement smart key, or unlocking horsepower via custom ECU software — our master engineers are ready.")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              id="contact-book-cta-btn"
              data-cursor="BOOK"
              onClick={() => { sounds.playClick(); onOpenBooking(); }}
              className="flex items-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-xs tracking-wider uppercase text-white bg-red-600 hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all active:scale-95"
            >
              <Calendar size={15} />
              <span>{c('cta_primary', 'RESERVE WORKSHOP BAY')}</span>
              <ArrowRight size={15} />
            </button>
            <a
              href={`tel:${c('phone1', '+251911234567').replace(/\s/g, '')}`}
              onClick={() => sounds.playClick()}
              className="flex items-center gap-2.5 px-6 py-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 transition-all"
            >
              <Phone size={14} className="text-red-500" />
              <span>{c('cta_secondary', 'CALL WORKSHOP')}</span>
            </a>
          </div>
        </div>

        {/* Two-column: Contact info + Message Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

          {/* ── Left: Workshop info ── */}
          <div className="space-y-4">
            {/* Address */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-500">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Physical Workshop</div>
                  <div className="font-display font-bold text-base text-white">{c('address_title', 'Bole Medhanialem / Garage Zone')}</div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">{c('address_body', 'Addis Ababa, Ethiopia · Direct GPS Coordinates: 9.0024° N, 38.7882° E')}</p>
            </div>

            {/* Hours + Hotline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase">
                  <Clock size={14} /><span>WORKING HOURS</span>
                </div>
                <div className="text-sm font-bold text-white">{c('hours_label', 'Mon – Sat')}</div>
                <div className="text-xs font-mono text-zinc-400">{c('hours_value', '08:00 AM – 06:30 PM')}</div>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase">
                  <Phone size={14} /><span>DIRECT HOTLINE</span>
                </div>
                <a href={`tel:${c('phone1','+251911234567').replace(/\s/g,'')}`} className="text-sm font-bold text-white hover:text-red-400 transition-colors block">{c('phone1', '+251 911 234 567')}</a>
                <a href={`tel:${c('phone2','+251922987654').replace(/\s/g,'')}`} className="text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors block">{c('phone2', '+251 922 987 654')}</a>
              </div>
            </div>

            {/* Telegram/WhatsApp */}
            {/* Social Links — dynamic icons from DB */}
            {socialLinks.length > 0 && (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Follow &amp; Message Us</p>
                <div className="flex flex-wrap gap-2">
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
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-white/8 text-zinc-400 text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${color}`}
                      >
                        <Icon />
                        <span>{link.platform}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-white/10 h-48 bg-zinc-900/40 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin size={28} className="text-red-500/60 mx-auto" />
                <p className="text-xs font-mono text-zinc-500">BOLE MEDHANIALEM, ADDIS ABABA</p>
                <a
                  href={`https://maps.google.com/?q=Bole+Medhanialem+Addis+Ababa`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-400 hover:text-red-300 font-mono underline transition-colors"
                >
                  OPEN IN GOOGLE MAPS →
                </a>
              </div>
            </div>
          </div>

          {/* ── Right: Message form ── */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-md overflow-hidden">
              {/* Form header */}
              <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/20 flex items-center justify-center">
                  <MessageSquare size={18} className="text-red-400" />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-sm uppercase tracking-tight">Send a Message</p>
                  <p className="text-zinc-500 text-xs">We'll respond within 24 hours</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name + Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Full Name *"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Phone (optional)"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email Address *"
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-zinc-600 pointer-events-none" />
                  <textarea
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your vehicle issue or question in detail…"
                    className={`${inputClass} pl-10 resize-none`}
                    required
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {formErr && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2.5 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-400"
                    >
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      {formErr}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success */}
                <AnimatePresence>
                  {sent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl"
                    >
                      <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-emerald-300 text-sm">Message Sent!</p>
                        <p className="text-emerald-500/80 text-xs mt-0.5">We'll get back to you within 24 hours.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending || sent}
                  onClick={() => sounds.playClick()}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-display font-bold text-xs tracking-wider uppercase text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(220,38,38,0.35)] hover:shadow-[0_0_35px_rgba(220,38,38,0.5)] transition-all active:scale-[0.98]"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : sent ? (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Message Sent</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-zinc-600 font-mono">
                  Or call us directly: <a href={`tel:${c('phone1','+251911234567').replace(/\s/g,'')}`} className="text-red-500/80 hover:text-red-400 transition-colors">{c('phone1', '+251 911 234 567')}</a>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
