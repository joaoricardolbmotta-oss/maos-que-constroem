# 🚀 Guia de Deployment no Floot

## Visão Geral
Este projeto Next.js 14 está pronto para ser hospedado em qualquer plataforma que suporte Node.js/Docker, incluindo Floot.

## Requisitos
- Node.js 18+ (Local development)
- Docker & Docker Compose (Para testes locais)
- Floot account (Para deployment)
- Supabase instance (pode ser cloud ou self-hosted)

## Ambiente Local

### 1. Setup inicial
```bash
# Clone o repositório
git clone <repo-url>
cd maos-que-constroem-platform

# Instale dependências
npm install

# Crie arquivo .env.local
cp .env.example .env.local

# Configure as variáveis (edite .env.local)
nano .env.local
```

### 2. Variáveis de Ambiente Necessárias
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-instance.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Desenvolvimento Local
```bash
# Dev server
npm run dev

# Production build local
npm run build
npm start

# Com Docker
docker-compose up --build
```

---

## Deployment no Floot

### Opção 1: Deploy via Docker (Recomendado)

#### 1.1 Prepare o repositório
```bash
# Commits tudo
git add .
git commit -m "prepare: ready for Floot deployment"
git push origin main
```

#### 1.2 No Floot Dashboard
1. Clique em "New Project" > "Deploy from Repository"
2. Selecione seu repositório GitHub
3. Configure build command:
   ```
   npm ci && npm run build
   ```
4. Configure start command:
   ```
   npm start
   ```

#### 1.3 Setup Environment Variables no Floot
```
NEXT_PUBLIC_SUPABASE_URL=seu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-app.floot.dev (seu domain)
NEXT_PUBLIC_API_URL=https://seu-app.floot.dev
```

---

### Opção 2: Deploy com Dockerfile Custom

```bash
# Build localmente
docker build -t maos-que-constroem .

# Test localmente
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  maos-que-constroem

# Push para Floot registry
docker tag maos-que-constroem your-floot-registry/maos-que-constroem:latest
docker push your-floot-registry/maos-que-constroem:latest
```

---

## ✅ Checklist de Deployment

- [ ] Variáveis de ambiente configuradas no Floot
- [ ] Build passa localmente (`npm run build`)
- [ ] Nenhum erro no `npm run lint`
- [ ] Database migrations executadas (se houver)
- [ ] Supabase está acessível da internet
- [ ] CORS configurado no Supabase para o domain do Floot
- [ ] Certificado SSL ativo
- [ ] Healthcheck respondendo (`GET /`)

---

## 🔍 Troubleshooting

### "Cannot find module" error
```bash
# Limpe cache e reinstale
rm -rf node_modules .next
npm ci
npm run build
```

### Environment variables não aparecem
- Verificar se estão configuradas no Floot Dashboard
- Redeploy depois de alterar variáveis
- Verificar logs: `docker logs container-id`

### Build timeout
- Aumente timeout nas configurações do Floot
- Verifique dependências grandes em `node_modules`

### Supabase connection refused
- Verificar CORS settings no Supabase
- Testar conexão localmente primeiro
- Verificar IP whitelist se houver

---

## 📊 Monitoramento

### Logs
```bash
# Floot logs (via CLI ou Dashboard)
floot logs --follow
```

### Health checks
```bash
curl https://seu-app.floot.dev/
```

### Database
- Monitorar quota do Supabase
- Backups automáticos ativados
- Connection pooling configurado

---

## 🔄 Atualizações

```bash
# Fazer update local
git pull origin main
npm install
npm run build

# Push para Floot (auto-redeploy se configurado)
git push origin main
```

---

## 🆘 Support

Para problemas específicos do Floot:
- Documentação: https://floot.dev/docs
- Suporte: support@floot.dev

Para problemas do projeto:
- GitHub Issues: [link do repo]
- Email: dev@maosqueconstroem.org.br
