import { env, isMocked } from '@/config/env';
import { routes } from './routes';

/**
 * Mock fetch for the phone. MSW needs browser APIs that React Native does not have,
 * so on mobile we answer from routes.ts directly. Endpoints with no route, or switched to the real backend
 * (EXPO_PUBLIC_REAL_ENDPOINTS), go to the real network.
 */
export function createMockFetch(realFetch: typeof fetch): typeof fetch {
  return async (input, init) => {
    const request = new Request(input as RequestInfo, init);
    const url = request.url;
    if (url.startsWith(env.apiUrl)) {
      const path = url.slice(env.apiUrl.length).split('?')[0];
      const route = routes.find((r) => r.method === request.method && r.path === path);
      if (route && isMocked(route.method, route.path)) {
        const body = route.method === 'GET' ? undefined : await request.json().catch(() => undefined);
        const out = route.respond({ body, headers: request.headers });
        if (out.body === undefined) return new Response(null, { status: out.status });
        return new Response(JSON.stringify(out.body), {
          status: out.status,
          headers: { 'content-type': 'application/json' },
        });
      }
    }
    return realFetch(input as RequestInfo, init);
  };
}
