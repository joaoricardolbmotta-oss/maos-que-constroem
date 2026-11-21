# Documentação de API - Mãos que Constroem

## Autenticação

### POST /api/auth/login

Faz login e retorna JWT token.

**Body:**
```json
{
  "email": "admin@institute.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@institute.com",
    "name": "Admin Master",
    "role": "master"
  }
}
```

**Errors:**
- 401: Email ou senha inválidos
- 400: Email ou senha inválidos (vazio)

---

### POST /api/auth/logout

Faz logout (limpa sessão).

**Response (200):**
```json
{
  "success": true
}
```

---

### GET /api/auth/me

Retorna dados do usuário logado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@institute.com",
    "name": "Admin Master",
    "role": "master",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Errors:**
- 401: Não autenticado

---

## Campanhas

### GET /api/campanhas

Lista todas as campanhas (admin only).

**Query Parameters:**
- `status` (opcional): `draft|planned|active|finished`
- `page` (opcional): número da página (padrão: 1)
- `limit` (opcional): itens por página (padrão: 10)

**Response (200):**
```json
{
  "campanhas": [
    {
      "id": "uuid",
      "title": "Ação 01",
      "description": "Campanha de natal",
      "institution": "Instituto Joanna de Ângelis",
      "public_slug": "acao-01",
      "date_mode": "single",
      "action_date": "2024-12-24",
      "end_date": null,
      "fundraising_goal": 5000.00,
      "status": "active",
      "estimated_audience": 100,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z",
      "created_by": "uuid"
    }
  ],
  "total": 15,
  "page": 1,
  "pages": 2
}
```

**Errors:**
- 401: Não autenticado
- 403: Sem permissão

---

### POST /api/campanhas

Cria uma nova campanha.

**Body:**
```json
{
  "title": "Ação 02 - Natal Solidário",
  "description": "Campanha de arrecadação para natal",
  "institution": "Instituto Joanna de Ângelis",
  "public_slug": "acao-02-natal",
  "date_mode": "period",
  "action_date": "2024-12-01",
  "end_date": "2024-12-24",
  "fundraising_goal": 10000.00,
  "status": "planned",
  "estimated_audience": 500
}
```

**Response (201):**
```json
{
  "campanha": {
    "id": "uuid",
    "title": "Ação 02 - Natal Solidário",
    ...
  }
}
```

**Errors:**
- 400: Validação falhou (slug duplicado, data inválida, etc)
- 401: Não autenticado
- 403: Sem permissão

---

### GET /api/campanhas/:id

Retorna detalhes de uma campanha (admin view - sem mascaramento).

**Response (200):**
```json
{
  "campanha": { ... }
}
```

**Errors:**
- 404: Campanha não encontrada
- 401: Não autenticado

---

### PUT /api/campanhas/:id

Atualiza uma campanha.

**Body:** Mesmo formato de criação, campos opcionais

**Response (200):**
```json
{
  "campanha": { ... }
}
```

**Errors:**
- 400: Validação falhou
- 404: Campanha não encontrada
- 401: Não autenticado

---

### DELETE /api/campanhas/:id

Deleta uma campanha (soft delete).

**Response (200):**
```json
{
  "success": true
}
```

**Errors:**
- 404: Campanha não encontrada
- 401: Não autenticado

---

## Receitas

### GET /api/campanhas/:campaignId/receitas

Lista receitas de uma campanha.

**Response (200):**
```json
{
  "receitas": [
    {
      "id": "uuid",
      "campaign_id": "uuid",
      "description": "Doação anônima",
      "amount": 500.00,
      "source": "doador-anônimo",
      "donor_name": "João Silva",
      "donor_cpf": "123.456.789-10",
      "receipt_number": "REC-001",
      "receipt_date": "2024-01-10",
      "created_at": "2024-01-10T00:00:00Z",
      "created_by": "uuid"
    }
  ]
}
```

---

### POST /api/campanhas/:campaignId/receitas

Registra uma nova receita.

**Body:**
```json
{
  "description": "Doação de empresa",
  "amount": 1000.00,
  "source": "comercio",
  "donor_name": "Empresa LTDA",
  "donor_cpf": null,
  "receipt_number": "REC-002",
  "receipt_date": "2024-01-15"
}
```

**Response (201):**
```json
{
  "receita": { ... }
}
```

---

### PUT /api/campanhas/:campaignId/receitas/:id

Atualiza uma receita.

---

### DELETE /api/campanhas/:campaignId/receitas/:id

Deleta uma receita.

---

## Despesas

### GET /api/campanhas/:campaignId/despesas

Lista despesas.

**Response (200):**
```json
{
  "despesas": [
    {
      "id": "uuid",
      "campaign_id": "uuid",
      "description": "Alimentos para distribuição",
      "category": "alimentacao",
      "amount": 2000.00,
      "expense_date": "2024-01-10",
      "vendor_name": "Fornecedor XYZ",
      "created_at": "2024-01-10T00:00:00Z",
      "created_by": "uuid"
    }
  ]
}
```

---

### POST /api/campanhas/:campaignId/despesas

Registra nova despesa.

**Body:**
```json
{
  "description": "Compra de alimentos",
  "category": "alimentacao",
  "amount": 1500.00,
  "expense_date": "2024-01-15",
  "vendor_name": "Mercado ABC"
}
```

---

### PUT /api/campanhas/:campaignId/despesas/:id

Atualiza uma despesa.

---

### DELETE /api/campanhas/:campaignId/despesas/:id

Deleta uma despesa.

---

## Doações Materiais

### GET /api/campanhas/:campaignId/doacoes

Lista doações materiais.

---

### POST /api/campanhas/:campaignId/doacoes

Registra doação material.

**Body:**
```json
{
  "item_name": "Arroz",
  "category": "alimentos",
  "quantity": 50,
  "unit": "kg",
  "donor_name": "João Silva",
  "donor_cpf": "123.456.789-10",
  "received_date": "2024-01-15"
}
```

---

### PUT /api/campanhas/:campaignId/doacoes/:id

Atualiza doação.

---

### DELETE /api/campanhas/:campaignId/doacoes/:id

Deleta doação.

---

## Orçamento

### GET /api/campanhas/:campaignId/orcamento

Lista itens de orçamento.

---

### POST /api/campanhas/:campaignId/orcamento

Adiciona item de orçamento.

**Body:**
```json
{
  "name": "Alimentos para ceia",
  "category": "alimentacao",
  "quantity": 100,
  "unit_value": 50.00
}
```

---

### PUT /api/campanhas/:campaignId/orcamento/:id

Atualiza item.

---

### DELETE /api/campanhas/:campaignId/orcamento/:id

Deleta item.

---

## Comprovantes

### GET /api/campanhas/:campaignId/comprovantes

Lista comprovantes.

---

### POST /api/campanhas/:campaignId/comprovantes

Faz upload de comprovante.

**Body:** FormData
- `file`: File (imagem, PDF, etc)
- `type`: string (`receita|despesa|doacao|general`)

**Response (201):**
```json
{
  "comprovante": {
    "id": "uuid",
    "file_name": "comprovante-001.jpg",
    "storage_url": "https://...",
    "has_personal_data": true,
    "masking_status": "pending"
  }
}
```

---

### GET /api/comprovantes/:id/download

Faz download de comprovante.

**Response:** File (octet-stream ou imagem)

---

### DELETE /api/campanhas/:campaignId/comprovantes/:id

Deleta comprovante.

---

## Relatórios Públicos

### GET /api/relatorios/:campaignSlug

Retorna sumário público de uma campanha (dados mascarados).

**Response (200):**
```json
{
  "campanha": {
    "id": "uuid",
    "title": "Ação 01",
    "description": "...",
    "public_slug": "acao-01",
    "fundraising_goal": 5000.00,
    "status": "active"
  },
  "totals": {
    "receitas": 2500.00,
    "despesas": 1000.00,
    "saldo": 1500.00,
    "goal": 5000.00,
    "progresso": 50
  },
  "orcamento": [
    {
      "name": "Alimentos",
      "planned_total": 2000.00,
      "arrecadado": 1000.00,
      "progresso": 50
    }
  ],
  "receitas": [
    {
      "description": "Doação anônima",
      "amount": 500.00,
      "donor_name": "João S.",
      "donor_cpf": "***.***.***-10",
      "receipt_date": "2024-01-10"
    }
  ],
  "despesas": [ ... ],
  "doacoes": [ ... ],
  "comprovantes": [ ... ]
}
```

**Errors:**
- 404: Campanha não encontrada
- 403: Campanha em rascunho (não publicada)

---

## Códigos de Erro

- **400:** Bad Request - Validação falhou
- **401:** Unauthorized - Não autenticado
- **403:** Forbidden - Sem permissão
- **404:** Not Found - Recurso não encontrado
- **409:** Conflict - Slug duplicado, etc
- **500:** Internal Server Error - Erro do servidor

---

## Rate Limiting

- Login: 5 tentativas por 15 minutos
- Geral: 100 requests por minuto por usuário

---

## Headers Obrigatórios

```
Content-Type: application/json
Authorization: Bearer <token>
```

---

## Autenticação com JWT

Tokens JWT são retornados no login e devem ser inclusos em toda request subsequente:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  https://api.example.com/api/campanhas
```

Cookies HttpOnly também são suportados (Supabase Auth padrão).
