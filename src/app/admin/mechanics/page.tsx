"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Pencil, Trash2, Star, UserCheck, UserX, Upload, X } from 'lucide-react'
import { PageHeader, PrimaryButton, GhostButton, Card, Badge, Modal, Spinner, EmptyState, Toast, Input, Textarea } from '@/components/admin/AdminUI'

interface Mechanic {
  id: string; name: string; role: string; specialization: string
  experience: string; certifications: string[]; bio: string
  photo: string | null; isActive: boolean; avgRating: number; reviewCount: number
}
const EMPTY = { name:'', role:'', specialization:'', experience:'', certifications:[] as string[], bio:'', photo:null as string|null, isActive:true }

export default function AdminMechanicsPage() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string|null>(null)
  const [form, setForm] = useState(EMPTY)
  const [certInput, setCertInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try { const r = await fetch('/api/admin/mechanics'); const d = await r.json(); setMechanics(d.mechanics || []) }
    finally { setLoading(false) }
  }

  const openAdd = () => { setForm(EMPTY); setCertInput(''); setEditId(null); setShowForm(true); setError('') }
  const openEdit = (m: Mechanic) => { setForm({ name:m.name, role:m.role, specialization:m.specialization, experience:m.experience, certifications:[...m.certifications], bio:m.bio, photo:m.photo, isActive:m.isActive }); setCertInput(''); setEditId(m.id); setShowForm(true); setError('') }

  const uploadPhoto = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('bucket', 'mechanics')
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await r.json()
      if (d.url) setForm(f => ({ ...f, photo: d.url }))
      else setError('Upload failed')
    } catch { setError('Upload failed') } finally { setUploading(false) }
  }

  const addCert = () => { if (certInput.trim()) { setForm(f => ({ ...f, certifications: [...f.certifications, certInput.trim()] })); setCertInput('') } }
  const removeCert = (i: number) => setForm(f => ({ ...f, certifications: f.certifications.filter((_,idx) => idx !== i) }))

  const save = async () => {
    if (!form.name || !form.role || !form.bio) { setError('Name, role and bio are required'); return }
    setSaving(true); setError('')
    try {
      const r = await fetch(editId ? `/api/admin/mechanics/${editId}` : '/api/admin/mechanics', {
        method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      if (r.ok) { setSuccess(editId ? 'Updated' : 'Created'); setShowForm(false); load(); setTimeout(() => setSuccess(''), 3000) }
      else { const d = await r.json(); setError(d.error || 'Save failed') }
    } finally { setSaving(false) }
  }

  const toggle = async (m: Mechanic) => {
    await fetch(`/api/admin/mechanics/${m.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !m.isActive }) })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Deactivate this mechanic?')) return
    await fetch(`/api/admin/mechanics/${id}`, { method: 'DELETE' })
    setSuccess('Deactivated'); load(); setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="space-y-5 max-w-7xl">
      <PageHeader title="Mechanics" subtitle="Manage specialist roster"
        action={<PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Mechanic</PrimaryButton>} />

      <AnimatePresence>
        {success && <Toast message={success} type="success" onDismiss={() => setSuccess('')} />}
        {error && !showForm && <Toast message={error} type="error" onDismiss={() => setError('')} />}
      </AnimatePresence>

      {loading ? <Spinner /> : mechanics.length === 0 ? (
        <EmptyState icon={Plus} title="No mechanics yet" subtitle="Add your first mechanic" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mechanics.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-[#0d0d14] border rounded-2xl p-5 space-y-4 transition-all ${m.isActive ? 'border-white/8 hover:border-white/15' : 'border-white/4 opacity-60'}`}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/20 overflow-hidden flex-shrink-0">
                  {m.photo ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" /> :
                    <div className="w-full h-full flex items-center justify-center text-xl font-black text-red-400">{m.name[0]}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{m.name}</p>
                  <p className="text-zinc-400 text-sm truncate">{m.role}</p>
                  <p className="text-zinc-600 text-xs truncate">{m.specialization}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span className="font-bold">{m.avgRating.toFixed(1)}</span>
                  <span className="text-zinc-600 text-xs">({m.reviewCount})</span>
                </div>
                <span className="text-zinc-600 text-xs">·</span>
                <span className="text-zinc-500 text-xs">{m.experience}</span>
                <div className="ml-auto">{m.isActive ? <Badge color="green">Active</Badge> : <Badge color="zinc">Inactive</Badge>}</div>
              </div>
              <div className="flex gap-2 pt-1 border-t border-white/5">
                <button onClick={() => openEdit(m)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium transition-colors"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => toggle(m)} className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors" title={m.isActive ? 'Deactivate' : 'Activate'}>
                  {m.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => remove(m.id)} className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <Modal open title={editId ? 'Edit Mechanic' : 'Add Mechanic'} onClose={() => setShowForm(false)} maxWidth="max-w-2xl">
            <div className="p-6 space-y-4">
              {error && <Toast message={error} type="error" />}
              {/* Photo */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#14141c] border border-white/8 overflow-hidden flex-shrink-0">
                  {form.photo ? <img src={form.photo} alt="" className="w-full h-full object-cover" /> :
                    <div className="w-full h-full flex items-center justify-center text-zinc-600"><Upload className="w-5 h-5" /></div>}
                </div>
                <div>
                  <label className="cursor-pointer inline-block bg-white/8 hover:bg-white/12 text-zinc-300 text-xs font-medium px-4 py-2 rounded-xl transition-colors">
                    {uploading ? 'Uploading…' : 'Upload Photo'}
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden"
                      onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])} disabled={uploading} />
                  </label>
                  {form.photo && <button onClick={() => setForm(f => ({ ...f, photo: null }))} className="ml-2 text-zinc-600 hover:text-red-400 text-xs transition-colors">Remove</button>}
                  <p className="text-zinc-600 text-xs mt-1">JPG, PNG, WebP · max 5MB</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Name" value={form.name} onChange={v => setForm(f => ({...f,name:v}))} placeholder="Abel Tesfaye" required />
                <Input label="Role" value={form.role} onChange={v => setForm(f => ({...f,role:v}))} placeholder="Lead Diagnostic Engineer" required />
                <Input label="Specialization" value={form.specialization} onChange={v => setForm(f => ({...f,specialization:v}))} placeholder="ECU, BMW CAN-Bus" required />
                <Input label="Experience" value={form.experience} onChange={v => setForm(f => ({...f,experience:v}))} placeholder="5 years" />
              </div>
              <Textarea label="Bio" value={form.bio} onChange={v => setForm(f => ({...f,bio:v}))} placeholder="Brief description…" required />
              {/* Certs */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Certifications</label>
                <div className="flex gap-2 mb-2">
                  <input value={certInput} onChange={e => setCertInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCert())} placeholder="Add certification…"
                    className="flex-1 bg-[#14141c] border border-white/8 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 transition-all" />
                  <button onClick={addCert} className="px-4 py-2 bg-white/8 hover:bg-white/12 text-zinc-300 rounded-xl text-sm transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.certifications.map((c, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-2.5 py-1 rounded-lg">
                      {c}<button onClick={() => removeCert(i)}><X className="w-3 h-3 hover:text-red-400" /></button>
                    </span>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({...f,isActive:e.target.checked}))} className="w-4 h-4 rounded accent-red-600" />
                <span className="text-sm text-zinc-400">Active — visible on website</span>
              </label>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <GhostButton onClick={() => setShowForm(false)} className="flex-1 justify-center">Cancel</GhostButton>
              <PrimaryButton onClick={save} loading={saving} className="flex-1 justify-center">{editId ? 'Save Changes' : 'Create Mechanic'}</PrimaryButton>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
