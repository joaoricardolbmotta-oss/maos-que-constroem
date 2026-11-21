import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/v1/campanhas/:slug - API Pública para dados da campanha
 * Requer header: X-API-Key
 */
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json({ error: 'API key é obrigatória' }, { status: 401 });
    }

    const supabase = supabaseServer();

    // Busca a campanha pelo slug
    const { data: campaign, error: campaignError } = await supabase
      .from('campanhas')
      .select('*')
      .eq('public_slug', params.slug)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    // Busca dados relacionados
    const [receitas, despesas, doacoes] = await Promise.all([
      supabase
        .from('receitas')
        .select('id, description, amount, source, created_at')
        .eq('campaign_id', campaign.id),
      supabase
        .from('despesas')
        .select('id, description, category, amount, created_at')
        .eq('campaign_id', campaign.id),
      supabase
        .from('doacoes_materiais')
        .select('id, item_name, category, quantity, unit, created_at')
        .eq('campaign_id', campaign.id),
    ]);

    const responseData = {
      campaign: {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        slug: campaign.public_slug,
        status: campaign.status,
        goal: campaign.fundraising_goal,
        created_at: campaign.created_at,
      },
      summary: {
        total_arrecadado: (receitas.data || []).reduce((sum, r) => sum + r.amount, 0),
        total_gasto: (despesas.data || []).reduce((sum, d) => sum + d.amount, 0),
        total_doacoes: (doacoes.data || []).length,
        saldo: (receitas.data || []).reduce((sum, r) => sum + r.amount, 0) -
              (despesas.data || []).reduce((sum, d) => sum + d.amount, 0),
      },
      receitas: receitas.data || [],
      despesas: despesas.data || [],
      doacoes: doacoes.data || [],
      timestamp: new Date().toISOString(),
    };

    // Cache de 5 minutos
    const response = NextResponse.json(responseData, { status: 200 });
    response.headers.set('Cache-Control', 'public, max-age=300');

    return response;
  } catch (error) {
    console.error('Get campaign api error:', error);
    return NextResponse.json({ error: 'Erro ao buscar campanha' }, { status: 500 });
  }
}
