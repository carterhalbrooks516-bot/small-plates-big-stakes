import { useState } from 'react';
import type { Poll } from '../types';
import type { CastOutcome } from '../hooks/useVotes';
import { percent } from '../lib/counts';
import { VoteOption } from './VoteOption';
import { ResultsBar } from './ResultsBar';
import { Pill } from './Pill';

interface MarketCardProps {
  poll: Poll;
  /** 1-based market number for the header. */
  number: number;
  pollCounts: Record<string, number>;
  myVote?: string;
  errored: boolean;
  onVote: (optionId: string) => Promise<CastOutcome>;
}

export function MarketCard({ poll, number, pollCounts, myVote, errored, onVote }: MarketCardProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const voted = Boolean(myVote);

  const entries = poll.options.map((o) => ({ ...o, count: pollCounts[o.id] ?? 0 }));
  const total = entries.reduce((sum, e) => sum + e.count, 0);
  const maxCount = Math.max(0, ...entries.map((e) => e.count));
  const leaderId = total > 0 ? entries.find((e) => e.count === maxCount)?.id : undefined;

  async function handleVote(optionId: string) {
    if (pendingId || voted) return;
    setPendingId(optionId);
    try {
      await onVote(optionId);
    } catch {
      /* error surfaced via `errored` prop; option list re-enables for retry */
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="glass-card scroll-mt-4 p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-cond text-[0.62rem] uppercase tracking-[0.2em] text-gold-light/80">
            <span className="rounded bg-gold/10 px-1.5 py-0.5 tabular-nums text-gold-light">
              Market {String(number).padStart(2, '0')}
            </span>
            <span className="truncate text-cream-dim">{poll.title}</span>
          </div>
          <h3 className="mt-1.5 text-pretty font-display text-xl leading-tight text-cream sm:text-2xl">
            {poll.question}
          </h3>
        </div>
        <div className="shrink-0 text-3xl sm:text-4xl" aria-hidden>
          {poll.icon}
        </div>
      </div>

      {/* Status pills */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Pill variant="gold">Group Chat Odds</Pill>
        <Pill variant="neutral">🔒 Locks at Date Start</Pill>
        {voted ? (
          <Pill variant="green" dot>
            Results Live
          </Pill>
        ) : (
          <Pill variant="wine" dot>
            Market Open
          </Pill>
        )}
        <span className="ml-auto font-cond text-xs tabular-nums text-cream-dim">
          {total.toLocaleString()} {total === 1 ? 'ballot' : 'ballots'}
        </span>
      </div>

      {/* Error banner */}
      {errored && !voted && (
        <div className="mt-3 rounded-xl border border-ember/40 bg-ember/10 px-3 py-2 text-sm text-red-200">
          That vote didn’t go through. Tap your pick again to retry.
        </div>
      )}

      {/* Body: vote options OR live results */}
      <div className="mt-4">
        {!voted ? (
          <div className="flex flex-col gap-2.5">
            {poll.options.map((opt, i) => (
              <VoteOption
                key={opt.id}
                index={i}
                label={opt.label}
                pending={pendingId === opt.id}
                disabled={pendingId !== null}
                onVote={() => handleVote(opt.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex animate-scale-in flex-col gap-2">
            {entries.map((e, i) => (
              <ResultsBar
                key={e.id}
                index={i}
                label={e.label}
                count={e.count}
                pct={percent(e.count, total)}
                isLeader={e.id === leaderId}
                isMine={e.id === myVote}
              />
            ))}
            <p className="mt-1 text-center font-cond text-[0.65rem] uppercase tracking-[0.18em] text-cream-dim">
              Position locked · updates live as the chat votes
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
