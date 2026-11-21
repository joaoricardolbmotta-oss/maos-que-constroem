import { cookies } from 'next/headers';
import { User } from '@/types/database';

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Salva token JWT e dados do usuário em cookies
 */
export async function setAuthCookie(response: AuthResponse) {
  const cookieStore = await cookies();

  // Token salvo em cookie HttpOnly (seguro contra XSS)
  cookieStore.set('auth-token', response.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  });

  // User info salvo em cookie acessível (para rápido acesso no cliente)
  cookieStore.set('user', JSON.stringify(response.user), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

/**
 * Limpa cookies de autenticação
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  cookieStore.delete('user');
}

/**
 * Obtém token do cookie (lado do servidor)
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value || null;
}

/**
 * Obtém usuário armazenado em cookie
 */
export async function getAuthUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;

  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
}

/**
 * Verifica se usuário está autenticado (lado do servidor)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return !!token;
}

/**
 * Requer autenticação (middleware de API)
 * Lança erro 401 se não autenticado
 */
export async function requireAuth() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('Unauthorized');
  }

  return token;
}

/**
 * Requer autorização de admin
 */
export async function requireAdmin() {
  const user = await getAuthUser();

  if (!user || (user.role !== 'admin' && user.role !== 'master')) {
    throw new Error('Forbidden');
  }

  return user;
}
