/**
 * Lightweight, privacy-friendly "fingerprint" for casual duplicate-vote
 * prevention. This is NOT security — it's just a random id persisted in
 * localStorage so the same browser is recognized across reloads. Combined with
 * the per-poll localStorage guard and the DB unique constraint, it stops casual
 * double-voting (clearing storage or switching devices will, of course, reset).
 */

const FINGERPRINT_KEY = 'small-plates-fingerprint';

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers.
  return 'fp-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getFingerprint(): string {
  try {
    let fp = localStorage.getItem(FINGERPRINT_KEY);
    if (!fp) {
      fp = randomId();
      localStorage.setItem(FINGERPRINT_KEY, fp);
    }
    return fp;
  } catch {
    // localStorage blocked (private mode etc.) — fall back to an ephemeral id.
    return randomId();
  }
}

/** localStorage key recording which option this device chose for a poll. */
export const voteKey = (pollId: string) => `small-plates-vote-${pollId}`;

/** Flag marking that this device has entered the market (cast its first vote). */
export const ENTERED_KEY = 'small-plates-entered';

export function readMyVotes(pollIds: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  try {
    for (const id of pollIds) {
      const choice = localStorage.getItem(voteKey(id));
      if (choice) result[id] = choice;
    }
  } catch {
    /* ignore */
  }
  return result;
}

export function rememberVote(pollId: string, optionId: string): void {
  try {
    localStorage.setItem(voteKey(pollId), optionId);
  } catch {
    /* ignore */
  }
}

/** Undo a remembered vote (used to roll back when a vote fails to save). */
export function forgetVote(pollId: string): void {
  try {
    localStorage.removeItem(voteKey(pollId));
  } catch {
    /* ignore */
  }
}

export function hasEntered(): boolean {
  try {
    return localStorage.getItem(ENTERED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markEntered(): void {
  try {
    localStorage.setItem(ENTERED_KEY, 'true');
  } catch {
    /* ignore */
  }
}
