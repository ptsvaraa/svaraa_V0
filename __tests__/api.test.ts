import { getResponse } from 'msw';
import { createApi } from '@/services/api';
import { handlers } from '@/services/mocks/handlers';

// Route the client straight into the mock handlers: same handlers the app uses with MSW.
const api = createApi({
  fetch: async (request: Request) =>
    (await getResponse(handlers, request)) ?? new Response('unhandled', { status: 599 }),
});

describe('api client with mock handlers', () => {
  it('verifies the demo code and rejects a wrong one', async () => {
    const ok = await api.POST('/auth/otp/verify', { body: { phone: '+919876543210', code: '000000' } });
    expect(ok.data?.token).toBe('mock-token');
    const bad = await api.POST('/auth/otp/verify', { body: { phone: '+919876543210', code: '111111' } });
    expect(bad.response.status).toBe(400);
  });
  it('lists circles', async () => {
    const res = await api.GET('/circles');
    expect(res.data?.length).toBeGreaterThan(0);
  });
});
