import { useEffect, useState } from 'react';

interface ResultsBarProps {
  label: string;
  count: number;
  pct: number;
  isLeader: boolean;
  isMine: boolean;
  /** Stagger index for a cascading reveal. */
  index?: number;
}

export function ResultsBar({ label, count, pct, isLeader, isMine, index = 0 }: ResultsBarProps) {
  // Grow the bar from 0 on mount (and animate smoothly on live updates).
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  const fill = isLeader
    ? 'bg-gold-sheen'
    : isMine
      ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
      : 'bg-wine-sheen';

  return (
    <div
      className={`rounded-xl border px-3 py-2.5 transition-colors ${
        isMine
          ? 'border-gold/50 bg-gold/[0.07]'
          : 'border-white/5 bg-black/20'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5">
          {isMine && <span className="text-gold-light">✓</span>}
          <span className="truncate text-sm text-cream/90">{label}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isLeader && (
            <span className="rounded bg-gold/15 px-1.5 py-0.5 font-cond text-[0.55rem] font-bold uppercase tracking-wider text-gold-light">
              ★ Favorite
            </span>
          )}
          {isMine && !isLeader && (
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-cond text-[0.55rem] font-bold uppercase tracking-wider text-emerald-200">
              Your Pick
            </span>
          )}
          <span className="font-cond text-base font-bold tabular-nums text-cream">
            {pct.toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/50 ring-1 ring-inset ring-white/5">
          <div
            className={`relative h-full rounded-full ${fill}`}
            style={{
              width: `${width}%`,
              transition: 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${index * 60}ms`,
            }}
          >
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
        <span className="w-10 shrink-0 text-right font-cond text-xs tabular-nums text-cream-dim">
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
