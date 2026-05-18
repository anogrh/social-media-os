'use client'

import Link from 'next/link'
import { Users, DollarSign, TrendingDown, CheckSquare, AlertCircle, ArrowRight, Clock, Camera } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import Header from '@/components/layout/Header'
import MetricCard from '@/components/ui/MetricCard'
import StatusBadge from '@/components/ui/StatusBadge'
import AlertItem from '@/components/ui/AlertItem'
import DailySummary from '@/components/dashboard/DailySummary'
import { alerts, revenueByMonth, clients, calendarItems, payments, tasks, instagramAccounts } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

// ── derived data ──────────────────────────────────────────────────────────────
const activeClients = clients.filter(c => c.status === 'ativo' || c.status === 'onboarding')
const totalPrevisto = clients.filter(c => c.status !== 'encerrado').reduce((a, c) => a + c.monthlyValue, 0)
const totalRecebido = payments.filter(p => p.status === 'pago').reduce((a, p) => a + p.value, 0)
const overduePayments = payments.filter(p => p.status === 'atrasado')
const pendingPayments = payments.filter(p => p.status === 'pendente')

const overdueTasks = tasks.filter(t => t.status !== 'concluido' && t.dueDate < '2025-06-16')
const todayTasks = tasks.filter(t => t.status !== 'concluido').slice(0, 5)
const thisWeekPosts = calendarItems.filter(c => c.date >= '2025-06-09' && c.date <= '2025-06-15').slice(0, 5)
const recentPayments = payments.slice(0, 5)

// top performing client
const topClient = instagramAccounts.filter(ig => ig.connected).sort((a, b) => b.newFollowers30d - a.newFollowers30d)[0]
const topClientName = clients.find(c => c.id === topClient?.clientId)?.name

const chartStyle = {
  content: { background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 12, fontFamily: 'Inter', fontSize: 12 },
}

function FormatPill({ format }: { format: string }) {
  const map: Record<string, { background: string; color: string }> = {
    reels:    { background: '#F25BA5', color: '#fff' },
    carrossel: { background: '#F19877', color: '#fff' },
    story:    { background: '#FBD0DA', color: '#1F1B1A' },
    feed:     { background: '#F2F4A4', color: '#1F1B1A' },
  }
  const s = map[format] || { background: '#f3f4f6', color: '#374151' }
  return <span style={{ ...s, fontSize: 10, padding: '2px 8px', borderRadius: 999, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>{format}</span>
}

const font = "'Inter', system-ui, sans-serif"
const card = { background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 12 }
const sectionH = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: '#1F1B1A', marginBottom: 16 } as const
const rowItem = { display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 11, marginBottom: 11, borderBottom: '1px solid rgba(31,27,26,0.06)' } as const

export default function DashboardPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Header title="Dashboard" subtitle="Visão geral da operação" />

      <div className="page-pad" style={{ fontFamily: font }}>

        {/* ── 1. KPI CARDS ────────────────────────────────────────────── */}
        <div className="rg-kpi" style={{ marginBottom: 24 }}>
          <MetricCard icon={Users}       label="Clientes ativos"   value={String(activeClients.length)} change={20}  changeLabel="vs. mês anterior"     iconBg="#FBD0DA" accent="#F25BA5" />
          <MetricCard icon={DollarSign}  label="Receita prevista"  value={formatCurrency(totalPrevisto)} change={13}  changeLabel="jun/2025"              iconBg="#d1fae5" accent="#10B981" />
          <MetricCard icon={DollarSign}  label="Recebido"          value={formatCurrency(totalRecebido)} change={-8}  changeLabel="jun/2025 (parcial)"    iconBg="#dbeafe" accent="#3B82F6" />
          <MetricCard icon={CheckSquare} label="Tarefas atrasadas" value={String(overdueTasks.length)}   change={-15} changeLabel="vs. semana passada"    iconBg="#fee2e2" accent="#EE3528" />
          <MetricCard icon={TrendingDown} label="Clientes c/ queda" value="2"                            changeLabel="Café Maison, Bloom"                 iconBg="#fef9c3" accent="#F59E0B" />
        </div>

        {/* ── 2. HOJE + RESUMO ─────────────────────────────────────────── */}
        <div className="rg-2" style={{ gap: 20, marginBottom: 24 }}>

          {/* O que fazer hoje */}
          <div style={{ ...card, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={sectionH}>
                <Clock size={14} style={{ display: 'inline', marginRight: 6, color: '#F25BA5', verticalAlign: 'middle' }} />
                O que fazer hoje
              </h3>
              <Link href="/tarefas" style={{ fontSize: 12, color: '#F25BA5', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Ver todas <ArrowRight size={12} />
              </Link>
            </div>

            {todayTasks.map((t, i) => {
              const isLast = i === todayTasks.length - 1
              const priorityColors: Record<string, string> = { urgente: '#EE3528', alta: '#F59E0B', media: '#3B82F6', baixa: '#6b7280' }
              return (
                <div key={t.id} style={{ ...rowItem, paddingBottom: isLast ? 0 : 11, marginBottom: isLast ? 0 : 11, borderBottom: isLast ? 'none' : '1px solid rgba(31,27,26,0.06)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.clientColor || '#ccc', display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: '#1F1B1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: priorityColors[t.priority], background: `${priorityColors[t.priority]}18`, padding: '2px 7px', borderRadius: 999, flexShrink: 0 }}>
                    {t.priority}
                  </span>
                </div>
              )
            })}
          </div>

          {/* AI Daily Summary */}
          <DailySummary />
        </div>

        {/* ── 3. RECEITA + ALERTAS ────────────────────────────────────── */}
        <div className="rg-chart" style={{ gap: 20, marginBottom: 24 }}>

          {/* Revenue BarChart */}
          <div style={{ ...card, padding: '20px 20px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ ...sectionH, marginBottom: 0 }}>Receita — últimos 6 meses</h3>
              <Link href="/financeiro" style={{ fontSize: 12, color: '#F25BA5', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Ver tudo <ArrowRight size={12} /></Link>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByMonth} barSize={16} barGap={4}>
                <CartesianGrid strokeDasharray="0" stroke="rgba(31,27,26,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(31,27,26,0.5)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(31,27,26,0.4)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={chartStyle.content} formatter={(v: unknown) => formatCurrency(v as number)} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter' }} />
                <Bar dataKey="recebido" name="Recebido" fill="#F25BA5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pendente" name="Pendente" fill="#FBD0DA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts */}
          <div style={{ ...card, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ ...sectionH, marginBottom: 0 }}>
                Alertas
                <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 11, padding: '2px 7px', borderRadius: 999, marginLeft: 8, fontWeight: 700 }}>
                  {alerts.filter(a => !a.read).length}
                </span>
              </h3>
              <AlertCircle size={14} style={{ color: '#EE3528' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alerts.slice(0, 4).map(a => <AlertItem key={a.id} alert={a} />)}
            </div>
          </div>
        </div>

        {/* ── 4. CLIENTES + INSTAGRAM SNAPSHOT ───────────────────────── */}
        <div className="rg-3" style={{ gap: 20, marginBottom: 24 }}>

          {/* Top clients by payment status */}
          <div style={{ ...card, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ ...sectionH, marginBottom: 0 }}>Clientes</h3>
              <Link href="/clientes" style={{ fontSize: 12, color: '#F25BA5', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Ver todos <ArrowRight size={12} /></Link>
            </div>
            {clients.slice(0, 5).map((c, i) => {
              const isLast = i === 4
              return (
                <Link key={c.id} href={`/clientes/${c.id}`} style={{ ...rowItem, textDecoration: 'none', paddingBottom: isLast ? 0 : 11, marginBottom: isLast ? 0 : 11, borderBottom: isLast ? 'none' : '1px solid rgba(31,27,26,0.06)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.color, fontSize: 10, fontWeight: 700, color: c.color === '#F2F4A4' || c.color === '#FBD0DA' ? '#1F1B1A' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {c.initials}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#1F1B1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                  <StatusBadge status={c.paymentStatus} size="sm" />
                </Link>
              )
            })}
          </div>

          {/* Instagram highlights */}
          <div style={{ ...card, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ ...sectionH, marginBottom: 0 }}>
                <Camera size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: '#F25BA5' }} />
                Instagram
              </h3>
              <Link href="/instagram" style={{ fontSize: 12, color: '#F25BA5', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Analytics <ArrowRight size={12} /></Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {instagramAccounts.filter(ig => ig.connected).slice(0, 5).map((ig, i) => {
                const cl = clients.find(c => c.id === ig.clientId)!
                const isLast = i === 4
                return (
                  <div key={ig.id} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: isLast ? 0 : 10, marginBottom: isLast ? 0 : 10, borderBottom: isLast ? 'none' : '1px solid rgba(31,27,26,0.06)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: cl.color, fontSize: 9, fontWeight: 700, color: cl.color === '#F2F4A4' || cl.color === '#FBD0DA' ? '#1F1B1A' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {cl.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#1F1B1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ig.handle}</p>
                      <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.45)' }}>{ig.engagementRate}% eng.</p>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: ig.newFollowers30d >= 0 ? '#10B981' : '#EE3528',
                    }}>
                      {ig.newFollowers30d >= 0 ? '+' : ''}{ig.newFollowers30d}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Inadimplência + pending */}
          <div style={{ ...card, padding: 20 }}>
            <h3 style={sectionH}>Financeiro rápido</h3>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, background: '#fee2e2', borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Atrasado</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#EE3528', marginTop: 4 }}>
                  {formatCurrency(overduePayments.reduce((a, p) => a + p.value, 0))}
                </p>
                <p style={{ fontSize: 11, color: '#991b1b', marginTop: 2 }}>{overduePayments.length} cliente(s)</p>
              </div>
              <div style={{ flex: 1, background: '#fef3c7', borderRadius: 10, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pendente</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#F59E0B', marginTop: 4 }}>
                  {formatCurrency(pendingPayments.reduce((a, p) => a + p.value, 0))}
                </p>
                <p style={{ fontSize: 11, color: '#92400e', marginTop: 2 }}>{pendingPayments.length} cliente(s)</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {payments.filter(p => p.status !== 'pago').slice(0, 3).map((p, i) => {
                const isLast = i === 2
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: isLast ? 0 : 8, borderBottom: isLast ? 'none' : '1px solid rgba(31,27,26,0.06)' }}>
                    <span style={{ flex: 1, fontSize: 12, color: '#1F1B1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.clientName}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1F1B1A' }}>{formatCurrency(p.value)}</span>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                )
              })}
            </div>

            <Link href="/financeiro" style={{ display: 'block', marginTop: 14, fontSize: 12, color: '#F25BA5', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
              Ver financeiro completo →
            </Link>
          </div>
        </div>

        {/* ── 5. POSTS DA SEMANA + PAGAMENTOS RECENTES ──────────────── */}
        <div className="rg-2" style={{ gap: 20 }}>

          {/* Posts this week */}
          <div style={{ ...card, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ ...sectionH, marginBottom: 0 }}>Posts esta semana</h3>
              <Link href="/calendario" style={{ fontSize: 12, color: '#F25BA5', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Calendário <ArrowRight size={12} /></Link>
            </div>
            {thisWeekPosts.length === 0 && (
              <p style={{ fontSize: 13, color: 'rgba(31,27,26,0.4)' }}>Nenhum post esta semana.</p>
            )}
            {thisWeekPosts.map((item, i) => {
              const isLast = i === thisWeekPosts.length - 1
              return (
                <div key={item.id} style={{ ...rowItem, paddingBottom: isLast ? 0 : 11, marginBottom: isLast ? 0 : 11, borderBottom: isLast ? 'none' : '1px solid rgba(31,27,26,0.06)' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: item.clientColor, color: item.clientColor === '#F2F4A4' || item.clientColor === '#FBD0DA' ? '#1F1B1A' : '#FFFFFF', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.clientName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#1F1B1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.caption}</p>
                    <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.45)', marginTop: 2 }}>{item.clientName} · {formatDate(item.date)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    <FormatPill format={item.format} />
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent payments */}
          <div style={{ ...card, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ ...sectionH, marginBottom: 0 }}>Pagamentos recentes</h3>
              <Link href="/financeiro" style={{ fontSize: 12, color: '#F25BA5', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Ver tudo <ArrowRight size={12} /></Link>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(31,27,26,0.08)' }}>
                  {['Cliente', 'Ref.', 'Valor', 'Status'].map(h => (
                    <th key={h} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(31,27,26,0.45)', textAlign: 'left', paddingBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p, i) => {
                  const isLast = i === recentPayments.length - 1
                  return (
                    <tr key={p.id} style={{ borderBottom: isLast ? 'none' : '1px solid rgba(31,27,26,0.05)' }}>
                      <td style={{ fontSize: 13, color: '#1F1B1A', padding: '9px 0', fontWeight: 500 }}>{p.clientName}</td>
                      <td style={{ fontSize: 12, color: 'rgba(31,27,26,0.5)', padding: '9px 0' }}>{p.reference}</td>
                      <td style={{ fontSize: 13, color: '#1F1B1A', padding: '9px 0', fontWeight: 700 }}>{formatCurrency(p.value)}</td>
                      <td style={{ padding: '9px 0' }}><StatusBadge status={p.status} size="sm" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
