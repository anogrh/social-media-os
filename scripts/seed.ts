/**
 * Seed script — cria as tabelas e insere os 5 clientes reais
 * Execute: npx tsx scripts/seed.ts
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://deavcbywgoqqwionszeo.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const clients = [
  {
    name: 'Sinta Gummies',
    segment: 'Bem-estar & Saúde',
    status: 'ativo',
    email: 'contato@sintagummies.com.br',
    phone: '(11) 99234-5678',
    website: 'sintagummies.com.br',
    initials: 'SG',
    color: '#F25BA5',
    instagram_handle: '@sintagummies',
    monthly_value: 2800,
    contract_start: '2024-02-01',
    next_payment_date: '2025-06-05',
    payment_status: 'pendente',
    service_package: 'Gestão Full',
    posts_per_month: 16,
    reels_per_month: 8,
    stories_per_week: 5,
    brand_voice: 'Jovem, acolhedora, cientificamente embasada mas acessível.',
    persona: 'Mulheres de 25-38 anos, urbanas, preocupadas com saúde e bem-estar.',
    positioning: 'Suplementos naturais que combinam eficácia comprovada com prazer em consumir.',
    content_pillars: ['Educação sobre saúde', 'Estilo de vida saudável', 'Depoimentos reais', 'Bastidores da marca'],
    objectives: ['Aumentar seguidores em 20% em 3 meses', 'Taxa de engajamento acima de 4%'],
    internal_notes: 'Cliente VIP. Reunião mensal toda primeira sexta.',
  },
  {
    name: 'LOF Professional',
    segment: 'Arquitetura & Design',
    status: 'ativo',
    email: 'hello@lofprofessional.com.br',
    phone: '(11) 98765-4321',
    website: 'lofprofessional.com.br',
    initials: 'LP',
    color: '#1F1B1A',
    instagram_handle: '@lof_professional',
    monthly_value: 3200,
    contract_start: '2023-11-01',
    next_payment_date: '2025-06-10',
    payment_status: 'pendente',
    service_package: 'Gestão Premium',
    posts_per_month: 20,
    reels_per_month: 10,
    stories_per_week: 7,
    brand_voice: 'Sofisticado, minimalista, técnico mas não frio.',
    persona: 'Profissionais e empresas que buscam arquitetura de alto padrão. Faixa 35-55 anos, A/B.',
    positioning: 'Arquitetura que transforma espaços em experiências únicas.',
    content_pillars: ['Portfólio de projetos', 'Processo criativo', 'Tendências em arquitetura'],
    objectives: ['Posicionar como referência em SP', 'Atrair projetos comerciais de alto valor'],
    internal_notes: 'Arquitetos muito exigentes com estética. Aprovam cada post individualmente.',
  },
  {
    name: 'Madbucks',
    segment: 'Food & Beverage',
    status: 'ativo',
    email: 'social@madbucks.com.br',
    phone: '(11) 97654-3210',
    website: 'madbucks.com.br',
    initials: 'MB',
    color: '#F19877',
    instagram_handle: '@madbucks.com.br',
    monthly_value: 1800,
    contract_start: '2024-05-01',
    next_payment_date: '2025-06-01',
    payment_status: 'atrasado',
    service_package: 'Gestão Essencial',
    posts_per_month: 12,
    reels_per_month: 4,
    stories_per_week: 5,
    brand_voice: 'Urbano, irreverente, apaixonado por café.',
    persona: 'Amantes de café, 22-40 anos, buscam experiências autênticas.',
    positioning: 'O café que tem personalidade de verdade.',
    content_pillars: ['Produtos artesanais', 'Ambiente e atmosfera', 'Origem dos grãos'],
    objectives: ['Aumentar visitas à loja', 'Crescer para 10k seguidores'],
    internal_notes: 'Pagamento atrasado. Entrar em contato.',
  },
  {
    name: 'Marcelo Rezende Arquiteto',
    segment: 'Arquitetura & Design',
    status: 'onboarding',
    email: 'contato@marcelorezende.arq.br',
    phone: '(11) 96543-2109',
    website: 'marcelorezende.arq.br',
    initials: 'MR',
    color: '#C4A882',
    instagram_handle: '@marcelorezende.arquitetura',
    monthly_value: 2400,
    contract_start: '2025-05-15',
    next_payment_date: '2025-06-15',
    payment_status: 'pendente',
    service_package: 'Gestão Full',
    posts_per_month: 16,
    reels_per_month: 6,
    stories_per_week: 5,
    brand_voice: 'Elegante, técnico com sofisticação.',
    persona: 'Proprietários que buscam projetos arquitetônicos exclusivos, faixa 35-60 anos.',
    positioning: 'Arquitetura que conecta funcionalidade, arte e identidade do cliente.',
    content_pillars: ['Projetos e portfólio', 'Processo criativo', 'Antes e depois'],
    objectives: ['Aumentar visibilidade de projetos residenciais', 'Atrair clientes de alto padrão'],
    internal_notes: 'Em onboarding. Reunião de briefing agendada.',
  },
  {
    name: 'Vera Valle',
    segment: 'Lifestyle & Moda',
    status: 'pausado',
    email: 'contato@veravalle.com.br',
    phone: '(11) 95432-1098',
    website: 'veravalle.com.br',
    initials: 'VV',
    color: '#C8B8E8',
    instagram_handle: '@veravalle',
    monthly_value: 1600,
    contract_start: '2024-01-01',
    next_payment_date: '2025-06-20',
    payment_status: 'pendente',
    service_package: 'Gestão Essencial',
    posts_per_month: 12,
    reels_per_month: 4,
    stories_per_week: 3,
    brand_voice: 'Delicado, sofisticado, inspirador.',
    persona: 'Mulheres de 25-45 anos que valorizam estilo pessoal e lifestyle refinado.',
    positioning: 'Onde estilo encontra autenticidade.',
    content_pillars: ['Moda e estilo', 'Beleza e cuidados', 'Lifestyle'],
    objectives: ['Retomar atividade após pausa', 'Crescer comunidade engajada'],
    internal_notes: 'Pausado a pedido da cliente. Retoma em julho.',
  },
]

async function seed() {
  console.log('🌱 Inserindo clientes...')
  const { data, error } = await supabase.from('clients').insert(clients).select()
  if (error) {
    console.error('❌ Erro:', error.message)
  } else {
    console.log(`✅ ${data.length} clientes inseridos com sucesso!`)
    data.forEach(c => console.log(`   • ${c.name}`))
  }
}

seed()
