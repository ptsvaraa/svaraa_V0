import type { HouseholdCreateIn, PushTokenIn } from '@/services/api/pending';
import type { components } from '@/services/api/schema';
import {
  authenticate,
  createHouseholdFor,
  findOrCreateUser,
  mobileTakenBy,
  openSession,
  otpOnCooldown,
  refreshAccess,
  revokeSession,
  savePushTokenFor,
} from './db';

/** Demo code accepted by the mock backend (the real dev backend also uses it). */
export const DEMO_CODE = '000000';
/** Demo hook: a number ending in 00 signs in as an existing user (is_new = false). */
export const EXISTING_USER_SUFFIX = '00';
/** Demo hook: a number ending in 11 already belongs to another account (409 mobile_number_taken). */
export const TAKEN_NUMBER_SUFFIX = '11';

type S = components['schemas'];
/** `params` holds the values of `{name}` parts of the path, e.g. `{ household_id: 'h1' }`. */
export type MockContext = { body: unknown; headers: Headers; params: Record<string, string> };
export type MockResult = { status: number; body?: unknown };
export type MockRoute = {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT';
  /** Full path, as in docs/openapi.json (includes /api/v1). `{name}` parts match any one segment. */
  path: string;
  respond: (ctx: MockContext) => MockResult;
};

const fail = (status: number, code: string, message: string): MockResult => ({
  status,
  body: { error: { code, message, request_id: 'mock' } },
});
const NO_CONTENT: MockResult = { status: 204 };

/** The `{name}` values when `path` fits the route's pattern, or undefined when it does not. */
export function matchPath(pattern: string, path: string): Record<string, string> | undefined {
  const want = pattern.split('/');
  const got = path.split('/');
  if (want.length !== got.length) return undefined;
  const params: Record<string, string> = {};
  for (let i = 0; i < want.length; i++) {
    const name = /^\{(\w+)\}$/.exec(want[i])?.[1];
    if (name && got[i]) params[name] = decodeURIComponent(got[i]);
    else if (want[i] !== got[i]) return undefined;
  }
  return params;
}

/** Checks the phone fields the way the backend does. Returns the digits, or an error response. */
function readNumber(body: unknown): { number: string } | { error: MockResult } {
  const { country_code, mobile_number } = (body ?? {}) as Partial<S['OtpRequestIn']>;
  const cc = String(country_code ?? '').replace(/^\+/, '');
  if (!/^\d{1,3}$/.test(cc)) return { error: fail(400, 'invalid_country_code', 'Unknown country code') };
  const digits = String(mobile_number ?? '');
  if (!/^\d{7,12}$/.test(digits))
    return { error: fail(400, 'invalid_mobile_number', 'Invalid mobile number') };
  return { number: `+${cc}${digits}` };
}

const API = '/api/v1';

/**
 * The mock backend, as plain data. No library, so it runs everywhere (phone, web, Jest).
 * handlers.ts turns these into MSW handlers; fetchMock.ts serves them on mobile.
 * Shapes follow docs/openapi.json (the real backend, feature/auth-and-user-creation).
 */
export const routes: MockRoute[] = [
  {
    method: 'POST',
    path: `${API}/auth/otp/request`,
    respond: ({ body }) => {
      const n = readNumber(body);
      if ('error' in n) return n.error;
      if (otpOnCooldown(n.number))
        return fail(429, 'otp_cooldown', 'Please wait before requesting another code');
      return NO_CONTENT;
    },
  },
  {
    method: 'POST',
    path: `${API}/auth/otp/verify`,
    respond: ({ body }) => {
      const n = readNumber(body);
      if ('error' in n) return n.error;
      if ((body as S['OtpVerifyIn']).code !== DEMO_CODE)
        return fail(401, 'invalid_otp', 'Incorrect or expired code');
      const { user, isNew } = findOrCreateUser(n.number, n.number.endsWith(EXISTING_USER_SUFFIX));
      user.mobile = n.number;
      const out: S['SignInOut'] = {
        ...openSession(user),
        token_type: 'bearer',
        user_id: user.id,
        is_new: isNew,
      };
      return { status: 200, body: out };
    },
  },
  {
    method: 'POST',
    path: `${API}/auth/google`,
    respond: ({ body }) => {
      const { id_token } = (body ?? {}) as Partial<S['GoogleSignInIn']>;
      if (!id_token) return fail(401, 'invalid_google_token', 'Invalid Google token');
      const { user, isNew } = findOrCreateUser(`google:${id_token}`);
      const out: S['SignInOut'] = {
        ...openSession(user),
        token_type: 'bearer',
        user_id: user.id,
        is_new: isNew,
      };
      return { status: 200, body: out };
    },
  },
  {
    method: 'POST',
    path: `${API}/auth/refresh`,
    respond: ({ body }) => {
      const out = refreshAccess(String((body as Partial<S['RefreshIn']> | undefined)?.refresh_token ?? ''));
      if ('code' in out) return fail(401, out.code, 'Session ended, sign in again');
      return {
        status: 200,
        body: { access_token: out.access_token, token_type: 'bearer' } satisfies S['TokenOut'],
      };
    },
  },
  {
    method: 'POST',
    path: `${API}/auth/logout`,
    respond: ({ headers }) => {
      const auth = authenticate(headers);
      if ('code' in auth) return fail(401, auth.code, 'Invalid or expired token');
      revokeSession(headers);
      return NO_CONTENT;
    },
  },
  {
    method: 'POST',
    path: `${API}/auth/mobile/request`,
    respond: ({ body, headers }) => {
      const auth = authenticate(headers);
      if ('code' in auth) return fail(401, auth.code, 'Invalid or expired token');
      const n = readNumber(body);
      if ('error' in n) return n.error;
      if (n.number.endsWith(TAKEN_NUMBER_SUFFIX) || mobileTakenBy(n.number, auth.user.id))
        return fail(409, 'mobile_number_taken', 'This mobile number belongs to another account');
      if (otpOnCooldown(n.number))
        return fail(429, 'otp_cooldown', 'Please wait before requesting another code');
      return NO_CONTENT;
    },
  },
  {
    method: 'POST',
    path: `${API}/auth/mobile/verify`,
    respond: ({ body, headers }) => {
      const auth = authenticate(headers);
      if ('code' in auth) return fail(401, auth.code, 'Invalid or expired token');
      const n = readNumber(body);
      if ('error' in n) return n.error;
      if ((body as S['OtpVerifyIn']).code !== DEMO_CODE)
        return fail(401, 'invalid_otp', 'Incorrect or expired code');
      if (n.number.endsWith(TAKEN_NUMBER_SUFFIX) || mobileTakenBy(n.number, auth.user.id))
        return fail(409, 'mobile_number_taken', 'This mobile number belongs to another account');
      auth.user.mobile = n.number;
      return NO_CONTENT;
    },
  },
  {
    method: 'GET',
    path: `${API}/users/me`,
    respond: ({ headers }) => {
      const auth = authenticate(headers);
      if ('code' in auth) return fail(401, auth.code, 'Invalid or expired token');
      return { status: 200, body: toProfile(auth.user) };
    },
  },
  {
    method: 'PATCH',
    path: `${API}/users/me`,
    respond: ({ body, headers }) => {
      const auth = authenticate(headers);
      if ('code' in auth) return fail(401, auth.code, 'Invalid or expired token');
      const patch = (body ?? {}) as Partial<S['ProfilePatchIn']>;
      if (patch.display_name !== undefined && patch.display_name !== null) {
        if (!patch.display_name.length || patch.display_name.length > 100)
          return fail(422, 'validation_error', 'Invalid request');
        auth.user.display_name = patch.display_name;
        auth.user.profile_status = 'completed';
      }
      if (patch.avatar_url !== undefined) auth.user.avatar_url = patch.avatar_url;
      return { status: 200, body: toProfile(auth.user) };
    },
  },
  {
    method: 'POST',
    path: `${API}/users/me/profile/skip`,
    respond: ({ headers }) => {
      const auth = authenticate(headers);
      if ('code' in auth) return fail(401, auth.code, 'Invalid or expired token');
      if (auth.user.profile_status === 'pending') auth.user.profile_status = 'skipped';
      return { status: 200, body: toProfile(auth.user) };
    },
  },
  // PENDING BACKEND: create the household with the person's role. Not in docs/openapi.json yet.
  {
    method: 'POST',
    path: `${API}/households`,
    respond: ({ body, headers }) => {
      const auth = authenticate(headers);
      if ('code' in auth) return fail(401, auth.code, 'Invalid or expired token');
      const role = (body as Partial<HouseholdCreateIn> | undefined)?.role;
      if (role !== 'wearer' && role !== 'caregiver') return fail(422, 'validation_error', 'Invalid request');
      return { status: 200, body: createHouseholdFor(auth.user.id, role) };
    },
  },
  // PENDING BACKEND: save this phone's push token. Not in docs/openapi.json yet.
  {
    method: 'POST',
    path: `${API}/devices/push-token`,
    respond: ({ body, headers }) => {
      const auth = authenticate(headers);
      if ('code' in auth) return fail(401, auth.code, 'Invalid or expired token');
      const { token, platform } = (body ?? {}) as Partial<PushTokenIn>;
      if (!token || !platform || !['ios', 'android', 'web'].includes(platform))
        return fail(422, 'validation_error', 'Invalid request');
      savePushTokenFor(auth.user.id, { token, platform });
      return NO_CONTENT;
    },
  },
];

function toProfile(u: {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  profile_status: S['ProfileStatus'];
}): S['ProfileOut'] {
  return {
    id: u.id,
    display_name: u.display_name,
    avatar_url: u.avatar_url,
    profile_status: u.profile_status,
  };
}
