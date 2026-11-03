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

type Operation<In, Out, Status extends number> = {
  parameters: NoParams;
  requestBody: { content: Json<In> };
  responses: Record<Status, { headers: NoHeaders; content: Out extends void ? never : Json<Out> }>;
};

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
};
