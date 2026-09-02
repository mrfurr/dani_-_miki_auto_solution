"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Pencil, Trash2, MapPin, Globe } from 'lucide-react'
import { PageHeader, PrimaryButton, GhostButton, Card, Badge, Modal, Spinner, EmptyState, Toast, Input } from '@/components/admin/AdminUI'

type Tab = 'branches'|'social'
const TABS = [{ id:'branches' as Tab, label:'Branches', icon:MapPin }, { id:'social' as Tab, label:'Social Media', icon:Globe }]

export default function AdminContactPage() {
  const [tab, setTab] = useState<Tab>('branches')
  const [data, setData] = useState<{branches:any[];social:any[]}>({ branches:[], social:[] })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string|null>(null)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const [b,s] = await Promise.all([
        fetch('/api/admin/contact/branches').then(r=>r.json()),
        fetch('/api/admin/contact/social').then(r=>r.json()),
      ])
      setData({ branches:b.branches||[], social:s.links||[] })
    } finally { setLoading(false) }
  }

  const defaults: Record<Tab,any> = {
    branches: { name:'', address:'', phone:'', mapUrl:'', isActive:true },
    social:   { platform:'', url:'', isActive:true },
  }

  const openAdd = () => { setForm(defaults[tab]); setEditId(null); setShowForm(true); setError('') }
  const openEdit = (item:any) => { setForm({...item}); setEditId(item.id); setShowForm(true); setError('') }

  const urls: Record<Tab,string> = { branches:'/api/admin/contact/branches', social:'/api/admin/contact/social' }

  const save = async () => {
    setSaving(true); setError('')
    try {
      const url = editId ? `${urls[tab]}/${editId}` : urls[tab]
      const r = await fetch(url, { method:editId?'PUT':'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      if (r.ok) { setSuccess('Saved'); setShowForm(false); load(); setTimeout(()=>setSuccess(''),3000) }
      else { const d = await r.json(); setError(d.error||'Save failed') }
    } finally { setSaving(false) }
  }

  const del = async (id:string) => {
    if (!confirm('Delete this item?')) return
    await fetch(`${urls[tab]}/${id}`, { method:'DELETE' })
    setSuccess('Deleted'); load(); setTimeout(()=>setSuccess(''),3000)
  }

  const items = tab==='branches' ? data.branches : data.social

  return (
    <div className="space-y-5 max-w-4xl">
      <PageHeader title="Contact" subtitle="Branches and social media links management" />

      <AnimatePresence>
        {success && <Toast message={success} type="success" onDismiss={()=>setSuccess('')} />}
        {error && !showForm && <Toast message={error} type="error" onDismiss={()=>setError('')} />}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#0d0d14] border border-white/5 rounded-2xl">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab===t.id ? 'bg-red-600 text-white shadow-[0_0_16px_rgba(220,38,38,0.3)]' : 'text-zinc-500 hover:text-zinc-200'}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" />Add {TABS.find(t=>t.id===tab)?.label.replace(/s$/,'')}</PrimaryButton>
      </div>

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState icon={TABS.find(t=>t.id===tab)!.icon} title={`No ${TABS.find(t=>t.id===tab)?.label.toLowerCase()} yet`} />
      ) : (
        <Card>
          <div className="divide-y divide-white/[0.04]">
            {items.map((item:any,i:number) => (
              <motion.div key={item.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.04}}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${item.isActive ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-zinc-800 border border-white/5'}`}>
                  {tab==='branches' && <MapPin className="w-4 h-4 text-emerald-400" />}
                  {tab==='social' && (() => {
                    const p = (item.platform || '').toLowerCase();
                    return (
                      <span>{
                        p.includes('facebook') ? '🔵' :
                        p.includes('instagram') ? '🌸' :
                        p.includes('telegram') ? '✈️' :
                        p.includes('whatsapp') ? '💬' :
                        p.includes('tiktok') ? '🎵' :
                        p.includes('youtube') ? '🔴' :
                        p.includes('twitter') ? '🐦' :
                        p.includes('linkedin') ? '💼' : '🔗'
                      }</span>
                    )
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{tab==='branches'?item.name:item.platform}</p>
                  <p className="text-zinc-500 text-xs truncate mt-0.5">{tab==='branches'?item.address:item.url}</p>
                </div>
                {item.isActive ? <Badge color="green">Active</Badge> : <Badge color="zinc">Inactive</Badge>}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-500 hover:text-zinc-200 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500/40 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <AnimatePresence>
        {showForm && (
          <Modal open title={`${editId?'Edit':'Add'} ${TABS.find(t=>t.id===tab)?.label.replace(/s$/,'')}`} onClose={()=>setShowForm(false)}>
            <div className="p-6 space-y-4">
              {error && <Toast message={error} type="error" />}
              {tab==='branches' && <>
                <Input label="Branch Name" value={form.name||''} onChange={v=>setForm((f:any)=>({...f,name:v}))} placeholder="Main Branch — Bole, Addis Ababa" required />
                <Input label="Address" value={form.address||''} onChange={v=>setForm((f:any)=>({...f,address:v}))} placeholder="Bole Road, near Edna Mall" required />
                <Input label="Phone" value={form.phone||''} onChange={v=>setForm((f:any)=>({...f,phone:v}))} placeholder="+251 911 234 567" />
                <Input label="Google Maps URL" value={form.mapUrl||''} onChange={v=>setForm((f:any)=>({...f,mapUrl:v}))} placeholder="https://maps.google.com/…" />
              </>}
              {tab==='social' && <>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Platform <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {['Facebook','Instagram','Telegram','WhatsApp','TikTok','YouTube','Twitter / X','LinkedIn'].map(p => {
                      const isSelected = form.platform === p
                      return (
                        <button key={p} type="button" onClick={() => setForm((f:any) => ({...f, platform: p}))}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${isSelected ? 'bg-red-600/20 border-red-600/40 text-white' : 'bg-[#14141c] border-white/8 text-zinc-400 hover:border-white/20 hover:text-zinc-200'}`}>
                          <span className="text-sm">{
                            p === 'Facebook' ? '🔵' :
                            p === 'Instagram' ? '🌸' :
                            p === 'Telegram' ? '✈️' :
                            p === 'WhatsApp' ? '💬' :
                            p === 'TikTok' ? '🎵' :
                            p === 'YouTube' ? '🔴' :
                            p === 'Twitter / X' ? '🐦' :
                            p === 'LinkedIn' ? '💼' : '🔗'
                          }</span>
                          <span className="truncate">{p}</span>
                        </button>
                      )
                    })}
                  </div>
                  <input
                    value={form.platform||''}
                    onChange={e=>setForm((f:any)=>({...f,platform:e.target.value}))}
                    placeholder="Or type a custom platform name…"
                    className="w-full bg-[#14141c] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 transition-all"
                  />
                </div>
                <Input label="Profile / Page URL" value={form.url||''} onChange={v=>setForm((f:any)=>({...f,url:v}))} placeholder="https://facebook.com/danimikiauto" required />
              </>}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e=>setForm((f:any)=>({...f,isActive:e.target.checked}))} className="w-4 h-4 rounded accent-red-600" />
                <span className="text-sm text-zinc-400">Active — visible on website</span>
              </label>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <GhostButton onClick={()=>setShowForm(false)} className="flex-1 justify-center">Cancel</GhostButton>
              <PrimaryButton onClick={save} loading={saving} className="flex-1 justify-center">Save</PrimaryButton>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
