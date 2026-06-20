import { useEffect } from 'react';

interface BallotReceiptProps {
  open: boolean;
  onClose: () => void;
}

const RISK_EXPOSURE: { label: string; status: string; tone: string }[] = [
  { label: 'Opening line disaster', status: 'Fully priced in', tone: 'text-gold-light' },
  { label: 'Tapas confidence', status: 'Pending', tone: 'text-amber-glow' },
  { label: 'Second date upside', status: 'Volatile', tone: 'text-orange-300' },
  { label: 'Group chat pressure', status: 'Extreme', tone: 'text-red-300' },
];

export function BallotReceipt({ open, onClose }: BallotReceiptProps) {
  // Close on Escape + lock background scroll while the receipt is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ballot submitted"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-md"
      />

      <div className="glass-card relative w-full max-w-md animate-scale-in overflow-hidden p-6 text-center sm:p-7">
        {/* Diagonal "submitted" stamp */}
        <div className="pointer-events-none absolute -right-10 top-5 rotate-[18deg] rounded border-2 border-emerald-400/60 px-6 py-1 font-cond text-xs font-bold uppercase tracking-[0.3em] text-emerald-300/80">
          Confirmed
        </div>

        {/* Check badge */}
        <div className="mx-auto flex h-16 w-16 animate-glow-pulse items-center justify-center rounded-full border-2 border-gold/60 bg-gradient-to-b from-gold/25 to-transparent text-3xl">
          ✓
        </div>

        <h2 className="mt-4 font-display text-3xl uppercase leading-none text-gold-gradient sm:text-4xl">
          Ballot Submitted
        </h2>
        <p className="mx-auto mt-3 max-w-xs text-sm text-cream/75">
          Your full ballot is in — all seven markets called on the{' '}
          <span className="text-cream">Andrew Stephens First Date Futures Exchange</span>.
        </p>

        {/* Risk exposure readout */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 text-left">
          <div className="mb-2 flex items-center justify-between border-b border-dashed border-white/15 pb-2">
            <span className="font-cond text-[0.62rem] uppercase tracking-[0.24em] text-gold-light/80">
              Risk Exposure
            </span>
            <span className="font-cond text-[0.62rem] uppercase tracking-[0.2em] text-cream-dim">
              Position #{Math.floor(1000 + Math.random() * 9000)}
            </span>
          </div>
          <ul className="space-y-2">
            {RISK_EXPOSURE.map((r) => (
              <li key={r.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-cream/80">{r.label}</span>
                <span className={`font-cond font-semibold uppercase tracking-wide ${r.tone}`}>
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-gold-sheen px-5 py-4 font-display text-lg uppercase tracking-wide
            text-navy-950 shadow-glow transition-transform active:scale-[0.98]"
        >
          View Live Board
        </button>
        <p className="mt-3 text-[0.7rem] text-cream-dim">
          Positions are final-ish. The board does not offer refunds, only opinions.
        </p>
      </div>
    </div>
  );
}
