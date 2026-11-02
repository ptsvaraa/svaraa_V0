import createClient, { type ClientOptions } from 'openapi-fetch';
import { env } from '@/config/env';
import type { paths } from './schema';

/** Typed API client, generated from services/api/openapi.json. Only services/ and features/ hooks use it. */
export function createApi(options?: ClientOptions) {
  return createClient<paths>({ baseUrl: env.apiUrl, ...options });
}

export const api = createApi();
