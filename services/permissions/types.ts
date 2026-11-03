import type { PermissionStatus } from '@/services/notifications/permissions';

export type { PermissionStatus };

/** B2: the required permissions on the wearer's phone (it is the pendant's gateway), in the order they are asked. */
export type WearerPermission = 'bluetooth' | 'location' | 'notifications';
export const WEARER_PERMISSIONS: WearerPermission[] = ['bluetooth', 'location', 'notifications'];
