import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';
import { randomBytes } from 'crypto';

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.enum(['read', 'write', 'admin'])),
});

function generateApiKey(): string {
  return `moc_${randomBytes(32).toString('hex')}`;
}

/**
 * GET /api/api-keys - Lista chaves de API do usuário
 */
export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth();

    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, scopes, created_at, last_used_at, active')
      .eq('user_id', (user as any).id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ keys: data }, { status: 200 });
  } catch (error) {
    console.error('Get api keys error:', error);
    return NextResponse.json({ error: 'Erro ao buscar chaves' }, { status: 500 });
  }
}

/**
 * POST /api/api-keys - Criar nova chave de API
 */
export async function POST(_request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await _request.json();
    const data = createKeySchema.parse(body);

    const supabase = supabaseServer();

    const apiKey = generateApiKey();
    const keyPrefix = apiKey.substring(0, 20);

    // Hash da chave (em produção, usar bcrypt)
    const crypto = require('crypto');
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

    const { data: createdKey, error } = await supabase
      .from('api_keys')
      .insert([
        {
          user_id: (user as any).id,
          name: data.name,
          key_hash: hashedKey,
          key_prefix: keyPrefix,
          scopes: data.scopes,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        key: {
          ...createdKey,
          secret: apiKey, // Retorna apenas uma vez
        },
      },
      { status: 201 }
    );
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

    console.error('Create api key error:', error);
    return NextResponse.json({ error: 'Erro ao criar chave' }, { status: 500 });
  }
}

/**
 * DELETE /api/api-keys/:id - Revogar chave
 */
export async function DELETE(_request: NextRequest) {
  try {
    const user = await requireAuth();

    const { searchParams } = new URL(_request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const supabase = supabaseServer();

    const { data: existing } = await supabase
      .from('api_keys')
      .select('id')
      .eq('id', id)
      .eq('user_id', (user as any).id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Chave não encontrada' }, { status: 404 });
    }

    const { error } = await supabase.from('api_keys').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete api key error:', error);
    return NextResponse.json({ error: 'Erro ao deletar chave' }, { status: 500 });
  }
}
