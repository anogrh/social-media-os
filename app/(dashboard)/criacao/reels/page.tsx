'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Copy, Check, ChevronDown } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useClients } from '@/context/ClientsContext'

const FUNNEL = [
  { value: 'topo', label: 'Topo de funil', desc: 'Atrair novas pessoas, alcance e identificação' },
  { value: 'meio', label: 'Meio de funil', desc: 'Conexão, autoridade e confiança' },
  { value: 'fundo', label: 'Fundo de funil', desc: 'Levar para compra, direct ou link da bio' },
]

const APPROACHES = [
  { value: 'pauta_quente', label: 'Pauta quente', desc: 'Tendência, data ou acontecimento recente' },
  { value: 'opiniao_forte', label: 'Opinião forte', desc: 'Posicionamento claro contra ideia comum do nicho' },
  { value: 'desmistificacao', label: 'Desmistificação', desc: 'Quebra de mito ou confusão comum' },
  { value: 'tutorial', label: 'Tutorial rápido', desc: 'Conteúdo prático, passo a passo' },
  { value: 'erro_comum', label: 'Erro comum', desc: 'Falha que o público comete' },
  { value: 'transformacao', label: 'Antes e depois', desc: 'Prova, comparação ou evolução visual' },
  { value: 'storytelling', label: 'Storytelling curto', desc: 'Relato com começo, tensão e aprendizado' },
  { value: 'livre', label: 'Formato livre', desc: 'Ideia aberta sem formato definido' },
]

const SALE_LEVELS = [
  { value: 'sem_venda', label: 'Sem venda direta', desc: 'Apenas educativo ou de conexão' },
  { value: 'sutil', label: 'Venda sutil', desc: 'Produto como parte da solução' },
  { value: 'direta', label: 'Venda direta', desc: 'CTA claro para comprar ou contato' },
]

const VIDEO_STYLES = [
  { value: 'falado_camera', label: 'Falado para câmera' },
  { value: 'broll_narracao', label: 'B-roll com narração' },
  { value: 'texto_tela', label: 'Texto na tela sem fala' },
  { value: 'trend', label: 'Trend adaptada' },
  { value: 'demo_produto', label: 'Demonstração de produto' },
]

const DURATIONS = ['15 segundos', '30 segundos', '45 segundos', '60 segundos']

type ReelsResult = {
  hook?: { texto: string; tipo: string; justificativa: string }
  roteiro?: Array<{ tempo: string; fala: string; visual: string; textoCena: string; observacao: string }>
  cta?: { texto: string; tipo: string }
  direcaoVisual?: { cenario: string; iluminacao: string; takes: string; edicao: string; trilha: string }
  legenda?: string
  variacoesHook?: string[]
  checklistEstrategico?: string[]
  raw?: string
}

export default function ReelsPage() {
  const router = useRouter()
  const { clients } = useClients()
  const font = "'Inter', system-ui, sans-serif"

  const [form, setForm] = useState({
    clientId: '', funnelStage: '', approach: '', theme: '',
    saleLevel: 'sutil', videoStyle: 'falado_camera', duration: '30 segundos',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReelsResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const selectedClient = clients.find(c => c.id === form.clientId)

  async function handleGenerate() {
    if (!form.theme || !form.funnelStage) {
      setError('Preencha pelo menos o tema e o objetivo do Reels.')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reels',
          data: {
            client: selectedClient?.name || form.clientId,
            segment: selectedClient?.segment || '',
            brandVoice: selectedClient?.brandVoice || '',
            product: selectedClient?.servicePackage || '',
            campaign: '',
            ...form,
            funnelStage: FUNNEL.find(f => f.value === form.funnelStage)?.label || form.funnelStage,
            approach: APPROACHES.find(a => a.value === form.approach)?.label || form.approach,
            saleLevel: SALE_LEVELS.find(s => s.value === form.saleLevel)?.label || form.saleLevel,
            videoStyle: VIDEO_STYLES.find(v => v.value === form.videoStyle)?.label || form.videoStyle,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao gerar conteúdo.')
      } else {
        setResult(data.result)
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    }
    setLoading(false)
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const inputStyle = {
    width: '100%', border: '1px solid var(--border-2)', borderRadius: 12,
    padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)',
    outline: 'none', fontFamily: font, boxSizing: 'border-box' as const,
  }
  const labelStyle = {
    fontSize: 11, fontWeight: 700 as const, color: 'var(--text-2)' as const,
    textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'block' as const, marginBottom: 6,
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Criar Reels" subtitle="Roteiro completo com hook, desenvolvimento e direção visual" />

      <div className="page-pad" style={{ fontFamily: font }}>
        <button onClick={() => router.push('/criacao')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: 0 }}>
          <ArrowLeft size={14} /> Voltar para Criação
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '420px 1fr' : '520px 1fr', gap: 24, alignItems: 'start' }}>

          {/* ── FORM ── */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, position: 'sticky', top: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>
              Configurar <span style={{ color: '#FC75A0' }}>Reels</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Client */}
              <div>
                <label style={labelStyle}>Cliente / Perfil</label>
                <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Selecione um cliente...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Funnel */}
              <div>
                <label style={labelStyle}>Objetivo do Reels</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {FUNNEL.map(f => (
                    <button key={f.value} onClick={() => setForm(fm => ({ ...fm, funnelStage: f.value }))}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${form.funnelStage === f.value ? '#FC75A0' : 'var(--border)'}`, background: form.funnelStage === f.value ? 'rgba(252,117,160,0.06)' : 'var(--bg-2)', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${form.funnelStage === f.value ? '#FC75A0' : 'var(--border-2)'}`, background: form.funnelStage === f.value ? '#FC75A0' : 'transparent', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: form.funnelStage === f.value ? '#FC75A0' : 'var(--text)' }}>{f.label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{f.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Approach */}
              <div>
                <label style={labelStyle}>Tipo de abordagem</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.approach} onChange={e => setForm(f => ({ ...f, approach: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', paddingRight: 32 }}>
                    <option value="">Selecione...</option>
                    {APPROACHES.map(a => <option key={a.value} value={a.value}>{a.label} — {a.desc}</option>)}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Theme */}
              <div>
                <label style={labelStyle}>Tema ou assunto *</label>
                <textarea
                  value={form.theme}
                  onChange={e => setForm(f => ({ ...f, theme: e.target.value }))}
                  placeholder="Ex: Quero falar sobre como o leave-in ajuda a reduzir frizz no dia a dia."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>

              {/* Sale level */}
              <div>
                <label style={labelStyle}>Nível de intenção comercial</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {SALE_LEVELS.map(s => (
                    <button key={s.value} onClick={() => setForm(f => ({ ...f, saleLevel: s.value }))}
                      style={{ flex: 1, padding: '8px 6px', borderRadius: 10, border: `1.5px solid ${form.saleLevel === s.value ? '#FC75A0' : 'var(--border)'}`, background: form.saleLevel === s.value ? 'rgba(252,117,160,0.06)' : 'var(--bg-2)', cursor: 'pointer', fontSize: 11, fontWeight: form.saleLevel === s.value ? 700 : 500, color: form.saleLevel === s.value ? '#FC75A0' : 'var(--text-2)' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video style + duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Estilo do vídeo</label>
                  <select value={form.videoStyle} onChange={e => setForm(f => ({ ...f, videoStyle: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {VIDEO_STYLES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Duração</label>
                  <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {error && <p style={{ fontSize: 12, color: '#EE3528', background: '#fee2e2', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

              <button onClick={handleGenerate} disabled={loading}
                style={{ background: loading ? 'rgba(252,117,160,0.6)' : '#FC75A0', color: '#FFFFFF', border: 'none', borderRadius: 999, padding: '13px', fontSize: 13, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: font }}>
                {loading
                  ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Gerando roteiro...</>
                  : <><Sparkles size={14} /> Gerar Reels</>}
              </button>
            </div>
          </div>

          {/* ── RESULT ── */}
          {!result && !loading && (
            <div style={{ background: 'var(--bg-2)', borderRadius: 16, padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
              <Sparkles size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Configure e gere seu roteiro</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Preencha os campos ao lado e clique em Gerar Reels.</p>
            </div>
          )}

          {loading && (
            <div style={{ background: 'var(--bg-2)', borderRadius: 16, padding: 60, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(252,117,160,0.2)', borderTop: '3px solid #FC75A0', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.7s linear infinite' }} />
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Gerando roteiro estratégico...</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Hook */}
              {result.hook && (
                <ResultCard title="Hook — Primeiros 3 segundos" accent="#FC75A0">
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8 }}>"{result.hook.texto}"</p>
                  <p style={{ fontSize: 12, color: '#FC75A0', fontWeight: 600, marginBottom: 4 }}>Tipo: {result.hook.tipo}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{result.hook.justificativa}</p>
                  <CopyBtn text={result.hook.texto} id="hook" copied={copied} onCopy={copyText} />
                </ResultCard>
              )}

              {/* Variações de hook */}
              {result.variacoesHook && result.variacoesHook.length > 0 && (
                <ResultCard title="Variações de gancho" accent="#F19877">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.variacoesHook.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, background: 'var(--bg-3)', borderRadius: 8, padding: '10px 12px' }}>
                        <p style={{ fontSize: 13, color: 'var(--text)', flex: 1 }}>"{h}"</p>
                        <CopyBtn text={h} id={`hook-var-${i}`} copied={copied} onCopy={copyText} small />
                      </div>
                    ))}
                  </div>
                </ResultCard>
              )}

              {/* Roteiro */}
              {result.roteiro && result.roteiro.length > 0 && (
                <ResultCard title="Roteiro completo" accent="#8B5CF6">
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-3)' }}>
                          {['Tempo', 'Fala', 'Visual/Cena', 'Texto na tela', 'Obs'].map(h => (
                            <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: 'var(--text-2)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.roteiro.map((r, i) => (
                          <tr key={i} style={{ borderTop: '1px solid var(--border-3)' }}>
                            <td style={{ padding: '10px 10px', color: '#8B5CF6', fontWeight: 700, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{r.tempo}</td>
                            <td style={{ padding: '10px 10px', color: 'var(--text)', lineHeight: 1.5, verticalAlign: 'top' }}>{r.fala}</td>
                            <td style={{ padding: '10px 10px', color: 'var(--text-2)', lineHeight: 1.5, verticalAlign: 'top' }}>{r.visual}</td>
                            <td style={{ padding: '10px 10px', color: 'var(--text-2)', lineHeight: 1.5, verticalAlign: 'top' }}>{r.textoCena}</td>
                            <td style={{ padding: '10px 10px', color: 'var(--text-3)', lineHeight: 1.5, verticalAlign: 'top', minWidth: 120 }}>{r.observacao}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ResultCard>
              )}

              {/* CTA */}
              {result.cta && (
                <ResultCard title="CTA Final" accent="#10B981">
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>"{result.cta.texto}"</p>
                  <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Tipo: {result.cta.tipo}</p>
                  <CopyBtn text={result.cta.texto} id="cta" copied={copied} onCopy={copyText} />
                </ResultCard>
              )}

              {/* Direção visual */}
              {result.direcaoVisual && (
                <ResultCard title="Direção visual" accent="#F59E0B">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {Object.entries(result.direcaoVisual).map(([k, v]) => (
                      <div key={k} style={{ background: 'var(--bg-3)', borderRadius: 8, padding: '10px 12px' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{k}</p>
                        <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              )}

              {/* Legenda */}
              {result.legenda && (
                <ResultCard title="Legenda pronta" accent="#FC75A0">
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{result.legenda}</p>
                  <CopyBtn text={result.legenda} id="legenda" copied={copied} onCopy={copyText} />
                </ResultCard>
              )}

              {/* Checklist */}
              {result.checklistEstrategico && result.checklistEstrategico.length > 0 && (
                <ResultCard title="Checklist estratégico" accent="#3B82F6">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {result.checklistEstrategico.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#d1fae5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                          <Check size={10} color="#065f46" />
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              )}

              {result.raw && (
                <ResultCard title="Resultado" accent="#FC75A0">
                  <pre style={{ fontSize: 12, color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{result.raw}</pre>
                </ResultCard>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function ResultCard({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 3, height: 16, borderRadius: 999, background: accent }} />
        <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</h4>
      </div>
      <div style={{ padding: '16px 18px', position: 'relative' }}>{children}</div>
    </div>
  )
}

function CopyBtn({ text, id, copied, onCopy, small }: { text: string; id: string; copied: string; onCopy: (t: string, k: string) => void; small?: boolean }) {
  const isCopied = copied === id
  return (
    <button onClick={() => onCopy(text, id)} style={{ marginTop: small ? 0 : 12, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: small ? '4px 8px' : '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: isCopied ? '#065f46' : 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
      {isCopied ? <Check size={11} /> : <Copy size={11} />} {isCopied ? 'Copiado!' : 'Copiar'}
    </button>
  )
}
