import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, ServicePackage, Mechanic, Review, BookingStatus } from '../types';
import { sounds } from '../utils/audio';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Trash2, 
  Search, 
  Filter, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  Car, 
  Wrench, 
  Star, 
  Sparkles, 
  Check, 
  Eye, 
  RefreshCw, 
  Layers,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { HERO_BG_PRESETS, DEFAULT_HERO_BG } from '../data/initialData';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  packages: ServicePackage[];
  mechanics: Mechanic[];
  reviews: Review[];
  heroBackground: string;
  onUpdateHeroBackground: (url: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onAssignMechanic: (bookingId: string, mechanicId: string) => void;
  onDeleteBooking: (bookingId: string) => void;
  onToggleReviewPin: (reviewId: string) => void;
  onResetData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  bookings,
  packages,
  mechanics,
  reviews,
  heroBackground,
  onUpdateHeroBackground,
  onUpdateBookingStatus,
  onAssignMechanic,
  onDeleteBooking,
  onToggleReviewPin,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'packages' | 'mechanics' | 'reviews' | 'hero_bg'>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<Booking | null>(null);

  // Hero BG state inside Admin
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // File upload and canvas compression handler
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setIsUploading(true);
    setUploadFeedback(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 1920;
        const maxHeight = 1080;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onUpdateHeroBackground(compressedDataUrl);
          sounds.playSuccess();
          setUploadFeedback(`Garage picture uploaded successfully (${width} × ${height}px)!`);
        } else {
          const rawUrl = e.target?.result as string;
          onUpdateHeroBackground(rawUrl);
          sounds.playSuccess();
          setUploadFeedback('Garage picture uploaded successfully!');
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        alert('Could not decode the uploaded image.');
        setIsUploading(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      alert('Failed to read image file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    onUpdateHeroBackground(customUrlInput.trim());
    sounds.playSuccess();
    setUploadFeedback('Custom Hero background URL applied!');
    setCustomUrlInput('');
  };

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesQuery =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const pendingCount = bookings.filter((b) => b.status === 'pending_verification').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const inProgressCount = bookings.filter((b) => b.status === 'in_progress').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-6xl rounded-2xl bg-[#0e0e13] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-white/10 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white uppercase tracking-tight">
                DANI &amp; MIKI WORKSHOP CMS
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                OPERATIONAL DASHBOARD &amp; BOOKING DISPATCH
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Reset mock workshop records to original dataset?')) {
                  sounds.playClick();
                  onResetData();
                }
              }}
              title="Reset sample records"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-zinc-800 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <RefreshCw size={12} />
              <span className="hidden sm:inline">Reset Data</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-white/5 bg-zinc-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('bookings');
            }}
            className={`py-3 px-4 border-b-2 font-bold uppercase transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-red-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar size={14} />
            <span>BOOKINGS</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('packages');
            }}
            className={`py-3 px-4 border-b-2 font-bold uppercase transition-all flex items-center gap-2 ${
              activeTab === 'packages'
                ? 'border-red-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles size={14} />
            <span>SERVICE PACKAGES ({packages.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('mechanics');
            }}
            className={`py-3 px-4 border-b-2 font-bold uppercase transition-all flex items-center gap-2 ${
              activeTab === 'mechanics'
                ? 'border-red-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Wrench size={14} />
            <span>ENGINEER ROSTER ({mechanics.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('reviews');
            }}
            className={`py-3 px-4 border-b-2 font-bold uppercase transition-all flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-red-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Star size={14} />
            <span>REVIEWS CMS ({reviews.length})</span>
          </button>

          <button
            id="admin-tab-hero-bg"
            onClick={() => {
              sounds.playClick();
              setActiveTab('hero_bg');
            }}
            className={`py-3 px-4 border-b-2 font-bold uppercase transition-all flex items-center gap-2 ${
              activeTab === 'hero_bg'
                ? 'border-red-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ImageIcon size={14} />
            <span>HERO BACKGROUND &amp; MEDIA</span>
          </button>
        </div>

        {/* Dashboard Main Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#09090c]">
          {/* TAB 1: BOOKING MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Total Bookings</div>
                  <div className="font-mono font-bold text-2xl text-white mt-1">{bookings.length}</div>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
                  <div className="text-[10px] font-mono text-amber-400 uppercase">Pending Verification</div>
                  <div className="font-mono font-bold text-2xl text-amber-300 mt-1">{pendingCount}</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">Confirmed Deposits</div>
                  <div className="font-mono font-bold text-2xl text-emerald-300 mt-1">{confirmedCount}</div>
                </div>

                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                  <div className="text-[10px] font-mono text-red-400 uppercase">In Progress / Active</div>
                  <div className="font-mono font-bold text-2xl text-red-300 mt-1">{inProgressCount}</div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, plate, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar font-mono text-[11px]">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'pending_verification', label: 'Pending' },
                    { id: 'confirmed', label: 'Confirmed' },
                    { id: 'in_progress', label: 'In Progress' },
                    { id: 'completed', label: 'Completed' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => {
                        sounds.playClick();
                        setStatusFilter(filter.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        statusFilter === filter.id
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-white/5'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table / Cards */}
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-900/80 text-zinc-400 border-b border-white/10 uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Ref ID</th>
                        <th className="py-3 px-4">Customer &amp; Vehicle</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Date &amp; Slot</th>
                        <th className="py-3 px-4">Deposit Status</th>
                        <th className="py-3 px-4">Assigned Engineer</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-zinc-500">
                            No bookings found matching current filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => {
                          const assignedMech = mechanics.find((m) => m.id === b.assignedMechanicId);
                          return (
                            <tr key={b.id} className="hover:bg-zinc-900/40 transition-colors">
                              {/* ID */}
                              <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                                {b.id}
                              </td>

                              {/* Customer & Vehicle */}
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-white">{b.customerName}</div>
                                <div className="text-[11px] text-zinc-400">{b.phone}</div>
                                <div className="text-[10px] text-red-400 mt-0.5">
                                  {b.vehicleMake} {b.vehicleModel} ({b.plateNumber})
                                </div>
                              </td>

                              {/* Service */}
                              <td className="py-3.5 px-4 max-w-xs">
                                <div className="font-medium text-zinc-200 truncate">{b.serviceTitle}</div>
                                {b.notes && (
                                  <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                                    "{b.notes}"
                                  </div>
                                )}
                              </td>

                              {/* Date */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="text-zinc-200">{b.preferredDate}</div>
                                <div className="text-[10px] text-zinc-400">{b.preferredTime}</div>
                              </td>

                              {/* Deposit / Payment Status */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      b.status === 'confirmed'
                                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                        : b.status === 'pending_verification'
                                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                                        : b.status === 'in_progress'
                                        ? 'bg-red-950 text-red-400 border border-red-500/30'
                                        : 'bg-zinc-800 text-zinc-400'
                                    }`}
                                  >
                                    {b.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <div className="text-[10px] text-zinc-400 mt-1">
                                  {b.depositAmount} ETB via {b.paymentMethod}
                                </div>
                                <button
                                  onClick={() => {
                                    sounds.playClick();
                                    setSelectedBookingForReceipt(b);
                                  }}
                                  className="text-[10px] text-red-400 hover:text-red-300 underline mt-0.5 flex items-center gap-1"
                                >
                                  <Eye size={10} />
                                  <span>View Ref #{b.paymentRefNumber}</span>
                                </button>
                              </td>

                              {/* Mechanic Assignment */}
                              <td className="py-3.5 px-4">
                                <select
                                  aria-label="Assign Engineer"
                                  value={b.assignedMechanicId || ''}
                                  onChange={(e) => {
                                    sounds.playClick();
                                    onAssignMechanic(b.id, e.target.value);
                                  }}
                                  className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-red-500"
                                >
                                  <option value="">Unassigned</option>
                                  {mechanics.map((m) => (
                                    <option key={m.id} value={m.id}>
                                      {m.name.split(' ')[0]} ({m.role.split(' ')[0]})
                                    </option>
                                  ))}
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                  {b.status === 'pending_verification' && (
                                    <button
                                      onClick={() => {
                                        sounds.playSuccess();
                                        onUpdateBookingStatus(b.id, 'confirmed');
                                      }}
                                      title="Approve Deposit"
                                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                                    >
                                      APPROVE
                                    </button>
                                  )}

                                  {b.status === 'confirmed' && (
                                    <button
                                      onClick={() => {
                                        sounds.playClick();
                                        onUpdateBookingStatus(b.id, 'in_progress');
                                      }}
                                      title="Mark in progress"
                                      className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold"
                                    >
                                      START WORK
                                    </button>
                                  )}

                                  {b.status === 'in_progress' && (
                                    <button
                                      onClick={() => {
                                        sounds.playSuccess();
                                        onUpdateBookingStatus(b.id, 'completed');
                                      }}
                                      title="Mark completed"
                                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold"
                                    >
                                      COMPLETE
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete booking ${b.id}?`)) {
                                        sounds.playClick();
                                        onDeleteBooking(b.id);
                                      }
                                    }}
                                    title="Delete record"
                                    className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PACKAGES CMS */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-zinc-400">
                ACTIVE WORKSHOP PACKAGES &amp; TARIFF MANAGEMENT
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-display font-bold text-base text-white">{pkg.name}</div>
                      <span className="font-mono text-sm text-red-400 font-bold">
                        {pkg.priceEtb.toLocaleString()} ETB
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{pkg.description}</p>
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-2 border-t border-zinc-800">
                      <span>Turnaround: {pkg.duration}</span>
                      <span>Fixed Deposit: {pkg.depositEtb} ETB</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MECHANICS ROSTER */}
          {activeTab === 'mechanics' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-zinc-400">
                CERTIFIED ENGINEER ROSTER &amp; WORKSHOP WORKLOAD
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mechanics.map((m) => (
                  <div key={m.id} className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10 flex gap-4">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                    <div className="space-y-1">
                      <div className="font-display font-bold text-white">{m.name}</div>
                      <div className="text-xs text-red-400 font-mono">{m.role}</div>
                      <div className="text-xs text-zinc-400 font-mono">
                        {m.experienceYears} Years Exp · ★ {m.rating} · {m.completedJobs} Jobs
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS CMS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-zinc-400">
                CUSTOMER REVIEWS &amp; HOMEPAGE PIN MANAGEMENT
              </div>
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-zinc-900/50 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{r.author}</span>
                        <span className="text-[10px] font-mono text-zinc-400">({r.carModel})</span>
                        <span className="text-red-500 text-xs">{'★'.repeat(r.rating)}</span>
                      </div>
                      <p className="text-xs text-zinc-300">"{r.text}"</p>
                    </div>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        onToggleReviewPin(r.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                        r.isPinned
                          ? 'bg-red-600 text-white shadow-[0_0_10px_#ef4444]'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {r.isPinned ? 'PINNED ✓' : 'PIN REVIEW'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HERO MEDIA & BACKGROUND MANAGEMENT */}
          {activeTab === 'hero_bg' && (
            <div className="space-y-6">
              {/* Header & Quick Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="font-display font-bold text-sm text-white uppercase tracking-tight flex items-center gap-2">
                    <ImageIcon className="text-red-500" size={16} />
                    <span>HERO SECTION BACKGROUND &amp; MEDIA CMS</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    UPLOAD YOUR GARAGE PICTURE OR SELECT FROM CURATED WORKSHOP PRESETS
                  </div>
                </div>

                <button
                  onClick={() => {
                    onUpdateHeroBackground(DEFAULT_HERO_BG);
                    sounds.playSuccess();
                    setUploadFeedback('Reset to default workshop garage bay!');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-900/30 text-xs font-mono text-red-300 hover:text-white transition-colors self-start sm:self-auto"
                >
                  <RotateCcw size={13} />
                  <span>RESET TO DEFAULT GARAGE</span>
                </button>
              </div>

              {/* Feedback Alert Toast if updated */}
              {uploadFeedback && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>{uploadFeedback}</span>
                  </div>
                  <button
                    onClick={() => setUploadFeedback(null)}
                    className="text-emerald-400 hover:text-white text-xs font-bold"
                  >
                    DISMISS
                  </button>
                </div>
              )}

              {/* Two Column Grid: Left Live Preview, Right Upload & URL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column (5 Cols): Live Hero Simulation Preview */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs font-mono uppercase text-zinc-400 flex items-center justify-between">
                    <span>ACTIVE HERO BACKGROUND SIMULATION</span>
                    <span className="text-[10px] text-red-400 font-bold bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded">
                      LIVE ON HOMEPAGE
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-black shadow-[0_10px_30px_rgba(0,0,0,0.8)] group">
                    <img
                      src={heroBackground}
                      alt="Active Hero Preview"
                      className="w-full h-full object-cover object-center brightness-95 contrast-105"
                    />
                    {/* Simulated Minimal Shading */}
                    <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                    {/* Simulated Typography Layer */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end pointer-events-none">
                      <div className="text-[9px] font-mono text-red-500 font-bold tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        EXCELLENCE IN AUTOMOTIVE
                      </div>
                      <div className="font-display font-black text-white text-base tracking-tight leading-none mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        DANI &amp; MIKI <span className="text-red-500">AUTO SOLUTION</span>
                      </div>
                      <div className="text-[8px] text-zinc-300 font-mono mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                        PRECISION DIAGNOSTICS &amp; ECU PROGRAMMING
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                    <span>Source Type:</span>
                    <span className="text-zinc-200 truncate max-w-[240px]">
                      {heroBackground.startsWith('data:') ? 'Custom Uploaded Picture (Base64)' : heroBackground.slice(0, 36) + '...'}
                    </span>
                  </div>
                </div>

                {/* Right Column (7 Cols): Upload Options */}
                <div className="lg:col-span-7 space-y-5">
                  {/* 1. Drag & Drop / File Upload Card */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                      <Upload size={14} className="text-red-500" />
                      <span>OPTION 1: UPLOAD PICTURE FROM YOUR DEVICE</span>
                    </div>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                        isDragOver
                          ? 'border-red-500 bg-red-950/20'
                          : 'border-white/15 bg-zinc-900/40 hover:border-red-500/50 hover:bg-zinc-900/80'
                      }`}
                    >
                      <input
                        type="file"
                        id="hero-file-input"
                        accept="image/png, image/jpeg, image/webp, image/jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />

                      <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
                          {isUploading ? (
                            <RefreshCw size={20} className="animate-spin text-red-400" />
                          ) : (
                            <Upload size={20} />
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-white uppercase">
                            {isUploading ? 'OPTIMIZING & APPLYING PICTURE...' : 'CLICK TO BROWSE OR DRAG & DROP GARAGE IMAGE'}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-400 mt-1">
                            Supports JPG, PNG, WEBP (Auto-optimized for 1080p high performance)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Direct Web URL Input Card */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                      <LinkIcon size={14} className="text-red-500" />
                      <span>OPTION 2: ENTER DIRECT IMAGE WEB URL</span>
                    </div>

                    <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/... or direct image link"
                        className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
                      />
                      <button
                        type="submit"
                        disabled={!customUrlInput.trim()}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white font-mono font-bold text-xs rounded-xl transition-all shrink-0"
                      >
                        APPLY URL
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Curated Workshop Presets Section */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div>
                  <div className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                    <Sliders size={14} className="text-red-500" />
                    <span>OPTION 3: CURATED AUTOMOTIVE GARAGE &amp; WORKSHOP PRESETS</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    Click any preset to instantly switch the primary hero background scene.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {HERO_BG_PRESETS.map((preset) => {
                    const isSelected = heroBackground === preset.url;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          onUpdateHeroBackground(preset.url);
                          sounds.playSuccess();
                          setUploadFeedback(`Applied preset: ${preset.name}`);
                        }}
                        className={`group relative rounded-xl overflow-hidden border p-3 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-red-950/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                            : 'bg-zinc-900/40 border-white/10 hover:border-red-500/40 hover:bg-zinc-900/80'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black">
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[9px] font-bold flex items-center gap-1 shadow-md">
                                <Check size={10} />
                                ACTIVE
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white uppercase group-hover:text-red-400 transition-colors">
                                {preset.name}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-red-500/90 mt-0.5">
                              {preset.category}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                              {preset.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`mt-3 w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-red-600 text-white'
                              : 'bg-zinc-800 group-hover:bg-red-600/80 text-zinc-300 group-hover:text-white'
                          }`}
                        >
                          {isSelected ? 'CURRENTLY ACTIVE ✓' : 'SELECT THIS PRESET'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Receipt Modal Inspector Overlay */}
        <AnimatePresence>
          {selectedBookingForReceipt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 z-20 flex items-center justify-center p-6"
            >
              <div className="bg-[#111116] border border-white/20 rounded-2xl p-6 max-w-md w-full space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="font-bold text-white text-sm">DEPOSIT PAYMENT VERIFICATION</div>
                  <button
                    onClick={() => setSelectedBookingForReceipt(null)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-2 text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">BOOKING REF:</span>
                    <span className="text-white font-bold">{selectedBookingForReceipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">CUSTOMER:</span>
                    <span className="text-white">{selectedBookingForReceipt.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">TRANSACTION REF:</span>
                    <span className="text-red-400 font-bold">{selectedBookingForReceipt.paymentRefNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">PAYMENT CHANNEL:</span>
                    <span className="text-white">{selectedBookingForReceipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">DEPOSIT AMOUNT:</span>
                    <span className="text-emerald-400 font-bold">200 ETB</span>
                  </div>
                </div>

                {selectedBookingForReceipt.paymentProofUrl && (
                  <div className="p-3 bg-black rounded-lg text-center text-zinc-400 text-[11px]">
                    Attached Proof: {selectedBookingForReceipt.paymentProofUrl}
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      onUpdateBookingStatus(selectedBookingForReceipt.id, 'confirmed');
                      setSelectedBookingForReceipt(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    VERIFY &amp; CONFIRM DEPOSIT
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
