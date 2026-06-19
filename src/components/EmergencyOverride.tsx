import { useEffect, useState } from 'react';

export function EmergencyOverride() {
  const [denied, setDenied] = useState(false);

  // Auto-dismiss the denial after a few seconds so it can be re-triggered.
  useEffect(() => {
    if (!denied) return;
    const id = setTimeout(() => setDenied(false), 4500);
    return () => clearTimeout(id);
  }, [denied]);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setDenied(true)}
        className="group relative w-full max-w-sm overflow-hidden rounded-2xl border border-ember/40
          bg-gradient-to-b from-ember/15 to-burgundy/20 px-4 py-4 text-center transition-all
          hover:border-ember/70 hover:shadow-glow-red active:scale-[0.98]"
      >
        {/* Hazard stripe accent */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5 opacity-70"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #c0392b 0 10px, #1a0d0d 10px 20px)',
          }}
        />
        <span className="font-display text-lg uppercase tracking-wide text-red-200">
          🚨 Emergency Andrew Override
        </span>
        <span className="mt-1 block font-cond text-[0.62rem] uppercase tracking-[0.25em] text-red-300/60">
          Authorized personnel only
        </span>
      </button>

      {denied && (
        <div
          role="alert"
          className="w-full max-w-sm animate-shake rounded-2xl border-2 border-ember/70 bg-ember/15
            px-5 py-4 text-center shadow-glow-red"
        >
          <div className="font-display text-2xl uppercase tracking-wide text-red-300">
            ⛔ Access Denied
          </div>
          <p className="mt-1 text-sm text-cream/80">Only Linley can move this market.</p>
        </div>
      )}
    </div>
  );
}
