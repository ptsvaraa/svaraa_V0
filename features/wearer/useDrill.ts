import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useHousehold } from '@/features/household/store';
import type { DrillOut } from '@/services/api';
import { getDrill, startDrill } from '@/services/household/wearerApi';
import { pendant } from '@/services/pendant';

/** How often to ask how the drill is going while waiting for an answer. */
export const DRILL_POLL_MS = 2000;

/**
 * C8 · The SOS drill: start it from the button or by holding the gold dot (a pendant "sos" event), then follow it
 * until a contact answers (passed) or five minutes go by (expired). `secondsLeft` counts down to the deadline.
 */
export function useDrill() {
  const householdId = useHousehold((s) => s.householdId);
  const [started, setStarted] = useState<DrillOut | null>(null);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<unknown>(null);
  const [now, setNow] = useState(() => Date.now());

  const status = useQuery({
    queryKey: ['drill', householdId, started?.id],
    queryFn: () => getDrill(householdId as string, started?.id as string),
    enabled: !!householdId && !!started,
    initialData: started ?? undefined,
    refetchInterval: (q) => (q.state.data?.status === 'waiting' ? DRILL_POLL_MS : false),
  });
  const drill = started ? (status.data ?? started) : null;

  const start = useCallback(async () => {
    if (!householdId || starting) return;
    setStarting(true);
    setStartError(null);
    try {
      setStarted(await startDrill(householdId));
    } catch (e) {
      setStartError(e);
    } finally {
      setStarting(false);
    }
  }, [householdId, starting]);

  // Holding the gold dot for three seconds starts the drill too.
  useEffect(
    () =>
      pendant().onEvent((e) => {
        if (e.type === 'sos' && (!drill || drill.status !== 'waiting')) void start();
      }),
    [drill, start],
  );

  // Countdown, once a second while waiting.
  const waiting = drill?.status === 'waiting';
  useEffect(() => {
    if (!waiting) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [waiting]);

  const secondsLeft = drill ? Math.max(0, Math.round((Date.parse(drill.expires_at) - now) / 1000)) : 0;
  return { drill, start, starting, error: startError ?? status.error, secondsLeft };
}
