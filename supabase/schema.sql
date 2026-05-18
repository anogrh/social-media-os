-- ============================================================
-- Social Media OS — Database Schema
-- Ilumine Creative
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users ───────────────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'gestor' CHECK (role IN ('admin', 'gestor', 'criativo', 'financeiro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Clients ─────────────────────────────────────────────────
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  segment TEXT,
  status TEXT NOT NULL DEFAULT 'onboarding' CHECK (status IN ('ativo', 'pausado', 'encerrado', 'onboarding')),
  email TEXT,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  initials TEXT,
  color TEXT DEFAULT '#F25BA5',
  instagram_handle TEXT,
  monthly_value NUMERIC(10,2) DEFAULT 0,
  contract_start DATE,
  contract_end DATE,
  next_payment_date DATE,
  payment_status TEXT DEFAULT 'pendente' CHECK (payment_status IN ('pago', 'pendente', 'atrasado', 'cancelado')),
  service_package TEXT,
  posts_per_month INTEGER DEFAULT 0,
  reels_per_month INTEGER DEFAULT 0,
  stories_per_week INTEGER DEFAULT 0,
  brand_voice TEXT,
  persona TEXT,
  positioning TEXT,
  content_pillars JSONB DEFAULT '[]',
  objectives JSONB DEFAULT '[]',
  internal_notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Instagram Accounts ──────────────────────────────────────
CREATE TABLE instagram_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  handle TEXT NOT NULL,
  instagram_user_id TEXT UNIQUE,
  access_token TEXT,
  token_expires_at TIMESTAMPTZ,
  connected BOOLEAN DEFAULT FALSE,
  profile_picture_url TEXT,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Instagram Daily Metrics ─────────────────────────────────
CREATE TABLE instagram_daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES instagram_accounts(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  date DATE NOT NULL,
  followers INTEGER,
  reach INTEGER,
  impressions INTEGER,
  profile_visits INTEGER,
  website_clicks INTEGER,
  email_contacts INTEGER,
  new_followers INTEGER,
  unfollows INTEGER,
  engagement INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, date)
);

-- ─── Instagram Posts ─────────────────────────────────────────
CREATE TABLE instagram_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES instagram_accounts(id),
  client_id UUID REFERENCES clients(id),
  instagram_media_id TEXT UNIQUE,
  media_type TEXT CHECK (media_type IN ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM', 'REELS', 'STORIES')),
  caption TEXT,
  permalink TEXT,
  thumbnail_url TEXT,
  media_url TEXT,
  published_at TIMESTAMPTZ,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  video_views INTEGER DEFAULT 0,
  engagement_rate NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Instagram Stories ───────────────────────────────────────
CREATE TABLE instagram_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES instagram_accounts(id),
  client_id UUID REFERENCES clients(id),
  instagram_media_id TEXT UNIQUE,
  media_type TEXT,
  media_url TEXT,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  taps_forward INTEGER DEFAULT 0,
  taps_back INTEGER DEFAULT 0,
  exits INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Content Calendar ────────────────────────────────────────
CREATE TABLE content_calendar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  format TEXT NOT NULL CHECK (format IN ('reels', 'carrossel', 'story', 'feed', 'blog', 'tiktok')),
  caption TEXT,
  status TEXT DEFAULT 'ideia' CHECK (status IN ('ideia', 'rascunho', 'producao', 'revisao', 'aprovado', 'agendado', 'publicado')),
  assignee_id UUID REFERENCES users(id),
  tags JSONB DEFAULT '[]',
  drive_link TEXT,
  instagram_post_id UUID REFERENCES instagram_posts(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Content Ideas ───────────────────────────────────────────
CREATE TABLE content_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  title TEXT NOT NULL,
  description TEXT,
  format TEXT CHECK (format IN ('reels', 'carrossel', 'story', 'feed', 'blog', 'tiktok')),
  status TEXT DEFAULT 'ideia',
  tags JSONB DEFAULT '[]',
  reference_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Strategies ──────────────────────────────────────────────
CREATE TABLE strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  positioning TEXT,
  persona TEXT,
  brand_voice TEXT,
  content_pillars JSONB DEFAULT '[]',
  editorial_lines JSONB DEFAULT '[]',
  objectives JSONB DEFAULT '[]',
  monthly_theme TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, month)
);

-- ─── Payments ────────────────────────────────────────────────
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  value NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pago', 'pendente', 'atrasado', 'cancelado')),
  payment_method TEXT,
  reference TEXT,
  receipt_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Contracts ───────────────────────────────────────────────
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  contract_type TEXT DEFAULT 'Prestação de Serviços',
  signed_date DATE,
  start_date DATE NOT NULL,
  end_date DATE,
  value NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'expirado', 'pendente_assinatura', 'cancelado')),
  file_url TEXT,
  file_name TEXT,
  file_size TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Documents ───────────────────────────────────────────────
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  type TEXT NOT NULL CHECK (type IN ('contrato', 'comprovante', 'briefing', 'identidade_visual', 'relatorio', 'outro')),
  name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size TEXT,
  file_url TEXT,
  tags JSONB DEFAULT '[]',
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tasks ───────────────────────────────────────────────────
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'em_revisao', 'concluido')),
  priority TEXT DEFAULT 'media' CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')),
  assignee_id UUID REFERENCES users(id),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  tags JSONB DEFAULT '[]',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Reports ─────────────────────────────────────────────────
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  type TEXT CHECK (type IN ('mensal', 'semanal', 'campanha')),
  title TEXT,
  content JSONB,
  file_url TEXT,
  generated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Insights / AI ───────────────────────────────────────────
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  type TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'success')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  action_label TEXT,
  action_href TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Alerts ──────────────────────────────────────────────────
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'success')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  action_label TEXT,
  action_href TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Prompt Library ──────────────────────────────────────────
CREATE TABLE prompt_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  content TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Reference Library ───────────────────────────────────────
CREATE TABLE reference_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  type TEXT CHECK (type IN ('design', 'copy', 'video', 'trend', 'campanha')),
  description TEXT,
  thumbnail_url TEXT,
  tags JSONB DEFAULT '[]',
  added_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_tasks_client ON tasks(client_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_content_calendar_client ON content_calendar(client_id);
CREATE INDEX idx_content_calendar_date ON content_calendar(scheduled_date);
CREATE INDEX idx_instagram_metrics_account ON instagram_daily_metrics(account_id, date);
CREATE INDEX idx_alerts_read ON alerts(read);

-- ─── Row Level Security (ativado após configurar autenticação) ───
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
