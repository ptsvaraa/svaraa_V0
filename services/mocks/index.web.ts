import { handlers } from './handlers';

/** Web: MSW service worker. Needs public/mockServiceWorker.js (run `npx msw init public`). */
export async function startMocks(): Promise<void> {
  const { setupWorker } = await import('msw/browser');
  await setupWorker(...handlers).start({ onUnhandledRequest: 'bypass' });
}
