import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CastResult, DataMode, LoadState, MyVotes, VoteCounts } from '../types';
import { MARKETS } from '../data/markets';
import { bumpCount, emptyCounts, grandTotal } from '../lib/counts';
import { getBackend } from '../lib/voteBackend';
import {
  forgetVote,
  getFingerprint,
  getVoterName,
  hasEntered,
  markEntered,
  mergeName,
  readMyVotes,
  rememberVote,
} from '../lib/fingerprint';

const POLL_IDS = MARKETS.map((m) => m.id);
const MARKET_COUNT = POLL_IDS.length;

export interface CastOutcome {
  result: CastResult;
  /** True when this was the device's very first vote (i.e. market entry). */
  firstEntry: boolean;
  /** True when this vote completed the voter's full ballot (every market answered). */
  ballotComplete: boolean;
  /** True when the voter dismissed the name prompt instead of voting. */
  cancelled?: boolean;
}

export interface UseVotes {
  counts: VoteCounts;
  myVotes: MyVotes;
  loadState: LoadState;
  mode: DataMode;
  /** Total individual answers across all markets. */
  totalVotes: number;
  /** Number of voters who have answered every market (completed ballots). */
  completedBallots: number;
  /** True once this device has cast at least one vote. */
  entered: boolean;
  /** Display names of everyone who has cast a ballot ("who's in the market"). */
  voters: string[];
  /** A poll id that just failed to submit (for inline retry), or null. */
  errorPollId: string | null;
  castVote: (pollId: string, optionId: string) => Promise<CastOutcome>;
  retry: () => void;
}

/**
 * Single source of truth for vote state: initial snapshot, realtime updates,
 * optimistic voting with rollback, per-device duplicate guards, the live roster
 * of named voters, and the count of completed (all-markets-answered) ballots.
 */
export function useVotes(): UseVotes {
  const backend = useMemo(() => getBackend(), []);
  const fingerprint = useMemo(() => getFingerprint(), []);

  const [counts, setCounts] = useState<VoteCounts>(() => emptyCounts());
  const [myVotes, setMyVotes] = useState<MyVotes>(() => readMyVotes(POLL_IDS));
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [entered, setEntered] = useState<boolean>(() => hasEntered());
  const [voters, setVoters] = useState<string[]>([]);
  const [completedBallots, setCompletedBallots] = useState(0);
  const [errorPollId, setErrorPollId] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  const myVotesRef = useRef(myVotes);
  myVotesRef.current = myVotes;

  // fingerprint -> set of answered poll ids; powers the completed-ballots count.
  const progressRef = useRef<Map<string, Set<string>>>(new Map());

  const recomputeCompleted = useCallback(() => {
    let n = 0;
    for (const set of progressRef.current.values()) {
      if (set.size >= MARKET_COUNT) n += 1;
    }
    setCompletedBallots(n);
  }, []);

  const registerVote = useCallback(
    (fp: string | undefined, pollId: string) => {
      if (!fp) return;
      let set = progressRef.current.get(fp);
      if (!set) {
        set = new Set();
        progressRef.current.set(fp, set);
      }
      if (!set.has(pollId)) {
        set.add(pollId);
        recomputeCompleted();
      }
    },
    [recomputeCompleted],
  );

  const applyProgressSnapshot = useCallback(
    (ballotProgress: Record<string, string[]>) => {
      const map = new Map<string, Set<string>>();
      for (const [fp, polls] of Object.entries(ballotProgress)) {
        map.set(fp, new Set(polls));
      }
      progressRef.current = map;
      recomputeCompleted();
    },
    [recomputeCompleted],
  );

  // Initial snapshot + realtime subscription (re-runs on retry).
  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    setLoadState('loading');
    backend
      .fetchSnapshot()
      .then((snap) => {
        if (cancelled) return;
        setCounts(snap.counts);
        setVoters(snap.voters);
        applyProgressSnapshot(snap.ballotProgress);
        setLoadState('ready');
        // Subscribe only after the baseline is in, so no votes are lost.
        unsubscribe = backend.subscribe((pollId, optionId, voterName, fp) => {
          setCounts((cur) => bumpCount(cur, pollId, optionId));
          if (voterName) setVoters((cur) => mergeName(cur, voterName));
          registerVote(fp, pollId);
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
  }, [backend, retryToken, applyProgressSnapshot, registerVote]);

  const castVote = useCallback(
    async (pollId: string, optionId: string): Promise<CastOutcome> => {
      // Guard: this device already voted in this market.
      if (myVotesRef.current[pollId]) {
        return { result: 'duplicate', firstEntry: false, ballotComplete: false };
      }

      const firstEntry = !hasEntered();
      const willComplete = Object.keys(myVotesRef.current).length + 1 >= MARKET_COUNT;
      const voterName = getVoterName() ?? undefined;
      const alreadyTracked = progressRef.current.get(fingerprint)?.has(pollId) ?? false;

      // ---- Optimistic update (instant thumb feedback) ----
      setErrorPollId((id) => (id === pollId ? null : id));
      setCounts((cur) => bumpCount(cur, pollId, optionId));
      setMyVotes((m) => ({ ...m, [pollId]: optionId }));
      rememberVote(pollId, optionId);
      registerVote(fingerprint, pollId);

      try {
        const result = await backend.castVote(pollId, optionId, fingerprint, voterName);

        if (result === 'duplicate') {
          // DB already had a vote from this fingerprint — resync to the truth.
          const snap = await backend.fetchSnapshot();
          setCounts(snap.counts);
          setVoters(snap.voters);
          applyProgressSnapshot(snap.ballotProgress);
        }

        // Add ourselves to the roster (our own realtime echo is suppressed).
        if (voterName) setVoters((cur) => mergeName(cur, voterName));

        if (firstEntry) {
          markEntered();
          setEntered(true);
        }
        return { result, firstEntry, ballotComplete: result === 'ok' && willComplete };
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
        if (!alreadyTracked) {
          const set = progressRef.current.get(fingerprint);
          if (set && set.delete(pollId)) recomputeCompleted();
        }
        setErrorPollId(pollId);
        throw err;
      }
    },
    [backend, fingerprint, registerVote, applyProgressSnapshot, recomputeCompleted],
  );

  const retry = useCallback(() => setRetryToken((t) => t + 1), []);

  const totalVotes = useMemo(() => grandTotal(counts), [counts]);

  return {
    counts,
    myVotes,
    loadState,
    mode: backend.mode,
    totalVotes,
    completedBallots,
    entered,
    voters,
    errorPollId,
    castVote,
    retry,
  };
}
