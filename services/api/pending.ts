/**
 * PENDING BACKEND: endpoints the app needs that are not in docs/openapi.json yet.
 * Written by hand in the same shape as schema.d.ts, so the client stays typed.
 * When an endpoint reaches the real API: run `npm run api:generate`, then delete it here.
 */
type Json<T> = { 'application/json': T };
type NoHeaders = { [name: string]: unknown };
type NoParams = { query?: never; header?: never; path?: never; cookie?: never };

export type Role = 'wearer' | 'caregiver';
export type HouseholdCreateIn = { role: Role };
export type HouseholdOut = { id: string; role: Role };
export type PushTokenIn = { token: string; platform: 'ios' | 'android' | 'web' };

/** C1 (and D2): the wearer's basics. `call_as` is how the voice assistant addresses them. No address in v0. */
export type WearerProfileIn = {
  name: string;
  call_as?: string | null;
  /** Language ids, e.g. ['en', 'ta']. */
  languages: string[];
  health_notes?: string | null;
  pacemaker: boolean;
};
export type WearerProfileOut = WearerProfileIn;
/** A consent record. `version` is the version of the consent text the person agreed to. */
export type ConsentIn = { version: string; via: 'app' | 'link' };
/** C2: the one-time code from the card in the box (from the QR, or typed). */
export type ClaimIn = { code: string };
export type ClaimState = 'unverified' | 'verified';
export type DeviceOut = { id: string; serial: string; claim_state: ClaimState; is_owner: boolean };

type Operation<In, Out, Status extends number> = {
  parameters: NoParams;
  requestBody: { content: Json<In> };
  responses: Record<Status, { headers: NoHeaders; content: Out extends void ? never : Json<Out> }>;
};

/** Path parameters such as `{ household_id: string }`. */
type WithPath<P> = { query?: never; header?: never; path: P; cookie?: never };
type HouseholdPath = { household_id: string };
type Empty = { headers: NoHeaders; content?: never };
/** An operation on a path with parameters. `In = void` means no body; `Out = void` means 204 No Content. */
type PathOperation<P, In, Out> = {
  parameters: WithPath<P>;
  requestBody: In extends void ? never : { content: Json<In> };
  responses: Out extends void ? { 204: Empty } : { 200: { headers: NoHeaders; content: Json<Out> } };
};
type NoMethods = {
  get?: never;
  put?: never;
  post?: never;
  delete?: never;
  options?: never;
  head?: never;
  patch?: never;
  trace?: never;
};
type PathItem<P, Ops extends Partial<Record<keyof NoMethods, unknown>>> = { parameters: WithPath<P> } & Omit<
  NoMethods,
  keyof Ops
> &
  Ops;

export type PendingPaths = {
  '/api/v1/households': {
    parameters: NoParams;
    get?: never;
    put?: never;
    post: Operation<HouseholdCreateIn, HouseholdOut, 200>;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/devices/push-token': {
    parameters: NoParams;
    get?: never;
    put?: never;
    post: {
      parameters: NoParams;
      requestBody: { content: Json<PushTokenIn> };
      responses: { 204: { headers: NoHeaders; content?: never } };
    };
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/households/{household_id}/wearer': PathItem<
    HouseholdPath,
    { patch: PathOperation<HouseholdPath, WearerProfileIn, WearerProfileOut> }
  >;
  '/api/v1/households/{household_id}/consent': PathItem<
    HouseholdPath,
    { post: PathOperation<HouseholdPath, ConsentIn, void> }
  >;
  '/api/v1/households/{household_id}/claim': PathItem<
    HouseholdPath,
    { post: PathOperation<HouseholdPath, ClaimIn, DeviceOut> }
  >;
};
