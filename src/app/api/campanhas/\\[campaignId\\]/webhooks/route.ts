import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum(['receita.created', 'despesa.created', 'doacao.created'])),
  active: z.boolean().optional(),
});

/**
 * GET /api/campanhas/:campaignId/webhooks - Lista webhooks
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('campaign_id', params.campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ webhooks: data }, { status: 200 });
  } catch (error) {
    console.error('Get webhooks error:', error);
    return NextResponse.json({ error: 'Erro ao buscar webhooks' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas/:campaignId/webhooks - Criar webhook
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = webhookSchema.parse(body);

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

    // Cria webhook
    const { data: webhook, error } = await supabase
      .from('webhooks')
      .insert([
        {
          campaign_id: params.campaignId,
          url: data.url,
          events: data.events,
          active: data.active ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ webhook }, { status: 201 });
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

    console.error('Create webhook error:', error);
    return NextResponse.json({ error: 'Erro ao criar webhook' }, { status: 500 });
  }
}

/**
 * DELETE /api/campanhas/:campaignId/webhooks/:id
 */
export async function DELETE(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do webhook é obrigatório' }, { status: 400 });
    }

    const supabase = supabaseServer();

    const { data: existing } = await supabase
      .from('webhooks')
      .select('id')
      .eq('id', id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Webhook não encontrado' }, { status: 404 });
    }

    const { error } = await supabase.from('webhooks').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete webhook error:', error);
    return NextResponse.json({ error: 'Erro ao deletar webhook' }, { status: 500 });
  }
}
