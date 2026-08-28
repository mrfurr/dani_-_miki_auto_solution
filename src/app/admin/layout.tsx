"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard, CheckCircle, Calendar, Users, Package,
  Star, MessageSquare, FileText, CreditCard, Phone, Clock,
  Settings, LogOut, Menu, X, ChevronRight,
  Bell, Activity, PanelLeftClose
} from 'lucide-react'
import Image from 'next/image'
import logoImg from '@/assets/images/dm_car_logo_1787333016188.jpg'

interface AdminLayoutProps { children: React.ReactNode }
interface NavItem { id: string; label: string; icon: any; group: string }

const navItems: NavItem[] = [
  { id: '/admin',              label: 'Dashboard',  icon: LayoutDashboard, group: 'main'   },
  { id: '/admin/bookings',     label: 'Bookings',   icon: Calendar,        group: 'main'   },
  { id: '/admin/verification', label: 'Verify',     icon: CheckCircle,     group: 'main'   },
  { id: '/admin/mechanics',    label: 'Mechanics',  icon: Users,           group: 'manage' },
  { id: '/admin/packages',     label: 'Packages',   icon: Package,         group: 'manage' },
  { id: '/admin/reviews',      label: 'Reviews',    icon: Star,            group: 'manage' },
  { id: '/admin/messages',     label: 'Messages',   icon: MessageSquare,   group: 'manage' },
  { id: '/admin/content',      label: 'Content',    icon: FileText,        group: 'site'   },
  { id: '/admin/banks',        label: 'Banks',      icon: CreditCard,      group: 'site'   },
  { id: '/admin/contact',      label: 'Contact',    icon: Phone,           group: 'site'   },
  { id: '/admin/schedule',     label: 'Schedule',   icon: Clock,           group: 'site'   },
  { id: '/admin/settings',     label: 'Settings',   icon: Settings,        group: 'system' },
]

const groups = [
  { key: 'main',   label: 'Operations' },
  { key: 'manage', label: 'Management' },
  { key: 'site',   label: 'Website'    },
  { key: 'system', label: 'System'     },
]

const SIDEBAR_EXPANDED_W  = 240  // px
const SIDEBAR_COLLAPSED_W = 64   // px (icon-only rail)

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router   = useRouter()
  const pathname = usePathname()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading,        setIsLoading]       = useState(true)
  const [mounted,          setMounted]         = useState(false)
  const [mobileOpen,       setMobileOpen]      = useState(false)
  const [collapsed,        setCollapsed]       = useState(false)
  const [unread,           setUnread]          = useState(0)
  const [logoUrl,          setLogoUrl]         = useState<string>('')

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    setMounted(true)
    if (isLoginPage) { setIsLoading(false); return }

    // Load custom logo from settings
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { if (d.settings?.logo_url) setLogoUrl(d.settings.logo_url) })
      .catch(() => {})

    ;(async () => {
      try {
        const r = await fetch('/api/admin/auth/check')
        if (r.ok) {
          setIsAuthenticated(true)
          try {
            const md = await (await fetch('/api/admin/messages')).json()
            setUnread((md.messages || []).filter((m: any) => !m.isRead).length)
          } catch {}
        } else {
          router.push('/admin/login')
        }
      } catch {
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    })()
  }, [router, pathname, isLoginPage])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    router.push('/admin/login')
  }

  /* ── Loading / auth guards ── */
  if (!mounted || isLoading) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-[#030305] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-red-600/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-red-600/40 border-t-red-500 animate-spin" />
            <div className="absolute inset-2 rounded-xl overflow-hidden">
              <Image src={logoImg} alt="Logo" width={40} height={40} className="w-full h-full object-cover" priority />
            </div>          </div>
          <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase">Authenticating…</p>
        </div>
      </div>
    )
  }
  if (isLoginPage)     return <>{children}</>
  if (!isAuthenticated) return null

  const sideW = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W

  return (
    <div className="min-h-screen bg-[#030305] text-white flex">

      {/* ══════════════════════════════════════════
          DESKTOP SIDEBAR — collapsible
      ══════════════════════════════════════════ */}
      <motion.aside
        animate={{ width: sideW }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-[#08080d] border-r border-white/5 z-40 overflow-hidden"
        style={{ width: sideW }}
      >
        {/* ── Logo / toggle ── */}
        <div className="flex items-center border-b border-white/5 h-14 flex-shrink-0 px-3 gap-2">
          {/* Logo button — clicking this collapses/expands the sidebar */}
          <motion.button
            onClick={() => setCollapsed(c => !c)}
            whileTap={{ scale: 0.92 }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-red-500/50 transition-all"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Image
                src={logoImg}
                alt="Dani & Miki Auto Solution"
                width={36}
                height={36}
                className="w-full h-full object-cover rounded-xl"
                priority
              />
            )}
          </motion.button>

          {/* Brand text — fades out when collapsed */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="font-black text-sm text-white tracking-tight truncate">DM Admin</p>
                <p className="text-[10px] text-zinc-600 font-mono truncate">Dani &amp; Miki Portal</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse arrow — visible only when expanded */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCollapsed(true)}
                title="Collapse sidebar"
                className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all flex-shrink-0"
              >
                <PanelLeftClose className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {groups.map(group => {
            const items = navItems.filter(n => n.group === group.key)
            return (
              <div key={group.key} className="mb-4">
                {/* Group label — only when expanded */}
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest px-4 mb-1"
                    >
                      {group.label}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="space-y-0.5 px-2">
                  {items.map(item => {
                    const Icon    = item.icon
                    const isActive  = pathname === item.id
                    const hasUnread = item.id === '/admin/messages' && unread > 0

                    return (
                      <button
                        key={item.id}
                        onClick={() => router.push(item.id)}
                        title={collapsed ? item.label : undefined}
                        className={`w-full flex items-center rounded-xl text-sm font-medium transition-all duration-150 group relative
                          ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'}
                          ${isActive
                            ? 'bg-gradient-to-r from-red-600/20 to-red-600/5 text-white border border-red-600/30 shadow-[0_0_12px_rgba(220,38,38,0.1)]'
                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                          }`}
                      >
                        {/* Active left bar */}
                        {isActive && !collapsed && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-500 rounded-full" />
                        )}

                        {/* Icon */}
                        <div className="relative flex-shrink-0">
                          <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-red-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                          {/* Unread dot on icon in collapsed mode */}
                          {hasUnread && collapsed && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full" />
                          )}
                        </div>

                        {/* Label + unread badge — only when expanded */}
                        <AnimatePresence initial={false}>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex-1 text-left flex items-center justify-between overflow-hidden whitespace-nowrap"
                            >
                              {item.label}
                              {hasUnread && (
                                <span className="ml-2 w-5 h-5 bg-red-600 rounded-full text-[10px] font-bold flex items-center justify-center text-white flex-shrink-0">
                                  {unread > 9 ? '9+' : unread}
                                </span>
                              )}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* ── Footer ── */}
        <div className="px-2 py-3 border-t border-white/5 space-y-0.5 flex-shrink-0">
          <button
            onClick={() => router.push('/')}
            title={collapsed ? 'View Website' : undefined}
            className={`w-full flex items-center rounded-xl text-sm text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all
              ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'}`}
          >
            <Activity className="w-4 h-4 text-zinc-600 flex-shrink-0" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="whitespace-nowrap overflow-hidden">
                  View Website
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : undefined}
            className={`w-full flex items-center rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-600/10 transition-all
              ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'}`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="whitespace-nowrap overflow-hidden">
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* ══════════════════════════════════════════
          MOBILE TOP BAR
      ══════════════════════════════════════════ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#08080d]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5 text-zinc-300" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">DM Admin</span>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-600/20 transition-colors">
          <LogOut className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-72 h-full bg-[#08080d] border-r border-white/5 flex flex-col overflow-y-auto"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Image
                        src={logoImg}
                        alt="Dani & Miki Auto Solution"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        priority
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-black text-sm text-white">DM Admin</p>
                    <p className="text-[10px] text-zinc-600 font-mono">Dani &amp; Miki Portal</p>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile nav */}
              <nav className="flex-1 py-4 overflow-y-auto px-2">
                {groups.map(group => (
                  <div key={group.key} className="mb-4">
                    <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest px-3 mb-1">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {navItems.filter(n => n.group === group.key).map(item => {
                        const Icon    = item.icon
                        const isActive  = pathname === item.id
                        const hasUnread = item.id === '/admin/messages' && unread > 0
                        return (
                          <button
                            key={item.id}
                            onClick={() => { router.push(item.id); setMobileOpen(false) }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative
                              ${isActive
                                ? 'bg-gradient-to-r from-red-600/20 to-red-600/5 text-white border border-red-600/30'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                              }`}
                          >
                            {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-500 rounded-full" />}
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-red-400' : 'text-zinc-600'}`} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {hasUnread && (
                              <span className="w-5 h-5 bg-red-600 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                {unread > 9 ? '9+' : unread}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Mobile footer */}
              <div className="px-2 py-4 border-t border-white/5 space-y-0.5">
                <button onClick={() => { router.push('/'); setMobileOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all">
                  <Activity className="w-4 h-4 text-zinc-600" />
                  View Website
                </button>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-600/10 transition-all">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════ */}
      <motion.div
        animate={{ marginLeft: sideW }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:block flex-1 min-w-0"
        style={{ marginLeft: sideW }}
      >
        {/* Desktop top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#08080d]/60 backdrop-blur-xl sticky top-0 z-30 h-14">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-600">Admin</span>
            <ChevronRight className="w-3 h-3 text-zinc-700" />
            <span className="text-zinc-300 font-semibold">
              {navItems.find(n => n.id === pathname)?.label ?? 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-xs font-mono">Live</span>
            </div>
            {unread > 0 && (
              <button onClick={() => router.push('/admin/messages')}
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Bell className="w-4 h-4 text-zinc-400" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="p-4 lg:p-6 min-h-[calc(100vh-56px)]">
          {children}
        </div>
      </motion.div>

      {/* Mobile content (no sidebar offset on mobile) */}
      <div className="lg:hidden w-full pt-14 min-h-screen">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
