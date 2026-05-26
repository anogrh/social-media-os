'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, TrendingUp, TrendingDown, X, Check, Trash2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useClients } from '@/context/ClientsContext'

type LearningEntry = {
  id: string; clientId: string; clientName: string; type: 'sucesso' | 'falha'
  format: string; theme: string; hook: string; result: string; metric: string
  metricValue: string; observation: string; date: string
}

const FORMATS = ['Reels', 'Carrossel', 'Stories', 'Post estático', 'Legenda', 'Outro']
const METRICS = ['Alcance', 'Impressões', 'Salvamentos', 'Compartilhamentos', 'Comentários', 'Cliques no link', 'Leads', 'Vendas', 'Retenção de vídeo']

const emptyForm: Omit<LearningEntry, 'id' | 'clientName' | 'date'> = {
  clientId: '', type: 'sucesso', format: '', theme: '', hook: '',
  result: '', metric: '', metricValue: '', observation: '',
}

export default function AprendizadoPage() {
  const router = useRouter()
  const { clients } = useClients()
  const font = "'Inter', system-ui, sans-serif"
  const [entries, setEntries] = useState<LearningEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [filterClient, setFilterClient] = useState('')
  const [filterType, setFilterType] = useState<'todos' | 'sucesso' | 'falha'>('todos')

  useEffect(() => {
    const stored = localStorage.getItem('sm_learning_entries')
    if (stored) try { setEntries(JSON.parse(stored)) } catch {}
  }, [])

  function save(updated: LearningEntry[]) {
    setEntries(updated)
    localStorage.setItem('sm_learning_entries', JSON.stringify(updated))
  }

  function handleSubmit() {
    if (!form.clientId || !form.theme) return
    const client = clients.find(c => c.id === form.clientId)
    save([{ ...form, id: Date.now().toString(), clientName: client?.name || '', date: new Date().toISOString().split('T')[0] }, ...entries])
    setForm(emptyForm); setShowForm(false)
  }

  const filtered = entries
    .filter(e => !filterClient || e.clientId === filterClient)
    .filter(e => filterType === 'todos' || e.type === filterType)

  const successCount = entries.filter(e => e.type === 'sucesso').length
  const failCount = entries.filter(e => e.type === 'falha').length

  // Group by client for insights
  const clientInsights = clients.map(c => {
    const clientEntries = entries.filter(e => e.clientId === c.id)
    const successes = clientEntries.filter(e => e.type === 'sucesso')
    const fails = clientEntries.filter(e => e.type === 'falha')
    return { client: c, successes, fails, total: clientEntries.length }
  }).filter(ci => ci.total > 0)

  const inputStyle = { width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: 11, fontWeight: 700 as const, color: 'var(--text-2)' as const, textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'block' as const, marginBottom: 6 }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Aprendizado" subtitle="Registre resultados para a IA melhorar com cada cliente" />
      <div className="page-pad" style={{ fontFamily: font }}>
        <button onClick={() => router.push('/criacao')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: 0 }}>
          <ArrowLeft size={14} /> Voltar
        </button>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total de registros', value: entries.length, color: 'var(--text)', bg: 'var(--bg-2)' },
            { label: 'O que funcionou', value: successCount, color: '#10B981', bg: '#d1fae5' },
            { label: 'O que falhou', value: failCount, color: '#EE3528', bg: '#fee2e2' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: showForm ? '1fr 420px' : '1fr', gap: 24 }}>
          <div>
            {/* Filters + add */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <select value={filterClient} onChange={e => setFilterClient(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 180 }}>
                <option value="">Todos os clientes</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {(['todos', 'sucesso', 'falha'] as const).map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  style={{ padding: '8px 14px', borderRadius: 999, border: `1.5px solid ${filterType === t ? (t === 'sucesso' ? '#10B981' : t === 'falha' ? '#EE3528' : '#FC75A0') : 'var(--border)'}`, background: filterType === t ? (t === 'sucesso' ? 'rgba(16,185,129,0.08)' : t === 'falha' ? 'rgba(238,53,40,0.08)' : 'rgba(252,117,160,0.08)') : 'var(--bg-2)', cursor: 'pointer', fontSize: 12, fontWeight: filterType === t ? 700 : 500, color: filterType === t ? (t === 'sucesso' ? '#10B981' : t === 'falha' ? '#EE3528' : '#FC75A0') : 'var(--text-2)', fontFamily: font }}>
                  {t === 'todos' ? 'Todos' : t === 'sucesso' ? '✓ Funcionou' : '✗ Falhou'}
                </button>
              ))}
              <button onClick={() => setShowForm(true)} style={{ marginLeft: 'auto', background: '#FC75A0', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: font }}>
                <Plus size={13} /> Registrar aprendizado
              </button>
            </div>

            {/* Insights por cliente */}
            {clientInsights.length > 0 && filtered.length === 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Resumo por cliente</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {clientInsights.map(ci => (
                    <div key={ci.client.id} style={{ background: 'var(--bg-2)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: ci.client.color || '#FC75A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                        {ci.client.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{ci.client.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-2)' }}>{ci.total} registro{ci.total > 1 ? 's' : ''}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981', background: '#d1fae5', padding: '3px 8px', borderRadius: 999 }}>✓ {ci.successes.length}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#EE3528', background: '#fee2e2', padding: '3px 8px', borderRadius: 999 }}>✗ {ci.fails.length}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Entries list */}
            {filtered.length === 0 && entries.length === 0 ? (
              <div style={{ background: 'var(--bg-2)', borderRadius: 14, padding: 48, textAlign: 'center' }}>
                <TrendingUp size={32} style={{ margin: '0 auto 12px', color: 'var(--text-4)' }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Nenhum registro ainda</p>
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Registre o que funcionou e o que falhou. A IA usa essas informações para melhorar o conteúdo de cada cliente.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map(e => (
                  <div key={e.id} style={{ background: 'var(--bg)', border: `1.5px solid ${e.type === 'sucesso' ? 'rgba(16,185,129,0.25)' : 'rgba(238,53,40,0.2)'}`, borderRadius: 12, padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: e.type === 'sucesso' ? '#d1fae5' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {e.type === 'sucesso' ? <TrendingUp size={13} color="#10B981" /> : <TrendingDown size={13} color="#EE3528" />}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{e.theme}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-2)' }}>{e.clientName} · {e.format} · {e.date}</p>
                        </div>
                      </div>
                      <button onClick={() => save(entries.filter(en => en.id !== e.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', padding: 4 }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                    {(e.result || e.hook || e.observation) && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-3)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {e.hook && <p style={{ fontSize: 12, color: 'var(--text-2)' }}><strong style={{ color: 'var(--text)' }}>Gancho:</strong> {e.hook}</p>}
                        {e.result && <p style={{ fontSize: 12, color: 'var(--text-2)' }}><strong style={{ color: 'var(--text)' }}>Resultado:</strong> {e.result}</p>}
                        {e.metric && e.metricValue && <p style={{ fontSize: 12, color: e.type === 'sucesso' ? '#10B981' : '#EE3528', fontWeight: 600 }}>{e.metric}: {e.metricValue}</p>}
                        {e.observation && <p style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>{e.observation}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, position: 'sticky', top: 24, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                  Registrar <span style={{ color: '#F59E0B' }}>aprendizado</span>
                </h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex' }}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Cliente</label>
                  <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Resultado</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[{ v: 'sucesso', l: '✓ Funcionou', c: '#10B981' }, { v: 'falha', l: '✗ Falhou', c: '#EE3528' }].map(t => (
                      <button key={t.v} onClick={() => setForm(f => ({ ...f, type: t.v as 'sucesso' | 'falha' }))}
                        style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1.5px solid ${form.type === t.v ? t.c : 'var(--border)'}`, background: form.type === t.v ? `${t.c}15` : 'var(--bg-2)', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: form.type === t.v ? t.c : 'var(--text-2)', fontFamily: font }}>
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Formato</label>
                    <select value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Selecione...</option>
                      {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Métrica principal</label>
                    <select value={form.metric} onChange={e => setForm(f => ({ ...f, metric: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Selecione...</option>
                      {METRICS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Tema do conteúdo *</label>
                  <input value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))} placeholder="Ex: Reels com opinião forte sobre cuidado de tattoo" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Gancho usado</label>
                  <input value={form.hook} onChange={e => setForm(f => ({ ...f, hook: e.target.value }))} placeholder="Ex: Seu hidratante comum está danificando sua tattoo" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Resultado obtido</label>
                  <input value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} placeholder="Ex: Muitos comentários e leads diretos" style={inputStyle} />
                </div>
                {form.metric && (
                  <div>
                    <label style={labelStyle}>Valor da métrica</label>
                    <input value={form.metricValue} onChange={e => setForm(f => ({ ...f, metricValue: e.target.value }))} placeholder="Ex: 12.400 alcance, 340 salvamentos" style={inputStyle} />
                  </div>
                )}
                <div>
                  <label style={labelStyle}>Observação qualitativa</label>
                  <textarea value={form.observation} onChange={e => setForm(f => ({ ...f, observation: e.target.value }))} placeholder="Ex: Funcionou porque o gancho era específico e direto. Usar mais esse estilo." rows={2} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleSubmit}
                    style={{ flex: 2, background: '#F59E0B', color: '#fff', border: 'none', borderRadius: 999, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: font }}>
                    <Check size={13} /> Registrar
                  </button>
                  <button onClick={() => setShowForm(false)} style={{ flex: 1, background: 'var(--bg-2)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 999, padding: '11px', fontSize: 13, cursor: 'pointer', fontFamily: font }}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
