import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mechanic } from '../types';
import { sounds } from '../utils/audio';
import {
  Star, ShieldCheck, Wrench, Calendar,
  ChevronLeft, ChevronRight, MessageSquare,
  X, Send, CheckCircle2, AlertCircle, User, Mail, Phone
} from 'lucide-react';

interface MechanicsShowcaseProps {
  mechanics: Mechanic[];
  onBookWithMechanic: (mechanicId: string) => void;
}

// ─── Star rating picker ───────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => { sounds.playClick(); onChange(n); }}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={28}
            className={`transition-colors ${
              n <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                : 'text-zinc-700'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold text-yellow-400 font-mono">
          {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][value]}
        </span>
      )}
    </div>
  );
}

// ─── Review modal ─────────────────────────────────────────────────────────────
function ReviewModal({
  mechanic,
  onClose,
}: {
  mechanic: Mechanic;
  onClose: () => void;
}) {
  const [rating,     setRating]     = useState(0);
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (rating === 0)              { setError('Please select a star rating.');    return; }
    if (name.trim().length < 2)    { setError('Please enter your full name.');    return; }
    if (!email.includes('@'))      { setError('Please enter a valid email.');     return; }
    if (reviewText.trim().length < 10) { setError('Review must be at least 10 characters.'); return; }

    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mechanicId: mechanic.id,
          customer:   name.trim(),
          email:      email.trim(),
          phone:      phone.trim() || undefined,
          rating,
          reviewText: reviewText.trim(),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        sounds.playClick();
      } else {
        const d = await res.json();
        setError(d.error || 'Submission failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 24 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0d0d14] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {mechanic.avatar && (
              <img src={mechanic.avatar} alt={mechanic.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
            )}
            <div>
              <p className="font-bold text-white text-sm">Review {mechanic.name.split(' ')[0]}</p>
              <p className="text-zinc-500 text-xs">{mechanic.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/8 text-zinc-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          /* ── Success state ── */
          <div className="px-6 py-10 text-center space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 16 }}>
              <CheckCircle2 size={52} className="text-emerald-400 mx-auto" />
            </motion.div>
            <p className="font-display font-black text-2xl text-white uppercase">Thank You!</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your review is now live on the website and will also appear in the Reviews section.
            </p>
            <button onClick={onClose} className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all">
              Close
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Your Rating *</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name *"
                  className="w-full bg-[#0a0a10] border border-white/8 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all" required />
              </div>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (opt.)"
                  className="w-full bg-[#0a0a10] border border-white/8 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all" />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address *"
                className="w-full bg-[#0a0a10] border border-white/8 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all" required />
            </div>

            {/* Review text */}
            <div>
              <textarea rows={4} value={reviewText} onChange={e => setReviewText(e.target.value)}
                placeholder="Describe your experience in detail — what was the issue, how did this engineer solve it?…"
                className="w-full bg-[#0a0a10] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all resize-none" required />
              <p className="text-[10px] text-zinc-600 mt-1 text-right">{reviewText.length} / 1000</p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                  <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-40 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              {submitting
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</>
                : <><Send size={14} />Submit Review</>}
            </button>
            <p className="text-[10px] text-zinc-600 text-center">Reviews are moderated and appear after admin approval.</p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export const MechanicsShowcase: React.FC<MechanicsShowcaseProps> = ({
  mechanics,
  onBookWithMechanic,
}) => {
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [reviewTarget, setReviewTarget] = useState<Mechanic | null>(null);

  const activeMechanic = mechanics[activeIdx] ?? mechanics[0];

  const handleNext = () => { sounds.playClick(); setActiveIdx(p => (p + 1) % mechanics.length); };
  const handlePrev = () => { sounds.playClick(); setActiveIdx(p => (p - 1 + mechanics.length) % mechanics.length); };

  if (!activeMechanic) {
    return (
      <section id="mechanics" className="relative py-28 sm:py-36 bg-[#09090c] border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="mechanics" className="relative py-28 sm:py-36 bg-[#09090c] border-t border-zinc-900 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-xs font-mono text-red-400 mb-3">
                <Wrench size={14} className="text-red-500" />
                <span>THE SPECIALIST ROSTER</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-white">
                MASTER <span className="text-red-500">ENGINEERS</span>
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <button onClick={handlePrev} aria-label="Previous"
                className="w-12 h-12 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-red-600 hover:border-red-500 text-white flex items-center justify-center transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={handleNext} aria-label="Next"
                className="w-12 h-12 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-red-600 hover:border-red-500 text-white flex items-center justify-center transition-all shadow-[0_0_20px_rgba(239,68,68,0.25)]">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Mechanic selector tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 sm:mb-12 no-scrollbar border-b border-zinc-800">
            {mechanics.map((mech, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button key={mech.id} onClick={() => { sounds.playClick(); setActiveIdx(idx); }}
                  onMouseEnter={() => sounds.playHover()}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl whitespace-nowrap transition-all font-mono text-xs ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                      : 'bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5'
                  }`}>
                  <span className="font-bold">{mech.name.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-80">({mech.role.split(' ')[0]})</span>
                </button>
              );
            })}
          </div>

          {/* Active mechanic card */}
          <div className="rounded-3xl border border-white/10 bg-[#0c0c10] p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            <AnimatePresence mode="wait">
              <motion.div key={activeMechanic.id}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as any }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                {/* Photo */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                    <img src={activeMechanic.avatar} alt={activeMechanic.name}
                      className="w-full h-full object-cover object-center contrast-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{activeMechanic.completedJobs}+ Completed Diagnoses</span>
                      </div>
                      {/* Real star rating */}
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/80 backdrop-blur-md border border-red-500/30 text-xs font-mono text-red-300 font-bold">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span>{activeMechanic.rating > 0 ? activeMechanic.rating.toFixed(1) : 'New'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Review button */}
                  <button
                    onClick={() => { sounds.playClick(); setReviewTarget(activeMechanic); }}
                    className="mt-4 w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-white/10 hover:border-yellow-500/40 text-zinc-400 hover:text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider transition-all group"
                  >
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={13} className="text-zinc-700 group-hover:text-yellow-400 transition-colors fill-zinc-700 group-hover:fill-yellow-400" />
                      ))}
                    </div>
                    <MessageSquare size={13} />
                    <span>Leave a Review</span>
                  </button>
                </div>

                {/* Bio */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">
                        {activeMechanic.experienceYears} YEARS DIRECT EXPERIENCE
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                      <span className="text-xs font-mono text-emerald-400">ON DUTY AT WORKSHOP</span>
                    </div>
                    <h3 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">{activeMechanic.name}</h3>
                    <div className="text-sm sm:text-base font-mono text-zinc-300 font-medium">{activeMechanic.role}</div>

                    {/* Star rating display */}
                    {activeMechanic.rating > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={15}
                              className={i <= Math.round(activeMechanic.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700 fill-zinc-700'} />
                          ))}
                        </div>
                        <span className="text-yellow-400 font-bold text-sm">{activeMechanic.rating.toFixed(1)}</span>
                        <span className="text-zinc-600 text-xs font-mono">from customer reviews</span>
                      </div>
                    )}
                  </div>

                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">{activeMechanic.bio}</p>

                  <div>
                    <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Core Specializations</div>
                    <div className="flex flex-wrap gap-2">
                      {activeMechanic.specialties.map((spec, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-200">{spec}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Verified Industry Certifications</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeMechanic.certifications.map((cert, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs font-mono text-zinc-300">
                          <ShieldCheck size={14} className="text-red-500 shrink-0" />
                          <span className="truncate">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      id={`book-with-${activeMechanic.id}-btn`}
                      data-cursor="BOOK"
                      onClick={() => { sounds.playClick(); onBookWithMechanic(activeMechanic.id); }}
                      className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-xs tracking-wider uppercase text-white bg-red-600 hover:bg-red-500 shadow-[0_0_25px_rgba(220,38,38,0.45)] transition-all active:scale-95"
                    >
                      <Calendar size={14} />
                      <span>BOOK WITH {activeMechanic.name.split(' ')[0].toUpperCase()}</span>
                    </button>
                    <button
                      onClick={() => { sounds.playClick(); setReviewTarget(activeMechanic); }}
                      className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-mono text-xs font-bold uppercase text-zinc-400 hover:text-yellow-400 border border-white/10 hover:border-yellow-500/40 bg-zinc-900/50 hover:bg-zinc-800 transition-all"
                    >
                      <Star size={13} className="fill-zinc-600 group-hover:fill-yellow-400" />
                      <span>Rate &amp; Review</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Review modal */}
      <AnimatePresence>
        {reviewTarget && (
          <ReviewModal mechanic={reviewTarget} onClose={() => setReviewTarget(null)} />
        )}
      </AnimatePresence>
    </>
  );
};
