import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/dashboard/stats - Estatísticas globais
 */
export async function GET(_request: Request) {
  try {
    await requireAdmin();

    import pb from '@/lib/pocketbase';
  // TODO: Migrate to PocketBase

    // Busca todas as campanhas
    const { data: campanhas = [] } = await supabase.from('campanhas').select('*');

    // Busca todas as receitas
    const { data: receitas = [] } = await supabase.from('receitas').select('*');

    // Busca todas as despesas
    const { data: despesas = [] } = await supabase.from('despesas').select('*');

    // Busca todas as doações
    const { data: doacoes = [] } = await supabase.from('doacoes_materiais').select('*');

    // Calcula estatísticas
    const stats = {
      campanhas: {
        total: (campanhas || []).length,
        ativas: (campanhas || []).filter((c) => c.status === 'active').length,
        planejadas: (campanhas || []).filter((c) => c.status === 'planned').length,
        rascunhos: (campanhas || []).filter((c) => c.status === 'draft').length,
      },
      receitas: {
        total: (receitas || []).length,
        totalArrecadado: (receitas || []).reduce((sum, r) => sum + r.amount, 0),
        mediaDoacao: (receitas || []).length > 0 ? (receitas || []).reduce((sum, r) => sum + r.amount, 0) / (receitas || []).length : 0,
      },
      despesas: {
        total: (despesas || []).length,
        totalGasto: (despesas || []).reduce((sum, d) => sum + d.amount, 0),
        mediaGasto: (despesas || []).length > 0 ? (despesas || []).reduce((sum, d) => sum + d.amount, 0) / (despesas || []).length : 0,
      },
      doacoes: {
        total: (doacoes || []).length,
        categorias: Array.from(new Set((doacoes || []).map((d) => d.category))).length,
      },
      saldo: (receitas || []).reduce((sum, r) => sum + r.amount, 0) - (despesas || []).reduce((sum, d) => sum + d.amount, 0),
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }
}
