import { useEffect } from 'react';
import { create } from 'zustand';
import { pendant, type PendantStatus } from '@/services/pendant';

type PendantState = PendantStatus & { set: (s: PendantStatus) => void };

/** Live pendant status for screens (connection, battery). Fed by the transport in services/pendant. */
export const usePendant = create<PendantState>((set) => ({
  connection: 'disconnected',
  set: (s) => set({ connection: s.connection, battery: s.battery, charging: s.charging }),
}));

/** Keep `usePendant` in step with the transport while the calling screen is shown. */
export function usePendantStatus() {
  useEffect(() => {
    const t = pendant();
    usePendant.getState().set(t.getStatus());
    return t.onStatus((s) => usePendant.getState().set(s));
  }, []);
  return usePendant();
}

/**
 * Reconnect to the paired pendant (by its id) whenever it is not connected, e.g. after the app was closed.
 * Does nothing without an id. Failures are left to the status: screens show "Not connected".
 */
export function useReconnect(pendantId: string | undefined) {
  const connection = usePendant((s) => s.connection);
  useEffect(() => {
    if (pendantId && connection === 'disconnected')
      void pendant()
        .connect(pendantId)
        .catch(() => undefined);
  }, [pendantId, connection]);
}
