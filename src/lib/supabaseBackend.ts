import type { SupabaseClient } from '@supabase/supabase-js';
import type { CastResult, VoteBackend } from '../types';
import { emptyCounts } from './counts';

/**
 * Live backend backed by Supabase + Supabase Realtime.
 *
 * Counts are computed client-side from the `votes` table. For a group-chat-sized
 * audience (dozens–hundreds of votes) this is simple and plenty fast. If this
 * ever went viral you'd swap fetchCounts() for a SQL aggregate / materialized
 * view — but the rest of the app wouldn't need to change.
 */
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

    async castVote(pollId, optionId, fingerprint): Promise<CastResult> {
      const { data, error } = await client
        .from('votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          voter_fingerprint: fingerprint,
        })
        .select('id')
        .single();

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
            };
            const id = row.id ? String(row.id) : '';
            // Skip the echo of our own inserts (already counted optimistically).
            if (id && ownVoteIds.has(id)) {
              ownVoteIds.delete(id);
              return;
            }
            if (row.poll_id && row.option_id) {
              onVote(row.poll_id, row.option_id);
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
