import type { VoteBackend, VoteCounts } from '../types';
import { MARKETS } from '../data/markets';
import { emptyCounts } from './counts';

/**
 * Zero-setup DEMO backend. Used automatically when Supabase env vars are absent.
 *
 * It seeds a believable, already-lively board (so screenshots look great) and
 * runs a gentle "simulated live feed" that drips in votes from imaginary group
 * members — which is exactly how you verify the realtime UI works without a
 * second device. None of this persists; refresh and the show starts over.
 */

// Hand-tuned starting weights (keyed by the globally-unique option id) so the
// board has opinions that match the bit. Anything not listed defaults to a
// small baseline so every bar has signal.
const SEED_WEIGHTS: Record<string, number> = {
  // Venue — late money on Barcelona Wine Bar (per the ticker).
  'venue-barcelona': 41,
  'venue-cafe-madrid': 33,
  'venue-mystery': 14,
  'venue-chips-salsa': 9,
  // Start time — classic 7:00 leads.
  'start-time-7pm': 38,
  'start-time-730pm': 25,
  'start-time-630pm': 18,
  'start-time-8pm': 12,
  'start-time-6pm': 6,
  // Duration — the board believes in a solid outing.
  'duration-1p5-2p5': 34,
  'duration-1-1p5': 26,
  'duration-2p5-plus': 21,
  'duration-under-60': 11,
  'duration-4-plus': 7,
  // Drinks — two drinks, optimal operating range.
  'drinks-2': 44,
  'drinks-1': 24,
  'drinks-3': 17,
  'drinks-0': 6,
  'drinks-4-plus': 9,
  // Opening line — "I heard you're smart" is the dangerous sleeper.
  'opening-line-smart': 28,
  'opening-line-not-weird': 19,
  'opening-line-your-story': 15,
  'opening-line-45-minutes': 13,
  'opening-line-like-tapas': 10,
  'opening-line-never-been': 8,
  'opening-line-pictures': 7,
  'opening-line-parking': 6,
  // Second date — cautiously optimistic.
  'second-date-maybe': 31,
  'second-date-yes': 27,
  'second-date-business-days': 18,
  'second-date-andrew-claims': 14,
  'second-date-no-educational': 9,
  // Mrs. Stephens futures — the board likes the upside.
  'mrs-stephens-upside': 33,
  'mrs-stephens-loading': 22,
  'mrs-stephens-group-lore': 20,
  'mrs-stephens-6-weeks': 14,
  'mrs-stephens-fumbles': 8,
};

function seededCounts(): VoteCounts {
  const counts = emptyCounts();
  for (const poll of MARKETS) {
    for (const opt of poll.options) {
      const base = SEED_WEIGHTS[opt.id] ?? 5;
      // A little jitter so it never looks suspiciously round.
      counts[poll.id][opt.id] = Math.max(0, base + Math.floor(Math.random() * 6) - 2);
    }
  }
  return counts;
}

function deepCopy(counts: VoteCounts): VoteCounts {
  const copy: VoteCounts = {};
  for (const pollId of Object.keys(counts)) copy[pollId] = { ...counts[pollId] };
  return copy;
}

function weightedRandomOption(pollId: string): string {
  const poll = MARKETS.find((p) => p.id === pollId)!;
  const weights = poll.options.map((o) => SEED_WEIGHTS[o.id] ?? 5);
  const sum = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
  for (let i = 0; i < poll.options.length; i++) {
    r -= weights[i];
    if (r <= 0) return poll.options[i].id;
  }
  return poll.options[poll.options.length - 1].id;
}

export function createMockBackend(): VoteBackend {
  const counts = seededCounts();
  const subscribers = new Set<(pollId: string, optionId: string) => void>();
  let timer: ReturnType<typeof setTimeout> | null = null;

  // Drip a vote from an imaginary group member, then schedule the next at a
  // slightly random interval so it feels organic rather than metronomic.
  function scheduleDrip() {
    const delay = 2800 + Math.random() * 3600;
    timer = setTimeout(() => {
      const poll = MARKETS[Math.floor(Math.random() * MARKETS.length)];
      const optionId = weightedRandomOption(poll.id);
      counts[poll.id][optionId] += 1;
      subscribers.forEach((cb) => cb(poll.id, optionId));
      scheduleDrip();
    }, delay);
  }

  return {
    mode: 'demo',

    async fetchCounts() {
      // Mimic a tiny bit of network latency for realistic loading states.
      await new Promise((r) => setTimeout(r, 280));
      return deepCopy(counts);
    },

    async castVote(pollId, optionId) {
      await new Promise((r) => setTimeout(r, 220));
      counts[pollId][optionId] += 1; // keep internal state truthful
      return 'ok';
    },

    subscribe(onVote) {
      subscribers.add(onVote);
      if (!timer) scheduleDrip();
      return () => {
        subscribers.delete(onVote);
        if (subscribers.size === 0 && timer) {
          clearTimeout(timer);
          timer = null;
        }
      };
    },
  };
}
