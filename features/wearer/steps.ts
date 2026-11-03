/**
 * The wearer-first path counted in the Home card's "step N of 7": B1 role (1), B2 permissions (2), C1 about you (3),
 * C2 claim (4), C3–C4 pairing and checks (5), C5 emergency contacts (6), C8 SOS drill (7). C7 invite is optional.
 * The step number saved is the last one finished, so setup resumes at the next one.
 */
export const WEARER_STEP = {
  role: 1,
  permissions: 2,
  about: 3,
  claim: 4,
  pairing: 5,
  contacts: 6,
  drill: 7,
} as const;

/** The C screens show "Step n of 5" (about you, claim, pairing, contacts, drill). */
export const WEARER_PATH_STEPS = 5;

export type WearerRoute =
  | '/wearer/permissions'
  | '/wearer/about'
  | '/wearer/claim'
  | '/wearer/pair'
  | '/wearer/check'
  | '/wearer/contacts'
  | '/wearer/drill';

/** Where a wearer continues setup. `paired`: C3 is done but the C4 checks are not. */
export function nextWearerRoute(setupStep: number, paired = false): WearerRoute {
  if (setupStep < WEARER_STEP.permissions) return '/wearer/permissions';
  if (setupStep < WEARER_STEP.about) return '/wearer/about';
  if (setupStep < WEARER_STEP.claim) return '/wearer/claim';
  if (setupStep < WEARER_STEP.pairing) return paired ? '/wearer/check' : '/wearer/pair';
  if (setupStep < WEARER_STEP.contacts) return '/wearer/contacts';
  return '/wearer/drill';
}
