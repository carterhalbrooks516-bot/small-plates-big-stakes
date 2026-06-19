interface VoteOptionProps {
  label: string;
  index: number;
  onVote: () => void;
  disabled?: boolean;
  pending?: boolean;
}

export function VoteOption({ label, index, onVote, disabled, pending }: VoteOptionProps) {
  const letter = String.fromCharCode(65 + index); // A, B, C, ...

  return (
    <button
      type="button"
      onClick={onVote}
      disabled={disabled}
      style={{ animationDelay: `${index * 45}ms` }}
      className="group flex w-full animate-fade-up items-center gap-3 rounded-2xl border border-white/10
        bg-white/[0.04] px-3.5 py-3.5 text-left transition-all duration-150
        hover:border-gold/40 hover:bg-white/[0.07] hover:shadow-glow
        active:scale-[0.98] active:bg-gold/10
        disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100
        min-h-[3.5rem] sm:min-h-[3.75rem]"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gold/30
          bg-navy-900/70 font-display text-base text-gold-light transition-colors
          group-hover:border-gold/60 group-hover:bg-gold/10"
      >
        {pending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-light/40 border-t-gold-light" />
        ) : (
          letter
        )}
      </span>

      <span className="flex-1 text-[0.95rem] font-medium leading-snug text-cream">{label}</span>

      <span
        className="shrink-0 font-cond text-[0.6rem] font-bold uppercase tracking-[0.15em] text-cream-dim
          opacity-0 transition-opacity group-hover:opacity-100"
      >
        Back ›
      </span>
    </button>
  );
}
