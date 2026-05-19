'use client'

import { useState, useRef } from 'react'
import { Plus, ChevronLeft, ChevronRight, X, Clock, Paperclip, FileText, CalendarCheck, AlignLeft, Type } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/ui/StatusBadge'
import { useCalendar } from '@/context/CalendarContext'
import { useClients } from '@/context/ClientsContext'
import type { ContentCalendarItem } from '@/lib/types'

const emptyPost = {
  clientId: '', format: 'reels', date: '', scheduledTime: '18:00',
  caption: '', tags: '', status: 'rascunho' as const,
  description: '', content: '', deliveryDate: '',
}

const FORMAT_STYLES: Record<string, { background: string; color: string }> = {
  reels:     { background: '#FC75A0', color: '#fff' },
  carrossel: { background: '#F19877', color: '#fff' },
  story:     { background: '#FBD0DA', color: 'var(--text)' },
  feed:      { background: '#F2F4A4', color: 'var(--text)' },
  blog:      { background: '#dbeafe', color: '#1d4ed8' },
  tiktok:    { background: '#292929', color: '#fff' },
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS   = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

/* ─────────────────────────────────────────────────────
   MODAL DE DETALHE DO CARTÃO
───────────────────────────────────────────────────── */
function CardDetailModal({
  post, onClose, onSave,
}: {
  post: ContentCalendarItem
  onClose: () => void
  onSave: (updated: ContentCalendarItem) => void
}) {
  const [draft, setDraft] = useState<ContentCalendarItem>({ ...post })
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).map(f => f.name)
    setDraft(d => ({ ...d, attachments: [...(d.attachments || []), ...files] }))
    if (fileRef.current) fileRef.current.value = ''
  }

  function removeAttachment(name: string) {
    setDraft(d => ({ ...d, attachments: (d.attachments || []).filter(a => a !== name) }))
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'var(--overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, backdropFilter: 'blur(2px)', padding: '16px' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--bg)', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px var(--shadow)', fontFamily: "'Inter', system-ui, sans-serif" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: post.clientColor, flexShrink: 0, color: post.clientColor === '#F2F4A4' || post.clientColor === '#FBD0DA' ? '#292929' : '#FFFFFF', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {post.clientName.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{post.clientName}</p>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
                {draft.caption || 'Sem título'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', flexShrink: 0 }}>
            <X size={20} />
          </button>
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', flexWrap: 'wrap' }}>
          <span style={{ ...FORMAT_STYLES[post.format], fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>{post.format}</span>
          <StatusBadge status={draft.status} size="sm" />
          {post.scheduledTime && (
            <span style={{ fontSize: 11, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} /> {post.date} às {post.scheduledTime}
            </span>
          )}
        </div>

        <div style={{ height: 1, background: 'var(--border-3)', margin: '0 28px' }} />

        {/* Fields */}
        <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Tema / título */}
          <div>
            <label style={labelStyle}>
              <Type size={12} /> Tema / título
            </label>
            <input
              value={draft.caption || ''}
              onChange={e => setDraft(d => ({ ...d, caption: e.target.value }))}
              placeholder="Ex: Os 5 benefícios do magnésio"
              style={inputStyle}
            />
          </div>

          {/* Descrição */}
          <div>
            <label style={labelStyle}>
              <AlignLeft size={12} /> Descrição
            </label>
            <textarea
              value={draft.description || ''}
              onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
              placeholder="Descreva a ideia, referências ou instruções para este conteúdo..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Conteúdo (copy completo) */}
          <div>
            <label style={labelStyle}>
              <FileText size={12} /> Conteúdo (copy / roteiro)
            </label>
            <textarea
              value={draft.content || ''}
              onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
              placeholder="Cole aqui o texto completo da legenda, roteiro ou copy do post..."
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Formato + Data de entrega */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Formato de conteúdo</label>
              <select
                value={draft.format}
                onChange={e => setDraft(d => ({ ...d, format: e.target.value as ContentCalendarItem['format'] }))}
                style={inputStyle}
              >
                {['reels', 'carrossel', 'story', 'feed', 'tiktok', 'blog'].map(f => (
                  <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>
                <CalendarCheck size={12} /> Data de entrega
              </label>
              <input
                type="date"
                value={draft.deliveryDate || ''}
                onChange={e => setDraft(d => ({ ...d, deliveryDate: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={draft.status}
              onChange={e => setDraft(d => ({ ...d, status: e.target.value as ContentCalendarItem['status'] }))}
              style={inputStyle}
            >
              {['rascunho', 'agendado', 'publicado', 'aprovado', 'em_revisao'].map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Anexos */}
          <div>
            <label style={labelStyle}>
              <Paperclip size={12} /> Anexos
            </label>

            {/* Arquivos já adicionados */}
            {(draft.attachments || []).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                {(draft.attachments || []).map((name, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-2)', borderRadius: 8, padding: '8px 12px' }}>
                    <Paperclip size={12} color="#FC75A0" />
                    <span style={{ fontSize: 13, color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                    <button onClick={() => removeAttachment(name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', flexShrink: 0 }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Botão de adicionar */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: 7, border: '1.5px dashed var(--shadow)', borderRadius: 10, padding: '10px 16px', background: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13, width: '100%', fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              <Paperclip size={14} />
              Clique para anexar arquivo
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              onChange={handleFile}
              style={{ display: 'none' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              onClick={onClose}
              style={{ flex: 1, border: '1px solid var(--border-2)', background: 'none', borderRadius: 999, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--text-2)', fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(draft)}
              style={{ flex: 2, background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, border: 'none', padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* shared micro-styles */
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--text-2)',
  textTransform: 'uppercase', letterSpacing: '0.07em',
  display: 'flex', alignItems: 'center', gap: 5,
  marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid var(--border-2)', borderRadius: 12,
  padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)',
  color: 'var(--text)', outline: 'none', fontFamily: "'Inter', system-ui, sans-serif",
  boxSizing: 'border-box',
}

/* ─────────────────────────────────────────────────────
   PÁGINA PRINCIPAL
───────────────────────────────────────────────────── */
export default function CalendarioPage() {
  const { items: allItems, addItem, updateItem } = useCalendar()
  const { clients } = useClients()
  const [year, setYear]               = useState(new Date().getFullYear())
  const [month, setMonth]             = useState(new Date().getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [filterClient, setFilterClient] = useState('todos')
  const [filterFormat, setFilterFormat] = useState('todos')
  const [showModal, setShowModal]     = useState(false)
  const [newPost, setNewPost]         = useState(emptyPost)
  const [detailPost, setDetailPost]   = useState<ContentCalendarItem | null>(null)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfMonth(year, month)

  const filtered = allItems.filter(c => {
    const d = new Date(c.date)
    const matchMonth  = d.getFullYear() === year && d.getMonth() === month
    const matchClient = filterClient === 'todos' || c.clientId === filterClient
    const matchFormat = filterFormat === 'todos' || c.format === filterFormat
    return matchMonth && matchClient && matchFormat
  })

  function getPostsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return filtered.filter(c => c.date === dateStr)
  }

  const selectedPosts = selectedDay ? getPostsForDay(selectedDay) : []

  async function handleAddPost() {
    if (!newPost.clientId || !newPost.date) return
    const client = clients.find(c => c.id === newPost.clientId)!
    await addItem({
      clientId: newPost.clientId,
      clientName: client.name,
      clientColor: client.color,
      date: newPost.date,
      format: newPost.format as ContentCalendarItem['format'],
      caption: newPost.caption,
      status: newPost.status,
      scheduledTime: newPost.scheduledTime,
      tags: newPost.tags ? newPost.tags.split(',').map(t => t.trim()) : [],
      description: newPost.description,
      content: newPost.content,
      deliveryDate: newPost.deliveryDate,
    })
    setNewPost(emptyPost)
    setShowModal(false)
  }

  async function handleSaveDetail(updated: ContentCalendarItem) {
    await updateItem(updated.id, updated)
    setDetailPost(null)
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
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Calendário editorial" subtitle="Planejamento de conteúdo" />

      <div className="page-pad" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <select
            value={filterClient}
            onChange={e => setFilterClient(e.target.value)}
            style={{ border: '1px solid var(--border-2)', borderRadius: 999, padding: '8px 14px', fontSize: 12, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="todos">Todos os clientes</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <div style={{ display: 'flex', gap: 6 }}>
            {['todos', 'reels', 'carrossel', 'story', 'feed'].map(f => (
              <button
                key={f}
                onClick={() => setFilterFormat(f)}
                style={{
                  background: filterFormat === f ? '#FC75A0' : '#F5F4F2',
                  color: filterFormat === f ? '#FFFFFF' : '#292929',
                  border: `1px solid ${filterFormat === f ? '#FC75A0' : 'var(--border)'}`,
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
            style={{ background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, padding: '9px 18px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> Nova pauta
          </button>
        </div>

        <div className="rg-calendario" style={{ gap: 20 }}>
          {/* Calendar grid */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', overflowX: 'auto' }}>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-3)' }}>
              <button onClick={prevMonth} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronLeft size={14} />
              </button>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{MONTHS[month]} {year}</h3>
              <button onClick={nextMonth} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-3)', minWidth: 560 }}>
              {WEEKDAYS.map(d => (
                <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minWidth: 560 }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} style={{ minHeight: 100, borderRight: '1px solid var(--border-3)', borderBottom: '1px solid var(--border-3)' }} />
              ))}

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
                      minHeight: 100, padding: 8,
                      borderRight: '1px solid var(--border-3)',
                      borderBottom: '1px solid var(--border-3)',
                      background: isSelected ? 'rgba(252,117,160,0.06)' : 'transparent',
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    className="hover:bg-[rgba(252,117,160,0.04)]"
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: isToday ? '#FC75A0' : 'transparent',
                      color: isToday ? '#FFFFFF' : isSelected ? '#FC75A0' : '#292929',
                      fontSize: 13, fontWeight: isToday || isSelected ? 700 : 400,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
                    }}>
                      {day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {posts.slice(0, 3).map(p => (
                        <div key={p.id} style={{ ...FORMAT_STYLES[p.format], fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.clientName.split(' ')[0]}
                        </div>
                      ))}
                      {posts.length > 3 && <span style={{ fontSize: 10, color: 'var(--text-4)' }}>+{posts.length - 3}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Side panel */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
              {selectedDay ? `Dia ${selectedDay} de ${MONTHS[month]}` : 'Selecione um dia'}
            </h4>

            {selectedPosts.length === 0 && selectedDay && (
              <p style={{ fontSize: 13, color: 'var(--text-4)' }}>Nenhum post para este dia.</p>
            )}
            {!selectedDay && (
              <p style={{ fontSize: 13, color: 'var(--text-4)' }}>Clique em um dia para ver os posts agendados.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedPosts.map(post => (
                <button
                  key={post.id}
                  onClick={() => setDetailPost(post)}
                  style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '12px 14px', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: "'Inter', system-ui, sans-serif', transition: 'box-shadow 0.15s" }}
                  className="hover:shadow-md"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: post.clientColor, flexShrink: 0, color: post.clientColor === '#F2F4A4' || post.clientColor === '#FBD0DA' ? '#292929' : '#FFFFFF', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {post.clientName.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.clientName}</span>
                    <span style={{ ...FORMAT_STYLES[post.format], fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999 }}>{post.format}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 8, textAlign: 'left' }}>{post.caption}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <StatusBadge status={post.status} size="sm" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {(post.attachments?.length ?? 0) > 0 && (
                        <span style={{ fontSize: 10, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Paperclip size={10} /> {post.attachments!.length}
                        </span>
                      )}
                      {post.scheduledTime && (
                        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{post.scheduledTime}</span>
                      )}
                    </div>
                  </div>
                  {post.deliveryDate && (
                    <div style={{ marginTop: 6, fontSize: 11, color: '#FC75A0', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CalendarCheck size={11} /> Entrega: {post.deliveryDate}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Format legend */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-3)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Legenda de formatos</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {Object.entries(FORMAT_STYLES).filter(([k]) => k !== 'blog' && k !== 'tiktok').map(([format, style]) => (
                  <div key={format} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ ...style, width: 24, height: 14, borderRadius: 4, fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                    <span style={{ fontSize: 12, color: 'var(--text)', textTransform: 'capitalize' }}>{format}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL NOVA PAUTA ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(2px)', padding: 16 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: 'var(--bg)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px var(--shadow)', fontFamily: "'Inter', system-ui, sans-serif" }}
            onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>
                Nova <span style={{ color: '#FC75A0' }}>pauta</span>
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Tema */}
              <div>
                <label style={labelStyle}>Tema / título</label>
                <textarea value={newPost.caption} onChange={e => setNewPost(p => ({ ...p, caption: e.target.value }))}
                  placeholder="Ex: Os 5 benefícios do magnésio que você precisa saber" rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* Descrição */}
              <div>
                <label style={labelStyle}><AlignLeft size={12} /> Descrição</label>
                <textarea value={newPost.description} onChange={e => setNewPost(p => ({ ...p, description: e.target.value }))}
                  placeholder="Ideia, referências ou instruções para este post..." rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* Conteúdo */}
              <div>
                <label style={labelStyle}><FileText size={12} /> Conteúdo (copy / roteiro)</label>
                <textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                  placeholder="Texto completo, legenda ou roteiro do post..." rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* Cliente + Formato */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Cliente *</label>
                  <select value={newPost.clientId} onChange={e => setNewPost(p => ({ ...p, clientId: e.target.value }))}
                    style={inputStyle}>
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Formato</label>
                  <select value={newPost.format} onChange={e => setNewPost(p => ({ ...p, format: e.target.value }))}
                    style={inputStyle}>
                    {['reels', 'carrossel', 'story', 'feed', 'tiktok'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Data publicação + Entrega */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Data de publicação *</label>
                  <input type="date" value={newPost.date} onChange={e => setNewPost(p => ({ ...p, date: e.target.value }))}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><CalendarCheck size={12} /> Data de entrega</label>
                  <input type="date" value={newPost.deliveryDate} onChange={e => setNewPost(p => ({ ...p, deliveryDate: e.target.value }))}
                    style={inputStyle} />
                </div>
              </div>

              {/* Horário + Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}><Clock size={10} style={{ display: 'inline' }} /> Horário</label>
                  <input type="time" value={newPost.scheduledTime} onChange={e => setNewPost(p => ({ ...p, scheduledTime: e.target.value }))}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tags</label>
                  <input value={newPost.tags} onChange={e => setNewPost(p => ({ ...p, tags: e.target.value }))}
                    placeholder="saude, educacao..." style={inputStyle} />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => { setShowModal(false); setNewPost(emptyPost) }}
                  style={{ flex: 1, border: '1px solid var(--border-2)', background: 'none', borderRadius: 999, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--text-2)', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  Cancelar
                </button>
                <button onClick={handleAddPost} disabled={!newPost.clientId || !newPost.date}
                  style={{ flex: 2, background: newPost.clientId && newPost.date ? '#FC75A0' : 'var(--border)', color: newPost.clientId && newPost.date ? '#FFFFFF' : 'var(--text-4)', borderRadius: 999, border: 'none', padding: '11px', fontSize: 13, fontWeight: 700, cursor: newPost.clientId && newPost.date ? 'pointer' : 'not-allowed', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  Adicionar pauta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DETALHE DO CARTÃO ── */}
      {detailPost && (
        <CardDetailModal
          post={detailPost}
          onClose={() => setDetailPost(null)}
          onSave={handleSaveDetail}
        />
      )}
    </div>
  )
}
