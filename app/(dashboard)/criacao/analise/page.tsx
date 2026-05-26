'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Check } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useClients } from '@/context/ClientsContext'

type AnaliseResult = {
  diagnosticoGeral?: string
  pontosFortes?: string[]
  pontosFracos?: string[]
  ajustesRapidos?: string[]
  sugestoesBio?: Array<{ versao: number; texto: string }>
  pilaresEditoriais?: Array<{ pilar: string; descricao: string; exemplosPautas: string[] }>
  proximosConteudos?: Array<{ formato: string; tema: string; objetivo: string; prioridade: string }>
  raw?: string
}

const PRIORITY_COLORS: Record<string, { bg: string; color: string }> = {
  alta: { bg: '#fee2e2', color: '#991b1b' },
  media: { bg: '#fef3c7', color: '#92400e' },
  baixa: { bg: '#f3f4f6', color: '#6b7280' },
}

export default function AnalisePage() {
  const router = useRouter()
  const { clients } = useClients()
  const font = "'Inter', system-ui, sans-serif"

  const [clientId, setClientId] = useState('')
  const [form, setForm] = useState({
    brandName: '', bio: '', segment: '', product: '', audience: '',
    pains: '', differentials: '', topics: '', competitors: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnaliseResult | null>(null)
  const [error, setError] = useState('')

  function loadClient(id: string) {
    setClientId(id)
    const c = clients.find(cl => cl.id === id)
    if (c) {
      setForm({
        brandName: c.name,
        bio: '',
        segment: c.segment,
        product: c.servicePackage || '',
        audience: c.persona || '',
        pains: '',
        differentials: c.positioning || '',
        topics: c.contentPillars?.join(', ') || '',
        competitors: '',
      })
    }
  }

  async function handleAnalyze() {
    if (!form.brandName || !form.segment) { setError('Preencha nome e segmento.'); return }
    setError(''); setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'analise', data: form }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Erro.')
      else setResult(data.result)
    } catch { setError('Erro de conexão.') }
    setLoading(false)
  }

  const inputStyle = { width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: 11, fontWeight: 700 as const, color: 'var(--text-2)' as const, textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'block' as const, marginBottom: 6 }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Análise de Perfil" subtitle="Diagnóstico estratégico completo do Instagram" />
      <div className="page-pad" style={{ fontFamily: font }}>
        <button onClick={() => router.push('/criacao')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: 0 }}>
          <ArrowLeft size={14} /> Voltar
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '380px 1fr' : '540px 1fr', gap: 24, alignItems: 'start' }}>
          {/* FORM */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, position: 'sticky', top: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Dados do <span style={{ color: '#3B82F6' }}>perfil</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Carregar cliente da base</label>
                <select value={clientId} onChange={e => loadClient(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Selecione para pré-preencher...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ height: 1, background: 'var(--border-3)' }} />

              {[
                { key: 'brandName', label: 'Nome da marca *', placeholder: 'Ex: Madbucks' },
                { key: 'bio', label: 'Bio atual', placeholder: 'Cole a bio atual do Instagram...' },
                { key: 'segment', label: 'Segmento *', placeholder: 'Ex: Cuidados com tattoo premium' },
                { key: 'product', label: 'Produto / serviço principal', placeholder: 'Ex: Tattoo Balm e Balm Stick' },
                { key: 'audience', label: 'Público-alvo', placeholder: 'Ex: Pessoas tatuadas entre 20-40 anos...' },
                { key: 'pains', label: 'Principais dores do público', placeholder: 'Ex: Tattoo perdendo cor, ressecamento...' },
                { key: 'differentials', label: 'Diferenciais da marca', placeholder: 'Ex: Fórmula específica para pele tatuada...' },
                { key: 'topics', label: 'Temas mais abordados', placeholder: 'Ex: Cuidados, tutoriais, rotina...' },
                { key: 'competitors', label: 'Concorrentes / referências', placeholder: 'Ex: @marca1, @marca2' },
              ].map(field => (
                <div key={field.key}>
                  <label style={labelStyle}>{field.label}</label>
                  {field.key === 'bio' || field.key === 'pains' || field.key === 'audience' ? (
                    <textarea value={form[field.key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} placeholder={field.placeholder} rows={2} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                  ) : (
                    <input value={form[field.key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} placeholder={field.placeholder} style={inputStyle} />
                  )}
                </div>
              ))}

              {error && <p style={{ fontSize: 12, color: '#EE3528', background: '#fee2e2', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

              <button onClick={handleAnalyze} disabled={loading}
                style={{ background: loading ? 'rgba(59,130,246,0.6)' : '#3B82F6', color: '#FFFFFF', border: 'none', borderRadius: 999, padding: '13px', fontSize: 13, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: font }}>
                {loading ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Analisando...</> : <><Sparkles size={14} /> Analisar perfil</>}
              </button>
            </div>
          </div>

          {/* RESULT */}
          {!result && !loading && (
            <div style={{ background: 'var(--bg-2)', borderRadius: 16, padding: 60, textAlign: 'center' }}>
              <Sparkles size={40} style={{ margin: '0 auto 16px', opacity: 0.3, color: 'var(--text-3)' }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Diagnóstico estratégico</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Preencha os dados do perfil e clique em Analisar.</p>
            </div>
          )}
          {loading && (
            <div style={{ background: 'var(--bg-2)', borderRadius: 16, padding: 60, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(59,130,246,0.2)', borderTop: '3px solid #3B82F6', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.7s linear infinite' }} />
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Analisando perfil estrategicamente...</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {result.diagnosticoGeral && (
                <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 14, padding: '20px 22px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Diagnóstico geral</p>
                  <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{result.diagnosticoGeral}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {result.pontosFortes && (
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>✓ Pontos fortes</p>
                    {result.pontosFortes.map((p, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <Check size={12} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                        <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{p}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.pontosFracos && (
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#EE3528', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>✗ Pontos fracos</p>
                    {result.pontosFracos.map((p, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EE3528', flexShrink: 0, marginTop: 2 }} />
                        <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{p}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {result.ajustesRapidos && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Ajustes rápidos</p>
                  {result.ajustesRapidos.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, padding: '8px 10px', background: '#fef9c3', borderRadius: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e', flexShrink: 0 }}>{i + 1}.</span>
                      <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>{a}</p>
                    </div>
                  ))}
                </div>
              )}

              {result.sugestoesBio && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Sugestões de nova bio</p>
                  {result.sugestoesBio.map((b, i) => (
                    <div key={i} style={{ marginBottom: 10, padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 10, borderLeft: '3px solid #3B82F6' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', marginBottom: 4 }}>VERSÃO {b.versao}</p>
                      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{b.texto}</p>
                    </div>
                  ))}
                </div>
              )}

              {result.pilaresEditoriais && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Pilares editoriais recomendados</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.pilaresEditoriais.map((p, i) => (
                      <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 10 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#8B5CF6', marginBottom: 4 }}>{p.pilar}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>{p.descricao}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {p.exemplosPautas?.map((e, j) => (
                            <span key={j} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>{e}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.proximosConteudos && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Próximos conteúdos prioritários</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.proximosConteudos.map((c, i) => {
                      const prio = PRIORITY_COLORS[c.prioridade] || PRIORITY_COLORS.baixa
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 10 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: prio.bg, color: prio.color, flexShrink: 0, marginTop: 1 }}>{c.prioridade}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{c.tema}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-2)' }}>{c.formato} · {c.objetivo}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
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
