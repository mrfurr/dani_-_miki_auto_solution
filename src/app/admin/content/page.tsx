"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Save, Upload, Link2, X, ImageIcon, Loader2, CheckCircle2,
  Layout, Quote, Eye, BarChart2, Phone, AlignLeft, ChevronDown,
  Wrench, Plus, Trash2, ChevronUp, GripVertical
} from 'lucide-react'
import { PageHeader, Card, Toast, Spinner } from '@/components/admin/AdminUI'

// ─── types ────────────────────────────────────────────────────────────────────
type SectionKey =
  | 'home_hero'
  | 'typographic_interlude'
  | 'precision_showcase'
  | 'why_choose_us'
  | 'contact_section'
  | 'footer'
  | 'services_showcase'

interface SectionMeta {
  key: SectionKey
  label: string
  icon: any
  desc: string
  fields: FieldDef[]
}

interface FieldDef {
  key: string
  label: string
  type: 'text' | 'textarea' | 'image'
  placeholder?: string
  hint?: string
  rows?: number
}

// ─── Section definitions (every editable field) ───────────────────────────────
const SECTIONS: SectionMeta[] = [
  {
    key: 'home_hero', label: 'Hero', icon: Layout,
    desc: 'Main hero section — top of homepage',
    fields: [
      { key: 'imageUrl',       label: 'Background Image',      type: 'image' },
      { key: 'badge',          label: 'Top Badge Text',         type: 'text',  placeholder: 'DANI & MIKI AUTO SOLUTION' },
      { key: 'badge_right',    label: 'Badge Right Text',       type: 'text',  placeholder: 'EST. ADDIS ABABA' },
      { key: 'line1',          label: 'Headline Line 1',        type: 'text',  placeholder: 'ADVANCED' },
      { key: 'line2',          label: 'Headline Line 2',        type: 'text',  placeholder: 'AUTOMOTIVE' },
      { key: 'line3',          label: 'Headline Line 3 (red)',  type: 'text',  placeholder: 'SOLUTIONS' },
      { key: 'body',           label: 'Body Paragraph',         type: 'textarea', placeholder: 'High-precision computer diagnostics…', rows: 3 },
      { key: 'cta_primary',    label: 'Primary Button',         type: 'text',  placeholder: 'BOOK AN APPOINTMENT' },
      { key: 'cta_secondary',  label: 'Secondary Button',       type: 'text',  placeholder: 'LAUNCH DIAGNOSTIC SCANNER' },
      { key: 'scroll_label',   label: 'Scroll Label',           type: 'text',  placeholder: 'SCROLL TO EXPLORE' },
      { key: 'badge1_sub',     label: 'Badge 1 — Sub Label',    type: 'text',  placeholder: 'ENGINE & TCU' },
      { key: 'badge1_label',   label: 'Badge 1 — Main Label',   type: 'text',  placeholder: 'ECU PROGRAMMING' },
      { key: 'badge2_sub',     label: 'Badge 2 — Sub Label',    type: 'text',  placeholder: 'ALL-SYSTEM' },
      { key: 'badge2_label',   label: 'Badge 2 — Main Label',   type: 'text',  placeholder: 'OEM DIAGNOSTICS' },
      { key: 'badge3_sub',     label: 'Badge 3 — Sub Label',    type: 'text',  placeholder: 'CAN-BUS & SENSORS' },
      { key: 'badge3_label',   label: 'Badge 3 — Main Label',   type: 'text',  placeholder: 'AUTO ELECTRICAL' },
      { key: 'badge4_sub',     label: 'Badge 4 — Sub Label',    type: 'text',  placeholder: 'SECURITY & FOBS' },
      { key: 'badge4_label',   label: 'Badge 4 — Main Label',   type: 'text',  placeholder: 'KEY PROGRAMMING' },
    ],
  },
  {
    key: 'typographic_interlude', label: 'Interlude', icon: Quote,
    desc: 'Animated typographic statement between Hero and Services',
    fields: [
      { key: 'title',       label: 'Badge Label',      type: 'text',  placeholder: 'THE DANI & MIKI STANDARD' },
      { key: 'phrase1_left',  label: 'Phrase 1 — Left',  type: 'text',  placeholder: "WE DON'T JUST" },
      { key: 'phrase1_right', label: 'Phrase 1 — Right', type: 'text',  placeholder: 'FIND THE PROBLEM.' },
      { key: 'phrase2_left',  label: 'Phrase 2 — Left',  type: 'text',  placeholder: 'WE ENGINEER THE' },
      { key: 'phrase2_right', label: 'Phrase 2 — Right (red)', type: 'text', placeholder: 'RIGHT SOLUTION.' },
      { key: 'spec1',       label: 'Spec Badge 1',      type: 'text',  placeholder: '01 / ZERO GUESSWORK' },
      { key: 'spec2',       label: 'Spec Badge 2',      type: 'text',  placeholder: '02 / OEM PROTOCOLS' },
      { key: 'spec3',       label: 'Spec Badge 3',      type: 'text',  placeholder: '03 / DEDICATED PRECISION' },
    ],
  },
  {
    key: 'precision_showcase', label: 'Precision', icon: Eye,
    desc: 'Scroll-driven full-bleed image section',
    fields: [
      { key: 'imageUrl',     label: 'Background Image',       type: 'image' },
      { key: 'subtitle',     label: 'Badge Text',             type: 'text',  placeholder: 'UNCOMPROMISING STANDARDS' },
      { key: 'title',        label: 'Heading (white part)',   type: 'text',  placeholder: 'PRECISION IN' },
      { key: 'title_red',    label: 'Heading (red part)',     type: 'text',  placeholder: 'EVERY DETAIL.' },
      { key: 'body',         label: 'Body Paragraph',         type: 'textarea', placeholder: 'From microscopic EEPROM soldering…', rows: 3 },
      { key: 'stat1_value',  label: 'Stat 1 — Value',         type: 'text',  placeholder: '100%' },
      { key: 'stat1_label',  label: 'Stat 1 — Label',         type: 'text',  placeholder: 'FACTORY OEM WIRE LOOM MAPPING' },
      { key: 'stat2_value',  label: 'Stat 2 — Value',         type: 'text',  placeholder: '0.01A' },
      { key: 'stat2_label',  label: 'Stat 2 — Label',         type: 'text',  placeholder: 'PARASITIC DRAIN ISOLATION' },
      { key: 'stat3_value',  label: 'Stat 3 — Value',         type: 'text',  placeholder: 'LIFETIME' },
      { key: 'stat3_label',  label: 'Stat 3 — Label',         type: 'text',  placeholder: 'ECU MAP CLOUD BACKUPS' },
    ],
  },
  {
    key: 'why_choose_us', label: 'Why Us', icon: BarChart2,
    desc: 'Animated statistics and trust pillars section',
    fields: [
      { key: 'subtitle',      label: 'Badge Text',          type: 'text',  placeholder: 'MEASURED EXCELLENCE' },
      { key: 'title',         label: 'Heading (white)',      type: 'text',  placeholder: 'ENGINEERED' },
      { key: 'title_red',     label: 'Heading (red)',        type: 'text',  placeholder: 'FOR TRUST' },
      { key: 'intro',         label: 'Intro Paragraph',      type: 'textarea', placeholder: "Why Addis Ababa's most discerning motorists trust…", rows: 2 },
      { key: 'stat1_number',  label: 'Stat 1 — Number',      type: 'text',  placeholder: '500' },
      { key: 'stat1_suffix',  label: 'Stat 1 — Suffix',      type: 'text',  placeholder: '+' },
      { key: 'stat1_label',   label: 'Stat 1 — Label',       type: 'text',  placeholder: 'VEHICLES SERVICED' },
      { key: 'stat1_desc',    label: 'Stat 1 — Description', type: 'textarea', placeholder: 'Precision repairs across…', rows: 2 },
      { key: 'stat2_number',  label: 'Stat 2 — Number',      type: 'text',  placeholder: '1000' },
      { key: 'stat2_suffix',  label: 'Stat 2 — Suffix',      type: 'text',  placeholder: '+' },
      { key: 'stat2_label',   label: 'Stat 2 — Label',       type: 'text',  placeholder: 'DIAGNOSTIC SCANS' },
      { key: 'stat2_desc',    label: 'Stat 2 — Description', type: 'textarea', placeholder: 'Deep level CAN-bus…', rows: 2 },
      { key: 'stat3_number',  label: 'Stat 3 — Number',      type: 'text',  placeholder: '5' },
      { key: 'stat3_suffix',  label: 'Stat 3 — Suffix',      type: 'text',  placeholder: '+' },
      { key: 'stat3_label',   label: 'Stat 3 — Label',       type: 'text',  placeholder: 'SPECIALIZED DISCIPLINES' },
      { key: 'stat3_desc',    label: 'Stat 3 — Description', type: 'textarea', placeholder: 'ECU mapping, micro-soldering…', rows: 2 },
      { key: 'stat4_number',  label: 'Stat 4 — Number',      type: 'text',  placeholder: '100' },
      { key: 'stat4_suffix',  label: 'Stat 4 — Suffix',      type: 'text',  placeholder: '%' },
      { key: 'stat4_label',   label: 'Stat 4 — Label',       type: 'text',  placeholder: 'PRECISION RATE' },
      { key: 'stat4_desc',    label: 'Stat 4 — Description', type: 'textarea', placeholder: 'Rigorous pre-delivery…', rows: 2 },
      { key: 'pillar1_title', label: 'Pillar 1 — Title',     type: 'text',  placeholder: 'OEM Equipment & Software' },
      { key: 'pillar1_body',  label: 'Pillar 1 — Body',      type: 'textarea', placeholder: 'We invest in genuine factory…', rows: 2 },
      { key: 'pillar2_title', label: 'Pillar 2 — Title',     type: 'text',  placeholder: 'Transparent Digital Reports' },
      { key: 'pillar2_body',  label: 'Pillar 2 — Body',      type: 'textarea', placeholder: 'Every customer receives…', rows: 2 },
      { key: 'pillar3_title', label: 'Pillar 3 — Title',     type: 'text',  placeholder: 'Guaranteed Turnaround' },
      { key: 'pillar3_body',  label: 'Pillar 3 — Body',      type: 'textarea', placeholder: 'Structured workflow…', rows: 2 },
    ],
  },
  {
    key: 'contact_section', label: 'Contact', icon: Phone,
    desc: 'Workshop contact, address and hotline section',
    fields: [
      { key: 'subtitle',         label: 'Badge Text',          type: 'text',  placeholder: 'DIRECT WORKSHOP COMMUNICATIONS' },
      { key: 'title',            label: 'Heading',              type: 'text',  placeholder: "LET'S GET YOUR VEHICLE MOVING." },
      { key: 'body',             label: 'Body Paragraph',       type: 'textarea', placeholder: 'Whether diagnosing an elusive electrical error…', rows: 3 },
      { key: 'cta_primary',      label: 'Primary Button',       type: 'text',  placeholder: 'RESERVE WORKSHOP BAY' },
      { key: 'cta_secondary',    label: 'Secondary Button',     type: 'text',  placeholder: 'CALL WORKSHOP' },
      { key: 'address_title',    label: 'Address — Title',      type: 'text',  placeholder: 'Bole Medhanialem / Garage Zone' },
      { key: 'address_body',     label: 'Address — Body',       type: 'text',  placeholder: 'Addis Ababa, Ethiopia · GPS…' },
      { key: 'hours_label',      label: 'Hours — Days',         type: 'text',  placeholder: 'Mon – Sat' },
      { key: 'hours_value',      label: 'Hours — Times',        type: 'text',  placeholder: '08:00 AM – 06:30 PM' },
      { key: 'phone1',           label: 'Phone 1',              type: 'text',  placeholder: '+251 911 234 567' },
      { key: 'phone2',           label: 'Phone 2',              type: 'text',  placeholder: '+251 922 987 654' },
      { key: 'telegram_handle',  label: 'Telegram / WhatsApp Handle', type: 'text', placeholder: '@DANIMIKIAUTO' },
    ],
  },
  {
    key: 'footer', label: 'Footer', icon: AlignLeft,
    desc: 'Footer tagline, address, phone and copyright',
    fields: [
      { key: 'tagline',       label: 'Brand Tagline',      type: 'textarea', placeholder: 'Precision automotive electronic engineering…', rows: 3 },
      { key: 'status_badge',  label: 'Status Badge',       type: 'text',  placeholder: 'DIAGNOSTIC BAYS ACTIVE' },
      { key: 'subtitle',      label: 'Watermark Subtitle', type: 'text',  placeholder: 'AUTO SOLUTION · PRECISION IN EVERY DETAIL' },
      { key: 'address_line1', label: 'Address Line 1',     type: 'text',  placeholder: 'Bole Medhanialem' },
      { key: 'address_line2', label: 'Address Line 2',     type: 'text',  placeholder: 'Addis Ababa, Ethiopia' },
      { key: 'phone',         label: 'Phone Number',       type: 'text',  placeholder: '+251 911 234 567' },
      { key: 'cta',           label: 'Book Button Text',   type: 'text',  placeholder: 'BOOK ONLINE' },
      { key: 'copyright',     label: 'Copyright Text',     type: 'text',  placeholder: 'DANI & MIKI AUTO SOLUTION. ALL RIGHTS RESERVED.' },
    ],
  },
  // Services has its own special editor — fields array is empty (handled separately)
  {
    key: 'services_showcase', label: 'Services', icon: Wrench,
    desc: 'Edit all 6 service cards — text, details and images',
    fields: [], // handled by ServicesEditor
  },
]

// ─── Image uploader (reused from before) ─────────────────────────────────────
function ImageUploader({ value, onChange }: { value: string|null|undefined; onChange:(v:string|null)=>void }) {
  const [mode, setMode] = useState<'upload'|'url'>('upload')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState(value ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setUrlInput(value ?? '') }, [value])

  const upload = useCallback(async (file: File) => {
    if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(file.type)) { alert('JPG, PNG or WebP only'); return }
    if (file.size > 10*1024*1024) { alert('Max 10MB'); return }
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('bucket', 'website')
      const r = await fetch('/api/admin/upload', { method:'POST', body:fd })
      const d = await r.json()
      if (d.url) { onChange(d.url); setUrlInput(d.url) } else alert(d.error ?? 'Upload failed')
    } catch { alert('Upload failed') } finally { setUploading(false) }
  }, [onChange])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 p-0.5 bg-white/5 border border-white/8 rounded-lg">
          {(['upload','url'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${mode===m?'bg-white/10 text-white':'text-zinc-500 hover:text-zinc-300'}`}>
              {m==='upload' ? <Upload className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
              {m==='upload' ? 'Upload' : 'URL'}
            </button>
          ))}
        </div>
        {value && <button onClick={() => { onChange(null); setUrlInput('') }} className="p-1 text-zinc-600 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>}
      </div>

      {value && (
        <div className="relative rounded-xl overflow-hidden border border-white/8 h-32">
          <img src={value} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.opacity='0.2')} />
          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-[10px] text-zinc-400 font-mono truncate">{value}</p>
          </div>
        </div>
      )}

      {mode==='upload' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f=e.dataTransfer.files[0]; if(f) upload(f) }}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed transition-all cursor-pointer ${dragging?'border-red-500 bg-red-500/10':uploading?'border-white/10 bg-white/[0.02] cursor-not-allowed':'border-white/10 bg-[#0a0a10] hover:border-red-500/50'}`}
        >
          <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(f) upload(f); e.target.value='' }} disabled={uploading} />
          {uploading ? <><Loader2 className="w-5 h-5 text-red-400 animate-spin" /><p className="text-xs text-zinc-400">Uploading…</p></>
            : dragging ? <><Upload className="w-5 h-5 text-red-400" /><p className="text-xs text-red-300 font-semibold">Drop to upload</p></>
            : <><ImageIcon className="w-5 h-5 text-zinc-600" /><p className="text-xs text-zinc-400"><span className="text-red-400">Click</span> or drag • JPG PNG WebP • 10MB max</p></>}
        </div>
      )}

      {mode==='url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
            <input value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key==='Enter' && onChange(urlInput.trim()||null)} placeholder="https://…"
              className="w-full bg-[#0a0a10] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-all" />
          </div>
          <button onClick={() => onChange(urlInput.trim()||null)} className="flex items-center gap-1.5 px-4 py-2 bg-white/8 hover:bg-white/12 border border-white/8 text-zinc-300 text-xs font-semibold rounded-xl transition-all">
            <CheckCircle2 className="w-3.5 h-3.5" /> Apply
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Field row ────────────────────────────────────────────────────────────────
function FieldRow({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string|null) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-5 items-start py-3.5 border-b border-white/[0.04] last:border-0">
      <div className="sm:col-span-2">
        <p className="text-sm font-semibold text-zinc-200">{field.label}</p>
        {field.hint && <p className="text-xs text-zinc-600 mt-0.5">{field.hint}</p>}
      </div>
      <div className="sm:col-span-3">
        {field.type === 'image' ? (
          <ImageUploader value={value || null} onChange={onChange} />
        ) : field.type === 'textarea' ? (
          <textarea
            rows={field.rows || 3}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full bg-[#0a0a10] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all resize-none"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full bg-[#0a0a10] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
          />
        )}
      </div>
    </div>
  )
}

// ─── Services editor (special — manages array of service objects) ─────────────
interface ServiceData {
  id: string
  numberCode: string
  title: string
  tagline: string
  description: string
  features: string[]
  image: string
  turnaround: string
  accuracyRate: string
  equipmentUsed: string
  category: string
}

function ServicesEditor({ onSaved }: { onSaved: () => void }) {
  const [services, setServices] = useState<ServiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(d => {
        try {
          const raw = d.content?.services_showcase?.description
          if (raw) {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) setServices(parsed)
          }
        } catch {}
      })
      .finally(() => setLoading(false))
  }, [])

  const updateService = (id: string, field: keyof ServiceData, val: string | string[]) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s))
  }

  const updateFeature = (id: string, idx: number, val: string) => {
    setServices(prev => prev.map(s => {
      if (s.id !== id) return s
      const feats = [...s.features]
      feats[idx] = val
      return { ...s, features: feats }
    }))
  }

  const addFeature = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, features: [...s.features, ''] } : s))
  }

  const removeFeature = (id: string, idx: number) => {
    setServices(prev => prev.map(s => {
      if (s.id !== id) return s
      return { ...s, features: s.features.filter((_, i) => i !== idx) }
    }))
  }

  const saveAll = async () => {
    setSaving(true); setError('')
    try {
      const r = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'services_showcase',
          title: 'CORE SOLUTIONS',
          subtitle: 'SPECIALIZED WORKSHOP DISCIPLINES',
          ctaText: 'BOOK THIS SERVICE',
          description: JSON.stringify(services),
        }),
      })
      if (r.ok) {
        setSuccess('All services saved — changes are live')
        setTimeout(() => setSuccess(''), 4000)
        onSaved()
      } else {
        setError('Save failed')
      }
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {success && <Toast message={success} type="success" onDismiss={() => setSuccess('')} />}
        {error   && <Toast message={error}   type="error"   onDismiss={() => setError('')}   />}
      </AnimatePresence>

      {services.map((svc, svcIdx) => {
        const isOpen = expandedId === svc.id
        return (
          <motion.div
            key={svc.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: svcIdx * 0.04 }}
            className="bg-[#0d0d14] border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            {/* Service card header */}
            <button
              onClick={() => setExpandedId(isOpen ? null : svc.id)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
            >
              {/* Preview image */}
              <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/8 flex-shrink-0 bg-zinc-900">
                {svc.image ? (
                  <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-zinc-700" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-black text-sm font-mono">{svc.numberCode}</span>
                  <span className="font-bold text-white text-sm truncate">{svc.title}</span>
                </div>
                <p className="text-zinc-500 text-xs truncate mt-0.5">{svc.tagline}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[10px] text-zinc-600 font-mono px-2 py-1 bg-white/[0.03] rounded-lg border border-white/5">
                  {svc.category}
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
              </div>
            </button>

            {/* Expanded editor */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-white/[0.05] space-y-5 pt-4">

                    {/* Service image */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Service Image
                      </label>
                      <ImageUploader
                        value={svc.image || null}
                        onChange={val => updateService(svc.id, 'image', val || '')}
                      />
                    </div>

                    {/* Basic text fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Service Number', field: 'numberCode' as keyof ServiceData, ph: '01' },
                        { label: 'Category',       field: 'category'   as keyof ServiceData, ph: 'Diagnostics' },
                        { label: 'Title',          field: 'title'      as keyof ServiceData, ph: 'Computer Diagnostics' },
                        { label: 'Tagline',        field: 'tagline'    as keyof ServiceData, ph: 'Deep Level…' },
                      ].map(({ label, field, ph }) => (
                        <div key={field}>
                          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">{label}</label>
                          <input
                            value={svc[field] as string}
                            onChange={e => updateService(svc.id, field, e.target.value)}
                            placeholder={ph}
                            className="w-full bg-[#0a0a10] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea
                        rows={3}
                        value={svc.description}
                        onChange={e => updateService(svc.id, 'description', e.target.value)}
                        placeholder="Full service description…"
                        className="w-full bg-[#0a0a10] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all resize-none"
                      />
                    </div>

                    {/* Tech details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Turnaround',     field: 'turnaround'     as keyof ServiceData, ph: '45 - 90 Minutes' },
                        { label: 'Accuracy Rate',  field: 'accuracyRate'   as keyof ServiceData, ph: '99.8% Fault Pinpoint' },
                        { label: 'Equipment Used', field: 'equipmentUsed'  as keyof ServiceData, ph: 'Autel MaxiSys…' },
                      ].map(({ label, field, ph }) => (
                        <div key={field}>
                          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">{label}</label>
                          <input
                            value={svc[field] as string}
                            onChange={e => updateService(svc.id, field, e.target.value)}
                            placeholder={ph}
                            className="w-full bg-[#0a0a10] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Feature Bullets</label>
                        <button
                          onClick={() => addFeature(svc.id)}
                          className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Add Feature
                        </button>
                      </div>
                      <div className="space-y-2">
                        {svc.features.map((feat, featIdx) => (
                          <div key={featIdx} className="flex gap-2">
                            <input
                              value={feat}
                              onChange={e => updateFeature(svc.id, featIdx, e.target.value)}
                              placeholder={`Feature ${featIdx + 1}…`}
                              className="flex-1 bg-[#0a0a10] border border-white/8 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-all"
                            />
                            <button
                              onClick={() => removeFeature(svc.id, featIdx)}
                              className="p-2 rounded-xl hover:bg-red-500/20 text-red-500/50 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Save all */}
      <div className="flex items-center justify-between pt-2 px-1">
        <p className="text-xs text-zinc-600">Changes apply to all 6 service cards simultaneously.</p>
        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40 shadow-[0_0_20px_rgba(220,38,38,0.25)]"
        >
          {saving
            ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
            : <><Save className="w-3.5 h-3.5" />Save All Services</>}
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminContentPage() {
  const [data, setData] = useState<Record<SectionKey, Record<string,string>>>({} as any)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<SectionKey>('home_hero')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/content', { headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then(d => {
        const raw: Record<string, any> = d.content || {}
        const built: Record<string, Record<string,string>> = {}
        for (const [sec, row] of Object.entries(raw)) {
          const flat: Record<string,string> = {}
          if (row.title)    flat.title    = row.title
          if (row.subtitle) flat.subtitle = row.subtitle
          if (row.ctaText)  flat.ctaText  = row.ctaText
          if (row.imageUrl) flat.imageUrl = row.imageUrl
          try { if (row.description) Object.assign(flat, JSON.parse(row.description)) } catch {}
          built[sec] = flat
        }
        setData(built as any)
      })
      .finally(() => setLoading(false))
  }, [])

  const get = (sec: SectionKey, key: string) => data[sec]?.[key] ?? ''

  const set = (sec: SectionKey, key: string, val: string | null) =>
    setData(d => ({ ...d, [sec]: { ...(d[sec] || {}), [key]: val ?? '' } }))

  const save = async () => {
    setSaving(true); setError('')
    try {
      const sec = SECTIONS.find(s => s.key === active)!
      const flat = data[active] || {}

      // Separate top-level fields from JSON description fields
      const topLevelKeys = ['title', 'subtitle', 'ctaText', 'imageUrl']
      const jsonFields: Record<string, string> = {}

      for (const f of sec.fields) {
        // imageUrl always goes to the top-level column, never into description JSON
        if (!topLevelKeys.includes(f.key)) {
          jsonFields[f.key] = flat[f.key] ?? ''
        }
      }

      const payload = {
        section: active,
        title:       flat.title       ?? null,
        subtitle:    flat.subtitle    ?? null,
        ctaText:     flat.ctaText     ?? null,
        imageUrl:    flat.imageUrl    ?? null,
        description: JSON.stringify(jsonFields),
      }

      const r = await fetch('/api/admin/content', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (r.ok) { setSuccess(`${sec.label} saved — changes are live`); setTimeout(() => setSuccess(''), 4000) }
      else setError('Save failed')
    } catch { setError('Save failed') } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  const activeSec = SECTIONS.find(s => s.key === active)!

  return (
    <div className="space-y-5 max-w-5xl">
      <PageHeader title="Website Content" subtitle="Edit every text, image and label shown on the public website" />

      <AnimatePresence>
        {success && <Toast message={success} type="success" onDismiss={() => setSuccess('')} />}
        {error   && <Toast message={error}   type="error"   onDismiss={() => setError('')}   />}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* ── Section nav ── */}
        <nav className="lg:col-span-1 space-y-1">
          {SECTIONS.map(s => {
            const Icon = s.icon
            const isActive = active === s.key
            return (
              <button key={s.key} onClick={() => setActive(s.key)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all group ${isActive ? 'bg-white/[0.07] border border-white/12' : 'border border-transparent hover:bg-white/[0.03]'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 transition-all ${isActive ? 'bg-red-600/20 border-red-600/30 text-red-400' : 'bg-white/[0.04] border-white/8 text-zinc-600 group-hover:text-zinc-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{s.label}</p>
                  <p className="text-xs text-zinc-600 truncate">{s.desc}</p>
                </div>
              </button>
            )
          })}
        </nav>

        {/* ── Fields panel ── */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>

              {/* ── Services: special editor ── */}
              {active === 'services_showcase' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1">
                    <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-600/25 flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Services Section</p>
                      <p className="text-zinc-600 text-xs">Edit all 6 service cards — titles, descriptions, images, tech details and feature bullets</p>
                    </div>
                  </div>
                  <ServicesEditor onSaved={() => {}} />
                </div>
              ) : (
                /* ── All other sections: generic field rows ── */
                <Card>
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05]">
                    <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-600/25 flex items-center justify-center">
                      <activeSec.icon className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{activeSec.label} Section</p>
                      <p className="text-zinc-600 text-xs">{activeSec.desc}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/8 border border-blue-500/15 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[10px] text-blue-300 font-mono">{activeSec.fields.length} fields</span>
                    </div>
                  </div>

                  <div className="px-6">
                    {activeSec.fields.map(field => (
                      <FieldRow
                        key={field.key}
                        field={field}
                        value={get(active, field.key)}
                        onChange={val => set(active, field.key, val)}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-t border-white/[0.05] rounded-b-2xl">
                    <p className="text-xs text-zinc-600">Changes go live immediately after saving.</p>
                    <button
                      onClick={save}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40 shadow-[0_0_20px_rgba(220,38,38,0.25)]"
                    >
                      {saving
                        ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                        : <><Save className="w-3.5 h-3.5" />Save {activeSec.label}</>}
                    </button>
                  </div>
                </Card>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
