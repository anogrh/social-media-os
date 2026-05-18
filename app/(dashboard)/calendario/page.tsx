'use client'

import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/ui/StatusBadge'
import { calendarItems, clients } from '@/lib/mock-data'
import type { ContentCalendarItem } from '@/lib/types'

const emptyPost = {
  clientId: '', format: 'reels', date: '', scheduledTime: '18:00',
  caption: '', tags: '', status: 'rascunho' as const,
}

const FORMAT_STYLES: Record<string, { background: string; color: string }> = {
  reels: { background: '#F25BA5', color: '#fff' },
  carrossel: { background: '#F19877', color: '#fff' },
  story: { background: '#FBD0DA', color: '#1F1B1A' },
  feed: { background: '#F2F4A4', color: '#1F1B1A' },
  blog: { background: '#dbeafe', color: '#1d4ed8' },
  tiktok: { background: '#1F1B1A', color: '#fff' },
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function CalendarioPage() {
  const [year, setYear] = useState(2025)
  const [month, setMonth] = useState(5) // June
  const [selectedDay, setSelectedDay] = useState<number | null>(6)
  const [filterClient, setFilterClient] = useState('todos')
  const [filterFormat, setFilterFormat] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  const [newPost, setNewPost] = useState(emptyPost)
  const [allItems, setAllItems] = useState<ContentCalendarItem[]>(calendarItems)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const filtered = allItems.filter(c => {
    const d = new Date(c.date)
    const matchMonth = d.getFullYear() === year && d.getMonth() === month
    const matchClient = filterClient === 'todos' || c.clientId === filterClient
    const matchFormat = filterFormat === 'todos' || c.format === filterFormat
    return matchMonth && matchClient && matchFormat
  })

  function getPostsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return filtered.filter(c => c.date === dateStr)
  }

  const selectedPosts = selectedDay ? getPostsForDay(selectedDay) : []

  function handleAddPost() {
    if (!newPost.clientId || !newPost.date) return
    const client = clients.find(c => c.id === newPost.clientId)!
    const item: ContentCalendarItem = {
      id: `cal${Date.now()}`,
      clientId: newPost.clientId,
      clientName: client.name,
      clientColor: client.color,
      date: newPost.date,
      format: newPost.format as ContentCalendarItem['format'],
      caption: newPost.caption,
      status: newPost.status,
      scheduledTime: newPost.scheduledTime,
      tags: newPost.tags ? newPost.tags.split(',').map(t => t.trim()) : [],
    }
    setAllItems(prev => [...prev, item])
    setNewPost(emptyPost)
    setShowModal(false)
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Header title="Calendário editorial" subtitle="Planejamento de conteúdo" />

      <div style={{ padding: '24px 28px', fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {/* Client filter */}
          <select
            value={filterClient}
            onChange={e => setFilterClient(e.target.value)}
            style={{ border: '1px solid rgba(31,27,26,0.15)', borderRadius: 999, padding: '8px 14px', fontSize: 12, background: '#F5F4F2', color: '#1F1B1A', outline: 'none', cursor: 'pointer' }}
          >
            <option value="todos">Todos os clientes</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Format filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['todos', 'reels', 'carrossel', 'story', 'feed'].map(f => (
              <button
                key={f}
                onClick={() => setFilterFormat(f)}
                style={{
                  background: filterFormat === f ? '#F25BA5' : '#F5F4F2',
                  color: filterFormat === f ? '#FFFFFF' : '#1F1B1A',
                  border: `1px solid ${filterFormat === f ? '#F25BA5' : 'rgba(31,27,26,0.12)'}`,
                  borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {f === 'todos' ? 'Todos' : f}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, padding: '9px 18px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> Nova pauta
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Calendar grid */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 16, overflow: 'hidden' }}>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(31,27,26,0.08)' }}>
              <button onClick={prevMonth} style={{ background: 'none', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronLeft size={14} />
              </button>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: '#1F1B1A' }}>{MONTHS[month]} {year}</h3>
              <button onClick={nextMonth} style={{ background: 'none', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgba(31,27,26,0.08)' }}>
              {WEEKDAYS.map(d => (
                <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {/* Empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} style={{ minHeight: 100, borderRight: '1px solid rgba(31,27,26,0.05)', borderBottom: '1px solid rgba(31,27,26,0.05)' }} />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const posts = getPostsForDay(day)
                const isSelected = selectedDay === day
                const today = new Date()
                const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      minHeight: 100,
                      padding: '8px',
                      borderRight: '1px solid rgba(31,27,26,0.05)',
                      borderBottom: '1px solid rgba(31,27,26,0.05)',
                      background: isSelected ? 'rgba(242,91,165,0.06)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    className="hover:bg-[rgba(242,91,165,0.04)]"
                  >
                    <div
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: isToday ? '#F25BA5' : 'transparent',
                        color: isToday ? '#FFFFFF' : isSelected ? '#F25BA5' : '#1F1B1A',
                        fontSize: 13, fontWeight: isToday || isSelected ? 700 : 400,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 4,
                      }}
                    >
                      {day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {posts.slice(0, 3).map(p => (
                        <div
                          key={p.id}
                          style={{
                            ...FORMAT_STYLES[p.format],
                            fontSize: 10, fontWeight: 600,
                            padding: '2px 6px', borderRadius: 4,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}
                        >
                          {p.clientName.split(' ')[0]}
                        </div>
                      ))}
                      {posts.length > 3 && (
                        <span style={{ fontSize: 10, color: 'rgba(31,27,26,0.4)' }}>+{posts.length - 3}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Side panel */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 16, padding: 20 }}>
            <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A', marginBottom: 16 }}>
              {selectedDay ? `Dia ${selectedDay} de ${MONTHS[month]}` : 'Selecione um dia'}
            </h4>

            {selectedPosts.length === 0 && selectedDay && (
              <p style={{ fontSize: 13, color: 'rgba(31,27,26,0.4)' }}>Nenhum post para este dia.</p>
            )}

            {!selectedDay && (
              <p style={{ fontSize: 13, color: 'rgba(31,27,26,0.4)' }}>Clique em um dia para ver os posts agendados.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedPosts.map(post => (
                <div
                  key={post.id}
                  style={{ background: '#F5F4F2', borderRadius: 10, padding: '12px 14px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: post.clientColor, flexShrink: 0, color: post.clientColor === '#F2F4A4' || post.clientColor === '#FBD0DA' ? '#1F1B1A' : '#FFFFFF', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {post.clientName.split(' ').map((w: string) => w[0]).join('').slice(0,2)}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1F1B1A', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.clientName}</span>
                    <span style={{ ...FORMAT_STYLES[post.format], fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999 }}>{post.format}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(31,27,26,0.7)', lineHeight: 1.5, marginBottom: 8 }}>{post.caption}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <StatusBadge status={post.status} size="sm" />
                    {post.scheduledTime && (
                      <span style={{ fontSize: 11, color: 'rgba(31,27,26,0.4)' }}>{post.scheduledTime}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Format legend */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(31,27,26,0.08)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Legenda de formatos</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {Object.entries(FORMAT_STYLES).filter(([k]) => k !== 'blog' && k !== 'tiktok').map(([format, style]) => (
                  <div key={format} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ ...style, width: 24, height: 14, borderRadius: 4, fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                    <span style={{ fontSize: 12, color: '#1F1B1A', textTransform: 'capitalize' }}>{format}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL NOVA PAUTA ──────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31,27,26,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(2px)' }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 32, width: '100%', maxWidth: 540, boxShadow: '0 24px 64px rgba(31,27,26,0.18)', fontFamily: "'Inter', system-ui, sans-serif" }}
            onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, color: '#1F1B1A' }}>
                Nova <span style={{ color: '#F25BA5' }}>pauta</span>
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(31,27,26,0.4)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Caption */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Tema / legenda</label>
                <textarea
                  value={newPost.caption}
                  onChange={e => setNewPost(p => ({ ...p, caption: e.target.value }))}
                  placeholder="Ex: Os 5 benefícios do magnésio que você precisa saber"
                  rows={2}
                  style={{ width: '100%', border: '1px solid rgba(31,27,26,0.15)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: '#F5F4F2', color: '#1F1B1A', outline: 'none', fontFamily: "'Inter', system-ui, sans-serif", resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              {/* Client + Format */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Cliente *</label>
                  <select value={newPost.clientId} onChange={e => setNewPost(p => ({ ...p, clientId: e.target.value }))}
                    style={{ width: '100%', border: '1px solid rgba(31,27,26,0.15)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: '#F5F4F2', color: '#1F1B1A', outline: 'none' }}>
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Formato</label>
                  <select value={newPost.format} onChange={e => setNewPost(p => ({ ...p, format: e.target.value }))}
                    style={{ width: '100%', border: '1px solid rgba(31,27,26,0.15)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: '#F5F4F2', color: '#1F1B1A', outline: 'none' }}>
                    {['reels', 'carrossel', 'story', 'feed', 'tiktok'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Date + Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Data de publicação *</label>
                  <input type="date" value={newPost.date} onChange={e => setNewPost(p => ({ ...p, date: e.target.value }))}
                    style={{ width: '100%', border: '1px solid rgba(31,27,26,0.15)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: '#F5F4F2', color: '#1F1B1A', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}><Clock size={10} style={{ display: 'inline', marginRight: 4 }} />Horário</label>
                  <input type="time" value={newPost.scheduledTime} onChange={e => setNewPost(p => ({ ...p, scheduledTime: e.target.value }))}
                    style={{ width: '100%', border: '1px solid rgba(31,27,26,0.15)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: '#F5F4F2', color: '#1F1B1A', outline: 'none' }} />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Tags (separadas por vírgula)</label>
                <input value={newPost.tags} onChange={e => setNewPost(p => ({ ...p, tags: e.target.value }))} placeholder="saude, educacao, tendencia"
                  style={{ width: '100%', border: '1px solid rgba(31,27,26,0.15)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: '#F5F4F2', color: '#1F1B1A', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => { setShowModal(false); setNewPost(emptyPost) }}
                  style={{ flex: 1, border: '1px solid rgba(31,27,26,0.15)', background: 'none', borderRadius: 999, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'rgba(31,27,26,0.6)', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  Cancelar
                </button>
                <button onClick={handleAddPost} disabled={!newPost.clientId || !newPost.date}
                  style={{ flex: 2, background: newPost.clientId && newPost.date ? '#F25BA5' : 'rgba(31,27,26,0.1)', color: newPost.clientId && newPost.date ? '#FFFFFF' : 'rgba(31,27,26,0.3)', borderRadius: 999, border: 'none', padding: '11px', fontSize: 13, fontWeight: 700, cursor: newPost.clientId && newPost.date ? 'pointer' : 'not-allowed', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  Adicionar pauta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
