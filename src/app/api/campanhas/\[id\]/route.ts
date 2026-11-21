import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { campaignSchema } from '@/lib/validators';

/**
 * GET /api/campanhas/:id - Obter detalhes de campanha
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('campanhas')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ campanha: data }, { status: 200 });
  } catch (error) {
    console.error('Get campanha error:', error);
    return NextResponse.json({ error: 'Erro ao buscar campanha' }, { status: 500 });
  }
}

/**
 * PUT /api/campanhas/:id - Atualizar campanha
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verifica autenticação de admin
    await requireAdmin();

    const body = await request.json();
    const data = campaignSchema.parse(body);

    const supabase = supabaseServer();

    // Verifica se campanha existe
    const { data: existing } = await supabase
      .from('campanhas')
      .select('id')
      .eq('id', params.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    // Verifica se novo slug já existe em outra campanha
    if (data.public_slug) {
      const { data: slugExists } = await supabase
        .from('campanhas')
        .select('id')
        .eq('public_slug', data.public_slug)
        .neq('id', params.id)
        .single();

      if (slugExists) {
        return NextResponse.json({ error: 'Slug já existe' }, { status: 409 });
      }
    }

    // Atualiza campanha
    const { data: campanha, error } = await supabase
      .from('campanhas')
      .update({
        title: data.title,
        description: data.description || null,
        institution: data.institution,
        public_slug: data.public_slug,
        date_mode: data.date_mode,
        action_date: data.action_date || null,
        end_date: data.end_date || null,
        fundraising_goal: data.fundraising_goal || null,
        status: data.status,
        estimated_audience: data.estimated_audience || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ campanha }, { status: 200 });
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

    console.error('Update campanha error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar campanha' }, { status: 500 });
  }
}

/**
 * DELETE /api/campanhas/:id - Deletar campanha
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verifica autenticação de admin
    await requireAdmin();

    const supabase = supabaseServer();

    // Verifica se campanha existe
    const { data: existing } = await supabase
      .from('campanhas')
      .select('id')
      .eq('id', params.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    // Deleta campanha e seus relacionamentos em cascata
    const { error } = await supabase.from('campanhas').delete().eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    console.error('Delete campanha error:', error);
    return NextResponse.json({ error: 'Erro ao deletar campanha' }, { status: 500 });
  }
}
