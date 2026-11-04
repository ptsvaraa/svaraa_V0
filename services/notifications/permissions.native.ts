import Constants from 'expo-constants';
import type * as NotificationsModule from 'expo-notifications';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import type { PermissionStatus } from './permissions';

export type { PermissionStatus };

type Notifications = typeof NotificationsModule;

/**
 * expo-notifications needs native modules (ExpoNotifications, ExpoApplication) that an older development build
 * or a mismatched client may not contain. Importing it at the top would crash every screen that uses this file,
 * so it is loaded on first use and, when it cannot load, the calls below fall back to what React Native has.
 */
let cached: Notifications | null | undefined;
function loadNotifications(): Notifications | null {
  if (cached !== undefined) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = require('expo-notifications') as Notifications;
  } catch (error) {
    if (__DEV__) {
      console.warn(
        'expo-notifications could not load (this app build lacks its native code). Rebuild the development build.',
        error,
      );
    }
    cached = null;
  }
  return cached;
}

const read = (p: NotificationsModule.NotificationPermissionsStatus): PermissionStatus =>
  p.granted ? 'granted' : p.canAskAgain ? 'undetermined' : 'denied';

/** Android 13+ has a runtime notification permission; older Android allows notifications by default. */
const ANDROID_POST = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
const androidNeedsAsk = () => Platform.OS === 'android' && Number(Platform.Version) >= 33 && !!ANDROID_POST;

async function fallbackPermission(ask: boolean): Promise<PermissionStatus> {
  if (Platform.OS !== 'android') return 'denied';
  if (!androidNeedsAsk()) return 'granted';
  if (!ask) return (await PermissionsAndroid.check(ANDROID_POST)) ? 'granted' : 'undetermined';
  const result = await PermissionsAndroid.request(ANDROID_POST);
  if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
  return result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ? 'denied' : 'undetermined';
}

export async function getPermission(): Promise<PermissionStatus> {
  const Notifications = loadNotifications();
  if (!Notifications) return fallbackPermission(false);
  return read(await Notifications.getPermissionsAsync());
}

/** Shows the system question once. After "Don't allow" the system will not ask again, so this returns 'denied'. */
export async function requestPermission(): Promise<PermissionStatus> {
  const Notifications = loadNotifications();
  if (!Notifications) return fallbackPermission(true);
  const result = await Notifications.requestPermissionsAsync();
  return result.granted ? 'granted' : 'denied';
}

export const openSettings = () => Linking.openSettings();

/** The Expo push token of this phone, or null when it cannot be had (Expo Go without a project id, a simulator). */
export async function getDeviceToken(): Promise<{ token: string; platform: 'ios' | 'android' } | null> {
  try {
    const projectId = (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas
      ?.projectId;
    if (!projectId) return null;
    const Notifications = loadNotifications();
    if (!Notifications) return null;
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return { token: data, platform: Platform.OS === 'ios' ? 'ios' : 'android' };
  } catch {
    return null;
  }
}
