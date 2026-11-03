import * as SecureStore from 'expo-secure-store';
import type { Storage } from './storage';

/** Keychain (iOS) / Keystore (Android). Tokens live here and nowhere else. */
export const secureStorage: Storage = {
  get: (key) => SecureStore.getItemAsync(key),
  set: (key, value) => SecureStore.setItemAsync(key, value),
  remove: (key) => SecureStore.deleteItemAsync(key),
};
