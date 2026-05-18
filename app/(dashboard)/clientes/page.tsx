'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Camera } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/ui/StatusBadge'
import { useClients } from '@/context/ClientsContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { ClientStatus } from '@/lib/types'

const statusFilters: { label: string; value: ClientStatus | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Ativos', value: 'ativo' },
  { label: 'Onboarding', value: 'onboarding' },
  { label: 'Pausados', value: 'pausado' },
  { label: 'Encerrados', value: 'encerrado' },
]

export default function ClientesPage() {
  const { clients } = useClients()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'todos'>('todos')

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.segment.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: clients.length,
    ativos: clients.filter(c => c.status === 'ativo').length,
    pausados: clients.filter(c => c.status === 'pausado').length,
    onboarding: clients.filter(c => c.status === 'onboarding').length,
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Clientes" subtitle="Gerencie sua carteira de clientes" />

      <div className="page-pad">
        {/* Stats bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: stats.total, color: 'var(--text)' },
            { label: 'Ativos', value: stats.ativos, color: '#10B981' },
            { label: 'Onboarding', value: stats.onboarding, color: '#3B82F6' },
            { label: 'Pausados', value: stats.pausados, color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 18px', fontFamily: "'Inter', system-ui, sans-serif" }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <Link
            href="/clientes/novo"
            style={{
              background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, padding: '10px 20px',
              fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 7, textDecoration: 'none',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
            className="hover:opacity-90 transition-opacity self-center"
          >
            <Plus size={15} /> Novo cliente
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', fontFamily: "'Inter', system-ui, sans-serif", flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} />
            <input
              type="text"
              placeholder="Buscar por nome ou segmento..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 999, padding: '9px 14px 9px 34px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          {/* Status filters */}
          <div style={{ display: 'flex', gap: 6 }}>
            {statusFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                style={{
                  background: statusFilter === f.value ? '#F25BA5' : '#F5F4F2',
                  color: statusFilter === f.value ? '#FFFFFF' : '#1F1B1A',
                  border: `1px solid ${statusFilter === f.value ? '#F25BA5' : 'var(--border)'}`,
                  borderRadius: 999,
                  padding: '7px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  transition: 'all 0.15s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="rg-3" style={{ gap: 16 }}>
          {filtered.map(client => (
            <Link
              key={client.id}
              href={`/clientes/${client.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: 20,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  transition: 'box-shadow 0.15s',
                  cursor: 'pointer',
                }}
                className="hover:shadow-md"
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{ width: 44, height: 44, borderRadius: '50%', background: client.color, color: client.color === '#F2F4A4' || client.color === '#FBD0DA' ? '#1F1B1A' : '#FFFFFF', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      {client.initials}
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{client.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{client.segment}</p>
                    </div>
                  </div>
                  <StatusBadge status={client.status} size="sm" />
                </div>

                {/* Instagram */}
                {client.instagramHandle && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 14, fontSize: 12, color: 'var(--text-2)' }}>
                    <Camera size={12} />
                    <span>{client.instagramHandle}</span>
                  </div>
                )}

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border-3)', paddingTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Mensalidade</p>
                      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: 'var(--text)', marginTop: 3 }}>{formatCurrency(client.monthlyValue)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Próx. pgto.</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: client.paymentStatus === 'atrasado' ? '#EE3528' : '#1F1B1A', marginTop: 3 }}>
                        {formatDate(client.nextPaymentDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Package */}
                <div style={{ marginTop: 12, background: 'var(--bg-2)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-2)' }}>
                  {client.servicePackage}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <p style={{ fontSize: 15, color: 'var(--text-4)' }}>Nenhum cliente encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
