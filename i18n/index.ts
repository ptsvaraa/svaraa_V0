import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';

export type Language = 'en' | 'hi';
export const LANGUAGES: readonly Language[] = ['en', 'hi'];

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hi: { translation: hi } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export function changeLanguage(language: Language): Promise<unknown> {
  return i18n.changeLanguage(language);
}

export default i18n;
