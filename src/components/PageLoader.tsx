import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';

interface PageLoaderProps {
  onComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'logo' | 'scan' | 'scale' | 'done'>('logo');

  useEffect(() => {
    // Stage 1: Logo appears
    const timer1 = setTimeout(() => setStage('scan'), 350);
    // Stage 2: Red line scans
    const timer2 = setTimeout(() => setStage('scale'), 800);
    // Stage 3: Complete reveal
    const timer3 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 1350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.04,
            filter: 'blur(8px)',
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070709] select-none pointer-events-auto"
        >
          {/* Subtle background tech grid */}
          <div className="absolute inset-0 bg-tech-grid opacity-20" />
          
          {/* Red scanning laser beam */}
          <motion.div
            initial={{ left: '-20%', opacity: 0 }}
            animate={
              stage === 'scan' || stage === 'scale'
                ? { left: '120%', opacity: [0, 1, 1, 0] }
                : { left: '-20%', opacity: 0 }
            }
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-red-600/30 to-transparent pointer-events-none skew-x-12 blur-sm"
          />

          {/* Central Laser Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={
              stage === 'scan' || stage === 'scale'
                ? { scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }
                : { scaleX: 0, opacity: 0 }
            }
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ef4444]"
          />

          {/* Central Logo Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ 
              opacity: 1, 
              scale: stage === 'scale' ? 1.05 : 1, 
              y: 0 
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            <BrandLogo size="xl" showTagline={true} />

            {/* Diagnostic system initialization ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.9, 0.6] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="flex items-center gap-2 mt-4 px-3 py-1 rounded border border-red-500/20 bg-red-950/20 text-[11px] font-mono text-red-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>INITIALIZING SYSTEM TELEMETRY...</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
