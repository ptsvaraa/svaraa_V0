import type { Storage } from './storage';

/** Web stub: localStorage. Never use it for secrets; tokens on web will use cookies from the backend. */
export const storage: Storage = {
  get: async (key) => {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set: async (key, value) => {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      /* storage blocked: keep going without it */
    }
  },
  remove: async (key) => {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};
