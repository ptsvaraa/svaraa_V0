/**
 * Error codes the real backend sends (`error.code` in every error body, lowercase), plus two the app adds itself.
 * Typed as a Record so a new code must be listed here, and the tests then require English and Hindi text for it.
 */
const CODE_TABLE = {
  // Sign-in and phone number
  invalid_otp: true,
  otp_cooldown: true,
  rate_limited: true,
  invalid_mobile_number: true,
  invalid_country_code: true,
  invalid_google_token: true,
  google_email_unverified: true,
  mobile_number_taken: true,
  // Session
  missing_token: true,
  invalid_token: true,
  session_revoked: true,
  user_not_found: true,
  // Pendant claim and setup. PENDING BACKEND: codes agreed for the household APIs, not in docs/openapi.json yet.
  invalid_claim_code: true,
  device_already_claimed: true,
  consent_required: true,
  invalid_device_signature: true,
  invite_role_invalid: true,
  drill_not_found: true,
  // Generic
  validation_error: true,
  bad_request: true,
  unauthorized: true,
  forbidden: true,
  not_found: true,
  conflict: true,
  service_unavailable: true,
  internal_error: true,
  // Added by the app: no connection, or an answer it cannot read.
  network_error: true,
  // Added by the app: the pendant (services/pendant).
  pendant_not_found: true,
  pendant_connect_failed: true,
  pendant_not_connected: true,
  unknown: true,
} as const;

export type ErrorCode = keyof typeof CODE_TABLE;
export const ERROR_CODES = Object.keys(CODE_TABLE) as ErrorCode[];

const KNOWN = new Set<string>(ERROR_CODES);

/** Codes that mean "this sign-in is over": the refresh token is no longer good. */
export const SESSION_ENDED_CODES: readonly ErrorCode[] = [
  'invalid_token',
  'session_revoked',
  'user_not_found',
];

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status?: number;
  /** Extra safe fields from the error body, such as `owner_hint` (a masked initial) for device_already_claimed. */
  readonly details?: Record<string, unknown>;
  constructor(code: ErrorCode, message?: string, status?: number, details?: Record<string, unknown>) {
    super(message ?? code);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/** i18n key for a code. A code the app does not know shows the generic message, never raw text from the server. */
export function errorMessageKey(code: string | undefined): string {
  return `errors.${code && KNOWN.has(code) ? code : 'unknown'}`;
}

/**
 * Turn whatever went wrong (an error body, a thrown error) into an ApiError.
 * The backend wraps errors as `{ error: { code, message } }`; a bare `{ code }` also works.
 */
export function toApiError(input: unknown, status?: number): ApiError {
  if (input instanceof ApiError) return input;
  const body = unwrap(input);
  if (body) {
    const known = typeof body.code === 'string' && KNOWN.has(body.code);
    const { code: _code, message: _message, ...details } = body as Record<string, unknown>;
    return new ApiError(
      known ? (body.code as ErrorCode) : fallbackFor(status),
      typeof body.message === 'string' ? body.message : undefined,
      status,
      Object.keys(details).length ? details : undefined,
    );
  }
  // fetch throws a TypeError when there is no network.
  if (input instanceof TypeError) return new ApiError('network_error', input.message);
  return new ApiError(fallbackFor(status), undefined, status);
}

function unwrap(input: unknown): { code?: unknown; message?: unknown } | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const o = input as { error?: unknown; code?: unknown };
  if (o.error && typeof o.error === 'object') return o.error as { code?: unknown; message?: unknown };
  return 'code' in o ? (o as { code?: unknown; message?: unknown }) : undefined;
}

function fallbackFor(status?: number): ErrorCode {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 409) return 'conflict';
  if (status === 422) return 'validation_error';
  if (status === 429) return 'rate_limited';
  if (status === 503) return 'service_unavailable';
  if (status !== undefined && status >= 500) return 'internal_error';
  if (status !== undefined && status >= 400) return 'bad_request';
  return 'unknown';
}
