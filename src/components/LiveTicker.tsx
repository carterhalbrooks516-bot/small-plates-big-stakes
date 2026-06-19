import { TICKER_HEADLINES } from '../data/tickers';
import { Pill } from './Pill';

export function LiveTicker() {
  // Render the headline set twice so the -50% scroll loops seamlessly.
  const Row = () => (
    <div className="flex shrink-0 items-center">
      {TICKER_HEADLINES.map((h, i) => (
        <div key={i} className="flex items-center whitespace-nowrap">
          <span className="font-cond text-xs font-bold uppercase tracking-[0.14em] text-gold-light">
            {h.tag}
          </span>
          <span className="ml-2 text-sm text-cream/85">{h.text}</span>
          <span className="mx-5 text-gold/40">◆</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="glass-card flex items-stretch gap-0 overflow-hidden rounded-2xl p-0">
      {/* Pinned LIVE label */}
      <div className="flex shrink-0 items-center gap-2 border-r border-white/10 bg-ember/15 px-3 sm:px-4">
        <Pill variant="live" dot className="border-transparent !bg-transparent !px-0 text-red-200">
          Live
        </Pill>
      </div>

      {/* Scrolling headlines (pauses on hover/long-press) */}
      <div className="edge-fade relative flex-1 overflow-hidden py-2.5">
        <div className="animate-ticker pause-on-hover flex w-max">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
