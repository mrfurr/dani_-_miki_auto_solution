import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { sounds } from '../utils/audio';
import { 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Wrench, 
  Calendar,
  PhoneCall,
  Activity
} from 'lucide-react';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
  isAdminOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAdmin,
  onNavigateSection,
  isAdminOpen,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section
      const sections = ['hero', 'services', 'diagnostics', 'mechanics', 'packages', 'reviews', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'diagnostics', label: 'Diagnostic HUD' },
    { id: 'mechanics', label: 'Mechanics' },
    { id: 'packages', label: 'Packages' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    sounds.playClick();
    onNavigateSection(id);
    setIsMobileMenuOpen(false);
  };

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playClick();
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 rounded-2xl px-4 sm:px-6 ${
            isScrolled
              ? 'glass-panel bg-[#09090b]/80 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2.5'
              : 'bg-transparent py-1'
          }`}
        >
          {/* Logo */}
          <div onClick={() => handleNavClick('hero')} className="cursor-pointer">
            <BrandLogo size={isScrolled ? 'sm' : 'md'} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  onMouseEnter={() => sounds.playHover()}
                  className={`relative px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors duration-200 rounded-lg ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-red-600/15 border border-red-500/40 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              id="audio-toggle-btn"
              onClick={handleToggleSound}
              title={isMuted ? 'Unmute UI Audio SFX' : 'Mute UI Audio SFX'}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-red-400 transition-colors"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Primary CTA: Book Service */}
            <button
              id="header-book-cta-btn"
              data-cursor="BOOK"
              onClick={() => {
                sounds.playClick();
                onOpenBooking();
              }}
              onMouseEnter={() => sounds.playHover()}
              className="relative group overflow-hidden px-4 sm:px-5 py-2 rounded-xl font-display font-bold text-xs tracking-wider uppercase text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-[0_0_25px_rgba(220,38,38,0.45)] transition-all duration-300 active:scale-95"
            >
              <div className="relative z-10 flex items-center gap-2">
                <Calendar size={13} className="text-red-200 group-hover:rotate-12 transition-transform" />
                <span>BOOK SERVICE</span>
              </div>
              {/* Animated edge sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 pointer-events-none" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => {
                sounds.playClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-zinc-900/80 text-zinc-200 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden max-w-7xl mx-auto px-4 mt-2"
          >
            <div className="glass-panel-red rounded-2xl p-5 border border-red-500/30 bg-[#0c0a0c]/95 shadow-2xl flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-red-950/30 text-left text-sm font-mono tracking-wider uppercase text-zinc-300 hover:text-white transition-colors"
                >
                  <span>{link.label}</span>
                  {activeSection === link.id && (
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  )}
                </button>
              ))}

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={handleToggleSound}
                  className="flex items-center gap-2 text-xs font-mono text-zinc-400"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{isMuted ? 'Audio Muted' : 'Audio Active'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono text-red-400 hover:text-red-300 font-bold"
                >
                  <Calendar size={14} />
                  <span>Book Service</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
