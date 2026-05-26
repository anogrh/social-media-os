'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Copy, Check } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useClients } from '@/context/ClientsContext'

const STRATEGIES = [
  { value: 'vendas', label: 'Narrativa de vendas', desc: 'Apresentar produto, serviço ou campanha' },
  { value: 'objecoes', label: 'Quebrando objeções', desc: 'Responder dúvidas que impedem a compra' },
  { value: 'bastidores', label: 'Bastidores', desc: 'Processo, rotina, equipe ou prova de trabalho' },
  { value: 'conexao', label: 'Conexão humana', desc: 'Aproximar a marca do público' },
  { value: 'educativo', label: 'Educativo rápido', desc: 'Ensinar algo em poucos frames' },
  { value: 'prova_social', label: 'Prova social', desc: 'Depoimentos, resultados, antes e depois' },
]

const OBJECTIVES = [
  'Gerar respostas', 'Levar para o direct', 'Levar para o link da bio',
  'Aquecer para campanha', 'Vender produto', 'Reforçar autoridade',
  'Mostrar bastidor', 'Criar enquete',
]

const SALE_LEVELS = [
  { value: 'sem_venda', label: 'Sem venda' },
  { value: 'sutil', label: 'Venda sutil' },
  { value: 'direta', label: 'Venda direta' },
  { value: 'urgencia', label: 'Oferta com urgência' },
]

type StoryItem = {
  numero: number; texto: string; fundoIdeal: string
  ferramenta: string; configuracaoFerramenta: string; intencao: string
}
type StoriesResult = {
  sequencia?: StoryItem[]
  storyGancho?: string
  ctaFinal?: string
  checklistEstrategico?: string[]
  raw?: string
}

const TOOL_COLORS: Record<string, string> = {
  enquete: '#FC75A0', caixaPerguntas: '#8B5CF6', quiz: '#3B82F6',
  reacao: '#F59E0B', link: '#10B981', nenhuma: 'var(--text-3)',
}

export default function StoriesPage() {
  const router = useRouter()
  const { clients } = useClients()
  const font = "'Inter', system-ui, sans-serif"
  const [form, setForm] = useState({ clientId: '', strategy: '', objective: '', theme: '', saleLevel: 'sutil' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StoriesResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const selectedClient = clients.find(c => c.id === form.clientId)

  async function handleGenerate() {
    if (!form.theme || !form.strategy) { setError('Preencha o tema e a estratégia.'); return }
    setError(''); setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'stories',
          data: {
            client: selectedClient?.name || form.clientId,
            brandVoice: selectedClient?.brandVoice || '',
            product: selectedClient?.servicePackage || '',
            campaign: '',
            ...form,
            strategy: STRATEGIES.find(s => s.value === form.strategy)?.label || form.strategy,
            saleLevel: SALE_LEVELS.find(s => s.value === form.saleLevel)?.label || form.saleLevel,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Erro ao gerar.')
      else setResult(data.result)
    } catch { setError('Erro de conexão.') }
    setLoading(false)
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(''), 2000)
  }

  const inputStyle = { width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: 11, fontWeight: 700 as const, color: 'var(--text-2)' as const, textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'block' as const, marginBottom: 6 }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Criar Stories" subtitle="Sequências com gancho, desenvolvimento e CTA natural" />
      <div className="page-pad" style={{ fontFamily: font }}>
        <button onClick={() => router.push('/criacao')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: 0 }}>
          <ArrowLeft size={14} /> Voltar
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '380px 1fr' : '480px 1fr', gap: 24, alignItems: 'start' }}>
          {/* FORM */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, position: 'sticky', top: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Configurar <span style={{ color: '#8B5CF6' }}>Stories</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Cliente</label>
                <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Selecione...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Estratégia dos stories</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {STRATEGIES.map(s => (
                    <button key={s.value} onClick={() => setForm(f => ({ ...f, strategy: s.value }))}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${form.strategy === s.value ? '#8B5CF6' : 'var(--border)'}`, background: form.strategy === s.value ? 'rgba(139,92,246,0.06)' : 'var(--bg-2)', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: form.strategy === s.value ? '#8B5CF6' : 'var(--border-2)', flexShrink: 0, marginTop: 3 }} />
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: form.strategy === s.value ? '#8B5CF6' : 'var(--text)' }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Objetivo</label>
                <select value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Selecione...</option>
                  {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Tema / produto / assunto *</label>
                <textarea value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))} placeholder="Ex: Apresentar o Tattoo Balm como solução para tattoo antiga com menos definição." rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div>
                <label style={labelStyle}>Nível de venda</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {SALE_LEVELS.map(s => (
                    <button key={s.value} onClick={() => setForm(f => ({ ...f, saleLevel: s.value }))}
                      style={{ flex: 1, padding: '7px 4px', borderRadius: 8, border: `1.5px solid ${form.saleLevel === s.value ? '#8B5CF6' : 'var(--border)'}`, background: form.saleLevel === s.value ? 'rgba(139,92,246,0.06)' : 'var(--bg-2)', cursor: 'pointer', fontSize: 10, fontWeight: form.saleLevel === s.value ? 700 : 500, color: form.saleLevel === s.value ? '#8B5CF6' : 'var(--text-2)' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p style={{ fontSize: 12, color: '#EE3528', background: '#fee2e2', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

              <button onClick={handleGenerate} disabled={loading}
                style={{ background: loading ? 'rgba(139,92,246,0.6)' : '#8B5CF6', color: '#FFFFFF', border: 'none', borderRadius: 999, padding: '13px', fontSize: 13, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: font }}>
                {loading ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Gerando...</> : <><Sparkles size={14} /> Gerar Stories</>}
              </button>
            </div>
          </div>

          {/* RESULT */}
          {!result && !loading && (
            <div style={{ background: 'var(--bg-2)', borderRadius: 16, padding: 60, textAlign: 'center' }}>
              <Sparkles size={40} style={{ margin: '0 auto 16px', opacity: 0.3, color: 'var(--text-3)' }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Configure e gere sua sequência</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Preencha os campos ao lado e clique em Gerar Stories.</p>
            </div>
          )}

          {loading && (
            <div style={{ background: 'var(--bg-2)', borderRadius: 16, padding: 60, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8B5CF6', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.7s linear infinite' }} />
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Gerando sequência de stories...</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {result.sequencia && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.sequencia.map((s, i) => {
                      const toolColor = TOOL_COLORS[s.ferramenta] || 'var(--text-3)'
                      return (
                        <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{s.numero}</div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{s.intencao}</span>
                            </div>
                            {s.ferramenta !== 'nenhuma' && (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${toolColor}20`, color: toolColor }}>{s.ferramenta}</span>
                            )}
                          </div>
                          <div style={{ padding: 16 }}>
                            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.5, marginBottom: 10 }}>{s.texto}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: s.configuracaoFerramenta ? 6 : 0, fontStyle: 'italic' }}>Fundo: {s.fundoIdeal}</p>
                            {s.configuracaoFerramenta && s.ferramenta !== 'nenhuma' && (
                              <p style={{ fontSize: 12, color: toolColor, fontWeight: 600 }}>Sticker: {s.configuracaoFerramenta}</p>
                            )}
                            <button onClick={() => copyText(s.texto, `story-${i}`)} style={{ marginTop: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: copied === `story-${i}` ? '#065f46' : 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                              {copied === `story-${i}` ? <Check size={10} /> : <Copy size={10} />} Copiar texto
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {(result.storyGancho || result.ctaFinal) && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {result.storyGancho && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 6 }}>Gancho principal</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>"{result.storyGancho}"</p>
                    </div>
                  )}
                  {result.ctaFinal && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 6 }}>CTA final</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#8B5CF6', lineHeight: 1.5 }}>"{result.ctaFinal}"</p>
                    </div>
                  )}
                </div>
              )}

              {result.raw && <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}><pre style={{ fontSize: 12, color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{result.raw}</pre></div>}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
