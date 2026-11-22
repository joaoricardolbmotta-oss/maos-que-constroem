import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';

const bcrypt = require('bcryptjs');

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();

    // Valida com Zod
    const data = loginSchema.parse(body);

    const supabase = supabaseServer();

    // Busca usuário no banco
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.email)
      .single();

    if (userError || !users) {
      return NextResponse.json({ error: 'Email ou senha inválidos' }, { status: 401 });
    }

    if (!users.is_active) {
      return NextResponse.json({ error: 'Usuário inativo' }, { status: 403 });
    }

    // Compara senha
    const passwordMatch = await bcrypt.compare(data.password, users.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Email ou senha inválidos' }, { status: 401 });
    }

    // Atualiza last_login_at
    await supabase.from('users').update({ last_login_at: new Date().toISOString() }).eq('id', users.id);

    // Cria token JWT (simples - em produção usar jose ou jwt library)
    const token = Buffer.from(
      JSON.stringify({
        sub: users.id,
        email: users.email,
        role: users.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 dias
      })
    ).toString('base64');

    // Remove password_hash da resposta
    const { password_hash, ...userWithoutPassword } = users;

    // Salva em cookies
    await setAuthCookie({
      token,
      user: userWithoutPassword,
    });

    return NextResponse.json(
      {
        success: true,
        token,
        user: userWithoutPassword,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `auth-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
        },
      }
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

    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}
