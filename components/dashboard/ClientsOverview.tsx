import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { clients, instagramAccounts } from '@/lib/mock-data'
import { getClientStatusDot, formatNumber } from '@/lib/utils'

export default function ClientsOverview() {
  const activeClients = clients.filter(c => c.status === 'ativo' || c.status === 'onboarding').slice(0, 5)

  return (
    <div
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
      className="rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Clientes ativos</h3>
        <Link href="/clientes" style={{ fontSize: 12, color: '#FC75A0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }} className="hover:underline">
          Ver todos <ArrowRight size={11} />
        </Link>
      </div>

      <div className="space-y-3">
        {activeClients.map((client) => {
          const ig = instagramAccounts.find(ig => ig.clientId === client.id)
          return (
            <Link
              key={client.id}
              href={`/clientes/${client.id}`}
              className="flex items-center gap-3 group"
            >
              {/* Avatar */}
              <div
                style={{ background: client.color, color: '#FFFFFF', fontSize: 12, fontWeight: 700, width: 34, height: 34, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {client.initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    style={{ width: 6, height: 6, borderRadius: '50%', background: client.status === 'ativo' ? '#10B981' : client.status === 'onboarding' ? '#3B82F6' : '#F59E0B', flexShrink: 0, display: 'inline-block' }}
                  />
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }} className="truncate group-hover:text-[#FC75A0] transition-colors">
                    {client.name}
                  </p>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }} className="truncate">
                  {client.segment}
                </p>
              </div>

              {ig && ig.connected && (
                <div className="text-right flex-shrink-0">
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{formatNumber(ig.followers)}</p>
                  <p style={{ fontSize: 11, color: ig.engagementRate >= 4 ? '#10B981' : ig.engagementRate >= 3 ? '#F59E0B' : '#EE3528' }}>
                    {ig.engagementRate}% eng.
                  </p>
                </div>
              )}
              {ig && !ig.connected && (
                <span style={{ fontSize: 11, color: 'var(--text-4)' }}>N/C</span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
