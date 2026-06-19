import type { SupabaseClient } from '@supabase/supabase-js';
import type { CastResult, VoteBackend } from '../types';
import { emptyCounts } from './counts';
import { dedupeNames } from './fingerprint';

/**
 * Live backend backed by Supabase + Supabase Realtime.
 *
 * Counts are computed client-side from the `votes` table. For a group-chat-sized
 * audience (dozens–hundreds of votes) this is simple and plenty fast. If this
 * ever went viral you'd swap fetchCounts() for a SQL aggregate / materialized
 * view — but the rest of the app wouldn't need to change.
 */

/**
 * True when an error just means the `voter_name` column hasn't been added yet
 * (i.e. the database predates the roster feature). Lets us degrade gracefully
 * to nameless votes instead of failing the ballot.
 */
function isMissingVoterName(error: { code?: string; message?: string }): boolean {
  return (
    error.code === 'PGRST204' ||
    error.code === '42703' ||
    /voter_name/i.test(error.message ?? '')
  );
}

export function createSupabaseBackend(client: SupabaseClient): VoteBackend {
  // Track ids of votes WE inserted so we can ignore their realtime echo and
  // avoid double-counting (the UI already applied them optimistically).
  const ownVoteIds = new Set<string>();

  return {
    mode: 'live',

    async fetchCounts() {
      const counts = emptyCounts();
      const { data, error } = await client.from('votes').select('poll_id, option_id');
      if (error) throw error;
      for (const row of data ?? []) {
        const poll = counts[row.poll_id as string];
        if (poll && poll[row.option_id as string] !== undefined) {
          poll[row.option_id as string] += 1;
        }
      }
      return counts;
    },

    async fetchVoters() {
      const { data, error } = await client
        .from('votes')
        .select('voter_name, created_at')
        .not('voter_name', 'is', null)
        .order('created_at', { ascending: true });
      if (error) {
        // Column not added yet (pre-migration) — just show an empty roster.
        if (isMissingVoterName(error)) return [];
        throw error;
      }
      return dedupeNames((data ?? []).map((r) => String(r.voter_name)));
    },

    async castVote(pollId, optionId, fingerprint, voterName): Promise<CastResult> {
      const base = {
        poll_id: pollId,
        option_id: optionId,
        voter_fingerprint: fingerprint,
      };
      const payload = voterName ? { ...base, voter_name: voterName } : base;

      let { data, error } = await client
        .from('votes')
        .insert(payload)
        .select('id')
        .single();

      // If the DB hasn't had `voter_name` added yet, don't fail the vote — retry
      // without the name so voting keeps working until the migration is run.
      if (error && voterName && isMissingVoterName(error)) {
        ({ data, error } = await client
          .from('votes')
          .insert(base)
          .select('id')
          .single());
      }

      if (error) {
        // 23505 = unique_violation -> this fingerprint already voted this poll.
        if (error.code === '23505') return 'duplicate';
        throw error;
      }
      if (data?.id) ownVoteIds.add(String(data.id));
      return 'ok';
    },

    subscribe(onVote) {
      const channel = client
        .channel('public:votes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'votes' },
          (payload) => {
            const row = payload.new as {
              id?: string;
              poll_id?: string;
              option_id?: string;
              voter_name?: string | null;
            };
            const id = row.id ? String(row.id) : '';
            // Skip the echo of our own inserts (already counted optimistically).
            if (id && ownVoteIds.has(id)) {
              ownVoteIds.delete(id);
              return;
            }
            if (row.poll_id && row.option_id) {
              onVote(row.poll_id, row.option_id, row.voter_name ?? undefined);
            }
          },
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    },
  };
}
