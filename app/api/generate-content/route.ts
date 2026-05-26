import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { type, data } = body

  let result: unknown

  if (type === 'reels') result = generateReels(data)
  else if (type === 'carrossel') result = generateCarrossel(data)
  else if (type === 'stories') result = generateStories(data)
  else if (type === 'analise') result = generateAnalise(data)
  else return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })

  return NextResponse.json({ result })
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function clientName(d: Record<string, string>) {
  return d.client || 'a marca'
}

function getHooksByApproach(approach: string, theme: string, funnelStage: string): { texto: string; tipo: string; justificativa: string } {
  const tema = theme.toLowerCase()

  const hookMap: Record<string, string[]> = {
    'Opinião forte': [
      `A maioria das pessoas está errando quando se trata de ${tema}.`,
      `Isso que todo mundo faz com ${tema} está completamente errado.`,
      `Ninguém te conta a verdade sobre ${tema} — e é hora de mudar isso.`,
    ],
    'Desmistificação': [
      `${capitalizeFirst(tema)} não é o que você pensa.`,
      `O mito mais comum sobre ${tema} que precisa acabar hoje.`,
      `Se você acredita nisso sobre ${tema}, eu preciso te contar algo.`,
    ],
    'Tutorial rápido': [
      `Em ${pick(['30', '60', '45'])} segundos você aprende tudo sobre ${tema}.`,
      `O passo que todo mundo pula quando vai fazer ${tema}.`,
      `Faça ${tema} certo da primeira vez. Olha esse método simples.`,
    ],
    'Erro comum': [
      `Você provavelmente está cometendo esse erro com ${tema}.`,
      `O erro que mais vejo quando o assunto é ${tema}.`,
      `Para. Antes de continuar com ${tema}, você precisa ver isso.`,
    ],
    'Antes e depois': [
      `A diferença que ${tema} faz quando você faz do jeito certo.`,
      `Esse resultado foi só mudando uma coisa em ${tema}.`,
      `Antes e depois de entender como ${tema} realmente funciona.`,
    ],
    'Storytelling curto': [
      `Isso aconteceu com um cliente — e mudou tudo que pensei sobre ${tema}.`,
      `Quando entendi isso sobre ${tema}, não conseguia acreditar.`,
      `Tem uma história por trás do motivo de eu falar sobre ${tema}.`,
    ],
    'Pauta quente': [
      `Todo mundo está falando sobre isso. Mas poucos entenderam o impacto em ${tema}.`,
      `Esse é o momento certo pra gente falar sobre ${tema}.`,
      `O que está acontecendo com ${tema} agora que você precisa saber.`,
    ],
    'Formato livre': [
      `Sobre ${tema} — o que nunca te contaram.`,
      `Você já parou para pensar de verdade sobre ${tema}?`,
      `${capitalizeFirst(tema)}: o que eu aprendi e quero compartilhar.`,
    ],
  }

  const hooks = hookMap[approach] || hookMap['Formato livre']
  const hookTexto = pick(hooks)

  const tipoMap: Record<string, string> = {
    'Topo de funil': 'curiosidade',
    'Meio de funil': 'dor',
    'Fundo de funil': 'desejo',
    'Topo': 'curiosidade',
    'Meio': 'identificação',
    'Fundo': 'dor',
  }

  return {
    texto: hookTexto,
    tipo: tipoMap[funnelStage] || 'curiosidade',
    justificativa: `Hook de ${(tipoMap[funnelStage] || 'curiosidade')} criado para ${funnelStage.toLowerCase()}. Prende atenção nos primeiros 3 segundos ao gerar identificação imediata com o tema sem entregar a resposta — forçando o espectador a continuar.`,
  }
}

function getCTAByFunnel(funnelStage: string, client: string): { texto: string; tipo: string } {
  if (funnelStage.toLowerCase().includes('topo') || funnelStage.toLowerCase().includes('top')) {
    return {
      texto: pick([
        'Salva esse vídeo pra não esquecer.',
        'Compartilha com alguém que precisa ver isso.',
        'Comenta aqui se isso já aconteceu com você.',
        'Segue pra ver mais conteúdo assim.',
      ]),
      tipo: 'engajamento orgânico',
    }
  }
  if (funnelStage.toLowerCase().includes('meio') || funnelStage.toLowerCase().includes('mid')) {
    return {
      texto: pick([
        'Me conta nos comentários qual desses pontos você já percebeu.',
        'Quer que eu faça uma parte 2 sobre isso?',
        'Salva pra aplicar na sua rotina.',
        'Qual foi a parte que mais fez sentido pra você? Comenta.',
      ]),
      tipo: 'geração de conversa',
    }
  }
  return {
    texto: pick([
      `Conheça a linha completa no link da bio.`,
      `Chama no direct e descobre o que combina com você.`,
      `Garante o seu pelo link da bio — link fixado nos stories.`,
      `Acessa o link da bio e vê as opções disponíveis agora.`,
    ]),
    tipo: 'conversão direta',
  }
}

function getVisualDirection(videoStyle: string, theme: string): Record<string, string> {
  const styleMap: Record<string, Record<string, string>> = {
    'Falado para câmera': {
      cenario: `Ambiente clean, fundo neutro ou levemente desfocado. Luz na frente do rosto, sem sombras duras.`,
      iluminacao: `Luz natural frontal ou ring light suave. Temperatura quente para acolhimento.`,
      takes: `Câmera fixa ou levemente inclinada. Olhar direto para o espectador. Aproximação gradual para pontos-chave.`,
      edicao: `Cortes rápidos entre frases. Sem pausas. Legendas sempre ativas. Zoom sutil nos momentos de impacto.`,
      trilha: `Trilha instrumental leve ao fundo, sem competir com a voz. Volume baixo — só para preencher.`,
    },
    'B-roll com narração': {
      cenario: `Cenas de apoio: produto em uso, rotina, textura, detalhe, bastidor. Intercalar close e plano aberto.`,
      iluminacao: `Luz natural quando possível. Sombras leves para criar profundidade nos produtos.`,
      takes: `Close no produto, detalhe de textura, mão em uso, resultado visual. Movimento suave na câmera.`,
      edicao: `Cortes no ritmo da música. Transições suaves. Texto na tela acompanhando a narração.`,
      trilha: `Trilha mais presente — guia o ritmo do vídeo. Escolher algo que combine com a estética da marca.`,
    },
    'Demonstração de produto': {
      cenario: `Superfície limpa, fundo de mármore, madeira ou tecido premium. Produto centralizado.`,
      iluminacao: `Luz lateral para revelar textura. Luz frontal para realçar cor e embalagem.`,
      takes: `Close na textura, aplicação, antes e depois. Mão segurando o produto com naturalidade.`,
      edicao: `Slow motion nos momentos de textura. Cortes precisos. Texto descritivo com benefícios.`,
      trilha: `Trilha premium, moderna. Batida suave com estética de marca de cuidados.`,
    },
    'Texto na tela sem fala': {
      cenario: `Fundo sólido ou levemente texturizado. Fonte grande, legível, com hierarquia visual clara.`,
      iluminacao: `Não se aplica. Focar em design do texto e contraste com o fundo.`,
      takes: `Transições de texto com animação simples. Cada frase em destaque separado.`,
      edicao: `Ritmo visual guiado pelas frases. Cada slide de texto bem espaçado no tempo.`,
      trilha: `Trilha instrumental com energia correspondente ao tom. Volume presente — compensa ausência de voz.`,
    },
    'Trend adaptada': {
      cenario: `Adaptar o cenário ao trend em uso, mantendo identidade da marca.`,
      iluminacao: `Depende do trend — seguir o padrão visual da tendência com toque da marca.`,
      takes: `Reproduzir o formato do trend com personalidade própria. Não copiar — interpretar.`,
      edicao: `Usar o áudio original do trend. Cortes alinhados com o ritmo do áudio.`,
      trilha: `Áudio do trend — verificar popularidade e adequação à marca antes de usar.`,
    },
  }
  return styleMap[videoStyle] || styleMap['Falado para câmera']
}

function generateReels(d: Record<string, string>) {
  const client = clientName(d)
  const theme = d.theme || 'o tema escolhido'
  const funnel = d.funnelStage || 'Meio de funil'
  const approach = d.approach || 'Formato livre'
  const duration = d.duration || '30 segundos'
  const videoStyle = d.videoStyle || 'Falado para câmera'
  const saleLevel = d.saleLevel || 'Venda sutil'

  const hook = getHooksByApproach(approach, theme, funnel)
  const cta = getCTAByFunnel(funnel, client)
  const visual = getVisualDirection(videoStyle, theme)

  const segundos = parseInt(duration)
  const roteiro = buildRoteiro(theme, approach, funnel, saleLevel, client, segundos)

  const legenda = buildLegenda(theme, funnel, saleLevel, client, cta.texto)

  const variacoesHook = [
    `Você está cometendo um erro que quase todo mundo comete com ${theme.toLowerCase()}.`,
    `${capitalizeFirst(theme.toLowerCase())} — o que muda quando você faz do jeito certo.`,
    `Isso sobre ${theme.toLowerCase()} pouca gente te conta.`,
  ]

  const checklist = [
    '✓ O gancho prende atenção nos primeiros 3 segundos',
    '✓ Linguagem alinhada ao tom de voz da marca',
    '✓ CTA coerente com o objetivo de funil',
    '✓ Conteúdo entrega valor real antes de vender',
    '✓ Texto na tela reforça os pontos principais',
    '✓ Orientação visual clara para o designer/editor',
  ]

  return { hook, roteiro, cta, direcaoVisual: visual, legenda, variacoesHook, checklistEstrategico: checklist }
}

function buildRoteiro(theme: string, approach: string, funnel: string, saleLevel: string, client: string, duracao: number) {
  const tema = theme.toLowerCase()
  const blocos: Array<{ tempo: string; fala: string; visual: string; textoCena: string; observacao: string }> = []

  // Hook (0-3s)
  blocos.push({
    tempo: '0–3s',
    fala: pick([
      `Você provavelmente está errando com ${tema}.`,
      `O que ninguém te conta sobre ${tema}.`,
      `Isso sobre ${tema} mudou tudo pra mim.`,
    ]),
    visual: 'Close no rosto ou produto. Sem introdução.',
    textoCena: capitalizeFirst(tema),
    observacao: 'Hook direto. Sem "oi, tudo bem". Vai direto ao ponto.',
  })

  // Problema (3–10s)
  blocos.push({
    tempo: '3–10s',
    fala: pick([
      `A maioria das pessoas não percebe que está fazendo isso errado. E o resultado aparece depois — quando já passou.`,
      `O problema começa antes do que você imagina. E é fácil de resolver quando você sabe o que procurar.`,
      `Isso é mais comum do que parece. E quase sempre tem um motivo específico acontecendo por baixo.`,
    ]),
    visual: 'Plano aberto. Expressão de empatia. Movimento de câmera sutil.',
    textoCena: 'Você sabia?',
    observacao: 'Criar identificação. Espectador deve pensar "é exatamente isso".',
  })

  // Desenvolvimento (10–22s)
  if (duracao >= 30) {
    blocos.push({
      tempo: '10–22s',
      fala: pick([
        `Quando você entende o porquê, fica simples. O que acontece é que ${tema} precisa de atenção em três pontos principais: constância, cuidado com o processo e paciência com o resultado.`,
        `A solução não é complicada. Mas exige que você mude uma coisa específica. E quando isso muda, tudo muda junto. É sobre entender o que realmente influencia ${tema}.`,
        `Pensa assim: ${tema} tem etapas. Cada uma delas importa. Quando você pula uma, o resultado final sofre — mesmo que você esteja fazendo o resto certo.`,
      ]),
      visual: 'Close no produto ou demonstração. Intercalar com close no rosto.',
      textoCena: '3 pontos principais',
      observacao: 'Entregar valor real. Esse é o coração do conteúdo.',
    })
  }

  // Solução / produto (22–28s)
  if (saleLevel !== 'Sem venda direta' && saleLevel !== 'sem_venda') {
    blocos.push({
      tempo: duracao >= 45 ? '22–28s' : '18–24s',
      fala: pick([
        `Foi exatamente pensando nisso que ${client} criou uma solução que resolve isso de forma prática, sem complicar.`,
        `E foi para isso que ${client} desenvolveu esse produto. Para quem quer resultado sem abrir mão de praticidade.`,
        `${client} tem uma opção feita especificamente para esse cuidado — e faz diferença no dia a dia.`,
      ]),
      visual: 'Produto em destaque. Textura, embalagem, aplicação.',
      textoCena: 'A solução certa',
      observacao: 'Produto aparece como consequência natural — não como propaganda.',
    })
  }

  // CTA
  blocos.push({
    tempo: `${duracao - 5}–${duracao}s`,
    fala: pick([
      `Salva esse vídeo pra não perder. E me conta nos comentários o que você já sabia disso.`,
      `Se isso fez sentido pra você, compartilha com alguém que precisa ver.`,
      `Acessa o link da bio pra conhecer melhor. Qualquer dúvida, chama no direct.`,
    ]),
    visual: 'Olhar direto para câmera. Tom de conversa próxima.',
    textoCena: 'Link na bio →',
    observacao: 'CTA natural, não forçado.',
  })

  return blocos
}

function buildLegenda(theme: string, funnel: string, saleLevel: string, client: string, cta: string): string {
  const tema = theme.toLowerCase()
  const abertura = pick([
    `${capitalizeFirst(tema)} é um dos assuntos que mais recebo perguntas — e faz sentido.`,
    `Sobre ${tema}: tem muita coisa por aí que não te conta o que realmente importa.`,
    `Quando o assunto é ${tema}, a maioria dos erros é fácil de evitar. Mas só quando você sabe o que procurar.`,
  ])
  const desenvolvimento = pick([
    `O que mais vejo é gente fazendo certo em um ponto e errando em outro. E é aí que o resultado some. A consistência faz toda a diferença — não a perfeição.`,
    `O resultado vem quando você entende o processo por trás, não só o que fazer na superfície. E isso muda tudo quando vira rotina.`,
    `Não é sobre usar mais produto ou fazer mais esforço. É sobre entender o que realmente funciona pra você e manter isso.`,
  ])
  const ctaLegenda = saleLevel !== 'Sem venda direta' && saleLevel !== 'sem_venda'
    ? `\n\n${cta}`
    : `\n\n${cta}`
  return `${abertura}\n\n${desenvolvimento}${ctaLegenda}`
}

// ─── CARROSSEL ───────────────────────────────────────────────────────────────

function generateCarrossel(d: Record<string, string>) {
  const client = clientName(d)
  const theme = d.theme || 'o tema escolhido'
  const funnel = d.funnelStage || 'Meio de funil'
  const carouselType = d.carouselType || 'educativo'
  const slidesCount = parseInt(d.slides) || 6
  const depth = d.depth || 'leve'
  const ctaDesejada = d.cta || 'Salvar'
  const saleLevel = d.saleLevel || 'sutil'

  const slides = buildSlides(theme, carouselType, funnel, saleLevel, client, slidesCount, depth, ctaDesejada)
  const variacoesCapa = buildCapaVariations(theme, carouselType)
  const legenda = buildCarrosselLegenda(theme, funnel, saleLevel, client, ctaDesejada)
  const orientacaoVisualGeral = buildVisualGuidance(carouselType, depth)
  const storiesComplementares = buildStoriesComplementares(theme)
  const reelsDerivado = `Reels derivado sugerido: "${capitalizeFirst(theme.toLowerCase())} — o que muda quando você faz do jeito certo" (30s, abordagem opinião forte, mesmo tema do carrossel).`

  const checklist = [
    '✓ Capa tem título magnético e objetivo emocional claro',
    '✓ Cada slide tem função estratégica definida',
    '✓ Texto é escaneável — títulos curtos, parágrafos pequenos',
    '✓ Último slide tem CTA específica, não genérica',
    '✓ Legenda complementa sem repetir os slides',
    '✓ Orientação visual entregue ao designer',
  ]

  return { slides, variacoesCapa, legenda, orientacaoVisualGeral, storiesComplementares, reelsDerivado, checklistEstrategico: checklist }
}

function buildSlides(theme: string, type: string, funnel: string, saleLevel: string, client: string, count: number, depth: string, ctaDesejada: string) {
  const tema = theme.toLowerCase()
  const isDeep = depth === 'completo'

  const structureMap: Record<string, Array<{ tipo: string; titulo: string; texto: string; visual: string; intencao: string }>> = {
    educativo: [
      { tipo: 'capa', titulo: capitalizeFirst(tema), texto: `O que você precisa saber sobre ${tema} — e ninguém te contou.`, visual: `Título em destaque, fundo clean, subtítulo menor.`, intencao: 'Gerar clique e interesse imediato' },
      { tipo: 'slide', titulo: 'Por que isso importa', texto: `${capitalizeFirst(tema)} afeta diretamente o resultado final. E muitas vezes o problema está em um detalhe que parece pequeno.`, visual: 'Ícone ou elemento visual simples. Fundo neutro.', intencao: 'Criar identificação com o problema' },
      { tipo: 'slide', titulo: 'O erro mais comum', texto: `A maioria das pessoas faz ${tema} sem entender o processo. O resultado: esforço sem retorno.`, visual: 'Elemento de alerta. Cor de atenção sutil.', intencao: 'Aguçar a dor para manter leitura' },
      { tipo: 'slide', titulo: 'O que realmente funciona', texto: `Quando você entende os fundamentos de ${tema}, o resultado aparece com muito mais consistência.`, visual: 'Visual positivo. Elemento de resolução.', intencao: 'Apresentar a virada — a solução' },
      { tipo: 'slide', titulo: 'Como aplicar', texto: `1. Entenda o seu contexto. 2. Adapte para a sua rotina. 3. Seja consistente. Simples assim.`, visual: 'Lista numerada em destaque. Clean e direto.', intencao: 'Entregar valor prático e acionável' },
      { tipo: 'cta', titulo: `${ctaDesejada} esse post`, texto: `Toda vez que precisar de referência sobre ${tema}, ele vai estar aqui.`, visual: 'CTA em destaque. Fundo sólido com cor da marca.', intencao: 'Converter leitura em ação' },
    ],
    erros: [
      { tipo: 'capa', titulo: `Erros com ${tema}`, texto: `Os erros mais comuns que impedem você de ter resultado com ${tema}.`, visual: 'Elemento de alerta. Tom direto e impactante.', intencao: 'Gerar clique por medo de estar errando' },
      { tipo: 'slide', titulo: 'Erro 1', texto: `Focar no resultado sem entender o processo. Com ${tema}, o caminho é tão importante quanto o destino.`, visual: 'Número em destaque. Cor diferenciada para erro.', intencao: 'Criar identificação com o primeiro erro' },
      { tipo: 'slide', titulo: 'Erro 2', texto: `Querer resultado rápido. ${capitalizeFirst(tema)} pede consistência — não intensidade de curto prazo.`, visual: 'Mesmo padrão. Progressão visual clara.', intencao: 'Aprofundar a identificação' },
      { tipo: 'slide', titulo: 'Erro 3', texto: `Não adaptar para o seu contexto. O que funciona para todos pode não funcionar igual para você.`, visual: 'Terceiro elemento. Reforço do padrão visual.', intencao: 'Completar o trio de erros' },
      { tipo: 'slide', titulo: 'Como corrigir', texto: `Entenda primeiro. Adapte depois. Teste com calma. E aí sim, mantenha o que funciona.`, visual: 'Visual de solução. Mudança de tonalidade para positivo.', intencao: 'Virada — de problema para solução' },
      { tipo: 'cta', titulo: 'Salva pra não esquecer', texto: `Compartilha com alguém que precisa ver isso sobre ${tema}.`, visual: 'CTA final com tom amigável.', intencao: 'Máximo salvamento e compartilhamento' },
    ],
    comparativo: [
      { tipo: 'capa', titulo: 'A diferença que faz', texto: `${capitalizeFirst(tema)}: o que separa quem tem resultado de quem não tem.`, visual: 'Visual comparativo. Dois lados em destaque.', intencao: 'Provocar curiosidade pela comparação' },
      { tipo: 'slide', titulo: 'O jeito comum', texto: `A maioria faz ${tema} no piloto automático. Sem entender o que está fazendo — e por quê.`, visual: 'Lado A. Cor mais neutra ou apagada.', intencao: 'Mostrar o comportamento que o público reconhece' },
      { tipo: 'slide', titulo: 'O jeito estratégico', texto: `Quem tem resultado entende o processo. Não faz mais — faz melhor. E com intenção clara.`, visual: 'Lado B. Cor mais forte, visual de destaque.', intencao: 'Apresentar o contraste e o desejo' },
      { tipo: 'slide', titulo: 'A diferença real', texto: `Não é esforço. É consciência. Quem entende ${tema} de verdade gasta menos energia e tem mais resultado.`, visual: 'Elemento de síntese. Visual de clareza.', intencao: 'Cristalizar o aprendizado' },
      { tipo: 'slide', titulo: 'Por onde começar', texto: `Observe o que você já faz. Identifique o que está no automático. Mude um ponto por vez.`, visual: 'Passos simples. Sem sobrecarregar.', intencao: 'Tornar o conteúdo acionável' },
      { tipo: 'cta', titulo: 'Qual lado você está?', texto: `Comenta aqui — você se viu mais no jeito comum ou no estratégico?`, visual: 'Pergunta em destaque. Tom de conversa.', intencao: 'Gerar comentários e engajamento' },
    ],
    produto: [
      { tipo: 'capa', titulo: `A solução pra ${tema}`, texto: `O que ${client} criou especificamente para resolver ${tema} no dia a dia.`, visual: 'Produto em destaque. Fundo premium.', intencao: 'Gerar interesse no produto como solução' },
      { tipo: 'slide', titulo: 'O problema que todo mundo tem', texto: `${capitalizeFirst(tema)} é um ponto de dor real. E as soluções genéricas não resolvem — porque não foram feitas para isso.`, visual: 'Elemento de dor. Tom empático.', intencao: 'Criar identificação antes de vender' },
      { tipo: 'slide', titulo: 'O que muda', texto: `Quando você usa algo feito especificamente para ${tema}, o resultado é diferente. Mais consistente. Mais real.`, visual: 'Produto aplicado. Resultado visual.', intencao: 'Apresentar a promessa do produto' },
      { tipo: 'slide', titulo: 'Os benefícios principais', texto: `1. Resultado visível desde o início. 2. Fórmula pensada para esse cuidado específico. 3. Prático de incluir na rotina.`, visual: 'Lista de benefícios. Produto em destaque.', intencao: 'Detalhar o valor do produto' },
      { tipo: 'slide', titulo: 'Como usar', texto: `Simples e direto. Sem complicar a rotina. Resultados que aparecem com o uso consistente.`, visual: 'Demonstração. Passo a passo visual.', intencao: 'Reduzir objeção de uso' },
      { tipo: 'cta', titulo: 'Conheça no link da bio', texto: `${client} — feito para quem leva ${tema} a sério.`, visual: 'Produto centralizado. CTA clara.', intencao: 'Converter para visita ao perfil/loja' },
    ],
  }

  const structure = structureMap[type] || structureMap.educativo
  const selectedSlides = structure.slice(0, Math.min(count, structure.length))

  // If count > available structure, repeat middle slides
  while (selectedSlides.length < count) {
    const middleIndex = Math.floor(selectedSlides.length / 2)
    const extraSlide = {
      tipo: 'slide',
      titulo: `Aprofundando: ${tema}`,
      texto: isDeep
        ? `Existe um aspecto de ${tema} que raramente é discutido: a relação entre contexto e resultado. O que funciona em um cenário pode não funcionar em outro — e saber disso é o que separa quem evolui de quem fica no mesmo lugar.`
        : `Mais um ponto importante sobre ${tema}: consistência supera intensidade. Faça menos, com mais constância.`,
      visual: 'Slide de aprofundamento. Texto leve, fundo clean.',
      intencao: 'Aprofundar o conteúdo e aumentar o valor percebido',
    }
    selectedSlides.splice(middleIndex, 0, extraSlide)
  }

  return selectedSlides.map((s, i) => ({ numero: i + 1, ...s }))
}

function buildCapaVariations(theme: string, type: string): string[] {
  const tema = theme.toLowerCase()
  return [
    `${capitalizeFirst(tema)}: o que ninguém te contou`,
    `Você está fazendo ${tema} errado?`,
    `${capitalizeFirst(tema)} — o guia direto ao ponto`,
  ]
}

function buildCarrosselLegenda(theme: string, funnel: string, saleLevel: string, client: string, cta: string) {
  const tema = theme.toLowerCase()
  return {
    abertura: pick([
      `${capitalizeFirst(tema)} é um dos temas que mais recebo perguntas — e faz todo sentido.`,
      `Quando o assunto é ${tema}, muita gente começa bem mas perde o fio no meio do caminho.`,
      `Fiz esse carrossel pra quem quer entender ${tema} de verdade, não só a superfície.`,
    ]),
    desenvolvimento: pick([
      `O que mais vejo é confusão entre o que funciona de verdade e o que parece funcionar. E a diferença está nos detalhes que quase ninguém ensina. Por isso esse conteúdo — simples, direto e sem enrolação.`,
      `Cada slide foi pensado para fazer sentido sozinho — mas juntos, eles mudam a forma como você vê ${tema}. Desliza com atenção.`,
      `Esse não é um conteúdo pra ler e esquecer. É pra salvar, voltar sempre que precisar, e aplicar um passo por vez.`,
    ]),
    cta: saleLevel !== 'Sem venda' && saleLevel !== 'sem_venda'
      ? `${cta} — e se quiser saber mais, ${client} tem o que você precisa. Link na bio.`
      : `${cta} esse post pra consultar sempre que precisar.`,
  }
}

function buildVisualGuidance(type: string, depth: string): string {
  return `Use fundo claro com contraste limpo. Títulos grandes e hierarquia visual clara — máximo 3 linhas de texto por slide. Produto em destaque nos slides de solução. Consistência de cores e tipografia ao longo de todos os slides. ${depth === 'completo' ? 'Slides mais densos podem ter até 4 linhas — usar espaçamento maior para respirar.' : 'Menos texto, mais branco ao redor. Escaneabilidade é prioridade.'}`
}

function buildStoriesComplementares(theme: string): string[] {
  const tema = theme.toLowerCase()
  return [
    `Story 1 — Gancho: "Acabei de postar algo sobre ${tema} que vale muito. Desliza no feed."`,
    `Story 2 — Preview de slide: mostre a capa com seta apontando para o carrossel.`,
    `Story 3 — Enquete: "Você já tinha esse problema com ${tema}?" Sim / Ainda tenho`,
  ]
}

// ─── STORIES ─────────────────────────────────────────────────────────────────

function generateStories(d: Record<string, string>) {
  const client = clientName(d)
  const theme = d.theme || 'o tema escolhido'
  const strategy = d.strategy || 'educativo'
  const objective = d.objective || 'Gerar respostas'
  const saleLevel = d.saleLevel || 'sutil'

  const sequencia = buildStoriesSequence(theme, strategy, saleLevel, client, objective)
  const storyGancho = sequencia[0]?.texto || ''
  const ctaFinal = sequencia[sequencia.length - 1]?.texto || ''

  const checklist = [
    '✓ Sequência tem começo, meio e fim narrativo',
    '✓ Primeiro story prende em menos de 3 segundos',
    '✓ Ferramenta de engajamento usada no lugar certo',
    '✓ CTA no último story é natural e direto',
    '✓ Tom está alinhado à marca e ao objetivo',
  ]

  return { sequencia, storyGancho, ctaFinal, checklistEstrategico: checklist }
}

function buildStoriesSequence(theme: string, strategy: string, saleLevel: string, client: string, objective: string) {
  const tema = theme.toLowerCase()

  const sequences: Record<string, Array<{ texto: string; fundoIdeal: string; ferramenta: string; configuracaoFerramenta: string; intencao: string }>> = {
    vendas: [
      { texto: `Tem algo novo por aqui que eu preciso te contar sobre ${tema}. 👇`, fundoIdeal: 'Cor sólida da marca ou produto em destaque', ferramenta: 'nenhuma', configuracaoFerramenta: '', intencao: 'Criar antecipação e curiosidade' },
      { texto: `${capitalizeFirst(tema)} parece simples, mas a maioria das pessoas está fazendo de um jeito que não entrega o resultado real.`, fundoIdeal: 'Vídeo ou imagem do produto em contexto real', ferramenta: 'enquete', configuracaoFerramenta: 'Você sente isso?\nSim, muito / Às vezes', intencao: 'Criar identificação e coletar dado de audiência' },
      { texto: `Foi pensando nisso que ${client} criou algo feito especificamente para resolver esse ponto. Sem complicar.`, fundoIdeal: 'Close no produto. Fundo clean.', ferramenta: 'nenhuma', configuracaoFerramenta: '', intencao: 'Apresentar o produto como solução natural' },
      { texto: `O resultado? Quem usa com consistência sente diferença. E isso faz todo sentido quando você entende o que tem dentro.`, fundoIdeal: 'Produto com detalhe de textura ou resultado', ferramenta: 'reacao', configuracaoFerramenta: 'Reação: ❤️ se você quer saber mais', intencao: 'Gerar engajamento e confirmar interesse' },
      { texto: `Se você quer conhecer melhor ou tem alguma dúvida, chama aqui no direct. Vou te ajudar.`, fundoIdeal: 'Fundo simples. Tom pessoal e acolhedor.', ferramenta: 'caixaPerguntas', configuracaoFerramenta: 'Me conta: o que você já usa pra cuidar de ${tema}?', intencao: 'Abrir conversa direta e qualificar leads' },
    ],
    educativo: [
      { texto: `Você sabe mesmo o que está por trás de ${tema}? Vou te explicar em 4 stories.`, fundoIdeal: 'Fundo de cor, texto em destaque', ferramenta: 'enquete', configuracaoFerramenta: 'Você já sabia disso?\nSim / Não sabia', intencao: 'Ativar curiosidade e segmentar audiência' },
      { texto: `O ponto que quase ninguém fala sobre ${tema}: o processo é mais importante que o produto ou a técnica.`, fundoIdeal: 'Texto sobre fundo clean. Sem distração.', ferramenta: 'nenhuma', configuracaoFerramenta: '', intencao: 'Entregar o insight principal' },
      { texto: `Quando você entende isso, começa a fazer escolhas muito melhores. E o resultado aparece com consistência — não por acaso.`, fundoIdeal: 'Imagem ou vídeo de resultado real.', ferramenta: 'quiz', configuracaoFerramenta: 'Qual é o erro mais comum? A: Falta de rotina  B: Produto errado', intencao: 'Interação que reforça o aprendizado' },
      { texto: `Quer mais conteúdo assim? Responde aqui — me conta o que você ainda tem dúvida sobre ${tema}.`, fundoIdeal: 'Fundo simples. Tom de conversa próxima.', ferramenta: 'caixaPerguntas', configuracaoFerramenta: `Qual sua maior dúvida sobre ${tema}?`, intencao: 'Gerar conteúdo futuro e aproximar audiência' },
    ],
    bastidores: [
      { texto: `Deixa eu te mostrar como funciona por aqui. Coisas que raramente aparecem no feed.`, fundoIdeal: 'Vídeo de bastidor. Câmera leve, naturalidade.', ferramenta: 'nenhuma', configuracaoFerramenta: '', intencao: 'Criar sensação de exclusividade e proximidade' },
      { texto: `Cada detalhe de ${tema} passa por um processo antes de chegar pra você. E tem intenção em tudo isso.`, fundoIdeal: 'Vídeo do processo. Close nos detalhes.', ferramenta: 'nenhuma', configuracaoFerramenta: '', intencao: 'Construir percepção de cuidado e qualidade' },
      { texto: `Isso é o que diferencia o que ${client} faz. Não é só produto — é a atenção em cada etapa.`, fundoIdeal: 'Close em detalhe premium. Produto, embalagem ou processo.', ferramenta: 'reacao', configuracaoFerramenta: 'Gostou de ver por dentro? ❤️', intencao: 'Gerar engajamento e validar o bastidor' },
      { texto: `Se quiser saber mais sobre ${tema} ou entender melhor o que fazemos, chama aqui.`, fundoIdeal: 'Fundo da marca. Tom pessoal.', ferramenta: 'caixaPerguntas', configuracaoFerramenta: 'O que você quer saber mais sobre nós?', intencao: 'Abrir canal de comunicação direta' },
    ],
    objecoes: [
      { texto: `Vou responder as dúvidas mais comuns que recebo sobre ${tema}. Começando pela mais pedida.`, fundoIdeal: 'Texto sobre fundo sólido. Tom direto.', ferramenta: 'enquete', configuracaoFerramenta: 'Você já teve essa dúvida?\nSim / Nunca pensei nisso', intencao: 'Criar identificação antes de responder' },
      { texto: `"Não preciso me preocupar com ${tema} agora." — Essa é a mais comum. E entendo. Mas o timing certo faz toda a diferença.`, fundoIdeal: 'Texto. Aspas em destaque.', ferramenta: 'nenhuma', configuracaoFerramenta: '', intencao: 'Nomear e neutralizar a objeção principal' },
      { texto: `A verdade é que ${tema} é mais simples do que parece. O que torna difícil é a falta de informação certa na hora certa.`, fundoIdeal: 'Tom de esclarecimento. Visual limpo.', ferramenta: 'quiz', configuracaoFerramenta: 'Você acha que é difícil? A: Sim, muito  B: Não tanto assim', intencao: 'Reposicionar a percepção do público' },
      { texto: `Qualquer dúvida que ainda tiver, me manda aqui. Respondo todas.`, fundoIdeal: 'Tom próximo. Fundo simples.', ferramenta: 'caixaPerguntas', configuracaoFerramenta: `Sua dúvida sobre ${tema}:`, intencao: 'Coletar dúvidas e gerar conversa direta' },
    ],
    prova_social: [
      { texto: `Um feedback que recebi sobre ${tema} que quero compartilhar com vocês.`, fundoIdeal: 'Print ou texto de depoimento sobre fundo clean.', ferramenta: 'nenhuma', configuracaoFerramenta: '', intencao: 'Criar credibilidade com prova externa' },
      { texto: `"[depoimento do cliente sobre resultado com ${tema}]" — isso vem do uso consistente. Não é milagre — é método.`, fundoIdeal: 'Screenshot de mensagem real (com permissão).', ferramenta: 'reacao', configuracaoFerramenta: 'Você quer um resultado assim? ❤️', intencao: 'Amplificar o desejo pelo resultado' },
      { texto: `Esse resultado não vem de uma vez só. Mas vem — pra quem mantém a consistência.`, fundoIdeal: 'Antes e depois visual. Fundo neutro.', ferramenta: 'enquete', configuracaoFerramenta: 'Você já tentou resolver isso? Sim / Ainda não comecei', intencao: 'Segmentar audiência e qualificar interesse' },
      { texto: `Se você quer ter resultados assim com ${tema}, chama aqui no direct ou acessa o link da bio.`, fundoIdeal: 'CTA clara. Produto em destaque.', ferramenta: 'link', configuracaoFerramenta: 'Ver no site →', intencao: 'Converter prova social em ação' },
    ],
    conexao: [
      { texto: `Hoje quero falar sobre algo que vai além de ${tema}. Sobre o que torna tudo isso significativo.`, fundoIdeal: 'Fundo neutro. Tom pessoal.', ferramenta: 'nenhuma', configuracaoFerramenta: '', intencao: 'Criar conexão emocional antes de qualquer conteúdo' },
      { texto: `${capitalizeFirst(tema)} para nós não é só um produto ou serviço. É uma forma de cuidar — com intenção.`, fundoIdeal: 'Visual de marca. Identidade visual forte.', ferramenta: 'nenhuma', configuracaoFerramenta: '', intencao: 'Fortalecer os valores da marca' },
      { texto: `E cada pessoa que chega até nós traz uma história. Isso é o que torna o trabalho com ${tema} tão cheio de sentido.`, fundoIdeal: 'Imagem com emoção. Bastidor ou momento real.', ferramenta: 'reacao', configuracaoFerramenta: 'Você sente isso também? ❤️', intencao: 'Criar identificação e proximidade emocional' },
      { texto: `Obrigada por estar aqui. Cada um de vocês faz isso valer a pena.`, fundoIdeal: 'Mensagem de fechamento. Tom caloroso.', ferramenta: 'caixaPerguntas', configuracaoFerramenta: 'Me conta: o que te trouxe até aqui?', intencao: 'Aprofundar relacionamento com audiência' },
    ],
  }

  const strategyKey = strategy.toLowerCase().replace(/\s/g, '_').replace('narrativa_de_', '')
  const sequence = sequences[strategyKey] || sequences.educativo

  return sequence.map((s, i) => ({
    numero: i + 1,
    texto: s.texto.replace('${tema}', tema),
    fundoIdeal: s.fundoIdeal,
    ferramenta: s.ferramenta,
    configuracaoFerramenta: s.configuracaoFerramenta.replace('${tema}', tema),
    intencao: s.intencao,
  }))
}

// ─── ANÁLISE ─────────────────────────────────────────────────────────────────

function generateAnalise(d: Record<string, string>) {
  const brand = d.brandName || 'a marca'
  const segment = d.segment || 'o segmento'
  const product = d.product || 'o produto'
  const audience = d.audience || 'o público-alvo'
  const bio = d.bio || ''
  const differentials = d.differentials || ''
  const topics = d.topics || ''
  const pains = d.pains || ''

  const hasBio = bio.length > 10
  const hasDifferentials = differentials.length > 5

  const diagnosticoGeral = `${brand} atua no segmento de ${segment} com foco em ${product}. ${hasBio ? 'A bio atual comunica o produto, mas pode ser mais direta em benefício e CTA.' : 'A bio ainda não está clara o suficiente — precisa responder rapidamente quem é a marca, o que vende e para quem.'} O perfil tem potencial para ${audience.includes('jovem') ? 'alto engajamento com conteúdo de identificação e lifestyle' : 'construir autoridade no nicho com conteúdo educativo e prova de resultado'}. A principal oportunidade está na consistência editorial e na conexão entre conteúdo e campanha.`

  const pontosFortes = [
    hasDifferentials ? `Diferencial claro: ${differentials.slice(0, 60)}...` : `Produto com nicho de mercado definido`,
    `Público com dores específicas — facilita a criação de conteúdo de identificação`,
    topics ? `Temas abordados relevantes: ${topics.slice(0, 50)}` : `Potencial editorial amplo no segmento`,
    `Segmento com demanda crescente e engajamento orgânico alto`,
  ]

  const pontosFracos = [
    !hasBio ? 'Bio ausente ou genérica — não comunica valor em 3 segundos' : 'Bio pode ser mais direta no benefício e CTA',
    'Pouca ou nenhuma prova social visível no perfil',
    'Falta de conexão entre conteúdo educativo e campanha comercial',
    'CTA inconsistente — cada post termina de forma diferente sem estratégia',
  ]

  const ajustesRapidos = [
    `Reescrever a bio com: o que a marca faz + para quem + benefício + CTA`,
    `Adicionar destaque de stories fixado com "Como usar", "Resultados" e "Sobre nós"`,
    `Definir um CTA padrão para o mês e usá-lo em todos os posts`,
    `Postar pelo menos 1 conteúdo de prova social (depoimento, resultado, antes e depois) por semana`,
    `Criar um carrossel educativo de alto valor como post fixado no perfil`,
  ]

  const sugestoesBio = [
    {
      versao: 1,
      texto: `${brand} ✦ ${capitalizeFirst(segment)}\n${capitalizeFirst(product)} para ${audience.split(' ').slice(0, 4).join(' ')}\n🔗 Link na bio`,
    },
    {
      versao: 2,
      texto: `${product} que ${hasDifferentials ? differentials.slice(0, 40).toLowerCase() : 'faz diferença no dia a dia'}\n✦ ${brand} — ${segment}\n→ Acesse o link`,
    },
    {
      versao: 3,
      texto: `Para quem leva ${segment.toLowerCase()} a sério.\n${brand} — ${product}\n↓ Saiba mais`,
    },
  ]

  const pilaresEditoriais = [
    {
      pilar: 'Educação',
      descricao: `Conteúdo que ensina algo relacionado a ${segment} sem vender diretamente`,
      exemplosPautas: [
        `Como entender se você precisa de ${product}`,
        `3 sinais de que você está fazendo errado`,
        `O guia completo sobre ${segment.split(' ').slice(0, 2).join(' ')}`,
      ],
    },
    {
      pilar: 'Prova social',
      descricao: `Depoimentos, resultados e feedbacks reais que constroem confiança`,
      exemplosPautas: [
        `Antes e depois: como o cliente resolveu ${pains ? pains.split(',')[0] : 'o problema'}`,
        `Print de mensagem de cliente satisfeito`,
        `Resultado em números`,
      ],
    },
    {
      pilar: 'Bastidores',
      descricao: `Processo, rotina, equipe e produção — o que torna a marca humana`,
      exemplosPautas: [
        `Como o ${product} é feito/desenvolvido`,
        `Um dia no trabalho com ${brand}`,
        `O que vai pra lixo antes de chegar até você`,
      ],
    },
    {
      pilar: 'Autoridade',
      descricao: `Opinião forte, posicionamento e ponto de vista sobre ${segment}`,
      exemplosPautas: [
        `O mito mais comum sobre ${segment.toLowerCase()} que precisa acabar`,
        `Por que ${product} genérico não funciona`,
        `O que separa quem tem resultado de quem não tem`,
      ],
    },
    {
      pilar: 'Conversão',
      descricao: `Conteúdo com intenção comercial clara — produto como solução`,
      exemplosPautas: [
        `${product}: o que ele resolve na prática`,
        `Comparativo: antes e depois de usar ${brand}`,
        `Por que vale investir em ${product} certo`,
      ],
    },
  ]

  const proximosConteudos = [
    { formato: 'Carrossel', tema: `${segment}: os 3 erros mais comuns`, objetivo: 'Educação + Salvamento', prioridade: 'alta' },
    { formato: 'Reels', tema: `O mito que mais prejudica quem cuida de ${segment.toLowerCase()}`, objetivo: 'Alcance + Autoridade', prioridade: 'alta' },
    { formato: 'Stories', tema: 'Bastidor do processo de criação', objetivo: 'Conexão + Humanização', prioridade: 'media' },
    { formato: 'Post único', tema: 'Depoimento real de cliente com resultado', objetivo: 'Prova social + Confiança', prioridade: 'alta' },
    { formato: 'Carrossel', tema: `Por que ${product} genérico não funciona`, objetivo: 'Autoridade + Conversão', prioridade: 'media' },
    { formato: 'Reels', tema: `Como usar ${product} na rotina do dia a dia`, objetivo: 'Tutorial + Conversão', prioridade: 'media' },
    { formato: 'Stories', tema: 'Enquete: qual é a sua maior dúvida?', objetivo: 'Engajamento + Pesquisa', prioridade: 'baixa' },
  ]

  return { diagnosticoGeral, pontosFortes, pontosFracos, ajustesRapidos, sugestoesBio, pilaresEditoriais, proximosConteudos }
}

// ─── UTILS ────────────────────────────────────────────────────────────────────

function capitalizeFirst(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
