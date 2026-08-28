"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, MailOpen, Trash2, Phone, X } from 'lucide-react'
import { PageHeader, Card, Badge, Modal, Spinner, EmptyState, Toast, GhostButton } from '@/components/admin/AdminUI'

interface Msg { id: string; name: string; phone: string|null; email: string; message: string; isRead: boolean; createdAt: string }

export default function AdminMessagesPage() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Msg|null>(null)
  const [success, setSuccess] = useState('')

  useEffect(() => { load() }, [filter])

  const load = async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (filter === 'unread') p.set('isRead','false')
      if (filter === 'read') p.set('isRead','true')
      const r = await fetch(`/api/admin/messages?${p}`)
      const d = await r.json(); setMsgs(d.messages || [])
    } finally { setLoading(false) }
  }

  const markRead = async (id: string, isRead: boolean) => {
    await fetch(`/api/admin/messages/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ isRead }) })
    load(); if (selected?.id === id) setSelected(s => s ? {...s, isRead} : null)
  }

  const open = async (m: Msg) => { setSelected(m); if (!m.isRead) await markRead(m.id, true) }

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/admin/messages/${id}`, { method:'DELETE' })
    setSuccess('Deleted'); if (selected?.id === id) setSelected(null); load(); setTimeout(() => setSuccess(''), 3000)
  }

  const unread = msgs.filter(m => !m.isRead).length

  return (
    <div className="space-y-5 max-w-4xl">
      <PageHeader title="Messages" subtitle="Customer contact form submissions"
        action={unread > 0 ? <Badge color="red">{unread} unread</Badge> : undefined} />

      <AnimatePresence>{success && <Toast message={success} type="success" onDismiss={() => setSuccess('')} />}</AnimatePresence>

      <div className="flex gap-2">
        {['all','unread','read'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter===f ? 'bg-red-600 text-white shadow-[0_0_16px_rgba(220,38,38,0.3)]' : 'bg-[#0d0d14] border border-white/8 text-zinc-400 hover:text-zinc-200 hover:border-white/15'}`}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : msgs.length === 0 ? (
        <EmptyState icon={Mail} title="No messages" subtitle="Customer messages will appear here" />
      ) : (
        <Card>
          <div className="divide-y divide-white/[0.04]">
            {msgs.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.03 }}
                onClick={() => open(m)} className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors ${!m.isRead ? 'bg-red-500/[0.03]' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!m.isRead ? 'bg-red-500/15 border border-red-500/25' : 'bg-white/5 border border-white/5'}`}>
                  {m.isRead ? <MailOpen className="w-4 h-4 text-zinc-500" /> : <Mail className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${m.isRead ? 'text-zinc-300' : 'text-white'}`}>{m.name}</span>
                    {!m.isRead && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                  </div>
                  <p className="text-zinc-500 text-xs truncate mt-0.5">{m.message}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-zinc-600 text-xs">{new Date(m.createdAt).toLocaleDateString()}</span>
                  <button onClick={e => { e.stopPropagation(); del(m.id) }} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500/40 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <AnimatePresence>
        {selected && (
          <Modal open title={`Message from ${selected.name}`} onClose={() => setSelected(null)}>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[['Name', selected.name], ['Date', new Date(selected.createdAt).toLocaleString()], ['Email', selected.email], ['Phone', selected.phone ?? '—']].map(([k,v]) => (
                  <div key={k}><p className="text-zinc-600 text-xs uppercase tracking-wider">{k}</p><p className="text-white font-medium mt-0.5">{v}</p></div>
                ))}
              </div>
              <div>
                <p className="text-zinc-600 text-xs uppercase tracking-wider mb-2">Message</p>
                <p className="text-zinc-200 text-sm leading-relaxed bg-[#14141c] border border-white/5 rounded-xl p-4">{selected.message}</p>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <GhostButton onClick={() => markRead(selected.id, !selected.isRead)} className="flex-1 justify-center">
                Mark as {selected.isRead ? 'Unread' : 'Read'}
              </GhostButton>
              <GhostButton onClick={() => del(selected.id)} variant="danger" className="flex-1 justify-center">Delete</GhostButton>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
