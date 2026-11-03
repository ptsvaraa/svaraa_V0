import i18n from '@/i18n';
import en from '@/i18n/en.json';
import hi from '@/i18n/hi.json';
import { ApiError, ERROR_CODES, errorMessageKey, toApiError } from '@/services/api';

const errors = { en: en.errors as Record<string, string>, hi: hi.errors as Record<string, string> };

describe('error code to message', () => {
  it.each(ERROR_CODES)('%s has text in English and Hindi', (code) => {
    expect(errors.en[code]?.trim()).toBeTruthy();
    expect(errors.hi[code]?.trim()).toBeTruthy();
    expect(errorMessageKey(code)).toBe(`errors.${code}`);
  });

  it('has no text for a code that does not exist', () => {
    expect(Object.keys(errors.en).sort()).toEqual([...ERROR_CODES].sort());
    expect(Object.keys(errors.hi).sort()).toEqual([...ERROR_CODES].sort());
  });

  it('every code the backend raises is listed (see docs/openapi.json and app/ in svaraa-backend)', () => {
    const backend = [
      'invalid_otp',
      'otp_cooldown',
      'rate_limited',
      'invalid_mobile_number',
      'invalid_country_code',
      'invalid_google_token',
      'google_email_unverified',
      'mobile_number_taken',
      'missing_token',
      'invalid_token',
      'session_revoked',
      'user_not_found',
      'validation_error',
      'service_unavailable',
      'internal_error',
      'bad_request',
      'unauthorized',
      'forbidden',
      'not_found',
      'conflict',
    ];
    for (const code of backend) expect(ERROR_CODES).toContain(code);
  });

  it('says "Wrong or expired code" for invalid_otp, in both languages', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t(errorMessageKey('invalid_otp'))).toBe('Wrong or expired code');
    await i18n.changeLanguage('hi');
    expect(i18n.t(errorMessageKey('invalid_otp'))).toBe(hi.errors.invalid_otp);
    expect(hi.errors.invalid_otp).not.toBe(en.errors.invalid_otp);
    await i18n.changeLanguage('en');
  });

  it('never shows an unknown code or server text to the person', () => {
    expect(errorMessageKey('SOMETHING_NEW')).toBe('errors.unknown');
    expect(errorMessageKey('AUTH_OTP_INVALID')).toBe('errors.unknown'); // old mock code, gone
    expect(errorMessageKey(undefined)).toBe('errors.unknown');
  });
});

describe('toApiError', () => {
  it('reads the backend shape { error: { code, message } }', () => {
    const e = toApiError({ error: { code: 'invalid_otp', message: 'Incorrect or expired code' } }, 401);
    expect(e).toBeInstanceOf(ApiError);
    expect(e.code).toBe('invalid_otp');
    expect(e.status).toBe(401);
  });
  it('also accepts a bare { code }', () => {
    expect(toApiError({ code: 'otp_cooldown' }, 429).code).toBe('otp_cooldown');
  });
  it('maps an unknown code by HTTP status', () => {
    const body = { error: { code: 'new_code' } };
    expect(toApiError(body, 500).code).toBe('internal_error');
    expect(toApiError(body, 503).code).toBe('service_unavailable');
    expect(toApiError(body, 401).code).toBe('unauthorized');
    expect(toApiError(body, 404).code).toBe('not_found');
    expect(toApiError(body, 409).code).toBe('conflict');
    expect(toApiError(body, 422).code).toBe('validation_error');
    expect(toApiError(body, 429).code).toBe('rate_limited');
    expect(toApiError(body, 418).code).toBe('bad_request');
    expect(toApiError(body).code).toBe('unknown');
  });
  it('maps a failed fetch (TypeError) to network_error', () => {
    expect(toApiError(new TypeError('Network request failed')).code).toBe('network_error');
  });
  it('maps anything else to unknown, or by status when there is no body', () => {
    expect(toApiError('boom').code).toBe('unknown');
    expect(toApiError(undefined, 503).code).toBe('service_unavailable');
  });
  it('passes an ApiError through unchanged', () => {
    const original = new ApiError('not_found');
    expect(toApiError(original)).toBe(original);
  });
});
