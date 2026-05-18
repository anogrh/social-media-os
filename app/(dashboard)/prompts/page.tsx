'use client'

import { useState } from 'react'
import { Plus, Copy, Check } from 'lucide-react'
import Header from '@/components/layout/Header'
import { prompts } from '@/lib/mock-data'

const CATEGORY_STYLES: Record<string, { background: string; color: string }> = {
  'Copy Instagram': { background: '#FBD0DA', color: '#be185d' },
  'Roteiros': { background: '#fee2e2', color: '#b91c1c' },
  'Relatórios': { background: '#dbeafe', color: '#1d4ed8' },
  'Estratégia': { background: '#d1fae5', color: '#065f46' },
  'Comunidade': { background: '#F2F4A4', color: '#78716c' },
}

export default function PromptsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('todos')

  const categories = ['todos', ...Array.from(new Set(prompts.map(p => p.category)))]

  const filtered = prompts.filter(p =>
    filterCategory === 'todos' || p.category === filterCategory
  )

  const grouped = filtered.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {} as Record<string, typeof prompts>)

  async function copyPrompt(id: string, content: string) {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Prompts IA" subtitle="Biblioteca de prompts para agilizar sua operação" />

      <div className="page-pad" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  background: filterCategory === cat ? '#F25BA5' : '#F5F4F2',
                  color: filterCategory === cat ? '#FFFFFF' : '#1F1B1A',
                  border: `1px solid ${filterCategory === cat ? '#F25BA5' : 'var(--border)'}`,
                  borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {cat === 'todos' ? 'Todos' : cat}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button style={{ background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, padding: '9px 18px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} /> Novo prompt
          </button>
        </div>

        {/* Grouped prompts */}
        {Object.entries(grouped).map(([category, categoryPrompts]) => {
          const catStyle = CATEGORY_STYLES[category] || { background: '#f3f4f6', color: '#374151' }

          return (
            <div key={category} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ ...catStyle, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>{category}</span>
                <span style={{ fontSize: 12, color: 'var(--text-4)' }}>{categoryPrompts.length} prompts</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {categoryPrompts.map(prompt => (
                  <div
                    key={prompt.id}
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{prompt.name}</p>
                          {prompt.tags && (
                            <div style={{ display: 'flex', gap: 4 }}>
                              {prompt.tags.slice(0, 2).map(tag => (
                                <span key={tag} style={{ background: 'var(--bg-2)', color: 'var(--text-2)', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999 }}>
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <p style={{
                          fontSize: 13,
                          color: 'var(--text-2)',
                          lineHeight: 1.6,
                          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                          background: 'var(--bg-2)',
                          borderRadius: 8,
                          padding: '10px 12px',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical' as any,
                        }}>
                          {prompt.content}
                        </p>
                      </div>

                      <button
                        onClick={() => copyPrompt(prompt.id, prompt.content)}
                        style={{
                          background: copiedId === prompt.id ? '#d1fae5' : '#F5F4F2',
                          color: copiedId === prompt.id ? '#10B981' : '#1F1B1A',
                          border: `1px solid ${copiedId === prompt.id ? '#10B981' : 'var(--border)'}`,
                          borderRadius: 999,
                          padding: '8px 16px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          flexShrink: 0,
                          transition: 'all 0.2s',
                        }}
                      >
                        {copiedId === prompt.id ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> Copiar</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
