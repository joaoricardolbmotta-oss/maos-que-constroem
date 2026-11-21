# Pedido: cadastro de novos projetos (campanhas) — Mãos que Constroem

App publicado: https://maos-que-constroem.floot.app (Floot, Instituto Joanna de Ângelis).
Hoje o app cuida de uma única campanha: "Ação 01 · 24/10/2026". O objetivo (item 10 do escopo) é que o app vire uma ferramenta replicável para várias campanhas.

## O que construir

### 1. Cadastro de projetos/campanhas (Área administrativa)
Tela "Projetos" na Administração para listar, criar, editar e arquivar projetos. Campos:
- Nome do projeto
- Propósito / descrição (texto da apresentação institucional da campanha)
- Instituição responsável (padrão: Instituto Joanna de Ângelis)
- Meta de arrecadação (R$)
- Tipo de data:
  - Data única (ex.: ação de 24/10/2026)
  - Período (data de início e data de fim)
  - Sem data definida
- Status: rascunho, ativo (aparece no portal público) ou encerrado
- Identificador curto para o link público (ex.: `/acao-01`)
- Imagem de capa (opcional)

### 2. Prestação de contas por projeto
Tudo o que existe hoje passa a pertencer a um projeto:
- Receitas: descrição, valor, data, origem, comprovante
- Despesas: descrição, valor, data, categoria/finalidade, comprovante
- Doações materiais: alimentos, higiene, roupas, brinquedos, outros
- Orçamento por item (o "orçamento previsto")
- Comprovantes (central de documentos)

Na Administração, um seletor de projeto define em qual projeto se está lançando.

### 3. Portal público por projeto
- Página inicial lista os projetos ativos e os encerrados.
- Cada projeto tem a própria página: total arrecadado, despesas, saldo, progresso em relação à meta, orçamento por item, itens arrecadados e comprovantes.
- Acesso sem login, como hoje.

### 4. Migração sem perda de dados
- Criar o projeto "Ação 01" com os dados atuais (data 24/10/2026, orçamento previsto R$ 4.048,00) e vincular a ele todas as receitas, despesas, doações materiais e comprovantes que já existem.
- O link atual tem que continuar funcionando.
- Criar um checkpoint antes de qualquer mudança no banco.

## Regras que não podem mudar (escopo, itens 3.5 e 5)
- Nomes abreviados nos comprovantes públicos
- CPF mostrando no máximo os 3 últimos dígitos
- Proteção de dados pessoais também nas imagens dos comprovantes
- Funções administrativas separadas da consulta pública
- Registros íntegros: nada de apagar lançamentos ao migrar

## Entrega
Testar na pré-visualização. Publicar só depois do OK do usuário.
