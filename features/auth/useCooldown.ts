import { useCallback, useEffect, useState } from 'react';

/** Counts down in whole seconds. `start(n)` begins an n-second wait; `remaining` is 0 when it is over. */
export function useCooldown() {
  const [endsAt, setEndsAt] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!endsAt) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) setEndsAt(0);
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [endsAt]);

  const start = useCallback((seconds: number) => setEndsAt(Date.now() + seconds * 1000), []);
  return { remaining, start };
}

/** 90 -> "1:30", 30 -> "0:30". */
export const formatClock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
