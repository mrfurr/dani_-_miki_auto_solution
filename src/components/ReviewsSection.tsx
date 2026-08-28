import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Review } from '../types';
import { sounds } from '../utils/audio';
import { Star, Quote, ChevronLeft, ChevronRight, Pin } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
}

// How many cards are visible at once
const VISIBLE = 3;

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const total = reviews.length;
  const useCarousel = total > VISIBLE;

  // Auto-advance every 5s when carousel is active
  useEffect(() => {
    if (!useCarousel) return;
    autoPlayRef.current = setInterval(() => {
      setDirection('right');
      setActiveIdx(i => (i + 1) % total);
    }, 5000);
    return () => clearInterval(autoPlayRef.current);
  }, [total, useCarousel]);

  const goNext = useCallback(() => {
    clearInterval(autoPlayRef.current);
    sounds.playClick();
    setDirection('right');
    setActiveIdx(i => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    clearInterval(autoPlayRef.current);
    sounds.playClick();
    setDirection('left');
    setActiveIdx(i => (i - 1 + total) % total);
  }, [total]);

  const goTo = (idx: number) => {
    clearInterval(autoPlayRef.current);
    sounds.playClick();
    setDirection(idx > activeIdx ? 'right' : 'left');
    setActiveIdx(idx);
  };

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);
  };
  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const delta = endX - dragStartX.current;
    if (Math.abs(delta) > 50) {
      delta < 0 ? goNext() : goPrev();
    }
  };

  // Get visible cards for the carousel window
  const getVisibleCards = () => {
    if (!useCarousel) return reviews.map((r, i) => ({ review: r, offset: i }));
    return Array.from({ length: Math.min(VISIBLE, total) }, (_, i) => ({
      review: reviews[(activeIdx + i) % total],
      offset: i,
    }));
  };

  const visibleCards = getVisibleCards();
  const currentReview = reviews[activeIdx] ?? reviews[0];

  // Variants for carousel card animation
  const cardVariants = {
    enter: (dir: string) => ({
      x: dir === 'right' ? 80 : -80,
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    exit: (dir: string) => ({
      x: dir === 'right' ? -80 : 80,
      opacity: 0,
      scale: 0.94,
      transition: { duration: 0.22 },
    }),
  };

  if (reviews.length === 0) {
    return (
      <section id="reviews" className="relative py-28 bg-[#060608] border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-600 py-20 font-mono text-sm">
          No reviews yet
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="relative py-28 sm:py-36 bg-[#060608] border-t border-zinc-900 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-red-600/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-xs font-mono text-red-400 mb-3">
              <Quote size={14} className="text-red-500" />
              <span>VERIFIED DRIVER EXPERIENCES</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-white">
              CLIENT <span className="text-red-500">VOICES</span>
            </h2>
            <p className="text-zinc-500 text-sm mt-2 font-mono">
              {total} verified review{total !== 1 ? 's' : ''} from real customers
            </p>
          </div>

          {useCarousel && (
            <div className="flex items-center gap-3">
              <button onClick={goPrev} aria-label="Previous"
                className="w-12 h-12 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-red-600 hover:border-red-500 text-white flex items-center justify-center transition-all">
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-mono text-zinc-500 tabular-nums w-12 text-center">
                {activeIdx + 1} / {total}
              </span>
              <button onClick={goNext} aria-label="Next"
                className="w-12 h-12 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-red-600 hover:border-red-500 text-white flex items-center justify-center transition-all shadow-[0_0_20px_rgba(239,68,68,0.25)]">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* ── FEATURED QUOTE (always the active review) ── */}
        <div
          className="rounded-3xl border border-white/10 bg-[#0c0a0e] p-8 sm:p-14 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden mb-8 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={e => { if (isDragging) handleDragEnd(e); }}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <Quote size={160} className="absolute top-4 right-6 text-red-600/5 pointer-events-none select-none" />

          {/* Pinned badge */}
          {currentReview?.isPinned && (
            <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 text-[10px] font-mono font-bold uppercase">
              <Pin size={11} /> Featured
            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            {currentReview && (
              <motion.div
                key={currentReview.id}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-8 relative z-10"
              >
                {/* Stars */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={22}
                      className={s <= currentReview.rating ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-zinc-700 fill-zinc-700'} />
                  ))}
                  <span className="ml-3 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-950/80 border border-red-500/30 text-red-300 uppercase">
                    {currentReview.serviceType}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase leading-tight">
                  &ldquo;{currentReview.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-display font-bold text-lg text-white">{currentReview.author}</p>
                    <p className="text-xs font-mono text-zinc-400 mt-0.5">{currentReview.location} · {currentReview.carModel}</p>
                  </div>
                  {currentReview.mechanicName && (
                    <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-xs font-mono">
                      <span className="text-zinc-500">ENGINEER: </span>
                      <span className="text-red-400 font-bold">{currentReview.mechanicName}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe hint */}
          {useCarousel && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-700 font-mono pointer-events-none">
              ← swipe or drag →
            </p>
          )}
        </div>

        {/* ── CAROUSEL CARDS (slide animation) ── */}
        {useCarousel ? (
          <div className="relative overflow-hidden">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={activeIdx}
                custom={direction}
                initial={{ x: direction === 'right' ? '100%' : '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 32 } }}
                exit={{ x: direction === 'right' ? '-40%' : '40%', opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {visibleCards.map(({ review: rev, offset }) => (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: offset * 0.06 } }}
                    onClick={() => goTo(reviews.indexOf(rev))}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 ${
                      rev.id === currentReview?.id
                        ? 'bg-red-950/30 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                        : 'bg-zinc-900/40 hover:bg-zinc-900 border-white/5'
                    }`}
                  >
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={11}
                          className={s <= rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700 fill-zinc-700'} />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-white font-bold truncate pr-2">{rev.author}</span>
                      {rev.isPinned && <Pin size={10} className="text-yellow-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">&ldquo;{rev.text}&rdquo;</p>
                    {rev.mechanicName && (
                      <p className="text-[10px] text-red-400 font-mono mt-2 truncate">↳ {rev.mechanicName}</p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all rounded-full ${
                    i === activeIdx
                      ? 'w-6 h-2 bg-red-500'
                      : 'w-2 h-2 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* ── Static grid when ≤ 3 reviews ── */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reviews.map((rev, idx) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.08 } }}
                onClick={() => goTo(idx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 ${
                  rev.id === currentReview?.id
                    ? 'bg-red-950/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'bg-zinc-900/40 hover:bg-zinc-900 border-white/5 text-zinc-400'
                }`}
              >
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={12}
                      className={s <= rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700 fill-zinc-700'} />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-white font-bold">{rev.author}</span>
                  {rev.isPinned && <Pin size={10} className="text-yellow-400" />}
                </div>
                <p className="text-xs text-zinc-300 line-clamp-2">&ldquo;{rev.text}&rdquo;</p>
                {rev.mechanicName && (
                  <p className="text-[10px] text-red-400 font-mono mt-2">↳ {rev.mechanicName}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
