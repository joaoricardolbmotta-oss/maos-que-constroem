# Planejamento Detalhado: Plataforma Mãos que Constroem

## 1. VISÃO GERAL

**Objetivo:** Substituir completamente a dependência do Floot com uma plataforma custom que permite gerenciar múltiplas campanhas de arrecadação com transparência total e prestação de contas públicas.

**Público:**
- **Administradores:** Usuário master que cria campanhas, registra receitas/despesas/doações, gerencia comprovantes
- **Público:** Acesso sem login para visualizar estado de campanhas, arrecadações, despesas, comprovantes

**Requisitos críticos de privacidade:**
- Nomes abreviados nos comprovantes públicos
- CPF exibindo máximo 3 últimos dígitos
- Dados pessoais ocultos em imagens de comprovantes
- Separação clara entre funções administrativas e consulta pública

---

## 2. STACK TECNOLÓGICO

```
Frontend:
  - React 18+ com TypeScript
  - Next.js 14+ (App Router)
  - TailwindCSS + shadcn/ui para componentes
  - React Hook Form + Zod para validação
  - SWR ou TanStack Query para data fetching
  
Backend:
  - API Routes do Next.js (serverless, rodando no Vercel)
  - TypeScript
  - Prisma ORM para tipo-safety com banco
  
Banco de Dados:
  - Supabase (PostgreSQL gerenciado)
  - Autenticação nativa do Supabase (JWT)
  - Storage do Supabase para comprovantes e imagens
  
Infraestrutura:
  - GitHub (versionamento)
  - Vercel (deploy automático, CI/CD)
  - Supabase (banco + storage + autenticação)
```

---

## 3. ARQUITETURA GERAL

```
┌─────────────────────────────────────────────────────────────┐
│                      Cliente (Browser)                       │
│  Next.js App / React / TailwindCSS                          │
│  ├── /admin    (dashboard administrativo)                   │
│  └── /campanha (portal público por campanha)                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│          Next.js API Routes + Middleware                     │
│  /api/auth/*          (login, logout, check session)        │
│  /api/campanhas/*     (CRUD campanhas)                      │
│  /api/receitas/*      (CRUD receitas)                       │
│  /api/despesas/*      (CRUD despesas)                       │
│  /api/doacoes/*       (CRUD doações materiais)              │
│  /api/comprovantes/*  (upload, download, listagem)          │
│  /api/orcamentos/*    (CRUD itens de orçamento)             │
│  /api/relatorios/*    (sumários públicos)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ SDK Supabase / HTTP
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                     │
│  Tables:                                                    │
│    - users (master admin)                                   │
│    - campanhas                                              │
│    - receitas                                               │
│    - despesas                                               │
│    - doacoes_materiais                                      │
│    - orcamento_itens                                        │
│    - comprovantes (referências ao storage)                  │
│    - audit_log (rastreabilidade)                            │
│                                                             │
│  Storage:                                                   │
│    /comprovantes/{campaignId}/{type}/{fileName}            │
│    /imagens-comprovantes/{campaignId}/{fileName}           │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. ESTRUTURA DE DIRETÓRIOS

```
maos-que-constroem/
├── .github/
│   └── workflows/
│       ├── deploy.yml          (deploy automático Vercel)
│       └── lint-test.yml       (lint + typecheck)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          (layout raiz)
│   │   ├── page.tsx            (home pública)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── logout/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx      (proteção + navbar admin)
│   │   │   ├── page.tsx        (dashboard)
│   │   │   ├── campanhas/
│   │   │   │   ├── page.tsx    (lista + criar)
│   │   │   │   ├── [id]/page.tsx (editar)
│   │   │   │   └── [id]/
│   │   │   │       ├── receitas/
│   │   │   │       ├── despesas/
│   │   │   │       ├── doacoes/
│   │   │   │       ├── orcamento/
│   │   │   │       └── comprovantes/
│   │   │   └── auditoria/page.tsx
│   │   │
│   │   ├── campanha/
│   │   │   ├── page.tsx        (lista de campanhas ativas)
│   │   │   └── [slug]/page.tsx (visualização pública)
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   └── logout/route.ts
│   │       ├── campanhas/
│   │       │   ├── route.ts        (GET all, POST create)
│   │       │   └── [id]/route.ts   (GET, PUT, DELETE)
│   │       ├── receitas/
│   │       ├── despesas/
│   │       ├── doacoes/
│   │       ├── comprovantes/
│   │       │   ├── route.ts        (GET list, POST upload)
│   │       │   └── [id]/route.ts   (GET download, DELETE)
│   │       ├── orcamento/
│   │       └── relatorios/
│   │           └── [campaignId]/route.ts (sumário público)
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginForm.tsx
│   │   ├── admin/
│   │   │   ├── CampanhaForm.tsx
│   │   │   ├── ReceitaForm.tsx
│   │   │   ├── DespesaForm.tsx
│   │   │   ├── DoacaoForm.tsx
│   │   │   ├── OrcamentoForm.tsx
│   │   │   ├── ComprovantesUpload.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── public/
│   │   │   ├── CampanhaCard.tsx
│   │   │   ├── ProgresBar.tsx
│   │   │   ├── ComprovantesPublicos.tsx
│   │   │   └── Resumo.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Table.tsx
│   │       └── ... (shadcn/ui)
│   │
│   ├── lib/
│   │   ├── supabase.ts         (cliente Supabase)
│   │   ├── auth.ts             (helpers autenticação)
│   │   ├── validators.ts       (zod schemas)
│   │   ├── privacy.ts          (máscaras de privacidade)
│   │   ├── currency.ts         (formatação BRL)
│   │   ├── date.ts             (formatação de datas)
│   │   └── api-client.ts       (wrapper fetch tipado)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCampanha.ts
│   │   ├── useReceita.ts
│   │   ├── useDespesa.ts
│   │   ├── useDoacoes.ts
│   │   └── useComprovantes.ts
│   │
│   ├── types/
│   │   ├── database.ts         (tipos gerados do Supabase)
│   │   ├── api.ts              (request/response types)
│   │   └── domain.ts           (tipos de domínio)
│   │
│   ├── middleware.ts           (protege rotas admin)
│   └── env.ts                  (validação de env vars)
│
├── scripts/
│   ├── seed.ts                 (popular banco com dados iniciais)
│   └── migrate.ts              (Prisma migrations)
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_audit_log.sql
│   │   └── ...
│   └── seed.sql
│
├── tests/
│   ├── api/
│   ├── components/
│   └── lib/
│
├── .env.local.example
├── .eslintrc.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── package.json
└── README.md
```

---

## 5. MODELOS DE DADOS (Supabase Schema)

### 5.1 Users (Autenticação)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'master'
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 5.2 Campanhas (Projetos/Ações)

```sql
CREATE TYPE campaign_date_mode AS ENUM ('single', 'period', 'none');
CREATE TYPE campaign_status AS ENUM ('draft', 'planned', 'active', 'finished');

CREATE TABLE campanhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  institution TEXT NOT NULL DEFAULT 'Instituto Joanna de Ângelis',
  public_slug TEXT UNIQUE NOT NULL, -- ex: "acao-01"
  
  -- Data
  date_mode campaign_date_mode NOT NULL DEFAULT 'single',
  action_date DATE,
  end_date DATE,
  
  -- Meta e status
  fundraising_goal NUMERIC(12,2),
  status campaign_status NOT NULL DEFAULT 'draft',
  estimated_audience INTEGER,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_campanhas_slug ON campanhas(public_slug);
CREATE INDEX idx_campanhas_status ON campanhas(status);
```

### 5.3 Receitas (Arrecadações)

```sql
CREATE TABLE receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,
  
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  source TEXT NOT NULL, -- "doador", "doador-anônimo", "comercio", etc
  
  donor_name TEXT, -- MASKADO na visão pública
  donor_cpf TEXT, -- MASKADO (apenas 3 últimos dígitos)
  
  receipt_number TEXT,
  receipt_date DATE NOT NULL,
  
  comprovante_id UUID REFERENCES comprovantes(id),
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_receitas_campaign ON receitas(campaign_id);
```

### 5.4 Despesas

```sql
CREATE TABLE despesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,
  
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- "alimentacao", "transporte", "material", etc
  amount NUMERIC(12,2) NOT NULL,
  expense_date DATE NOT NULL,
  
  vendor_name TEXT, -- pode ser maskado
  
  comprovante_id UUID REFERENCES comprovantes(id),
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_despesas_campaign ON despesas(campaign_id);
```

### 5.5 Doações Materiais

```sql
CREATE TYPE material_category AS ENUM (
  'alimentos', 'higiene', 'roupas', 'brinquedos', 'outros'
);

CREATE TABLE doacoes_materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,
  
  item_name TEXT NOT NULL,
  category material_category NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT, -- "unidade", "kg", "caixa", etc
  
  donor_name TEXT, -- MASKADO
  donor_cpf TEXT, -- MASKADO
  
  received_date DATE NOT NULL,
  comprovante_id UUID REFERENCES comprovantes(id),
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_doacoes_campaign ON doacoes_materiais(campaign_id);
```

### 5.6 Itens de Orçamento (Planejado)

```sql
CREATE TABLE orcamento_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_value NUMERIC(12,2) NOT NULL,
  planned_total NUMERIC(12,2) NOT NULL, -- qty * unit_value
  
  sort_order INTEGER,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_orcamento_campaign ON orcamento_itens(campaign_id);
```

### 5.7 Comprovantes (Arquivos)

```sql
CREATE TABLE comprovantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL, -- "receita", "despesa", "doacao", "general"
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL, -- "image/jpeg", "application/pdf", etc
  
  storage_path TEXT NOT NULL, -- caminho no Supabase Storage
  storage_url TEXT,
  
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT now(),
  
  -- Se tem dados pessoais que precisam ser mascarados
  has_personal_data BOOLEAN DEFAULT true,
  masking_status TEXT DEFAULT 'pending', -- 'pending', 'masked', 'skipped'
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_comprovantes_campaign ON comprovantes(campaign_id);
```

### 5.8 Audit Log (Rastreabilidade)

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  entity_type TEXT NOT NULL, -- "campanha", "receita", etc
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- "create", "update", "delete"
  
  old_values JSONB,
  new_values JSONB,
  
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
```

---

## 6. ENDPOINTS API

### 6.1 Autenticação

```
POST   /api/auth/login
  Body: { email, password }
  Return: { token, user }

POST   /api/auth/logout
  Return: { success }

GET    /api/auth/me
  Return: { user } ou 401
```

### 6.2 Campanhas (Admin)

```
GET    /api/campanhas
  Query: ?status=draft|active|finished (filtrar)
  Return: { campanhas: Campaign[] }

POST   /api/campanhas
  Body: { title, description, institution, public_slug, date_mode, 
          action_date, end_date, fundraising_goal, status, estimated_audience }
  Return: { campaign: Campaign }

GET    /api/campanhas/:id
  Return: { campaign: Campaign (admin view, sem mask) }

PUT    /api/campanhas/:id
  Body: { campos atualizáveis }
  Return: { campaign: Campaign }

DELETE /api/campanhas/:id
  Return: { success }
```

### 6.3 Receitas (Admin)

```
GET    /api/campanhas/:campaignId/receitas
  Return: { receitas: Receita[] }

POST   /api/campanhas/:campaignId/receitas
  Body: { description, amount, source, donor_name, donor_cpf, 
          receipt_number, receipt_date }
  Return: { receita: Receita }

PUT    /api/campanhas/:campaignId/receitas/:id
PUT    /api/campanhas/:campaignId/receitas/:id
DELETE /api/campanhas/:campaignId/receitas/:id
```

### 6.4 Despesas (Admin)

```
GET    /api/campanhas/:campaignId/despesas
POST   /api/campanhas/:campaignId/despesas
PUT    /api/campanhas/:campaignId/despesas/:id
DELETE /api/campanhas/:campaignId/despesas/:id
```

### 6.5 Doações Materiais (Admin)

```
GET    /api/campanhas/:campaignId/doacoes
POST   /api/campanhas/:campaignId/doacoes
PUT    /api/campanhas/:campaignId/doacoes/:id
DELETE /api/campanhas/:campaignId/doacoes/:id
```

### 6.6 Orçamento (Admin)

```
GET    /api/campanhas/:campaignId/orcamento
POST   /api/campanhas/:campaignId/orcamento
PUT    /api/campanhas/:campaignId/orcamento/:id
DELETE /api/campanhas/:campaignId/orcamento/:id
```

### 6.7 Comprovantes (Admin)

```
GET    /api/campanhas/:campaignId/comprovantes
  Return: { comprovantes: Comprovante[] }

POST   /api/campanhas/:campaignId/comprovantes
  Body: FormData { file, type }
  Return: { comprovante: Comprovante }

GET    /api/comprovantes/:id/download
  Return: file (redirect para storage URL)

DELETE /api/campanhas/:campaignId/comprovantes/:id
```

### 6.8 Relatórios Públicos

```
GET    /api/relatorios/:campaignSlug
  Return: {
    campaign: Campaign (masked),
    receitas_total: number,
    despesas_total: number,
    saldo: number,
    progresso_meta: number,
    orcamento: OrcamentoItem[],
    receitas: Receita[] (masked),
    despesas: Despesa[] (masked),
    doacoes: Doacao[] (masked)
  }
```

---

## 7. CAMADAS DE PRIVACIDADE & MASCARAMENTO

### 7.1 Função de Privacidade (lib/privacy.ts)

```typescript
// Retorna apenas últimos 3 dígitos do CPF
maskCPF(cpf: string): string
  // 123.456.789-10 → ***.***.***-10

// Abrevia nome (primeiro nome + inicial sobrenome)
maskName(name: string): string
  // "João Ricardo Silva" → "João S."

// Remove dados pessoais de imagens (blur, crop, etc)
// Será processado no upload ou em background job
maskImageComprovante(file: File): Promise<Blob>

// Retorna view pública vs admin
getReceitaForView(receita: Receita, adminView: boolean): Receita
  if adminView return receita completa
  else return receita com CPF e nome mascarados
```

### 7.2 Middleware de Privacidade

- Endpoints `/api/relatorios/*` (público) retornam dados mascarados por padrão
- Endpoints `/api/admin/*` retornam dados completos (admin only)
- Imagens de comprovantes: servir versão mascarada publicamente se `has_personal_data=true`

---

## 8. FLUXOS PRINCIPAIS

### 8.1 Criar Nova Campanha (Admin)

```
1. Admin faz login
2. Clica "Nova Campanha"
3. Preenche formulário:
   - Nome do projeto
   - Propósito (descrição)
   - Instituição (padrão IJA)
   - Meta de arrecadação (opcional)
   - Tipo de data (única, período, nenhuma)
   - Status (rascunho, planejado, ativo, encerrado)
   - Identificador público (auto-slug)
   - Público estimado (opcional)
4. Submete
5. POST /api/campanhas
6. Campanha criada em status "draft" (não aparece no portal público)
7. Admin é redirecionado para edição da campanha
8. Admin pode adicionar itens de orçamento, receitas, etc.
```

### 8.2 Registrar Receita (Admin)

```
1. Admin abre campanha
2. Clica "Registrar Receita"
3. Preenche formulário:
   - Descrição
   - Valor
   - Origem (doador, comércio, etc)
   - Nome do doador (capturado)
   - CPF (capturado)
   - Data do comprovante
4. Opcionalmente faz upload de comprovante
5. POST /api/campanhas/:id/receitas
6. Receita registrada
7. Dados mascarados automaticamente para view pública
```

### 8.3 Visualizar Campanha Pública

```
1. Usuário acessa /campanha/acao-01 (ou qualquer slug)
2. Sistema busca GET /api/relatorios/acao-01
3. Retorna dados mascarados:
   - Campanha (título, propósito, meta)
   - Total arrecadado
   - Total despesas
   - Saldo
   - Progresso em % da meta
   - Itens de orçamento (% atingido)
   - Lista de receitas (nomes mascarados)
   - Lista de despesas (nomes mascarados)
   - Comprovantes públicos (imagens mascaradas)
4. Frontend renderiza dashboard público
```

### 8.4 Download de Comprovante Público

```
1. Usuário vê lista de comprovantes na página pública
2. Clica para download
3. GET /api/comprovantes/:id/download
4. Sistema verifica se tem dados pessoais
5. Se sim, serve versão mascarada/blurrada
6. Se não, serve original
7. Download iniciado
```

---

## 9. AUTENTICAÇÃO & AUTORIZAÇÃO

### 9.1 Estratégia

- **Supabase Auth:** JWT tokens, sessão segura
- **Middleware (`src/middleware.ts`):**
  - Verifica JWT em cookies
  - Protege rotas `/api/admin/*` e `/admin/*`
  - Permite acesso público apenas a `/api/relatorios/*` e `/campanha/*`

### 9.2 User Roles

```typescript
type Role = 'master' | 'admin';

// 'master': pode criar usuários, gerenciar campanhas globalmente
// 'admin': pode gerenciar campanhas (versão atual, sem multi-user)
```

### 9.3 Fluxo de Login

```
1. User acessa /login
2. Preenche email + password
3. POST /api/auth/login
4. Backend valida contra users table
5. Se válido: gera JWT, retorna user + token
6. Frontend armazena em HttpOnly cookie (seguro)
7. Middleware valida a cada request
8. Redirect para /admin
```

---

## 10. COMPONENTES FRONTEND

### 10.1 Admin

```
- LoginForm: email, password, submit
- CampanhaForm: modal/página para criar/editar
- ReceitaForm: form para registrar receita
- DespesaForm: form para registrar despesa
- DoacaoForm: form para registrar doação
- OrcamentoForm: form para adicionar itens de orçamento
- ComprovantesUpload: drag-and-drop ou input file
- Dashboard: resumo geral, lista de campanhas, ações rápidas
- Table component: renderizar listas paginadas
- Modal/Dialog: confirmações, ações secundárias
```

### 10.2 Público

```
- Home: listagem de campanhas ativas
- CampanhaCard: card exibindo resumo da campanha
- ProgressBar: barra de progresso da meta
- Resumo: cards com totais (arrecadado, despesas, saldo, meta)
- TabelaReceitas: listagem de receitas (masked)
- TabelaDespesas: listagem de despesas (masked)
- Comprovantes: galeria/lista de comprovantes públicos
- CampanhaDetail: página completa da campanha
```

---

## 11. VALIDAÇÕES (Zod Schemas)

```typescript
// Campanha
CampanhaSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().max(4000).optional(),
  institution: z.string().default("Instituto Joanna de Ângelis"),
  public_slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(120),
  date_mode: z.enum(['single', 'period', 'none']),
  action_date: z.date().nullable(),
  end_date: z.date().nullable(),
  fundraising_goal: z.number().min(0).nullable(),
  status: z.enum(['draft', 'planned', 'active', 'finished']),
  estimated_audience: z.number().min(0).optional()
}).superRefine((data, ctx) => {
  // Date validation: se date_mode não é 'none', action_date é required
  // Se date_mode é 'period', end_date é required e > action_date
});

// Receita
ReceitaSchema = z.object({
  description: z.string().min(1).max(500),
  amount: z.number().min(0.01),
  source: z.string(),
  donor_name: z.string().optional(),
  donor_cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).optional(),
  receipt_number: z.string().optional(),
  receipt_date: z.date()
});

// ... similar para Despesa, Doacao, OrcamentoItem
```

---

## 12. DEPLOYMENT (Vercel + Supabase + GitHub)

### 12.1 GitHub

```
- main branch: deploy automático
- dev branch: deploy preview
- .gitignore: .env.local, node_modules, .next
- Branch protection: require code review antes de merge em main
```

### 12.2 Supabase Setup

```
1. Criar projeto no Supabase
2. Executar SQL migrations (001_initial_schema.sql, etc)
3. Configurar Row-Level Security (RLS) se necessário:
   - users tabela: apenas admin pode ler/escrever
   - campanhas, receitas, etc: apenas admin pode escrever (público lê via /api/relatorios)
4. Criar API keys (anon e service)
5. Configurar Storage buckets:
   - comprovantes/ (público read, admin write)
   - imagens-comprovantes/ (público read, admin write)
```

### 12.3 Vercel Deployment

```
1. Conectar repositório GitHub ao Vercel
2. Configurar Environment Variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - DATABASE_URL
   - JWT_SECRET
3. Configure GitHub Actions para:
   - Lint + typecheck em cada PR
   - Build verification
   - Deploy automático em main
```

### 12.4 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
- Trigger: push para main ou PR
- Steps:
  1. Checkout
  2. Install deps
  3. ESLint
  4. TypeScript typecheck
  5. Build Next.js
  6. (Opcional) Run tests
  7. Deploy para Vercel
```

---

## 13. CONSIDERAÇÕES DE SEGURANÇA

### 13.1 CORS & CSRF

```
- API routes validam origin
- Cookies HTTP-only para JWT
- CSRF tokens para POST/PUT/DELETE (opcional com SameSite=Strict)
```

### 13.2 Rate Limiting

```
- Implementar rate limiting simples na API (ou usar Vercel middleware)
- Proteger /api/auth/login contra brute force
```

### 13.3 Dados Sensíveis

```
- Senhas: hash com bcrypt (Supabase Auth cuida disso)
- CPF: mascarado ao exibir publicamente
- Nomes: mascarados ao exibir publicamente
- Imagens: blur/crop de dados pessoais antes de exibir publicamente
```

### 13.4 Validação de Input

```
- Zod validation em todos os endpoints
- Sanitizar strings (evitar XSS)
- Validar tipos de arquivo em upload
```

---

## 14. TECNOLOGIAS ESPECÍFICAS POR CAMADA

### 14.1 Frontend

```
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- TailwindCSS + shadcn/ui
- React Hook Form + Zod
- SWR ou TanStack Query
- Axios ou fetch (api-client tipado)
```

### 14.2 Backend

```
- Next.js API Routes
- Supabase SDK (supabase-js)
- Prisma (opcional, para type-safety com queries)
- Jose (JWT handling, se precisar)
```

### 14.3 Banco & Autenticação

```
- Supabase PostgreSQL
- Supabase Auth (JWT)
- Supabase Storage (para comprovantes)
```

### 14.4 Infraestrutura

```
- Vercel (deploy, serverless functions)
- GitHub (versionamento, CI/CD)
- Supabase (banco, auth, storage)
```

---

## 15. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Setup Inicial

- [ ] Criar repositório GitHub
- [ ] Setup Supabase (projeto, tabelas, migrations)
- [ ] Setup Vercel (conectar GitHub)
- [ ] Criar Next.js project com TypeScript
- [ ] Instalar dependencies (shadcn/ui, tailwind, etc)
- [ ] Configurar env vars (.env.local.example)
- [ ] Estruturar diretórios

### Fase 2: Autenticação

- [ ] Implementar /api/auth/login
- [ ] Implementar /api/auth/logout
- [ ] Implementar /api/auth/me
- [ ] Criar middleware de proteção de rotas
- [ ] Criar LoginForm component
- [ ] Proteger /admin/* pages

### Fase 3: Campanhas (Core)

- [ ] Criar table campanhas no Supabase
- [ ] Implementar /api/campanhas GET, POST, PUT, DELETE
- [ ] Criar CampanhaForm component
- [ ] Criar página /admin/campanhas
- [ ] Implementar CRUD de campanhas na interface admin

### Fase 4: Receitas

- [ ] Criar table receitas no Supabase
- [ ] Implementar endpoints CRUD /api/campanhas/:id/receitas
- [ ] Criar ReceitaForm component
- [ ] Integrar na interface admin

### Fase 5: Despesas

- [ ] Criar table despesas no Supabase
- [ ] Implementar endpoints CRUD
- [ ] Criar DespesaForm component
- [ ] Integrar na interface admin

### Fase 6: Doações Materiais

- [ ] Criar table doacoes_materiais no Supabase
- [ ] Implementar endpoints CRUD
- [ ] Criar DoacaoForm component
- [ ] Integrar na interface admin

### Fase 7: Orçamento

- [ ] Criar table orcamento_itens no Supabase
- [ ] Implementar endpoints CRUD
- [ ] Criar OrcamentoForm component
- [ ] Integrar na interface admin

### Fase 8: Comprovantes & Storage

- [ ] Configurar Supabase Storage buckets
- [ ] Implementar /api/comprovantes POST (upload)
- [ ] Implementar /api/comprovantes/:id/download
- [ ] Criar ComprovantesUpload component
- [ ] Integrar privacy/masking (blur, crop, etc)

### Fase 9: Portal Público

- [ ] Implementar /api/relatorios/:slug (endpoint público)
- [ ] Criar /campanha page (listagem)
- [ ] Criar /campanha/[slug] page (detalhe)
- [ ] Criar componentes públicos (cards, tabelas, progressbar)
- [ ] Implementar mascaramento de dados automaticamente

### Fase 10: Auditoria & Logging

- [ ] Criar table audit_log
- [ ] Implementar logging de ações
- [ ] Criar página /admin/auditoria (opcional)

### Fase 11: Testes & QA

- [ ] Testes unitários (componentes, funções)
- [ ] Testes de integração (APIs)
- [ ] Testes E2E (fluxos críticos)
- [ ] Manual QA

### Fase 12: Deploy & Go Live

- [ ] Configurar GitHub Actions (CI/CD)
- [ ] Deploy em staging (Vercel preview)
- [ ] Deploy em produção (main)
- [ ] Comunicar URL final
- [ ] Migrar dados do Floot (se necessário)

---

## 16. ESTRUTURA DE PASTA DO BANCO (SQL Migrations)

```
supabase/migrations/
├── 001_initial_schema.sql
│   └── Cria: users, campanhas, receitas, despesas, 
│           doacoes_materiais, orcamento_itens, comprovantes
│
├── 002_add_audit_log.sql
│   └── Cria: audit_log, índices
│
├── 003_add_rls_policies.sql
│   └── Configurar Row-Level Security (RLS)
│
└── seed.sql
    └── Dados iniciais (usuário master, campanhas exemplo)
```

---

## 17. PRÓXIMAS ETAPAS

1. ✅ Validar este planejamento com o usuário
2. ⏳ Implementar Fase 1 (Setup inicial)
3. ⏳ Implementar Fase 2 (Autenticação)
4. ⏳ Implementar Fases 3-10 (funcionalidades)
5. ⏳ Implementar Fase 11 (testes)
6. ⏳ Implementar Fase 12 (deploy)

---

**Nota:** Este planejamento é extensível. Funcionalidades adicionais (notificações, relatórios avançados, múltiplos admins, etc) podem ser adicionadas após MVP.
