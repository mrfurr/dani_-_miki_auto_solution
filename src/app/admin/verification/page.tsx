"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, CheckCircle, User, Calendar, CreditCard, QrCode } from 'lucide-react'
import { PageHeader, PrimaryButton, Card, Toast, Spinner, bookingStatusBadge } from '@/components/admin/AdminUI'

interface Booking {
  id: string; internalId: number; bookingCode: string | null
  customerName: string; customerPhone: string; customerEmail: string
  package: { name: string }; date: string; time: string
  depositAmount: number; status: string
  approvedAt: string | null; checkedInAt: string | null
}

export default function AdminVerificationPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'code'|'phone'|'email'|'name'>('code')
  const [searching, setSearching] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [checking, setChecking] = useState(false)

  const search = async () => {
    if (!query.trim()) { setError('Enter a search term'); return }
    setSearching(true); setError(''); setBooking(null)
    try {
      const p = new URLSearchParams()
      p.set(type, query)
      const r = await fetch(`/api/admin/verification?${p}`)
      const d = await r.json()
      if (r.ok) setBooking(d.booking)
      else setError(d.error || 'Booking not found')
    } catch { setError('Search failed') } finally { setSearching(false) }
  }

  const checkIn = async () => {
    if (!booking) return
    setChecking(true)
    try {
      const r = await fetch(`/api/admin/bookings/${booking.id}/checkin`, { method: 'POST' })
      if (r.ok) { setSuccess('Customer checked in successfully'); search() }
      else setError('Check-in failed')
    } finally { setChecking(false) }
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader title="Verification" subtitle="Search and check in customers by booking code or contact" />

      <AnimatePresence>
        {success && <Toast message={success} type="success" onDismiss={() => setSuccess('')} />}
        {error && <Toast message={error} type="error" onDismiss={() => setError('')} />}
      </AnimatePresence>

      {/* Search */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={type} onChange={e => setType(e.target.value as any)}
            className="bg-[#14141c] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all sm:w-44">
            <option value="code">Booking Code</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="name">Name</option>
          </select>
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder={type === 'code' ? 'DM-XXXX-XXXX' : `Enter ${type}...`}
              className="w-full bg-[#14141c] border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all" />
          </div>
          <PrimaryButton onClick={search} loading={searching}>
            <Search className="w-4 h-4" /> Search
          </PrimaryButton>
        </div>
      </Card>

      {/* Result */}
      <AnimatePresence>
        {booking && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              {/* Status bar */}
              <div className={`px-6 py-3 rounded-t-2xl border-b border-white/5 flex items-center justify-between ${
                booking.status === 'APPROVED' ? 'bg-emerald-500/10' :
                booking.status === 'CHECKED_IN' ? 'bg-blue-500/10' :
                booking.status === 'COMPLETED' ? 'bg-zinc-800/60' : 'bg-red-500/10'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  {bookingStatusBadge(booking.status)}
                </div>
                {booking.bookingCode && (
                  <span className="font-mono font-black text-white text-lg tracking-widest">{booking.bookingCode}</span>
                )}
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Customer */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5"><User className="w-3 h-3" /> Customer</p>
                  <p className="font-bold text-white">{booking.customerName}</p>
                  <p className="text-zinc-400 text-sm">{booking.customerPhone}</p>
                  <p className="text-zinc-500 text-xs">{booking.customerEmail}</p>
                </div>
                {/* Service */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Appointment</p>
                  <p className="font-semibold text-white text-sm">{booking.package.name}</p>
                  <p className="text-zinc-400 text-sm">{booking.date} at {booking.time}</p>
                </div>
                {/* Payment */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5"><CreditCard className="w-3 h-3" /> Deposit</p>
                  <p className="font-bold text-white text-xl">{booking.depositAmount} <span className="text-sm text-zinc-500">ETB</span></p>
                  {booking.approvedAt && <p className="text-zinc-500 text-xs">Approved {new Date(booking.approvedAt).toLocaleDateString()}</p>}
                  {booking.checkedInAt && <p className="text-zinc-500 text-xs">Checked in {new Date(booking.checkedInAt).toLocaleDateString()}</p>}
                </div>
              </div>

              {/* Action */}
              {booking.status === 'APPROVED' && (
                <div className="px-6 pb-6">
                  <PrimaryButton onClick={checkIn} loading={checking} className="w-full justify-center py-3 text-base">
                    <CheckCircle className="w-5 h-5" /> Check In Customer
                  </PrimaryButton>
                </div>
              )}
              {booking.status === 'CHECKED_IN' && (
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" /> Customer is checked in and in service
                  </div>
                </div>
              )}
              {booking.status === 'COMPLETED' && (
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/60 border border-white/5 rounded-xl text-zinc-400 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" /> Service completed
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      {!booking && !error && (
        <Card className="p-5">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Quick Tips</p>
          <div className="space-y-2">
            {['Fastest: use the DM-XXXX-XXXX booking code', 'Alternative: phone number, email, or customer name', 'Only APPROVED bookings can be checked in'].map((t, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-zinc-500">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500/60 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
