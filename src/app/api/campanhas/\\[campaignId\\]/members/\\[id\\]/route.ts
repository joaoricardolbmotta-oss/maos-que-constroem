import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

const updateMemberSchema = z.object({
  role: z.enum(['owner', 'editor', 'viewer']),
});

/**
 * PUT /api/campanhas/:campaignId/members/:id
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = updateMemberSchema.parse(body);

    const supabase = supabaseServer();

    // Verifica se membro existe
    const { data: existing } = await supabase
      .from('campaign_members')
      .select('id')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Membro não encontrado' }, { status: 404 });
    }

    // Atualiza role
    const { data: member, error } = await supabase
      .from('campaign_members')
      .update({
        role: data.role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ member }, { status: 200 });
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

    console.error('Update member error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar membro' }, { status: 500 });
  }
}

/**
 * DELETE /api/campanhas/:campaignId/members/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();

    // Verifica se membro existe
    const { data: existing } = await supabase
      .from('campaign_members')
      .select('id')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Membro não encontrado' }, { status: 404 });
    }

    // Deleta membro
    const { error } = await supabase.from('campaign_members').delete().eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete member error:', error);
    return NextResponse.json({ error: 'Erro ao remover membro' }, { status: 500 });
  }
}
