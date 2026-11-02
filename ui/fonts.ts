import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Newsreader_400Regular, Newsreader_400Regular_Italic } from '@expo-google-fonts/newsreader';
import { NotoSans_400Regular, NotoSans_500Medium, NotoSans_600SemiBold } from '@expo-google-fonts/noto-sans';
import {
  NotoSansDevanagari_400Regular,
  NotoSansDevanagari_500Medium,
  NotoSansDevanagari_600SemiBold,
} from '@expo-google-fonts/noto-sans-devanagari';
import type { TypeStyle } from './tokens';

/** Fonts to load once at app start (see app/_layout.tsx). */
export const fontAssets = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
  NotoSansDevanagari_400Regular,
  NotoSansDevanagari_500Medium,
  NotoSansDevanagari_600SemiBold,
};

const WEIGHT_SUFFIX = { '400': '400Regular', '500': '500Medium', '600': '600SemiBold' } as const;

/**
 * Hindi uses Noto Sans Devanagari for every text style, because Newsreader and Inter have no Devanagari glyphs.
 * English uses Newsreader for display text and Inter for the rest.
 */
export function fontFamily(
  language: string,
  style: Pick<TypeStyle, 'face' | 'weight'>,
  italic = false,
): string {
  if (language === 'hi') return `NotoSansDevanagari_${WEIGHT_SUFFIX[style.weight]}`;
  if (style.face === 'display') return italic ? 'Newsreader_400Regular_Italic' : 'Newsreader_400Regular';
  return `Inter_${WEIGHT_SUFFIX[style.weight]}`;
}
