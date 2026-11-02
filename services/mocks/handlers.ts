import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import { routes } from './routes';

export { DEMO_CODE, circles } from './routes';

/** MSW handlers for web (service worker) and Jest. Built from routes.ts. */
export const handlers = routes.map((r) =>
  (r.method === 'GET' ? http.get : http.post)(`${env.apiUrl}${r.path}`, async ({ request }) => {
    const body = r.method === 'POST' ? await request.json().catch(() => undefined) : undefined;
    const out = r.respond(body);
    return HttpResponse.json(out.body as Record<string, unknown>, { status: out.status });
  }),
);
