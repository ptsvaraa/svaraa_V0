import { create } from 'zustand';
import { storage } from '@/services/storage';

/**
 * PENDING BACKEND: there is no household or setup-progress API yet. This store is a mock that keeps the
 * progress on this phone. When the API exists, replace it with a TanStack Query hook over services/;
 * the screens only use `setupStep`, `totalSteps` and `hasActiveDevice`.
 */

/** Flow B to D has about 7 steps (role, permissions, box, basics, contacts, link, pairing). Not final. */
export const SETUP_TOTAL_STEPS = 7;

const key = (userId: string) => `svaraa.household.setup.${userId}`;

type SetupState = {
  userId?: string;
  /** 0 = not started. Otherwise the last step the person finished (saved, so setup can resume). */
  setupStep: number;
  totalSteps: number;
  /** True once a pendant is Active. The setup card disappears then. */
  hasActiveDevice: boolean;
  load(userId: string): Promise<void>;
  /** Test helper until real setup screens exist. */
  advance(): Promise<void>;
  reset(): Promise<void>;
  /** Forget what is in memory (on sign-out). The saved copy stays for the next sign-in. */
  unload: () => void;
};

type Saved = { setupStep: number; hasActiveDevice: boolean };

async function persist(s: SetupState) {
  if (!s.userId) return;
  const saved: Saved = { setupStep: s.setupStep, hasActiveDevice: s.hasActiveDevice };
  await storage.set(key(s.userId), JSON.stringify(saved));
}

export const useHousehold = create<SetupState>((set, get) => ({
  setupStep: 0,
  totalSteps: SETUP_TOTAL_STEPS,
  hasActiveDevice: false,

  load: async (userId) => {
    let saved: Saved | null = null;
    try {
      const raw = await storage.get(key(userId));
      saved = raw ? (JSON.parse(raw) as Saved) : null;
    } catch {
      /* unreadable: start fresh */
    }
    set({ userId, setupStep: saved?.setupStep ?? 0, hasActiveDevice: saved?.hasActiveDevice ?? false });
  },

  advance: async () => {
    const { setupStep, totalSteps } = get();
    const next = Math.min(setupStep + 1, totalSteps);
    set({ setupStep: next, hasActiveDevice: next >= totalSteps });
    await persist(get());
  },

  reset: async () => {
    set({ setupStep: 0, hasActiveDevice: false });
    await persist(get());
  },

  unload: () => set({ userId: undefined, setupStep: 0, hasActiveDevice: false }),
}));
