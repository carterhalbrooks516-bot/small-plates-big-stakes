/**
 * Shared domain types for the Andrew Stephens First Date Futures Exchange.
 */

export interface PollOption {
  id: string;
  label: string;
}

export interface Poll {
  id: string;
  /** Short market category, e.g. "Tapas Location Intelligence". */
  title: string;
  /** The actual question shown to voters, e.g. "Where is the date?". */
  question: string;
  /** Tiny emoji/icon used in headers and the summary board. */
  icon: string;
  /** Short summary-board label, e.g. "Favorite Venue". */
  summaryLabel: string;
  options: PollOption[];
}

/** pollId -> optionId -> number of votes. */
export type VoteCounts = Record<string, Record<string, number>>;

/** pollId -> the optionId this device voted for. */
export type MyVotes = Record<string, string>;

/** Whether vote data is coming from Supabase ("live") or local mock ("demo"). */
export type DataMode = 'live' | 'demo';

export type LoadState = 'loading' | 'ready' | 'error';

/** 'ok' = vote stored; 'duplicate' = this fingerprint already voted in the poll. */
export type CastResult = 'ok' | 'duplicate';

/**
 * The contract every vote backend implements. Swapping Supabase for the mock
 * store (or anything else later) only requires implementing this interface.
 */
/** One-shot snapshot of the whole board. */
export interface VoteSnapshot {
  /** pollId -> optionId -> number of votes. */
  counts: VoteCounts;
  /** Display names of everyone who has cast a ballot ("who's in the market"). */
  voters: string[];
  /**
   * Voter fingerprint -> the poll ids that fingerprint has answered. Drives the
   * "completed ballots" count (a ballot is complete when all markets are in).
   */
  ballotProgress: Record<string, string[]>;
}

export interface VoteBackend {
  readonly mode: DataMode;
  /** Pull a full snapshot of the board: counts, roster, and per-voter progress. */
  fetchSnapshot(): Promise<VoteSnapshot>;
  /**
   * Record a vote. Resolves 'ok' when stored, 'duplicate' when the database
   * already has a vote from this fingerprint. Throws on real network errors.
   * `voterName` is the public display name attached to the ballot.
   */
  castVote(
    pollId: string,
    optionId: string,
    fingerprint: string,
    voterName?: string,
  ): Promise<CastResult>;
  /**
   * Subscribe to votes arriving from OTHER clients. Returns an unsubscribe
   * function. The callback fires once per incoming vote (with the voter's name
   * and fingerprint when present) — a client's own votes are deduped so the UI
   * can apply them optimistically without double-counting.
   */
  subscribe(
    onVote: (
      pollId: string,
      optionId: string,
      voterName?: string,
      fingerprint?: string,
    ) => void,
  ): () => void;
}
