import { api, call, type DeviceOut, type WearerProfileIn } from '@/services/api';

export type { DeviceOut, WearerProfileIn };

/** Version of the consent text on C1's "Details" sheet. Change it whenever that text changes. */
export const CONSENT_VERSION = '2026-11-v0';

const path = (householdId: string) => ({ params: { path: { household_id: householdId } } });

/**
 * C1: save the wearer's basics.
 * PENDING BACKEND: PATCH /api/v1/households/{household_id}/wearer is not in docs/openapi.json yet; answered by services/mocks.
 */
export const saveWearerProfile = (householdId: string, profile: WearerProfileIn) =>
  call(api.PATCH('/api/v1/households/{household_id}/wearer', { ...path(householdId), body: profile }));

/**
 * C1 checkbox: record that the wearer agreed, with the version of the text they saw.
 * PENDING BACKEND: POST /api/v1/households/{household_id}/consent is not in docs/openapi.json yet.
 */
export const giveConsent = (householdId: string, via: 'app' | 'link' = 'app') =>
  call(
    api.POST('/api/v1/households/{household_id}/consent', {
      ...path(householdId),
      body: { version: CONSENT_VERSION, via },
    }),
  );

/**
 * C2: claim the pendant with the one-time code from the box. Makes this household the owner.
 * Fails with `invalid_claim_code`, or `device_already_claimed` (details.owner_hint is a masked initial).
 * PENDING BACKEND: POST /api/v1/households/{household_id}/claim is not in docs/openapi.json yet.
 */
export const claimPendant = (householdId: string, code: string) =>
  call(api.POST('/api/v1/households/{household_id}/claim', { ...path(householdId), body: { code } }));
