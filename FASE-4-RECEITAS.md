# Fase 4: CRUD de Receitas ✅ COMPLETA

## ✨ O que foi implementado

### 1. Endpoints de API

#### **GET /api/campanhas/:campaignId/receitas**
- Lista todas as receitas de uma campanha
- Ordenadas por data descrescente
- Retorna: array de receitas

#### **POST /api/campanhas/:campaignId/receitas**
- Registra nova receita
- Requer autenticação de admin
- Valida campanha existe
- Registra: description, amount, source, donor_name, donor_cpf, receipt_number, receipt_date

#### **GET /api/campanhas/:campaignId/receitas/:id**
- Obtém detalhes de uma receita
- Verifica pertence à campanha correta

#### **PUT /api/campanhas/:campaignId/receitas/:id**
- Atualiza receita existente
- Valida pertence à campanha

#### **DELETE /api/campanhas/:campaignId/receitas/:id**
- Deleta receita
- Valida pertence à campanha correta

### 2. Hook React `useReceitas(campaignId)`
- **`createReceita(data)`** - Registra nova receita
- **`updateReceita(id, data)`** - Atualiza receita
- **`deleteReceita(id)`** - Deleta receita
- Estados: `receitas`, `isLoading`, `error`
- Auto-refresh ao carregar componente

### 3. Componentes

#### **ReceitaForm.tsx**
- Formulário para registrar/editar receitas
- Campos:
  - Descrição (obrigatório)
  - Valor em R$ (obrigatório)
  - Origem (select: doador, anônimo, comércio, governo, instituição, outro)
  - Nome do doador (sera mascarado)
  - CPF do doador (será mascarado)
  - Número do comprovante
  - Data do comprovante (obrigatório)
- Validação com Zod integrada
- Aviso: "Será mascarado na view pública"

#### **ReceitaList.tsx**
- Tabela com listagem de receitas
- Colunas: Descrição, Origem, Doador, Valor, Data, Ações
- Summary card com total arrecadado
- Nomes e CPF já mascarados na visualização
- Botões: Editar, Deletar
- Empty state customizado

### 4. Página `/admin/campanhas/:id/receitas`
- Integração completa com modal
- Botão "Registrar Receita" abre modal
- Link "Voltar para Campanhas"
- Edição: seleciona receita, abre form pré-preenchido
- Deletar com confirmação
- Error handling completo
- Dica: aviso sobre mascaramento de dados

---

## 🧪 Como Testar

### 1. Listar Receitas de Uma Campanha
```bash
curl http://localhost:3000/api/campanhas/CAMPAIGN_ID/receitas
```

### 2. Registrar Receita
```bash
curl -X POST http://localhost:3000/api/campanhas/CAMPAIGN_ID/receitas \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Doação de empresa",
    "amount": 1000,
    "source": "comercio",
    "donor_name": "Empresa LTDA",
    "receipt_date": "2024-01-10"
  }'
```

### 3. Testar no Admin
1. Acesse `/admin/campanhas`
2. Clique em uma campanha para gerenciar
3. Clique em "Registrar Receita"
4. Preencha os campos
5. Clique em "Registrar Receita"
6. Veja aparecer na tabela com total atualizado
7. Teste editar e deletar

---

## 📋 Arquivos Criados

```
src/
├── app/api/campanhas/[campaignId]/
│   └── receitas/
│       ├── route.ts                # GET, POST
│       └── [id]/route.ts           # GET, PUT, DELETE
├── hooks/
│   └── useReceitas.ts              # Hook customizado
├── components/admin/
│   ├── ReceitaForm.tsx             # Formulário
│   └── ReceitaList.tsx             # Tabela de listagem
└── app/(admin)/campanhas/[id]/
    └── receitas/page.tsx           # Página principal
```

---

## 🎨 UX Features

- **Summary card** com total arrecadado
- **Modal automático** para create/edit
- **Pré-preenchimento** de dados ao editar
- **Confirmação** antes de deletar
- **Loading states** enquanto salva
- **Error messages** inline e no form
- **Auto-refresh** da lista após ações
- **Mascaramento automático** na visualização
- **Validação** com mensagens customizadas em PT-BR

---

## 🔐 Segurança

- **Admin only**: Requer `requireAdmin()` em todos os endpoints
- **Campaign validation**: Verifica se receita pertence à campanha
- **Input validation**: Zod schema em todos os campos
- **Privacy masking**: Nomes e CPF mascarados na tabela
- **SQL injection protection**: Supabase parameterized queries

---

## 📊 Validações

```
description: 1-500 caracteres (required)
amount: número >= 0.01 (required)
source: texto livre (required)
donor_name: texto livre (optional)
donor_cpf: formato XXX.XXX.XXX-XX (optional)
receipt_number: texto livre (optional)
receipt_date: ISO date (required)
```

---

## 🚀 Fluxos de Negócio

### Registrar Receita
1. Admin abre campanha
2. Clica "Registrar Receita"
3. Modal abre com form vazio
4. Admin preenche campos
5. POST /api/campanhas/:id/receitas
6. Receita criada
7. Lista atualiza com novo total

### Editar Receita
1. Admin clica "Editar" na tabela
2. Modal abre com form pré-preenchido
3. Admin modifica campos
4. PUT /api/campanhas/:id/receitas/:id
5. Lista atualiza automaticamente

### Ver Receita Pública
1. Dados aparecem em /campanha/:slug
2. Nome e CPF aparecem mascarados
3. Valor e data aparecem completos
4. Total contribui para barra de progresso

---

## 💾 Dados Persistidos

```
receitas {
  id: UUID
  campaign_id: UUID (FK)
  description: string
  amount: decimal
  source: string
  donor_name: string (masked on public)
  donor_cpf: string (masked: ***.***.***-XX)
  receipt_number: string
  receipt_date: date
  created_at: timestamp
  updated_at: timestamp
  created_by: UUID (FK users)
}
```

---

## ⚠️ Notas Importantes

- **Mascaramento**: CPF mostra apenas últimos 2 dígitos na view pública
- **Nome resumido**: "João Silva" vira "João S." na view pública
- **Sem autenticação**: Receitas só aparecem na view pública se campanha é active/finished
- **Total atualizado**: Card de resumo atualiza em tempo real
- **Cascata**: Deletar campanha deleta todas as receitas

---

## 🔄 Fluxo de Dados

```
Admin → ReceitaForm
  ↓
Hook useReceitas
  ↓
Fetch API
  ↓
Endpoint (GET/POST/PUT/DELETE)
  ↓
RequireAdmin (admin check)
  ↓
Zod validation
  ↓
Campaign validation
  ↓
Supabase query
  ↓
Response
  ↓
Hook updates local state
  ↓
List re-renders with summary
  ↓
Public view masks data
```

---

## 🚀 Próxima Fase: Fase 5 & 6 - Despesas e Doações

Vamos implementar (mesma estrutura):
- [ ] Endpoints CRUD para despesas
- [ ] DespesaForm + DespesaList
- [ ] /admin/campanhas/:id/despesas page

E depois:
- [ ] Endpoints CRUD para doações materiais
- [ ] DoacaoForm + DoacaoList
- [ ] /admin/campanhas/:id/doacoes page

---

**Status:** ✅ Completo e pronto para testar!

## 📊 Estatísticas

- **5 endpoints** de API implementados
- **3 componentes** React
- **1 página** integrada
- **1 hook** customizado
- **100% validação** com Zod
- **Admin only** com requireAdmin()
- **Privacy masking** integrado
