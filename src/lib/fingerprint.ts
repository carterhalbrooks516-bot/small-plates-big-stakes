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

/* ── Voter display name ("who's in the market") ──────────────────────────────
 * The public name attached to each ballot. Stored locally so a voter is asked
 * only once, then reused for every market they enter.
 */

const VOTER_NAME_KEY = 'small-plates-voter-name';

/** Longest display name we keep (keeps the roster tidy). */
export const MAX_NAME_LEN = 24;

/** Tidy a raw name: collapse whitespace, trim, and cap the length. */
export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LEN);
}

/** The display name this device chose, or null if they haven't entered yet. */
export function getVoterName(): string | null {
  try {
    const name = localStorage.getItem(VOTER_NAME_KEY);
    return name && name.trim() ? name : null;
  } catch {
    return null;
  }
}

/** Persist a cleaned display name and return the stored value. */
export function saveVoterName(name: string): string {
  const clean = cleanName(name);
  try {
    localStorage.setItem(VOTER_NAME_KEY, clean);
  } catch {
    /* ignore */
  }
  return clean;
}

/** Case-insensitive de-dupe that preserves first-seen order. */
export function dedupeNames(names: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const name of names) {
    const key = name.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out;
}

/** Append `name` to `list` unless an equal (case-insensitive) name is present. */
export function mergeName(list: string[], name: string): string[] {
  const key = name.trim().toLowerCase();
  if (!key || list.some((n) => n.trim().toLowerCase() === key)) return list;
  return [...list, name];
}
