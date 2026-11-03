import '@/i18n';

// expo-secure-store has no native module in Jest: keep values in memory instead.
jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: async (k: string) => store.get(k) ?? null,
    setItemAsync: async (k: string, v: string) => void store.set(k, v),
    deleteItemAsync: async (k: string) => void store.delete(k),
    /** Tests only: forget everything saved. */
    __reset: () => store.clear(),
  };
});
