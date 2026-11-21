# Mãos que Constroem - Deployment Guide

**Última Atualização:** 2026-11-21
**Status:** ✅ Pronto para Deploy

---

## 📋 CHECKLIST PRÉ-DEPLOYMENT

### **1. Requisitos**
- [x] Node.js 18+
- [x] npm ou pnpm
- [x] Git
- [x] Conta Vercel
- [x] Conta Supabase
- [x] Stripe Account
- [x] Domain (opcional)

### **2. Configuração Local**
```bash
# Clone o repositório
git clone <seu-repo>
cd maos-que-constroem-platform

# Instale dependências
npm install

# Configure environment local
cp .env.local.example .env.local
```

### **3. Variáveis de Ambiente**

Crie um arquivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Mãos que Constroem"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email
SMTP_HOST=smtp.seuservidor.com
SMTP_PORT=587
SMTP_USER=seu_email@seudominio.com
SMTP_PASSWORD=sua_senha
SMTP_SECURE=false
SMTP_FROM=noreply@maosqueconstroem.com

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
NEXT_PUBLIC_GITHUB_CLIENT_ID=xxxxx
```

---

## 🌐 SETUP SUPABASE

### **1. Criar Projeto Supabase**

1. Acesse [supabase.com](https://supabase.com)
2. Clique "New Project"
3. Preencha:
   - Organization: Sua organização
   - Project name: `maos-que-constroem`
   - Database password: Gere uma senha forte
   - Region: `South America (São Paulo)` ou próximo de você
4. Clique "Create new project"

### **2. Configurar Database**

1. Vá para "SQL Editor"
2. Copie todo o conteúdo de `001_initial_schema.sql`
3. Cole no editor
4. Clique "Run"
5. Repita para `002_add_audit_log.sql`

### **3. Obter Credenciais**

1. Vá para "Settings" → "API"
2. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### **4. Habilitar Auth**

1. Vá para "Authentication" → "Providers"
2. Habilite:
   - [x] Email
   - [x] Google
   - [x] GitHub

### **5. Configurar Storage**

1. Vá para "Storage"
2. Clique "New bucket"
3. Nome: `comprovantes`
4. Privacidade: Private
5. Clique "Create bucket"

---

## 💳 SETUP STRIPE

### **1. Conta Stripe**

1. Acesse [stripe.com](https://stripe.com)
2. Registre uma conta
3. Vá para "Developers" → "API keys"
4. Copie:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

### **2. Webhook**

1. Vá para "Developers" → "Webhooks"
2. Clique "Add endpoint"
3. Endpoint URL: `https://seu-dominio.com/api/webhooks/stripe`
4. Eventos: Selecione `payment_intent.succeeded`, `charge.refunded`
5. Copie o "Signing secret" → `STRIPE_WEBHOOK_SECRET`

### **3. Modo Teste**

Use os dados de teste:
```
Card: 4242 4242 4242 4242
Exp: 12/25
CVC: 123
```

---

## 🚀 DEPLOY VERCEL

### **1. Preparar Código**

```bash
# Teste localmente
npm run dev
# Visite http://localhost:3000

# Build
npm run build

# Teste build
npm run start
```

### **2. Push para GitHub**

```bash
# Initialize git se não tiver
git init

# Add remote
git remote add origin https://github.com/seu-usuario/maos-que-constroem.git

# Commit
git add .
git commit -m "Initial commit: Mãos que Constroem platform

Implementação completa com 28 fases:
- Core platform (campanhas, receitas, despesas, doações)
- Colaboração e gerenciamento de membros
- Pagamentos via Stripe
- Autenticação OAuth + 2FA
- API pública com webhooks
- Analytics e auditoria
- Email templates customizáveis
- Agendamento de tarefas

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Push
git push -u origin main
```

### **3. Deploy no Vercel**

```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Ou use a web:
# 1. Acesse vercel.com
# 2. Clique "New Project"
# 3. Selecione seu repositório GitHub
# 4. Clique "Import"
```

### **4. Configurar Variáveis de Ambiente**

No Vercel Dashboard:

1. Vá para "Settings" → "Environment Variables"
2. Adicione todas as variáveis de `.env.local`
3. Selecione os ambientes: Production, Preview, Development
4. Clique "Save"

### **5. Deploy Automático**

Vercel fará deploy automático quando você fizer push:
```bash
git push origin main
# Vercel detects → builds → deploys automaticamente
```

---

## 📱 VERIFICAR DEPLOYMENT

### **Checklist Pós-Deploy**

```bash
# 1. Visite seu domain
https://maos-que-constroem.vercel.app

# 2. Teste homepage
- Veja hero section
- Clique "Ver Campanhas"
- Veja página pública

# 3. Teste login
- Email: admin@example.com
- Senha: admin123
- Deve redirecionar para /admin

# 4. Teste campanhas
- Clique "Nova Campanha"
- Preencha formulário
- Clique "Criar"
- Deve listar

# 5. Teste Stripe
- Vá para uma campanha
- Clique "Doar"
- Use card de teste
- Deve criar receita automaticamente

# 6. Teste Webhooks
- Faça uma doação
- Verificar webhook no Stripe dashboard
- Verificar receita foi criada
```

---

## 🔧 TROUBLESHOOTING

### **Erro: "NEXT_PUBLIC_SUPABASE_URL is not set"**
```
Solução: Configure environment variables no Vercel Dashboard
```

### **Erro: "Failed to authenticate"**
```
Solução: Verifique SUPABASE_SERVICE_ROLE_KEY está correto
```

### **Erro: "Stripe key invalid"**
```
Solução: Use chaves de teste (pk_test_, sk_test_)
```

### **Erro: "SMTP not configured"**
```
Solução: Se não quiser email, comente os envios em email.ts
```

---

## 🎯 PRÓXIMAS ETAPAS

### **1. Configurar Domain Customizado**

```bash
# No Vercel Dashboard:
# Settings → Domains → Add domain
# Adicione seu domain customizado
# Configure DNS conforme instruções
```

### **2. Enable HTTPS**

```bash
# Vercel faz automaticamente com Let's Encrypt
# Nenhuma ação necessária
```

### **3. Configurar Email**

```bash
# 1. Use seu próprio SMTP
# 2. Ou use SendGrid, Mailgun, AWS SES
# 3. Configure em variáveis de ambiente
```

### **4. Monitoramento**

```bash
# 1. Configure Sentry para erros
# 2. Configure Google Analytics
# 3. Configure alertas no Vercel
```

---

## 📊 MONITORAMENTO

### **Vercel Dashboard**
- Performance
- Deployment history
- Environment variables
- Logs

### **Supabase Dashboard**
- Database size
- Realtime connections
- Storage usage

### **Stripe Dashboard**
- Payment volume
- Conversion rate
- Disputes

---

## 🔐 SEGURANÇA EM PRODUÇÃO

### **Checklist**
- [x] HTTPS habilitado
- [x] Environment variables seguras
- [x] JWT HttpOnly cookies
- [x] CORS configurado
- [x] Rate limiting (Vercel)
- [x] SQL injection protection (Supabase)
- [x] XSS protection (React)
- [x] CSRF protection (Next.js)

### **Backups**
```
Supabase: Backup automático diário
Stripe: Webhook backup automático
```

---

## 📞 SUPORTE

**Problemas durante deploy?**

1. Verifique os logs: Vercel Dashboard → "Deployments" → View build logs
2. Confira todas as variáveis de ambiente
3. Teste localmente com `npm run dev`
4. Verifique se todas as dependências estão no `package.json`

---

## 🎉 DEPLOYMENT COMPLETO!

Seu app está online em:
```
https://maos-que-constroem.vercel.app
```

---

**Desenvolvido com ❤️ para transparência e accountability**

Data de Deploy: **2026-11-21**
