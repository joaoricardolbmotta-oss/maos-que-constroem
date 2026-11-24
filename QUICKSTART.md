# ⚡ QuickStart: PocketBase Setup

Instruções rápidas para setup e teste local.

## 🚀 Setup em 5 minutos

### 1️⃣ Inicie os containers

```bash
docker-compose up --build
```

Aguarde até ver:
```
pocketbase | Server started at http://0.0.0.0:8090
app       | ready - started server on 0.0.0.0:3000
```

### 2️⃣ Acesse PocketBase Admin

```
http://localhost:8090/_/
```

**Login:**
- Email: `admin@localhost`
- Password: `admin123`

### 3️⃣ Crie as Collections

#### Opção A: Manual (UI)
1. Clique em "Create collection"
2. Configure cada uma conforme MIGRATION_POCKETBASE.md

#### Opção B: Automático (Script)
```bash
# Terminal novo
npm run setup:pocketbase
```

### 4️⃣ Teste a App

```
http://localhost:3000
```

---

## 📚 Collections Criadas

✅ **users** - Usuários e autenticação  
✅ **campanhas** - Campanhas/Projetos  
✅ **receitas** - Receitas/Doações  
✅ **despesas** - Despesas  
✅ **doacoes** - Histórico de doações  
✅ **orcamento_itens** - Orçamento  
✅ **comprovantes** - Arquivos/Provas  
✅ **membros** - Membros da equipe  
✅ **api_keys** - Chaves de API  

---

## 🔐 Configurar Permissões

No Admin UI, para cada collection:

1. Vá para "Rules"
2. Configure acesso público se necessário
3. Salve

**Recomendado:**
- `users`: Apenas admin pode ler tudo (auth protege)
- `campanhas`: Público lê, apenas membros escrevem
- `receitas`: Público lê, apenas admin escreve
- `doacoes`: Público cria (doação), admin lê

---

## 📡 Testar API

### Listar campanhas
```bash
curl http://localhost:8090/api/collections/campanhas/records
```

### Criar campanha
```bash
curl -X POST http://localhost:8090/api/collections/campanhas/records \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste",
    "description": "Campanha de teste",
    "institution": "Instituto X",
    "public_slug": "teste",
    "date_mode": "single",
    "action_date": "2026-12-01",
    "status": "planned"
  }'
```

---

## ✅ Checklist

- [ ] Containers rodando (`docker-compose up`)
- [ ] PocketBase Admin acessível (http://localhost:8090/_/)
- [ ] Collections criadas
- [ ] App rodando (http://localhost:3000)
- [ ] API respondendo
- [ ] Permissões configuradas

---

## 🆘 Troubleshooting

### "Connection refused"
```bash
# Aguarde PocketBase iniciar (~10s)
docker-compose logs pocketbase
```

### "Admin login failed"
```bash
# Reset admin
docker-compose restart pocketbase
# Default credentials: admin@localhost / admin123
```

### "Cannot connect to app"
```bash
# Aguarde build terminar
docker-compose logs app
```

---

## 🎯 Próximas etapas

1. ✅ Setup local (agora)
2. 📝 Adaptar código Next.js (usar lib/pocketbase-client.ts)
3. 🧪 Testar funcionalidades
4. 🚀 Deploy no Floot

---

**Perguntas?** Veja MIGRATION_POCKETBASE.md para detalhes completos.
