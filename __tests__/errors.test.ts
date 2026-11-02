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

  it('shows AUTH_OTP_EXPIRED in the chosen language', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t(errorMessageKey('AUTH_OTP_EXPIRED'))).toBe('That code has expired. Ask for a new one.');
    await i18n.changeLanguage('hi');
    expect(i18n.t(errorMessageKey('AUTH_OTP_EXPIRED'))).toBe(hi.errors.AUTH_OTP_EXPIRED);
    await i18n.changeLanguage('en');
  });

  it('never shows an unknown code or server text to the person', () => {
    expect(errorMessageKey('SOMETHING_NEW')).toBe('errors.UNKNOWN');
    expect(errorMessageKey(undefined)).toBe('errors.UNKNOWN');
  });
});

describe('toApiError', () => {
  it('keeps a known code from the server', () => {
    const e = toApiError({ code: 'AUTH_OTP_EXPIRED', message: 'expired' }, 400);
    expect(e).toBeInstanceOf(ApiError);
    expect(e.code).toBe('AUTH_OTP_EXPIRED');
    expect(e.status).toBe(400);
  });
  it('maps an unknown code by HTTP status', () => {
    expect(toApiError({ code: 'NEW_CODE' }, 500).code).toBe('SERVER_ERROR');
    expect(toApiError({ code: 'NEW_CODE' }, 401).code).toBe('AUTH_UNAUTHORIZED');
    expect(toApiError({ code: 'NEW_CODE' }, 404).code).toBe('NOT_FOUND');
    expect(toApiError({ code: 'NEW_CODE' }, 418).code).toBe('UNKNOWN');
  });
  it('maps a failed fetch (TypeError) to NETWORK_ERROR', () => {
    expect(toApiError(new TypeError('Network request failed')).code).toBe('NETWORK_ERROR');
  });
  it('maps anything else to UNKNOWN, or by status when there is no body', () => {
    expect(toApiError('boom').code).toBe('UNKNOWN');
    expect(toApiError(undefined, 503).code).toBe('SERVER_ERROR');
  });
  it('passes an ApiError through unchanged', () => {
    const original = new ApiError('NOT_FOUND');
    expect(toApiError(original)).toBe(original);
  });
});
