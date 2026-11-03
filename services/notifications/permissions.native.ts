import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import type { PermissionStatus } from './permissions';

export type { PermissionStatus };

const read = (p: Notifications.NotificationPermissionsStatus): PermissionStatus =>
  p.granted ? 'granted' : p.canAskAgain ? 'undetermined' : 'denied';

export const getPermission = async () => read(await Notifications.getPermissionsAsync());

/** Shows the system question once. After "Don't allow" the system will not ask again, so this returns 'denied'. */
export async function requestPermission(): Promise<PermissionStatus> {
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
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return { token: data, platform: Platform.OS === 'ios' ? 'ios' : 'android' };
  } catch {
    return null;
  }
}
