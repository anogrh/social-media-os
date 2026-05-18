'use client'

import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/ui/StatusBadge'
import { payments, revenueByMonth, clients } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

const pieData = clients.filter(c => c.status !== 'encerrado').map(c => ({
  name: c.name,
  value: c.monthlyValue,
  color: c.color,
}))

const PIE_COLORS = ['#F25BA5', '#F19877', '#FBD0DA', '#F2F4A4', '#1F1B1A', '#86efac']

const totalPrevisto = clients.filter(c => c.status !== 'encerrado').reduce((a, c) => a + c.monthlyValue, 0)
const totalRecebido = payments.filter(p => p.status === 'pago').reduce((a, p) => a + p.value, 0)
const totalPendente = payments.filter(p => p.status === 'pendente').reduce((a, p) => a + p.value, 0)
const totalAtrasado = payments.filter(p => p.status === 'atrasado').reduce((a, p) => a + p.value, 0)

export default function FinanceiroPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Header title="Financeiro" subtitle="Controle de receitas e pagamentos" />

      <div style={{ padding: '24px 28px', fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Top cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Receita prevista (jun)', value: formatCurrency(totalPrevisto), color: '#1F1B1A', bg: '#F5F4F2' },
            { label: 'Receita recebida (total)', value: formatCurrency(totalRecebido), color: '#10B981', bg: '#d1fae5' },
            { label: 'Pendente', value: formatCurrency(totalPendente), color: '#F59E0B', bg: '#fef9c3' },
            { label: 'Inadimplente', value: formatCurrency(totalAtrasado), color: '#EE3528', bg: '#fee2e2' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '16px 18px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: s.color, marginTop: 8 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Bar chart */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 12, padding: '20px 20px 10px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: '#1F1B1A', marginBottom: 18 }}>Receita mensal — últimos 6 meses</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueByMonth} barSize={18} barGap={4}>
                <CartesianGrid strokeDasharray="0" stroke="rgba(31,27,26,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(31,27,26,0.5)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(31,27,26,0.4)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 12, fontFamily: 'Inter', fontSize: 12 }} formatter={(v: unknown) => formatCurrency(v as number)} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter' }} />
                <Bar dataKey="previsto" name="Previsto" fill="#F5F4F2" stroke="#F25BA5" strokeWidth={1} radius={[4,4,0,0]} />
                <Bar dataKey="recebido" name="Recebido" fill="#F25BA5" radius={[4,4,0,0]} />
                <Bar dataKey="pendente" name="Pendente" fill="#FBD0DA" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 12, padding: '20px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: '#1F1B1A', marginBottom: 14 }}>Receita por cliente</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 10, fontFamily: 'Inter', fontSize: 12 }} formatter={(v: unknown) => formatCurrency(v as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#1F1B1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1F1B1A', flexShrink: 0 }}>{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payments table */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(31,27,26,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: '#1F1B1A' }}>Todos os pagamentos</h3>
            <button style={{ background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, padding: '7px 16px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              + Registrar pagamento
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F5F4F2' }}>
              <tr>
                {['Cliente', 'Referência', 'Vencimento', 'Pagamento', 'Valor', 'Método', 'Status', ''].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.5)', textAlign: 'left', padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid rgba(31,27,26,0.05)' }}>
                  <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 16px', fontWeight: 600 }}>{p.clientName}</td>
                  <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 16px' }}>{p.reference}</td>
                  <td style={{ fontSize: 13, color: p.status === 'atrasado' ? '#EE3528' : '#1F1B1A', padding: '12px 16px' }}>{formatDate(p.dueDate)}</td>
                  <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 16px' }}>{p.paidDate ? formatDate(p.paidDate) : '—'}</td>
                  <td style={{ fontSize: 13, fontWeight: 700, color: '#1F1B1A', padding: '12px 16px' }}>{formatCurrency(p.value)}</td>
                  <td style={{ fontSize: 13, color: 'rgba(31,27,26,0.6)', padding: '12px 16px' }}>{p.method || '—'}</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={p.status} size="sm" /></td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.status !== 'pago' && (
                      <button style={{ background: 'none', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#1F1B1A' }}>
                        Marcar pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
