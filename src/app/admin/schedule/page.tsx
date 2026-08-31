"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Clock, Calendar, Ban, Plus, Trash2, Save, Users, Sun, Sunset, Check, X } from 'lucide-react'
import { PageHeader, PrimaryButton, GhostButton, Card, Modal, Spinner, Toast } from '@/components/admin/AdminUI'

type Tab = 'hours'|'breaks'|'blocked-dates'|'blocked-times'|'in-person'|'time-classifications'
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const TABS = [
  { id:'hours' as Tab,                 label:'Hours',         icon:Clock },
  { id:'breaks' as Tab,                label:'Breaks',        icon:Clock },
  { id:'blocked-dates' as Tab,         label:'Blocked Dates', icon:Calendar },
  { id:'blocked-times' as Tab,         label:'Blocked Times', icon:Ban },
  { id:'in-person' as Tab,             label:'In-Person',     icon:Calendar },
  { id:'time-classifications' as Tab,  label:'Time Groups',   icon:Clock },
]

function fmtTime(hhmm: string): string {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const display = h % 12 || 12
  return `${display}:${String(m).padStart(2, '0')} ${ampm}`
}
function buildLabel(start: string, end: string): string {
  if (!start || !end) return ''
  return `${fmtTime(start)} – ${fmtTime(end)}`
}

// ── Time Group Card ─────────────────────────────────────────────────────────
function TimeGroupCard({
  tc,
  onSave,
  onDelete,
  saving,
}: {
  tc: any
  onSave: (id: string, data: any) => Promise<void>
  onDelete: (id: string) => void
  saving: boolean
}) {
  const [ranges, setRanges]             = useState<any[]>(tc.ranges || [])
  const [bookingLimit, setBookingLimit] = useState<number>(tc.bookingLimit ?? 5)
  const [addingRange, setAddingRange]   = useState(false)
  const [newStart, setNewStart]         = useState('')
  const [newEnd, setNewEnd]             = useState('')
  const [isSaving, setIsSaving]         = useState(false)
  const [dirty, setDirty]               = useState(false)

  const Icon = tc.icon === 'Afternoon' || tc.icon === 'Sunset' ? Sunset : Sun
  const color  = tc.color  || 'text-yellow-400'
  const bgCard = tc.bgColor || 'bg-yellow-500/10 border-yellow-500/20'

  const handleAddRange = () => {
    if (!newStart || !newEnd) return
    const newRange = { start: newStart, end: newEnd, label: buildLabel(newStart, newEnd) }
    setRanges(prev => [...prev, newRange])
    setNewStart(''); setNewEnd(''); setAddingRange(false)
    setDirty(true)
  }

  const handleRemoveRange = (idx: number) => {
    setRanges(prev => prev.filter((_, i) => i !== idx))
    setDirty(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const description = ranges.map(r => r.label || buildLabel(r.start, r.end)).join(', ')
    await onSave(tc.id, { ranges, bookingLimit, description })
    setDirty(false)
    setIsSaving(false)
  }

  return (
    <Card className="p-0 overflow-hidden">
      {/* Card header */}
      <div className={`flex items-center justify-between px-5 py-4 border-b border-white/[0.06] ${bgCard} bg-opacity-30`}>
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className={`font-bold text-sm ${color}`}>{tc.label}</span>
          {!tc.isActive && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 uppercase">Inactive</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all disabled:opacity-40"
            >
              <Save className="w-3 h-3" />
              {isSaving ? 'Saving…' : 'Save'}
            </button>
          )}
          <button
            onClick={() => onDelete(tc.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500/40 hover:text-red-400 transition-colors"
            title="Delete group"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Booking limit row */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.04] bg-white/[0.01]">
        <Users className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
        <span className="text-xs font-mono text-zinc-400 uppercase flex-1">Max bookings per day</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setBookingLimit(v => Math.max(1, v-1)); setDirty(true) }}
            className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-sm font-bold transition-colors"
          >−</button>
          <input
            type="number"
            min={1}
            max={100}
            value={bookingLimit}
            onChange={e => { setBookingLimit(parseInt(e.target.value) || 1); setDirty(true) }}
            className="w-12 bg-[#14141c] border border-white/8 rounded-lg text-center text-white text-sm font-bold font-mono focus:outline-none focus:border-red-500/60 py-0.5"
          />
          <button
            onClick={() => { setBookingLimit(v => Math.min(100, v+1)); setDirty(true) }}
            className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-sm font-bold transition-colors"
          >+</button>
          <span className="text-xs font-mono text-zinc-500">bookings</span>
        </div>
      </div>

      {/* Time slot ranges */}
      <div className="px-5 py-4 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Time Slots</span>
          <button
            onClick={() => setAddingRange(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/8 text-zinc-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Plus className="w-3 h-3" /> Add Range
          </button>
        </div>

        {/* Existing ranges */}
        {ranges.length === 0 && !addingRange && (
          <p className="text-zinc-600 text-xs font-mono text-center py-3">No time slots yet — add one above</p>
        )}
        {ranges.map((r: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between bg-[#14141c] border border-white/8 rounded-xl px-4 py-2.5">
            <span className="text-sm font-mono text-white">{r.label || buildLabel(r.start, r.end)}</span>
            <button
              onClick={() => handleRemoveRange(idx)}
              className="p-1 rounded-lg hover:bg-red-500/20 text-red-500/40 hover:text-red-400 transition-colors ml-3"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Inline add range row */}
        <AnimatePresence>
          {addingRange && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 bg-zinc-900 border border-red-500/30 rounded-xl px-4 py-2.5"
            >
              <span className="text-zinc-500 text-xs font-mono flex-shrink-0">From</span>
              <input
                type="time"
                value={newStart}
                onChange={e => setNewStart(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none flex-1 min-w-0"
                autoFocus
              />
              <span className="text-zinc-500 text-xs font-mono flex-shrink-0">To</span>
              <input
                type="time"
                value={newEnd}
                onChange={e => setNewEnd(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none flex-1 min-w-0"
              />
              {newStart && newEnd && (
                <span className="text-[10px] font-mono text-zinc-500 hidden sm:block flex-shrink-0">
                  {buildLabel(newStart, newEnd)}
                </span>
              )}
              <button
                onClick={handleAddRange}
                disabled={!newStart || !newEnd}
                className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 transition-colors disabled:opacity-30 flex-shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setAddingRange(false); setNewStart(''); setNewEnd('') }}
                className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}

export default function AdminSchedulePage() {
  const [tab, setTab] = useState<Tab>('hours')
  const [hours, setHours] = useState<any[]>([])
  const [breaks, setBreaks] = useState<any[]>([])
  const [blockedDates, setBlockedDates] = useState<any[]>([])
  const [blockedTimes, setBlockedTimes] = useState<any[]>([])
  const [inPerson, setInPerson] = useState<any[]>([])
  const [timeClassifications, setTimeClassifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [addForm, setAddForm] = useState<any>({})
  const [newGroupLabel, setNewGroupLabel] = useState('')
  const [newGroupIcon, setNewGroupIcon] = useState<'Sun'|'Sunset'>('Sun')
  const [newGroupLimit, setNewGroupLimit] = useState(5)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const [bh, br, bd, bt, ip, tc] = await Promise.all([
        fetch('/api/admin/schedule/business-hours').then(r=>r.json()),
        fetch('/api/admin/schedule/break-hours').then(r=>r.json()),
        fetch('/api/admin/schedule/blocked-dates').then(r=>r.json()),
        fetch('/api/admin/schedule/blocked-times').then(r=>r.json()),
        fetch('/api/admin/schedule/in-person').then(r=>r.json()),
        fetch('/api/admin/schedule/time-classifications').then(r=>r.json()),
      ])
      setHours(bh.hours||[])
      setBreaks(br.breaks||[])
      setBlockedDates(bd.blocked||[])
      setBlockedTimes(bt.blocked||[])
      setInPerson(ip.bookings||[])
      setTimeClassifications(
        tc.classifications?.map((c: any) => ({
          ...c,
          ranges: typeof c.ranges === 'string' ? JSON.parse(c.ranges) : c.ranges,
          bookingLimit: c.bookingLimit ?? 5
        })) || []
      )
    } finally { setLoading(false) }
  }

  const saveHours = async () => {
    setSaving(true); setError('')
    try {
      const r = await fetch('/api/admin/schedule/business-hours', {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ hours: hours.map(h=>({ dayOfWeek:h.dayOfWeek, openTime:h.openTime, closeTime:h.closeTime, isClosed:h.isClosed })) })
      })
      if (r.ok) { setSuccess('Working hours saved'); setTimeout(()=>setSuccess(''),3000) }
      else setError('Save failed')
    } finally { setSaving(false) }
  }

  // Save updates to a time classification (ranges + bookingLimit)
  const saveGroup = async (id: string, data: { ranges: any[]; bookingLimit: number; description: string }) => {
    const r = await fetch(`/api/admin/schedule/time-classifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ranges: data.ranges,
        bookingLimit: data.bookingLimit,
        description: data.description,
      })
    })
    if (r.ok) {
      setSuccess('Time group saved')
      setTimeout(() => setSuccess(''), 3000)
      load()
    } else {
      const d = await r.json()
      setError(d.error || 'Failed to save')
      setTimeout(() => setError(''), 3000)
    }
  }

  const deleteGroup = async (id: string) => {
    await fetch(`/api/admin/schedule/time-classifications/${id}`, { method: 'DELETE' })
    setSuccess('Deleted'); load(); setTimeout(()=>setSuccess(''),3000)
  }

  const createGroup = async () => {
    if (!newGroupLabel.trim()) { setError('Group name is required'); return }
    const colorMap = { Sun: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/20' }, Sunset: { color: 'text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/20' } }
    const r = await fetch('/api/admin/schedule/time-classifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: newGroupLabel.trim(),
        ranges: [],
        description: '',
        icon: newGroupIcon,
        color: colorMap[newGroupIcon].color,
        bgColor: colorMap[newGroupIcon].bgColor,
        bookingLimit: newGroupLimit,
        order: timeClassifications.length,
      })
    })
    if (r.ok) {
      setSuccess('Time group created')
      setShowAddGroup(false)
      setNewGroupLabel(''); setNewGroupIcon('Sun'); setNewGroupLimit(5)
      setTimeout(() => setSuccess(''), 3000)
      load()
    } else {
      const d = await r.json(); setError(d.error || 'Failed')
    }
  }

  const openAdd = () => {
    const defaults: Record<string,any> = {
      breaks: { name:'', startTime:'12:00', endTime:'13:00' },
      'blocked-dates': { date:'', reason:'' },
      'blocked-times': { date:'', startTime:'09:00', endTime:'10:00', reason:'' },
      'in-person': { date:'', startTime:'10:00', endTime:'12:00', notes:'' },
    }
    setAddForm(defaults[tab]||{}); setShowAdd(true)
  }

  const addItem = async () => {
    const urls: Record<string,string> = {
      breaks:'/api/admin/schedule/break-hours',
      'blocked-dates':'/api/admin/schedule/blocked-dates',
      'blocked-times':'/api/admin/schedule/blocked-times',
      'in-person':'/api/admin/schedule/in-person',
    }
    setSaving(true); setError('')
    try {
      const r = await fetch(urls[tab], { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(addForm) })
      if (r.ok) { setSuccess('Added'); setShowAdd(false); load(); setTimeout(()=>setSuccess(''),3000) }
      else { const d = await r.json(); setError(d.error||'Failed') }
    } finally { setSaving(false) }
  }

  const del = async (id:string) => {
    const urls: Record<string,string> = {
      breaks:`/api/admin/schedule/break-hours/${id}`,
      'blocked-dates':`/api/admin/schedule/blocked-dates/${id}`,
      'blocked-times':`/api/admin/schedule/blocked-times/${id}`,
      'in-person':`/api/admin/schedule/in-person/${id}`,
    }
    await fetch(urls[tab], { method:'DELETE' })
    setSuccess('Deleted'); load(); setTimeout(()=>setSuccess(''),3000)
  }

  const F = ({ label, value, onChange, type='text', placeholder='' }: any) => (
    <div>
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#14141c] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/60 transition-all" />
    </div>
  )

  const ItemRow = ({ title, sub, onDel }: { title:string; sub:string; onDel:()=>void }) => (
    <div className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors border-b border-white/[0.04] last:border-0">
      <div>
        <p className="font-semibold text-white text-sm">{title}</p>
        <p className="text-zinc-500 text-xs mt-0.5">{sub}</p>
      </div>
      <button onClick={onDel} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500/40 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
    </div>
  )

  return (
    <div className="space-y-5 max-w-4xl">
      <PageHeader title="Schedule" subtitle="Working hours, breaks, blocked slots and in-person bookings" />

      <AnimatePresence>
        {success && <Toast message={success} type="success" onDismiss={()=>setSuccess('')} />}
        {error && <Toast message={error} type="error" onDismiss={()=>setError('')} />}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto p-1 bg-[#0d0d14] border border-white/5 rounded-2xl">
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${tab===t.id?'bg-red-600 text-white shadow-[0_0_16px_rgba(220,38,38,0.3)]':'text-zinc-500 hover:text-zinc-200'}`}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <motion.div key={tab} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}>

          {/* Working Hours */}
          {tab==='hours' && (
            <div className="space-y-3">
              {DAYS.map((_,idx) => {
                const h = hours.find(h=>h.dayOfWeek===idx)
                if (!h) return null
                return (
                  <Card key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <p className="w-28 font-semibold text-white text-sm flex-shrink-0">{DAYS[idx]}</p>
                    <div className="flex items-center gap-4 flex-1 flex-wrap">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={h.isClosed} onChange={e=>setHours(prev=>prev.map(bh=>bh.dayOfWeek===idx?{...bh,isClosed:e.target.checked}:bh))} className="w-4 h-4 rounded accent-red-600" />
                        <span className="text-sm text-zinc-400">Closed</span>
                      </label>
                      {!h.isClosed && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 text-xs">Open</span>
                            <input type="time" value={h.openTime} onChange={e=>setHours(prev=>prev.map(bh=>bh.dayOfWeek===idx?{...bh,openTime:e.target.value}:bh))}
                              className="bg-[#14141c] border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-red-500/60 transition-all" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 text-xs">Close</span>
                            <input type="time" value={h.closeTime} onChange={e=>setHours(prev=>prev.map(bh=>bh.dayOfWeek===idx?{...bh,closeTime:e.target.value}:bh))}
                              className="bg-[#14141c] border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-red-500/60 transition-all" />
                          </div>
                        </>
                      )}
                      {h.isClosed && <span className="text-zinc-600 text-xs italic">Garage closed</span>}
                    </div>
                  </Card>
                )
              })}
              <PrimaryButton onClick={saveHours} loading={saving} className="w-full justify-center py-3">
                <Save className="w-4 h-4" /> Save Working Hours
              </PrimaryButton>
            </div>
          )}

          {/* Breaks / Blocked / In-person tabs */}
          {(tab==='breaks'||tab==='blocked-dates'||tab==='blocked-times'||tab==='in-person') && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <PrimaryButton onClick={openAdd}>
                  <Plus className="w-4 h-4" />
                  Add {tab==='breaks'?'Break':tab==='blocked-dates'?'Blocked Date':tab==='blocked-times'?'Blocked Time':'In-Person'}
                </PrimaryButton>
              </div>
              <Card>
                {tab==='breaks' && (breaks.length===0
                  ? <p className="text-zinc-600 text-sm text-center py-8">No break hours configured</p>
                  : breaks.map((b:any) => <ItemRow key={b.id} title={b.name} sub={`${b.startTime} – ${b.endTime}`} onDel={()=>del(b.id)} />)
                )}
                {tab==='blocked-dates' && (blockedDates.length===0
                  ? <p className="text-zinc-600 text-sm text-center py-8">No blocked dates</p>
                  : blockedDates.map((b:any) => <ItemRow key={b.id} title={b.date} sub={b.reason||'No reason specified'} onDel={()=>del(b.id)} />)
                )}
                {tab==='blocked-times' && (blockedTimes.length===0
                  ? <p className="text-zinc-600 text-sm text-center py-8">No blocked time slots</p>
                  : blockedTimes.map((b:any) => <ItemRow key={b.id} title={`${b.date} · ${b.startTime}–${b.endTime}`} sub={b.reason||'No reason'} onDel={()=>del(b.id)} />)
                )}
                {tab==='in-person' && (inPerson.length===0
                  ? <p className="text-zinc-600 text-sm text-center py-8">No in-person bookings</p>
                  : inPerson.map((b:any) => <ItemRow key={b.id} title={`${b.date} · ${b.startTime}–${b.endTime}`} sub={b.notes||'In-person appointment'} onDel={()=>del(b.id)} />)
                )}
              </Card>
            </div>
          )}

          {/* ── Time Groups tab ── */}
          {tab==='time-classifications' && (
            <div className="space-y-4">
              {/* Header with Add Group button */}
              <div className="flex items-center justify-between">
                <p className="text-zinc-400 text-sm">
                  Each group has its own time slots and booking limit per day.
                </p>
                <PrimaryButton onClick={() => setShowAddGroup(true)}>
                  <Plus className="w-4 h-4" /> Add Group
                </PrimaryButton>
              </div>

              {timeClassifications.length === 0 ? (
                <Card className="p-12 text-center">
                  <Clock className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">No time groups yet.</p>
                  <p className="text-zinc-600 text-xs mt-1">Add Morning and Afternoon groups to get started.</p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {timeClassifications.map(tc => (
                    <TimeGroupCard
                      key={tc.id}
                      tc={tc}
                      onSave={saveGroup}
                      onDelete={deleteGroup}
                      saving={saving}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Add Group Modal */}
      <AnimatePresence>
        {showAddGroup && (
          <Modal open title="Add Time Group" onClose={() => setShowAddGroup(false)}>
            <div className="p-6 space-y-4">
              {error && <Toast message={error} type="error" />}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Group Name *</label>
                <input
                  type="text"
                  value={newGroupLabel}
                  onChange={e => setNewGroupLabel(e.target.value)}
                  placeholder="e.g. Morning, Afternoon, Evening"
                  className="w-full bg-[#14141c] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/60 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Icon</label>
                <div className="flex gap-2">
                  {(['Sun','Sunset'] as const).map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewGroupIcon(icon)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${newGroupIcon === icon ? 'bg-red-600/20 border-red-600/40 text-white' : 'bg-[#14141c] border-white/8 text-zinc-400 hover:text-zinc-200'}`}
                    >
                      {icon === 'Sun' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Sunset className="w-4 h-4 text-orange-400" />}
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Max Bookings Per Day
                </label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setNewGroupLimit(v => Math.max(1, v-1))} className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold transition-colors">−</button>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newGroupLimit}
                    onChange={e => setNewGroupLimit(parseInt(e.target.value) || 1)}
                    className="w-16 bg-[#14141c] border border-white/8 rounded-xl text-center text-white text-sm font-bold py-1.5 focus:outline-none focus:border-red-500/60"
                  />
                  <button onClick={() => setNewGroupLimit(v => Math.min(100, v+1))} className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold transition-colors">+</button>
                  <span className="text-xs font-mono text-zinc-500">max per day</span>
                </div>
              </div>
              <p className="text-xs text-zinc-600 font-mono">You can add time slot ranges after creating the group.</p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <GhostButton onClick={() => setShowAddGroup(false)} className="flex-1 justify-center">Cancel</GhostButton>
              <PrimaryButton onClick={createGroup} loading={saving} className="flex-1 justify-center">Create Group</PrimaryButton>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Add modal for other tabs */}
      <AnimatePresence>
        {showAdd && (
          <Modal
            open
            title={tab==='breaks'?'Add Break':tab==='blocked-dates'?'Block Date':tab==='blocked-times'?'Block Time Slot':'Add In-Person Booking'}
            onClose={()=>setShowAdd(false)}
          >
            <div className="p-6 space-y-4">
              {error && <Toast message={error} type="error" />}
              {tab==='breaks' && <>
                <F label="Break Name" value={addForm.name||''} onChange={(v:string)=>setAddForm((f:any)=>({...f,name:v}))} placeholder="Lunch Break" />
                <F label="Start Time" value={addForm.startTime} onChange={(v:string)=>setAddForm((f:any)=>({...f,startTime:v}))} type="time" />
                <F label="End Time" value={addForm.endTime} onChange={(v:string)=>setAddForm((f:any)=>({...f,endTime:v}))} type="time" />
              </>}
              {tab==='blocked-dates' && <>
                <F label="Date" value={addForm.date||''} onChange={(v:string)=>setAddForm((f:any)=>({...f,date:v}))} type="date" />
                <F label="Reason (optional)" value={addForm.reason||''} onChange={(v:string)=>setAddForm((f:any)=>({...f,reason:v}))} placeholder="Holiday, maintenance…" />
              </>}
              {tab==='blocked-times' && <>
                <F label="Date" value={addForm.date||''} onChange={(v:string)=>setAddForm((f:any)=>({...f,date:v}))} type="date" />
                <F label="Start Time" value={addForm.startTime} onChange={(v:string)=>setAddForm((f:any)=>({...f,startTime:v}))} type="time" />
                <F label="End Time" value={addForm.endTime} onChange={(v:string)=>setAddForm((f:any)=>({...f,endTime:v}))} type="time" />
                <F label="Reason (optional)" value={addForm.reason||''} onChange={(v:string)=>setAddForm((f:any)=>({...f,reason:v}))} placeholder="Private event…" />
              </>}
              {tab==='in-person' && <>
                <F label="Date" value={addForm.date||''} onChange={(v:string)=>setAddForm((f:any)=>({...f,date:v}))} type="date" />
                <F label="Start Time" value={addForm.startTime} onChange={(v:string)=>setAddForm((f:any)=>({...f,startTime:v}))} type="time" />
                <F label="End Time" value={addForm.endTime} onChange={(v:string)=>setAddForm((f:any)=>({...f,endTime:v}))} type="time" />
                <F label="Notes (optional)" value={addForm.notes||''} onChange={(v:string)=>setAddForm((f:any)=>({...f,notes:v}))} placeholder="Walk-in, VIP appointment…" />
              </>}
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <GhostButton onClick={()=>setShowAdd(false)} className="flex-1 justify-center">Cancel</GhostButton>
              <PrimaryButton onClick={addItem} loading={saving} className="flex-1 justify-center">Add</PrimaryButton>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
