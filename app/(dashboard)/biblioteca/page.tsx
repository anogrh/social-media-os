'use client'

import { useState } from 'react'
import { Plus, ExternalLink } from 'lucide-react'
import Header from '@/components/layout/Header'
import { references } from '@/lib/mock-data'
import type { Reference } from '@/lib/types'

const TYPE_FILTERS = ['todos', 'design', 'copy', 'video', 'trend', 'campanha'] as const

const TYPE_STYLES: Record<string, { background: string; color: string; label: string }> = {
  design: { background: '#dbeafe', color: '#1d4ed8', label: 'Design' },
  copy: { background: '#FBD0DA', color: '#be185d', label: 'Copy' },
  video: { background: '#fee2e2', color: '#b91c1c', label: 'Vídeo' },
  trend: { background: '#F2F4A4', color: '#78716c', label: 'Trend' },
  campanha: { background: '#d1fae5', color: '#065f46', label: 'Campanha' },
}

export default function BibliotecaPage() {
  const [filterType, setFilterType] = useState<'todos' | Reference['type']>('todos')
  const [search, setSearch] = useState('')

  const filtered = references.filter(r => {
    const matchType = filterType === 'todos' || r.type === filterType
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some(t => t.includes(search.toLowerCase()))
    return matchType && matchSearch
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Referências" subtitle="Biblioteca de inspirações e referências" />

      <div className="page-pad" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar referências..."
            style={{ border: '1px solid var(--border-2)', borderRadius: 999, padding: '9px 16px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', width: 220 }}
          />

          {/* Type filters */}
          <div style={{ display: 'flex', gap: 6 }}>
            {TYPE_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                style={{
                  background: filterType === f ? '#FC75A0' : '#F5F4F2',
                  color: filterType === f ? '#FFFFFF' : '#292929',
                  border: `1px solid ${filterType === f ? '#FC75A0' : 'var(--border)'}`,
                  borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
                }}
              >
                {f === 'todos' ? 'Todos' : TYPE_STYLES[f]?.label || f}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />
          <button style={{ background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, padding: '9px 18px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> Adicionar referência
          </button>
        </div>

        {/* Grid */}
        <div className="rg-3" style={{ gap: 16 }}>
          {filtered.map(ref => {
            const typeStyle = TYPE_STYLES[ref.type] || { background: '#f3f4f6', color: '#374151', label: ref.type }
            return (
              <div
                key={ref.id}
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}
                className="hover:shadow-md transition-shadow"
              >
                {/* Thumbnail placeholder */}
                <div style={{ height: 120, background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: typeStyle.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 20 }}>
                      {ref.type === 'design' ? '🎨' : ref.type === 'copy' ? '✍️' : ref.type === 'video' ? '🎬' : ref.type === 'trend' ? '📈' : '🚀'}
                    </span>
                  </div>
                  <span style={{ ...typeStyle, position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>
                    {typeStyle.label}
                  </span>
                </div>

                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6, lineHeight: 1.3 }}>{ref.title}</p>
                  {ref.description && (
                    <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                      {ref.description}
                    </p>
                  )}

                  {/* Tags */}
                  {ref.tags && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                      {ref.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ background: 'var(--bg-2)', color: 'var(--text-2)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{ref.category}</span>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#FC75A0', textDecoration: 'none' }}
                      className="hover:underline"
                    >
                      Abrir <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 15, color: 'var(--text-4)' }}>Nenhuma referência encontrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}
