import type { components } from '@/services/api/schema';

/** Demo code accepted by the mock backend. */
export const DEMO_CODE = '000000';

export const circles: components['schemas']['Circle'][] = [
  { id: 'c1', name: 'Amma', status: 'connected' },
  { id: 'c2', name: 'Appa', status: 'low_battery' },
];

export type MockRoute = {
  method: 'GET' | 'POST';
  path: string;
  respond: (body: unknown) => { status: number; body: unknown };
};

/**
 * The mock backend, as plain data. No library, so it runs everywhere (phone, web, Jest).
 * handlers.ts turns these into MSW handlers; fetchMock.ts serves them on mobile.
 */
export const routes: MockRoute[] = [
  { method: 'POST', path: '/auth/otp/send', respond: () => ({ status: 200, body: { cooldownSec: 30 } }) },
  {
    method: 'POST',
    path: '/auth/otp/verify',
    respond: (body) => {
      const { code } = (body ?? {}) as Partial<components['schemas']['OtpVerifyRequest']>;
      return code === DEMO_CODE
        ? { status: 200, body: { token: 'mock-token', role: 'caregiver' } }
        : { status: 400, body: { message: 'Wrong code' } };
    },
  },
  {
    method: 'GET',
    path: '/me',
    respond: () => ({ status: 200, body: { id: 'u1', name: 'Asha Rao', role: 'caregiver' } }),
  },
  { method: 'GET', path: '/circles', respond: () => ({ status: 200, body: circles }) },
];
