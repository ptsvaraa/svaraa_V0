/**
 * Key-value storage. This file is the in-memory fallback (tests, server rendering) and the shared type.
 * Mobile uses storage.native.ts (secure store); web uses storage.web.ts (localStorage).
 */
export type Storage = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
};

const memory = new Map<string, string>();

export const storage: Storage = {
  get: async (key) => memory.get(key) ?? null,
  set: async (key, value) => {
    memory.set(key, value);
  },
  remove: async (key) => {
    memory.delete(key);
  },
};
