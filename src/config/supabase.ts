import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Resolves Supabase URL and publishable/anon key from Vite env.
 */
function resolveSupabaseEnv(): { readonly url: string; readonly key: string } {
  const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
  const key = (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    ?? import.meta.env.VITE_SUPABASE_ANON_KEY
    ?? ''
  ).trim();
  return { url, key };
}

/**
 * Returns whether Supabase env vars are present.
 */
export function isSupabaseConfigured(): boolean {
  const { url, key } = resolveSupabaseEnv();
  return url.length > 0 && key.length > 0;
}

/**
 * Returns a singleton Supabase browser client.
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }
  const { url, key } = resolveSupabaseEnv();
  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    );
  }
  supabaseClient = createClient(url, key);
  return supabaseClient;
}
