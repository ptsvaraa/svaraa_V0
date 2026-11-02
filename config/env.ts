import Constants from 'expo-constants';

/** Environment settings. Set EXPO_PUBLIC_* in .env (see .env.example). */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.svaraa.example',
  /** Use MSW mock responses instead of the real backend. On until the backend is live. */
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') === 'true',
  appVersion: Constants.expoConfig?.version ?? '0.0.0',
};
