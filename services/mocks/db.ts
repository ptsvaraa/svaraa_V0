import type { components } from '@/services/api/schema';

type Profile = components['schemas']['ProfileOut'];
export type MockUser = Profile & { key: string; mobile?: string };

/** Seconds a number must wait before another code can be requested. Same as the real backend. */
export const OTP_COOLDOWN_MS = 60_000;

/** In-memory state behind the mock backend. Resets whenever the app reloads. */
type Db = {
  counter: number;
  users: Map<string, MockUser>;
  /** access token -> user id */
  access: Map<string, string>;
  /** refresh token -> { user id, revoked } */
  refresh: Map<string, { userId: string; revoked: boolean }>;
  otpAskedAt: Map<string, number>;
};

const fresh = (): Db => ({
  counter: 0,
  users: new Map(),
  access: new Map(),
  refresh: new Map(),
  otpAskedAt: new Map(),
});
let db = fresh();

/**
 * Ids must differ every time the app reloads. The phone keeps per-user values (such as the verified mobile number)
 * across reloads while this mock database starts empty, so ids that repeat would make a brand-new mock user
 * look like one who had already added a phone.
 */
const newRun = () => Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
let run = newRun();
const uuid = (n: number) => `${run}-0000-4000-8000-${String(n).padStart(12, '0')}`;

/** Empty the mock backend. `reload: true` also acts like an app reload: new users get ids that were never used before. */
export function resetMockDb(options?: { reload?: boolean }): void {
  db = fresh();
  if (options?.reload) run = newRun();
}

/** Finds the user for this key (a phone number or a Google token), creating one on first use. */
export function findOrCreateUser(key: string, existing = false): { user: MockUser; isNew: boolean } {
  const found = db.users.get(key);
  if (found) return { user: found, isNew: false };
  const user: MockUser = {
    key,
    id: uuid(++db.counter),
    display_name: null,
    avatar_url: null,
    profile_status: 'pending',
  };
  db.users.set(key, user);
  return { user, isNew: !existing };
}

export function openSession(user: MockUser): { access_token: string; refresh_token: string } {
  const n = ++db.counter;
  const access_token = `mock-access-${n}`;
  const refresh_token = `mock-refresh-${n}`;
  db.access.set(access_token, user.id);
  db.refresh.set(refresh_token, { userId: user.id, revoked: false });
  return { access_token, refresh_token };
}

const userById = (id: string) => [...db.users.values()].find((u) => u.id === id);

/** The user for `Authorization: Bearer <token>`, or why there is none. */
export function authenticate(
  headers: Headers,
): { user: MockUser } | { code: 'missing_token' | 'invalid_token' } {
  const token = /^Bearer (.+)$/i.exec(headers.get('authorization') ?? '')?.[1];
  if (!token) return { code: 'missing_token' };
  const id = db.access.get(token);
  const user = id ? userById(id) : undefined;
  return user ? { user } : { code: 'invalid_token' };
}

export function refreshAccess(
  refreshToken: string,
): { access_token: string } | { code: 'invalid_token' | 'session_revoked' } {
  const r = db.refresh.get(refreshToken);
  if (!r) return { code: 'invalid_token' };
  if (r.revoked) return { code: 'session_revoked' };
  const access_token = `mock-access-${++db.counter}`;
  db.access.set(access_token, r.userId);
  return { access_token };
}

/** Ends the session that owns this access token. */
export function revokeSession(headers: Headers): void {
  const token = /^Bearer (.+)$/i.exec(headers.get('authorization') ?? '')?.[1];
  const userId = token ? db.access.get(token) : undefined;
  if (token) db.access.delete(token);
  for (const r of db.refresh.values()) if (r.userId === userId) r.revoked = true;
}

/** For tests and dev: every access token stops working, as if it had expired. */
export function expireAccessTokens(): void {
  db.access.clear();
}

/** True if a code was requested for this number less than 60 s ago; otherwise records this request. */
export function otpOnCooldown(number: string, now = Date.now()): boolean {
  const last = db.otpAskedAt.get(number);
  if (last !== undefined && now - last < OTP_COOLDOWN_MS) return true;
  db.otpAskedAt.set(number, now);
  return false;
}

export function mobileTakenBy(number: string, userId: string): boolean {
  return [...db.users.values()].some((u) => u.mobile === number && u.id !== userId);
}
