import { createApi } from '@/services/api';
import { createMockFetch } from '@/services/mocks/fetchMock';

// The same mock fetch the phone uses. Anything without a route would hit the network, so fail loudly.
const unhandled = (async () => {
  throw new Error('unhandled request');
}) as typeof fetch;
const api = createApi({ fetch: createMockFetch(unhandled) });

describe('api client with the mock backend', () => {
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
