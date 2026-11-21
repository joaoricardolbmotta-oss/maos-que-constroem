# Mãos que Constroem - Plataforma de Transparência

Plataforma de transparência e prestação de contas para campanhas de arrecadação, desenvolvida com Next.js, TypeScript, Supabase e Vercel.

## 🚀 Stack Tecnológico

- **Frontend:** Next.js 14+ | React 18+ | TypeScript | TailwindCSS | shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL gerenciado)
- **Authentication:** Supabase Auth (JWT)
- **Storage:** Supabase Storage
- **Deployment:** Vercel
- **Version Control:** GitHub

## 📁 Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Admin area (protegida)
│   ├── (auth)/            # Login/logout
│   ├── campanha/          # Public campaign pages
│   └── api/               # Backend endpoints
├── components/            # React components
│   ├── auth/             # Login form
│   ├── admin/            # Admin dashboard components
│   ├── public/           # Public page components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── validators.ts     # Zod schemas
│   ├── privacy.ts        # Data masking utilities
│   ├── currency.ts       # BRL formatting
│   └── date.ts           # Date formatting
├── types/                # TypeScript types
│   ├── database.ts       # Database types
│   └── api.ts            # API request/response types
├── hooks/                # React custom hooks
├── middleware.ts         # Next.js middleware
└── env.ts               # Environment variables validation
```

## 🔧 Setup Inicial

### 1. Clone e instale dependências

```bash
git clone <repository-url>
cd maos-que-constroem-platform
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha com suas credenciais do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Configure banco de dados

No Supabase:
1. Crie um novo projeto
2. Execute as migrations SQL em `supabase/migrations/`
3. Configure Storage buckets: `comprovantes/` e `imagens-comprovantes/`

### 4. Execute localmente

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 📋 Dados de Teste

Usuário admin inicial:
- Email: `admin@institute.com`
- Senha: `admin123` (altere após primeiro login!)

## 🔐 Autenticação

- Login via `/login`
- Dashboard administrativo em `/admin`
- Logout em `/api/auth/logout`
- Proteção de rotas via middleware

## 📱 Funcionalidades

### Admin
- ✅ Criar/editar campanhas com meta, propósito, tipo de data
- ✅ Registrar receitas, despesas, doações materiais
- ✅ Adicionar itens de orçamento
- ✅ Upload de comprovantes
- ✅ Auditoria de ações

### Público
- ✅ Visualizar campanhas ativas sem login
- ✅ Ver total arrecadado vs meta
- ✅ Acessar comprovantes (mascarados)
- ✅ Dados sempre privados: CPF (últimos 3 dígitos), nomes abreviados

## 🔒 Privacidade & Segurança

- CPF exibido apenas com últimos 3 dígitos
- Nomes abreviados (primeiro nome + sobrenome inicial)
- Imagens de comprovantes mascaradas
- Validação de input com Zod
- CSRF protection
- Rate limiting em autenticação
- Audit log de todas as ações

## 📚 Tipos de Dados Principais

### Campanhas
- Título, descrição, instituição
- Meta de arrecadação
- Tipo de data: única, período ou nenhuma
- Status: rascunho, planejado, ativo, encerrado

### Receitas
- Descrição, valor, origem
- Dados do doador (mascarados publicamente)
- Data do comprovante

### Despesas
- Descrição, categoria, valor
- Data da despesa
- Dados do fornecedor

### Doações Materiais
- Nome do item, categoria (alimentos, higiene, roupas, brinquedos, outros)
- Quantidade e unidade
- Dados do doador

### Orçamento
- Itens planejados
- Quantidade e valor unitário
- Total planejado

## 🚀 Deployment

### Vercel

1. Conecte o repositório GitHub ao Vercel
2. Configure variáveis de ambiente (mesmas do .env.local)
3. Deploy automático em cada push para `main`

```bash
# Deploy manual
vercel deploy
```

### GitHub Actions

CI/CD automático:
- ESLint + TypeScript typecheck
- Build verification
- Deploy automático em `main`

Veja `.github/workflows/` para mais detalhes.

## 📖 Documentação de API

Veja `API_DOCUMENTATION.md` para endpoints completos.

## 🧪 Testes

```bash
npm run test              # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 🛠️ Scripts Úteis

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # TypeScript check
npm run db:push          # Update database schema
npm run db:seed          # Seed database
```

## 📞 Suporte

Para problemas ou dúvidas, abra uma issue no GitHub.

## 📄 Licença

© Instituto Joanna de Ângelis. Todos os direitos reservados.
