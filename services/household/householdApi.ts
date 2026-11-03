import { api, call, type HouseholdOut, type Role } from '@/services/api';

export type { HouseholdOut, Role };

/**
 * Create the household with the person's role (wearer or caregiver). Asking again returns the same household.
 * PENDING BACKEND: POST /api/v1/households is not in docs/openapi.json yet; it is answered by services/mocks.
 */
export const createHousehold = (role: Role) => call(api.POST('/api/v1/households', { body: { role } }));
