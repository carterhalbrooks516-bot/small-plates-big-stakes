import { useCallback, useMemo, useRef, useState } from 'react';
import { MARKETS } from './data/markets';
import { useVotes, type CastOutcome } from './hooks/useVotes';
import { computeMatchup } from './lib/odds';
import { getVoterName, saveVoterName } from './lib/fingerprint';
import { Hero } from './components/Hero';
import { LiveTicker } from './components/LiveTicker';
import { MarketCard } from './components/MarketCard';
import { MarketSummary } from './components/MarketSummary';
import { BallotReceipt } from './components/BallotReceipt';
import { NamePrompt } from './components/NamePrompt';
import { VotersStrip } from './components/VotersStrip';
import { EmergencyOverride } from './components/EmergencyOverride';
import { Pill } from './components/Pill';

/** A small labeled number used in the exchange status bar. */
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="font-cond text-[0.6rem] uppercase tracking-[0.18em] text-cream-dim">
        {label}
      </span>
      <span className="font-display text-xl tabular-nums text-gold-light">
        {value.toLocaleString()}
      </span>
    </span>
  );
}

/** Slim "exchange status" bar shown under the ticker. */
function ExchangeStatus({
  votes,
  ballots,
  demo,
}: {
  votes: number;
  ballots: number;
  demo: boolean;
}) {
  return (
    <div className="glass-card flex flex-wrap items-center gap-x-2 gap-y-2 rounded-2xl px-3.5 py-3">
      <Pill variant="green" dot>
        Market Open
      </Pill>
      <Pill variant="gold">Group Chat Odds</Pill>
      <Pill variant="neutral">🔒 Locks at Date Start</Pill>
      {demo ? (
        <Pill variant="wine">Demo Data</Pill>
      ) : (
        <Pill variant="green">Live Data</Pill>
      )}
      <div className="ml-auto flex items-baseline gap-3">
        <Stat label="Votes" value={votes} />
        <span className="h-4 w-px self-center bg-white/10" aria-hidden />
        <Stat label="Ballots" value={ballots} />
      </div>
    </div>
  );
}

/** Per-device ballot completion nudge: answer every market to lock a ballot. */
function BallotProgress({ answered, total }: { answered: number; total: number }) {
  if (answered <= 0) return null;
  const done = answered >= total;
  const pct = Math.round((Math.min(answered, total) / total) * 100);
  return (
    <div className="glass-card flex items-center gap-3 rounded-2xl px-3.5 py-2.5">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/40 ring-1 ring-inset ring-white/5">
        <div
          className={`h-full rounded-full ${
            done ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gold-sheen'
          }`}
          style={{ width: `${pct}%`, transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </div>
      <span className="shrink-0 font-cond text-[0.62rem] uppercase tracking-[0.16em]">
        {done ? (
          <span className="text-emerald-300">✓ Ballot locked · {total}/{total}</span>
        ) : (
          <span className="text-cream-dim">
            Ballot {answered}/{total} ·{' '}
            <span className="text-gold-light">finish to lock it in</span>
          </span>
        )}
      </span>
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass-card animate-pulse p-5">
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="mt-3 h-6 w-3/4 rounded bg-white/10" />
          <div className="mt-5 space-y-2.5">
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="h-12 rounded-2xl bg-white/[0.06]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="glass-card p-6 text-center">
      <div className="text-4xl">📉</div>
      <h3 className="mt-2 font-display text-2xl text-cream">The Board Went Dark</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-cream/65">
        We couldn’t reach the exchange. The group chat is, as always, the only thing still running.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-2xl bg-gold-sheen px-6 py-3.5 font-display text-base uppercase tracking-wide text-navy-950 shadow-glow transition-transform active:scale-[0.98]"
      >
        Reconnect to Market
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="px-2 pb-6 pt-2 text-center">
      <p className="mx-auto max-w-md text-pretty text-xs leading-relaxed text-cream-dim/80">
        Not affiliated with Andrew Stephens, Linley, tapas, romance, or common sense.
      </p>
    </footer>
  );
}

export default function App() {
  const votes = useVotes();
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [voterName, setVoterName] = useState<string | null>(() => getVoterName());
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const pendingVote = useRef<{
    pollId: string;
    optionId: string;
    resolve: (outcome: CastOutcome) => void;
  } | null>(null);

  const doVote = useCallback(
    async (pollId: string, optionId: string): Promise<CastOutcome> => {
      const outcome = await votes.castVote(pollId, optionId);
      // The receipt prints when a voter completes their full ballot (all markets).
      if (outcome.result === 'ok' && outcome.ballotComplete) {
        setReceiptOpen(true);
      }
      return outcome;
    },
    [votes],
  );

  // First-time voters name themselves before their ballot is cast. The pending
  // pick is held until they submit (or dismissed if they back out).
  const handleVote = useCallback(
    (pollId: string, optionId: string): Promise<CastOutcome> => {
      if (!getVoterName()) {
        return new Promise<CastOutcome>((resolve) => {
          pendingVote.current = { pollId, optionId, resolve };
          setNameModalOpen(true);
        });
      }
      return doVote(pollId, optionId);
    },
    [doVote],
  );

  const submitName = useCallback(
    (name: string) => {
      const clean = saveVoterName(name);
      setVoterName(clean);
      setNameModalOpen(false);
      const pending = pendingVote.current;
      pendingVote.current = null;
      if (!pending) return;
      const { pollId, optionId, resolve } = pending;
      // Always resolve the deferred pick so the market card can't hang — even if
      // the vote errors, its own errored state drives the inline retry banner.
      void (async () => {
        try {
          resolve(await doVote(pollId, optionId));
        } catch {
          resolve({ result: 'duplicate', firstEntry: false, ballotComplete: false, cancelled: true });
        }
      })();
    },
    [doVote],
  );

  const cancelName = useCallback(() => {
    setNameModalOpen(false);
    const pending = pendingVote.current;
    pendingVote.current = null;
    // Resolve the deferred pick as a no-op so the market card re-enables.
    pending?.resolve({
      result: 'duplicate',
      firstEntry: false,
      ballotComplete: false,
      cancelled: true,
    });
  }, []);

  const closeReceipt = useCallback(() => {
    setReceiptOpen(false);
    // Send the freshly-minted bettor straight to the live board.
    requestAnimationFrame(() => {
      document.getElementById('live-board')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, []);

  // Live Linley/Andrew line, blended from every vote on the board.
  const matchup = useMemo(() => computeMatchup(votes.counts), [votes.counts]);
  const myAnswered = Object.keys(votes.myVotes).length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-3 py-4 sm:gap-5 sm:px-5 sm:py-6">
      <Hero matchup={matchup} />
      <LiveTicker />
      <ExchangeStatus
        votes={votes.totalVotes}
        ballots={votes.completedBallots}
        demo={votes.mode === 'demo'}
      />
      <BallotProgress answered={myAnswered} total={MARKETS.length} />
      <VotersStrip voters={votes.voters} you={voterName} />

      <main id="live-board" className="flex scroll-mt-3 flex-col gap-4 sm:gap-5">
        {votes.loadState === 'error' ? (
          <ErrorState onRetry={votes.retry} />
        ) : votes.loadState === 'loading' ? (
          <BoardSkeleton />
        ) : (
          MARKETS.map((poll, i) => (
            <MarketCard
              key={poll.id}
              poll={poll}
              number={i + 1}
              pollCounts={votes.counts[poll.id] ?? {}}
              myVote={votes.myVotes[poll.id]}
              errored={votes.errorPollId === poll.id}
              onVote={(optionId) => handleVote(poll.id, optionId)}
            />
          ))
        )}
      </main>

      {votes.loadState === 'ready' && (
        <MarketSummary
          counts={votes.counts}
          totalVotes={votes.totalVotes}
          completedBallots={votes.completedBallots}
        />
      )}

      <EmergencyOverride />
      <Footer />

      <NamePrompt open={nameModalOpen} onSubmit={submitName} onClose={cancelName} />
      <BallotReceipt open={receiptOpen} onClose={closeReceipt} />
    </div>
  );
}
