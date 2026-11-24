import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pb from '@/lib/pocketbase';
import { requireAdmin } from '@/lib/auth';
import { campaignSchema } from '@/lib/validators';

/**
 * GET /api/campanhas - Lista campanhas
 * Query: ?status=draft|planned|active|finished
 */
export async function GET(_request: NextRequest) {
  try {
    const searchParams = _request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter
    let filter = '';
    if (status) {
      filter = `status="${status}"`;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get total count
    const allCampanhas = await pb.collection('campanhas').getFullList({
      filter,
    });
    const count = allCampanhas.length;
    const totalPages = Math.ceil(count / limit);

    // Get paginated results with sort
    const data = await pb.collection('campanhas').getList(page, limit, {
      filter,
      sort: '-action_date,-id',
    });

    return NextResponse.json(
      {
        campanhas: data.items,
        total: count,
        page,
        limit,
        pages: totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get campanhas error:', error);
    return NextResponse.json({ error: 'Erro ao buscar campanhas' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas - Criar campanha
 */
export async function POST(_request: NextRequest) {
  try {
    // Verifica autenticação de admin
    await requireAdmin();

    const body = await _request.json();
    const data = campaignSchema.parse(body);

    // Verifica se slug já existe
    try {
      await pb.collection('campanhas').getFirstListItem(`public_slug="${data.public_slug}"`);
      return NextResponse.json({ error: 'Slug já existe' }, { status: 409 });
    } catch {
      // Slug não existe, prossegue
    }

    // Cria campanha
    const campanha = await pb.collection('campanhas').create({
      title: data.title,
      description: data.description || '',
      institution: data.institution,
      public_slug: data.public_slug,
      date_mode: data.date_mode,
      action_date: data.action_date || null,
      end_date: data.end_date || null,
      fundraising_goal: data.fundraising_goal || null,
      status: data.status,
      estimated_audience: data.estimated_audience || null,
    });

    return NextResponse.json({ campanha }, { status: 201 });
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

    console.error('Create campanha error:', error);
    return NextResponse.json({ error: 'Erro ao criar campanha' }, { status: 500 });
  }
}
