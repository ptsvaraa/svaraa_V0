import { getResponse } from 'msw';
import { createMockFetch } from '@/services/mocks/fetchMock';
import { handlers } from '@/services/mocks/handlers';
import { routes } from '@/services/mocks/routes';
import { env } from '@/config/env';

/** The phone (fetchMock) and web/Jest (MSW handlers) must give the same answers: both come from routes.ts. */
const unhandled = (async () => {
  throw new Error('unhandled');
}) as typeof fetch;
const phone = createMockFetch(unhandled);

const bodies: Record<string, unknown[]> = {
  '/auth/otp/verify': [
    { phone: '+919876543210', code: '000000' },
    { phone: '+919876543210', code: '123456' },
  ],
};

describe('one set of mock routes', () => {
  it('has an MSW handler for every route', () => {
    expect(handlers).toHaveLength(routes.length);
  });

  describe.each(routes.flatMap((r) => (bodies[r.path] ?? [undefined]).map((body) => [r, body] as const)))(
    '%j',
    (route, body) => {
      it(`${route.method} ${route.path} matches on phone and MSW`, async () => {
        const init = () => ({
          method: route.method,
          headers: { 'content-type': 'application/json' },
          body: body === undefined ? undefined : JSON.stringify(body),
        });
        const url = `${env.apiUrl}${route.path}`;
        const fromPhone = await phone(url, init());
        const fromMsw = await getResponse(handlers, new Request(url, init()));
        expect(fromMsw).toBeDefined();
        expect(fromPhone.status).toBe(fromMsw?.status);
        expect(await fromPhone.json()).toEqual(await fromMsw?.json());
      });
    },
  );
});
