'use client'

import { useState, useMemo } from 'react'
import { Plus, X } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/ui/StatusBadge'
import { usePayments } from '@/context/PaymentsContext'
import { useClients } from '@/context/ClientsContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { PaymentStatus } from '@/lib/types'

const PIE_COLORS = ['#FC75A0', '#F19877', '#FBD0DA', '#F2F4A4', '#292929', '#86efac']

const emptyForm = {
  clientId: '', value: '', dueDate: '', reference: '', method: '', status: 'pendente' as PaymentStatus,
}

export default function FinanceiroPage() {
  const { payments, addPayment, updatePayment, isReady } = usePayments()
  const { clients } = useClients()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const font = "'Inter', system-ui, sans-serif"

  const pieData = clients.filter(c => c.status !== 'encerrado').map(c => ({
    name: c.name,
    value: c.monthlyValue,
    color: c.color,
  }))

  const totalPrevisto = clients.filter(c => c.status !== 'encerrado').reduce((a, c) => a + c.monthlyValue, 0)
  const totalRecebido = payments.filter(p => p.status === 'pago').reduce((a, p) => a + p.value, 0)
  const totalPendente = payments.filter(p => p.status === 'pendente').reduce((a, p) => a + p.value, 0)
  const totalAtrasado = payments.filter(p => p.status === 'atrasado').reduce((a, p) => a + p.value, 0)

  const revenueByMonth = useMemo(() => {
    const months: Record<string, { month: string; previsto: number; recebido: number; pendente: number }> = {}
    payments.forEach(p => {
      const m = p.dueDate.slice(0, 7)
      const label = new Date(p.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })
      if (!months[m]) months[m] = { month: label.charAt(0).toUpperCase() + label.slice(1, 3), previsto: 0, recebido: 0, pendente: 0 }
      months[m].previsto += p.value
      if (p.status === 'pago') months[m].recebido += p.value
      else months[m].pendente += p.value
    })
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month))
  }, [payments])

  async function handleAdd() {
    if (!form.clientId || !form.value || !form.dueDate || !form.reference) return
    const client = clients.find(c => c.id === form.clientId)
    if (!client) return
    await addPayment({
      clientId: form.clientId,
      clientName: client.name,
      value: Number(form.value),
      dueDate: form.dueDate,
      reference: form.reference,
      method: form.method || undefined,
      status: form.status,
    })
    setForm(emptyForm)
    setShowModal(false)
  }

  async function handleMarkPaid(id: string) {
    await updatePayment(id, { status: 'pago', paidDate: new Date().toISOString().split('T')[0] })
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Financeiro" subtitle="Controle de receitas e pagamentos" />

      <div className="page-pad" style={{ fontFamily: font }}>
        {/* Top cards */}
        <div className="rg-4" style={{ gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Receita prevista (jun)', value: formatCurrency(totalPrevisto), color: 'var(--text)', bg: 'var(--bg-2)' },
            { label: 'Receita recebida (total)', value: formatCurrency(totalRecebido), color: '#10B981', bg: '#d1fae5' },
            { label: 'Pendente', value: formatCurrency(totalPendente), color: '#F59E0B', bg: '#fef9c3' },
            { label: 'Inadimplente', value: formatCurrency(totalAtrasado), color: '#EE3528', bg: '#fee2e2' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '16px 18px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: s.color, marginTop: 8 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="rg-chart" style={{ gap: 20, marginBottom: 24 }}>
          {/* Bar chart */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 20px 10px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 18 }}>Receita mensal — últimos 6 meses</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueByMonth} barSize={18} barGap={4}>
                <CartesianGrid strokeDasharray="0" stroke="var(--border-3)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-2)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-4)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, fontFamily: 'Inter', fontSize: 12 }} formatter={(v: unknown) => formatCurrency(v as number)} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter' }} />
                <Bar dataKey="previsto" name="Previsto" fill="var(--bg-3)" stroke="#FC75A0" strokeWidth={1} radius={[4,4,0,0]} />
                <Bar dataKey="recebido" name="Recebido" fill="#FC75A0" radius={[4,4,0,0]} />
                <Bar dataKey="pendente" name="Pendente" fill="#FBD0DA" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Receita por cliente</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'Inter', fontSize: 12 }} formatter={(v: unknown) => formatCurrency(v as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', flexShrink: 0 }}>{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payments table */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Todos os pagamentos</h3>
            <button
              onClick={() => setShowModal(true)}
              style={{ background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, padding: '7px 16px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              + Registrar pagamento
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-2)' }}>
              <tr>
                {['Cliente', 'Referência', 'Vencimento', 'Pagamento', 'Valor', 'Método', 'Status', ''].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textAlign: 'left', padding: '12px 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--border-3)' }}>
                  <td style={{ fontSize: 13, color: 'var(--text)', padding: '12px 16px', fontWeight: 600 }}>{p.clientName}</td>
                  <td style={{ fontSize: 13, color: 'var(--text)', padding: '12px 16px' }}>{p.reference}</td>
                  <td style={{ fontSize: 13, color: p.status === 'atrasado' ? '#EE3528' : 'var(--text)', padding: '12px 16px' }}>{formatDate(p.dueDate)}</td>
                  <td style={{ fontSize: 13, color: 'var(--text)', padding: '12px 16px' }}>{p.paidDate ? formatDate(p.paidDate) : '—'}</td>
                  <td style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', padding: '12px 16px' }}>{formatCurrency(p.value)}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)', padding: '12px 16px' }}>{p.method || '—'}</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={p.status} size="sm" /></td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.status !== 'pago' && (
                      <button
                        onClick={() => handleMarkPaid(p.id)}
                        style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: 'var(--text)' }}
                      >
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

      {/* ── MODAL REGISTRAR PAGAMENTO ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--overlay)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(2px)',
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520,
            boxShadow: '0 24px 64px var(--shadow)', fontFamily: font,
          }} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>
                Registrar <span style={{ color: '#FC75A0' }}>pagamento</span>
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Cliente *</label>
                <select
                  value={form.clientId}
                  onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
                  style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                >
                  <option value="">Selecione...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Valor (R$) *</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                    placeholder="0,00"
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Vencimento *</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Referência *</label>
                <input
                  value={form.reference}
                  onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
                  placeholder="Ex: Junho/2025"
                  style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Método</label>
                  <select
                    value={form.method}
                    onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                  >
                    <option value="">—</option>
                    <option value="pix">Pix</option>
                    <option value="transferência">Transferência</option>
                    <option value="boleto">Boleto</option>
                    <option value="cartão">Cartão</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as PaymentStatus }))}
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="atrasado">Atrasado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
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
                  disabled={!form.clientId || !form.value || !form.dueDate || !form.reference}
                  style={{
                    flex: 2,
                    background: form.clientId && form.value && form.dueDate && form.reference ? '#FC75A0' : 'var(--border)',
                    color: form.clientId && form.value && form.dueDate && form.reference ? '#FFFFFF' : 'var(--text-4)',
                    borderRadius: 999, border: 'none', padding: '11px', fontSize: 13, fontWeight: 700,
                    cursor: form.clientId && form.value && form.dueDate && form.reference ? 'pointer' : 'not-allowed',
                    fontFamily: font, transition: 'all 0.15s',
                  }}
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
