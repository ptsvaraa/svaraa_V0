import { env } from '@/config/env';
import { useSession } from '@/services/auth/session';
import { SESSION_ENDED_CODES, toApiError } from './errors';

/** Sign-in calls carry no token and are never retried. */
const PUBLIC = /\/api\/v1\/auth\/(otp\/(request|verify)|google|refresh)$/;

const rawFetch: typeof fetch = (input, init) => globalThis.fetch(input, init);

let inflight: Promise<boolean> | null = null;

/**
 * Get a new access token with the refresh token. Many requests can fail with 401 at the same moment;
 * they all wait for this one call. Returns true when a new access token is saved.
 * Ends the session only when the server says the refresh token is no good; a bad connection keeps it.
 */
export function refreshAccessToken(): Promise<boolean> {
  inflight ??= doRefresh().finally(() => {
    inflight = null;
  });
  return inflight;
}

async function doRefresh(): Promise<boolean> {
  const session = useSession.getState();
  if (!session.refreshToken) return false;
  try {
    const res = await rawFetch(`${env.apiUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refreshToken }),
    });
    if (res.ok) {
      const data = (await res.json()) as { access_token: string };
      await session.setAccessToken(data.access_token);
      return true;
    }
    const error = toApiError(await res.json().catch(() => undefined), res.status);
    if (res.status === 401 || SESSION_ENDED_CODES.includes(error.code)) await session.clear();
    return false;
  } catch {
    return false; // no connection: keep the session and let the caller show the 401
  }
}

/**
 * fetch for the API client: adds the bearer token, and on a 401 refreshes once and retries the request once.
 * If the refresh fails the session is cleared and the auth guard sends the person to sign-in.
 */
export const authedFetch: typeof fetch = async (input, init) => {
  const base = new Request(input as RequestInfo, init);
  const isPublic = PUBLIC.test(new URL(base.url).pathname);
  const send = (token?: string) => {
    const req = base.clone();
    if (token) req.headers.set('authorization', `Bearer ${token}`);
    return rawFetch(req);
  };

  const used = isPublic ? undefined : useSession.getState().accessToken;
  const res = await send(used);
  if (res.status !== 401 || isPublic || !useSession.getState().refreshToken) return res;

  // Another request may already have refreshed while this one was in flight.
  const current = useSession.getState().accessToken;
  if (current === used && !(await refreshAccessToken())) return res;
  const fresh = useSession.getState().accessToken;
  return fresh ? send(fresh) : res;
};
