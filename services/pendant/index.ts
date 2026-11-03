import { flags } from '@/config/flags';
import { SimulatorTransport } from './simulator';
import type { PendantTransport } from './types';

export * from './types';
export { SIMULATED_PENDANT, SimulatorTransport, simulatorTiming } from './simulator';

let transport: PendantTransport | undefined;

/**
 * The pendant connection for the whole app, chosen by `flags.pendantTransport`.
 * PENDING: 'ble' needs react-native-ble-plx and a development build (FE-B, after the pendant spec is frozen).
 */
export function pendant(): PendantTransport {
  if (!transport) {
    if (flags.pendantTransport === 'ble') throw new Error('BleTransport is not built yet');
    transport = new SimulatorTransport();
  }
  return transport;
}

/** Tests only: start again with a fresh pendant. */
export function resetPendant(next?: PendantTransport) {
  transport = next;
}
