import * as SecureStore from 'expo-secure-store';
import type { Storage } from './storage';

export const storage: Storage = {
  get: (key) => SecureStore.getItemAsync(key),
  set: (key, value) => SecureStore.setItemAsync(key, value),
  remove: (key) => SecureStore.deleteItemAsync(key),
};
