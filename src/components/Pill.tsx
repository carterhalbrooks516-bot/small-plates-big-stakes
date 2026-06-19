import type { ReactNode } from 'react';

type PillVariant = 'live' | 'gold' | 'wine' | 'green' | 'neutral';

const VARIANTS: Record<PillVariant, string> = {
  live: 'border-ember/50 bg-ember/15 text-red-200',
  gold: 'border-gold/40 bg-gold/10 text-gold-light',
  wine: 'border-burgundy-light/50 bg-burgundy/25 text-cream',
  green: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  neutral: 'border-white/15 bg-white/5 text-cream-dim',
};

interface PillProps {
  children: ReactNode;
  variant?: PillVariant;
  /** Show a pulsing status dot (great for LIVE / MARKET OPEN). */
  dot?: boolean;
  className?: string;
}

/** Small all-caps sportsbook-style status label. */
export function Pill({ children, variant = 'neutral', dot = false, className = '' }: PillProps) {
  return (
    <span className={`pill ${VARIANTS[variant]} ${className}`}>
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-current" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
