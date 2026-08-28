"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Star, Pin, PinOff, Trash2, Search, Eye, EyeOff, Info } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, Toast } from '@/components/admin/AdminUI'

interface Review {
  id: string
  customer: string
  email: string | null
  phone: string | null
  rating: number
  reviewText: string
  isPinned: boolean
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  mechanic: { name: string; specialization: string }
  createdAt: string
}

export default function AdminReviewsPage() {
  const [reviews,  setReviews]  = useState<Review[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState<'all' | 'visible' | 'hidden'>('all')
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/reviews')
      const d = await r.json()
      setReviews(d.reviews || [])
    } finally { setLoading(false) }
  }

  const togglePin = async (id: string, isPinned: boolean) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned: !isPinned }),
    })
    setSuccess(isPinned ? 'Review hidden from public page' : 'Review now visible on public page')
    setTimeout(() => setSuccess(''), 3000)
    load()
  }

  const del = async (id: string, customer: string) => {
    if (!confirm(`Permanently delete the review from "${customer}"? This cannot be undone.`)) return
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    setSuccess('Review permanently deleted')
    setTimeout(() => setSuccess(''), 3000)
    load()
  }

  const filtered = reviews.filter(r => {
    const matchSearch = !search ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(search.toLowerCase()) ||
      r.mechanic.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'visible' && r.isPinned) ||
      (filter === 'hidden' && !r.isPinned)
    return matchSearch && matchFilter
  })

  const visibleCount = reviews.filter(r => r.isPinned).length
  const hiddenCount  = reviews.filter(r => !r.isPinned).length

  return (
    <div className="space-y-5 max-w-5xl">
      <PageHeader
        title="Reviews"
        subtitle="All customer reviews — unpin to hide from public, delete to remove permanently"
      />

      <AnimatePresence>
        {success && <Toast message={success} type="success" onDismiss={() => setSuccess('')} />}
        {error   && <Toast message={error}   type="error"   onDismiss={() => setError('')}   />}
      </AnimatePresence>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/8 border border-blue-500/15 rounded-xl">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-300/80 leading-relaxed">
          <strong className="text-blue-300">Reviews go live immediately</strong> when customers submit them.
          {' '}<strong className="text-yellow-300">Unpin</strong> to hide an inappropriate review from the public page without deleting it.
          {' '}<strong className="text-red-300">Delete</strong> to permanently remove it from the system.
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-mono text-emerald-300">
          <Eye className="w-3.5 h-3.5" />
          <span>{visibleCount} visible on public</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/60 border border-white/8 rounded-xl text-xs font-mono text-zinc-400">
          <EyeOff className="w-3.5 h-3.5" />
          <span>{hiddenCount} hidden</span>
        </div>
        <div className="text-xs font-mono text-zinc-600 ml-1">{reviews.length} total reviews</div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer, mechanic or text…"
            className="w-full bg-[#0d0d14] border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {([['all', 'All'], ['visible', '👁 Visible'], ['hidden', '🚫 Hidden']] as const).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === v
                  ? 'bg-red-600 text-white'
                  : 'bg-[#0d0d14] border border-white/8 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState icon={Star} title="No reviews found" subtitle="Customer reviews appear here instantly after submission" />
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`rounded-2xl p-5 border transition-all ${
                r.isPinned
                  ? 'bg-[#0d0d14] border-white/8 hover:border-white/12'
                  : 'bg-[#0a0a10] border-white/5 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2 min-w-0">
                  {/* Header row */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-white">{r.customer}</span>
                    {r.isPinned ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Eye className="w-3 h-3" /> PUBLIC
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-700/50 border border-zinc-600/30 text-zinc-500">
                        <EyeOff className="w-3 h-3" /> HIDDEN
                      </span>
                    )}
                  </div>

                  {/* Stars + mechanic + date */}
                  <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700'}`} />
                      ))}
                    </div>
                    <span className="text-yellow-400 font-bold">{r.rating}/5</span>
                    <span>·</span>
                    <span className="text-red-400 font-medium">{r.mechanic.name}</span>
                    <span>·</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Review text */}
                  <p className="text-zinc-300 text-sm leading-relaxed">{r.reviewText}</p>

                  {/* Contact info */}
                  {(r.email || r.phone) && (
                    <p className="text-zinc-600 text-xs font-mono">{r.email}{r.phone ? ` · ${r.phone}` : ''}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePin(r.id, r.isPinned)}
                    title={r.isPinned ? 'Hide from public page' : 'Show on public page'}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      r.isPinned
                        ? 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/25 text-yellow-400'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/25 text-emerald-400'
                    }`}
                  >
                    {r.isPinned
                      ? <><PinOff className="w-3.5 h-3.5" /> Hide</>
                      : <><Pin className="w-3.5 h-3.5" /> Show</>}
                  </button>
                  <button
                    onClick={() => del(r.id, r.customer)}
                    title="Permanently delete this review"
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
