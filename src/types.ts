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
export interface VoteBackend {
  readonly mode: DataMode;
  /** Pull current totals for every option. */
  fetchCounts(): Promise<VoteCounts>;
  /**
   * Record a vote. Resolves 'ok' when stored, 'duplicate' when the database
   * already has a vote from this fingerprint. Throws on real network errors.
   */
  castVote(pollId: string, optionId: string, fingerprint: string): Promise<CastResult>;
  /**
   * Subscribe to votes arriving from OTHER clients. Returns an unsubscribe
   * function. The callback fires once per incoming vote — a client's own votes
   * are deduped so the UI can apply them optimistically without double-counting.
   */
  subscribe(onVote: (pollId: string, optionId: string) => void): () => void;
}
