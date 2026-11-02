import { create } from 'zustand';
import type { ThemeMode } from '@/ui/theme';
import type { Language } from '@/i18n';

export type SchemePreference = 'system' | 'light' | 'dark';

type SettingsState = {
  themeMode: ThemeMode;
  scheme: SchemePreference;
  language: Language;
  setThemeMode: (mode: ThemeMode) => void;
  setScheme: (scheme: SchemePreference) => void;
  setLanguage: (language: Language) => void;
};

/** App-level settings. Theme mode will later follow the signed-in role (caretaker or wearer). */
export const useSettings = create<SettingsState>((set) => ({
  themeMode: 'caretaker',
  scheme: 'system',
  language: 'en',
  setThemeMode: (themeMode) => set({ themeMode }),
  setScheme: (scheme) => set({ scheme }),
  setLanguage: (language) => set({ language }),
}));
