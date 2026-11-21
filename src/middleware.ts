import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas (não precisam de autenticação)
  const publicRoutes = ['/login', '/logout', '/campanha', '/api/relatorios'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Rotas protegidas (admin)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/campanhas') || pathname.startsWith('/api/receitas')) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redireciona para login se não tiver token
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Adiciona token ao header para uso na API
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${token}`);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
