'use client'

import { useState } from 'react'
import { Plus, Copy, Check, X, Trash2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import { usePrompts } from '@/context/PromptsContext'

const CATEGORY_STYLES: Record<string, { background: string; color: string }> = {
  'Copy Instagram': { background: '#FBD0DA', color: '#be185d' },
  'Roteiros': { background: '#fee2e2', color: '#b91c1c' },
  'Relatórios': { background: '#dbeafe', color: '#1d4ed8' },
  'Estratégia': { background: '#d1fae5', color: '#065f46' },
  'Comunidade': { background: '#F2F4A4', color: '#78716c' },
}

const emptyForm = { name: '', category: '', content: '', tags: '' }

export default function PromptsPage() {
  const { prompts, addPrompt, deletePrompt, isReady } = usePrompts()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const font = "'Inter', system-ui, sans-serif"

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

  async function handleAdd() {
    if (!form.name.trim() || !form.category.trim() || !form.content.trim()) return
    await addPrompt({
      name: form.name,
      category: form.category,
      content: form.content,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    })
    setForm(emptyForm)
    setShowModal(false)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Prompts IA" subtitle="Biblioteca de prompts para agilizar sua operação" />

      <div className="page-pad" style={{ fontFamily: font }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  background: filterCategory === cat ? '#FC75A0' : '#F5F4F2',
                  color: filterCategory === cat ? '#FFFFFF' : '#292929',
                  border: `1px solid ${filterCategory === cat ? '#FC75A0' : 'var(--border)'}`,
                  borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {cat === 'todos' ? 'Todos' : cat}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, padding: '9px 18px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> Novo prompt
          </button>
        </div>

        {!isReady && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 14, color: 'var(--text-4)' }}>Carregando prompts...</p>
          </div>
        )}

        {/* Grouped prompts */}
        {Object.entries(grouped).map(([category, categoryPrompts]) => {
          const catStyle = CATEGORY_STYLES[category] || { background: 'var(--bg-3)', color: 'var(--text)' }

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
                          WebkitBoxOrient: 'vertical' as never,
                        }}>
                          {prompt.content}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={() => copyPrompt(prompt.id, prompt.content)}
                          style={{
                            background: copiedId === prompt.id ? '#d1fae5' : '#F5F4F2',
                            color: copiedId === prompt.id ? '#10B981' : '#292929',
                            border: `1px solid ${copiedId === prompt.id ? '#10B981' : 'var(--border)'}`,
                            borderRadius: 999,
                            padding: '8px 16px',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.2s',
                          }}
                        >
                          {copiedId === prompt.id ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> Copiar</>}
                        </button>
                        <button
                          onClick={() => deletePrompt(prompt.id)}
                          style={{
                            background: 'none',
                            color: 'var(--text-4)',
                            border: '1px solid var(--border)',
                            borderRadius: 999,
                            padding: '8px 16px',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.2s',
                          }}
                        >
                          <Trash2 size={13} /> Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && isReady && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 15, color: 'var(--text-4)' }}>Nenhum prompt encontrado.</p>
          </div>
        )}
      </div>

      {/* ── MODAL NOVO PROMPT ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--overlay)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(2px)',
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 540,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 64px var(--shadow)', fontFamily: font,
          }} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>
                Novo <span style={{ color: '#FC75A0' }}>prompt</span>
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Nome *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Nome do prompt"
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Categoria *</label>
                  <input
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    placeholder="Ex: Copy Instagram"
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Conteúdo do prompt *</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Escreva o prompt completo aqui..."
                  rows={6}
                  style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: "'JetBrains Mono', 'Courier New', monospace", boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Tags (separadas por vírgula)</label>
                <input
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="instagram, copy, vendas"
                  style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  onClick={() => { setShowModal(false); setForm(emptyForm) }}
                  style={{ flex: 1, border: '1px solid var(--border-2)', background: 'none', borderRadius: 999, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--text-2)', fontFamily: font }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!form.name.trim() || !form.category.trim() || !form.content.trim()}
                  style={{
                    flex: 2,
                    background: form.name.trim() && form.category.trim() && form.content.trim() ? '#FC75A0' : 'var(--border)',
                    color: form.name.trim() && form.category.trim() && form.content.trim() ? '#FFFFFF' : 'var(--text-4)',
                    borderRadius: 999, border: 'none', padding: '11px', fontSize: 13, fontWeight: 700,
                    cursor: form.name.trim() && form.category.trim() && form.content.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: font, transition: 'all 0.15s',
                  }}
                >
                  Criar prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
