import type { VoteCounts } from '../types';
import type { MatchupLine } from './odds';
import { MARKETS } from '../data/markets';
import { leaderOption } from './counts';
import { TICKER_HEADLINES } from '../data/tickers';

export interface Headline {
  tag: string;
  text: string;
}

/** Build a "{leader} at {pct}%" headline for one market, or null if no votes. */
function leaderHeadline(
  pollId: string,
  tag: string,
  phrase: (label: string, pct: number) => string,
  counts: VoteCounts,
): Headline | null {
  const poll = MARKETS.find((p) => p.id === pollId);
  if (!poll) return null;
  const leader = leaderOption(poll, counts);
  if (!leader) return null;
  return { tag, text: phrase(leader.option.label, Math.round(leader.pct)) };
}

/**
 * The live ticker: lead with the current Linley/Andrew line and the board's
 * consensus, then keep a few evergreen flavor headlines for personality. Rebuilt
 * whenever the counts change, so it always matches the odds on screen.
 */
export function buildTickerHeadlines(
  matchup: MatchupLine,
  counts: VoteCounts,
  totalVotes: number,
  completedBallots: number,
): Headline[] {
  const live: Headline[] = [];
  const { andrewPct, favorite, andrewMoneyline, linleyMoneyline } = matchup;

  // Headline odds line.
  if (Math.abs(andrewPct - 50) <= 2) {
    live.push({
      tag: 'LIVE ODDS',
      text: `Linley ${linleyMoneyline} / Andrew ${andrewMoneyline} — tonight is a coin flip and nobody is safe.`,
    });
  } else if (favorite === 'andrew') {
    live.push({
      tag: 'LIVE ODDS',
      text: `Andrew has seized the favorite tag at ${andrewMoneyline}. The group chat has officially lost the plot.`,
    });
  } else {
    live.push({
      tag: 'LIVE ODDS',
      text: `Linley holds as the favorite at ${linleyMoneyline}; Andrew lingers at ${andrewMoneyline}.`,
    });
  }

  // Implied read on Andrew.
  live.push({
    tag: 'IMPLIED',
    text: `The board gives Andrew a ${andrewPct}% chance the date actually lands.`,
  });

  // Current market leaders.
  const venue = leaderHeadline('venue', 'MARKET ALERT', (l, p) => `${l} leads the venue market at ${p}%.`, counts);
  if (venue) live.push(venue);

  const drinks = leaderHeadline(
    'drinks',
    'ANALYST NOTE',
    (l, p) => `Andrew Beverage Index projecting “${l}” (${p}%).`,
    counts,
  );
  if (drinks) live.push(drinks);

  const second = leaderHeadline(
    'second-date',
    'FUTURES',
    (l, p) => `Second-date market: “${l}” out front at ${p}%.`,
    counts,
  );
  if (second) live.push(second);

  const mrs = leaderHeadline(
    'mrs-stephens',
    'LONG-TERM',
    (l, p) => `Mrs. Stephens futures favor “${l}” (${p}%).`,
    counts,
  );
  if (mrs) live.push(mrs);

  // Volume.
  if (totalVotes > 0) {
    live.push({
      tag: 'VOLUME',
      text: `${totalVotes.toLocaleString()} votes in · ${completedBallots.toLocaleString()} full ${
        completedBallots === 1 ? 'ballot' : 'ballots'
      } locked.`,
    });
  }

  return [...live, ...TICKER_HEADLINES];
}
