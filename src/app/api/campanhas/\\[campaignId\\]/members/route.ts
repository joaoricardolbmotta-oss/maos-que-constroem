import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

const memberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['owner', 'editor', 'viewer']),
});

/**
 * GET /api/campanhas/:campaignId/members - Lista membros
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('campaign_members')
      .select('id, user_id, email, role, created_at')
      .eq('campaign_id', params.campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ members: data }, { status: 200 });
  } catch (error) {
    console.error('Get members error:', error);
    return NextResponse.json({ error: 'Erro ao buscar membros' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas/:campaignId/members - Adicionar membro
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = memberSchema.parse(body);

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

    // Verifica se já é membro
    const { data: existing } = await supabase
      .from('campaign_members')
      .select('id')
      .eq('campaign_id', params.campaignId)
      .eq('email', data.email)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Usuário já é membro desta campanha' }, { status: 400 });
    }

    // Adiciona membro
    const { data: member, error } = await supabase
      .from('campaign_members')
      .insert([
        {
          campaign_id: params.campaignId,
          email: data.email,
          role: data.role,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ member }, { status: 201 });
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

    console.error('Create member error:', error);
    return NextResponse.json({ error: 'Erro ao adicionar membro' }, { status: 500 });
  }
}
