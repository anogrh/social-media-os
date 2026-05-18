'use client'

import { useState } from 'react'
import { Sparkles, Save, User, Search, ChevronDown, ChevronUp, ArrowRight, RefreshCw, X, Check } from 'lucide-react'
import Header from '@/components/layout/Header'
import { clients } from '@/lib/mock-data'

// ─── Helpers ────────────────────────────────────────────────────────────────

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const MES_ATUAL = MESES[new Date().getMonth()]

// ─── Briefing questions ──────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'objetivo',
    n: '01',
    label: 'Objetivo do mês',
    q: (name: string, mes: string) =>
      `Qual é o foco principal de ${name} em ${mes}?`,
    hint: 'Pode ser lançamento, reposicionamento, fidelização, geração de leads, aumento de engajamento ou vendas.',
    placeholder: 'Ex: Queremos lançar a nova linha e gerar 50 leads qualificados até o final do mês...',
  },
  {
    id: 'publico',
    n: '02',
    label: 'Público e momento',
    q: (name: string, mes: string) =>
      `Quem é o público de ${name} agora — e o que está acontecendo na vida dele?`,
    hint: 'Pense no contexto emocional, sazonal e comportamental do público neste mês específico.',
    placeholder: 'Ex: Mulheres de 28–40 anos, inverno chegando, buscando conforto e autocuidado...',
  },
  {
    id: 'destaques',
    n: '03',
    label: 'Destaques e datas',
    q: (_name: string, mes: string) =>
      `Tem algum produto, campanha, evento ou data especial em ${mes}?`,
    hint: 'Lançamentos, promoções, colaborações, eventos, datas comemorativas relevantes para a marca.',
    placeholder: 'Ex: Dia dos Namorados no dia 12, lançamento da nova coleção no dia 20...',
  },
  {
    id: 'tom',
    n: '04',
    label: 'Tom e restrições',
    q: (name: string) =>
      `O que ${name} nunca faz — e o que precisa ser reforçado no tom esse mês?`,
    hint: 'Postura da marca, palavras ou abordagens proibidas, o que reforçar ou evitar.',
    placeholder: 'Ex: Nunca falar em preço baixo, sempre empoderar sem pressionar, evitar tom apelativo...',
  },
  {
    id: 'volume',
    n: '05',
    label: 'Volume e canais',
    q: () => 'Quantos posts por semana e em quais canais?',
    hint: 'Inclua todos os formatos: feed, reels, stories, TikTok, carrossel, card estático, etc.',
    placeholder: 'Ex: 4 posts/semana no Instagram (2 reels, 1 carrossel, 1 card), stories diários...',
  },
]

// ─── Strategy generator ──────────────────────────────────────────────────────

type Answers = Record<string, string>

type Strategy = {
  posicionamento: string
  pilares: { nome: string; desc: string }[]
  calendario: { semana: string; pautas: { formato: string; titulo: string; objetivo: string }[] }[]
  tom: { reforcar: string[]; evitar: string[]; voz: string }
  cta: { chamada: string; racional: string }
}

function buildStrategy(client: typeof clients[0], mes: string, ans: Answers): Strategy {
  const p = client.contentPillars ?? ['Educação', 'Produto', 'Comunidade', 'Bastidores']
  const obj = ans.objetivo || `crescer e engajar no Instagram`
  const pub = ans.publico || `o público-alvo da marca`
  const dest = ans.destaques || `ações orgânicas do mês`
  const tonObs = ans.tom || `manter o tom autêntico da marca`

  return {
    posicionamento: `Em ${mes}, ${client.name} ocupa um espaço claro: ${client.positioning?.toLowerCase() || 'referência no seu segmento'}. O foco narrativo é construir em torno de "${obj.split('.')[0]}". A marca não apenas informa — ela cria pertencimento com ${pub.split(',')[0].toLowerCase()}, mostrando que entende o momento e tem algo real a oferecer.`,

    pilares: [
      {
        nome: p[0] || 'Autoridade',
        desc: `Conteúdo que posiciona ${client.name} como referência e responde às dúvidas reais do público — sem parecer manual.`,
      },
      {
        nome: p[1] || 'Produto em contexto',
        desc: `Mostrar o produto ou serviço no uso real — com prova, resultado e narrativa. Nunca propaganda fria.`,
      },
      {
        nome: p[2] || 'Comunidade',
        desc: `Depoimentos, repostagens e conteúdo que valida a marca pela voz de quem já escolheu ela.`,
      },
      {
        nome: 'Bastidores',
        desc: `Humanizar a marca mostrando quem está por trás: equipe, processo criativo, decisões e dia a dia real.`,
      },
    ],

    calendario: [
      {
        semana: `Semana 1 — Contextualização`,
        pautas: [
          { formato: 'Reels', titulo: `Por que ${mes} é diferente para ${client.name}`, objetivo: 'Alcance e hook emocional' },
          { formato: 'Carrossel', titulo: `${p[0]}: o guia que seu público precisava`, objetivo: 'Salvamentos e autoridade' },
          { formato: 'Card estático', titulo: `Frase que para o scroll — tom da marca`, objetivo: 'Branding e impressões' },
          { formato: 'Stories', titulo: `Enquete: o que você mais quer ver esse mês?`, objetivo: 'Interação e pesquisa' },
        ],
      },
      {
        semana: `Semana 2 — ${dest.split(',')[0].length < 40 ? dest.split(',')[0] : 'Destaque do mês'}`,
        pautas: [
          { formato: 'Reels', titulo: `Bastidores de ${dest.split(',')[0]}`, objetivo: 'Humanização e antecipação' },
          { formato: 'Carrossel', titulo: `${dest.split(',')[0]} — o que você precisa saber`, objetivo: 'Educação + intenção' },
          { formato: 'Card estático', titulo: `Dado ou fato que choca (bem)`, objetivo: 'Compartilhamentos' },
          { formato: 'Stories', titulo: `Caixa de perguntas sobre ${p[1]?.toLowerCase() || 'o tema do mês'}`, objetivo: 'Engajamento direto' },
        ],
      },
      {
        semana: 'Semana 3 — Prova social e conversão',
        pautas: [
          { formato: 'Carrossel', titulo: `Resultado real de quem já escolheu ${client.name}`, objetivo: 'Confiança e conversão' },
          { formato: 'Reels', titulo: `Um dia com [produto/serviço] — rotina real`, objetivo: 'Identificação e desejo' },
          { formato: 'Card estático', titulo: `Pergunta que provoca reflexão`, objetivo: 'Comentários e alcance' },
          { formato: 'Stories', titulo: `Quiz sobre o universo da marca`, objetivo: 'Retenção e diversão' },
        ],
      },
      {
        semana: 'Semana 4 — CTA e fechamento',
        pautas: [
          { formato: 'Reels', titulo: `O que vem por aí — próximo mês`, objetivo: 'Antecipação e fidelização' },
          { formato: 'Carrossel', titulo: `Resumo do mês e o que ainda vem`, objetivo: 'Retenção e comunidade' },
          { formato: 'Card estático', titulo: `CTA direto: link na bio / contato / agendamento`, objetivo: 'Conversão final' },
        ],
      },
    ],

    tom: {
      reforcar: [
        client.brandVoice?.split('.')[0] || 'Voz autêntica e direta',
        'Especificidade — cite contextos reais, nada vago',
        `Empatia com o momento: ${pub.split('.')[0]}`,
        tonObs.split('.')[0],
      ],
      evitar: [
        'Linguagem genérica ou de manual de marketing',
        'Superlativos sem prova (melhor, único, exclusivo)',
        'Tom instrutivo demais — falar com, não para o público',
        `O que ${client.name} não faz: ${tonObs.split(',')[0]}`,
      ],
      voz: `Em ${mes}, a voz de ${client.name} precisa soar ${client.brandVoice?.split(',')[0]?.toLowerCase() || 'humana e estratégica'} — mas com urgência e foco. Cada post tem um único motivo para existir.`,
    },

    cta: {
      chamada: obj.toLowerCase().includes('lead') || obj.toLowerCase().includes('agenda')
        ? '→ Link na bio: agende agora'
        : obj.toLowerCase().includes('vend') || obj.toLowerCase().includes('compra')
        ? '→ Acesse o link na bio e garanta o seu'
        : '→ Me conta nos comentários / manda mensagem direta',
      racional: `O objetivo central definido foi "${obj.split('.')[0]}". Esse CTA é direto, não invasivo, e respeita o posicionamento de ${client.name}. Ele entra ao final de reels e carrosséis — quando o público já está aquecido e com a decisão a um passo.`,
    },
  }
}

// ─── Existing data for other sections ───────────────────────────────────────

const comercialDates = [
  { date: '01/06', event: 'Dia Mundial do Leite', cats: ['alimentação', 'saúde'] },
  { date: '05/06', event: 'Dia Mundial do Meio Ambiente', cats: ['sustentabilidade', 'eco'] },
  { date: '06/06', event: 'Dia Nacional da Gratidão', cats: ['lifestyle', 'emocional'] },
  { date: '12/06', event: 'Dia dos Namorados', cats: ['lifestyle', 'presente', 'experiência'] },
  { date: '21/06', event: 'Primeiro dia do inverno', cats: ['moda', 'lifestyle', 'bem-estar'] },
  { date: '21/06', event: 'Dia do Cacau e do Chocolate', cats: ['alimentação', 'gastronomia'] },
  { date: '24/06', event: 'Festa Junina / São João', cats: ['cultura', 'gastronomia', 'evento'] },
  { date: '29/06', event: 'Aniversário de São Paulo', cats: ['local', 'cultura'] },
]

const refsBySegment: Record<string, { theme: string; formats: string[]; caption: string; hashtags: string[] }[]> = {
  'Arquitetura & Design': [
    { theme: 'Detalhe construtivo', formats: ['foto', 'carrossel'], caption: 'Os pequenos detalhes que fazem grandes projetos.', hashtags: ['#arquitetura', '#interiores', '#design'] },
    { theme: 'Antes e depois', formats: ['reels', 'carrossel'], caption: 'Da planta ao sonho realizado. Transformação completa 🏛️', hashtags: ['#antesedepois', '#reforma', '#arquitetura'] },
    { theme: 'Paleta de materiais', formats: ['foto', 'feed'], caption: 'Cada material conta uma história.', hashtags: ['#materiais', '#decoração', '#interiores'] },
    { theme: 'Processo criativo', formats: ['stories', 'reels'], caption: 'Por trás de cada projeto existe muita pesquisa e paixão.', hashtags: ['#processocriativo', '#bastidores', '#arquiteto'] },
  ],
  'Bem-estar & Saúde': [
    { theme: 'Dica rápida de saúde', formats: ['reels', 'story'], caption: 'Pequenas mudanças, grandes resultados. Começa hoje 💪', hashtags: ['#saude', '#bemestar', '#dica'] },
    { theme: 'Depoimento real', formats: ['carrossel', 'reels'], caption: 'Resultados reais de pessoas reais 🌟', hashtags: ['#resultados', '#depoimento', '#transformacao'] },
    { theme: 'Educativo sobre ingrediente', formats: ['carrossel', 'feed'], caption: 'Você sabe o que está consumindo?', hashtags: ['#educacao', '#suplementos', '#saude'] },
    { theme: 'Rotina matinal', formats: ['reels', 'story'], caption: 'Como a sua manhã define o seu dia ☀️', hashtags: ['#rotina', '#manha', '#habitos'] },
  ],
  'Food & Beverage': [
    { theme: 'Produto em close', formats: ['foto', 'feed'], caption: 'Perfeito demais para resistir ☕', hashtags: ['#cafe', '#gastronomia', '#foodphotography'] },
    { theme: 'Bastidores da produção', formats: ['reels', 'stories'], caption: 'Feito com amor e atenção a cada detalhe 🍞', hashtags: ['#artesanal', '#bastidores', '#gastronomia'] },
    { theme: 'Experiência no espaço', formats: ['reels', 'carrossel'], caption: 'Mais do que uma xícara, uma experiência 🏡', hashtags: ['#cafeteria', '#experiencia', '#gastronomiabr'] },
    { theme: 'Receita ou dica', formats: ['reels', 'carrossel'], caption: 'Salva para fazer! 🍳', hashtags: ['#receita', '#dica', '#food'] },
  ],
  'Produtos Sustentáveis': [
    { theme: 'Impacto positivo', formats: ['carrossel', 'reels'], caption: 'Cada escolha importa. Juntos somos a mudança 🌱', hashtags: ['#sustentabilidade', '#eco', '#impacto'] },
    { theme: 'Como usar o produto', formats: ['reels', 'stories'], caption: 'Prático, bonito e consciente.', hashtags: ['#eco', '#zerowaste', '#sustentavel'] },
    { theme: 'Bastidores da marca', formats: ['reels', 'carrossel'], caption: 'Por trás de cada produto existe um propósito.', hashtags: ['#marca', '#proposito', '#bastidores'] },
    { theme: 'Conteúdo educativo', formats: ['carrossel', 'feed'], caption: '5 trocas simples que fazem diferença 🌍', hashtags: ['#educacao', '#sustentabilidade', '#trocassustentaveis'] },
  ],
  'Fotografia': [
    { theme: 'Ensaio em destaque', formats: ['carrossel', 'feed'], caption: 'Cada frame conta uma história 📸', hashtags: ['#fotografia', '#ensaio', '#retrato'] },
    { theme: 'Dica de fotografia', formats: ['reels', 'carrossel'], caption: 'O segredo que muda suas fotos para sempre 📷', hashtags: ['#dicadefotografia', '#fotografo', '#dica'] },
    { theme: 'Bastidores de sessão', formats: ['reels', 'stories'], caption: 'Por trás das lentes, muita luz e emoção.', hashtags: ['#bastidores', '#fotografo', '#makingof'] },
    { theme: 'Depoimento de cliente', formats: ['carrossel', 'reels'], caption: 'Mais do que fotos, memórias para sempre 🤍', hashtags: ['#depoimento', '#fotografia', '#memoria'] },
  ],
}

type PersonaParams = { name: string; ageRange: string; job: string; location: string; interests: string }
type PersonaResult = { name: string; age: string; job: string; income: string; location: string; goals: string[]; pains: string[]; behaviors: string[]; quote: string }

function genPersona(client: typeof clients[0], p: PersonaParams): PersonaResult {
  const map: Record<string, Partial<PersonaResult>> = {
    'Arquitetura & Design': { name: 'Rafael Andrade', age: '42 anos', job: 'Empresário', income: 'R$ 25.000+/mês', location: 'São Paulo, SP', goals: ['Projeto de alto padrão', 'Valorizar patrimônio', 'Espaço que reflita identidade'], pains: ['Dificuldade em achar arquiteto confiável', 'Medo de gastar mal o orçamento', 'Processo longo'], behaviors: ['Pesquisa muito antes de contratar', 'Consome Instagram e Pinterest', 'Valoriza portfólio visual real'], quote: '"Quero um espaço que impressione e reflita quem eu sou."' },
    'Bem-estar & Saúde': { name: 'Ana Carolina Lima', age: '31 anos', job: 'Profissional de marketing', income: 'R$ 8–12k/mês', location: 'São Paulo ou capitais', goals: ['Melhorar energia e disposição', 'Rotina saudável sustentável', 'Investir em qualidade de vida'], pains: ['Falta de tempo para se cuidar', 'Confusão com tantos suplementos', 'Resultados lentos'], behaviors: ['Segue influenciadores de wellness', 'Pesquisa ingredientes antes de comprar', 'Ativa no Instagram e stories'], quote: '"Quero me sentir bem sem complicar minha vida."' },
    'Food & Beverage': { name: 'Beatriz Fontes', age: '28 anos', job: 'Designer freelancer', income: 'R$ 5–9k/mês', location: 'Capital ou cidade universitária', goals: ['Ambientes aconchegantes para trabalhar', 'Experiências gastronômicas únicas', 'Compartilhar descobertas'], pains: ['Decepções com qualidade ou atendimento', 'Locais que não combinam com estilo'], behaviors: ['Posta stories de gastronomia', 'Busca no Instagram e Google Maps', 'Compartilha experiências'], quote: '"O café perfeito tem que ser gostoso e fotogênico."' },
    'Produtos Sustentáveis': { name: 'Mariana Costa', age: '27 anos', job: 'Nutricionista', income: 'R$ 4.5–8k/mês', location: 'Capitais e cidades médias', goals: ['Consumir de forma consciente', 'Reduzir impacto ambiental', 'Apoiar marcas com propósito'], pains: ['Greenwashing — marcas que não cumprem', 'Produtos eco mais caros', 'Substituir hábitos consolidados'], behaviors: ['Engajada com causas ambientais', 'Pesquisa origem das marcas', 'Compartilha descobertas sustentáveis'], quote: '"Só compro de marcas em que acredito de verdade."' },
  }
  const base = map[client.segment] ?? map['Bem-estar & Saúde']
  return { name: p.name || base.name!, age: p.ageRange || base.age!, job: p.job || base.job!, income: base.income!, location: p.location || base.location!, goals: base.goals!, pains: base.pains!, behaviors: base.behaviors!, quote: base.quote! }
}

// ─── Page ────────────────────────────────────────────────────────────────────

const TABS = ['Briefing do Mês', 'Estratégia Base', 'Gerar Persona', 'Referências']

export default function EstrategiaPage() {
  const [tab, setTab] = useState(0)
  const [clientId, setClientId] = useState('c1')
  const [mes, setMes] = useState(MES_ATUAL)
  const client = clients.find(c => c.id === clientId)!

  // Briefing
  const [answers, setAnswers] = useState<Answers>({})
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [stratLoading, setStratLoading] = useState(false)

  // Base strategy fields
  const [fields, setFields] = useState({
    positioning: client.positioning || '',
    brandVoice: client.brandVoice || '',
    contentPillars: client.contentPillars?.join(', ') || '',
    objectives: client.objectives?.join('\n') || '',
    editorialLines: 'Educativo / Entretenimento / Prova social / Bastidores / Sazonal',
  })

  // Persona
  const [personaOpen, setPersonaOpen] = useState(true)
  const [personaParams, setPersonaParams] = useState<PersonaParams>({ name: '', ageRange: '', job: '', location: '', interests: '' })
  const [persona, setPersona] = useState<PersonaResult | null>(null)
  const [personaLoading, setPersonaLoading] = useState(false)

  // References
  const [refSearch, setRefSearch] = useState('')
  const [fmts, setFmts] = useState<string[]>([])

  function switchClient(id: string) {
    setClientId(id)
    const c = clients.find(cl => cl.id === id)!
    setFields({ positioning: c.positioning || '', brandVoice: c.brandVoice || '', contentPillars: c.contentPillars?.join(', ') || '', objectives: c.objectives?.join('\n') || '', editorialLines: 'Educativo / Entretenimento / Prova social / Bastidores / Sazonal' })
    setAnswers({})
    setStrategy(null)
    setPersona(null)
  }

  async function handleGenStrategy() {
    setStratLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setStrategy(buildStrategy(client, mes, answers))
    setStratLoading(false)
  }

  async function handleGenPersona() {
    setPersonaLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setPersona(genPersona(client, personaParams))
    setPersonaLoading(false)
  }

  const filledCount = QUESTIONS.filter(q => (answers[q.id] || '').trim().length > 2).length
  const font = "'Inter', system-ui, sans-serif"
  const serif = "'Playfair Display', Georgia, serif"

  const segRefs = refsBySegment[client.segment] ?? refsBySegment['Bem-estar & Saúde']
  const filteredRefs = segRefs.filter(r =>
    (refSearch === '' || r.theme.toLowerCase().includes(refSearch.toLowerCase()) || r.caption.toLowerCase().includes(refSearch.toLowerCase())) &&
    (fmts.length === 0 || r.formats.some(f => fmts.includes(f)))
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Estratégia" subtitle="Briefing mensal, planejamento e geração de estratégia com IA" />

      <div className="page-pad" style={{ paddingBottom: 40, fontFamily: font }}>

        {/* ─── Top bar ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          <select value={clientId} onChange={e => switchClient(e.target.value)}
            style={{ border: '1px solid var(--border-2)', borderRadius: 999, padding: '10px 18px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontWeight: 700, cursor: 'pointer' }}>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={mes} onChange={e => setMes(e.target.value)}
            style={{ border: '1px solid var(--border-2)', borderRadius: 999, padding: '10px 18px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontWeight: 600, cursor: 'pointer' }}>
            {MESES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <span style={{ background: client.color, color: 'var(--text)', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 999, opacity: 0.85 }}>
            {client.segment}
          </span>
        </div>

        {/* ─── Tab nav ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch' as const }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px 18px',
                fontFamily: font, fontSize: 13, fontWeight: tab === i ? 700 : 400,
                color: tab === i ? '#F25BA5' : 'rgba(31,27,26,0.5)',
                borderBottom: tab === i ? '2px solid #F25BA5' : '2px solid transparent',
                marginBottom: -1, transition: 'all 0.15s',
              }}>
              {t}
              {t === 'Briefing do Mês' && filledCount > 0 && (
                <span style={{ marginLeft: 6, background: '#F25BA5', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 6px' }}>
                  {filledCount}/5
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 0 — BRIEFING DO MÊS                                        */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {tab === 0 && (
          <div>
            {/* Hero editorial header */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1F1B1A', borderRadius: 999, padding: '6px 14px', marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F25BA5' }} />
                <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}>
                  BRIEFING MENSAL · {filledCount} DE 5 RESPONDIDAS
                </span>
              </div>
              <h2 style={{ fontFamily: serif, fontSize: 42, fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 12 }}>
                Briefing de{' '}
                <span style={{ color: '#F25BA5' }}>{client.name.split(' ')[0]}</span>
                {' '}para {mes}.
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 540, lineHeight: 1.7 }}>
                Responda as 5 perguntas abaixo. Quanto mais específica a resposta, mais cirúrgica será a estratégia gerada.
              </p>
            </div>

            {/* Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              {QUESTIONS.map((q, i) => {
                const val = answers[q.id] || ''
                const done = val.trim().length > 2
                return (
                  <div key={q.id}
                    style={{
                      background: done ? '#F5F4F2' : '#FFFFFF',
                      border: `1.5px solid ${done ? 'rgba(242,91,165,0.25)' : 'var(--border)'}`,
                      borderRadius: 16, padding: '28px 32px',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}>
                    {/* Question header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 18 }}>
                      <div style={{
                        fontFamily: serif, fontSize: 36, fontWeight: 700, color: done ? '#F25BA5' : 'var(--border)',
                        lineHeight: 1, flexShrink: 0, transition: 'color 0.2s', minWidth: 48,
                      }}>
                        {q.n}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {q.label}
                          </span>
                          {done && <Check size={12} color="#F25BA5" />}
                        </div>
                        <p style={{ fontFamily: serif, fontSize: 20, fontWeight: 600, color: 'var(--text)', lineHeight: 1.35 }}>
                          {q.q(client.name, mes)}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6, lineHeight: 1.6 }}>
                          {q.hint}
                        </p>
                      </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                      value={val}
                      onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                      placeholder={q.placeholder}
                      rows={3}
                      style={{
                        width: '100%', background: 'var(--bg)',
                        border: `1px solid ${done ? 'rgba(242,91,165,0.2)' : 'var(--border)'}`,
                        borderRadius: 12, padding: '14px 16px', fontSize: 14, color: 'var(--text)',
                        lineHeight: 1.7, resize: 'vertical', outline: 'none', fontFamily: font,
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#F25BA5')}
                      onBlur={e => (e.target.style.borderColor = done ? 'rgba(242,91,165,0.2)' : 'var(--border)')}
                    />
                  </div>
                )
              })}
            </div>

            {/* Generate button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={handleGenStrategy}
                disabled={stratLoading || filledCount < 3}
                style={{
                  background: filledCount < 3 ? 'var(--border-2)' : stratLoading ? 'rgba(31,27,26,0.7)' : '#1F1B1A',
                  color: filledCount < 3 ? 'rgba(31,27,26,0.4)' : '#FFFFFF',
                  border: 'none', borderRadius: 999, padding: '14px 32px',
                  fontSize: 15, fontWeight: 700, cursor: filledCount < 3 || stratLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, fontFamily: font,
                  transition: 'background 0.2s',
                }}>
                {stratLoading ? (
                  <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Gerando estratégia...</>
                ) : (
                  <><Sparkles size={16} /> Gerar estratégia completa <ArrowRight size={16} /></>
                )}
              </button>
              {filledCount < 3 && (
                <p style={{ fontSize: 12, color: 'var(--text-4)' }}>
                  Responda pelo menos 3 perguntas para gerar
                </p>
              )}
              {strategy && !stratLoading && (
                <button onClick={() => setStrategy(null)}
                  style={{ background: 'transparent', border: '1px solid var(--border-2)', borderRadius: 999, padding: '12px 18px', fontSize: 12, color: 'var(--text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <X size={12} /> Limpar
                </button>
              )}
            </div>

            {/* ─── Generated Strategy Output ─────────────────────────── */}
            {strategy && (
              <div style={{ marginTop: 48 }}>
                {/* Strategy header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F25BA5', borderRadius: 999, padding: '5px 14px', marginBottom: 12 }}>
                      <Sparkles size={12} color="#fff" />
                      <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>ESTRATÉGIA GERADA</span>
                    </div>
                    <h3 style={{ fontFamily: serif, fontSize: 32, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>
                      Estratégia de {client.name} —{' '}
                      <span style={{ color: '#F25BA5' }}>{mes}</span>
                    </h3>
                  </div>
                  <button onClick={handleGenStrategy}
                    style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 999, padding: '10px 18px', fontSize: 12, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: font }}>
                    <RefreshCw size={13} /> Regerar
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* 1. Posicionamento */}
                  <StratSection label="01 — Posicionamento do mês" accent="#F25BA5">
                    <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.8 }}>{strategy.posicionamento}</p>
                  </StratSection>

                  {/* 2. Pilares */}
                  <StratSection label="02 — Pilares de conteúdo" accent="#F19877">
                    <div className="rg-2" style={{ gap: 12 }}>
                      {strategy.pilares.map((p, i) => (
                        <div key={i} style={{ background: 'var(--bg)', borderRadius: 10, padding: '14px 16px', borderLeft: '3px solid #F19877' }}>
                          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>{p.nome}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </StratSection>

                  {/* 3. Calendário */}
                  <StratSection label="03 — Calendário editorial" accent="#86efac">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {strategy.calendario.map((sem, si) => (
                        <div key={si}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                            {sem.semana}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {sem.pautas.map((pauta, pi) => (
                              <div key={pi} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 160px', gap: 12, alignItems: 'center', background: 'var(--bg)', borderRadius: 10, padding: '12px 14px' }}>
                                <span style={{ background: '#1F1B1A', color: '#FFFFFF', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 999, textAlign: 'center' }}>
                                  {pauta.formato}
                                </span>
                                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{pauta.titulo}</p>
                                <p style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'right', lineHeight: 1.4 }}>{pauta.objetivo}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </StratSection>

                  {/* 4. Tom */}
                  <StratSection label="04 — Tom e diretrizes" accent="#FBD0DA">
                    <div className="rg-2" style={{ gap: 16, marginBottom: 16 }}>
                      {[
                        { title: 'Reforçar', items: strategy.tom.reforcar, color: '#d1fae5', dot: '#22c55e' },
                        { title: 'Evitar', items: strategy.tom.evitar, color: '#fee2e2', dot: '#ef4444' },
                      ].map(col => (
                        <div key={col.title}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                            {col.title}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {col.items.map((item, i) => (
                              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: col.dot, marginTop: 5, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#1F1B1A', borderRadius: 10, padding: '14px 18px' }}>
                      <p style={{ fontSize: 13, color: '#F5F4F2', fontStyle: 'italic', lineHeight: 1.7 }}>{strategy.tom.voz}</p>
                    </div>
                  </StratSection>

                  {/* 5. CTA */}
                  <StratSection label="05 — CTA do mês" accent="#F25BA5">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                      <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: '#F25BA5' }}>
                        {strategy.cta.chamada}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(31,27,26,0.65)', lineHeight: 1.7 }}>{strategy.cta.racional}</p>
                  </StratSection>

                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 1 — ESTRATÉGIA BASE                                         */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {tab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="rg-2" style={{ gap: 16 }}>
              {[
                { key: 'positioning', label: 'Posicionamento', ph: 'Como a marca se posiciona no mercado...' },
                { key: 'brandVoice', label: 'Tom de voz', ph: 'Como a marca se comunica...' },
                { key: 'editorialLines', label: 'Linhas editoriais', ph: 'Educativo, Entretenimento...' },
              ].map(s => (
                <div key={s.key} style={{ background: 'var(--bg-2)', borderRadius: 14, padding: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>{s.label}</label>
                  <textarea value={fields[s.key as keyof typeof fields]} onChange={e => setFields(f => ({ ...f, [s.key]: e.target.value }))} placeholder={s.ph}
                    style={{ width: '100%', minHeight: 100, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--text)', lineHeight: 1.7, resize: 'vertical', outline: 'none', fontFamily: font }} />
                </div>
              ))}
              <div style={{ background: 'var(--bg-2)', borderRadius: 14, padding: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>Pilares de conteúdo</label>
                <input value={fields.contentPillars} onChange={e => setFields(f => ({ ...f, contentPillars: e.target.value }))} placeholder="Separados por vírgula..."
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--text)', outline: 'none', fontFamily: font }} />
                {fields.contentPillars && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                    {fields.contentPillars.split(',').map(p => p.trim()).filter(Boolean).map(p => (
                      <span key={p} style={{ background: '#FBD0DA', color: 'var(--text)', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 999 }}>{p}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ gridColumn: '1/-1', background: 'var(--bg-2)', borderRadius: 14, padding: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>Objetivos</label>
                <textarea value={fields.objectives} onChange={e => setFields(f => ({ ...f, objectives: e.target.value }))} placeholder="Um objetivo por linha..."
                  style={{ width: '100%', minHeight: 90, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--text)', lineHeight: 1.7, resize: 'vertical', outline: 'none', fontFamily: font }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, padding: '11px 24px', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: font }}>
                <Save size={14} /> Salvar
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 2 — GERAR PERSONA                                           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {tab === 2 && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: serif, fontSize: 36, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, marginBottom: 8 }}>
                Quem compra de{' '}
                <span style={{ color: '#F25BA5' }}>{client.name.split(' ')[0]}</span>?
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
                Crie a persona ideal baseada no segmento e perfil do cliente. Personalize os campos ou deixe em branco para gerar automaticamente.
              </p>
            </div>

            <div style={{ background: 'var(--bg-2)', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
              <div className="rg-3" style={{ gap: 14, marginBottom: 20 }}>
                {[
                  { key: 'name', label: 'Nome sugerido', ph: 'Ex: Sofia Mendes' },
                  { key: 'ageRange', label: 'Faixa etária', ph: 'Ex: 28–35 anos' },
                  { key: 'job', label: 'Profissão', ph: 'Ex: Designer, Gerente...' },
                  { key: 'location', label: 'Localização', ph: 'Ex: São Paulo, SP' },
                  { key: 'interests', label: 'Interesses principais', ph: 'Ex: viagem, gastronomia...' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input value={personaParams[f.key as keyof PersonaParams]} onChange={e => setPersonaParams(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: 'var(--text)', outline: 'none', fontFamily: font }} />
                  </div>
                ))}
              </div>
              <button onClick={handleGenPersona} disabled={personaLoading}
                style={{ background: personaLoading ? 'rgba(31,27,26,0.5)' : '#1F1B1A', color: '#FFFFFF', borderRadius: 999, padding: '12px 24px', border: 'none', fontSize: 13, fontWeight: 700, cursor: personaLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: font }}>
                {personaLoading
                  ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Gerando...</>
                  : <><Sparkles size={14} /> Gerar persona <ArrowRight size={14} /></>}
              </button>
            </div>

            {persona && (
              <div className="rg-2" style={{ background: 'linear-gradient(135deg, #F5F4F2 0%, rgba(251,208,218,0.15) 100%)', border: '1px solid rgba(242,91,165,0.2)', borderRadius: 16, padding: 28, gap: 24 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <div style={{ background: '#F25BA5', color: '#fff', width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 20, fontWeight: 700 }}>
                      {persona.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontFamily: serif, fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>{persona.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{persona.age} · {persona.job}</p>
                    </div>
                  </div>
                  {[{ l: 'Renda', v: persona.income }, { l: 'Localização', v: persona.location }].map(row => (
                    <div key={row.l} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 80 }}>{row.l}</span>
                      <span style={{ fontSize: 13, color: 'var(--text)' }}>{row.v}</span>
                    </div>
                  ))}
                  <div style={{ background: '#1F1B1A', borderRadius: 10, padding: '14px 16px', marginTop: 16 }}>
                    <p style={{ fontSize: 13, color: '#F5F4F2', fontStyle: 'italic', lineHeight: 1.7 }}>{persona.quote}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[{ label: 'Objetivos', items: persona.goals, dot: '#22c55e' }, { label: 'Dores', items: persona.pains, dot: '#F25BA5' }, { label: 'Comportamentos', items: persona.behaviors, dot: '#F19877' }].map(sec => (
                    <div key={sec.label}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{sec.label}</p>
                      {sec.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 5 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: sec.dot, marginTop: 5, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 3 — REFERÊNCIAS                                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {tab === 3 && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: serif, fontSize: 36, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, marginBottom: 8 }}>
                Referências para{' '}
                <span style={{ color: '#F25BA5' }}>{client.name.split(' ')[0]}</span>.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
                Sugestões de conteúdo baseadas no segmento <strong>{client.segment}</strong>. Filtre por formato ou busque por tema.
              </p>
            </div>

            {/* Commercial dates */}
            <div style={{ background: 'var(--bg-2)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Datas comemorativas — {mes}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {comercialDates.map(d => (
                  <div key={d.date + d.event} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#F25BA5' }}>{d.date}</span>
                    <span style={{ fontSize: 12, color: 'var(--text)' }}>{d.event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Search + filters */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                <input value={refSearch} onChange={e => setRefSearch(e.target.value)} placeholder="Buscar tema ou ideia..."
                  style={{ width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 999, padding: '10px 16px 10px 34px', fontSize: 13, color: 'var(--text)', outline: 'none', fontFamily: font }} />
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['foto', 'feed', 'reels', 'carrossel', 'stories'].map(f => (
                  <button key={f} onClick={() => setFmts(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])}
                    style={{ background: fmts.includes(f) ? '#86efac' : '#F5F4F2', border: `1px solid ${fmts.includes(f) ? '#4ade80' : 'var(--border-2)'}`, borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: fmts.includes(f) ? 700 : 400, color: 'var(--text)', cursor: 'pointer' }}>
                    {f}
                  </button>
                ))}
                {fmts.length > 0 && (
                  <button onClick={() => setFmts([])} style={{ background: 'transparent', border: 'none', fontSize: 12, color: 'var(--text-4)', cursor: 'pointer' }}>limpar</button>
                )}
              </div>
            </div>

            <div className="rg-2" style={{ gap: 14 }}>
              {filteredRefs.map((ref, i) => (
                <div key={i} style={{ background: 'var(--bg-2)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{ref.theme}</p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {ref.formats.map(f => (
                        <span key={f} style={{ background: '#86efac', color: 'var(--text)', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, textTransform: 'capitalize' }}>{f}</span>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(31,27,26,0.65)', lineHeight: 1.6, fontStyle: 'italic' }}>"{ref.caption}"</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {ref.hashtags.map(h => <span key={h} style={{ fontSize: 11, color: '#F25BA5', fontWeight: 600 }}>{h}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function StratSection({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  const serif = "'Playfair Display', Georgia, serif"
  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ borderLeft: `4px solid ${accent}`, padding: '20px 24px 0' }}>
        <p style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>{label}</p>
      </div>
      <div style={{ padding: '0 24px 24px' }}>
        {children}
      </div>
    </div>
  )
}
