import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { doacaoSchema } from '@/lib/validators';

/**
 * GET /api/campanhas/:campaignId/doacoes - Lista doações materiais
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('doacoes_materiais')
      .select('*')
      .eq('campaign_id', params.campaignId)
      .order('received_date', { ascending: false })
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ doacoes: data }, { status: 200 });
  } catch (error) {
    console.error('Get doacoes error:', error);
    return NextResponse.json({ error: 'Erro ao buscar doações' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas/:campaignId/doacoes - Registrar doação material
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = doacaoSchema.parse(body);

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

    // Cria doação
    const { data: doacao, error } = await supabase
      .from('doacoes_materiais')
      .insert([
        {
          campaign_id: params.campaignId,
          item_name: data.item_name,
          category: data.category,
          quantity: data.quantity,
          unit: data.unit || null,
          donor_name: data.donor_name || null,
          donor_cpf: data.donor_cpf || null,
          received_date: data.received_date,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ doacao }, { status: 201 });
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

    console.error('Create doacao error:', error);
    return NextResponse.json({ error: 'Erro ao criar doação' }, { status: 500 });
  }
}
