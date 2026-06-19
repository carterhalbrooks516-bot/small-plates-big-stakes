import type { Poll, PollOption, VoteCounts } from '../types';
import { MARKETS } from '../data/markets';

/** A fully-zeroed count map covering every poll/option, so bars always render. */
export function emptyCounts(): VoteCounts {
  const counts: VoteCounts = {};
  for (const poll of MARKETS) {
    counts[poll.id] = {};
    for (const opt of poll.options) counts[poll.id][opt.id] = 0;
  }
  return counts;
}

/** Immutably add `delta` votes to one option (ignores unknown ids safely). */
export function bumpCount(
  counts: VoteCounts,
  pollId: string,
  optionId: string,
  delta = 1,
): VoteCounts {
  if (!counts[pollId] || counts[pollId][optionId] === undefined) return counts;
  return {
    ...counts,
    [pollId]: {
      ...counts[pollId],
      [optionId]: counts[pollId][optionId] + delta,
    },
  };
}

export function pollTotal(counts: VoteCounts, pollId: string): number {
  const poll = counts[pollId];
  if (!poll) return 0;
  return Object.values(poll).reduce((a, b) => a + b, 0);
}

export function grandTotal(counts: VoteCounts): number {
  return Object.keys(counts).reduce((sum, pollId) => sum + pollTotal(counts, pollId), 0);
}

export function percent(count: number, total: number): number {
  if (total <= 0) return 0;
  return (count / total) * 100;
}

export interface Leader {
  option: PollOption;
  count: number;
  pct: number;
}

/** The current front-runner for a poll, or null if there are no votes yet. */
export function leaderOption(poll: Poll, counts: VoteCounts): Leader | null {
  const total = pollTotal(counts, poll.id);
  if (total === 0) return null;
  let best: PollOption | null = null;
  let bestCount = -1;
  for (const opt of poll.options) {
    const c = counts[poll.id]?.[opt.id] ?? 0;
    if (c > bestCount) {
      bestCount = c;
      best = opt;
    }
  }
  if (!best) return null;
  return { option: best, count: bestCount, pct: percent(bestCount, total) };
}
