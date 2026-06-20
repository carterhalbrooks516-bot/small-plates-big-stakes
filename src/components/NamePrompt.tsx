import { useEffect, useRef, useState } from 'react';
import { MAX_NAME_LEN, cleanName } from '../lib/fingerprint';

interface NamePromptProps {
  open: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

/**
 * First-vote gate: collect a public display name before the ballot is cast.
 * Styled to match the BallotReceipt so the two feel like one flow.
 */
export function NamePrompt({ open, onSubmit, onClose }: NamePromptProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset, focus, close on Escape, and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    setValue('');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  if (!open) return null;

  const clean = cleanName(value);
  const canSubmit = clean.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enter your name to vote"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-md"
      />

      <div className="glass-card relative w-full max-w-md animate-scale-in overflow-hidden p-6 text-center sm:p-7">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold/60 bg-gradient-to-b from-gold/25 to-transparent text-2xl">
          ✍️
        </div>

        <h2 className="mt-4 font-display text-3xl uppercase leading-none text-gold-gradient sm:text-[2rem]">
          Enter the Market
        </h2>
        <p className="mx-auto mt-3 max-w-xs text-sm text-cream/75">
          Add your name to the board so the group chat knows who’s in. Everyone can
          see who’s playing.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) onSubmit(clean);
          }}
          className="mt-5"
        >
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={MAX_NAME_LEN}
            placeholder="Your name or handle"
            autoComplete="off"
            className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3.5 text-center font-cond text-lg text-cream
              outline-none transition-colors placeholder:text-cream-dim/50 focus:border-gold/60"
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-4 w-full rounded-2xl bg-gold-sheen px-5 py-4 font-display text-lg uppercase tracking-wide
              text-navy-950 shadow-glow transition-transform active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          >
            Cast My Pick
          </button>
        </form>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 font-cond text-xs uppercase tracking-[0.18em] text-cream-dim transition-colors hover:text-cream"
        >
          Never mind
        </button>
      </div>
    </div>
  );
}
