import createClient, { type ClientOptions } from 'openapi-fetch';
import { env } from '@/config/env';
import { authedFetch } from './authedFetch';
import type { PendingPaths } from './pending';
import type { paths } from './schema';

/**
 * Typed API client, generated from docs/openapi.json. Only services/ and features/ hooks use it.
 * Adds the bearer token and refreshes it on a 401 (see authedFetch.ts).
 */
export function createApi(options?: ClientOptions) {
  return createClient<paths & PendingPaths>({ baseUrl: env.apiUrl, fetch: authedFetch, ...options });
}

export const api = createApi();
