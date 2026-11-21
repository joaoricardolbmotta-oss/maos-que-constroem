# Setup Inicial - Mãos que Constroem Platform

Guia passo a passo para configurar a plataforma do zero.

## 📋 Pré-requisitos

- Node.js 18+ (https://nodejs.org/)
- Git (https://git-scm.com/)
- Conta GitHub (https://github.com/)
- Conta Supabase (https://supabase.com/)
- Conta Vercel (https://vercel.com/)

## 🔑 Fase 1: Supabase Setup

### 1.1 Criar projeto no Supabase

1. Acesse https://supabase.com e crie uma conta/login
2. Clique em "New Project"
3. Preencha:
   - **Name:** `maos-que-constroem`
   - **Database Password:** Use uma senha forte (guarde bem!)
   - **Region:** Selecione a região mais próxima (ex: `São Paulo`)
4. Clique em "Create new project"
5. Aguarde 2-3 minutos pelo setup

### 1.2 Configurar banco de dados

1. Vá para a aba "SQL Editor"
2. Copie e execute o conteúdo de `supabase/migrations/001_initial_schema.sql`
3. Copie e execute o conteúdo de `supabase/migrations/002_add_audit_log.sql`
4. Aguarde as execuções completarem

### 1.3 Configurar Storage

1. Vá para "Storage" (no menu lateral esquerdo)
2. Clique em "Create new bucket"
3. Crie 2 buckets:
   - **Name:** `comprovantes` | **Public:** ✅ Yes
   - **Name:** `imagens-comprovantes` | **Public:** ✅ Yes

### 1.4 Obter credenciais

1. Vá para "Settings" → "API"
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service role secret** → `SUPABASE_SERVICE_ROLE_KEY`
3. Guarde esses valores (precisará em breve)

---

## 🐙 Fase 2: GitHub Setup

### 2.1 Criar repositório

1. Acesse https://github.com/new
2. Preencha:
   - **Repository name:** `maos-que-constroem-platform`
   - **Description:** `Plataforma de transparência e prestação de contas`
   - **Visibility:** `Private` (ou Public, conforme preferir)
   - **Initialize with README:** ☐ (já temos um)
3. Clique "Create repository"

### 2.2 Clonar localmente e fazer push

```bash
# Clone o repositório vazio
git clone https://github.com/seu-usuario/maos-que-constroem-platform.git
cd maos-que-constroem-platform

# Adicione os arquivos do projeto
# (copie todos os arquivos que geramos para esta pasta)

# Adicione ao git
git add .
git commit -m "Initial commit: projeto setup

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Faça push
git branch -M main
git push -u origin main
```

---

## 🚀 Fase 3: Vercel Setup

### 3.1 Conectar repositório ao Vercel

1. Acesse https://vercel.com e faça login
2. Clique em "Add New Project"
3. Clique em "Import Git Repository"
4. Selecione `seu-usuario/maos-que-constroem-platform`
5. Configure:
   - **Project Name:** `maos-que-constroem-platform`
   - **Framework Preset:** `Next.js` (auto-detectado)

### 3.2 Configurar variáveis de ambiente

No Vercel, em "Environment Variables", adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key-aqui
JWT_SECRET=gere-uma-string-aleatoria-forte
NEXT_PUBLIC_API_URL=https://seu-deployment-vercel.vercel.app
NEXT_PUBLIC_APP_URL=https://seu-deployment-vercel.vercel.app
```

### 3.3 Deploy

1. Clique em "Deploy"
2. Aguarde 3-5 minutos
3. Quando pronto, copie a URL do deployment (ex: `https://maos-que-constroem-platform.vercel.app`)

---

## 💻 Fase 4: Setup Local

### 4.1 Instalar dependências

```bash
npm install
```

### 4.2 Configurar .env.local

```bash
cp .env.local.example .env.local
```

Preencha `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=sua-secret-jwt
NODE_ENV=development
```

### 4.3 Seed inicial

```bash
npm run db:seed
```

Isso cria:
- ✅ Usuário admin: `admin@institute.com` / `admin123`
- ✅ Campanhas de exemplo
- ✅ Receitas, despesas, e itens de orçamento de exemplo

### 4.4 Executar localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## ✅ Validação

### 4.5 Testar funcionalidades

1. **Login:**
   - Vá para http://localhost:3000/login
   - Email: `admin@institute.com`
   - Senha: `admin123`
   - Clique em "Login"

2. **Dashboard Admin:**
   - Você deve ver a página de admin
   - Clique em "Campanhas" para listar as campanhas

3. **Portal Público:**
   - Vá para http://localhost:3000/campanha/acao-01
   - Você deve ver a campanha pública com dados mascarados

4. **Typecheck:**
   ```bash
   npm run typecheck
   ```
   Deve passar sem erros

5. **Lint:**
   ```bash
   npm run lint
   ```
   Deve passar sem erros

---

## 📱 Próximas Fases

### Fase 5: Implementação do Admin Dashboard
- [ ] Página de campanhas (create, read, update, delete)
- [ ] Página de receitas
- [ ] Página de despesas
- [ ] Página de doações materiais
- [ ] Página de orçamento

### Fase 6: Portal Público
- [ ] Homepage com listagem de campanhas
- [ ] Página de detalhes de campanha
- [ ] Comprovantes públicos

### Fase 7: Testes & Qualidade
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes E2E

### Fase 8: Deploy Final
- [ ] Verificar CI/CD no GitHub Actions
- [ ] Deploy automático em main branch
- [ ] Configurar domain customizado (opcional)

---

## 🆘 Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is not set"
- Verifique se `.env.local` foi criado corretamente
- Reinicie o servidor Next.js: `npm run dev`

### "Database connection failed"
- Verifique se as credenciais do Supabase estão corretas
- Teste a conexão no SQL Editor do Supabase

### "Port 3000 already in use"
```bash
# Libere a porta
lsof -i :3000
kill -9 <PID>

# Ou use outra porta
npm run dev -- -p 3001
```

### "Cannot find module 'supabase'"
```bash
npm install
```

---

## 📚 Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## ✨ Pronto!

Você está pronto para começar a desenvolviment a plataforma! 🎉

Próximo passo: Implementar as páginas do admin e do portal público.
