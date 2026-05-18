'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Bell, ChevronDown, Menu, Settings, LogOut, X, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { alerts } from '@/lib/mock-data'
import { useSidebar } from '@/context/SidebarContext'
import { supabase } from '@/lib/supabase'

interface HeaderProps {
  title: string
  subtitle?: string
}

const ALERT_ICONS: Record<string, string> = {
  pagamento: '💳',
  performance: '📉',
  contrato: '📄',
  tarefa: '✅',
  sistema: 'ℹ️',
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  const { setMobileOpen } = useSidebar()
  const router = useRouter()

  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const unreadAlerts = alerts.filter(a => !a.read && !readIds.has(a.id))
  const unreadCount = unreadAlerts.length

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function markAllRead() {
    setReadIds(new Set(alerts.map(a => a.id)))
  }

  return (
    <header
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        fontFamily: "'Inter', system-ui, sans-serif",
        position: 'relative',
        zIndex: 20,
      }}
      className="flex items-center justify-between px-4 lg:px-6 py-4 flex-shrink-0 gap-3"
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex lg:hidden flex-shrink-0"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: 4, display: 'flex', alignItems: 'center' }}
      >
        <Menu size={22} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: 22, color: 'var(--text)', lineHeight: 1.2 }} className="truncate">
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }} className="truncate hidden sm:block">{subtitle}</p>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search — hidden on small screens */}
        <div
          style={{ border: `1px solid ${searchFocused ? '#F25BA5' : 'var(--border-2)'}`, background: 'var(--bg-2)', transition: 'border-color 0.15s' }}
          className="relative hidden md:flex items-center rounded-2xl overflow-hidden"
        >
          <Search size={14} style={{ color: 'var(--text-4)', position: 'absolute', left: 10 }} />
          <input
            type="text"
            placeholder="Buscar..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{ background: 'transparent', border: 'none', outline: 'none', paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, fontSize: 13, color: 'var(--text)', width: 160 }}
          />
        </div>

        {/* ── Notifications ──────────────────────────── */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setNotifOpen(v => !v); setProfileOpen(false) }}
            style={{
              position: 'relative', background: notifOpen ? '#FBD0DA' : 'var(--bg-2)',
              border: '1px solid var(--border)', color: 'var(--text)',
              borderRadius: 12, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4, background: '#EE3528', color: '#fff',
                fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg)',
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16,
              boxShadow: '0 8px 32px var(--shadow)', width: 320, zIndex: 100,
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border-3)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                  Notificações
                  {unreadCount > 0 && (
                    <span style={{ marginLeft: 8, background: '#fee2e2', color: '#dc2626', fontSize: 10, padding: '2px 6px', borderRadius: 999, fontWeight: 700 }}>{unreadCount}</span>
                  )}
                </span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#F25BA5', fontWeight: 600 }}>
                    Marcar tudo lido
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {alerts.slice(0, 6).map(alert => {
                  const isRead = alert.read || readIds.has(alert.id)
                  return (
                    <div
                      key={alert.id}
                      onClick={() => setReadIds(prev => new Set([...prev, alert.id]))}
                      style={{
                        padding: '12px 16px', borderBottom: '1px solid var(--border-3)',
                        background: isRead ? 'var(--bg)' : 'rgba(242,91,165,0.04)',
                        cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>
                        {ALERT_ICONS[alert.type] || 'ℹ️'}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: isRead ? 400 : 600, color: 'var(--text)', lineHeight: 1.4 }}>{alert.message}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>{alert.clientName}</p>
                      </div>
                      {!isRead && (
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#F25BA5', flexShrink: 0, marginTop: 4 }} />
                      )}
                    </div>
                  )
                })}
                {alerts.length === 0 && (
                  <p style={{ padding: '20px 16px', fontSize: 13, color: 'var(--text-4)', textAlign: 'center' }}>Nenhuma notificação</p>
                )}
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-3)' }}>
                <Link href="/configuracoes" onClick={() => setNotifOpen(false)} style={{ fontSize: 12, color: '#F25BA5', fontWeight: 600, textDecoration: 'none' }}>
                  Configurar alertas →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Profile ────────────────────────────────── */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setProfileOpen(v => !v); setNotifOpen(false) }}
            style={{
              background: profileOpen ? '#FBD0DA' : 'var(--bg-2)',
              border: '1px solid var(--border)', borderRadius: 12,
              padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: 'var(--text)', cursor: 'pointer',
            }}
          >
            <div style={{ background: '#F25BA5', color: '#FFFFFF', fontSize: 11, fontWeight: 700, width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              RN
            </div>
            <span style={{ fontWeight: 500 }} className="hidden sm:inline">Rhania</span>
            <ChevronDown size={12} style={{ opacity: 0.5, transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>

          {profileOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16,
              boxShadow: '0 8px 32px var(--shadow)', width: 220, zIndex: 100,
              overflow: 'hidden',
            }}>
              {/* User info */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-3)', background: 'var(--bg-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#F25BA5', color: '#FFFFFF', fontSize: 13, fontWeight: 700, width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    RN
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Rhania Nogueira</p>
                    <p style={{ fontSize: 11, color: 'var(--text-2)' }}>Admin</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div style={{ padding: '8px 0' }}>
                <Link
                  href="/configuracoes"
                  onClick={() => setProfileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 13, color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:bg-[#F5F4F2] transition-colors"
                >
                  <Settings size={14} style={{ opacity: 0.6 }} />
                  Configurações
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 13, color: '#EE3528', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontWeight: 500, fontFamily: "'Inter', system-ui, sans-serif" }}
                  className="hover:bg-[#fee2e2] transition-colors"
                >
                  <LogOut size={14} />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
