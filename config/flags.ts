/** Feature flags. New features (music, news, reminders) = a new folder in features/ + a flag here. */
export const flags = {
  music: false,
  news: false,
  reminders: false,
  /** 'simulator' now; 'ble' once real Bluetooth is wired. */
  pendantTransport: 'simulator' as 'simulator' | 'ble',
} as const;
