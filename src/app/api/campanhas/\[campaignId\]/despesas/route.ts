import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { despesaSchema } from '@/lib/validators';

/**
 * GET /api/campanhas/:campaignId/despesas - Lista despesas
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('despesas')
      .select('*')
      .eq('campaign_id', params.campaignId)
      .order('expense_date', { ascending: false })
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ despesas: data }, { status: 200 });
  } catch (error) {
    console.error('Get despesas error:', error);
    return NextResponse.json({ error: 'Erro ao buscar despesas' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas/:campaignId/despesas - Criar despesa
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = despesaSchema.parse(body);

    const supabase = supabaseServer();

    // Verifica se campanha existe
    const { data: campaign } = await supabase
      .from('campanhas')
      .select('id')
      .eq('id', params.campaignId)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    // Cria despesa
    const { data: despesa, error } = await supabase
      .from('despesas')
      .insert([
        {
          campaign_id: params.campaignId,
          description: data.description,
          category: data.category,
          amount: data.amount,
          expense_date: data.expense_date,
          vendor_name: data.vendor_name || null,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ despesa }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validação falhou',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    console.error('Create despesa error:', error);
    return NextResponse.json({ error: 'Erro ao criar despesa' }, { status: 500 });
  }
}
