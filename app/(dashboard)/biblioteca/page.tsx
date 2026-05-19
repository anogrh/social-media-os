'use client'

import { useState } from 'react'
import { Plus, ExternalLink, X, Trash2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useReferences } from '@/context/ReferencesContext'
import type { Reference } from '@/lib/types'

const TYPE_FILTERS = ['todos', 'design', 'copy', 'video', 'trend', 'campanha'] as const

const TYPE_STYLES: Record<string, { background: string; color: string; label: string }> = {
  design: { background: '#dbeafe', color: '#1d4ed8', label: 'Design' },
  copy: { background: '#FBD0DA', color: '#be185d', label: 'Copy' },
  video: { background: '#fee2e2', color: '#b91c1c', label: 'Vídeo' },
  trend: { background: '#F2F4A4', color: '#78716c', label: 'Trend' },
  campanha: { background: '#d1fae5', color: '#065f46', label: 'Campanha' },
}

const emptyForm = { title: '', url: '', category: '', type: 'design' as Reference['type'], description: '', tags: '' }

export default function BibliotecaPage() {
  const { references, addReference, deleteReference, isReady } = useReferences()
  const [filterType, setFilterType] = useState<'todos' | Reference['type']>('todos')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const font = "'Inter', system-ui, sans-serif"

  const filtered = references.filter(r => {
    const matchType = filterType === 'todos' || r.type === filterType
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some(t => t.includes(search.toLowerCase()))
    return matchType && matchSearch
  })

  async function handleAdd() {
    if (!form.title.trim() || !form.url.trim() || !form.category.trim()) return
    await addReference({
      title: form.title,
      url: form.url,
      category: form.category,
      type: form.type,
      description: form.description || undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    })
    setForm(emptyForm)
    setShowModal(false)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Referências" subtitle="Biblioteca de inspirações e referências" />

      <div className="page-pad" style={{ fontFamily: font }}>
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
          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, padding: '9px 18px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> Adicionar referência
          </button>
        </div>

        {/* Grid */}
        <div className="rg-3" style={{ gap: 16 }}>
          {filtered.map(ref => {
            const typeStyle = TYPE_STYLES[ref.type] || { background: 'var(--bg-3)', color: 'var(--text)', label: ref.type }
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
                    <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as never }}>
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
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        onClick={() => deleteReference(ref.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', alignItems: 'center', padding: 4 }}
                      >
                        <Trash2 size={13} />
                      </button>
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
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && isReady && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 15, color: 'var(--text-4)' }}>Nenhuma referência encontrada.</p>
          </div>
        )}
      </div>

      {/* ── MODAL NOVA REFERÊNCIA ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--overlay)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(2px)',
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 64px var(--shadow)', fontFamily: font,
          }} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>
                Nova <span style={{ color: '#FC75A0' }}>referência</span>
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Título *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Título da referência"
                  style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>URL *</label>
                <input
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="https://..."
                  style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Categoria *</label>
                  <input
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    placeholder="Ex: Marketing"
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Tipo</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as Reference['type'] }))}
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                  >
                    <option value="design">Design</option>
                    <option value="copy">Copy</option>
                    <option value="video">Vídeo</option>
                    <option value="trend">Trend</option>
                    <option value="campanha">Campanha</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Descrição</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descreva brevemente esta referência..."
                  rows={3}
                  style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Tags (separadas por vírgula)</label>
                <input
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="instagram, branding, tipografia"
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
                  disabled={!form.title.trim() || !form.url.trim() || !form.category.trim()}
                  style={{
                    flex: 2,
                    background: form.title.trim() && form.url.trim() && form.category.trim() ? '#FC75A0' : 'var(--border)',
                    color: form.title.trim() && form.url.trim() && form.category.trim() ? '#FFFFFF' : 'var(--text-4)',
                    borderRadius: 999, border: 'none', padding: '11px', fontSize: 13, fontWeight: 700,
                    cursor: form.title.trim() && form.url.trim() && form.category.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: font, transition: 'all 0.15s',
                  }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
