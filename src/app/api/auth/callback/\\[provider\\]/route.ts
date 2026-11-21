import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { setAuthCookie } from '@/lib/auth';

/**
 * GET /api/auth/callback/[provider] - OAuth callback
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const supabase = supabaseServer();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 400 });
    }

    // Set auth cookie
    await setAuthCookie(data.session.access_token);

    // Redirect to dashboard
    const redirectUrl = new URL('/admin', request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorUrl = new URL('/login?error=oauth_failed', request.url);
    return NextResponse.redirect(errorUrl);
  }
}
