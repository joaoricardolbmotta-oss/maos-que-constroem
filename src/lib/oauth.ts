import { supabaseClient } from '@/lib/supabase';

export const googleOAuthConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
};

export const githubOAuthConfig = {
  clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
};

export async function signInWithGoogle() {
  if (!googleOAuthConfig.clientId) {
    throw new Error('Google OAuth not configured');
  }

  const supabase = supabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: googleOAuthConfig.redirectUri,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithGitHub() {
  if (!githubOAuthConfig.clientId) {
    throw new Error('GitHub OAuth not configured');
  }

  const supabase = supabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: githubOAuthConfig.redirectUri,
    },
  });

  if (error) throw error;
  return data;
}

export async function handleOAuthCallback(code: string, provider: 'google' | 'github') {
  const supabase = supabaseClient();

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) throw error;

    return {
      session: data.session,
      user: data.user,
    };
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw error;
  }
}

export async function linkOAuthProvider(provider: 'google' | 'github') {
  const supabase = supabaseClient();

  const { data, error } = await supabase.auth.linkIdentity({
    provider,
  });

  if (error) throw error;
  return data;
}
