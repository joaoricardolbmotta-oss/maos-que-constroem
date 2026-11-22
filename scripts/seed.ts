/**
 * Seed script para popular banco de dados com dados iniciais
 * Execute com: npm run db:seed
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // 1. Create admin user
    console.log('📝 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email: 'admin@institute.com',
          password_hash: hashedPassword,
          name: 'Admin Master',
          role: 'master',
          is_active: true,
        },
      ])
      .select();

    if (userError) {
      console.error('Error creating user:', userError);
      // Might already exist
    } else {
      console.log('✅ Admin user created:', userData?.[0]?.email);
    }

    // 2. Create sample campaigns
    console.log('📝 Creating sample campaigns...');

    const campaigns = [
      {
        title: 'Ação 01',
        description: 'Primeira campanha de teste',
        institution: 'Instituto Joanna de Ângelis',
        public_slug: 'acao-01',
        date_mode: 'single',
        action_date: '2024-10-24',
        end_date: null,
        fundraising_goal: 5000.0,
        status: 'active',
        estimated_audience: 100,
        created_by: userData?.[0]?.id,
      },
      {
        title: 'Natal Solidário 2024',
        description: 'Campanha de natal para distribuição de presentes',
        institution: 'Instituto Joanna de Ângelis',
        public_slug: 'natal-solidario-2024',
        date_mode: 'period',
        action_date: '2024-12-01',
        end_date: '2024-12-24',
        fundraising_goal: 10000.0,
        status: 'planned',
        estimated_audience: 500,
        created_by: userData?.[0]?.id,
      },
    ];

    const { data: campaignsData, error: campaignsError } = await supabase
      .from('campanhas')
      .insert(campaigns)
      .select();

    if (campaignsError) {
      console.error('Error creating campaigns:', campaignsError);
    } else {
      console.log('✅ Campaigns created:', campaignsData?.length);

      // 3. Create sample receitas (income)
      console.log('📝 Creating sample receitas...');

      if (campaignsData && campaignsData.length > 0) {
        const receitas = [
          {
            campaign_id: campaignsData[0].id,
            description: 'Doação de empresa',
            amount: 1000.0,
            source: 'comercio',
            donor_name: 'Empresa LTDA',
            donor_cpf: null,
            receipt_number: 'REC-001',
            receipt_date: '2024-01-10',
            created_by: userData?.[0]?.id,
          },
          {
            campaign_id: campaignsData[0].id,
            description: 'Doação anônima',
            amount: 500.0,
            source: 'doador-anônimo',
            donor_name: null,
            donor_cpf: null,
            receipt_number: 'REC-002',
            receipt_date: '2024-01-11',
            created_by: userData?.[0]?.id,
          },
        ];

        const { data: receitasData, error: receitasError } = await supabase
          .from('receitas')
          .insert(receitas)
          .select();

        if (receitasError) {
          console.error('Error creating receitas:', receitasError);
        } else {
          console.log('✅ Receitas created:', receitasData?.length);
        }

        // 4. Create sample despesas (expenses)
        console.log('📝 Creating sample despesas...');

        const despesas = [
          {
            campaign_id: campaignsData[0].id,
            description: 'Alimentos para distribuição',
            category: 'alimentacao',
            amount: 800.0,
            expense_date: '2024-01-15',
            vendor_name: 'Mercado ABC',
            created_by: userData?.[0]?.id,
          },
        ];

        const { data: despesasData, error: despesasError } = await supabase
          .from('despesas')
          .insert(despesas)
          .select();

        if (despesasError) {
          console.error('Error creating despesas:', despesasError);
        } else {
          console.log('✅ Despesas created:', despesasData?.length);
        }

        // 5. Create sample budget items
        console.log('📝 Creating sample budget items...');

        const orcamentoItens = [
          {
            campaign_id: campaignsData[0].id,
            name: 'Alimentos',
            category: 'alimentacao',
            quantity: 100,
            unit_value: 20.0,
            planned_total: 2000.0,
            sort_order: 1,
          },
          {
            campaign_id: campaignsData[0].id,
            name: 'Higiene e Limpeza',
            category: 'higiene',
            quantity: 50,
            unit_value: 30.0,
            planned_total: 1500.0,
            sort_order: 2,
          },
          {
            campaign_id: campaignsData[0].id,
            name: 'Brinquedos',
            category: 'brinquedos',
            quantity: 25,
            unit_value: 50.0,
            planned_total: 1250.0,
            sort_order: 3,
          },
        ];

        const { data: orcamentoData, error: orcamentoError } = await supabase
          .from('orcamento_itens')
          .insert(orcamentoItens)
          .select();

        if (orcamentoError) {
          console.error('Error creating budget items:', orcamentoError);
        } else {
          console.log('✅ Budget items created:', orcamentoData?.length);
        }
      }
    }

    console.log('\n✨ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

seed();
