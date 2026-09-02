import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ServicePackage, ServiceItem } from '../types';
import { sounds } from '../utils/audio';
import {
  X, User, Car, Wrench, Calendar as CalendarIcon, Clock,
  CreditCard, Upload, CheckCircle2, ArrowRight, ArrowLeft,
  ShieldCheck, Copy, Check, AlertCircle, Loader2,
  ChevronLeft, ChevronRight, Sun, Sunset
} from 'lucide-react';

// ─── Advanced Calendar ────────────────────────────────────────────────────────
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

interface AdvancedCalendarProps {
  selected: string;
  onSelect: (d: string) => void;
  maxDays?: number;
  blockedDates?: string[];
  compact?: boolean;
}

const AdvancedCalendar: React.FC<AdvancedCalendarProps> = ({
  selected, onSelect, maxDays = 30, blockedDates = [], compact = false
}) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxDays);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); }
    else setViewMonth(m => m-1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); }
    else setViewMonth(m => m+1);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today || d > maxDate) return true;
    const str = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return blockedDates.includes(str);
  };

  const isSelected = (day: number) => {
    const str = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return str === selected;
  };

  const isToday = (day: number) =>
    viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();

  const handleClick = (day: number) => {
    if (isDisabled(day)) return;
    const str = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    sounds.playClick();
    onSelect(str);
  };

  // Can we go to prev/next month?
  const canGoPrev = new Date(viewYear, viewMonth, 1) > today;
  const canGoNext = new Date(viewYear, viewMonth + 1, 1) <= maxDate;

  return (
    <div className={`bg-zinc-900/60 border border-white/10 rounded-2xl select-none ${compact ? 'p-2.5' : 'p-4'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-4'}`}>
        <button onClick={prevMonth} disabled={!canGoPrev}
          className={`rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}>
          <ChevronLeft size={compact ? 12 : 16} />
        </button>
        <span className={`font-display font-black text-white uppercase tracking-wider ${compact ? 'text-xs' : 'text-sm'}`}>
          {compact ? `${MONTHS[viewMonth].slice(0,3)} ${viewYear}` : `${MONTHS[viewMonth]} ${viewYear}`}
        </span>
        <button onClick={nextMonth} disabled={!canGoNext}
          className={`rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}>
          <ChevronRight size={compact ? 12 : 16} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className={`text-center font-mono text-zinc-600 py-0.5 uppercase ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
            {compact ? d.slice(0,1) : d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <motion.div
        key={`${viewYear}-${viewMonth}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="grid grid-cols-7 gap-0.5"
      >
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const disabled = isDisabled(day);
          const sel = isSelected(day);
          const tod = isToday(day);
          return (
            <motion.button
              key={day}
              onClick={() => handleClick(day)}
              disabled={disabled}
              whileTap={!disabled ? { scale: 0.88 } : undefined}
              className={`
                relative aspect-square rounded-lg font-mono font-bold flex items-center justify-center transition-all
                ${compact ? 'text-[10px]' : 'text-xs rounded-xl'}
                ${sel
                  ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(220,38,38,0.5)]'
                  : tod && !disabled
                  ? 'bg-red-600/20 border border-red-500/50 text-red-300'
                  : disabled
                  ? 'text-zinc-700 cursor-not-allowed'
                  : 'text-zinc-200 hover:bg-zinc-700/60 hover:text-white cursor-pointer'
                }
              `}
            >
              {day}
              {tod && !sel && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Legend — hidden in compact mode */}
      {!compact && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-4 text-[10px] font-mono text-zinc-600">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600" /> Selected</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600/20 border border-red-500/50" /> Today</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-800" /> Unavailable</span>
        </div>
      )}
    </div>
  );
};

// ─── Grouped time slots — range cards ────────────────────────────────────────
interface SlotRange {
  start: string   // HH:mm (24h) — used as booking time value
  end:   string   // HH:mm (24h)
  label: string   // "8:30 AM – 10:30 AM" — displayed to customer
}

interface TimeGroup {
  id:              string
  label:           string
  icon:            string | null
  color:           string | null
  bgColor:         string | null
  ranges:          SlotRange[]
  bookingLimit:    number
  currentBookings?: number
  isFull?:         boolean
}

interface GroupedTimeSlotsProps {
  // available slots returned by /api/availability
  slots: Array<{ label: string; start: string; end: string; groupLabel: string }>
  selected: string   // stores the range start time (HH:mm)
  onSelect:  (start: string, label: string) => void
  classifications?: TimeGroup[]
}

const DEFAULT_GROUPS: TimeGroup[] = [
  {
    id: 'morning', label: 'Morning', icon: 'Sun',
    color: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    ranges: [
      { start: '08:30', end: '10:30', label: '8:30 AM – 10:30 AM' },
      { start: '10:35', end: '12:00', label: '10:35 AM – 12:00 PM' },
    ],
    bookingLimit: 5,
  },
  {
    id: 'afternoon', label: 'Afternoon', icon: 'Sunset',
    color: 'text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/20',
    ranges: [
      { start: '14:00', end: '15:30', label: '2:00 PM – 3:30 PM' },
      { start: '15:35', end: '17:00', label: '3:35 PM – 5:00 PM' },
    ],
    bookingLimit: 5,
  },
]

const GroupedTimeSlots: React.FC<GroupedTimeSlotsProps> = ({ slots, selected, onSelect, classifications }) => {
  const groups: TimeGroup[] = (classifications && classifications.length > 0)
    ? classifications
    : DEFAULT_GROUPS

  // Build a Set of available slot start times for quick lookup
  const availableStarts = new Set(slots.map(s => s.start))

  return (
    <div className="space-y-3">
      {groups.map((group, groupIdx) => {
        const Icon = group.icon === 'Sun' ? Sun : Sunset
        const color   = group.color   || 'text-zinc-400'
        const bg      = group.bgColor || 'bg-zinc-500/10 border-zinc-500/20'
        const isFull  = group.isFull ?? false
        const spotsLeft = (group.currentBookings != null)
          ? group.bookingLimit - group.currentBookings
          : null

        // Filter group's ranges to those that are available
        const availableRanges = group.ranges.filter(r => availableStarts.has(r.start))
        const groupSelected = group.ranges.some(r => r.start === selected)

        // unique stable key
        const groupKey = group.id || group.label || String(groupIdx)

        return (
          <div key={groupKey}
            className={`rounded-2xl border overflow-hidden transition-all ${
              isFull ? 'opacity-50 border-zinc-700/40' :
              groupSelected ? 'border-red-500/40' :
              'border-white/8'
            }`}
          >
            {/* Group header */}
            <div className={`flex items-center justify-between px-4 py-3 ${isFull ? 'bg-zinc-900/30' : 'bg-zinc-900/60'}`}>
              <div className="flex items-center gap-2.5">
                <Icon size={15} className={isFull ? 'text-zinc-600' : color} />
                <span className={`text-sm font-bold ${isFull ? 'text-zinc-600' : color}`}>{group.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {isFull ? (
                  <span className="text-[10px] font-mono font-bold text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded-full">FULL</span>
                ) : spotsLeft != null ? (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    spotsLeft <= 2 ? 'text-orange-400 bg-orange-500/10' : 'text-zinc-500 bg-zinc-800/50'
                  }`}>
                    {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                  </span>
                ) : null}
              </div>
            </div>

            {/* Range slot cards */}
            <div className={`px-3 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 ${bg}`}>
              {group.ranges.map(range => {
                const isAvailable = availableStarts.has(range.start)
                const isSelected  = selected === range.start

                return (
                  <motion.button
                    key={range.start}
                    type="button"
                    disabled={!isAvailable || isFull}
                    onClick={() => { sounds.playClick(); onSelect(range.start, range.label); }}
                    whileTap={isAvailable && !isFull ? { scale: 0.97 } : undefined}
                    className={`relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-mono font-bold transition-all border ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-500 shadow-[0_0_16px_rgba(220,38,38,0.4)]'
                        : isAvailable && !isFull
                        ? 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-white/10 hover:border-white/20'
                        : 'bg-zinc-900/30 text-zinc-600 border-white/5 cursor-not-allowed'
                    }`}
                  >
                    <span>{range.label}</span>
                    {isSelected && (
                      <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded-full ml-2">✓</span>
                    )}
                    {!isAvailable && !isFull && (
                      <span className="text-[10px] font-mono text-zinc-600 ml-2">Unavailable</span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: ServicePackage[];
  services: ServiceItem[];
  preselectedServiceId?: string;
  onBookingCreated: () => void;
  contactContent?: Record<string, string>;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  packages,
  services,
  preselectedServiceId,
  onBookingCreated,
  contactContent = {},
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Array<{label:string;start:string;end:string;groupLabel:string}>>([]);
  const [preferredTime, setPreferredTime] = useState<string>('');    // HH:mm (24h)
  const [preferredTimeLabel, setPreferredTimeLabel] = useState<string>(''); // "8:30 AM – 10:30 AM"
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [notes, setNotes] = useState('');

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentRefNumber, setPaymentRefNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [maxBookingDays, setMaxBookingDays] = useState(30); // from admin settings
  const [timeClassifications, setTimeClassifications] = useState<any[]>([]);

  // Deposit settings from admin
  const [depositType, setDepositType] = useState<'fixed' | 'percentage'>('fixed');
  const [depositValue, setDepositValue] = useState<number>(200); // ETB if fixed, % if percentage

  // Branch selection
  const [branches, setBranches] = useState<Array<{id:string;name:string;address:string;phone:string|null;mapUrl:string|null}>>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  // Fetch max booking days and time classifications from settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        const days = parseInt(d.settings?.max_booking_days || '30');
        if (!isNaN(days) && days > 0) setMaxBookingDays(days);
        const dtype = d.settings?.deposit_type || 'fixed';
        setDepositType(dtype === 'percentage' ? 'percentage' : 'fixed');
        const dval = parseFloat(d.settings?.deposit_amount || '200');
        if (!isNaN(dval) && dval > 0) setDepositValue(dval);
      })
      .catch(() => {});

    // Fetch time classifications
    fetch('/api/time-classifications')
      .then(r => r.json())
      .then(d => {
        if (d.classifications) {
          setTimeClassifications(d.classifications);
        }
      })
      .catch(() => {});

    // Fetch active branches
    fetch('/api/branches')
      .then(r => r.json())
      .then(d => {
        const list = d.branches || [];
        setBranches(list);
        // Auto-select if only one branch
        if (list.length === 1) setSelectedBranchId(list[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    } else if (packages.length > 0 && !selectedServiceId) {
      setSelectedServiceId(packages[0].id);
    }
  }, [preselectedServiceId, packages]);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setPreferredDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Fetch bank accounts on mount
  useEffect(() => {
    fetchBankAccounts();
  }, []);

  // Fetch available time slots when date or branch changes
  useEffect(() => {
    if (preferredDate) {
      fetchAvailableTimeSlots(preferredDate);
    }
  }, [preferredDate, selectedBranchId]);

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch('/api/banks');
      const data = await response.json();
      setBankAccounts(data.banks || []);
      if (data.banks && data.banks.length > 0) {
        setPaymentMethod(data.banks[0].bankName);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    }
  };

  const fetchAvailableTimeSlots = async (date: string) => {
    setIsLoadingTimeSlots(true);
    try {
      // Include branchId in queries so counts are per-branch
      const branchParam = selectedBranchId ? `&branchId=${selectedBranchId}` : '';
      const [availRes, tcRes] = await Promise.all([
        fetch(`/api/availability?date=${date}${branchParam}`),
        fetch(`/api/time-classifications?date=${date}${branchParam}`)
      ]);
      const data = await availRes.json();
      const tcData = await tcRes.json();

      if (data.available) {
        setAvailableTimeSlots(data.timeSlots || []);
        // Auto-select first available slot
        if (data.timeSlots && data.timeSlots.length > 0) {
          setPreferredTime(data.timeSlots[0].start);
          setPreferredTimeLabel(data.timeSlots[0].label);
        }
      } else {
        setAvailableTimeSlots([]);
        setPreferredTime('');
        setPreferredTimeLabel('');
      }

      if (tcData.classifications) {
        setTimeClassifications(tcData.classifications);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableTimeSlots([]);
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  if (!isOpen) return null;

  // Compute the actual deposit for the selected package
  const calcDeposit = (pkg: typeof packages[0] | undefined): number => {
    if (!pkg) return depositType === 'fixed' ? depositValue : 200;
    if (depositType === 'percentage') {
      return Math.round(pkg.priceEtb * depositValue / 100);
    }
    return depositValue; // fixed
  };

  const selectedPkgObj = packages.find(p => p.id === selectedServiceId);
  const computedDeposit = calcDeposit(selectedPkgObj);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    setCopiedBank(label);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleNextStep = () => {
    sounds.playClick();
    setSubmitError(null);
    
    if (currentStep === 1) {
      if (!customerName || customerName.trim().length < 2) {
        setSubmitError('Please enter your full name (at least 2 characters).');
        return;
      }
      if (!phone || phone.trim().length < 10) {
        setSubmitError('Please enter a valid phone number (at least 10 digits).');
        return;
      }
      if (email && email.trim() && (!email.includes('@') || !email.includes('.'))) {
        setSubmitError('Please enter a valid email address or leave it blank.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!selectedServiceId) {
        setSubmitError('Please select a service or package.');
        return;
      }
    }
    // Step 3: Branch selection
    if (currentStep === 3) {
      if (branches.length > 1 && !selectedBranchId) {
        setSubmitError('Please select a branch location.');
        return;
      }
      // If only 1 branch, auto-select and skip visual step (already handled on load)
    }
    // Step 4: Date & time
    if (currentStep === 4) {
      if (!preferredDate) {
        setSubmitError('Please select your preferred date.');
        return;
      }
      if (!preferredTime) {
        setSubmitError('Please select an available time slot.');
        return;
      }
    }
    if (currentStep === 5) {
      if (!paymentScreenshot) {
        setSubmitError('Please upload a payment screenshot.');
        return;
      }
      submitBooking();
      return;
    }
    setCurrentStep((prev) => Math.min(6, prev + 1));
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const selectedPkg = packages.find(p => p.id === selectedServiceId);
      const depositAmount = calcDeposit(selectedPkg);

      const formData = new FormData();
      formData.append('customerName', customerName);
      formData.append('customerPhone', phone);
      formData.append('customerEmail', email || '');
      formData.append('vehicleMake', vehicleMake);
      formData.append('vehicleModel', vehicleModel);
      formData.append('vehicleYear', vehicleYear);
      formData.append('plateNumber', plateNumber);
      formData.append('packageId', selectedServiceId);
      formData.append('date', preferredDate);
      formData.append('time', preferredTime); // already HH:mm 24h format
      formData.append('notes', notes);
      formData.append('depositAmount', depositAmount.toString());
      formData.append('depositMethod', paymentMethod);
      formData.append('transactionRef', paymentRefNumber || 'N/A');
      if (selectedBranchId) {
        formData.append('branchId', selectedBranchId);
      }
      if (paymentScreenshot) {
        formData.append('paymentScreenshot', paymentScreenshot);
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        sounds.playSuccess();
        onBookingCreated();

        // Trigger confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#dc2626', '#ffffff', '#000000'],
          });
        } catch {
          // ignore
        }

        // Move to confirmation step
        setCurrentStep(6);
      } else {
        setSubmitError(data.error || 'Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevStep = () => {
    sounds.playClick();
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const steps = [
    { num: 1, title: 'CUSTOMER' },
    { num: 2, title: 'SERVICE' },
    { num: 3, title: 'BRANCH' },
    { num: 4, title: 'DATE & TIME' },
    { num: 5, title: 'DEPOSIT' },
    { num: 6, title: 'CONFIRM' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl rounded-3xl bg-[#0e0e13] border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden my-8"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-zinc-950/90">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-300 font-bold">
              DANI &amp; MIKI · APPOINTMENT PROTOCOL
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 pt-5 pb-3 border-b border-white/5 bg-zinc-950/40">
          <div className="flex items-center justify-between relative">
            {/* Connecting Bar */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-zinc-800 -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-[2px] bg-red-600 -translate-y-1/2 -z-0 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((s) => {
              const isCompleted = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all ${
                      isCompleted
                        ? 'bg-red-600 text-white shadow-[0_0_12px_#ef4444]'
                        : isCurrent
                        ? 'bg-white text-black ring-4 ring-red-600/30 font-black'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-700'
                    }`}
                  >
                    {isCompleted ? <Check size={13} /> : s.num < 10 ? `0${s.num}` : `${s.num}`}
                  </div>
                  <span
                    className={`text-[9px] font-mono tracking-wider uppercase hidden sm:block ${
                      isCurrent ? 'text-red-400 font-bold' : 'text-zinc-500'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: CUSTOMER DETAILS */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <div className="text-xs font-mono uppercase text-red-500 font-bold tracking-widest">
                    STEP 01
                  </div>
                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    TELL US ABOUT YOU &amp; YOUR VEHICLE
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Yonas Tadesse"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+251 911 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                      Email Address <span className="text-zinc-600 normal-case">(optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                      Vehicle Make &amp; Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mercedes C300 or Toyota Prado"
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                      Manufacturing Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2021"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                      VIN Number <span className="text-zinc-600 normal-case">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. WBA3A5C51DF123456"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-sans"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: WHAT DOES YOUR VEHICLE NEED? */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <div className="text-xs font-mono uppercase text-red-500 font-bold tracking-widest">
                    STEP 02
                  </div>
                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    WHAT DOES YOUR VEHICLE REQUIRE?
                  </h3>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {packages.map((pkg) => {
                    const isSelected = selectedServiceId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedServiceId(pkg.id);
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                            : 'bg-zinc-900/60 hover:bg-zinc-900 border-white/5 text-zinc-300'
                        }`}
                      >
                        <div>
                          <div className="font-display font-bold text-sm text-white">
                            {pkg.name}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                          {pkg.duration} · Deposit: {depositType === 'percentage' ? `${depositValue}% (${Math.round(pkg.priceEtb * depositValue / 100)} ETB)` : `${pkg.depositEtb || depositValue} ETB`}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-sm text-white">
                            {pkg.priceEtb.toLocaleString()} ETB
                          </div>
                          <span className={`text-[10px] font-mono uppercase ${isSelected ? 'text-red-400 font-bold' : 'text-zinc-500'}`}>
                            {isSelected ? 'SELECTED ✓' : 'CHOOSE'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                    Describe any specific symptoms / trouble codes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Engine runs rough when cold, warning message on dashboard..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3: BRANCH SELECTION */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <div className="text-xs font-mono uppercase text-red-500 font-bold tracking-widest">STEP 03</div>
                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    SELECT A BRANCH LOCATION
                  </h3>
                </div>

                {branches.length === 0 ? (
                  <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 text-center text-zinc-500 text-sm font-mono">
                    No branch locations configured yet.
                  </div>
                ) : branches.length === 1 ? (
                  /* Single branch — show it as confirmed, no choice needed */
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{branches[0].name}</p>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">{branches[0].address}</p>
                      {branches[0].phone && <p className="text-xs font-mono text-zinc-500">{branches[0].phone}</p>}
                    </div>
                    {branches[0].mapUrl && (
                      <a
                        href={branches[0].mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-[10px] font-mono text-red-400 hover:text-red-300 transition-colors"
                      >
                        Map →
                      </a>
                    )}
                  </div>
                ) : (
                  /* Multiple branches — pick one */
                  <div className="space-y-3">
                    {branches.map(branch => {
                      const isSelected = selectedBranchId === branch.id;
                      return (
                        <motion.button
                          key={branch.id}
                          type="button"
                          onClick={() => { sounds.playClick(); setSelectedBranchId(branch.id); }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                              : 'bg-zinc-900/60 border-white/8 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                                {branch.name}
                              </p>
                              <p className="text-xs font-mono text-zinc-400 mt-0.5">{branch.address}</p>
                              {branch.phone && <p className="text-xs font-mono text-zinc-500 mt-0.5">{branch.phone}</p>}
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                              isSelected ? 'border-red-500 bg-red-600' : 'border-zinc-600 bg-transparent'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                          {branch.mapUrl && isSelected && (
                            <a
                              href={branch.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1 mt-2 text-[10px] font-mono text-red-400 hover:text-red-300 transition-colors"
                            >
                              View on map →
                            </a>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: DATE & TIME */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <div className="text-xs font-mono uppercase text-red-500 font-bold tracking-widest">STEP 04</div>
                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">WHEN SHOULD WE EXPECT YOU?</h3>
                </div>

                {/* Compact Calendar + Time Slots side by side on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ── Compact Calendar ── */}
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-2 flex items-center gap-1.5">
                      <CalendarIcon size={11} className="text-red-400" />
                      <span>Date</span>
                    </label>
                    <AdvancedCalendar
                      selected={preferredDate}
                      onSelect={(d) => setPreferredDate(d)}
                      maxDays={maxBookingDays}
                      compact
                    />
                  </div>

                  {/* ── Time Slots ── */}
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-2 flex items-center gap-1.5">
                      <Clock size={11} className="text-red-400" />
                      <span>Time Slot</span>
                    </label>
                    {!preferredDate ? (
                      <div className="h-full flex items-center justify-center py-8 text-zinc-600 text-xs font-mono text-center">
                        Select a date first
                      </div>
                    ) : isLoadingTimeSlots ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                        <span className="ml-2 text-xs text-zinc-400 font-mono">Checking…</span>
                      </div>
                    ) : availableTimeSlots.length === 0 ? (
                      <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-xs font-mono text-center">
                        No slots for this date.
                      </div>
                    ) : (
                      <GroupedTimeSlots
                        slots={availableTimeSlots}
                        selected={preferredTime}
                        onSelect={(start, label) => { setPreferredTime(start); setPreferredTimeLabel(label); }}
                        classifications={timeClassifications}
                      />
                    )}
                  </div>
                </div>

                {/* Location badge */}
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                  <span>
                    {branches.length === 1 && branches[0]
                      ? `${branches[0].name} · ${branches[0].address}`
                      : selectedBranchId
                      ? (() => { const b = branches.find(br => br.id === selectedBranchId); return b ? `${b.name} · ${b.address}` : ''; })()
                      : contactContent.address_title
                        ? `${contactContent.address_title}${contactContent.address_body ? ' · ' + contactContent.address_body.split('·')[0].trim() : ''}`
                        : 'Workshop location'
                    }
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 5: SECURE YOUR APPOINTMENT (DEPOSIT 200 ETB) */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <div className="text-xs font-mono uppercase text-red-500 font-bold tracking-widest">
                    STEP 05
                  </div>
                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    SECURE APPOINTMENT DEPOSIT
                  </h3>
                </div>

                {/* Deposit Highlight Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/70 to-zinc-900 border border-red-500/40 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-red-300 uppercase">
                      {depositType === 'percentage' ? `${depositValue}% Service Deposit` : 'Fixed Reservation Deposit'}
                    </div>
                    <div className="font-display font-black text-2xl text-white">
                      {computedDeposit} <span className="text-xs font-mono text-red-400">ETB</span>
                    </div>
                    {depositType === 'percentage' && selectedPkgObj && (
                      <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                        {depositValue}% of {selectedPkgObj.priceEtb.toLocaleString()} ETB
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-mono text-zinc-300 text-right max-w-xs">
                    Deducted from your total invoice at the workshop.
                  </div>
                </div>

                {/* Payment Channel Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {bankAccounts.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setPaymentMethod(bank.bankName);
                      }}
                      className={`py-2.5 px-3 rounded-xl font-mono text-xs uppercase font-bold transition-all ${
                        paymentMethod === bank.bankName
                          ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-white/5'
                      }`}
                    >
                      {bank.bankName}
                    </button>
                  ))}
                </div>

                {/* Bank Account Details Card */}
                {bankAccounts.find(b => b.bankName === paymentMethod) && (
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2.5 font-mono text-xs">
                    {(() => {
                      const selectedBank = bankAccounts.find(b => b.bankName === paymentMethod);
                      if (!selectedBank) return null;
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">BANK</span>
                            <span className="text-white font-bold">{selectedBank.bankName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">ACCOUNT NAME</span>
                            <span className="text-white">{selectedBank.accountName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">ACCOUNT NUMBER</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-mono">{selectedBank.accountNumber}</span>
                              <button
                                onClick={() => handleCopy(selectedBank.accountNumber, selectedBank.bankName)}
                                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Screenshot upload only */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                      Upload Payment Screenshot / Slip *
                    </label>
                    <div className="relative border-2 border-dashed border-zinc-800 hover:border-red-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setPaymentScreenshot(e.target.files[0]);
                            sounds.playClick();
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center gap-1 text-zinc-400">
                        <Upload size={18} className="text-red-500" />
                        <span className="text-xs font-mono">
                          {paymentScreenshot ? `Attached: ${paymentScreenshot.name}` : 'Drag & drop or click to attach payment receipt'}
                        </span>
                        <span className="text-[10px] text-zinc-500">JPG, PNG, WebP (Max 5MB)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: BOOKING SUBMITTED & CONFIRMATION */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-6 space-y-6"
              >
                {/* Animated Red/White Checkmark */}
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.6)]"
                  >
                    <CheckCircle2 size={44} className="text-white" />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
                    PROTOCOL INITIATED
                  </div>
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                    BOOKING RECEIVED
                  </h3>
                  <p className="text-zinc-300 text-sm max-w-md mx-auto leading-relaxed">
                    Your appointment is currently <span className="text-red-400 font-bold">waiting for payment verification</span> by our administration team.
                  </p>
                </div>

                {/* Booking Status Card */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 max-w-md mx-auto text-left font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase">STATUS:</span>
                    <span className="text-yellow-400 font-bold text-sm tracking-wider">PENDING VERIFICATION</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase">SCHEDULED SLOT:</span>
                    <span className="text-zinc-200">{preferredDate} · {preferredTimeLabel || preferredTime}</span>
                  </div>
                  {selectedBranchId && branches.find(b => b.id === selectedBranchId) && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 uppercase">BRANCH:</span>
                      <span className="text-zinc-200 text-right max-w-[60%]">
                        {branches.find(b => b.id === selectedBranchId)?.name}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase">DEPOSIT SUBMITTED:</span>
                    <span className="text-emerald-400 font-bold">{computedDeposit} ETB via {paymentMethod}</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-zinc-400 max-w-sm mx-auto space-y-1">
                  <p>YOUR BOOKING CODE WILL BE SENT TO</p>
                  <p className="text-white font-bold">{email}</p>
                  <p>AFTER ADMIN APPROVAL.</p>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onClose();
                  }}
                  className="px-8 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                >
                  RETURN TO WORKSPACE
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Controls */}
        {currentStep < 6 && (
          <div className="px-6 py-4 border-t border-white/10 bg-zinc-950/80 flex flex-col gap-3">
            {/* Error Message */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2 text-xs"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-red-400">{submitError}</span>
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <ArrowLeft size={14} />
                  <span>BACK</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                id="booking-next-step-btn"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-xs tracking-wider uppercase text-white bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.45)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === 5 ? 'SUBMIT & SECURE DEPOSIT' : 'CONTINUE'}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
