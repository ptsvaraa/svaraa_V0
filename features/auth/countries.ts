/** Countries offered for the mobile number. India first. Names are in i18n under `countries.<id>`. */
export const COUNTRIES = [
  { id: 'IN', dial: '+91' },
  { id: 'US', dial: '+1' },
  { id: 'GB', dial: '+44' },
  { id: 'AE', dial: '+971' },
  { id: 'SG', dial: '+65' },
  { id: 'CA', dial: '+1' },
  { id: 'AU', dial: '+61' },
  { id: 'SA', dial: '+966' },
  { id: 'NP', dial: '+977' },
  { id: 'BD', dial: '+880' },
] as const;

export type CountryId = (typeof COUNTRIES)[number]['id'];
export const DEFAULT_COUNTRY: CountryId = 'IN';
export const dialCode = (id: CountryId): string => COUNTRIES.find((c) => c.id === id)?.dial ?? '+91';
