import type { VoteCounts } from '../types';
import { MARKETS } from '../data/markets';

/**
 * The live Linley/Andrew line is the vote-weighted blend of every ballot cast.
 *
 * Each answer carries an "Andrew score" on a 0–100 scale (50 = neutral) for how
 * good that outcome is for Andrew "winning" the date. We average those across
 * every vote to get Andrew's implied win %, with Linley as the other side — so
 * every vote nudges the moneyline, and the favorite/underdog can flip. Options
 * not listed default to a neutral 50.
 */
const ANDREW_SCORE: Record<string, number> = {
  // Venue — mostly vibe; lying about the spot stings.
  'venue-cafe-madrid': 52,
  'venue-barcelona': 56,
  'venue-mystery': 36,
  'venue-chips-salsa': 28,
  // Start time — minor signal.
  'start-time-6pm': 48,
  'start-time-630pm': 53,
  'start-time-7pm': 55,
  'start-time-730pm': 45,
  'start-time-8pm': 50,
  // Duration — longer is better for Andrew.
  'duration-under-60': 15,
  'duration-1-1p5': 34,
  'duration-1p5-2p5': 64,
  'duration-2p5-plus': 80,
  'duration-4-plus': 90,
  // Drinks — two is the sweet spot; zero suspicious, four+ a problem.
  'drinks-0': 42,
  'drinks-1': 58,
  'drinks-2': 75,
  'drinks-3': 40,
  'drinks-4-plus': 18,
  // Opening line — a couple land, several flop.
  'opening-line-smart': 62,
  'opening-line-like-tapas': 45,
  'opening-line-never-been': 48,
  'opening-line-pictures': 36,
  'opening-line-not-weird': 40,
  'opening-line-parking': 30,
  'opening-line-45-minutes': 42,
  'opening-line-your-story': 58,
  // Second date — the headline outcome.
  'second-date-yes': 90,
  'second-date-maybe': 62,
  'second-date-no-educational': 20,
  'second-date-business-days': 46,
  'second-date-andrew-claims': 50,
  // Mrs. Stephens futures — long-term conviction.
  'mrs-stephens-loading': 90,
  'mrs-stephens-upside': 70,
  'mrs-stephens-group-lore': 38,
  'mrs-stephens-6-weeks': 50,
  'mrs-stephens-fumbles': 18,
};

/** Andrew's win % before any votes — keeps the iconic underdog line on an empty board. */
const DEFAULT_ANDREW_PCT = 31;
/** Pseudo-votes of "house" opinion at the default line, damping early swings. */
const ANCHOR = 12;

export type Contender = 'andrew' | 'linley';

export interface MatchupLine {
  /** Andrew's implied win probability, 0–100 (Linley is the complement). */
  andrewPct: number;
  linleyPct: number;
  andrewMoneyline: string;
  linleyMoneyline: string;
  favorite: Contender;
}

/** Convert a win probability (0–100) into an American moneyline string. */
export function toMoneyline(pct: number): string {
  const p = Math.min(0.93, Math.max(0.07, pct / 100));
  if (p > 0.5) {
    const ml = Math.round((100 * p) / (1 - p) / 5) * 5; // favorite → negative
    return `−${ml}`;
  }
  const ml = Math.round((100 * (1 - p)) / p / 5) * 5; // underdog → positive
  return `+${ml}`;
}

/** Blend every cast vote into Andrew's win probability and both moneylines. */
export function computeMatchup(counts: VoteCounts): MatchupLine {
  let weighted = 0;
  let total = 0;
  for (const poll of MARKETS) {
    const pollCounts = counts[poll.id] ?? {};
    for (const opt of poll.options) {
      const c = pollCounts[opt.id] ?? 0;
      if (c <= 0) continue;
      weighted += (ANDREW_SCORE[opt.id] ?? 50) * c;
      total += c;
    }
  }

  const blended = (weighted + DEFAULT_ANDREW_PCT * ANCHOR) / (total + ANCHOR);
  const andrewPct = Math.round(Math.min(82, Math.max(18, blended)));
  const linleyPct = 100 - andrewPct;

  if (andrewPct === linleyPct) {
    // Dead heat — a tidy pick'em line with standard vig.
    return {
      andrewPct,
      linleyPct,
      andrewMoneyline: '−110',
      linleyMoneyline: '+110',
      favorite: 'andrew',
    };
  }

  return {
    andrewPct,
    linleyPct,
    andrewMoneyline: toMoneyline(andrewPct),
    linleyMoneyline: toMoneyline(linleyPct),
    favorite: andrewPct > linleyPct ? 'andrew' : 'linley',
  };
}
