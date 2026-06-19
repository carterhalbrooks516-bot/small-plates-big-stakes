import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Reads Vite env vars and creates a Supabase client — but only if BOTH values
 * are present and not the placeholder defaults from `.env.example`.
 *
 * If they're missing, `supabase` is `null` and the app transparently falls back
 * to DEMO MODE (mock data + a simulated live feed). This is what lets the repo
 * run with zero setup.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isPlaceholder = (value?: string) =>
  !value ||
  value.includes('your-project-ref') ||
  value.includes('your-anon-public-key') ||
  value.trim() === '';

export const isSupabaseConfigured = !isPlaceholder(url) && !isPlaceholder(anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      realtime: { params: { eventsPerSecond: 10 } },
    })
  : null;
