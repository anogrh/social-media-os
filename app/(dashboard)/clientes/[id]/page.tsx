'use client'

import { useState } from 'react'
import { useParams, notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, Globe, Mail, Phone, Edit2 } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/ui/StatusBadge'
import { useClients } from '@/context/ClientsContext'
import {
  getInstagramByClientId, getPaymentsByClientId,
  getTasksByClientId, getCalendarByClientId, generateDailyMetrics
} from '@/lib/mock-data'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import type { Client, ClientStatus, PaymentStatus } from '@/lib/types'

const TABS = ['Visão geral', 'Instagram', 'Calendário', 'Financeiro', 'Documentos', 'Estratégia', 'Anotações']

const SECTION_STYLE = { background: 'var(--bg-2)', borderRadius: 16, padding: 24, marginBottom: 20 }
const LABEL_STYLE: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 8 }
const INPUT_STYLE: React.CSSProperties = { width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg)', color: 'var(--text)', outline: 'none', fontFamily: "'Inter', system-ui, sans-serif" }
const SECTION_TITLE = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }

function getFormatStyle(format: string) {
  const map: Record<string, { background: string; color: string }> = {
    reels: { background: '#FC75A0', color: '#fff' },
    carrossel: { background: '#F19877', color: '#fff' },
    story: { background: '#FBD0DA', color: 'var(--text)' },
    feed: { background: '#F2F4A4', color: 'var(--text)' },
  }
  return map[format] || { background: 'var(--bg-3)', color: 'var(--text)' }
}

export default function ClientDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { getClientById, isReady } = useClients()

  const client = getClientById(id)

  if (!isReady) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', fontFamily: "'Inter', system-ui, sans-serif", color: 'var(--text-4)', fontSize: 14 }}>
      Carregando...
    </div>
  )

  if (!client) return notFound()

  return <ClientDetailView client={client} />
}

function ClientDetailView({ client }: { client: Client }) {
  const router = useRouter()
  const { updateClient, deleteClient } = useClients()
  const id = client.id

  const ig = getInstagramByClientId(id)
  const clientPayments = getPaymentsByClientId(id)
  const clientTasks = getTasksByClientId(id)
  const clientCalendar = getCalendarByClientId(id)
  const dailyMetrics = generateDailyMetrics(ig?.followers || 10000, 30)

  const [activeTab, setActiveTab] = useState('Visão geral')
  const [notes, setNotes] = useState(client.notes || '')
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<Partial<Client>>({ ...client })

  const iconColor = client.color === '#F2F4A4' || client.color === '#FBD0DA' || client.color === '#C8B8E8' ? '#292929' : '#FFFFFF'

  function handleSave() {
    updateClient(client.id, editData)
    setEditMode(false)
  }

  function handleCancel() {
    setEditData({ ...client })
    setEditMode(false)
  }

  function handleDelete() {
    if (window.confirm(`Excluir o cliente "${client.name}" permanentemente?`)) {
      deleteClient(id)
      router.push('/clientes')
    }
  }

  function handleSaveNotes() {
    updateClient(client.id, { notes })
  }

  function setField(key: keyof Client, value: unknown) {
    setEditData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title={client.name} subtitle={client.segment} />

      <div style={{ padding: '24px 28px' }}>
        {/* Back */}
        <Link href="/clientes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-2)', marginBottom: 20, textDecoration: 'none', fontFamily: "'Inter', system-ui, sans-serif" }}
          className="hover:text-[#FC75A0] transition-colors">
          <ArrowLeft size={14} /> Voltar para clientes
        </Link>

        {/* Client header card */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 20, fontFamily: "'Inter', system-ui, sans-serif" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: client.color, color: iconColor, fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {client.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{client.name}</h2>
                <StatusBadge status={client.status} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{client.segment} · {client.servicePackage}</p>
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                {client.email && <a href={`mailto:${client.email}`} style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}><Mail size={12} />{client.email}</a>}
                {client.phone && <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12} />{client.phone}</span>}
                {client.instagramHandle && <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}><Camera size={12} />{client.instagramHandle}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20, textAlign: 'right', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Mensalidade</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginTop: 4 }}>{formatCurrency(client.monthlyValue)}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Próx. pgto.</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: client.paymentStatus === 'atrasado' ? '#EE3528' : '#292929', marginTop: 4 }}>
                  {formatDate(client.nextPaymentDate)}
                </p>
                <StatusBadge status={client.paymentStatus} size="sm" />
              </div>
              <button
                onClick={() => setEditMode(true)}
                style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Inter', system-ui, sans-serif", whiteSpace: 'nowrap' }}
              >
                <Edit2 size={13} /> Editar cliente
              </button>
            </div>
          </div>
        </div>

        {/* Edit mode */}
        {editMode && (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 20, fontFamily: "'Inter', system-ui, sans-serif" }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Editar cliente</h3>

            {/* Dados básicos */}
            <div style={SECTION_STYLE}>
              <h4 style={SECTION_TITLE}>Dados básicos</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LABEL_STYLE}>Nome do cliente</label>
                  <input style={INPUT_STYLE} value={editData.name || ''} onChange={e => setField('name', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Segmento</label>
                  <input style={INPUT_STYLE} value={editData.segment || ''} onChange={e => setField('segment', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>E-mail</label>
                  <input type="email" style={INPUT_STYLE} value={editData.email || ''} onChange={e => setField('email', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Telefone</label>
                  <input style={INPUT_STYLE} value={editData.phone || ''} onChange={e => setField('phone', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Website</label>
                  <input style={INPUT_STYLE} value={editData.website || ''} onChange={e => setField('website', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Status</label>
                  <select style={INPUT_STYLE} value={editData.status || 'ativo'} onChange={e => setField('status', e.target.value as ClientStatus)}>
                    <option value="onboarding">Onboarding</option>
                    <option value="ativo">Ativo</option>
                    <option value="pausado">Pausado</option>
                    <option value="encerrado">Encerrado</option>
                  </select>
                </div>
                <div>
                  <label style={LABEL_STYLE}>Iniciais</label>
                  <input style={INPUT_STYLE} value={editData.initials || ''} maxLength={3} onChange={e => setField('initials', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Cor da marca</label>
                  <input style={INPUT_STYLE} value={editData.color || ''} onChange={e => setField('color', e.target.value)} placeholder="#FC75A0" />
                </div>
              </div>
            </div>

            {/* Redes sociais */}
            <div style={SECTION_STYLE}>
              <h4 style={SECTION_TITLE}>Redes sociais</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LABEL_STYLE}>Instagram</label>
                  <input style={INPUT_STYLE} value={editData.instagramHandle || ''} onChange={e => setField('instagramHandle', e.target.value)} placeholder="@handle" />
                </div>
              </div>
            </div>

            {/* Contrato */}
            <div style={SECTION_STYLE}>
              <h4 style={SECTION_TITLE}>Contrato</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LABEL_STYLE}>Valor mensal (R$)</label>
                  <input type="number" style={INPUT_STYLE} value={editData.monthlyValue || ''} onChange={e => setField('monthlyValue', Number(e.target.value))} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Início do contrato</label>
                  <input type="date" style={INPUT_STYLE} value={editData.contractStart || ''} onChange={e => setField('contractStart', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Pacote de serviço</label>
                  <select style={INPUT_STYLE} value={editData.servicePackage || ''} onChange={e => setField('servicePackage', e.target.value)}>
                    <option>Gestão Essencial</option>
                    <option>Gestão Full</option>
                    <option>Gestão Premium</option>
                    <option>Personalizado</option>
                  </select>
                </div>
                <div>
                  <label style={LABEL_STYLE}>Posts/mês</label>
                  <input type="number" style={INPUT_STYLE} value={editData.postsPerMonth || ''} onChange={e => setField('postsPerMonth', Number(e.target.value))} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Reels/mês</label>
                  <input type="number" style={INPUT_STYLE} value={editData.reelsPerMonth || ''} onChange={e => setField('reelsPerMonth', Number(e.target.value))} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Stories/semana</label>
                  <input type="number" style={INPUT_STYLE} value={editData.storiesPerWeek || ''} onChange={e => setField('storiesPerWeek', Number(e.target.value))} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Próx. vencimento</label>
                  <input type="date" style={INPUT_STYLE} value={editData.nextPaymentDate || ''} onChange={e => setField('nextPaymentDate', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Status de pagamento</label>
                  <select style={INPUT_STYLE} value={editData.paymentStatus || 'pendente'} onChange={e => setField('paymentStatus', e.target.value as PaymentStatus)}>
                    <option value="pago">Pago</option>
                    <option value="pendente">Pendente</option>
                    <option value="atrasado">Atrasado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Identidade da marca */}
            <div style={SECTION_STYLE}>
              <h4 style={SECTION_TITLE}>Identidade da marca</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={LABEL_STYLE}>Posicionamento</label>
                  <textarea style={{ ...INPUT_STYLE, minHeight: 80, resize: 'vertical' }} value={editData.positioning || ''} onChange={e => setField('positioning', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Tom de voz</label>
                  <textarea style={{ ...INPUT_STYLE, minHeight: 80, resize: 'vertical' }} value={editData.brandVoice || ''} onChange={e => setField('brandVoice', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Persona</label>
                  <textarea style={{ ...INPUT_STYLE, minHeight: 80, resize: 'vertical' }} value={editData.persona || ''} onChange={e => setField('persona', e.target.value)} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Pilares de conteúdo (separados por vírgula)</label>
                  <input style={INPUT_STYLE} value={editData.contentPillars?.join(', ') || ''} onChange={e => setField('contentPillars', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={handleDelete}
                style={{ background: 'transparent', color: '#EE3528', border: '1px solid #EE3528', borderRadius: 999, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Excluir cliente
              </button>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handleCancel}
                  style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border-2)', borderRadius: 999, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  style={{ background: '#FC75A0', color: '#FFFFFF', border: 'none', borderRadius: 999, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24, fontFamily: "'Inter', system-ui, sans-serif" }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #FC75A0' : '2px solid transparent',
                color: activeTab === tab ? '#FC75A0' : 'var(--text-2)',
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: activeTab === tab ? 700 : 500,
                cursor: 'pointer',
                marginBottom: -1,
                fontFamily: "'Inter', system-ui, sans-serif",
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}

        {/* Visão Geral */}
        {activeTab === 'Visão geral' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {[
                { label: 'Posts/mês', value: client.postsPerMonth },
                { label: 'Reels/mês', value: client.reelsPerMonth },
                { label: 'Stories/semana', value: client.storiesPerWeek },
                { label: 'Início contrato', value: formatDate(client.contractStart) },
              ].map(m => (
                <div key={m.label} style={{ background: 'var(--bg-2)', borderRadius: 12, padding: '14px 16px', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{m.label}</p>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 6 }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Tasks */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, fontFamily: "'Inter', system-ui, sans-serif" }}>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Tarefas</h4>
              {clientTasks.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-4)' }}>Nenhuma tarefa.</p>}
              {clientTasks.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <StatusBadge status={t.status} size="sm" />
                  <span style={{ fontSize: 13, color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-4)', whiteSpace: 'nowrap' }}>{formatDate(t.dueDate)}</span>
                </div>
              ))}
            </div>

            {/* Próximas postagens */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, fontFamily: "'Inter', system-ui, sans-serif" }}>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Próximas postagens</h4>
              {clientCalendar.filter(c => c.status !== 'publicado').slice(0, 4).map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ ...getFormatStyle(c.format), fontSize: 10, padding: '2px 8px', borderRadius: 999, fontWeight: 600, flexShrink: 0 }}>{c.format}</span>
                  <span style={{ fontSize: 13, color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.caption}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-4)', whiteSpace: 'nowrap' }}>{formatDate(c.date)}</span>
                </div>
              ))}
              {clientCalendar.filter(c => c.status !== 'publicado').length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--text-4)' }}>Nenhum post agendado.</p>
              )}
            </div>

            {/* Quick info */}
            <div style={{ background: 'var(--bg-2)', borderRadius: 12, padding: 20, fontFamily: "'Inter', system-ui, sans-serif" }}>
              <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Informações rápidas</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Pacote', value: client.servicePackage },
                  { label: 'E-mail', value: client.email },
                  { label: 'Telefone', value: client.phone || '—' },
                  { label: 'Website', value: client.website || '—' },
                ].map(i => (
                  <div key={i.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600 }}>{i.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--text)', textAlign: 'right', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instagram */}
        {activeTab === 'Instagram' && (
          <div>
            {ig && ig.connected ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                  {[
                    { label: 'Seguidores', value: formatNumber(ig.followers), sub: `+${ig.newFollowers30d} este mês` },
                    { label: 'Alcance 30d', value: formatNumber(ig.reach30d), sub: 'pessoas únicas' },
                    { label: 'Engajamento', value: `${ig.engagementRate}%`, sub: ig.engagementRate >= 4 ? '✓ Acima da média' : 'Abaixo da média' },
                    { label: 'Views de Reels', value: formatNumber(ig.reelsViews30d), sub: 'últimos 30 dias' },
                  ].map(m => (
                    <div key={m.label} style={{ background: 'var(--bg-2)', borderRadius: 12, padding: '16px', fontFamily: "'Inter', system-ui, sans-serif" }}>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{m.label}</p>
                      <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: '8px 0 4px' }}>{m.value}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-2)' }}>{m.sub}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 20px 10px', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Crescimento de seguidores — 30 dias</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={dailyMetrics}>
                      <CartesianGrid strokeDasharray="0" stroke="var(--border-3)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-4)' }} tickFormatter={d => d.slice(8)} axisLine={false} tickLine={false} interval={4} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--text-4)' }} axisLine={false} tickLine={false} tickFormatter={v => formatNumber(v)} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'Inter', fontSize: 12 }} />
                      <Line type="monotone" dataKey="followers" stroke="#FC75A0" strokeWidth={2} dot={false} name="Seguidores" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 16 }}>
                  {[
                    { label: 'Impressões 30d', value: formatNumber(ig.impressions30d) },
                    { label: 'Views stories 30d', value: formatNumber(ig.storiesViews30d) },
                    { label: 'Posts salvos 30d', value: formatNumber(ig.savedPosts30d) },
                    { label: 'Visitas ao perfil', value: formatNumber(ig.profileVisits30d) },
                    { label: 'Seguindo', value: formatNumber(ig.following) },
                    { label: 'Total de posts', value: ig.posts },
                  ].map(m => (
                    <div key={m.label} style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '12px 16px', fontFamily: "'Inter', system-ui, sans-serif" }}>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{m.label}</p>
                      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Inter', system-ui, sans-serif" }}>
                <Camera size={40} style={{ color: 'var(--shadow)', margin: '0 auto 16px' }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Instagram não conectado</p>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Conecte a conta do Instagram para ver as métricas em tempo real.</p>
                <button style={{ background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, padding: '10px 24px', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Conectar Instagram
                </button>
              </div>
            )}
          </div>
        )}

        {/* Calendário */}
        {activeTab === 'Calendário' && (
          <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Posts de junho 2025</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {clientCalendar.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg)', border: '1px solid var(--border-3)', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: 'var(--text)', lineHeight: 1 }}>{c.date.slice(-2)}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>jun</p>
                  </div>
                  <span style={{ ...getFormatStyle(c.format), fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 600 }}>{c.format}</span>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>{c.caption || 'Sem legenda'}</span>
                  <StatusBadge status={c.status} size="sm" />
                  {c.scheduledTime && <span style={{ fontSize: 11, color: 'var(--text-4)', whiteSpace: 'nowrap' }}>{c.scheduledTime}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financeiro */}
        {activeTab === 'Financeiro' && (
          <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              {[
                { label: 'Total recebido', value: formatCurrency(clientPayments.filter(p => p.status === 'pago').reduce((a, p) => a + p.value, 0)), color: '#10B981' },
                { label: 'Pendente', value: formatCurrency(clientPayments.filter(p => p.status === 'pendente').reduce((a, p) => a + p.value, 0)), color: '#F59E0B' },
                { label: 'Atrasado', value: formatCurrency(clientPayments.filter(p => p.status === 'atrasado').reduce((a, p) => a + p.value, 0)), color: '#EE3528' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-2)', borderRadius: 12, padding: '14px 18px', flex: 1 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{s.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--bg-2)' }}>
                  <tr>
                    {['Referência', 'Vencimento', 'Pagamento', 'Valor', 'Método', 'Status'].map(h => (
                      <th key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textAlign: 'left', padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clientPayments.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border-3)' }}>
                      <td style={{ fontSize: 13, color: 'var(--text)', padding: '12px 16px', fontWeight: 500 }}>{p.reference}</td>
                      <td style={{ fontSize: 13, color: 'var(--text)', padding: '12px 16px' }}>{formatDate(p.dueDate)}</td>
                      <td style={{ fontSize: 13, color: 'var(--text)', padding: '12px 16px' }}>{p.paidDate ? formatDate(p.paidDate) : '—'}</td>
                      <td style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', padding: '12px 16px' }}>{formatCurrency(p.value)}</td>
                      <td style={{ fontSize: 13, color: 'var(--text-2)', padding: '12px 16px' }}>{p.method || '—'}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={p.status} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Documentos */}
        {activeTab === 'Documentos' && (
          <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>Documentos e arquivos deste cliente.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Contrato de gestão 2024', 'Briefing inicial', 'Manual de identidade visual', 'Relatório maio/2025'].map(doc => (
                <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg)', border: '1px solid var(--border-3)', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ width: 36, height: 36, background: '#FBD0DA', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text)' }}>PDF</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{doc}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Enviado em 01/06/2025 · 1.2 MB</p>
                  </div>
                  <button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 999, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
                    Baixar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estratégia */}
        {activeTab === 'Estratégia' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontFamily: "'Inter', system-ui, sans-serif" }}>
            {[
              { label: 'Posicionamento', value: client.positioning || '—' },
              { label: 'Tom de voz', value: client.brandVoice || '—' },
              { label: 'Persona', value: client.persona || '—' },
              { label: 'Objetivos do mês', value: client.objectives?.join('\n') || '—' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-2)', borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{s.label}</p>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{s.value}</p>
              </div>
            ))}

            {client.contentPillars && (
              <div style={{ gridColumn: '1 / -1', background: 'var(--bg-2)', borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Pilares de conteúdo</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {client.contentPillars.map(p => (
                    <span key={p} style={{ background: '#FBD0DA', color: 'var(--text)', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 999 }}>{p}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Anotações */}
        {activeTab === 'Anotações' && (
          <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>Anotações internas — não visíveis ao cliente.</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Escreva aqui suas anotações sobre este cliente..."
              style={{
                width: '100%',
                minHeight: 250,
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '16px',
                fontSize: 14,
                color: 'var(--text)',
                lineHeight: 1.7,
                resize: 'vertical',
                outline: 'none',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            />
            <button
              onClick={handleSaveNotes}
              style={{ marginTop: 12, background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, padding: '10px 24px', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Salvar anotações
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
