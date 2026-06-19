import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CastResult, DataMode, LoadState, MyVotes, VoteCounts } from '../types';
import { MARKETS } from '../data/markets';
import { bumpCount, emptyCounts, grandTotal } from '../lib/counts';
import { getBackend } from '../lib/voteBackend';
import {
  forgetVote,
  getFingerprint,
  hasEntered,
  markEntered,
  readMyVotes,
  rememberVote,
} from '../lib/fingerprint';

const POLL_IDS = MARKETS.map((m) => m.id);

export interface CastOutcome {
  result: CastResult;
  /** True when this was the device's very first vote (i.e. market entry). */
  firstEntry: boolean;
}

export interface UseVotes {
  counts: VoteCounts;
  myVotes: MyVotes;
  loadState: LoadState;
  mode: DataMode;
  totalVotes: number;
  /** True once this device has cast at least one vote. */
  entered: boolean;
  /** A poll id that just failed to submit (for inline retry), or null. */
  errorPollId: string | null;
  castVote: (pollId: string, optionId: string) => Promise<CastOutcome>;
  retry: () => void;
}

/**
 * Single source of truth for vote state: initial load, realtime updates,
 * optimistic voting with rollback, and per-device duplicate guards.
 */
export function useVotes(): UseVotes {
  const backend = useMemo(() => getBackend(), []);
  const fingerprint = useMemo(() => getFingerprint(), []);

  const [counts, setCounts] = useState<VoteCounts>(() => emptyCounts());
  const [myVotes, setMyVotes] = useState<MyVotes>(() => readMyVotes(POLL_IDS));
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [entered, setEntered] = useState<boolean>(() => hasEntered());
  const [errorPollId, setErrorPollId] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  // Refs mirror state so async callbacks read fresh values without re-binding.
  const countsRef = useRef(counts);
  const myVotesRef = useRef(myVotes);
  countsRef.current = counts;
  myVotesRef.current = myVotes;

  // Initial load + realtime subscription (re-runs on retry).
  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    setLoadState('loading');
    backend
      .fetchCounts()
      .then((fresh) => {
        if (cancelled) return;
        setCounts(fresh);
        setLoadState('ready');
        // Subscribe only after the baseline is in, so no votes are lost.
        unsubscribe = backend.subscribe((pollId, optionId) => {
          setCounts((cur) => bumpCount(cur, pollId, optionId));
        });
      })
      .catch((err) => {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.error('[SmallPlates] failed to load the board:', err);
        setLoadState('error');
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [backend, retryToken]);

  const castVote = useCallback(
    async (pollId: string, optionId: string): Promise<CastOutcome> => {
      // Guard: this device already voted in this market.
      if (myVotesRef.current[pollId]) {
        return { result: 'duplicate', firstEntry: false };
      }

      const firstEntry = !hasEntered();

      // ---- Optimistic update (instant thumb feedback) ----
      setErrorPollId((id) => (id === pollId ? null : id));
      setCounts((cur) => bumpCount(cur, pollId, optionId));
      setMyVotes((m) => ({ ...m, [pollId]: optionId }));
      rememberVote(pollId, optionId);

      try {
        const result = await backend.castVote(pollId, optionId, fingerprint);

        if (result === 'duplicate') {
          // DB already had a vote from this fingerprint — resync to the truth
          // (our optimistic +1 was likely an over-count).
          const fresh = await backend.fetchCounts();
          setCounts(fresh);
        }

        if (firstEntry) {
          markEntered();
          setEntered(true);
        }
        return { result, firstEntry };
      } catch (err) {
        // ---- Roll back the optimistic changes so the user can retry ----
        // eslint-disable-next-line no-console
        console.error('[SmallPlates] vote failed:', err);
        setCounts((cur) => bumpCount(cur, pollId, optionId, -1));
        setMyVotes((m) => {
          const next = { ...m };
          delete next[pollId];
          return next;
        });
        forgetVote(pollId);
        setErrorPollId(pollId);
        throw err;
      }
    },
    [backend, fingerprint],
  );

  const retry = useCallback(() => setRetryToken((t) => t + 1), []);

  const totalVotes = useMemo(() => grandTotal(counts), [counts]);

  return {
    counts,
    myVotes,
    loadState,
    mode: backend.mode,
    totalVotes,
    entered,
    errorPollId,
    castVote,
    retry,
  };
}
