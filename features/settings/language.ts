import { changeLanguage, LANGUAGES, type Language } from '@/i18n';
import { storage } from '@/services/storage';
import { useSettings } from './store';

const KEY = 'svaraa.language';

/** Switch the app language everywhere and remember it. */
export async function setAppLanguage(language: Language): Promise<void> {
  useSettings.getState().setLanguage(language);
  await changeLanguage(language);
  await storage.set(KEY, language);
}

/** Call once at start: restores the saved language, if any. */
export async function restoreLanguage(): Promise<void> {
  const saved = await storage.get(KEY);
  if (saved && (LANGUAGES as readonly string[]).includes(saved)) {
    useSettings.getState().setLanguage(saved as Language);
    await changeLanguage(saved as Language);
  }
}
