import type { ReactNode } from 'react';
import { Avatar } from './Avatar';
import { LinleyAvatar } from './avatars/LinleyAvatar';
import { AndrewAvatar } from './avatars/AndrewAvatar';
import { Pill } from './Pill';

/** A framed avatar medallion + sportsbook-style name plate and moneyline. */
function Contender({
  children,
  name,
  tag,
  moneyline,
  glow,
}: {
  children: ReactNode;
  name: string;
  tag: string;
  moneyline: string;
  glow: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2.5">
      <div
        className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-gold/60 sm:h-40 sm:w-40"
        style={{ boxShadow: `0 0 34px -6px ${glow}` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-burgundy/40 via-navy-800 to-navy-900" />
        <div className="absolute inset-x-0 bottom-0 top-1">{children}</div>
        <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="text-center">
        <div className="font-display text-xl leading-none tracking-wide text-cream sm:text-2xl">
          {name}
        </div>
        <div className="mt-1 font-cond text-[0.6rem] uppercase tracking-[0.2em] text-gold-light/80">
          {tag}
        </div>
        <div className="mt-1.5 inline-block rounded-md border border-white/10 bg-black/40 px-2 py-0.5 font-cond text-sm font-semibold tabular-nums text-cream">
          {moneyline}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <header className="glass-card relative overflow-hidden px-4 pb-6 pt-5 sm:px-7 sm:pb-8 sm:pt-6">
      {/* Warm tapas-bar ambiance: candle glow + faint scattered props */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-amber-warm/20 blur-3xl" />
        <div className="absolute -right-8 bottom-0 h-44 w-44 rounded-full bg-burgundy/40 blur-3xl" />
        <span className="absolute left-4 top-24 text-3xl opacity-10 blur-[1px]">🍷</span>
        <span className="absolute right-6 top-16 text-2xl opacity-10 blur-[1px]">🫒</span>
        <span className="absolute bottom-6 left-10 text-2xl opacity-10 blur-[1px]">🍽️</span>
        <span className="absolute bottom-10 right-12 text-3xl opacity-10 blur-[1px]">🕯️</span>
        <span className="absolute right-1/3 top-6 text-xl opacity-[0.08]">✨</span>
      </div>

      <div className="relative">
        {/* Top status row */}
        <div className="flex items-center justify-between gap-2">
          <Pill variant="live" dot>
            Live Market
          </Pill>
          <Pill variant="gold">Est. Tonight · Dallas</Pill>
        </div>

        {/* Title block */}
        <div className="mt-5 text-center">
          <h1 className="font-display text-[2.6rem] uppercase leading-[0.92] tracking-tight sm:text-7xl">
            <span className="block text-gold-gradient drop-shadow-[0_2px_14px_rgba(212,175,55,0.25)]">
              Small Plates,
            </span>
            <span className="block text-cream">Big Stakes</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md font-cond text-xs uppercase tracking-[0.22em] text-gold-light/90 sm:text-sm">
            Andrew Stephens First Date Futures Exchange
          </p>
          <p className="mx-auto mt-2 max-w-sm text-balance text-sm italic text-cream/65 sm:text-base">
            A first date. A tapas place. A nation watching.
          </p>
        </div>

        {/* Matchup label */}
        <div className="my-5 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="font-cond text-[0.62rem] uppercase tracking-[0.3em] text-cream-dim">
            Tonight’s Matchup
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        {/* Contenders */}
        <div className="flex items-start justify-center gap-2 sm:gap-5">
          <Contender
            name="Linley"
            tag="The Favorite"
            moneyline="−165"
            glow="rgba(16,164,114,0.55)"
          >
            <Avatar imageSrc="assets/linley-avatar.png" alt="Linley" className="h-full w-full">
              <LinleyAvatar className="h-full w-full" />
            </Avatar>
          </Contender>

          <div className="flex flex-col items-center pt-8 sm:pt-12">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-navy-900/80 font-display text-lg text-gold-light shadow-glow sm:h-14 sm:w-14 sm:text-2xl">
              VS
            </div>
          </div>

          <Contender
            name="Andrew"
            tag="The Underdog"
            moneyline="+220"
            glow="rgba(192,57,43,0.55)"
          >
            <Avatar imageSrc="assets/andrew-avatar.png" alt="Andrew" className="h-full w-full">
              <AndrewAvatar className="h-full w-full" />
            </Avatar>
          </Contender>
        </div>

        {/* Venue line */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
          <span className="font-cond text-sm uppercase tracking-[0.2em] text-cream">
            📍 Tapas Night · Dallas, TX
          </span>
        </div>
      </div>
    </header>
  );
}
