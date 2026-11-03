import { Platform } from 'react-native';
import { api, call, type PushTokenIn } from '@/services/api';
import { flags } from '@/config/flags';
import { getDeviceToken } from './permissions';

export { getPermission, openSettings, requestPermission, type PermissionStatus } from './permissions';

/**
 * Get this phone's push token and save it for the signed-in person.
 * PENDING BACKEND: POST /api/v1/devices/push-token is not in docs/openapi.json yet; it is answered by services/mocks.
 * While the notifications switch is 'mock', a phone that cannot give a real token (Expo Go, no project id) uses a
 * placeholder token, so the rest of the flow can be tested.
 */
export async function savePushToken(): Promise<void> {
  const device = await getDeviceToken();
  const platform = (device?.platform ??
    (Platform.OS === 'ios' || Platform.OS === 'android' ? Platform.OS : 'web')) as PushTokenIn['platform'];
  const token = device?.token ?? (flags.notifications === 'mock' ? `mock-push-token-${platform}` : undefined);
  if (!token) throw new Error('No push token on this device');
  await call(api.POST('/api/v1/devices/push-token', { body: { token, platform } }));
}
