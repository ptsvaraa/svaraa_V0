import { createMockFetch } from './fetchMock';

/** Mobile: replace global fetch with the route-based mock. */
export async function startMocks(): Promise<void> {
  globalThis.fetch = createMockFetch(globalThis.fetch.bind(globalThis));
}
