'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Copy, Check } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useClients } from '@/context/ClientsContext'

const FUNNEL = [
  { value: 'topo', label: 'Topo de funil', desc: 'Compartilhável, gancho amplo e fácil de entender' },
  { value: 'meio', label: 'Meio de funil', desc: 'Educativo, autoridade, opinião ou comparação' },
  { value: 'fundo', label: 'Fundo de funil', desc: 'Prova, argumento de venda, produto ou oferta' },
]

const CAROUSEL_TYPES = [
  { value: 'educativo', label: 'Educativo direto', desc: 'Ensinar algo com clareza e estrutura' },
  { value: 'mito', label: 'Quebra de mito', desc: 'Desmistificar uma crença do público' },
  { value: 'erros', label: 'Erros comuns', desc: 'Ótimo para salvamento — alto potencial' },
  { value: 'comparativo', label: 'Comparativo', desc: 'Antes/depois, certo/errado, comum/estratégico' },
  { value: 'storytelling', label: 'Storytelling educativo', desc: 'Explicar a partir de uma situação real' },
  { value: 'autoridade', label: 'Autoridade e posicionamento', desc: 'Fortalecer a visão da marca' },
  { value: 'produto', label: 'Produto como solução', desc: 'Vender sem parecer panfleto' },
  { value: 'campanha', label: 'Campanha / oferta', desc: 'Para ações comerciais e datas específicas' },
]

const DEPTHS = [
  { value: 'rapido', label: 'Rápido e direto', desc: 'Pouco texto, frases fortes' },
  { value: 'leve', label: 'Educativo leve', desc: 'Explica sem ficar técnico demais' },
  { value: 'completo', label: 'Mais aprofundado', desc: 'Contexto, dados, exemplos e argumentos' },
]

const TONES = ['Premium e direto', 'Leve e cool', 'Jovem e provocativo', 'Educativo e acessível', 'Emocional e narrativo', 'Técnico, mas simples', 'Inspiracional', 'Comercial']
const SLIDES_OPTIONS = ['5 slides', '6 slides', '7 slides', '8 slides', '10 slides']
const CTAS = ['Salvar', 'Comentar', 'Compartilhar', 'Chamar no direct', 'Clicar no link da bio', 'Comprar', 'Responder uma pergunta', 'Enviar para alguém']
const SALE_LEVELS = [
  { value: 'sem_venda', label: 'Sem venda' },
  { value: 'sutil', label: 'Venda sutil' },
  { value: 'direta', label: 'Venda direta' },
]

type Slide = {
  numero: number; tipo: string; tituloPrincipal: string; subtitulo?: string
  textoPrincipal: string; orientacaoVisual: string; intencaoEstrategica: string
}
type CarouselResult = {
  slides?: Slide[]
  variacoesCapa?: string[]
  legenda?: { abertura: string; desenvolvimento: string; cta: string }
  orientacaoVisualGeral?: string
  storiesComplementares?: string[]
  reelsDerivado?: string
  checklistEstrategico?: string[]
  raw?: string
}

export default function CarrosselPage() {
  const router = useRouter()
  const { clients } = useClients()
  const font = "'Inter', system-ui, sans-serif"

  const [form, setForm] = useState({
    clientId: '', funnelStage: '', carouselType: '', theme: '',
    slides: '6 slides', depth: 'leve', tone: '', saleLevel: 'sutil', cta: 'Salvar',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CarouselResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const selectedClient = clients.find(c => c.id === form.clientId)

  async function handleGenerate() {
    if (!form.theme || !form.funnelStage || !form.carouselType) {
      setError('Preencha tema, objetivo e tipo do carrossel.')
      return
    }
    setError(''); setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'carrossel',
          data: {
            client: selectedClient?.name || form.clientId,
            segment: selectedClient?.segment || '',
            brandVoice: selectedClient?.brandVoice || form.tone,
            product: selectedClient?.servicePackage || '',
            campaign: '',
            ...form,
            funnelStage: FUNNEL.find(f => f.value === form.funnelStage)?.label || form.funnelStage,
            carouselType: CAROUSEL_TYPES.find(c => c.value === form.carouselType)?.label || form.carouselType,
            depth: DEPTHS.find(d => d.value === form.depth)?.label || form.depth,
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
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const inputStyle = { width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: 11, fontWeight: 700 as const, color: 'var(--text-2)' as const, textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'block' as const, marginBottom: 6 }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Criar Carrossel" subtitle="Slides estratégicos com capa magnética, desenvolvimento e legenda pronta" />
      <div className="page-pad" style={{ fontFamily: font }}>
        <button onClick={() => router.push('/criacao')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: 0 }}>
          <ArrowLeft size={14} /> Voltar para Criação
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '380px 1fr' : '520px 1fr', gap: 24, alignItems: 'start' }}>
          {/* FORM */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, position: 'sticky', top: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Configurar <span style={{ color: '#F19877' }}>Carrossel</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Cliente / Perfil</label>
                <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Selecione...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Objetivo do carrossel</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {FUNNEL.map(f => (
                    <button key={f.value} onClick={() => setForm(fm => ({ ...fm, funnelStage: f.value }))}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${form.funnelStage === f.value ? '#F19877' : 'var(--border)'}`, background: form.funnelStage === f.value ? 'rgba(241,152,119,0.06)' : 'var(--bg-2)', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: form.funnelStage === f.value ? '#F19877' : 'var(--border-2)', flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: form.funnelStage === f.value ? '#F19877' : 'var(--text)' }}>{f.label}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 6 }}>{f.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Tipo de carrossel</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                  {CAROUSEL_TYPES.map(c => (
                    <button key={c.value} onClick={() => setForm(f => ({ ...f, carouselType: c.value }))}
                      style={{ padding: '8px', borderRadius: 8, border: `1.5px solid ${form.carouselType === c.value ? '#F19877' : 'var(--border)'}`, background: form.carouselType === c.value ? 'rgba(241,152,119,0.06)' : 'var(--bg-2)', cursor: 'pointer', textAlign: 'left' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: form.carouselType === c.value ? '#F19877' : 'var(--text)' }}>{c.label}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Tema *</label>
                <textarea value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))} placeholder="Ex: Por que sua tattoo antiga perde definição?" rows={2} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Slides</label>
                  <select value={form.slides} onChange={e => setForm(f => ({ ...f, slides: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {SLIDES_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Profundidade</label>
                  <select value={form.depth} onChange={e => setForm(f => ({ ...f, depth: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {DEPTHS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Tom</label>
                  <select value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Usar do cliente</option>
                    {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>CTA</label>
                  <select value={form.cta} onChange={e => setForm(f => ({ ...f, cta: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {CTAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Nível de venda</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {SALE_LEVELS.map(s => (
                    <button key={s.value} onClick={() => setForm(f => ({ ...f, saleLevel: s.value }))}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1.5px solid ${form.saleLevel === s.value ? '#F19877' : 'var(--border)'}`, background: form.saleLevel === s.value ? 'rgba(241,152,119,0.06)' : 'var(--bg-2)', cursor: 'pointer', fontSize: 11, fontWeight: form.saleLevel === s.value ? 700 : 500, color: form.saleLevel === s.value ? '#F19877' : 'var(--text-2)' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p style={{ fontSize: 12, color: '#EE3528', background: '#fee2e2', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

              <button onClick={handleGenerate} disabled={loading}
                style={{ background: loading ? 'rgba(241,152,119,0.6)' : '#F19877', color: '#FFFFFF', border: 'none', borderRadius: 999, padding: '13px', fontSize: 13, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: font }}>
                {loading ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Gerando...</> : <><Sparkles size={14} /> Gerar Carrossel</>}
              </button>
            </div>
          </div>

          {/* RESULT */}
          {!result && !loading && (
            <div style={{ background: 'var(--bg-2)', borderRadius: 16, padding: 60, textAlign: 'center' }}>
              <Sparkles size={40} style={{ margin: '0 auto 16px', opacity: 0.3, color: 'var(--text-3)' }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Configure e gere seu carrossel</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Preencha os campos ao lado e clique em Gerar Carrossel.</p>
            </div>
          )}

          {loading && (
            <div style={{ background: 'var(--bg-2)', borderRadius: 16, padding: 60, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(241,152,119,0.2)', borderTop: '3px solid #F19877', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.7s linear infinite' }} />
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Gerando carrossel estratégico...</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Slides */}
              {result.slides && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 16, borderRadius: 999, background: '#F19877' }} />
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Slides ({result.slides.length})</h4>
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.slides.map((slide, i) => (
                      <div key={i} style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '14px 16px', borderLeft: `3px solid ${i === 0 ? '#FC75A0' : i === result.slides!.length - 1 ? '#10B981' : '#F19877'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? '#FC75A0' : i === result.slides!.length - 1 ? '#10B981' : '#F19877', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {slide.tipo === 'capa' ? '★ Capa' : slide.tipo === 'cta' ? '→ CTA Final' : `Slide ${slide.numero}`}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--text-3)', fontStyle: 'italic' }}>{slide.intencaoEstrategica}</span>
                        </div>
                        {slide.tituloPrincipal && <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{slide.tituloPrincipal}</p>}
                        {slide.subtitulo && <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>{slide.subtitulo}</p>}
                        {slide.textoPrincipal && <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 6 }}>{slide.textoPrincipal}</p>}
                        <p style={{ fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic' }}>Visual: {slide.orientacaoVisual}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variações de capa */}
              {result.variacoesCapa && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 16, borderRadius: 999, background: '#FC75A0' }} />
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Variações de capa</h4>
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.variacoesCapa.map((v, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'var(--bg-2)', borderRadius: 8, padding: '10px 14px' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>"{v}"</p>
                        <button onClick={() => copyText(v, `capa-${i}`)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', color: copied === `capa-${i}` ? '#065f46' : 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          {copied === `capa-${i}` ? <Check size={10} /> : <Copy size={10} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legenda */}
              {result.legenda && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 3, height: 16, borderRadius: 999, background: '#8B5CF6' }} />
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Legenda pronta</h4>
                    </div>
                    <button onClick={() => copyText(`${result.legenda!.abertura}\n\n${result.legenda!.desenvolvimento}\n\n${result.legenda!.cta}`, 'legenda-full')} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: copied === 'legenda-full' ? '#065f46' : 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      {copied === 'legenda-full' ? <Check size={11} /> : <Copy size={11} />} Copiar tudo
                    </button>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ marginBottom: 10 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 4 }}>Abertura</p>
                      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>{result.legenda.abertura}</p>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 4 }}>Desenvolvimento</p>
                      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>{result.legenda.desenvolvimento}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 4 }}>CTA</p>
                      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>{result.legenda.cta}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Orientação visual + extras */}
              {(result.orientacaoVisualGeral || result.storiesComplementares || result.reelsDerivado) && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 16, borderRadius: 999, background: '#F59E0B' }} />
                    <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Extras</h4>
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {result.orientacaoVisualGeral && (
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 4 }}>Orientação visual geral</p>
                        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{result.orientacaoVisualGeral}</p>
                      </div>
                    )}
                    {result.reelsDerivado && (
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 4 }}>Reels derivado sugerido</p>
                        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{result.reelsDerivado}</p>
                      </div>
                    )}
                    {result.storiesComplementares && result.storiesComplementares.length > 0 && (
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 6 }}>Stories para divulgar</p>
                        {result.storiesComplementares.map((s, i) => (
                          <p key={i} style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, paddingLeft: 10, borderLeft: '2px solid var(--border-2)', marginBottom: 6 }}>{s}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.raw && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                  <pre style={{ fontSize: 12, color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{result.raw}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
