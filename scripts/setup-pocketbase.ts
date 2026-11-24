/**
 * Setup script para criar collections no PocketBase
 *
 * Uso: npx ts-node scripts/setup-pocketbase.ts
 *
 * Este script cria todas as collections necessárias com seus respectivos campos
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

interface CollectionSchema {
  name: string;
  fields: any[];
}

const collections: CollectionSchema[] = [
  // Users
  {
    name: 'users',
    fields: [
      { name: 'email', type: 'email', required: true, unique: true },
      { name: 'name', type: 'text', required: true },
      { name: 'password_hash', type: 'text' },
      { name: 'role', type: 'select', options: { values: ['master', 'admin', 'member'] }, default: 'member' },
      { name: 'is_active', type: 'bool', default: true },
      { name: 'created_at', type: 'autodate', onCreate: true },
      { name: 'updated_at', type: 'autodate', onUpdate: true },
    ],
  },

  // Campanhas
  {
    name: 'campanhas',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'editor' },
      { name: 'institution', type: 'text' },
      { name: 'public_slug', type: 'text', unique: true },
      { name: 'date_mode', type: 'select', options: { values: ['single', 'period'] } },
      { name: 'action_date', type: 'date' },
      { name: 'end_date', type: 'date' },
      { name: 'fundraising_goal', type: 'number' },
      { name: 'status', type: 'select', options: { values: ['active', 'planned', 'completed', 'paused'] }, default: 'planned' },
      { name: 'estimated_audience', type: 'number' },
      { name: 'created_by', type: 'relation', collectionId: 'users' },
      { name: 'created_at', type: 'autodate', onCreate: true },
      { name: 'updated_at', type: 'autodate', onUpdate: true },
    ],
  },

  // Receitas (Income)
  {
    name: 'receitas',
    fields: [
      { name: 'campaign_id', type: 'relation', collectionId: 'campanhas', required: true },
      { name: 'description', type: 'text', required: true },
      { name: 'amount', type: 'number', required: true },
      { name: 'source', type: 'select', options: { values: ['doador-anônimo', 'comercio', 'stripe', 'banco'] } },
      { name: 'donor_name', type: 'text' },
      { name: 'donor_cpf', type: 'text' },
      { name: 'donor_email', type: 'email' },
      { name: 'receipt_number', type: 'text' },
      { name: 'receipt_date', type: 'date' },
      { name: 'created_by', type: 'relation', collectionId: 'users' },
      { name: 'created_at', type: 'autodate', onCreate: true },
      { name: 'updated_at', type: 'autodate', onUpdate: true },
    ],
  },

  // Despesas (Expenses)
  {
    name: 'despesas',
    fields: [
      { name: 'campaign_id', type: 'relation', collectionId: 'campanhas', required: true },
      { name: 'description', type: 'text', required: true },
      { name: 'category', type: 'select', options: { values: ['alimentacao', 'higiene', 'brinquedos', 'transporte', 'outros'] } },
      { name: 'amount', type: 'number', required: true },
      { name: 'expense_date', type: 'date' },
      { name: 'vendor_name', type: 'text' },
      { name: 'created_by', type: 'relation', collectionId: 'users' },
      { name: 'created_at', type: 'autodate', onCreate: true },
      { name: 'updated_at', type: 'autodate', onUpdate: true },
    ],
  },

  // Doacoes (Donations)
  {
    name: 'doacoes',
    fields: [
      { name: 'campaign_id', type: 'relation', collectionId: 'campanhas', required: true },
      { name: 'donor_name', type: 'text', required: true },
      { name: 'donor_email', type: 'email' },
      { name: 'donor_cpf', type: 'text' },
      { name: 'amount', type: 'number', required: true },
      { name: 'status', type: 'select', options: { values: ['pending', 'completed', 'failed', 'refunded'] }, default: 'pending' },
      { name: 'payment_method', type: 'select', options: { values: ['pix', 'cartao', 'boleto', 'transferencia'] } },
      { name: 'transaction_id', type: 'text' },
      { name: 'created_at', type: 'autodate', onCreate: true },
      { name: 'updated_at', type: 'autodate', onUpdate: true },
    ],
  },

  // Orcamento Itens
  {
    name: 'orcamento_itens',
    fields: [
      { name: 'campaign_id', type: 'relation', collectionId: 'campanhas', required: true },
      { name: 'name', type: 'text', required: true },
      { name: 'category', type: 'text' },
      { name: 'quantity', type: 'number' },
      { name: 'unit_value', type: 'number' },
      { name: 'planned_total', type: 'number' },
      { name: 'sort_order', type: 'number', default: 0 },
      { name: 'created_at', type: 'autodate', onCreate: true },
      { name: 'updated_at', type: 'autodate', onUpdate: true },
    ],
  },

  // Comprovantes (Proof/Receipts)
  {
    name: 'comprovantes',
    fields: [
      { name: 'entity_type', type: 'text', required: true },
      { name: 'entity_id', type: 'text', required: true },
      { name: 'file_path', type: 'file' },
      { name: 'description', type: 'text' },
      { name: 'created_at', type: 'autodate', onCreate: true },
    ],
  },

  // Membros
  {
    name: 'membros',
    fields: [
      { name: 'campaign_id', type: 'relation', collectionId: 'campanhas', required: true },
      { name: 'user_id', type: 'relation', collectionId: 'users', required: true },
      { name: 'role', type: 'select', options: { values: ['admin', 'member', 'volunteer'] }, default: 'member' },
      { name: 'created_at', type: 'autodate', onCreate: true },
    ],
  },

  // API Keys
  {
    name: 'api_keys',
    fields: [
      { name: 'user_id', type: 'relation', collectionId: 'users', required: true },
      { name: 'name', type: 'text', required: true },
      { name: 'key_prefix', type: 'text', unique: true },
      { name: 'key_hash', type: 'text' },
      { name: 'scopes', type: 'json' },
      { name: 'active', type: 'bool', default: true },
      { name: 'last_used_at', type: 'date' },
      { name: 'created_at', type: 'autodate', onCreate: true },
      { name: 'updated_at', type: 'autodate', onUpdate: true },
    ],
  },
];

async function setupCollections() {
  try {
    // Autentique como admin
    console.log('🔐 Autenticando como admin...');
    await pb.admins.authWithPassword('admin@localhost', 'admin123');
    console.log('✅ Autenticado!\n');

    // Crie cada collection
    for (const collection of collections) {
      try {
        await pb.collections.create(collection as any);
        console.log(`✅ Collection criada: ${collection.name}`);
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          console.log(`⏭️  Collection já existe: ${collection.name}`);
        } else {
          console.error(`❌ Erro ao criar ${collection.name}:`, error.message);
        }
      }
    }

    console.log('\n✨ Setup completo!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Acesse: http://localhost:8090/_/');
    console.log('2. Verifique as collections criadas');
    console.log('3. Configure permissões e regras de acesso');
    console.log('4. Importe dados existentes (se houver)');

  } catch (error) {
    console.error('❌ Erro durante setup:', error);
    process.exit(1);
  }
}

setupCollections();
