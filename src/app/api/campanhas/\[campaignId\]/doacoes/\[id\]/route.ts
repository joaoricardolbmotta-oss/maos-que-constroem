import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { doacaoSchema } from '@/lib/validators';

/**
 * GET /api/campanhas/:campaignId/doacoes/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('doacoes_materiais')
      .select('*')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Doação não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ doacao: data }, { status: 200 });
  } catch (error) {
    console.error('Get doacao error:', error);
    return NextResponse.json({ error: 'Erro ao buscar doação' }, { status: 500 });
  }
}

/**
 * PUT /api/campanhas/:campaignId/doacoes/:id
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = doacaoSchema.parse(body);

    const supabase = supabaseServer();

    const { data: existing } = await supabase
      .from('doacoes_materiais')
      .select('id')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Doação não encontrada' }, { status: 404 });
    }

    const { data: doacao, error } = await supabase
      .from('doacoes_materiais')
      .update({
        item_name: data.item_name,
        category: data.category,
        quantity: data.quantity,
        unit: data.unit || null,
        donor_name: data.donor_name || null,
        donor_cpf: data.donor_cpf || null,
        received_date: data.received_date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ doacao }, { status: 200 });
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

    console.error('Update doacao error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar doação' }, { status: 500 });
  }
}

/**
 * DELETE /api/campanhas/:campaignId/doacoes/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();

    const { data: existing } = await supabase
      .from('doacoes_materiais')
      .select('id')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Doação não encontrada' }, { status: 404 });
    }

    const { error } = await supabase.from('doacoes_materiais').delete().eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    console.error('Delete doacao error:', error);
    return NextResponse.json({ error: 'Erro ao deletar doação' }, { status: 500 });
  }
}
