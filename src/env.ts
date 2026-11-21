import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().optional(),
});

type EnvType = z.infer<typeof envSchema>;

let cachedEnv: EnvType | null = null;

export function getEnv(): EnvType {
  if (cachedEnv) return cachedEnv;

  const env = envSchema.parse(process.env);
  cachedEnv = env;
  return env;
}

export const env = getEnv();
