-- ── Clients ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  segment TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ativo',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  website TEXT,
  initials TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#FC75A0',
  instagram_handle TEXT,
  instagram_account_id TEXT,
  monthly_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  contract_start DATE NOT NULL DEFAULT CURRENT_DATE,
  contract_end DATE,
  next_payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_status TEXT NOT NULL DEFAULT 'pendente',
  service_package TEXT NOT NULL DEFAULT '',
  posts_per_month INTEGER NOT NULL DEFAULT 0,
  reels_per_month INTEGER NOT NULL DEFAULT 0,
  stories_per_week INTEGER NOT NULL DEFAULT 0,
  brand_voice TEXT,
  persona TEXT,
  positioning TEXT,
  content_pillars TEXT[],
  objectives TEXT[],
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tasks ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  client_id TEXT,
  client_name TEXT,
  client_color TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  priority TEXT NOT NULL DEFAULT 'media',
  assignee TEXT,
  due_date DATE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Payments ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  value NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'pendente',
  method TEXT,
  reference TEXT NOT NULL,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Calendar items ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calendar_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_color TEXT NOT NULL,
  date DATE NOT NULL,
  format TEXT NOT NULL,
  caption TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho',
  assignee TEXT,
  tags TEXT[],
  instagram_post_id TEXT,
  scheduled_time TEXT,
  description TEXT,
  content TEXT,
  delivery_date DATE,
  attachments TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Contracts ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  type TEXT NOT NULL,
  signed_date DATE,
  start_date DATE NOT NULL,
  end_date DATE,
  value NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente_assinatura',
  file_url TEXT,
  file_name TEXT NOT NULL,
  file_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Prompts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── References (biblioteca) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "references" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  added_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS Policies ──────────────────────────────────────────────────────────
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated full access" ON clients;
CREATE POLICY "authenticated full access" ON clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated full access" ON tasks;
CREATE POLICY "authenticated full access" ON tasks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated full access" ON payments;
CREATE POLICY "authenticated full access" ON payments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE calendar_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated full access" ON calendar_items;
CREATE POLICY "authenticated full access" ON calendar_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated full access" ON contracts;
CREATE POLICY "authenticated full access" ON contracts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated full access" ON prompts;
CREATE POLICY "authenticated full access" ON prompts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE "references" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated full access" ON "references";
CREATE POLICY "authenticated full access" ON "references"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
