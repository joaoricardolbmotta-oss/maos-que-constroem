import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/dashboard/activity - Atividades recentes de todas as campanhas
 */
export async function GET(request: Request) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();
    const limit = 20;

    // Busca receitas recentes
    const { data: recentReceitas = [] } = await supabase
      .from('receitas')
      .select('id, description, amount, campaign_id, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Busca despesas recentes
    const { data: recentDespesas = [] } = await supabase
      .from('despesas')
      .select('id, description, amount, campaign_id, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Busca doações recentes
    const { data: recentDoacoes = [] } = await supabase
      .from('doacoes_materiais')
      .select('id, item_name, quantity, campaign_id, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Mescla e ordena por data
    const activities = [
      ...recentReceitas.map((r) => ({
        id: `receita-${r.id}`,
        type: 'receita',
        title: `Doação de R$ ${r.amount.toFixed(2)}`,
        description: r.description,
        campaignId: r.campaign_id,
        timestamp: r.created_at,
      })),
      ...recentDespesas.map((d) => ({
        id: `despesa-${d.id}`,
        type: 'despesa',
        title: `Gasto de R$ ${d.amount.toFixed(2)}`,
        description: d.description,
        campaignId: d.campaign_id,
        timestamp: d.created_at,
      })),
      ...recentDoacoes.map((d) => ({
        id: `doacao-${d.id}`,
        type: 'doacao',
        title: `Doação de ${d.quantity} ${d.item_name}`,
        description: d.item_name,
        campaignId: d.campaign_id,
        timestamp: d.created_at,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    console.error('Get activity error:', error);
    return NextResponse.json({ error: 'Erro ao buscar atividades' }, { status: 500 });
  }
}
