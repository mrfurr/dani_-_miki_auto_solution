"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import {
  Calendar, Clock, CheckCircle, Users, Star, MessageSquare,
  TrendingUp, DollarSign, ArrowRight, Activity, Zap, Shield,
  AlertCircle, BarChart2
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { PageHeader, StatCard, Card, Badge, Spinner, bookingStatusBadge } from '@/components/admin/AdminUI'

// Lazy-load recharts — prevents it from blocking admin bundle compilation
const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false })
const AreaChart           = dynamic(() => import('recharts').then(m => ({ default: m.AreaChart })),           { ssr: false })
const Area                = dynamic(() => import('recharts').then(m => ({ default: m.Area })),                { ssr: false })
const XAxis               = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })),               { ssr: false })
const YAxis               = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })),               { ssr: false })
const CartesianGrid       = dynamic(() => import('recharts').then(m => ({ default: m.CartesianGrid })),       { ssr: false })
const Tooltip             = dynamic(() => import('recharts').then(m => ({ default: m.Tooltip })),             { ssr: false })
const PieChart            = dynamic(() => import('recharts').then(m => ({ default: m.PieChart })),            { ssr: false })
const Pie                 = dynamic(() => import('recharts').then(m => ({ default: m.Pie })),                 { ssr: false })
const Cell                = dynamic(() => import('recharts').then(m => ({ default: m.Cell })),                { ssr: false })

interface Stats {
  todayBookings: number
  pendingVerification: number
  approved: number
  checkedIn: number
  completed: number
  totalCustomers: number
  totalReviews: number
  unreadMessages: number
  totalRevenue: number
  totalMechanics: number
}

const PIE_COLORS = ['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#6b7280']

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [trendData, setTrendData] = useState<{day:string;v:number}[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [sRes, bRes, tRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/bookings'),
        fetch('/api/admin/dashboard/trend'),
      ])
      if (sRes.ok) setStats(await sRes.json())
      if (bRes.ok) {
        const d = await bRes.json()
        setBookings((d.bookings || []).slice(0, 6))
      }
      if (tRes.ok) {
        const d = await tRes.json()
        setTrendData(d.trend || [])
      }
    } finally { setLoading(false) }
  }

  // Build pie data from real stats
  const pieData = stats ? [
    { name: 'Pending',    value: stats.pendingVerification },
    { name: 'Approved',   value: stats.approved },
    { name: 'Checked In', value: stats.checkedIn },
    { name: 'Completed',  value: stats.completed },
  ].filter(d => d.value > 0) : []

  if (loading) return <Spinner />

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — here's what's happening today"
        action={
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 text-xs font-mono font-bold">SYSTEM ONLINE</span>
          </div>
        }
      />

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Today's Bookings", value: stats?.todayBookings ?? 0, icon: Calendar, color: 'red' as const },
          { label: 'Pending Verify',   value: stats?.pendingVerification ?? 0, icon: Clock,     color: 'yellow' as const },
          { label: 'Approved',         value: stats?.approved ?? 0,            icon: CheckCircle,color: 'green' as const },
          { label: 'Checked In',       value: stats?.checkedIn ?? 0,           icon: Users,      color: 'blue' as const },
          { label: 'Completed',        value: stats?.completed ?? 0,           icon: TrendingUp, color: 'purple' as const },
          { label: 'Active Mechanics', value: stats?.totalMechanics ?? 0,      icon: Shield,     color: 'red' as const },
          { label: 'Unread Messages',  value: stats?.unreadMessages ?? 0,      icon: MessageSquare, color: 'yellow' as const },
          { label: 'Total Reviews',    value: stats?.totalReviews ?? 0,        icon: Star,       color: 'green' as const },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* ── Charts + recent ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Trend chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-white text-sm">Booking Trend</p>
              <p className="text-zinc-600 text-xs">Last 7 days</p>
            </div>
            <BarChart2 className="w-4 h-4 text-zinc-600" />
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="day" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0d0d14', border: '1px solid #ffffff10', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} fill="url(#grad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Status breakdown */}
        <Card className="p-5">
          <p className="font-bold text-white text-sm mb-1">Status Breakdown</p>
          <p className="text-zinc-600 text-xs mb-4">All bookings</p>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-zinc-400">{d.name}</span>
                    </div>
                    <span className="font-bold text-zinc-300">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">No booking data yet</div>
          )}
        </Card>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20',
            title: 'Review Pending', desc: `${stats?.pendingVerification ?? 0} bookings need verification`,
            action: () => router.push('/admin/bookings')
          },
          {
            icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20',
            title: 'Verify Check-ins', desc: 'Scan customer booking codes',
            action: () => router.push('/admin/verification')
          },
          {
            icon: MessageSquare, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20',
            title: 'Inbox', desc: `${stats?.unreadMessages ?? 0} unread messages`,
            action: () => router.push('/admin/messages')
          },
        ].map((qa, i) => (
          <motion.button
            key={i}
            onClick={qa.action}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border text-left hover:brightness-110 transition-all group ${qa.bg}`}
          >
            <div className={`p-2.5 rounded-xl bg-white/5 ${qa.color}`}>
              <qa.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">{qa.title}</p>
              <p className={`text-xs mt-0.5 ${qa.color}`}>{qa.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
          </motion.button>
        ))}
      </div>

      {/* ── Recent bookings ── */}
      {bookings.length > 0 && (
        <Card>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <p className="font-bold text-white text-sm">Recent Bookings</p>
            <button onClick={() => router.push('/admin/bookings')}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => router.push('/admin/bookings')}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-black text-red-400">#{b.internalId}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{b.customerName}</p>
                  <p className="text-zinc-500 text-xs truncate">{b.package?.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-zinc-300 text-xs font-mono">{b.date}</p>
                  <p className="text-zinc-600 text-xs">{b.time}</p>
                </div>
                <div className="flex-shrink-0">
                  {bookingStatusBadge(b.status)}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
