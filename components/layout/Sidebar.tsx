'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Users, CalendarDays, CheckSquare,
  DollarSign, FileText, Lightbulb, BarChart, Library, MessageSquare,
  ChevronLeft, ChevronRight, Camera, Sparkles, Settings, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const navGroups = [
  {
    label: 'Visão geral',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Clientes',
    items: [
      { href: '/clientes', label: 'Clientes', icon: Users },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { href: '/instagram', label: 'Instagram', icon: Camera },
    ],
  },
  {
    label: 'Produção',
    items: [
      { href: '/calendario', label: 'Calendário editorial', icon: CalendarDays },
      { href: '/tarefas', label: 'Tarefas', icon: CheckSquare },
    ],
  },
  {
    label: 'Negócios',
    items: [
      { href: '/financeiro', label: 'Financeiro', icon: DollarSign },
      { href: '/contratos', label: 'Contratos', icon: FileText },
    ],
  },
  {
    label: 'Estratégia',
    items: [
      { href: '/estrategia', label: 'Estratégia', icon: Lightbulb },
      { href: '/relatorios', label: 'Relatórios', icon: BarChart },
    ],
  },
  {
    label: 'Biblioteca',
    items: [
      { href: '/biblioteca', label: 'Referências', icon: Library },
      { href: '/prompts', label: 'Prompts IA', icon: MessageSquare },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside
      style={{ background: '#F5F4F2', borderRight: '1px solid rgba(31,27,26,0.10)' }}
      className={cn(
        'relative flex flex-col h-screen transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div
        style={{ borderBottom: '1px solid rgba(31,27,26,0.10)' }}
        className="flex items-center gap-2 px-4 py-5 flex-shrink-0"
      >
        <div
          style={{ background: '#F25BA5', color: '#FFFFFF' }}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        >
          <Sparkles size={14} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1F1B1A', fontWeight: 600, fontSize: 18, lineHeight: 1 }}
            >
              rhania.
            </span>
            <span
              style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#1F1B1A', fontSize: 11, display: 'block', opacity: 0.5, letterSpacing: '0.08em', marginTop: 1 }}
            >
              araújo
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p
                style={{ fontFamily: "'Inter', system-ui, sans-serif", color: 'rgba(31,27,26,0.4)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}
                className="px-3 mb-1"
              >
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  style={{
                    borderLeft: active ? '2px solid #F25BA5' : '2px solid transparent',
                    color: active ? '#F25BA5' : '#1F1B1A',
                    background: active ? 'rgba(242,91,165,0.07)' : 'transparent',
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-r-lg transition-all mb-0.5',
                    !active && 'hover:bg-black/5'
                  )}
                >
                  <item.icon size={16} className="flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      {!collapsed && (
        <div
          style={{ borderTop: '1px solid rgba(31,27,26,0.10)', fontFamily: "'Inter', system-ui, sans-serif" }}
          className="px-4 py-3 flex items-center gap-3"
        >
          <div
            style={{ background: '#F25BA5', color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          >
            RN
          </div>
          <div className="overflow-hidden flex-1">
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1F1B1A' }} className="truncate">Rhania Nogueira</p>
            <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.5)' }} className="truncate">Admin</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(31,27,26,0.4)', padding: 4, borderRadius: 6, flexShrink: 0 }}
            className="hover:text-[#F25BA5] transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      )}

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{ background: '#F5F4F2', border: '1px solid rgba(31,27,26,0.12)', color: '#1F1B1A' }}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#F25BA5] hover:text-white hover:border-[#F25BA5] transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
