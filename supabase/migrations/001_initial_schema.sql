-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE campaign_date_mode AS ENUM ('single', 'period', 'none');
CREATE TYPE campaign_status AS ENUM ('draft', 'planned', 'active', 'finished');
CREATE TYPE material_category AS ENUM ('alimentos', 'higiene', 'roupas', 'brinquedos', 'outros');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'master')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Campanhas (Projects/Actions)
CREATE TABLE campanhas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  institution TEXT NOT NULL DEFAULT 'Instituto Joanna de Ângelis',
  public_slug TEXT UNIQUE NOT NULL,

  date_mode campaign_date_mode NOT NULL DEFAULT 'single',
  action_date DATE,
  end_date DATE,

  fundraising_goal NUMERIC(12,2),
  status campaign_status NOT NULL DEFAULT 'draft',
  estimated_audience INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_campanhas_slug ON campanhas(public_slug);
CREATE INDEX idx_campanhas_status ON campanhas(status);
CREATE INDEX idx_campanhas_created_by ON campanhas(created_by);

-- Receitas (Income/Donations)
CREATE TABLE receitas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,

  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  source TEXT NOT NULL,

  donor_name TEXT,
  donor_cpf TEXT,

  receipt_number TEXT,
  receipt_date DATE NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_receitas_campaign ON receitas(campaign_id);
CREATE INDEX idx_receitas_created_by ON receitas(created_by);
CREATE INDEX idx_receitas_receipt_date ON receitas(receipt_date);

-- Despesas (Expenses)
CREATE TABLE despesas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,

  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  expense_date DATE NOT NULL,

  vendor_name TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_despesas_campaign ON despesas(campaign_id);
CREATE INDEX idx_despesas_created_by ON despesas(created_by);
CREATE INDEX idx_despesas_expense_date ON despesas(expense_date);

-- Doacoes Materiais (Material Donations)
CREATE TABLE doacoes_materiais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,

  item_name TEXT NOT NULL,
  category material_category NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT,

  donor_name TEXT,
  donor_cpf TEXT,

  received_date DATE NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_doacoes_campaign ON doacoes_materiais(campaign_id);
CREATE INDEX idx_doacoes_created_by ON doacoes_materiais(created_by);

-- Orcamento Itens (Budget Items)
CREATE TABLE orcamento_itens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_value NUMERIC(12,2) NOT NULL,
  planned_total NUMERIC(12,2) NOT NULL,

  sort_order INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_orcamento_campaign ON orcamento_itens(campaign_id);
CREATE INDEX idx_orcamento_sort_order ON orcamento_itens(campaign_id, sort_order);

-- Comprovantes (Receipts/Proof Files)
CREATE TABLE comprovantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,

  type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,

  storage_path TEXT NOT NULL,
  storage_url TEXT,

  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  has_personal_data BOOLEAN DEFAULT true,
  masking_status TEXT DEFAULT 'pending' CHECK (masking_status IN ('pending', 'masked', 'skipped')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_comprovantes_campaign ON comprovantes(campaign_id);
CREATE INDEX idx_comprovantes_uploaded_by ON comprovantes(uploaded_by);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,

  old_values JSONB,
  new_values JSONB,

  ip_address TEXT,
  user_agent TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- RLS Policies (Row-Level Security) - opcional, implementar conforme necessário
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE campanhas ENABLE ROW LEVEL SECURITY;
-- etc...
