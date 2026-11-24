# 🔄 Migração: Supabase → PocketBase

## 📋 Overview
Este guia mostra como migrar do Supabase para PocketBase mantendo toda a funcionalidade.

**Tempo estimado:** 1-2 dias  
**Risco:** Baixo (mantém API semelhante)  
**Benefício:** Zero custos, controle total

---

## 🎯 O que muda

| Aspecto | Supabase | PocketBase |
|--------|----------|-----------|
| Banco | PostgreSQL Cloud | SQLite + PostgreSQL (opcional) |
| Auth | Supabase Auth | PocketBase Auth |
| Real-time | Supabase Realtime | PocketBase Realtime |
| Storage | S3 Supabase | Filesystem local |
| Admin | Web UI | PocketBase Admin UI |
| Custo | ~$25-100/mês | ~$5-10/mês (hospedagem) |

---

## 📚 Tabelas para Migrar

As seguintes tabelas precisam ser recriadas no PocketBase:

```
- users (perfil do usuário)
- campanhas (campanhas/projetos)
- receitas (receitas/doações)
- despesas (despesas)
- orcamento_itens (orçamento)
- comprovantes (uploads de arquivos)
- doacoes (histórico de doações)
- membros (membros da equipe)
- api_keys (chaves de API)
```

---

## 🚀 Passo 1: Setup PocketBase Local

### 1.1 Instale o PocketBase

```bash
# Option A: Docker (Recomendado)
docker-compose up pocketbase

# Option B: Binário standalone
# Download em: https://github.com/pocketbase/pocketbase/releases

# Option C: Build from source
git clone https://github.com/pocketbase/pocketbase
cd pocketbase && go build
```

### 1.2 Acesse Admin UI

```
http://localhost:8090/_/
```

### 1.3 Crie conta admin
- Email: admin@localhost
- Password: admin123 (mude depois!)

---

## 🔧 Passo 2: Setup Collections (Tabelas)

### 2.1 Crie Users Collection

```json
{
  "id": "id",
  "name": "users",
  "type": "base",
  "system": false,
  "fields": [
    {
      "name": "email",
      "type": "email",
      "required": true,
      "unique": true
    },
    {
      "name": "name",
      "type": "text",
      "required": true
    },
    {
      "name": "password_hash",
      "type": "text"
    },
    {
      "name": "role",
      "type": "select",
      "options": {
        "values": ["master", "admin", "member"]
      },
      "default": "member"
    },
    {
      "name": "is_active",
      "type": "bool",
      "default": true
    },
    {
      "name": "created_at",
      "type": "autodate",
      "onCreate": true
    },
    {
      "name": "updated_at",
      "type": "autodate",
      "onUpdate": true
    }
  ]
}
```

### 2.2 Crie outras collections

Similar ao users, crie:
- **campanhas** (title, description, status, etc)
- **receitas** (campaign_id, amount, source, etc)
- **despesas** (campaign_id, amount, category, etc)
- **comprovantes** (entity_type, entity_id, file_path)

---

## 🔐 Passo 3: Setup Autenticação

### 3.1 Habilite Auth via Email/Password

No Admin UI:
1. Vá para Settings → Users
2. Enable "Allow users to sign up"
3. Configure email sender

### 3.2 Setup JWT

```bash
# Gere uma secret key
openssl rand -base64 32
```

Salve em `.env`:
```
PB_ENCRYPTION_KEY=seu_key_gerado
```

---

## 💾 Passo 4: Migre Dados

### 4.1 Export do Supabase

```bash
# Usando pgdump
pg_dump -h db.supabase.co -U postgres \
  --data-only --inserts \
  -d postgres > backup.sql
```

### 4.2 Transform para PocketBase

```bash
# Script auxiliar (criar em scripts/migrate.js)
const pb = require('pocketbase/cjs');

async function migrate() {
  // Conecte ao PocketBase local
  const client = new pb.Client('http://localhost:8090');
  
  // Autentique como admin
  await client.admins.authWithPassword('admin@localhost', 'admin123');
  
  // Importe dados (exemplo para campanhas)
  const campanhas = require('./data/campanhas.json');
  
  for (const c of campanhas) {
    await client.collection('campanhas').create(c);
  }
  
  console.log('✅ Migração completa!');
}

migrate().catch(console.error);
```

---

## 📝 Passo 5: Atualize o Código

### 5.1 Instale SDK PocketBase

```bash
npm install pocketbase
```

### 5.2 Crie novo cliente (lib/pocketbase.ts)

```typescript
import PocketBase from 'pocketbase';

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
);

export default pb;
```

### 5.3 Atualize imports

**Antes (Supabase):**
```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
```

**Depois (PocketBase):**
```typescript
import pb from '@/lib/pocketbase';
```

### 5.4 Adapte queries

**Antes:**
```typescript
const { data } = await supabase
  .from('campanhas')
  .select('*')
  .eq('id', id);
```

**Depois:**
```typescript
const data = await pb.collection('campanhas').getOne(id);
```

---

## ✅ Checklist de Migração

- [ ] PocketBase rodando localmente
- [ ] Todas as collections criadas
- [ ] Admin account configurada
- [ ] Dados migrados do Supabase
- [ ] SDK PocketBase instalado
- [ ] Código Next.js adaptado
- [ ] Autenticação testada
- [ ] Real-time testado
- [ ] Variáveis de ambiente atualizadas
- [ ] Build local passa
- [ ] Docker-compose funciona
- [ ] Ready para Floot!

---

## 🚀 Passo 6: Deploy no Floot

```bash
# 1. Commit changes
git add .
git commit -m "migrate: Supabase to PocketBase"

# 2. Push para Floot
git push origin main

# 3. No Floot dashboard:
# - Build: npm ci && npm run build
# - Start: npm start
# - Env vars: NEXT_PUBLIC_POCKETBASE_URL=https://seu-domain.floot.dev/pb
```

---

## 🔗 PocketBase Admin URLs

- **Local:** http://localhost:8090/_/
- **Floot:** https://seu-app.floot.dev/pb/_/

---

## ❓ FAQ

**P: Preciso manter os dados do Supabase?**  
R: Não, PocketBase é novo. Se quiser, faça export via pgdump antes.

**P: Real-time funciona igual?**  
R: Sim, PocketBase tem subscriptions nativas. API é compatível.

**P: Posso voltar para Supabase depois?**  
R: Sim, mas teria que re-migrar dados. Recomendo ficar no PocketBase.

**P: E arquivos/Storage?**  
R: PocketBase armazena localmente. Para S3, configure no docker-compose.

---

## 📞 Support

- PocketBase Docs: https://pocketbase.io/docs/
- Comunidade: https://github.com/pocketbase/pocketbase/discussions
