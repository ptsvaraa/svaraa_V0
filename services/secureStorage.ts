import type { Storage } from './storage';

/**
 * Storage for tokens and other private values. This file is the in-memory version used on web and in tests:
 * nothing is written to disk, so a web session ends when the tab closes. Mobile uses secureStorage.native.ts.
 */
const memory = new Map<string, string>();

export const secureStorage: Storage = {
  get: async (key) => memory.get(key) ?? null,
  set: async (key, value) => {
    memory.set(key, value);
  },
  remove: async (key) => {
    memory.delete(key);
  },
};
