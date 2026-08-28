"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, CreditCard } from 'lucide-react'
import { PageHeader, PrimaryButton, GhostButton, Card, Badge, Modal, Spinner, EmptyState, Toast, Input } from '@/components/admin/AdminUI'

interface Bank { id:string; bankName:string; bankIcon:string|null; accountName:string; accountNumber:string; isActive:boolean }
const EMPTY = { bankName:'', bankIcon:null as string|null, accountName:'', accountNumber:'', isActive:true }

export default function AdminBanksPage() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string|null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { setLoading(true); try { const r = await fetch('/api/admin/banks'); const d = await r.json(); setBanks(d.banks||[]) } finally { setLoading(false) } }
  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError('') }
  const openEdit = (b:Bank) => { setForm({ bankName:b.bankName, bankIcon:b.bankIcon, accountName:b.accountName, accountNumber:b.accountNumber, isActive:b.isActive }); setEditId(b.id); setShowForm(true); setError('') }

  const save = async () => {
    if (!form.bankName || !form.accountName || !form.accountNumber) { setError('Bank name, account name and number required'); return }
    setSaving(true); setError('')
    try {
      const r = await fetch(editId ? `/api/admin/banks/${editId}` : '/api/admin/banks', { method: editId?'PUT':'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      if (r.ok) { setSuccess(editId?'Updated':'Added'); setShowForm(false); load(); setTimeout(()=>setSuccess(''),3000) }
      else { const d = await r.json(); setError(d.error||'Save failed') }
    } finally { setSaving(false) }
  }

  const toggle = async (b:Bank) => { await fetch(`/api/admin/banks/${b.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ isActive:!b.isActive }) }); load() }
  const del = async (id:string) => { if (!confirm('Delete this bank account?')) return; await fetch(`/api/admin/banks/${id}`, { method:'DELETE' }); setSuccess('Deleted'); load(); setTimeout(()=>setSuccess(''),3000) }

  return (
    <div className="space-y-5 max-w-5xl">
      <PageHeader title="Bank Accounts" subtitle="Payment accounts shown to customers during booking"
        action={<PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Add Account</PrimaryButton>} />

      <AnimatePresence>
        {success && <Toast message={success} type="success" onDismiss={()=>setSuccess('')} />}
        {error && !showForm && <Toast message={error} type="error" onDismiss={()=>setError('')} />}
      </AnimatePresence>

      {loading ? <Spinner /> : banks.length === 0 ? (
        <EmptyState icon={CreditCard} title="No bank accounts" subtitle="Add payment accounts for customer deposits" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {banks.map((b,i) => (
            <motion.div key={b.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              className={`bg-[#0d0d14] border rounded-2xl p-5 transition-all ${b.isActive?'border-white/8 hover:border-white/15':'border-white/4 opacity-60'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/20 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{b.bankName}</p>
                    <p className="text-zinc-500 text-xs">{b.accountName}</p>
                  </div>
                </div>
                {b.isActive ? <Badge color="green">Active</Badge> : <Badge color="zinc">Inactive</Badge>}
              </div>
              <p className="font-mono text-zinc-300 text-sm bg-[#14141c] border border-white/5 rounded-lg px-3 py-2 mb-4">{b.accountNumber}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(b)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium transition-colors"><Pencil className="w-3.5 h-3.5" />Edit</button>
                <button onClick={() => toggle(b)} className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors">{b.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-zinc-600" />}</button>
                <button onClick={() => del(b.id)} className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <Modal open title={editId?'Edit Bank Account':'Add Bank Account'} onClose={()=>setShowForm(false)}>
            <div className="p-6 space-y-4">
              {error && <Toast message={error} type="error" />}
              <Input label="Bank Name" value={form.bankName} onChange={v=>setForm(f=>({...f,bankName:v}))} placeholder="Commercial Bank of Ethiopia" required />
              <Input label="Account Name" value={form.accountName} onChange={v=>setForm(f=>({...f,accountName:v}))} placeholder="Dani & Miki Auto Solution" required />
              <Input label="Account Number" value={form.accountNumber} onChange={v=>setForm(f=>({...f,accountNumber:v}))} placeholder="1000123456789" required />
              <Input label="Bank Icon (optional)" value={form.bankIcon??''} onChange={v=>setForm(f=>({...f,bankIcon:v||null}))} placeholder="URL or identifier" />
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e=>setForm(f=>({...f,isActive:e.target.checked}))} className="w-4 h-4 rounded accent-red-600" />
                <span className="text-sm text-zinc-400">Active — visible to customers</span>
              </label>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <GhostButton onClick={()=>setShowForm(false)} className="flex-1 justify-center">Cancel</GhostButton>
              <PrimaryButton onClick={save} loading={saving} className="flex-1 justify-center">{editId?'Save Changes':'Add Account'}</PrimaryButton>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
