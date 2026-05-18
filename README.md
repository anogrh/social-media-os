# Social Media OS — Ilumine Creative

Plataforma de gestão de social media para agências criativas. Dashboard completo com gestão de clientes, analytics, calendário editorial, financeiro, contratos, tarefas e biblioteca de conteúdo.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Recharts** — gráficos e analytics
- **Lucide React** — ícones
- **date-fns** — formatação de datas
- **Supabase** — banco de dados e autenticação (estrutura configurada, sem conexão real no MVP)
- **clsx + tailwind-merge** — composição de classes

## Identidade visual

A plataforma usa a identidade Rhania:

| Token | Valor | Uso |
|-------|-------|-----|
| Ivory | `#FFFCEC` | Fundo da página |
| Ink | `#1F1B1A` | Texto principal |
| Pink | `#F25BA5` | Acento primário / signature |
| Red | `#EE3528` | CTAs / alertas |
| Peach | `#F19877` | Secundário / coral |
| Blush | `#FBD0DA` | Blocos suaves |
| Butter | `#F2F4A4` | Destaques / chips |
| Ivory-2 | `#FAF6E0` | Seções recuadas |

Tipografia: **Playfair Display** (editorial/display) + **Inter** (UI/body) + **JetBrains Mono** (mono)

## Como rodar

### 1. Clone e instale

```bash
git clone <repo>
cd social-media-os
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 3. Rode em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 4. Build de produção

```bash
npm run build
npm start
```

## Estrutura do projeto

```
social-media-os/
├── app/
│   ├── (auth)/login/        # Página de login
│   ├── (dashboard)/         # Layout + todas as páginas do dashboard
│   │   ├── page.tsx         # Dashboard principal
│   │   ├── clientes/        # Gestão de clientes
│   │   ├── instagram/       # Analytics Instagram
│   │   ├── calendario/      # Calendário editorial
│   │   ├── tarefas/         # Kanban de tarefas
│   │   ├── financeiro/      # Controle financeiro
│   │   ├── contratos/       # Documentos e contratos
│   │   ├── estrategia/      # Planejamento estratégico
│   │   ├── relatorios/      # Relatórios
│   │   ├── biblioteca/      # Referências
│   │   └── prompts/         # Biblioteca de prompts IA
│   ├── globals.css          # Design tokens + Google Fonts
│   └── layout.tsx           # Root layout
├── components/
│   ├── layout/              # Sidebar, Header
│   ├── ui/                  # MetricCard, StatusBadge, AlertItem
│   └── dashboard/           # DailySummary, ClientsOverview
├── lib/
│   ├── types.ts             # Todos os tipos TypeScript
│   ├── utils.ts             # Utilitários (cn, formatCurrency, etc.)
│   └── mock-data.ts         # Dados mock para MVP
└── supabase/
    └── schema.sql           # Schema completo do banco
```

## Clientes de exemplo (mock data)

| Cliente | Segmento | Status | Mensalidade |
|---------|----------|--------|-------------|
| Sinta Gummies | Bem-estar | Ativo | R$ 2.800 |
| LOF Studio | Arquitetura | Ativo | R$ 3.200 |
| Café Maison | Food & Bev. | Ativo | R$ 1.800 |
| Clínica Dra. Ana Lima | Saúde | Onboarding | R$ 2.400 |
| Estúdio Bloom | Fotografia | Pausado | R$ 1.600 |
| Terra Viva | Sustentabilidade | Ativo | R$ 2.200 |

## Variáveis de ambiente necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
OPENAI_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Próximos passos (pós-MVP)

- Integração real com Instagram Basic Display API
- Conexão com Supabase para persistência
- Autenticação com NextAuth
- Geração de relatórios em PDF
- Geração de resumos com OpenAI
- Notificações por e-mail (pagamentos atrasados, etc.)
