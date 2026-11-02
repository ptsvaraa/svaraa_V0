import type { components } from './schema';

/** Stable error codes the backend sends (see `Error` in openapi.json). */
export type ApiErrorCode = components['schemas']['Error']['code'];

/** Codes the app adds itself: no connection, or an answer it cannot read. */
export type ClientErrorCode = 'NETWORK_ERROR' | 'UNKNOWN';

export type ErrorCode = ApiErrorCode | ClientErrorCode;

/**
 * Every code. Typed as a Record so that adding a code to openapi.json fails typecheck until it is listed here,
 * and the tests then check it has text in en.json and hi.json.
 */
const CODE_TABLE: Record<ErrorCode, true> = {
  AUTH_PHONE_INVALID: true,
  AUTH_OTP_INVALID: true,
  AUTH_OTP_EXPIRED: true,
  AUTH_OTP_RATE_LIMITED: true,
  AUTH_UNAUTHORIZED: true,
  NOT_FOUND: true,
  SERVER_ERROR: true,
  NETWORK_ERROR: true,
  UNKNOWN: true,
};
export const ERROR_CODES = Object.keys(CODE_TABLE) as ErrorCode[];

const KNOWN = new Set<string>(ERROR_CODES);

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status?: number;
  constructor(code: ErrorCode, message?: string, status?: number) {
    super(message ?? code);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

/** i18n key for a code. A code the app does not know shows the generic message, never raw text from the server. */
export function errorMessageKey(code: string | undefined): string {
  return `errors.${code && KNOWN.has(code) ? code : 'UNKNOWN'}`;
}

/** Turn whatever went wrong (a failed request, an error body, a thrown error) into an ApiError. */
export function toApiError(input: unknown, status?: number): ApiError {
  if (input instanceof ApiError) return input;
  if (input && typeof input === 'object' && 'code' in input) {
    const { code, message } = input as { code?: unknown; message?: unknown };
    const known = typeof code === 'string' && KNOWN.has(code);
    return new ApiError(
      known ? (code as ErrorCode) : fallbackFor(status),
      typeof message === 'string' ? message : undefined,
      status,
    );
  }
  // fetch throws a TypeError when there is no network.
  if (input instanceof TypeError) return new ApiError('NETWORK_ERROR', input.message);
  return new ApiError(fallbackFor(status), undefined, status);
}

function fallbackFor(status?: number): ErrorCode {
  if (status === 401) return 'AUTH_UNAUTHORIZED';
  if (status === 404) return 'NOT_FOUND';
  if (status !== undefined && status >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN';
}
