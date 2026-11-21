import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { receitaSchema } from '@/lib/validators';

/**
 * GET /api/campanhas/:campaignId/receitas/:id - Obter receita
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('receitas')
      .select('*')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Receita não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ receita: data }, { status: 200 });
  } catch (error) {
    console.error('Get receita error:', error);
    return NextResponse.json({ error: 'Erro ao buscar receita' }, { status: 500 });
  }
}

/**
 * PUT /api/campanhas/:campaignId/receitas/:id - Atualizar receita
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = receitaSchema.parse(body);

    const supabase = supabaseServer();

    // Verifica se receita existe e pertence à campanha
    const { data: existing } = await supabase
      .from('receitas')
      .select('id')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Receita não encontrada' }, { status: 404 });
    }

    // Atualiza receita
    const { data: receita, error } = await supabase
      .from('receitas')
      .update({
        description: data.description,
        amount: data.amount,
        source: data.source,
        donor_name: data.donor_name || null,
        donor_cpf: data.donor_cpf || null,
        receipt_number: data.receipt_number || null,
        receipt_date: data.receipt_date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ receita }, { status: 200 });
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

    console.error('Update receita error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar receita' }, { status: 500 });
  }
}

/**
 * DELETE /api/campanhas/:campaignId/receitas/:id - Deletar receita
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();

    // Verifica se receita existe e pertence à campanha
    const { data: existing } = await supabase
      .from('receitas')
      .select('id')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Receita não encontrada' }, { status: 404 });
    }

    // Deleta receita
    const { error } = await supabase.from('receitas').delete().eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    console.error('Delete receita error:', error);
    return NextResponse.json({ error: 'Erro ao deletar receita' }, { status: 500 });
  }
}
