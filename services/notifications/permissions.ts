/**
 * Notification permission. This file is the web version (the browser's Notification API) and the shared types.
 * The phone uses permissions.native.ts (expo-notifications).
 */
export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

type BrowserNotification = {
  permission: 'default' | 'granted' | 'denied';
  requestPermission(): Promise<string>;
};
const browser = () => (globalThis as unknown as { Notification?: BrowserNotification }).Notification;
const read = (p?: string): PermissionStatus =>
  p === 'granted' ? 'granted' : p === 'denied' ? 'denied' : 'undetermined';

export const getPermission = async (): Promise<PermissionStatus> => read(browser()?.permission);
export const requestPermission = async (): Promise<PermissionStatus> =>
  read(await browser()?.requestPermission());
/** A browser has no settings screen we can open. */
export const openSettings = async (): Promise<void> => undefined;
/** No push token in the browser until web push is built. The caller uses a mock token (pending backend). */
export const getDeviceToken = async (): Promise<{ token: string; platform: 'web' } | null> => null;
