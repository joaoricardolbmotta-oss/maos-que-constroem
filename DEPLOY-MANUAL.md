# 🚀 DEPLOYMENT MANUAL - Guia Passo-a-Passo

**Data:** 2026-11-21
**Plataforma:** Vercel + Supabase + Stripe
**Tempo Estimado:** 15-20 minutos

---

## ⚡ RESUMO DO DEPLOYMENT

```
1. ✅ Código pronto
2. ⏳ Push para GitHub
3. ⏳ Conectar Vercel
4. ⏳ Configurar variáveis
5. ⏳ Deploy automático
6. ⏳ Testar produção
```

---

## 📋 PRÉ-DEPLOYMENT: Checklist Inicial

### **1. Verificar Supabase Setup** 
```bash
❓ Supabase projeto criado?
❓ Database migrations executadas?
❓ OAuth providers habilitados?
❓ Storage bucket criado?
❓ Credenciais copiadas para .env.local?
```

**Se NÃO**, seguir:
```
1. Acesse supabase.com
2. Clique "New Project"
3. Region: South America (São Paulo)
4. Aguarde (5-10 min)
5. Execute as migrations SQL
6. Habilite Google OAuth + GitHub OAuth
7. Crie bucket "comprovantes"
8. Copie credenciais
```

### **2. Verificar Stripe Setup**
```bash
❓ Stripe account criado?
❓ API keys obtidas?
❓ Webhook configurado?
❓ Test mode habilitado?
```

**Se NÃO**, seguir:
```
1. Acesse stripe.com
2. Registre-se
3. Vá para Developers → API keys
4. Pegue chaves (test: pk_test_, sk_test_)
5. Configure webhook em Developers → Webhooks
6. Webhook URL: https://seudominio.com/api/webhooks/stripe
7. Eventos: payment_intent.succeeded, charge.refunded
```

### **3. Verificar Google APIs Setup**
```bash
❓ Google Cloud Project criado?
❓ Sheets API habilitada?
❓ Drive API habilitada?
❓ Credenciais OAuth criadas?
```

**Se NÃO**, seguir:
```
1. Acesse console.cloud.google.com
2. Crie novo projeto
3. Habilite Google Sheets API
4. Habilite Google Drive API
5. Vá para Credenciais
6. Crie OAuth 2.0 Client ID
7. Copie credenciais
```

### **4. Verificar GitHub Setup**
```bash
❓ Repositório criado em GitHub?
❓ Git configurado localmente?
❓ SSH keys configuradas?
```

**Se NÃO**, seguir:
```
# Criar repositório em GitHub
# Depois:
git config --global user.email "seu-email@gmail.com"
git config --global user.name "Seu Nome"

# Configurar SSH
ssh-keygen -t ed25519 -C "seu-email@gmail.com"
# Copiar chave pública para GitHub Settings → SSH Keys
```

---

## 🔧 STEP 1: Preparar Código Local

### **1a. Verificar se tudo funciona localmente**
```bash
# Terminal
cd /path/to/maos-que-constroem-platform

# Teste build
npm run build

# Se erros, fix antes de fazer push!
```

### **1b. Verificar .env.local**
```bash
# Arquivo .env.local deve ter:
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_xxxx
SUPABASE_SERVICE_ROLE_KEY=service_role_xxxx

NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxx
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Mãos que Constroem"

# ... outras variáveis
```

### **1c. Criar .env.local.example (para público)**
```bash
# Copiar .env.local para .env.local.example
# Remover valores sensíveis (deixar xxxxx)
# Isso vai para o Git para referência
cp .env.local .env.local.example
```

---

## 📤 STEP 2: Push para GitHub

### **2a. Inicializar Git**
```bash
# Se já não tiver git inicializado
git init

# Ver status
git status
```

### **2b. Adicionar arquivos**
```bash
# Revisar arquivos que serão commitados
git diff --cached

# Adicionar arquivos (excluir .env.local)
git add .
git reset .env.local     # Remove .env.local do staging

# Verificar se tudo está certo
git status
```

### **2c. Fazer primeiro commit**
```bash
git commit -m "Initial commit: Mãos que Constroem platform

Implementação completa com 34 fases:
- Core platform (campanhas, receitas, despesas, doações)
- Colaboração e gerenciamento de membros
- Pagamentos via Stripe
- Autenticação OAuth + 2FA
- API pública com webhooks
- Google Drive & Sheets integrations
- Slack/Discord notifications
- Analytics e auditoria completa
- Dark mode e responsive design
- Advanced search e data export

Tech Stack:
- Next.js 14+ com App Router
- React 18+ com TypeScript
- Supabase PostgreSQL
- Stripe Payments
- Google APIs
- Vercel Hosting

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Ver commits
git log
```

### **2d. Adicionar remote GitHub**
```bash
# IMPORTANTE: Trocar URL pelo seu repositório!
git remote add origin https://github.com/USUARIO/REPOSITORIO.git

# Verificar
git remote -v
```

### **2e. Fazer push para main**
```bash
# Primeira vez pode precisar autenticação
git branch -M main
git push -u origin main

# Verificar no GitHub se arquivo chegou
# Abra: https://github.com/USUARIO/REPOSITORIO
```

---

## 🌐 STEP 3: Configurar Vercel

### **3a. Conectar Vercel com GitHub**
```
1. Acesse vercel.com
2. Clique "New Project"
3. Clique "Continue with GitHub"
4. Authorize Vercel
5. Selecione repositório "maos-que-constroem"
6. Clique "Import"
```

### **3b. Configurar Build Settings**
```
Framework Preset: Next.js
Build Command: npm run build  (padrão, OK)
Output Directory: .next       (padrão, OK)
Environment Variables: ADICIONAR (veja próximo)
```

### **3c. Adicionar Environment Variables**
```
Clique "Environment Variables" e adicione TODAS:

Production:
  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_xxxx
  SUPABASE_SERVICE_ROLE_KEY=service_role_xxxx
  
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxx
  STRIPE_SECRET_KEY=sk_live_xxxx
  STRIPE_WEBHOOK_SECRET=whsec_xxxx
  
  NEXT_PUBLIC_APP_URL=https://seudominio.com
  NEXT_PUBLIC_APP_NAME="Mãos que Constroem"
  
  SMTP_HOST=smtp.seuserver.com
  SMTP_PORT=587
  SMTP_USER=seu-email@domain.com
  SMTP_PASSWORD=sua-senha
  SMTP_SECURE=true
  SMTP_FROM=noreply@domain.com
  
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=xxxxx
  
  NEXT_PUBLIC_GITHUB_CLIENT_ID=xxxxx
  GITHUB_CLIENT_SECRET=xxxxx
  
  GOOGLE_DRIVE_API_KEY=xxxxx

Preview:
  (mesmas variáveis com URLs de preview/staging)

Development:
  (mesmas variáveis com localhost)
```

### **3d. Iniciar Deploy**
```
Depois de adicionar variáveis:
1. Clique "Deploy"
2. Vercel começará build
3. Aguarde (2-5 minutos)
4. Ver logs do build
```

---

## ⏳ STEP 4: Monitorar Deploy

### **4a. Durante Build**
```
Vercel mostrará:
✓ Build started
✓ Cloning repository
✓ Installing dependencies
✓ Running build script
✓ Generating static files
✓ Generating trace files
...

Se houver erro, clicar "View Function Logs" para debug
```

### **4b. Build Concluído**
```
Se tudo OK, verá:
✓ Build completed
✓ Deployment successful
✓ Ready to visit: https://xxxxx.vercel.app

Se houver erro:
✗ Build failed
- Clicar em erro para ver logs
- Corrigir localmente
- Fazer novo push (redeploy automático)
```

### **4c. Domínio Customizado (Opcional)**
```
Se quiser domínio customizado:
1. Settings → Domains
2. Clique "Add Domain"
3. Digite seu domínio
4. Siga instruções de DNS
5. Vercel valida (5-10 min)
```

---

## ✅ STEP 5: Testar Produção

### **5a. Acessar App Publicado**
```
Abrir: https://xxxxx.vercel.app

Ver:
- Logo e branding aparecem?
- Página carrega rápido?
- Sem erros no console?
```

### **5b. Testar Homepage**
```
✓ Hero section aparece
✓ Botão "Ver Campanhas" funciona
✓ Footer aparece
✓ Links funcionam
```

### **5c. Testar Login**
```
✓ Clique "Login"
✓ Email: admin@example.com
✓ Password: admin123
✓ Redireciona para /admin
✓ Dashboard carrega
```

### **5d. Testar Campanhas**
```
✓ Clique "Nova Campanha"
✓ Preencha formulário
✓ Clique "Criar"
✓ Campanha aparece na lista
```

### **5e. Testar Stripe (Cartão de Teste)**
```
✓ Acesse uma campanha
✓ Clique "Doar"
✓ Card: 4242 4242 4242 4242
✓ Exp: 12/25
✓ CVC: 123
✓ Clique "Pagar"
✓ Redirecionamento de sucesso
```

### **5f. Verificar Logs**
```
Vercel Dashboard:
1. Deployments → (seu deploy)
2. Functions → Ver logs
3. Ver se tem erros
4. Verificar requests
```

### **5g. Monitorar Performance**
```
Vercel Analytics:
1. Settings → Analytics
2. Ver Core Web Vitals
3. Ver performance por página
4. Verificar se <3s load time
```

---

## 🔄 TROUBLESHOOTING

### **Erro: "NEXT_PUBLIC_SUPABASE_URL is not set"**
```
Solução:
1. Vercel Dashboard → Settings → Environment Variables
2. Verificar se variável existe
3. Se não, adicionar
4. Clique "Deploy" novamente
```

### **Erro: "Failed to authenticate with Supabase"**
```
Solução:
1. Verificar SUPABASE_SERVICE_ROLE_KEY está correto
2. Copiar novamente do Supabase
3. Adicionar em Vercel
4. Redeploy
```

### **Erro: "Stripe key invalid"**
```
Solução:
1. Se production: usar chaves LIVE (não TEST)
2. Se staging: usar chaves TEST
3. Verificar se começam com pk_live_, sk_live_ ou pk_test_
4. Copiar corretamente (sem espaços)
```

### **Erro: "Build failed - dependencies"**
```
Solução:
1. Localmente: npm install
2. npm run build
3. Se erro, corrigir
4. git commit + push
5. Vercel redeploy automático
```

### **Build lento (>5 min)**
```
Solução:
1. Pode ser Vercel congestionado
2. Aguardar ~10 min
3. Tentar novo deploy
4. Se persistir, contatar suporte Vercel
```

---

## 🎯 PÓS-DEPLOYMENT

### **Configurações Recomendadas**

#### **1. Email Production**
```
Se quiser notificações de email em produção:
1. Usar SendGrid, Mailgun ou AWS SES
2. Adicionar credenciais SMTP em variáveis
3. Testar enviando email
4. Configurar webhook de bounce
```

#### **2. Monitoramento (Sentry)**
```
1. Criar conta em sentry.io
2. Adicionar projeto Next.js
3. Copiar DSN para .env
4. Redeploy
5. Erros automáticos em Sentry
```

#### **3. Analytics (Google)**
```
1. Criar property em analytics.google.com
2. Copiar Tracking ID
3. Adicionar em Head do Next.js
4. Verificar dados chegando
```

#### **4. Auto-merge Vercel (Opcional)**
```
Para merged automático em produção:
1. Settings → Git Integrations
2. Enable "Auto-deploy on merge to main"
3. Próximos commits → deploy automático
```

---

## 📊 Checklist Final de Deployment

```
PRÉ-DEPLOYMENT:
  ☐ Build local OK (npm run build)
  ☐ Supabase setup completo
  ☐ Stripe setup completo
  ☐ GitHub repositório criado
  ☐ .env.local configurado
  ☐ .env.local.example criado (sem valores sensíveis)

GIT & GITHUB:
  ☐ Código commitado
  ☐ Push para main realizado
  ☐ Código visível em GitHub

VERCEL:
  ☐ Projeto criado em Vercel
  ☐ GitHub conectado
  ☐ Environment variables adicionadas (Prod)
  ☐ Deploy iniciado
  ☐ Build concluído com sucesso

TESTES PÓS-DEPLOY:
  ☐ App acessível (HTTPS)
  ☐ Homepage carrega
  ☐ Login funciona
  ☐ Dashboard aparece
  ☐ Campanhas CRUD funciona
  ☐ Stripe teste funciona
  ☐ Notificações de email
  ☐ Logs sem erros

CONFIGURAÇÕES EXTRAS:
  ☐ Domain customizado (opcional)
  ☐ Email production (opcional)
  ☐ Sentry monitoring (opcional)
  ☐ Google Analytics (opcional)
```

---

## 🎉 DEPLOYMENT COMPLETO!

Seu app está em produção em:
```
🌐 https://xxxxx.vercel.app
```

### Próximos Passos:
1. ✅ Compartilhar link com beta testers
2. ✅ Coletar feedback
3. ✅ Corrigir bugs encontrados
4. ✅ Implementar melhorias
5. ✅ Lançar para produção

---

## 📞 SUPORTE

Se tiver problema:

1. **Verificar Vercel Logs**
   - Dashboard → Deployments → Função → Logs

2. **Verificar Supabase Status**
   - supabase.com/status

3. **Verificar Stripe Status**
   - stripe.com/status

4. **Consultar Documentação**
   - vercel.com/docs
   - supabase.com/docs
   - stripe.com/docs

---

**🚀 Seu app está vivo em produção!**

**Mãos que Constroem v1.0 - Pronto para o mundo! 🌍**
