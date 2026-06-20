import type { VoteCounts } from '../types';
import { MARKETS } from '../data/markets';
import { leaderOption } from '../lib/counts';
import { Pill } from './Pill';

interface MarketSummaryProps {
  counts: VoteCounts;
  totalVotes: number;
  completedBallots: number;
}

export function MarketSummary({ counts, totalVotes, completedBallots }: MarketSummaryProps) {
  return (
    <section className="glass-card overflow-hidden p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-cond text-[0.62rem] uppercase tracking-[0.24em] text-gold-light/80">
            Mission Control
          </div>
          <h2 className="font-display text-2xl uppercase leading-none text-cream sm:text-3xl">
            Market Summary
          </h2>
        </div>
        <Pill variant="live" dot>
          Live Board
        </Pill>
      </div>

      <p className="mt-2 text-sm text-cream/60">
        The group chat’s current consensus across all open markets. Updates in real time.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {MARKETS.map((poll) => {
          const leader = leaderOption(poll, counts);
          return (
            <div key={poll.id} className="stat-tile">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-cond text-[0.62rem] uppercase tracking-[0.16em] text-cream-dim">
                  <span aria-hidden>{poll.icon}</span>
                  {poll.summaryLabel}
                </span>
                {leader && (
                  <span className="rounded bg-gold/15 px-1.5 py-0.5 font-cond text-[0.62rem] font-bold tabular-nums text-gold-light">
                    {leader.pct.toFixed(0)}%
                  </span>
                )}
              </div>
              <div className="mt-1.5 line-clamp-2 text-[0.95rem] font-semibold leading-snug text-cream">
                {leader ? leader.option.label : 'Awaiting first votes…'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <div className="flex items-center justify-between rounded-2xl border border-gold/20 bg-gradient-to-r from-burgundy/30 to-navy-800/60 px-4 py-3">
          <span className="font-cond text-xs uppercase tracking-[0.2em] text-cream-dim">
            Votes Cast
          </span>
          <span className="font-display text-2xl tabular-nums text-gold-light sm:text-3xl">
            {totalVotes.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-gold/20 bg-gradient-to-r from-navy-800/60 to-burgundy/30 px-4 py-3">
          <span className="font-cond text-xs uppercase tracking-[0.2em] text-cream-dim">
            Ballots In
          </span>
          <span className="font-display text-2xl tabular-nums text-gold-light sm:text-3xl">
            {completedBallots.toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
}
