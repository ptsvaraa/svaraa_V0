import 'react-native-url-polyfill/auto';
import { handlers } from './handlers';

/** Mobile: MSW intercepts fetch in the JS runtime (no service worker). Unmatched requests use the network. */
export async function startMocks(): Promise<void> {
  const { setupServer } = await import('msw/native');
  setupServer(...handlers).listen({ onUnhandledRequest: 'bypass' });
}
