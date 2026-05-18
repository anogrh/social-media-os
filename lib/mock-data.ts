import type {
  Client,
  Payment,
  Contract,
  Document,
  Task,
  ContentCalendarItem,
  Alert,
  RevenueMonth,
  InstagramAccount,
  InstagramDailyMetric,
  Prompt,
  Reference,
} from './types'

// ─── Clients ───────────────────────────────────────────────────────────────

export const clients: Client[] = [
  {
    id: 'c1',
    name: 'Sinta Gummies',
    segment: 'Bem-estar & Saúde',
    status: 'ativo',
    email: 'contato@sintagummies.com.br',
    phone: '(11) 99234-5678',
    website: 'sintagummies.com.br',
    initials: 'SG',
    color: '#FC75A0',
    instagramHandle: '@sintagummies',
    instagramAccountId: 'ig1',
    monthlyValue: 2800,
    contractStart: '2024-02-01',
    nextPaymentDate: '2025-06-05',
    paymentStatus: 'pendente',
    servicePackage: 'Gestão Full',
    postsPerMonth: 16,
    reelsPerMonth: 8,
    storiesPerWeek: 5,
    brandVoice: 'Jovem, acolhedora, cientificamente embasada mas acessível. Inspira bem-estar sem ser pregativa.',
    persona: 'Mulheres de 25-38 anos, urbanas, preocupadas com saúde e bem-estar, dispostas a investir em qualidade de vida.',
    positioning: 'Suplementos naturais que combinam eficácia comprovada com prazer em consumir.',
    contentPillars: ['Educação sobre saúde', 'Estilo de vida saudável', 'Depoimentos reais', 'Bastidores da marca'],
    objectives: ['Aumentar seguidores em 20% em 3 meses', 'Taxa de engajamento acima de 4%', 'Gerar 50 leads/mês'],
    notes: 'Cliente VIP. Reunião mensal toda primeira sexta. Sempre pede stories com enquete.',
    createdAt: '2024-01-15',
  },
  {
    id: 'c2',
    name: 'LOF Professional',
    segment: 'Arquitetura & Design',
    status: 'ativo',
    email: 'hello@lofprofessional.com.br',
    phone: '(11) 98765-4321',
    website: 'lofprofessional.com.br',
    initials: 'LP',
    color: '#1F1B1A',
    instagramHandle: '@lof_professional',
    instagramAccountId: 'ig2',
    monthlyValue: 3200,
    contractStart: '2023-11-01',
    nextPaymentDate: '2025-06-10',
    paymentStatus: 'pendente',
    servicePackage: 'Gestão Premium',
    postsPerMonth: 20,
    reelsPerMonth: 10,
    storiesPerWeek: 7,
    brandVoice: 'Sofisticado, minimalista, técnico mas não frio. Referência em design contemporâneo brasileiro.',
    persona: 'Profissionais e empresas que buscam arquitetura de alto padrão. Faixa 35-55 anos, A/B.',
    positioning: 'Arquitetura que transforma espaços em experiências únicas.',
    contentPillars: ['Portfólio de projetos', 'Processo criativo', 'Tendências em arquitetura', 'Detalhes construtivos'],
    objectives: ['Posicionar como referência em SP', 'Atrair projetos comerciais de alto valor'],
    notes: 'Arquitetos muito exigentes com estética. Aprovam cada post individualmente.',
    createdAt: '2023-10-20',
  },
  {
    id: 'c3',
    name: 'Madbucks',
    segment: 'Food & Beverage',
    status: 'ativo',
    email: 'social@madbucks.com.br',
    phone: '(11) 97654-3210',
    website: 'madbucks.com.br',
    initials: 'MB',
    color: '#F19877',
    instagramHandle: '@madbucks.com.br',
    instagramAccountId: 'ig3',
    monthlyValue: 1800,
    contractStart: '2024-05-01',
    nextPaymentDate: '2025-06-01',
    paymentStatus: 'atrasado',
    servicePackage: 'Gestão Essencial',
    postsPerMonth: 12,
    reelsPerMonth: 4,
    storiesPerWeek: 5,
    brandVoice: 'Urbano, irreverente, apaixonado por café. Fala direto, com atitude e bom humor.',
    persona: 'Amantes de café e gastronomia, 22-40 anos, buscam experiências autênticas e atitude.',
    positioning: 'O café que tem personalidade de verdade.',
    contentPillars: ['Produtos artesanais', 'Ambiente e atmosfera', 'Origem dos grãos', 'Dicas de preparo'],
    objectives: ['Aumentar visitas à loja', 'Crescer para 10k seguidores'],
    notes: 'Pagamento atrasado 12 dias. Entrar em contato. Ótimo conteúdo fotográfico.',
    createdAt: '2024-04-10',
  },
  {
    id: 'c4',
    name: 'Marcelo Rezende Arquiteto',
    segment: 'Arquitetura & Design',
    status: 'onboarding',
    email: 'contato@marcelorezende.arq.br',
    phone: '(11) 96543-2109',
    website: 'marcelorezende.arq.br',
    initials: 'MR',
    color: '#C4A882',
    instagramHandle: '@marcelorezende.arquitetura',
    instagramAccountId: 'ig4',
    monthlyValue: 2400,
    contractStart: '2025-05-15',
    nextPaymentDate: '2025-06-15',
    paymentStatus: 'pendente',
    servicePackage: 'Gestão Full',
    postsPerMonth: 16,
    reelsPerMonth: 6,
    storiesPerWeek: 5,
    brandVoice: 'Elegante, técnico com sofisticação. Mostra o processo criativo com narrativa envolvente.',
    persona: 'Proprietários e empresas que buscam projetos arquitetônicos exclusivos, faixa 35-60 anos, A/B.',
    positioning: 'Arquitetura que conecta funcionalidade, arte e identidade do cliente.',
    contentPillars: ['Projetos e portfólio', 'Processo criativo', 'Materiais e referências', 'Antes e depois'],
    objectives: ['Aumentar visibilidade de projetos residenciais', 'Atrair clientes de alto padrão'],
    notes: 'Em processo de onboarding. Reunião de briefing agendada para a próxima semana.',
    createdAt: '2025-05-10',
  },
  {
    id: 'c5',
    name: 'Vera Valle',
    segment: 'Lifestyle & Moda',
    status: 'pausado',
    email: 'contato@veravalle.com.br',
    phone: '(11) 95432-1098',
    website: 'veravalle.com.br',
    initials: 'VV',
    color: '#C8B8E8',
    instagramHandle: '@veravalle',
    instagramAccountId: 'ig5',
    monthlyValue: 1600,
    contractStart: '2024-01-01',
    nextPaymentDate: '2025-06-20',
    paymentStatus: 'pendente',
    servicePackage: 'Gestão Essencial',
    postsPerMonth: 12,
    reelsPerMonth: 4,
    storiesPerWeek: 3,
    brandVoice: 'Delicado, sofisticado, inspirador. Celebra a feminilidade com autenticidade e elegância.',
    persona: 'Mulheres de 25-45 anos, que valorizam estilo pessoal, beleza consciente e lifestyle refinado.',
    positioning: 'Onde estilo encontra autenticidade.',
    contentPillars: ['Moda e estilo', 'Beleza e cuidados', 'Lifestyle', 'Inspiração e referências'],
    objectives: ['Retomar atividade após pausa', 'Crescer comunidade engajada'],
    notes: 'Pausado a pedido da cliente por 2 meses (maio-junho). Retoma em julho.',
    createdAt: '2023-12-15',
  },
]

// ─── Instagram Accounts ────────────────────────────────────────────────────

export const instagramAccounts: InstagramAccount[] = [
  {
    id: 'ig1', clientId: 'c1', handle: '@sintagummies', connected: true,
    followers: 18400, following: 1230, posts: 312, reach30d: 84200,
    impressions30d: 142000, engagementRate: 4.8, profileVisits30d: 3200,
    reelsViews30d: 52000, storiesViews30d: 9800, savedPosts30d: 1420, newFollowers30d: 380,
  },
  {
    id: 'ig2', clientId: 'c2', handle: '@lof_professional', connected: true,
    followers: 24700, following: 860, posts: 548, reach30d: 65400,
    impressions30d: 98000, engagementRate: 3.2, profileVisits30d: 4100,
    reelsViews30d: 38000, storiesViews30d: 7200, savedPosts30d: 2300, newFollowers30d: 210,
  },
  {
    id: 'ig3', clientId: 'c3', handle: '@madbucks.com.br', connected: true,
    followers: 8900, following: 540, posts: 186, reach30d: 22100,
    impressions30d: 38000, engagementRate: 3.9, profileVisits30d: 1800,
    reelsViews30d: 14000, storiesViews30d: 4200, savedPosts30d: 620, newFollowers30d: -45,
  },
  {
    id: 'ig4', clientId: 'c4', handle: '@marcelorezende.arquitetura', connected: false,
    followers: 5200, following: 320, posts: 94, reach30d: 0,
    impressions30d: 0, engagementRate: 0, profileVisits30d: 0,
    reelsViews30d: 0, storiesViews30d: 0, savedPosts30d: 0, newFollowers30d: 0,
  },
  {
    id: 'ig5', clientId: 'c5', handle: '@veravalle', connected: true,
    followers: 15200, following: 820, posts: 241, reach30d: 22400,
    impressions30d: 38000, engagementRate: 3.4, profileVisits30d: 1480,
    reelsViews30d: 12200, storiesViews30d: 3100, savedPosts30d: 580, newFollowers30d: -80,
  },
]

// ─── Instagram Daily Metrics (last 30 days for c1) ────────────────────────

export function generateDailyMetrics(baseFollowers: number, days: number = 30): InstagramDailyMetric[] {
  const metrics: InstagramDailyMetric[] = []
  let followers = baseFollowers - Math.floor(Math.random() * 500) - 200
  const today = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const newF = Math.floor(Math.random() * 30) - 5
    followers += newF
    metrics.push({
      date: date.toISOString().split('T')[0],
      followers,
      reach: Math.floor(Math.random() * 3000) + 1500,
      impressions: Math.floor(Math.random() * 5000) + 3000,
      engagement: Math.floor(Math.random() * 200) + 50,
      newFollowers: newF < 0 ? 0 : newF,
    })
  }
  return metrics
}

// ─── Payments ──────────────────────────────────────────────────────────────

export const payments: Payment[] = [
  { id: 'p1', clientId: 'c1', clientName: 'Sinta Gummies', value: 2800, dueDate: '2025-06-05', status: 'pendente', reference: 'Jun/2025', method: 'PIX' },
  { id: 'p2', clientId: 'c1', clientName: 'Sinta Gummies', value: 2800, dueDate: '2025-05-05', paidDate: '2025-05-04', status: 'pago', reference: 'Mai/2025', method: 'PIX' },
  { id: 'p3', clientId: 'c1', clientName: 'Sinta Gummies', value: 2800, dueDate: '2025-04-05', paidDate: '2025-04-07', status: 'pago', reference: 'Abr/2025', method: 'PIX' },
  { id: 'p4', clientId: 'c2', clientName: 'LOF Professional', value: 3200, dueDate: '2025-06-10', status: 'pendente', reference: 'Jun/2025', method: 'Transferência' },
  { id: 'p5', clientId: 'c2', clientName: 'LOF Professional', value: 3200, dueDate: '2025-05-10', paidDate: '2025-05-09', status: 'pago', reference: 'Mai/2025', method: 'Transferência' },
  { id: 'p6', clientId: 'c3', clientName: 'Madbucks', value: 1800, dueDate: '2025-06-01', status: 'atrasado', reference: 'Jun/2025', method: 'PIX', notes: '12 dias em atraso. Ligar.' },
  { id: 'p7', clientId: 'c3', clientName: 'Madbucks', value: 1800, dueDate: '2025-05-01', paidDate: '2025-05-06', status: 'pago', reference: 'Mai/2025', method: 'PIX' },
  { id: 'p8', clientId: 'c4', clientName: 'Marcelo Rezende Arquiteto', value: 2400, dueDate: '2025-06-15', status: 'pendente', reference: 'Jun/2025', method: 'PIX' },
  { id: 'p9', clientId: 'c5', clientName: 'Vera Valle', value: 1600, dueDate: '2025-06-20', status: 'pendente', reference: 'Jun/2025', method: 'PIX' },
  { id: 'p12', clientId: 'c2', clientName: 'LOF Professional', value: 3200, dueDate: '2025-04-10', paidDate: '2025-04-12', status: 'pago', reference: 'Abr/2025', method: 'Transferência' },
]

// ─── Revenue by Month ──────────────────────────────────────────────────────

export const revenueByMonth: RevenueMonth[] = [
  { month: 'Jan', previsto: 12000, recebido: 11200, pendente: 800 },
  { month: 'Fev', previsto: 12000, recebido: 12000, pendente: 0 },
  { month: 'Mar', previsto: 12400, recebido: 10800, pendente: 1600 },
  { month: 'Abr', previsto: 12400, recebido: 12400, pendente: 0 },
  { month: 'Mai', previsto: 14000, recebido: 13400, pendente: 600 },
  { month: 'Jun', previsto: 14000, recebido: 0, pendente: 14000 },
]

// ─── Contracts ─────────────────────────────────────────────────────────────

export const contracts: Contract[] = [
  { id: 'ct1', clientId: 'c1', clientName: 'Sinta Gummies', type: 'Prestação de Serviços', signedDate: '2024-02-01', startDate: '2024-02-01', value: 2800, status: 'ativo', fileName: 'contrato_sinta_gummies_2024.pdf', fileSize: '1.2 MB' },
  { id: 'ct2', clientId: 'c2', clientName: 'LOF Professional', type: 'Prestação de Serviços', signedDate: '2023-11-01', startDate: '2023-11-01', value: 3200, status: 'ativo', fileName: 'contrato_lof_professional_2023.pdf', fileSize: '1.4 MB' },
  { id: 'ct3', clientId: 'c3', clientName: 'Madbucks', type: 'Prestação de Serviços', signedDate: '2024-05-01', startDate: '2024-05-01', value: 1800, status: 'ativo', fileName: 'contrato_madbucks_2024.pdf', fileSize: '980 KB' },
  { id: 'ct4', clientId: 'c4', clientName: 'Marcelo Rezende Arquiteto', type: 'Prestação de Serviços', startDate: '2025-05-15', value: 2400, status: 'pendente_assinatura', fileName: 'contrato_marcelorezende_2025.pdf', fileSize: '1.1 MB' },
  { id: 'ct5', clientId: 'c5', clientName: 'Vera Valle', type: 'Prestação de Serviços', signedDate: '2024-01-01', startDate: '2024-01-01', value: 1600, status: 'ativo', fileName: 'contrato_veravalle_2024.pdf', fileSize: '870 KB' },
]

// ─── Documents ─────────────────────────────────────────────────────────────

export const documents: Document[] = [
  { id: 'd1', clientId: 'c1', clientName: 'Sinta Gummies', type: 'contrato', name: 'Contrato de gestão 2024', fileName: 'contrato_sinta_2024.pdf', fileSize: '1.2 MB', uploadedAt: '2024-02-01', uploadedBy: 'Rhania N.' },
  { id: 'd2', clientId: 'c1', clientName: 'Sinta Gummies', type: 'briefing', name: 'Briefing inicial Sinta Gummies', fileName: 'briefing_sinta.pdf', fileSize: '3.4 MB', uploadedAt: '2024-02-01', uploadedBy: 'Rhania N.' },
  { id: 'd3', clientId: 'c2', clientName: 'LOF Professional', type: 'identidade_visual', name: 'Manual de identidade visual LOF', fileName: 'lof_manual_brand.pdf', fileSize: '8.2 MB', uploadedAt: '2023-11-01', uploadedBy: 'Rhania N.' },
  { id: 'd4', clientId: 'c3', clientName: 'Madbucks', type: 'comprovante', name: 'Comprovante Mai/2025', fileName: 'comp_madbucks_mai25.pdf', fileSize: '120 KB', uploadedAt: '2025-05-06', uploadedBy: 'Rhania N.' },
  { id: 'd6', clientId: 'c2', clientName: 'LOF Professional', type: 'relatorio', name: 'Relatório Abr/2025', fileName: 'relatorio_lof_abr25.pdf', fileSize: '4.5 MB', uploadedAt: '2025-05-02', uploadedBy: 'Rhania N.' },
]

// ─── Tasks ─────────────────────────────────────────────────────────────────

export const tasks: Task[] = [
  { id: 't1', title: 'Criar grid de maio para Sinta Gummies', clientId: 'c1', clientName: 'Sinta Gummies', clientColor: '#FC75A0', status: 'concluido', priority: 'alta', assignee: 'Mariana S.', dueDate: '2025-05-28', createdAt: '2025-05-15', tags: ['grid', 'instagram'] },
  { id: 't3', title: 'Relatório mensal LOF Professional — maio', clientId: 'c2', clientName: 'LOF Professional', clientColor: '#1F1B1A', status: 'em_andamento', priority: 'alta', assignee: 'Rhania N.', dueDate: '2025-06-03', createdAt: '2025-05-28', tags: ['relatorio'] },
  { id: 't4', title: 'Briefing e estratégia Marcelo Rezende', clientId: 'c4', clientName: 'Marcelo Rezende Arquiteto', clientColor: '#C4A882', status: 'em_revisao', priority: 'urgente', assignee: 'Rhania N.', dueDate: '2025-06-01', createdAt: '2025-05-25', tags: ['estrategia', 'onboarding'] },
  { id: 't5', title: 'Cobrar pagamento Madbucks', clientId: 'c3', clientName: 'Madbucks', clientColor: '#F19877', status: 'pendente', priority: 'urgente', assignee: 'Rhania N.', dueDate: '2025-06-02', createdAt: '2025-06-01', tags: ['financeiro'] },
  { id: 't6', title: 'Grid junho LOF Professional — aprovação', clientId: 'c2', clientName: 'LOF Professional', clientColor: '#1F1B1A', status: 'em_revisao', priority: 'alta', assignee: 'Mariana S.', dueDate: '2025-06-05', createdAt: '2025-05-30', tags: ['grid', 'aprovacao'] },
  { id: 't7', title: 'Criar stories interativos Sinta Gummies', clientId: 'c1', clientName: 'Sinta Gummies', clientColor: '#FC75A0', status: 'pendente', priority: 'media', assignee: 'Mariana S.', dueDate: '2025-06-12', createdAt: '2025-06-01', tags: ['stories'] },
  { id: 't9', title: 'Renovar contrato Vera Valle — julho', clientId: 'c5', clientName: 'Vera Valle', clientColor: '#C8B8E8', status: 'pendente', priority: 'media', assignee: 'Rhania N.', dueDate: '2025-06-20', createdAt: '2025-06-01', tags: ['contrato'] },
  { id: 't10', title: 'Campanha Dia dos Namorados Madbucks', clientId: 'c3', clientName: 'Madbucks', clientColor: '#F19877', status: 'concluido', priority: 'alta', assignee: 'Mariana S.', dueDate: '2025-06-10', createdAt: '2025-05-25', tags: ['campanha'] },
]

// ─── Content Calendar ──────────────────────────────────────────────────────

export const calendarItems: ContentCalendarItem[] = [
  { id: 'cal1', clientId: 'c1', clientName: 'Sinta Gummies', clientColor: '#FC75A0', date: '2025-06-02', format: 'reels', caption: 'Os 5 benefícios do magnésio que você precisa saber', status: 'publicado', assignee: 'Mariana S.', scheduledTime: '18:00', tags: ['saude', 'educacao'] },
  { id: 'cal2', clientId: 'c2', clientName: 'LOF Professional', clientColor: '#1F1B1A', date: '2025-06-02', format: 'carrossel', caption: 'Projeto residencial SP — processo completo', status: 'publicado', assignee: 'Mariana S.', scheduledTime: '12:00' },
  { id: 'cal4', clientId: 'c1', clientName: 'Sinta Gummies', clientColor: '#FC75A0', date: '2025-06-04', format: 'story', caption: 'Enquete: qual é o seu horário favorito para suplementar?', status: 'publicado', scheduledTime: '09:00' },
  { id: 'cal5', clientId: 'c3', clientName: 'Madbucks', clientColor: '#F19877', date: '2025-06-05', format: 'feed', caption: 'O blend artesanal que seu fim de semana merece', status: 'publicado', assignee: 'Mariana S.', scheduledTime: '10:00' },
  { id: 'cal6', clientId: 'c2', clientName: 'LOF Professional', clientColor: '#1F1B1A', date: '2025-06-06', format: 'reels', caption: 'Tour completo pelo escritório que projetamos para startup', status: 'aprovado', scheduledTime: '18:00' },
  { id: 'cal8', clientId: 'c1', clientName: 'Sinta Gummies', clientColor: '#FC75A0', date: '2025-06-09', format: 'carrossel', caption: 'Colágeno + vitamina C: a combinação que você não esperava', status: 'producao', assignee: 'Mariana S.' },
  { id: 'cal9', clientId: 'c3', clientName: 'Madbucks', clientColor: '#F19877', date: '2025-06-10', format: 'reels', caption: 'Dia dos Namorados no Madbucks — experiência completa', status: 'revisao', assignee: 'Mariana S.' },
  { id: 'cal10', clientId: 'c2', clientName: 'LOF Professional', clientColor: '#1F1B1A', date: '2025-06-11', format: 'feed', caption: 'Detalhes que fazem a diferença: metais escovados', status: 'rascunho', assignee: 'Mariana S.' },
  { id: 'cal12', clientId: 'c1', clientName: 'Sinta Gummies', clientColor: '#FC75A0', date: '2025-06-13', format: 'story', caption: 'Dica rápida: como armazenar seus suplementos', status: 'rascunho' },
  { id: 'cal13', clientId: 'c4', clientName: 'Marcelo Rezende Arquiteto', clientColor: '#C4A882', date: '2025-06-16', format: 'carrossel', caption: 'O processo criativo por trás do projeto residencial', status: 'ideia' },
  { id: 'cal15', clientId: 'c2', clientName: 'LOF Professional', clientColor: '#1F1B1A', date: '2025-06-18', format: 'carrossel', caption: 'Paleta de materiais nobres para interiores 2025', status: 'ideia' },
]

// ─── Alerts ────────────────────────────────────────────────────────────────

export const alerts: Alert[] = [
  {
    id: 'a1', type: 'payment_overdue', severity: 'error',
    title: 'Pagamento em atraso',
    message: 'Madbucks está com 12 dias de atraso no pagamento de junho (R$ 1.800).',
    clientId: 'c3', clientName: 'Madbucks',
    actionLabel: 'Ver financeiro', actionHref: '/financeiro',
    createdAt: '2025-06-13', read: false,
  },
  {
    id: 'a2', type: 'performance_drop', severity: 'warning',
    title: 'Queda de performance',
    message: 'Madbucks perdeu 45 seguidores em maio. Alcance caiu 18% vs. mês anterior.',
    clientId: 'c3', clientName: 'Madbucks',
    actionLabel: 'Ver analytics', actionHref: '/instagram',
    createdAt: '2025-06-01', read: false,
  },
  {
    id: 'a3', type: 'performance_drop', severity: 'warning',
    title: 'Queda de engajamento',
    message: 'Vera Valle com engajamento 3.4% (média esperada: 4%). Pausa pode estar afetando a conta.',
    clientId: 'c5', clientName: 'Vera Valle',
    actionLabel: 'Ver analytics', actionHref: '/instagram',
    createdAt: '2025-06-01', read: false,
  },
  {
    id: 'a4', type: 'contract_expiring', severity: 'info',
    title: 'Contrato pendente de assinatura',
    message: 'Contrato do Marcelo Rezende Arquiteto ainda não foi assinado. Cliente em onboarding há 2 dias.',
    clientId: 'c4', clientName: 'Marcelo Rezende Arquiteto',
    actionLabel: 'Ver contrato', actionHref: '/contratos',
    createdAt: '2025-05-17', read: false,
  },
  {
    id: 'a5', type: 'task_overdue', severity: 'error',
    title: 'Tarefa atrasada',
    message: 'Briefing e estratégia do Marcelo Rezende Arquiteto venceu ontem.',
    clientId: 'c4', clientName: 'Marcelo Rezende Arquiteto',
    actionLabel: 'Ver tarefas', actionHref: '/tarefas',
    createdAt: '2025-06-02', read: false,
  },
]

// ─── Prompts ───────────────────────────────────────────────────────────────

export const prompts: Prompt[] = [
  { id: 'pr1', name: 'Legenda engajamento alto', category: 'Copy Instagram', content: 'Escreva uma legenda para Instagram no estilo [marca], sobre [tema]. Comece com uma pergunta provocativa. Use no máximo 3 emojis estratégicos. Inclua 1 CTA claro no final. Tom: [tom de voz]. Público: [persona].', tags: ['instagram', 'legenda', 'engajamento'], createdAt: '2025-01-10' },
  { id: 'pr2', name: 'Roteiro reels 30s', category: 'Roteiros', content: 'Crie um roteiro de Reels de 30 segundos sobre [tema] para [marca]. Estrutura: 0-3s hook visual + frase de abertura | 4-20s desenvolvimento em 3 tópicos rápidos | 21-28s revelação/virada | 29-30s CTA + logo. Tom: [tom].', tags: ['reels', 'roteiro', 'video'], createdAt: '2025-01-15' },
  { id: 'pr3', name: 'Análise de performance mensal', category: 'Relatórios', content: 'Analise os seguintes dados de Instagram do cliente [nome]: [dados]. Gere um resumo executivo com: 1) Destaques positivos, 2) Pontos de atenção, 3) Comparativo com mês anterior, 4) 3 recomendações estratégicas para o próximo mês.', tags: ['relatorio', 'analise', 'performance'], createdAt: '2025-02-01' },
  { id: 'pr4', name: 'Estratégia de conteúdo mensal', category: 'Estratégia', content: 'Crie um planejamento de conteúdo para [marca] no mês de [mês]. Considere: Persona: [persona] | Tom: [tom] | Objetivo: [objetivo] | Formatos: feed, reels, stories | Posts: [n] por semana. Organize por semana e inclua temas, formatos e chamadas de ação.', tags: ['estrategia', 'planejamento'], createdAt: '2025-02-10' },
  { id: 'pr5', name: 'Bio Instagram otimizada', category: 'Copy Instagram', content: 'Reescreva a bio do Instagram de [marca] com: 1ª linha: quem você é/o que faz | 2ª linha: resultado/benefício para o cliente | 3ª linha: prova social ou diferencial | 4ª linha: CTA + link. Máximo 150 caracteres no total. Tom: [tom].', tags: ['bio', 'instagram', 'otimizacao'], createdAt: '2025-03-01' },
  { id: 'pr6', name: 'Resposta a comentário negativo', category: 'Comunidade', content: 'Escreva uma resposta empática e profissional ao seguinte comentário negativo: "[comentário]". A resposta deve: reconhecer a insatisfação, se desculpar sem admitir culpa desnecessariamente, oferecer solução, e convidar para contato privado. Tom da marca [marca]: [tom].', tags: ['comunidade', 'crise', 'resposta'], createdAt: '2025-03-15' },
]

// ─── References ────────────────────────────────────────────────────────────

export const references: Reference[] = [
  { id: 'ref1', title: 'Tendências de design para Instagram 2025', url: 'https://hootsuite.com/trends', category: 'Tendências', type: 'trend', description: 'Relatório completo da Hootsuite com as principais tendências visuais e de conteúdo.', tags: ['tendencias', '2025', 'design'], addedAt: '2025-01-20' },
  { id: 'ref2', title: 'Guia de storytelling para marcas', url: 'https://contentmarketinginstitute.com', category: 'Copy', type: 'copy', description: 'Framework completo de storytelling aplicado a marcas no Instagram.', tags: ['storytelling', 'copy', 'marca'], addedAt: '2025-02-05' },
  { id: 'ref3', title: 'Referência visual — wellness brands', url: 'https://pinterest.com/wellness', category: 'Design', type: 'design', description: 'Coleção de referências visuais para marcas de bem-estar e saúde.', tags: ['wellness', 'visual', 'referencia'], addedAt: '2025-02-14' },
  { id: 'ref4', title: 'Case: crescimento orgânico 0 a 100k', url: 'https://socialmediatoday.com', category: 'Estratégia', type: 'campanha', description: 'Estudo de caso detalhado de crescimento orgânico no Instagram.', tags: ['crescimento', 'organico', 'case'], addedAt: '2025-03-01' },
  { id: 'ref5', title: 'Edição de reels no CapCut — tutoriais', url: 'https://capcut.com/tutorials', category: 'Produção', type: 'video', description: 'Tutoriais avançados de edição de reels com efeitos e transições.', tags: ['reels', 'edicao', 'capcut'], addedAt: '2025-03-18' },
  { id: 'ref6', title: 'Paleta de cores para marcas de saúde', url: 'https://coolors.co', category: 'Design', type: 'design', description: 'Paletas de cores testadas e aprovadas para o setor de saúde.', tags: ['cores', 'saude', 'design'], addedAt: '2025-04-02' },
]

// ─── Helper functions ──────────────────────────────────────────────────────

export function getClientById(id: string): Client | undefined {
  return clients.find(c => c.id === id)
}

export function getInstagramByClientId(clientId: string): InstagramAccount | undefined {
  return instagramAccounts.find(ig => ig.clientId === clientId)
}

export function getPaymentsByClientId(clientId: string): Payment[] {
  return payments.filter(p => p.clientId === clientId)
}

export function getTasksByClientId(clientId: string): Task[] {
  return tasks.filter(t => t.clientId === clientId)
}

export function getCalendarByClientId(clientId: string): ContentCalendarItem[] {
  return calendarItems.filter(c => c.clientId === clientId)
}

export function getActiveClients(): Client[] {
  return clients.filter(c => c.status === 'ativo')
}

export function getTotalMonthlyRevenue(): number {
  return clients.filter(c => c.status !== 'encerrado').reduce((acc, c) => acc + c.monthlyValue, 0)
}

export function getPendingRevenue(): number {
  return payments.filter(p => p.status === 'pendente' || p.status === 'atrasado').reduce((acc, p) => acc + p.value, 0)
}

export function getReceivedRevenue(): number {
  return payments.filter(p => p.status === 'pago').reduce((acc, p) => acc + p.value, 0)
}
