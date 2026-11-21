import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseServer = () => {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseServer can only be used on the server');
  }

  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
};
