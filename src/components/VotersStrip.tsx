interface VotersStripProps {
  voters: string[];
  /** The current device's own name, highlighted in the roster. */
  you?: string | null;
}

const MAX_SHOWN = 80;

/** "Who's in the market" — the live roster of everyone who has cast a ballot. */
export function VotersStrip({ voters, you }: VotersStripProps) {
  if (voters.length === 0) return null;

  const youKey = you?.trim().toLowerCase();
  const shown = voters.slice(0, MAX_SHOWN);
  const overflow = voters.length - shown.length;

  return (
    <section className="glass-card rounded-2xl px-3.5 py-3">
      <div className="flex items-center justify-between">
        <span className="font-cond text-[0.62rem] uppercase tracking-[0.22em] text-gold-light/80">
          In the Market
        </span>
        <span className="font-cond text-[0.62rem] uppercase tracking-[0.18em] text-cream-dim">
          <span className="tabular-nums text-gold-light">{voters.length}</span>{' '}
          {voters.length === 1 ? 'player' : 'players'}
        </span>
      </div>

      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {shown.map((name, i) => {
          const isYou = youKey !== undefined && name.trim().toLowerCase() === youKey;
          return (
            <li
              key={`${name}-${i}`}
              className={
                isYou
                  ? 'rounded-full border border-gold/50 bg-gold/15 px-2.5 py-1 font-cond text-xs text-gold-light'
                  : 'rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 font-cond text-xs text-cream/85'
              }
            >
              {name}
              {isYou && <span className="text-gold-light/70"> · you</span>}
            </li>
          );
        })}
        {overflow > 0 && (
          <li className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-cond text-xs text-cream-dim">
            +{overflow} more
          </li>
        )}
      </ul>
    </section>
  );
}
