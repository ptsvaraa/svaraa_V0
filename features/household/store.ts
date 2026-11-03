import { create } from 'zustand';
import type { Role } from '@/services/household/householdApi';
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
  /** Chosen at B1. Undefined until then ("not sure" leaves it empty). */
  role?: Role;
  householdId?: string;
  /** Caregiver only: notifications allowed and the push token saved (B3 done). */
  notificationsDone: boolean;
  /** 0 = not started. Otherwise the last step the person finished (saved, so setup can resume). */
  setupStep: number;
  totalSteps: number;
  /** True once a pendant is Active. The setup card disappears then. */
  hasActiveDevice: boolean;
  load(userId: string): Promise<void>;
  /** B1 done: the household exists with this role. Counts as step 1. */
  chooseRole(role: Role, householdId: string): Promise<void>;
  /** B3 done. Counts as step 2. */
  finishNotifications(): Promise<void>;
  /** Test helper until real setup screens exist. */
  advance(): Promise<void>;
  reset(): Promise<void>;
  /** Forget what is in memory (on sign-out). The saved copy stays for the next sign-in. */
  unload: () => void;
};

type Saved = {
  setupStep: number;
  hasActiveDevice: boolean;
  role?: Role;
  householdId?: string;
  notificationsDone?: boolean;
};

async function persist(s: SetupState) {
  if (!s.userId) return;
  const saved: Saved = {
    setupStep: s.setupStep,
    hasActiveDevice: s.hasActiveDevice,
    role: s.role,
    householdId: s.householdId,
    notificationsDone: s.notificationsDone,
  };
  await storage.set(key(s.userId), JSON.stringify(saved));
}

export const useHousehold = create<SetupState>((set, get) => ({
  setupStep: 0,
  totalSteps: SETUP_TOTAL_STEPS,
  hasActiveDevice: false,
  notificationsDone: false,

  load: async (userId) => {
    let saved: Saved | null = null;
    try {
      const raw = await storage.get(key(userId));
      saved = raw ? (JSON.parse(raw) as Saved) : null;
    } catch {
      /* unreadable: start fresh */
    }
    set({
      userId,
      setupStep: saved?.setupStep ?? 0,
      hasActiveDevice: saved?.hasActiveDevice ?? false,
      role: saved?.role,
      householdId: saved?.householdId,
      notificationsDone: saved?.notificationsDone ?? false,
    });
  },

  chooseRole: async (role, householdId) => {
    set((s) => ({ role, householdId, setupStep: Math.max(s.setupStep, 1) }));
    await persist(get());
  },

  finishNotifications: async () => {
    set((s) => ({ notificationsDone: true, setupStep: Math.max(s.setupStep, 2) }));
    await persist(get());
  },

  advance: async () => {
    const { setupStep, totalSteps } = get();
    const next = Math.min(setupStep + 1, totalSteps);
    set({ setupStep: next, hasActiveDevice: next >= totalSteps });
    await persist(get());
  },

  reset: async () => {
    set({
      setupStep: 0,
      hasActiveDevice: false,
      role: undefined,
      householdId: undefined,
      notificationsDone: false,
    });
    await persist(get());
  },

  unload: () =>
    set({
      userId: undefined,
      setupStep: 0,
      hasActiveDevice: false,
      role: undefined,
      householdId: undefined,
      notificationsDone: false,
    }),
}));

/**
 * Where the setup card sends the person: the first step they have not finished.
 * No role yet: B1. Wearer: B2 (FE-B builds it; a placeholder for now). Caregiver: B3, then D1 (FE-04; /setup for now).
 */
export function nextSetupRoute(s: Pick<SetupState, 'role' | 'notificationsDone'>) {
  if (!s.role) return '/role' as const;
  if (s.role === 'wearer') return '/wearer/permissions' as const;
  return s.notificationsDone ? ('/setup' as const) : ('/caregiver-permissions' as const);
}
