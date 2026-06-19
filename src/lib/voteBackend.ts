import type { VoteBackend } from '../types';
import { supabase } from './supabaseClient';
import { createSupabaseBackend } from './supabaseBackend';
import { createMockBackend } from './mockBackend';

/**
 * Picks the backend once per session: Supabase if configured, otherwise the
 * zero-setup mock. A singleton so the realtime channel / demo feed is shared.
 */
let backend: VoteBackend | null = null;

export function getBackend(): VoteBackend {
  if (!backend) {
    backend = supabase ? createSupabaseBackend(supabase) : createMockBackend();
  }
  return backend;
}
