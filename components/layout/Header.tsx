'use client'

import { useState } from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { alerts } from '@/lib/mock-data'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  const unreadCount = alerts.filter(a => !a.read).length

  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid rgba(31,27,26,0.10)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
      className="flex items-center justify-between px-6 py-4 flex-shrink-0"
    >
      {/* Title */}
      <div>
        <h1
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: 22, color: '#1F1B1A', lineHeight: 1.2 }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'rgba(31,27,26,0.5)', marginTop: 2 }}>{subtitle}</p>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          style={{
            border: `1px solid ${searchFocused ? '#F25BA5' : 'rgba(31,27,26,0.15)'}`,
            background: '#F5F4F2',
            transition: 'border-color 0.15s',
          }}
          className="relative flex items-center rounded-2xl overflow-hidden"
        >
          <Search size={14} style={{ color: 'rgba(31,27,26,0.4)', position: 'absolute', left: 10 }} />
          <input
            type="text"
            placeholder="Buscar clientes, tarefas..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              paddingLeft: 32,
              paddingRight: 12,
              paddingTop: 7,
              paddingBottom: 7,
              fontSize: 13,
              color: '#1F1B1A',
              width: 220,
            }}
          />
        </div>

        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            background: '#F5F4F2',
            border: '1px solid rgba(31,27,26,0.12)',
            color: '#1F1B1A',
            borderRadius: 12,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hover:bg-[#FBD0DA] transition-colors"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                background: '#EE3528',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                minWidth: 16,
                height: 16,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <button
          style={{
            background: '#F5F4F2',
            border: '1px solid rgba(31,27,26,0.12)',
            borderRadius: 12,
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: '#1F1B1A',
          }}
          className="hover:bg-[#FBD0DA] transition-colors"
        >
          <div
            style={{ background: '#F25BA5', color: '#FFFFFF', fontSize: 11, fontWeight: 700, width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            RN
          </div>
          <span style={{ fontWeight: 500 }}>Rhania</span>
          <ChevronDown size={12} style={{ opacity: 0.5 }} />
        </button>
      </div>
    </header>
  )
}
