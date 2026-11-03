import Constants from 'expo-constants';
import { areaOf, flags } from './flags';

/** Environment settings. Set EXPO_PUBLIC_* in .env (see .env.example). */
export const env = {
  /** Backend host, without /api/v1 (the generated paths already include it). */
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? 'https://api.svaraa.example').replace(/\/$/, ''),
  /** Use mock responses instead of the real backend. On until the backend URL is live. */
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') === 'true',
  /**
   * Endpoints that go to the real backend even while mocks are on, e.g.
   * "POST /api/v1/auth/otp/request,GET /api/v1/users/me". "*" means all of them.
   */
  realEndpoints: (process.env.EXPO_PUBLIC_REAL_ENDPOINTS ?? '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean),
  appVersion: Constants.expoConfig?.version ?? '0.0.0',
};

/**
 * True when this endpoint is answered by the mock backend.
 * Mocks are off for it when: mocks are off for the whole app, or its endpoint is listed in EXPO_PUBLIC_REAL_ENDPOINTS,
 * or its area is switched to 'real' in config/flags.ts.
 */
export function isMocked(method: string, path: string): boolean {
  if (!env.useMocks) return false;
  if (env.realEndpoints.includes('*') || env.realEndpoints.includes(`${method} ${path}`)) return false;
  const area = areaOf(path);
  return !(area && flags[area] === 'real');
}
