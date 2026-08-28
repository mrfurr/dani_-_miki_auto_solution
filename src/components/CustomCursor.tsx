import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState<string>('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'action' | 'hidden'>('default');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports touch or user prefers reduced motion
    const checkTouch = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
    setIsTouchDevice(checkTouch());

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Determine element under cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const button = target.closest('button, a, input, select, textarea');
      const bookingCTA = target.closest('[data-cursor="BOOK"]');
      const viewable = target.closest('[data-cursor="VIEW"], img, .cursor-view');
      const scannable = target.closest('[data-cursor="SCAN"]');
      const customBadge = target.closest('[data-cursor-text]');

      if (bookingCTA) {
        setCursorText('BOOK');
        setCursorVariant('action');
      } else if (scannable) {
        setCursorText('SCAN');
        setCursorVariant('action');
      } else if (customBadge) {
        const text = customBadge.getAttribute('data-cursor-text') || 'OPEN';
        setCursorText(text);
        setCursorVariant('action');
      } else if (viewable && !button) {
        setCursorText('VIEW');
        setCursorVariant('action');
      } else if (button) {
        setCursorText('OPEN');
        setCursorVariant('action');
      } else {
        setCursorText('');
        setCursorVariant('default');
      }
    };

    const handleMouseLeave = () => {
      setCursorVariant('hidden');
    };

    const handleMouseEnter = () => {
      setCursorVariant('default');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (isTouchDevice || cursorVariant === 'hidden') {
    return null;
  }

  const isAction = cursorVariant === 'action';

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Outer Follower Ring */}
      <motion.div
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full transition-colors duration-200 ${
          isAction
            ? 'bg-red-600/90 text-white font-mono font-bold text-[10px] tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.6)] backdrop-blur-xs'
            : 'border border-red-500/50 bg-transparent'
        }`}
        animate={{
          x: position.x - (isAction ? 36 : 16),
          y: position.y - (isAction ? 36 : 16),
          width: isAction ? 72 : 32,
          height: isAction ? 72 : 32,
          scale: isAction ? 1.05 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 350,
          mass: 0.4,
        }}
      >
        {isAction && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tracking-wider uppercase"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Center Precision Point */}
      {!isAction && (
        <motion.div
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
          animate={{
            x: position.x - 3,
            y: position.y - 3,
          }}
          transition={{
            type: 'spring',
            damping: 50,
            stiffness: 800,
            mass: 0.1,
          }}
        />
      )}
    </div>
  );
};
