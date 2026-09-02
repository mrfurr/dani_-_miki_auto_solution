"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Save, Lock, Eye, EyeOff, Palette, ShieldCheck, ChevronRight,
  CheckCircle, AlertCircle, LogOut, Info, Calendar,
  Upload, Link2, X, ImageIcon, Loader2, CheckCircle2, RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/admin/AdminUI'
import { BrandLogo } from '@/components/BrandLogo'

type Section = 'booking' | 'branding' | 'security'

const SECTIONS: { id: Section; label: string; desc: string; icon: any; accent: string }[] = [
  { id: 'booking',  label: 'Booking',  desc: 'Deposit, scheduling & availability', icon: Calendar,    accent: 'red'     },
  { id: 'branding', label: 'Branding', desc: 'Logo, name and identity',             icon: Palette,     accent: 'blue'    },
  { id: 'security', label: 'Security', desc: 'Password and account access',         icon: ShieldCheck, accent: 'emerald' },
]

const ACCENTS: Record<string, string> = {
  red:     'bg-red-500/15 border-red-500/25 text-red-400',
  blue:    'bg-blue-500/15 border-blue-500/25 text-blue-400',
  emerald: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400',
}

// ─── Reusable UI ──────────────────────────────────────────────────────────────
function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#0d0d14] border border-white/[0.06] rounded-2xl overflow-hidden">{children}</div>
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-6 items-start py-4 border-b border-white/[0.04] last:border-0">
      <div className="sm:col-span-2">
        <p className="text-sm font-semibold text-zinc-200">{label}</p>
        {hint && <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <div className="sm:col-span-3">{children}</div>
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', disabled = false }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      className="w-full bg-[#0a0a10] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed" />
  )
}

function SelectInput({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-[#0a0a10] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all appearance-none cursor-pointer">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function InfoBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 mt-2 p-3 bg-blue-500/8 border border-blue-500/15 rounded-xl">
      <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-blue-300/80 leading-relaxed">{text}</p>
    </div>
  )
}

function Notify({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  if (!msg) return null
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' : 'bg-red-500/10 border-red-500/25 text-red-300'}`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      {msg}
    </motion.div>
  )
}

// ─── Logo uploader ────────────────────────────────────────────────────────────
function LogoUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState(value)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setUrlInput(value) }, [value])

  const upload = useCallback(async (file: File) => {
    const allowed = ['image/jpeg','image/jpg','image/png','image/webp','image/svg+xml']
    if (!allowed.includes(file.type)) { alert('JPG, PNG, WebP or SVG only'); return }
    if (file.size > 5 * 1024 * 1024) { alert('Max 5 MB'); return }
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('bucket', 'branding')
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await r.json()
      if (d.url) { onChange(d.url); setUrlInput(d.url) }
      else alert(d.error ?? 'Upload failed')
    } catch { alert('Upload failed') }
    finally { setUploading(false) }
  }, [onChange])

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-1 p-0.5 bg-white/5 border border-white/8 rounded-lg w-fit">
        {(['upload','url'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${mode===m ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
            {m === 'upload' ? <Upload className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
            {m === 'upload' ? 'Upload File' : 'Paste URL'}
          </button>
        ))}
      </div>

      {/* Upload zone */}
      {mode === 'upload' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) upload(f) }}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed transition-all cursor-pointer ${dragging ? 'border-blue-500 bg-blue-500/10 scale-[1.01]' : uploading ? 'border-white/10 bg-white/[0.02] cursor-not-allowed' : 'border-white/10 bg-[#0a0a10] hover:border-blue-500/50 hover:bg-blue-500/5'}`}
        >
          <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }} disabled={uploading} />
          {uploading
            ? <><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /><p className="text-xs text-zinc-400">Uploading…</p></>
            : dragging
            ? <><Upload className="w-6 h-6 text-blue-400" /><p className="text-xs text-blue-300 font-semibold">Drop logo here</p></>
            : <><ImageIcon className="w-6 h-6 text-zinc-600" /><p className="text-xs text-zinc-400"><span className="text-blue-400">Click to upload</span> or drag &amp; drop</p><p className="text-[10px] text-zinc-600">JPG · PNG · WebP · SVG · Max 5 MB</p></>}
        </div>
      )}

      {/* URL input */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
            <input value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onChange(urlInput.trim())} placeholder="https://…"
              className="w-full bg-[#0a0a10] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all" />
          </div>
          <button onClick={() => onChange(urlInput.trim())}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/8 hover:bg-white/12 border border-white/8 text-zinc-300 text-xs font-semibold rounded-xl transition-all">
            <CheckCircle2 className="w-3.5 h-3.5" /> Apply
          </button>
        </div>
      )}

      {/* Current logo preview */}
      {value && (
        <div className="flex items-center gap-4 p-4 bg-[#0a0a10] border border-white/8 rounded-xl">
          <div className="w-24 h-14 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={value} alt="Logo preview" className="max-w-full max-h-full object-contain p-1" onError={e => (e.currentTarget.style.opacity = '0.2')} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-300">Current logo</p>
            <p className="text-[10px] text-zinc-600 font-mono truncate mt-0.5">{value}</p>
          </div>
          <button onClick={() => { onChange(''); setUrlInput('') }}
            className="p-2 rounded-lg hover:bg-red-500/20 text-red-500/50 hover:text-red-400 transition-colors flex-shrink-0" title="Remove logo">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<Section>('booking')
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Booking
  const [depositType,    setDepositType]    = useState('fixed')
  const [depositAmount,  setDepositAmount]  = useState('200')
  const [maxBookingDays, setMaxBookingDays] = useState('30')
  const [savingBooking,  setSavingBooking]  = useState(false)

  // Branding
  const [garageName,    setGarageName]    = useState('Dani & Miki Auto Solution')
  const [garageTagline, setGarageTagline] = useState('Precision Automotive Diagnostics & Performance')
  const [logoUrl,       setLogoUrl]       = useState('')
  const [savingBranding, setSavingBranding] = useState(false)

  // Security
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd,     setNewPwd]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd,    setShowPwd]    = useState(false)
  const [savingPwd,  setSavingPwd]  = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // System reset
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetConfirmText, setResetConfirmText] = useState('')
  const [resetting, setResetting] = useState(false)
  const RESET_PHRASE = 'Reset System'

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings) {
          setDepositType(d.settings.deposit_type ?? 'fixed')
          setDepositAmount(d.settings.deposit_amount ?? '200')
          setMaxBookingDays(d.settings.max_booking_days ?? '30')
          setGarageName(d.settings.garage_name ?? 'Dani & Miki Auto Solution')
          setGarageTagline(d.settings.garage_tagline ?? '')
          setLogoUrl(d.settings.logo_url ?? '')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const notify = (msg: string, type: 'success' | 'error') => {
    type === 'success' ? (setSuccess(msg), setError('')) : (setError(msg), setSuccess(''))
    setTimeout(() => { setSuccess(''); setError('') }, 4000)
  }

  const saveBooking = async () => {
    setSavingBooking(true)
    try {
      const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { deposit_type: depositType, deposit_amount: depositAmount, max_booking_days: maxBookingDays } }) })
      r.ok ? notify('Booking settings saved', 'success') : notify('Save failed', 'error')
    } finally { setSavingBooking(false) }
  }

  const saveBranding = async () => {
    setSavingBranding(true)
    try {
      const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { garage_name: garageName, garage_tagline: garageTagline, logo_url: logoUrl } }) })
      r.ok ? notify('Branding saved — logo updated across site', 'success') : notify('Save failed', 'error')
    } finally { setSavingBranding(false) }
  }

  const changePassword = async () => {
    if (!currentPwd || !newPwd) { notify('Fill in all password fields', 'error'); return }
    if (newPwd !== confirmPwd)  { notify('New passwords do not match', 'error'); return }
    if (newPwd.length < 8)     { notify('Password must be at least 8 characters', 'error'); return }
    setSavingPwd(true)
    try {
      const r = await fetch('/api/admin/settings/password', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }) })
      const d = await r.json()
      if (r.ok) { notify('Password changed successfully', 'success'); setCurrentPwd(''); setNewPwd(''); setConfirmPwd('') }
      else notify(d.error || 'Failed to change password', 'error')
    } finally { setSavingPwd(false) }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    router.push('/admin/login')
  }

  const handleReset = async () => {
    if (resetConfirmText !== RESET_PHRASE) return
    setResetting(true)
    try {
      const r = await fetch('/api/admin/reset', { method: 'POST' })
      const d = await r.json()
      if (r.ok) {
        setShowResetModal(false)
        setResetConfirmText('')
        notify('System reset complete. All content has been cleared.', 'success')
      } else {
        notify(d.error || 'Reset failed', 'error')
      }
    } catch {
      notify('Reset failed', 'error')
    } finally {
      setResetting(false)
    }
  }

  if (loading) return <Spinner />

  const activeSec = SECTIONS.find(s => s.id === activeSection)!

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Manage booking rules, brand identity, and account security</p>
      </div>

      <AnimatePresence>
        {(success || error) && <Notify msg={success || error} type={success ? 'success' : 'error'} />}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── Left nav ── */}
        <nav className="lg:col-span-1 space-y-1">
          {SECTIONS.map(s => {
            const Icon = s.icon
            const isActive = activeSection === s.id
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${isActive ? 'bg-white/[0.06] border border-white/10' : 'hover:bg-white/[0.03] border border-transparent'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${isActive ? ACCENTS[s.accent] : 'bg-white/[0.04] border-white/5 text-zinc-600 group-hover:text-zinc-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{s.label}</p>
                  <p className="text-xs text-zinc-600 truncate">{s.desc}</p>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />}
              </button>
            )
          })}
        </nav>

        {/* ── Right panel ── */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>

              {/* ══ BOOKING ══ */}
              {activeSection === 'booking' && (
                <SectionCard>
                  <div className="px-6 py-5 border-b border-white/[0.04] flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${ACCENTS.red}`}><Calendar className="w-4 h-4" /></div>
                    <div><p className="font-bold text-white text-sm">Booking Settings</p><p className="text-zinc-600 text-xs">Control deposits and scheduling rules</p></div>
                  </div>
                  <div className="px-6 py-2">
                    <Field label="Deposit Type" hint="How the required deposit is calculated at checkout.">
                      <SelectInput value={depositType} onChange={setDepositType}
                        options={[{ value: 'fixed', label: 'Fixed Amount (ETB)' },{ value: 'percentage', label: 'Percentage of Service Price' }]} />
                    </Field>
                    <Field label={depositType === 'percentage' ? 'Deposit Percentage' : 'Deposit Amount'}
                      hint={depositType === 'percentage' ? 'Percentage of the package price the customer pays upfront.' : 'Fixed ETB amount the customer pays upfront to confirm their slot.'}>
                      <div className="relative">
                        <TextInput value={depositAmount} onChange={setDepositAmount} type="number" placeholder={depositType === 'percentage' ? '10' : '200'} />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono pointer-events-none">{depositType === 'percentage' ? '%' : 'ETB'}</span>
                      </div>
                      {depositType === 'fixed' && <InfoBox text="The deposit is deducted from the total invoice when the customer arrives." />}
                    </Field>
                    <Field label="Advance Booking Limit" hint="How many days ahead customers can book an appointment.">
                      <div className="relative">
                        <TextInput value={maxBookingDays} onChange={setMaxBookingDays} type="number" placeholder="30" />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono pointer-events-none">days</span>
                      </div>
                      <InfoBox text="Set to 30 for a rolling one-month window. The booking calendar will block dates beyond this limit." />
                    </Field>
                  </div>
                  <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-end gap-3">
                    <p className="text-xs text-zinc-600 flex-1">Changes apply immediately to the booking form.</p>
                    <button onClick={saveBooking} disabled={savingBooking}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40 shadow-[0_0_20px_rgba(220,38,38,0.25)]">
                      {savingBooking ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : <><Save className="w-3.5 h-3.5" />Save Booking Settings</>}
                    </button>
                  </div>
                </SectionCard>
              )}

              {/* ══ BRANDING ══ */}
              {activeSection === 'branding' && (
                <SectionCard>
                  <div className="px-6 py-5 border-b border-white/[0.04] flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${ACCENTS.blue}`}><Palette className="w-4 h-4" /></div>
                    <div><p className="font-bold text-white text-sm">Branding</p><p className="text-zinc-600 text-xs">Logo, business name and identity shown to customers</p></div>
                  </div>

                  <div className="px-6 py-2">
                    {/* Logo upload */}
                    <Field label="Company Logo" hint="Replaces the default D&M SVG car icon throughout the site — admin sidebar, public footer, and page loader.">
                      <LogoUploader value={logoUrl} onChange={setLogoUrl} />

                      {/* Live preview */}
                      <div className="mt-3 p-4 bg-black/40 border border-white/5 rounded-xl">
                        <p className="text-[10px] text-zinc-600 uppercase font-mono tracking-wider mb-3">Live Preview</p>
                        <div className="flex items-center gap-6 flex-wrap">
                          <div>
                            <p className="text-[9px] text-zinc-700 mb-1 font-mono">LARGE</p>
                            <BrandLogo size="lg" imageUrl={logoUrl || null} showTagline />
                          </div>
                          <div>
                            <p className="text-[9px] text-zinc-700 mb-1 font-mono">SMALL</p>
                            <BrandLogo size="sm" imageUrl={logoUrl || null} showTagline={false} />
                          </div>
                        </div>
                      </div>
                    </Field>

                    <Field label="Garage Name" hint="Displayed in emails, booking confirmations, and the website.">
                      <TextInput value={garageName} onChange={setGarageName} placeholder="Dani & Miki Auto Solution" />
                    </Field>

                    <Field label="Tagline" hint="Short description shown below the garage name.">
                      <TextInput value={garageTagline} onChange={setGarageTagline} placeholder="Precision Automotive Diagnostics & Performance" />
                      <p className="text-xs text-zinc-600 mt-1.5">{garageTagline.length} / 80 characters</p>
                    </Field>

                    <Field label="Primary Color" hint="Brand color used across the website.">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-600 border-2 border-red-500 shadow-[0_0_16px_rgba(220,38,38,0.4)]" />
                        <div>
                          <p className="text-white text-sm font-mono">#DC2626</p>
                          <p className="text-zinc-600 text-xs">Red — automotive brand color</p>
                        </div>
                      </div>
                    </Field>
                  </div>

                  <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-end gap-3">
                    <p className="text-xs text-zinc-600 flex-1">Logo changes appear immediately after saving and refreshing the page.</p>
                    <button onClick={saveBranding} disabled={savingBranding}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40">
                      {savingBranding ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : <><Save className="w-3.5 h-3.5" />Save Branding</>}
                    </button>
                  </div>
                </SectionCard>
              )}

              {/* ══ SECURITY ══ */}
              {activeSection === 'security' && (
                <div className="space-y-4">
                  <SectionCard>
                    <div className="px-6 py-5 border-b border-white/[0.04] flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${ACCENTS.emerald}`}><Lock className="w-4 h-4" /></div>
                      <div><p className="font-bold text-white text-sm">Change Password</p><p className="text-zinc-600 text-xs">Update your admin account password</p></div>
                    </div>
                    <div className="px-6 py-2">
                      <Field label="Current Password" hint="Your existing password to confirm your identity.">
                        <div className="relative">
                          <input type={showPwd ? 'text' : 'password'} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Enter current password"
                            className="w-full bg-[#0a0a10] border border-white/8 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all" />
                          <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors p-1">
                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </Field>
                      <Field label="New Password" hint="Minimum 8 characters. Use a strong, unique password.">
                        <TextInput value={newPwd} onChange={setNewPwd} type="password" placeholder="New password (min 8 chars)" />
                        {newPwd.length > 0 && (
                          <div className="flex gap-1 mt-2 items-center">
                            {[4,6,8,12].map(n => (
                              <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${newPwd.length >= n ? n >= 12 ? 'bg-emerald-500' : n >= 8 ? 'bg-yellow-500' : 'bg-red-500' : 'bg-white/10'}`} />
                            ))}
                            <p className="text-xs text-zinc-500 ml-2 whitespace-nowrap">{newPwd.length < 6 ? 'Weak' : newPwd.length < 8 ? 'Fair' : newPwd.length < 12 ? 'Good' : 'Strong'}</p>
                          </div>
                        )}
                      </Field>
                      <Field label="Confirm Password" hint="Re-enter the new password to confirm.">
                        <TextInput value={confirmPwd} onChange={setConfirmPwd} type="password" placeholder="Repeat new password" />
                        {confirmPwd.length > 0 && (
                          <p className={`text-xs mt-1.5 flex items-center gap-1 ${newPwd === confirmPwd ? 'text-emerald-400' : 'text-red-400'}`}>
                            {newPwd === confirmPwd ? <><CheckCircle className="w-3 h-3" />Passwords match</> : <><AlertCircle className="w-3 h-3" />Passwords do not match</>}
                          </p>
                        )}
                      </Field>
                    </div>
                    <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.04] flex justify-end">
                      <button onClick={changePassword} disabled={savingPwd}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40">
                        {savingPwd ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Changing…</> : <><ShieldCheck className="w-3.5 h-3.5" />Update Password</>}
                      </button>
                    </div>
                  </SectionCard>

                  <SectionCard>
                    <div className="px-6 py-5 border-b border-white/[0.04] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-red-500/15 border-red-500/25 text-red-400"><LogOut className="w-4 h-4" /></div>
                      <div><p className="font-bold text-white text-sm">Session</p><p className="text-zinc-600 text-xs">Manage your active admin session</p></div>
                    </div>
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">Sign Out of Admin</p>
                          <p className="text-xs text-zinc-500 mt-0.5">You will be redirected to the login page. Your session will be cleared.</p>
                        </div>
                        <button onClick={handleLogout} disabled={loggingOut}
                          className="flex items-center gap-2 px-4 py-2.5 bg-red-600/15 hover:bg-red-600/25 border border-red-600/25 text-red-400 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 flex-shrink-0 ml-6">
                          {loggingOut ? <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard>
                    <div className="px-6 py-5 border-b border-white/[0.04] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-red-600/15 border-red-600/25 text-red-400"><RefreshCw className="w-4 h-4" /></div>
                      <div>
                        <p className="font-bold text-white text-sm">System Reset</p>
                        <p className="text-zinc-600 text-xs">Permanently delete all bookings, reviews, messages, mechanics and schedule data</p>
                      </div>
                    </div>
                    <div className="px-6 py-5">
                      <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 mb-4">
                        <p className="text-xs text-red-300 leading-relaxed">
                          <span className="font-bold text-red-400">Warning:</span> This action is irreversible. It will delete all bookings, customer reviews, messages, mechanic profiles, blocked dates, break hours, and in-person bookings. Settings, packages, branches, and website content will be preserved.
                        </p>
                      </div>
                      <button
                        onClick={() => { setShowResetModal(true); setResetConfirmText('') }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-600/15 hover:bg-red-600/30 border border-red-600/30 text-red-400 hover:text-red-300 text-sm font-semibold rounded-xl transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset System
                      </button>
                    </div>
                  </SectionCard>

                  <div className="flex items-start gap-3 px-1">
                    <Info className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-600 leading-relaxed">Admin sessions expire after 7 days. Your password hash is stored securely using bcrypt. Never share your admin credentials.</p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── System Reset Confirmation Modal ── */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !resetting && setShowResetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d0d14] border border-red-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_25px_60px_rgba(220,38,38,0.2)]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Confirm System Reset</p>
                  <p className="text-zinc-500 text-xs">This cannot be undone</p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  This will permanently delete:
                </p>
                <ul className="space-y-1.5 text-xs font-mono text-zinc-400">
                  {['All customer bookings','All reviews','All messages','All mechanic profiles','All schedule data (blocked dates, breaks)'].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
                  <p className="text-xs text-zinc-400 mb-2">
                    Type <span className="font-mono font-bold text-white">{RESET_PHRASE}</span> to confirm:
                  </p>
                  <input
                    type="text"
                    value={resetConfirmText}
                    onChange={e => setResetConfirmText(e.target.value)}
                    placeholder={RESET_PHRASE}
                    autoFocus
                    className="w-full bg-[#0a0a10] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 transition-all font-mono"
                  />
                  {resetConfirmText.length > 0 && resetConfirmText !== RESET_PHRASE && (
                    <p className="text-[10px] text-red-400 font-mono mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Text doesn&apos;t match
                    </p>
                  )}
                  {resetConfirmText === RESET_PHRASE && (
                    <p className="text-[10px] text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Confirmed — ready to reset
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={() => { setShowResetModal(false); setResetConfirmText('') }}
                  disabled={resetting}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition-all disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  disabled={resetConfirmText !== RESET_PHRASE || resetting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                >
                  {resetting
                    ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting…</>
                    : <><RefreshCw className="w-3.5 h-3.5" />Reset System</>
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
