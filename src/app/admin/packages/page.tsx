"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Clock, DollarSign } from 'lucide-react'
import { PageHeader, PrimaryButton, GhostButton, Card, Badge, Modal, Spinner, EmptyState, Toast, Input, Textarea } from '@/components/admin/AdminUI'

interface Pkg { id:string; name:string; description:string; price:number|null; deposit:number|null; duration:number; isActive:boolean; imageUrl:string|null; features:string[] }
const EMPTY = { name:'', description:'', price:null as number|null, deposit:null as number|null, duration:60, isActive:true, imageUrl:null as string|null, features:[] as string[] }

export default function AdminPackagesPage() {
  const [pkgs, setPkgs] = useState<Pkg[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string|null>(null)
  const [form, setForm] = useState(EMPTY)
  const [feat, setFeat] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { setLoading(true); try { const r = await fetch('/api/admin/packages'); const d = await r.json(); setPkgs(d.packages||[]) } finally { setLoading(false) } }
  const openAdd = () => { setForm(EMPTY); setFeat(''); setEditId(null); setShowForm(true); setError('') }
  const openEdit = (p: Pkg) => { setForm({ name:p.name, description:p.description, price:p.price, deposit:p.deposit, duration:p.duration, isActive:p.isActive, imageUrl:p.imageUrl, features:[...p.features] }); setFeat(''); setEditId(p.id); setShowForm(true); setError('') }
  const addFeat = () => { if (feat.trim()) { setForm(f => ({ ...f, features:[...f.features, feat.trim()] })); setFeat('') } }
  const removeFeat = (i:number) => setForm(f => ({ ...f, features: f.features.filter((_,idx) => idx!==i) }))
  const toggle = async (p:Pkg) => { await fetch(`/api/admin/packages/${p.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ isActive:!p.isActive }) }); load() }
  const del = async (id:string) => { if (!confirm('Delete package?')) return; await fetch(`/api/admin/packages/${id}`, { method:'DELETE' }); setSuccess('Removed'); load(); setTimeout(() => setSuccess(''), 3000) }
  const save = async () => {
    if (!form.name || !form.description || form.duration <= 0) { setError('Name, description and duration required'); return }
    setSaving(true); setError('')
    try {
      const r = await fetch(editId ? `/api/admin/packages/${editId}` : '/api/admin/packages', { method: editId?'PUT':'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      if (r.ok) { setSuccess(editId?'Updated':'Created'); setShowForm(false); load(); setTimeout(() => setSuccess(''), 3000) }
      else { const d = await r.json(); setError(d.error||'Save failed') }
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5 max-w-7xl">
      <PageHeader title="Packages" subtitle="Service packages shown on the booking page"
        action={<PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Package</PrimaryButton>} />

      <AnimatePresence>
        {success && <Toast message={success} type="success" onDismiss={() => setSuccess('')} />}
        {error && !showForm && <Toast message={error} type="error" onDismiss={() => setError('')} />}
      </AnimatePresence>

      {loading ? <Spinner /> : pkgs.length === 0 ? (
        <EmptyState icon={Plus} title="No packages" subtitle="Add service packages to enable booking" />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5">
                {['Package','Price','Deposit','Duration','Status','Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3 first:pl-6 last:pr-6">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {pkgs.map((p,i) => (
                  <motion.tr key={p.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 pl-6">
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-zinc-500 text-xs mt-0.5 max-w-xs truncate">{p.description}</p>
                    </td>
                    <td className="px-4 py-4 text-zinc-300">{p.price ? `${p.price.toLocaleString()} ETB` : '—'}</td>
                    <td className="px-4 py-4 text-zinc-300">{p.deposit ? `${p.deposit.toLocaleString()} ETB` : '—'}</td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-zinc-400 text-xs"><Clock className="w-3 h-3" />{p.duration} min</span>
                    </td>
                    <td className="px-4 py-4">{p.isActive ? <Badge color="green">Active</Badge> : <Badge color="zinc">Inactive</Badge>}</td>
                    <td className="px-4 py-4 pr-6">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-500 hover:text-zinc-200 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => toggle(p)} className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-500 hover:text-zinc-200 transition-colors">{p.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-zinc-600" />}</button>
                        <button onClick={() => del(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500/40 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <AnimatePresence>
        {showForm && (
          <Modal open title={editId?'Edit Package':'Add Package'} onClose={() => setShowForm(false)} maxWidth="max-w-2xl">
            <div className="p-6 space-y-4">
              {error && <Toast message={error} type="error" />}
              <Input label="Name" value={form.name} onChange={v => setForm(f=>({...f,name:v}))} placeholder="Comprehensive OEM Diagnostic Scan" required />
              <Textarea label="Description" value={form.description} onChange={v => setForm(f=>({...f,description:v}))} placeholder="Full description…" required />
              <div className="grid grid-cols-3 gap-3">
                {[{label:'Price (ETB)',key:'price'},{label:'Deposit (ETB)',key:'deposit'},{label:'Duration (min)',key:'duration'}].map(({label,key}) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">{label}</label>
                    <input type="number" value={(form as any)[key]??''} onChange={e => setForm(f=>({...f,[key]:e.target.value?parseFloat(e.target.value):null}))}
                      className="w-full bg-[#14141c] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/60 transition-all" />
                  </div>
                ))}
              </div>
              {/* Features */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Features</label>
                <div className="flex gap-2 mb-2">
                  <input value={feat} onChange={e => setFeat(e.target.value)} onKeyDown={e => e.key==='Enter' && (e.preventDefault(), addFeat())} placeholder="Add feature…"
                    className="flex-1 bg-[#14141c] border border-white/8 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 transition-all" />
                  <button onClick={addFeat} className="px-4 py-2 bg-white/8 hover:bg-white/12 text-zinc-300 rounded-xl text-sm transition-colors">Add</button>
                </div>
                <div className="space-y-1.5">
                  {form.features.map((f,i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-white/[0.04] border border-white/5 rounded-lg px-3 py-2">
                      <span className="flex-1 text-sm text-zinc-300">{f}</span>
                      <button onClick={() => removeFeat(i)} className="text-zinc-600 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f=>({...f,isActive:e.target.checked}))} className="w-4 h-4 rounded accent-red-600" />
                <span className="text-sm text-zinc-400">Active — visible in booking</span>
              </label>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <GhostButton onClick={() => setShowForm(false)} className="flex-1 justify-center">Cancel</GhostButton>
              <PrimaryButton onClick={save} loading={saving} className="flex-1 justify-center">{editId?'Save Changes':'Create Package'}</PrimaryButton>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
