"use client"
// Shared admin UI primitives — used across all admin pages

import { motion } from 'motion/react'
import { ReactNode } from 'react'
import { Check, AlertCircle, X } from 'lucide-react'

// ─── Page Header ─────────────────────────────────────────────────────────────
export function PageHeader({
  title, subtitle, action
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-zinc-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({
  label, value, icon: Icon, color = 'red', trend
}: {
  label: string
  value: string | number
  icon: any
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'zinc'
  trend?: string
}) {
  const colors = {
    red:    'from-red-600/20 to-red-600/5 border-red-600/20 text-red-400',
    green:  'from-emerald-600/20 to-emerald-600/5 border-emerald-600/20 text-emerald-400',
    blue:   'from-blue-600/20 to-blue-600/5 border-blue-600/20 text-blue-400',
    yellow: 'from-yellow-600/20 to-yellow-600/5 border-yellow-600/20 text-yellow-400',
    purple: 'from-purple-600/20 to-purple-600/5 border-purple-600/20 text-purple-400',
    zinc:   'from-zinc-600/20 to-zinc-600/5 border-zinc-600/20 text-zinc-400',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0d0d14] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br border ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && <span className="text-xs text-zinc-600 font-mono">{trend}</span>}
      </div>
      <p className="text-2xl font-black text-white tracking-tight">{value}</p>
      <p className="text-xs text-zinc-500 mt-1 font-medium">{label}</p>
    </motion.div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0d0d14] border border-white/5 rounded-2xl ${className}`}>
      {children}
    </div>
  )
}

// ─── Primary Button ──────────────────────────────────────────────────────────
export function PrimaryButton({
  onClick, children, disabled, loading, className = ''
}: {
  onClick?: () => void
  children: ReactNode
  disabled?: boolean
  loading?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,38,38,0.25)] hover:shadow-[0_0_28px_rgba(220,38,38,0.4)] active:scale-95 ${className}`}
    >
      {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  )
}

// ─── Ghost Button ────────────────────────────────────────────────────────────
export function GhostButton({
  onClick, children, className = '', variant = 'default'
}: {
  onClick?: () => void
  children: ReactNode
  className?: string
  variant?: 'default' | 'danger'
}) {
  const v = variant === 'danger'
    ? 'hover:bg-red-600/15 hover:text-red-400 text-zinc-400'
    : 'hover:bg-white/8 text-zinc-400 hover:text-zinc-200'
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 border border-white/8 rounded-xl text-sm font-medium transition-all active:scale-95 ${v} ${className}`}
    >
      {children}
    </button>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────
export function Input({
  label, value, onChange, placeholder, type = 'text', required, className = ''
}: {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#14141c] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10 transition-all"
      />
    </div>
  )
}

// ─── Textarea ────────────────────────────────────────────────────────────────
export function Textarea({
  label, value, onChange, placeholder, rows = 3, required, className = ''
}: {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  required?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#14141c] border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10 transition-all resize-none"
      />
    </div>
  )
}

// ─── Status Badge ────────────────────────────────────────────────────────────
export function Badge({
  color, children
}: {
  color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'zinc'
  children: ReactNode
}) {
  const colors = {
    green:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    red:    'bg-red-500/10 text-red-400 border-red-500/25',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25',
    blue:   'bg-blue-500/10 text-blue-400 border-blue-500/25',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    zinc:   'bg-zinc-500/10 text-zinc-400 border-zinc-500/25',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  )
}

// ─── Toast (success / error) ─────────────────────────────────────────────────
export function Toast({
  message, type, onDismiss
}: {
  message: string
  type: 'success' | 'error'
  onDismiss?: () => void
}) {
  if (!message) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
        type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
          : 'bg-red-500/10 border-red-500/25 text-red-300'
      }`}
    >
      {type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="opacity-60 hover:opacity-100 transition-opacity">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export function Modal({
  open, onClose, title, children, maxWidth = 'max-w-lg'
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: string
}) {
  if (!open) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96 }}
        transition={{ type: 'spring', damping: 28, stiffness: 400 }}
        onClick={e => e.stopPropagation()}
        className={`bg-[#0d0d14] border border-white/8 rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-bold text-white text-lg">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-500 hover:text-zinc-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

// ─── Table ───────────────────────────────────────────────────────────────────
export function Table({
  headers, children, empty = 'No data found'
}: {
  headers: string[]
  children: ReactNode
  empty?: string
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {headers.map((h, i) => (
              <th key={i} className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3 first:pl-6 last:pr-6">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function TR({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-white/[0.04] ${onClick ? 'cursor-pointer hover:bg-white/[0.03]' : 'hover:bg-white/[0.02]'} transition-colors`}
    >
      {children}
    </tr>
  )
}

export function TD({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3.5 first:pl-6 last:pr-6 text-zinc-300 ${className}`}>
      {children}
    </td>
  )
}

// ─── Loading spinner ─────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-red-600/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 animate-spin" />
      </div>
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-zinc-600" />
      </div>
      <p className="font-semibold text-zinc-400 mb-1">{title}</p>
      {subtitle && <p className="text-zinc-600 text-sm">{subtitle}</p>}
    </div>
  )
}

// ─── Booking status helper ────────────────────────────────────────────────────
export function bookingStatusBadge(status: string) {
  switch (status) {
    case 'PENDING_VERIFICATION': return <Badge color="yellow">Pending</Badge>
    case 'APPROVED':             return <Badge color="green">Approved</Badge>
    case 'CHECKED_IN':           return <Badge color="blue">Checked In</Badge>
    case 'IN_PROGRESS':          return <Badge color="purple">In Progress</Badge>
    case 'COMPLETED':            return <Badge color="zinc">Completed</Badge>
    case 'REJECTED':             return <Badge color="red">Rejected</Badge>
    default:                     return <Badge color="zinc">{status}</Badge>
  }
}
