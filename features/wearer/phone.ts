import { COUNTRIES, type CountryId } from '@/features/auth/countries';

/** Why a mobile number cannot be saved, as an i18n key, or null when it is fine. Checked for the chosen country. */
export function mobileProblem(country: CountryId, raw: string): string | null {
  const digits = raw.replace(/[\s-]/g, '');
  if (!/^\d+$/.test(digits)) return 'wearer.contact.numberInvalid';
  if (country === 'IN') return /^[6-9]\d{9}$/.test(digits) ? null : 'wearer.contact.numberInvalidIndia';
  return /^\d{7,12}$/.test(digits) ? null : 'wearer.contact.numberInvalid';
}

export const onlyDigits = (raw: string) => raw.replace(/\D/g, '');

/** The country for a dial code, India when unknown (several countries share +1; the first one is used). */
export const countryOfDial = (dial: string): CountryId => COUNTRIES.find((c) => c.dial === dial)?.id ?? 'IN';
