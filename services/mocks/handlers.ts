import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import type { components } from '@/services/api/schema';

const url = (path: string) => `${env.apiUrl}${path}`;

/** Demo code accepted by the mock backend. */
export const DEMO_CODE = '000000';

export const circles: components['schemas']['Circle'][] = [
  { id: 'c1', name: 'Amma', status: 'connected' },
  { id: 'c2', name: 'Appa', status: 'low_battery' },
];

export const handlers = [
  http.post(url('/auth/otp/send'), () => HttpResponse.json({ cooldownSec: 30 })),
  http.post(url('/auth/otp/verify'), async ({ request }) => {
    const body = (await request.json()) as components['schemas']['OtpVerifyRequest'];
    if (body.code !== DEMO_CODE) return HttpResponse.json({ message: 'Wrong code' }, { status: 400 });
    return HttpResponse.json({ token: 'mock-token', role: 'caretaker' as const });
  }),
  http.get(url('/me'), () => HttpResponse.json({ id: 'u1', name: 'Asha Rao', role: 'caretaker' as const })),
  http.get(url('/circles'), () => HttpResponse.json(circles)),
];
