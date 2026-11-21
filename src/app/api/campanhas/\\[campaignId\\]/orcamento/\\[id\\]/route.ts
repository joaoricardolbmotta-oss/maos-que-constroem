import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { orcamentoSchema } from '@/lib/validators';

/**
 * GET /api/campanhas/:campaignId/orcamento/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('orcamento_itens')
      .select('*')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Item de orçamento não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ orcamento: data }, { status: 200 });
  } catch (error) {
    console.error('Get orcamento error:', error);
    return NextResponse.json({ error: 'Erro ao buscar item de orçamento' }, { status: 500 });
  }
}

/**
 * PUT /api/campanhas/:campaignId/orcamento/:id
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = orcamentoSchema.parse(body);

    const supabase = supabaseServer();

    const { data: existing } = await supabase
      .from('orcamento_itens')
      .select('id')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Item de orçamento não encontrado' }, { status: 404 });
    }

    const { data: orcamento, error } = await supabase
      .from('orcamento_itens')
      .update({
        category: data.category,
        description: data.description,
        estimated_amount: data.estimated_amount,
        actual_amount: data.actual_amount || null,
        notes: data.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ orcamento }, { status: 200 });
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

    console.error('Update orcamento error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar item de orçamento' }, { status: 500 });
  }
}

/**
 * DELETE /api/campanhas/:campaignId/orcamento/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();

    const { data: existing } = await supabase
      .from('orcamento_itens')
      .select('id')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Item de orçamento não encontrado' }, { status: 404 });
    }

    const { error } = await supabase.from('orcamento_itens').delete().eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    console.error('Delete orcamento error:', error);
    return NextResponse.json({ error: 'Erro ao deletar item de orçamento' }, { status: 500 });
  }
}
