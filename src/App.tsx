import { useCallback, useRef, useState } from 'react';
import { MARKETS } from './data/markets';
import { useVotes, type CastOutcome } from './hooks/useVotes';
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

/** Slim "exchange status" bar shown under the ticker. */
function ExchangeStatus({ total, demo }: { total: number; demo: boolean }) {
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
      <div className="ml-auto flex items-baseline gap-1.5">
        <span className="font-cond text-[0.6rem] uppercase tracking-[0.18em] text-cream-dim">
          Ballots
        </span>
        <span className="font-display text-xl tabular-nums text-gold-light">
          {total.toLocaleString()}
        </span>
      </div>
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
      if (outcome.firstEntry && outcome.result === 'ok') {
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
          resolve({ result: 'duplicate', firstEntry: false, cancelled: true });
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
    pending?.resolve({ result: 'duplicate', firstEntry: false, cancelled: true });
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

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-3 py-4 sm:gap-5 sm:px-5 sm:py-6">
      <Hero />
      <LiveTicker />
      <ExchangeStatus total={votes.totalVotes} demo={votes.mode === 'demo'} />
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
        <MarketSummary counts={votes.counts} totalVotes={votes.totalVotes} />
      )}

      <EmergencyOverride />
      <Footer />

      <NamePrompt open={nameModalOpen} onSubmit={submitName} onClose={cancelName} />
      <BallotReceipt open={receiptOpen} onClose={closeReceipt} />
    </div>
  );
}
