"use client"

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Calendar, CheckCircle, XCircle, User, Car, CreditCard, Eye, ChevronLeft, ChevronRight, Filter, ImageIcon, X as XIcon, ZoomIn, Loader2 } from 'lucide-react'
import {
  PageHeader, PrimaryButton, GhostButton, Card, Badge, Modal,
  Table, TR, TD, Spinner, EmptyState, Toast, bookingStatusBadge
} from '@/components/admin/AdminUI'

interface Booking {
  id: string; internalId: number; bookingCode: string | null
  customerName: string; customerPhone: string; customerEmail: string
  vehicleMake: string | null; vehicleModel: string | null; vehicleYear: string | null; plateNumber: string | null
  package: { name: string; price: number | null }
  date: string; time: string; depositAmount: number; depositMethod: string; transactionRef: string
  paymentScreenshot: string | null; status: string; createdAt: string
  approvedAt: string | null; checkedInAt: string | null; completedAt: string | null; rejectionReason: string | null
}

const STATUSES = ['all','PENDING_VERIFICATION','APPROVED','CHECKED_IN','IN_PROGRESS','COMPLETED','REJECTED']

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [date, setDate] = useState('')
  const [selected, setSelected] = useState<Booking | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  // Screenshot lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [loadingScreenshot, setLoadingScreenshot] = useState(false)
  const PER = 12

  useEffect(() => { fetch2(); setPage(1) }, [status, date])

  const openScreenshot = async (path: string) => {
    setLoadingScreenshot(true)
    try {
      const r = await fetch(`/api/admin/screenshot?path=${encodeURIComponent(path)}`)
      const d = await r.json()
      if (d.url) setLightboxUrl(d.url)
      else setError('Could not load screenshot')
    } catch { setError('Failed to load screenshot') }
    finally { setLoadingScreenshot(false) }
  }

  const fetch2 = async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (status !== 'all') p.set('status', status)
      if (date) p.set('date', date)
      const r = await fetch(`/api/bookings?${p}`)
      const d = await r.json()
      setBookings(d.bookings || [])
    } finally { setLoading(false) }
  }

  const action = async (id: string, act: string, reason?: string) => {
    setActionLoading(true)
    try {
      const body = act === 'reject' ? JSON.stringify({ reason: reason || 'Payment not verified' }) : undefined
      const headers: HeadersInit = act === 'reject' ? { 'Content-Type': 'application/json' } : {}
      const r = await fetch(`/api/admin/bookings/${id}/${act}`, { method: 'POST', headers, body })
      if (r.ok) {
        setSuccess(act === 'approve' ? 'Booking approved — confirmation email sent' : act === 'reject' ? 'Booking rejected' : act === 'checkin' ? 'Customer checked in' : 'Booking completed')
        setTimeout(() => setSuccess(''), 4000)
        setSelected(null); setRejectingId(null); setRejectReason('')
        fetch2()
      } else { const d = await r.json(); setError(d.error || 'Action failed'); setTimeout(() => setError(''), 4000) }
    } finally { setActionLoading(false) }
  }

  const filtered = bookings.filter(b => {
    if (!search) return true
    const q = search.toLowerCase()
    return b.customerName.toLowerCase().includes(q) || b.customerPhone.includes(q) || b.customerEmail.toLowerCase().includes(q) || b.bookingCode?.toLowerCase().includes(q)
  })
  const totalPages = Math.ceil(filtered.length / PER)
  const paged = filtered.slice((page - 1) * PER, page * PER)

  return (
    <div className="space-y-5 max-w-7xl">
      <PageHeader title="Bookings" subtitle="Manage all customer appointments" />

      <AnimatePresence>
        {success && <Toast message={success} type="success" onDismiss={() => setSuccess('')} />}
        {error && <Toast message={error} type="error" onDismiss={() => setError('')} />}
      </AnimatePresence>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search name, phone, email, code..."
              className="w-full bg-[#14141c] border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all" />
          </div>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="bg-[#14141c] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all">
            {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>)}
          </select>
          <input type="date" value={date} onChange={e => { setDate(e.target.value); setPage(1) }}
            className="bg-[#14141c] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all" />
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? <Spinner /> : paged.length === 0 ? (
          <EmptyState icon={Calendar} title="No bookings found" subtitle="Try adjusting your filters" />
        ) : (
          <Table headers={['Code', 'Customer', 'Service', 'Date / Time', 'Deposit', 'Status', 'Actions']}>
            {paged.map((b, i) => (
              <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <TD>
                  <span className="font-mono text-xs font-bold text-zinc-300">
                    {b.bookingCode ?? <span className="text-zinc-600">#{b.internalId}</span>}
                  </span>
                </TD>
                <TD>
                  <p className="font-semibold text-white text-sm">{b.customerName}</p>
                  <p className="text-zinc-500 text-xs">{b.customerPhone}</p>
                </TD>
                <TD><p className="text-zinc-300 text-sm max-w-[180px] truncate">{b.package.name}</p></TD>
                <TD>
                  <p className="text-zinc-300 text-xs font-mono">{b.date}</p>
                  <p className="text-zinc-500 text-xs">{b.time}</p>
                </TD>
                <TD>
                  <p className="text-zinc-300 text-sm">{b.depositAmount} ETB</p>
                  <p className="text-zinc-500 text-xs">{b.depositMethod}</p>
                </TD>
                <TD>{bookingStatusBadge(b.status)}</TD>
                <TD>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setSelected(b)} className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-500 hover:text-zinc-200 transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                    {b.status === 'PENDING_VERIFICATION' && (
                      <>
                        <button onClick={() => action(b.id, 'approve')} disabled={actionLoading} className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-500/60 hover:text-emerald-400 transition-colors" title="Approve"><CheckCircle className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { setRejectingId(b.id); setRejectReason('') }} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500/60 hover:text-red-400 transition-colors" title="Reject"><XCircle className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                    {b.status === 'APPROVED' && (
                      <button onClick={() => action(b.id, 'checkin')} disabled={actionLoading} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-500/60 hover:text-blue-400 transition-colors" title="Check In"><User className="w-3.5 h-3.5" /></button>
                    )}
                    {(b.status === 'CHECKED_IN' || b.status === 'IN_PROGRESS') && (
                      <button onClick={() => action(b.id, 'complete')} disabled={actionLoading} className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-500/60 hover:text-purple-400 transition-colors" title="Complete"><CheckCircle className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                </TD>
              </motion.tr>
            ))}
          </Table>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/5">
            <p className="text-xs text-zinc-500">{filtered.length} total</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-400 disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${page === n ? 'bg-red-600 text-white' : 'hover:bg-white/8 text-zinc-400'}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-400 disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <Modal open title={`Booking ${selected.bookingCode ?? '#' + selected.internalId}`} onClose={() => setSelected(null)} maxWidth="max-w-2xl">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">{bookingStatusBadge(selected.status)}{selected.bookingCode && <span className="font-mono font-black text-white text-lg">{selected.bookingCode}</span>}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Name', selected.customerName],
                  ['Phone', selected.customerPhone],
                  ['Email', selected.customerEmail],
                  ['Date', selected.date],
                  ['Time', selected.time],
                  ['Service', selected.package.name],
                  ['Deposit', `${selected.depositAmount} ETB`],
                  ['Method', selected.depositMethod],
                  ['Ref #', selected.transactionRef],
                  ...(selected.vehicleMake ? [['Vehicle', `${selected.vehicleMake} ${selected.vehicleModel || ''} ${selected.vehicleYear || ''}`.trim()]] : []),
                  ...(selected.plateNumber ? [['VIN', selected.plateNumber]] : []),
                ].map(([k,v]) => (
                  <div key={k as string}><span className="text-zinc-500 text-xs uppercase tracking-wider">{k}</span><p className="text-white font-medium mt-0.5">{v}</p></div>
                ))}
              </div>
              {selected.rejectionReason && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"><p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Rejection Reason</p><p className="text-red-400 text-sm">{selected.rejectionReason}</p></div>}

              {/* Payment Screenshot */}
              {selected.paymentScreenshot && (
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Payment Screenshot</p>
                  <button
                    onClick={() => openScreenshot(selected.paymentScreenshot!)}
                    disabled={loadingScreenshot}
                    className="group relative w-full h-32 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden hover:border-red-500/40 transition-all flex items-center justify-center"
                  >
                    {loadingScreenshot ? (
                      <div className="flex flex-col items-center gap-2 text-zinc-400">
                        <Loader2 className="w-5 h-5 animate-spin text-red-400" />
                        <span className="text-xs font-mono">Loading…</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-red-400 transition-colors">
                        <ZoomIn className="w-6 h-6" />
                        <span className="text-xs font-mono uppercase tracking-wider">View Payment Screenshot</span>
                        <span className="text-[10px] text-zinc-700 font-mono truncate max-w-[200px]">{selected.paymentScreenshot}</span>
                      </div>
                    )}
                  </button>
                </div>
              )}
              <div className="flex gap-3 pt-2 border-t border-white/5">
                {selected.status === 'PENDING_VERIFICATION' && (
                  <>
                    <PrimaryButton onClick={() => action(selected.id, 'approve')} loading={actionLoading} className="flex-1 justify-center">Approve</PrimaryButton>
                    <GhostButton onClick={() => { setRejectingId(selected.id); setRejectReason(''); setSelected(null) }} variant="danger" className="flex-1 justify-center">Reject</GhostButton>
                  </>
                )}
                {selected.status === 'APPROVED' && <PrimaryButton onClick={() => action(selected.id, 'checkin')} loading={actionLoading} className="flex-1 justify-center">Check In Customer</PrimaryButton>}
                {(selected.status === 'CHECKED_IN' || selected.status === 'IN_PROGRESS') && <PrimaryButton onClick={() => action(selected.id, 'complete')} loading={actionLoading} className="flex-1 justify-center">Mark Completed</PrimaryButton>}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Reject modal */}
      <AnimatePresence>
        {rejectingId && (
          <Modal open title="Reject Booking" onClose={() => setRejectingId(null)}>
            <div className="p-6 space-y-4">
              <p className="text-zinc-400 text-sm">Provide a reason — this will be emailed to the customer.</p>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Reason *</label>
                <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Payment screenshot unclear..."
                  className="w-full bg-[#14141c] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 resize-none transition-all" />
              </div>
              <div className="flex gap-3">
                <GhostButton onClick={() => setRejectingId(null)} className="flex-1 justify-center">Cancel</GhostButton>
                <button onClick={() => action(rejectingId, 'reject', rejectReason)} disabled={actionLoading}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40">
                  {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Screenshot Lightbox ── */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setLightboxUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Payment Screenshot</p>
                    <p className="text-zinc-500 text-xs">Zoom: scroll or pinch. Click outside to close.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={lightboxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-300 text-xs rounded-lg transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    Open Full Size
                  </a>
                  <button
                    onClick={() => setLightboxUrl(null)}
                    className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-red-600 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 flex items-center justify-center min-h-0">
                <img
                  src={lightboxUrl}
                  alt="Payment Screenshot"
                  className="max-w-full max-h-[75vh] object-contain"
                  onError={e => {
                    (e.currentTarget.parentElement!).innerHTML =
                      '<div class="text-zinc-500 text-sm p-8 text-center font-mono">Failed to load image.<br/>Link may have expired — close and reopen.</div>'
                  }}
                />
              </div>

              {/* Footer note */}
              <p className="text-center text-[10px] text-zinc-600 font-mono mt-2">
                Signed URL expires in 5 minutes for security
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
