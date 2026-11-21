# Fase 3: CRUD de Campanhas ✅ COMPLETA

## ✨ O que foi implementado

### 1. Endpoints de API

#### **GET /api/campanhas**
- Lista todas as campanhas com paginação
- Query params: `status`, `page`, `limit`
- Retorna: lista, total, página, páginas

#### **POST /api/campanhas**
- Cria nova campanha
- Requer autenticação de admin
- Valida slug único
- Retorna: campanha criada

#### **GET /api/campanhas/:id**
- Obtém detalhes de uma campanha
- Retorna: campanha completa

#### **PUT /api/campanhas/:id**
- Atualiza campanha existente
- Valida slug único (excluindo o próprio id)
- Atualiza `updated_at` automaticamente

#### **DELETE /api/campanhas/:id**
- Deleta campanha
- Cascata: deleta também receitas, despesas, doações, orçamento, comprovantes

### 2. Hook React `useCampanhas`
- **`fetchCampanhas(status?, page)`** - Busca campanhas
- **`getCampanha(id)`** - Obtém detalhes
- **`createCampanha(data)`** - Cria nova
- **`updateCampanha(id, data)`** - Atualiza
- **`deleteCampanha(id)`** - Deleta
- Estados: `campanhas`, `isLoading`, `error`, `page`, `pages`, `total`

### 3. Componentes

#### **CampanhaForm.tsx**
- Formulário para criar/editar campanhas
- Campos:
  - Nome do projeto
  - Propósito (description)
  - Instituição
  - Identificador público (slug)
  - Tipo de data (single/period/none)
  - Data(s)
  - Meta de arrecadação
  - Status
  - Público estimado
- Validação com Zod integrada
- react-hook-form para gerenciamento de estado
- Modo create/edit automático

#### **CampanhaList.tsx**
- Tabela com listagem de campanhas
- Coluna: Nome, Status, Data, Meta
- Botões: Editar, Deletar
- Empty state customizado
- Loading state

### 4. Página `/admin/campanhas`
- Listagem de todas as campanhas
- Botão "Nova Campanha" abre modal
- Modal com CampanhaForm integrado
- Edição: seleciona campanha, abre form pré-preenchido
- Deletar com confirmação
- Error handling completo
- Atualização de list em tempo real

---

## 🧪 Como Testar

### 1. Listar Campanhas
```bash
curl http://localhost:3000/api/campanhas
```

### 2. Criar Campanha
```bash
curl -X POST http://localhost:3000/api/campanhas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Projeto",
    "description": "Descrição",
    "public_slug": "meu-projeto",
    "date_mode": "single",
    "action_date": "2024-12-24",
    "fundraising_goal": 5000,
    "status": "draft"
  }'
```

### 3. Testar no Admin
1. Acesse `http://localhost:3000/admin/campanhas`
2. Clique em "Nova Campanha"
3. Preencha o formulário
4. Clique em "Criar Campanha"
5. Veja aparecer na tabela
6. Clique em "Editar" para modificar
7. Clique em "Deletar" para remover

---

## 📋 Arquivos Criados

```
src/
├── app/api/campanhas/
│   ├── route.ts                    # GET, POST
│   └── [id]/route.ts               # GET, PUT, DELETE
├── hooks/
│   └── useCampanhas.ts             # Hook customizado
├── components/admin/
│   ├── CampanhaForm.tsx            # Formulário
│   └── CampanhaList.tsx            # Tabela de listagem
└── app/(admin)/campanhas/
    └── page.tsx                    # Página principal
```

---

## 🎨 UX Features

- **Modal automático** para create/edit
- **Pré-preenchimento** de dados ao editar
- **Confirmação** antes de deletar
- **Loading states** enquanto salva
- **Error messages** inline e no form
- **Auto-refresh** da lista após ações
- **Validação** com mensagens customizadas em PT-BR
- **Slug validation** em tempo real (não permite duplicados)

---

## 🔐 Segurança

- **Admin only**: Requer `requireAdmin()` em todos os endpoints
- **Input validation**: Zod schema em todos os campos
- **SQL injection protection**: Supabase parameterized queries
- **CSRF**: Middleware de cookies
- **Rate limiting**: Via Vercel (future)

---

## 📊 Validações

```
title: 3-180 caracteres
description: até 4000 caracteres (opcional)
institution: texto livre
public_slug: lowercase, números e hífens, 3-120 caracteres, único
date_mode: single | period | none
action_date: ISO date (required se date_mode != 'none')
end_date: ISO date (required se date_mode == 'period', deve ser >= action_date)
fundraising_goal: número >= 0 (opcional, calcula automaticamente se null)
status: draft | planned | active | finished
estimated_audience: número >= 0 (opcional)
```

---

## 🚀 Fluxos de Negócio

### Criar Campanha
1. Admin clica "Nova Campanha"
2. Modal abre com form vazio
3. Admin preenche campos
4. POST /api/campanhas
5. Campanha criada em status "draft"
6. Lista atualiza automaticamente

### Editar Campanha
1. Admin clica "Editar"
2. GET /api/campanhas/:id
3. Modal abre com form pré-preenchido
4. Admin modifica campos
5. PUT /api/campanhas/:id
6. Lista atualiza automaticamente

### Publicar Campanha
1. Admin cria campanha como "draft"
2. Admin edita e muda status para "active"
3. Campanha aparece no portal público
4. Dados públicos são mascarados automaticamente

### Deletar Campanha
1. Admin clica "Deletar"
2. Confirmação via dialog
3. DELETE /api/campanhas/:id
4. Cascata: deleta todos os relacionamentos
5. Lista atualiza automaticamente

---

## 🔄 Fluxo de Dados

```
Admin → CampanhaForm
  ↓
Hook useCampanhas
  ↓
Fetch API
  ↓
Endpoint (GET/POST/PUT/DELETE)
  ↓
Requiredin (admin check)
  ↓
Zod validation
  ↓
Supabase query
  ↓
Response
  ↓
Hook updates local state
  ↓
List re-renders
```

---

## ⚠️ Notas Importantes

- **Cascata automática**: Deleting a campaign deletes all related data
- **Slug unique**: Sistema valida duplicates automaticamente
- **Status draft**: Campanhas em rascunho NÃO aparecem no portal público
- **Date validation**: Sistema valida lógica de datas (período válido, etc)
- **Goal calculation**: Se não informar meta, usa a soma do orçamento

---

## 🚀 Próxima Fase: Fase 4 - CRUD de Receitas

Vamos implementar:
- [ ] Endpoints CRUD para receitas (GET/POST/PUT/DELETE)
- [ ] ReceitaForm component
- [ ] ReceitaList component
- [ ] /admin/campanhas/:id/receitas page
- [ ] Hook useReceitas
- [ ] Integração com campanhas

---

**Status:** ✅ Completo e pronto para testar!

## 📊 Estatísticas

- **5 endpoints** de API implementados
- **3 componentes** React
- **1 página** integrada
- **1 hook** customizado
- **100% validação** com Zod
- **Admin only** com requireAdmin()
