import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

const categorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  type: z.enum(['despesa', 'doacao']),
});

/**
 * GET /api/campanhas/:campaignId/categorias - Lista categorias customizadas
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('custom_categories')
      .select('*')
      .eq('campaign_id', params.campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ categories: data }, { status: 200 });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas/:campaignId/categorias - Criar categoria
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = categorySchema.parse(body);

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

    // Verifica se categoria já existe
    const { data: existing } = await supabase
      .from('custom_categories')
      .select('id')
      .eq('campaign_id', params.campaignId)
      .eq('name', data.name)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Categoria já existe' }, { status: 400 });
    }

    // Cria categoria
    const { data: category, error } = await supabase
      .from('custom_categories')
      .insert([
        {
          campaign_id: params.campaignId,
          name: data.name,
          color: data.color,
          type: data.type,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ category }, { status: 201 });
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

    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}
