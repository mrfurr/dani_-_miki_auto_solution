"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Clock, Calendar, Ban, Plus, Trash2, Save } from 'lucide-react'
import { PageHeader, PrimaryButton, GhostButton, Card, Modal, Spinner, Toast } from '@/components/admin/AdminUI'

type Tab = 'hours'|'breaks'|'blocked-dates'|'blocked-times'|'in-person'
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const TABS = [
  { id:'hours' as Tab,         label:'Hours',         icon:Clock },
  { id:'breaks' as Tab,        label:'Breaks',        icon:Clock },
  { id:'blocked-dates' as Tab, label:'Blocked Dates', icon:Calendar },
  { id:'blocked-times' as Tab, label:'Blocked Times', icon:Ban },
  { id:'in-person' as Tab,     label:'In-Person',     icon:Calendar },
]

export default function AdminSchedulePage() {
  const [tab, setTab] = useState<Tab>('hours')
  const [hours, setHours] = useState<any[]>([])
  const [breaks, setBreaks] = useState<any[]>([])
  const [blockedDates, setBlockedDates] = useState<any[]>([])
  const [blockedTimes, setBlockedTimes] = useState<any[]>([])
  const [inPerson, setInPerson] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<any>({})
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const [bh, br, bd, bt, ip] = await Promise.all([
        fetch('/api/admin/schedule/business-hours').then(r=>r.json()),
        fetch('/api/admin/schedule/break-hours').then(r=>r.json()),
        fetch('/api/admin/schedule/blocked-dates').then(r=>r.json()),
        fetch('/api/admin/schedule/blocked-times').then(r=>r.json()),
        fetch('/api/admin/schedule/in-person').then(r=>r.json()),
      ])
      setHours(bh.hours||[]); setBreaks(br.breaks||[])
      setBlockedDates(bd.blocked||[]); setBlockedTimes(bt.blocked||[]); setInPerson(ip.bookings||[])
    } finally { setLoading(false) }
  }

  const saveHours = async () => {
    setSaving(true); setError('')
    try {
      const r = await fetch('/api/admin/schedule/business-hours', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ hours: hours.map(h=>({ dayOfWeek:h.dayOfWeek, openTime:h.openTime, closeTime:h.closeTime, isClosed:h.isClosed })) }) })
      if (r.ok) { setSuccess('Working hours saved'); setTimeout(()=>setSuccess(''),3000) }
      else setError('Save failed')
    } finally { setSaving(false) }
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
    const urls: Record<string,string> = { breaks:'/api/admin/schedule/break-hours', 'blocked-dates':'/api/admin/schedule/blocked-dates', 'blocked-times':'/api/admin/schedule/blocked-times', 'in-person':'/api/admin/schedule/in-person' }
    setSaving(true); setError('')
    try {
      const r = await fetch(urls[tab], { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(addForm) })
      if (r.ok) { setSuccess('Added'); setShowAdd(false); load(); setTimeout(()=>setSuccess(''),3000) }
      else { const d = await r.json(); setError(d.error||'Failed') }
    } finally { setSaving(false) }
  }

  const del = async (id:string) => {
    const urls: Record<string,string> = { breaks:`/api/admin/schedule/break-hours/${id}`, 'blocked-dates':`/api/admin/schedule/blocked-dates/${id}`, 'blocked-times':`/api/admin/schedule/blocked-times/${id}`, 'in-person':`/api/admin/schedule/in-person/${id}` }
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

          {/* Other tabs */}
          {tab !== 'hours' && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" />Add {tab==='breaks'?'Break':tab==='blocked-dates'?'Blocked Date':tab==='blocked-times'?'Blocked Time':'In-Person'}</PrimaryButton>
              </div>
              <Card>
                {tab==='breaks' && (breaks.length===0 ? <p className="text-zinc-600 text-sm text-center py-8">No break hours configured</p> : breaks.map((b:any) => <ItemRow key={b.id} title={b.name} sub={`${b.startTime} – ${b.endTime}`} onDel={()=>del(b.id)} />))}
                {tab==='blocked-dates' && (blockedDates.length===0 ? <p className="text-zinc-600 text-sm text-center py-8">No blocked dates</p> : blockedDates.map((b:any) => <ItemRow key={b.id} title={b.date} sub={b.reason||'No reason specified'} onDel={()=>del(b.id)} />))}
                {tab==='blocked-times' && (blockedTimes.length===0 ? <p className="text-zinc-600 text-sm text-center py-8">No blocked time slots</p> : blockedTimes.map((b:any) => <ItemRow key={b.id} title={`${b.date} · ${b.startTime}–${b.endTime}`} sub={b.reason||'No reason'} onDel={()=>del(b.id)} />))}
                {tab==='in-person' && (inPerson.length===0 ? <p className="text-zinc-600 text-sm text-center py-8">No in-person bookings</p> : inPerson.map((b:any) => <ItemRow key={b.id} title={`${b.date} · ${b.startTime}–${b.endTime}`} sub={b.notes||'In-person appointment'} onDel={()=>del(b.id)} />))}
              </Card>
            </div>
          )}
        </motion.div>
      )}

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <Modal open title={tab==='breaks'?'Add Break':tab==='blocked-dates'?'Block Date':tab==='blocked-times'?'Block Time Slot':'Add In-Person Booking'} onClose={()=>setShowAdd(false)}>
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
