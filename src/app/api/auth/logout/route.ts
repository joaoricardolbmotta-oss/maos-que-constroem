import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(_request: NextRequest) {
  try {
    // Limpa cookies
    await clearAuthCookie();

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            'auth-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
            'user=; Path=/; SameSite=Lax; Max-Age=0',
          ],
        } as any,
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Erro ao fazer logout' }, { status: 500 });
  }
}
