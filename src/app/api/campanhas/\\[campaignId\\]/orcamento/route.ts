import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { orcamentoSchema } from '@/lib/validators';

/**
 * GET /api/campanhas/:campaignId/orcamento - Lista itens do orçamento
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('orcamento_itens')
      .select('*')
      .eq('campaign_id', params.campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ orcamentos: data }, { status: 200 });
  } catch (error) {
    console.error('Get orcamentos error:', error);
    return NextResponse.json({ error: 'Erro ao buscar orçamentos' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas/:campaignId/orcamento - Criar item do orçamento
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = orcamentoSchema.parse(body);

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

    // Cria item de orçamento
    const { data: orcamento, error } = await supabase
      .from('orcamento_itens')
      .insert([
        {
          campaign_id: params.campaignId,
          category: data.category,
          description: data.description,
          estimated_amount: data.estimated_amount,
          actual_amount: data.actual_amount || null,
          notes: data.notes || null,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ orcamento }, { status: 201 });
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

    console.error('Create orcamento error:', error);
    return NextResponse.json({ error: 'Erro ao criar item de orçamento' }, { status: 500 });
  }
}
