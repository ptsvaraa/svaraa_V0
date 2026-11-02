import { env } from '@/config/env';
import { routes } from './routes';

/**
 * Mock fetch for the phone. MSW needs browser APIs that React Native does not have,
 * so on mobile we answer from routes.ts directly. Requests with no route go to the real network.
 */
export function createMockFetch(realFetch: typeof fetch): typeof fetch {
  return async (input, init) => {
    const request = new Request(input as RequestInfo, init);
    const url = request.url;
    if (url.startsWith(env.apiUrl)) {
      const path = url.slice(env.apiUrl.length).split('?')[0];
      const route = routes.find((r) => r.method === request.method && r.path === path);
      if (route) {
        const body = request.method === 'POST' ? await request.json().catch(() => undefined) : undefined;
        const out = route.respond(body);
        return new Response(JSON.stringify(out.body), {
          status: out.status,
          headers: { 'content-type': 'application/json' },
        });
      }
    }
    return realFetch(input as RequestInfo, init);
  };
}
