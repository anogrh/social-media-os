import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Você é uma estrategista de conteúdo para redes sociais especializada em marcas premium brasileiras.

Sua missão é criar conteúdo estratégico e pronto para uso — nunca genérico. Cada peça deve ter:
- Objetivo claro de funil (topo, meio ou fundo)
- Gancho forte nos primeiros segundos ou na capa
- Linguagem completamente alinhada ao cliente
- CTA coerente com o momento comercial
- Orientação visual detalhada para o designer

REGRAS OBRIGATÓRIAS:
1. Nunca use frases genéricas como "milagre", "resultado garantido", "o melhor do mercado"
2. Sempre adapte a linguagem ao tom de voz cadastrado do cliente
3. Se houver campanha ativa, todo conteúdo deve conectar-se a ela
4. O gancho deve ser específico e intrigante — nunca vago
5. O CTA deve ser natural e coerente com o funil
6. Entregue conteúdo 100% pronto para uso, sem espaços de preenchimento

FORMATO DE RESPOSTA: Sempre responda em JSON estruturado conforme o formato solicitado.`

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY não configurada. Adicione nas variáveis de ambiente.' },
      { status: 503 }
    )
  }

  const body = await request.json()
  const { type, data } = body

  let userPrompt = ''

  if (type === 'reels') {
    userPrompt = buildReelsPrompt(data)
  } else if (type === 'carrossel') {
    userPrompt = buildCarrosselPrompt(data)
  } else if (type === 'stories') {
    userPrompt = buildStoriesPrompt(data)
  } else if (type === 'analise') {
    userPrompt = buildAnalisePrompt(data)
  } else {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Try to parse JSON, fallback to raw text
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/(\{[\s\S]*\})/)
      const jsonStr = jsonMatch ? jsonMatch[1] : text
      const result = JSON.parse(jsonStr)
      return NextResponse.json({ result })
    } catch {
      return NextResponse.json({ result: { raw: text } })
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao gerar conteúdo'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

function buildReelsPrompt(d: Record<string, string>) {
  return `Gere um roteiro completo de Reels para Instagram.

DADOS DO CLIENTE:
- Cliente/Marca: ${d.client || 'Não informado'}
- Segmento: ${d.segment || 'Não informado'}
- Tom de voz: ${d.brandVoice || 'Premium, direto e autêntico'}
- Produto/serviço foco: ${d.product || 'Não informado'}
- Campanha ativa: ${d.campaign || 'Nenhuma'}

CONFIGURAÇÕES DO REELS:
- Objetivo/Funil: ${d.funnelStage || 'Não informado'}
- Tipo de abordagem: ${d.approach || 'Não informado'}
- Tema: ${d.theme}
- Nível de venda: ${d.saleLevel || 'Venda sutil'}
- Estilo do vídeo: ${d.videoStyle || 'Falado para câmera'}
- Duração: ${d.duration || '30 segundos'}

Retorne um JSON com esta estrutura exata:
{
  "hook": {
    "texto": "...",
    "tipo": "dor/curiosidade/opinião/identificação",
    "justificativa": "..."
  },
  "roteiro": [
    {
      "tempo": "0-3s",
      "fala": "...",
      "visual": "...",
      "textoCena": "...",
      "observacao": "..."
    }
  ],
  "cta": {
    "texto": "...",
    "tipo": "..."
  },
  "direcaoVisual": {
    "cenario": "...",
    "iluminacao": "...",
    "takes": "...",
    "edicao": "...",
    "trilha": "..."
  },
  "legenda": "...",
  "variacoesHook": ["...", "...", "..."],
  "checklistEstrategico": ["...", "..."]
}`
}

function buildCarrosselPrompt(d: Record<string, string>) {
  return `Gere um carrossel completo para Instagram.

DADOS DO CLIENTE:
- Cliente/Marca: ${d.client || 'Não informado'}
- Segmento: ${d.segment || 'Não informado'}
- Tom de voz: ${d.brandVoice || 'Premium, direto e autêntico'}
- Produto/serviço foco: ${d.product || 'Não informado'}
- Campanha ativa: ${d.campaign || 'Nenhuma'}

CONFIGURAÇÕES DO CARROSSEL:
- Objetivo/Funil: ${d.funnelStage}
- Tipo de carrossel: ${d.carouselType}
- Tema: ${d.theme}
- Quantidade de slides: ${d.slides || '6'}
- Profundidade: ${d.depth || 'Educativo leve'}
- Tom: ${d.tone || d.brandVoice || 'Premium e direto'}
- Nível de venda: ${d.saleLevel || 'Venda sutil'}
- CTA desejada: ${d.cta || 'Salvar'}

Retorne um JSON com esta estrutura exata:
{
  "slides": [
    {
      "numero": 1,
      "tipo": "capa",
      "tituloPrincipal": "...",
      "subtitulo": "...",
      "textoPrincipal": "...",
      "orientacaoVisual": "...",
      "intencaoEstrategica": "..."
    }
  ],
  "variacoesCapa": ["...", "...", "..."],
  "legenda": {
    "abertura": "...",
    "desenvolvimento": "...",
    "cta": "..."
  },
  "orientacaoVisualGeral": "...",
  "storiesComplementares": ["...", "..."],
  "reelsDerivado": "...",
  "checklistEstrategico": ["...", "..."]
}`
}

function buildStoriesPrompt(d: Record<string, string>) {
  return `Gere uma sequência de Stories para Instagram.

DADOS DO CLIENTE:
- Cliente/Marca: ${d.client || 'Não informado'}
- Tom de voz: ${d.brandVoice || 'Premium, direto e autêntico'}
- Produto/serviço foco: ${d.product || 'Não informado'}
- Campanha ativa: ${d.campaign || 'Nenhuma'}

CONFIGURAÇÕES DOS STORIES:
- Estratégia: ${d.strategy}
- Objetivo: ${d.objective}
- Tema: ${d.theme}
- Nível de venda: ${d.saleLevel || 'Venda sutil'}

Retorne um JSON com esta estrutura exata:
{
  "sequencia": [
    {
      "numero": 1,
      "texto": "...",
      "fundoIdeal": "...",
      "ferramenta": "enquete/caixaPerguntas/quiz/reacao/link/nenhuma",
      "configuracaoFerramenta": "...",
      "intencao": "..."
    }
  ],
  "storyGancho": "...",
  "ctaFinal": "...",
  "checklistEstrategico": ["...", "..."]
}`
}

function buildAnalisePrompt(d: Record<string, string>) {
  return `Faça um diagnóstico estratégico completo do perfil do Instagram.

DADOS DO PERFIL:
- Nome da marca: ${d.brandName}
- Bio atual: ${d.bio || 'Não informada'}
- Segmento: ${d.segment}
- Produto/serviço principal: ${d.product}
- Público-alvo: ${d.audience}
- Principais dores do público: ${d.pains || 'Não informado'}
- Diferenciais: ${d.differentials || 'Não informado'}
- Temas mais abordados: ${d.topics || 'Não informado'}
- Concorrentes ou referências: ${d.competitors || 'Não informado'}

Retorne um JSON com esta estrutura exata:
{
  "diagnosticoGeral": "...",
  "pontosFortes": ["...", "..."],
  "pontosFracos": ["...", "..."],
  "ajustesRapidos": ["...", "..."],
  "sugestoesBio": [
    { "versao": 1, "texto": "..." },
    { "versao": 2, "texto": "..." },
    { "versao": 3, "texto": "..." }
  ],
  "pilaresEditoriais": [
    { "pilar": "...", "descricao": "...", "exemplosPautas": ["...", "..."] }
  ],
  "proximosConteudos": [
    { "formato": "...", "tema": "...", "objetivo": "...", "prioridade": "alta/media/baixa" }
  ]
}`
}
