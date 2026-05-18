'use client'

import { useState } from 'react'
import { Download, FileText, BarChart2, Calendar } from 'lucide-react'
import Header from '@/components/layout/Header'
import { clients, instagramAccounts } from '@/lib/mock-data'
import { formatNumber, formatCurrency } from '@/lib/utils'

const REPORT_TYPES = [
  { id: 'mensal', label: 'Mensal', icon: Calendar, description: 'Relatório completo do mês com todas as métricas' },
  { id: 'semanal', label: 'Semanal', icon: BarChart2, description: 'Resumo da semana: posts, alcance e engajamento' },
  { id: 'campanha', label: 'Campanha', icon: FileText, description: 'Resultado de uma campanha ou período específico' },
]

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function RelatoriosPage() {
  const [selectedClient, setSelectedClient] = useState('c1')
  const [reportType, setReportType] = useState('mensal')
  const [selectedMonth, setSelectedMonth] = useState('5')
  const [generated, setGenerated] = useState(false)

  const client = clients.find(c => c.id === selectedClient)
  const ig = instagramAccounts.find(ig => ig.clientId === selectedClient)

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Header title="Relatórios" subtitle="Gere relatórios de performance para seus clientes" />

      <div style={{ padding: '24px 28px', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
          {/* Config panel */}
          <div>
            <div style={{ background: '#F5F4F2', borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A', marginBottom: 14 }}>Configuração</h3>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(31,27,26,0.5)', display: 'block', marginBottom: 8 }}>Cliente</label>
                <select
                  value={selectedClient}
                  onChange={e => { setSelectedClient(e.target.value); setGenerated(false) }}
                  style={{ width: '100%', border: '1px solid rgba(31,27,26,0.15)', borderRadius: 10, padding: '9px 12px', fontSize: 13, background: '#FFFFFF', color: '#1F1B1A', outline: 'none' }}
                >
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(31,27,26,0.5)', display: 'block', marginBottom: 8 }}>Período</label>
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  style={{ width: '100%', border: '1px solid rgba(31,27,26,0.15)', borderRadius: 10, padding: '9px 12px', fontSize: 13, background: '#FFFFFF', color: '#1F1B1A', outline: 'none' }}
                >
                  {MONTHS.map((m, i) => <option key={i} value={i}>{m} 2025</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(31,27,26,0.5)', display: 'block', marginBottom: 8 }}>Tipo de relatório</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {REPORT_TYPES.map(rt => (
                    <button
                      key={rt.id}
                      onClick={() => setReportType(rt.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: reportType === rt.id ? 'rgba(242,91,165,0.08)' : '#FFFFFF',
                        border: `1px solid ${reportType === rt.id ? '#F25BA5' : 'rgba(31,27,26,0.10)'}`,
                        borderRadius: 10, padding: '10px 12px',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                      }}
                    >
                      <rt.icon size={16} style={{ color: reportType === rt.id ? '#F25BA5' : 'rgba(31,27,26,0.4)', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: reportType === rt.id ? '#F25BA5' : '#1F1B1A' }}>{rt.label}</p>
                        <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.45)', marginTop: 1 }}>{rt.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setGenerated(true)}
                style={{ width: '100%', background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, padding: '11px', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Gerar relatório
              </button>
            </div>
          </div>

          {/* Preview */}
          <div>
            {!generated ? (
              <div style={{ background: '#F5F4F2', borderRadius: 14, padding: 60, textAlign: 'center' }}>
                <FileText size={40} style={{ color: 'rgba(31,27,26,0.2)', margin: '0 auto 16px' }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1F1B1A', marginBottom: 8 }}>Configure e gere um relatório</p>
                <p style={{ fontSize: 13, color: 'rgba(31,27,26,0.5)' }}>Selecione o cliente, período e tipo de relatório para visualizar a prévia.</p>
              </div>
            ) : (
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 14, overflow: 'hidden' }}>
                {/* Report header */}
                <div style={{ background: '#1F1B1A', padding: '32px 36px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: 11, color: 'rgba(255,252,236,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Relatório {REPORT_TYPES.find(r => r.id === reportType)?.label}</p>
                      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#FFFFFF' }}>{client?.name}</h2>
                      <p style={{ color: 'rgba(255,252,236,0.5)', fontSize: 14, marginTop: 4 }}>{MONTHS[parseInt(selectedMonth)]} 2025 · {client?.instagramHandle}</p>
                    </div>
                    <div style={{ background: '#F25BA5', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Playfair Display'", color: '#FFFFFF', fontWeight: 600, fontSize: 18 }}>i.</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ padding: '28px 36px' }}>
                  {ig && ig.connected ? (
                    <>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(31,27,26,0.5)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Métricas do período
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
                        {[
                          { label: 'Seguidores', value: formatNumber(ig.followers), change: `+${ig.newFollowers30d}` },
                          { label: 'Alcance', value: formatNumber(ig.reach30d), change: '+12%' },
                          { label: 'Engajamento', value: `${ig.engagementRate}%`, change: '+0.3%' },
                          { label: 'Impressões', value: formatNumber(ig.impressions30d), change: '+8%' },
                          { label: 'Views reels', value: formatNumber(ig.reelsViews30d), change: '+24%' },
                          { label: 'Stories views', value: formatNumber(ig.storiesViews30d), change: '+5%' },
                        ].map(m => (
                          <div key={m.label} style={{ background: '#F5F4F2', borderRadius: 10, padding: '14px' }}>
                            <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.5)', fontWeight: 600 }}>{m.label}</p>
                            <p style={{ fontSize: 22, fontWeight: 700, color: '#1F1B1A', margin: '4px 0 2px' }}>{m.value}</p>
                            <p style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>{m.change} vs. mês ant.</p>
                          </div>
                        ))}
                      </div>

                      <div style={{ background: '#F5F4F2', borderRadius: 10, padding: '16px 20px', marginBottom: 20 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1F1B1A', marginBottom: 10 }}>Análise e recomendações</h4>
                        <p style={{ fontSize: 13, color: 'rgba(31,27,26,0.7)', lineHeight: 1.7 }}>
                          O mês de {MONTHS[parseInt(selectedMonth)]} apresentou resultados <strong>acima da média</strong> em termos de alcance e engajamento.
                          Os Reels continuam sendo o formato de maior performance, com destaque para o conteúdo educativo.
                          <br /><br />
                          <strong>Recomendações:</strong> Aumentar a frequência de Reels educativos, explorar colaborações com criadores do nicho, e testar novos formatos de Stories interativos.
                        </p>
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: 13, color: 'rgba(31,27,26,0.5)' }}>Instagram não conectado. Conecte a conta para incluir métricas reais.</p>
                  )}

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid rgba(31,27,26,0.08)' }}>
                    <button
                      disabled
                      style={{ background: '#F5F4F2', color: 'rgba(31,27,26,0.4)', borderRadius: 999, padding: '10px 20px', border: '1px solid rgba(31,27,26,0.10)', fontSize: 13, fontWeight: 600, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Download size={14} /> Exportar PDF (em breve)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
