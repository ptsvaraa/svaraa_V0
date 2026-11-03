/** Feature flags. New features (music, news, reminders) = a new folder in features/ + a flag here. */
export const flags = {
  music: false,
  news: false,
  reminders: false,
  /** 'simulator' now; 'ble' once real Bluetooth is wired. */
  pendantTransport: 'simulator' as 'simulator' | 'ble',
  /** 'mock' until a development build and the Google client IDs exist; then 'native'. */
  googleSignIn: 'mock' as 'mock' | 'native',
} as const;
