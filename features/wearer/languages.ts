/** Languages the wearer can choose on C1 (names in i18n under `languages.<id>`). The voice assistant uses them. */
export const WEARER_LANGUAGES = ['en', 'hi', 'ta', 'gu', 'bn'] as const;
export type WearerLanguage = (typeof WEARER_LANGUAGES)[number];
