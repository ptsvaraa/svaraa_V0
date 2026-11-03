import { getProfile, verifyOtpAndSignIn } from '@/services/auth/authApi';
import { useSession } from '@/services/auth/session';
import { expireAccessTokens } from '@/services/mocks/db';
import { DEMO_CODE } from '@/services/mocks/routes';
import { calls, INDIA, useMockBackend } from '@/test-utils/backend';

const REFRESH = '/api/v1/auth/refresh';

beforeEach(async () => {
  await useMockBackend();
  await verifyOtpAndSignIn(INDIA, DEMO_CODE);
});

describe('token refresh on 401', () => {
  it('does not refresh while the access token works', async () => {
    await getProfile();
    expect(calls(REFRESH)).toBe(0);
  });

  it('refreshes once, retries the request, and saves the new access token', async () => {
    const before = useSession.getState().accessToken;
    expireAccessTokens();
    const profile = await getProfile();
    expect(profile.id).toBeTruthy();
    expect(calls(REFRESH)).toBe(1);
    expect(calls('/api/v1/users/me')).toBe(2); // the 401, then the retry
    expect(useSession.getState().accessToken).not.toBe(before);
    expect(useSession.getState().status).toBe('signedIn');
  });

  it('several requests failing together share one refresh', async () => {
    expireAccessTokens();
    await Promise.all([getProfile(), getProfile(), getProfile()]);
    expect(calls(REFRESH)).toBe(1);
  });

  it('signs out when the refresh token is no good', async () => {
    expireAccessTokens();
    useSession.setState({ refreshToken: 'not-a-real-token' });
    await expect(getProfile()).rejects.toMatchObject({ code: 'invalid_token' });
    expect(useSession.getState().status).toBe('signedOut');
  });

  it('keeps the session when the refresh fails only because of the connection', async () => {
    expireAccessTokens();
    const real = globalThis.fetch;
    globalThis.fetch = (async (input, init) => {
      if (String(new Request(input as RequestInfo).url).endsWith(REFRESH)) throw new TypeError('offline');
      return real(input, init);
    }) as typeof fetch;
    await expect(getProfile()).rejects.toMatchObject({ code: 'invalid_token' });
    expect(useSession.getState().status).toBe('signedIn');
  });

  it('never refreshes for sign-in calls: a wrong code stays invalid_otp', async () => {
    await expect(verifyOtpAndSignIn(INDIA, '999999')).rejects.toMatchObject({ code: 'invalid_otp' });
    expect(calls(REFRESH)).toBe(0);
  });
});
