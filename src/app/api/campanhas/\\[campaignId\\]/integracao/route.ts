import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

const integrationSchema = z.object({
  type: z.enum(['slack', 'discord', 'google_sheets', 'stripe']),
  config: z.record(z.any()),
  enabled: z.boolean().optional(),
});

/**
 * GET /api/campanhas/:campaignId/integracao - Lista integrações
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('campaign_integrations')
      .select('id, type, enabled, created_at')
      .eq('campaign_id', params.campaignId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ integrations: data }, { status: 200 });
  } catch (error) {
    console.error('Get integrations error:', error);
    return NextResponse.json({ error: 'Erro ao buscar integrações' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas/:campaignId/integracao - Configurar integração
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = integrationSchema.parse(body);

    const supabase = supabaseServer();

    // Verifica se já existe
    const { data: existing } = await supabase
      .from('campaign_integrations')
      .select('id')
      .eq('campaign_id', params.campaignId)
      .eq('type', data.type)
      .single();

    let result;

    if (existing) {
      // Atualiza
      const { data: updated, error } = await supabase
        .from('campaign_integrations')
        .update({
          config: data.config,
          enabled: data.enabled ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = updated;
    } else {
      // Cria nova
      const { data: created, error } = await supabase
        .from('campaign_integrations')
        .insert([
          {
            campaign_id: params.campaignId,
            type: data.type,
            config: data.config,
            enabled: data.enabled ?? true,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      result = created;
    }

    return NextResponse.json({ integration: result }, { status: existing ? 200 : 201 });
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

    console.error('Configure integration error:', error);
    return NextResponse.json({ error: 'Erro ao configurar integração' }, { status: 500 });
  }
}

/**
 * DELETE /api/campanhas/:campaignId/integracao/:type - Remover integração
 */
export async function DELETE(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json({ error: 'Tipo é obrigatório' }, { status: 400 });
    }

    const supabase = supabaseServer();

    const { error } = await supabase
      .from('campaign_integrations')
      .delete()
      .eq('campaign_id', params.campaignId)
      .eq('type', type);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete integration error:', error);
    return NextResponse.json({ error: 'Erro ao deletar integração' }, { status: 500 });
  }
}
