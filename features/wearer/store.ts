import { create } from 'zustand';
import type { DeviceOut, WearerProfileIn } from '@/services/household/wearerApi';
import { storage } from '@/services/storage';

/**
 * PENDING BACKEND: what the wearer entered during setup, kept on this phone because the household APIs have no
 * read endpoints yet. When `GET /households/{id}` exists, read it with TanStack Query and keep only `paired` here.
 */

/** An emergency contact (C5, C6). Name and number only; how they are alerted is decided by Svaraa. */
export type EmergencyContact = {
  name: string;
  relationship?: string;
  /** With the plus, e.g. "+91". */
  countryCode: string;
  mobile: string;
};

type Saved = {
  profile?: WearerProfileIn;
  device?: DeviceOut;
  /** The pendant id the phone paired with (C3). Used to reconnect. */
  pendantId?: string;
  contacts: EmergencyContact[];
};

type WearerState = Saved & {
  userId?: string;
  load(userId: string): Promise<void>;
  save(patch: Partial<Saved>): Promise<void>;
  /** Forget what is in memory (on sign-out). The saved copy stays for the next sign-in. */
  unload(): void;
};

const key = (userId: string) => `svaraa.wearer.${userId}`;
const EMPTY: Saved = { profile: undefined, device: undefined, pendantId: undefined, contacts: [] };

export const useWearer = create<WearerState>((set, get) => ({
  ...EMPTY,

  load: async (userId) => {
    let saved: Partial<Saved> | null = null;
    try {
      const raw = await storage.get(key(userId));
      saved = raw ? (JSON.parse(raw) as Partial<Saved>) : null;
    } catch {
      /* unreadable: start fresh */
    }
    set({ ...EMPTY, ...saved, userId });
  },

  save: async (patch) => {
    set(patch);
    const { userId, profile, device, pendantId, contacts } = get();
    if (userId) await storage.set(key(userId), JSON.stringify({ profile, device, pendantId, contacts }));
  },

  unload: () => set({ ...EMPTY, userId: undefined }),
}));
