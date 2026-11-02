import { darkColors, lightColors, radius, space, typeScale, type ColorSet } from './tokens';

export type ThemeMode = 'caretaker' | 'wearer';
export type ColorScheme = 'light' | 'dark';

export type Theme = {
  mode: ThemeMode;
  scheme: ColorScheme;
  colors: ColorSet;
  space: typeof space;
  radius: typeof radius;
  /** Multiplies every font size and line height. Wearer = larger text. */
  fontScale: number;
  /** Smallest height of anything tappable, in dp. Wearer buttons are 56 dp or more. */
  minTarget: number;
  /** Button heights by size. */
  buttonHeight: { sm: number; md: number; lg: number };
  typeScale: typeof typeScale;
};

const CARETAKER = { fontScale: 1, minTarget: 44, buttonHeight: { sm: 36, md: 44, lg: 52 } } as const;
const WEARER = { fontScale: 1.25, minTarget: 56, buttonHeight: { sm: 56, md: 64, lg: 72 } } as const;

export function createTheme(mode: ThemeMode, scheme: ColorScheme): Theme {
  const sizes = mode === 'wearer' ? WEARER : CARETAKER;
  return {
    mode,
    scheme,
    colors: scheme === 'dark' ? darkColors : lightColors,
    space,
    radius,
    typeScale,
    fontScale: sizes.fontScale,
    minTarget: sizes.minTarget,
    buttonHeight: { ...sizes.buttonHeight },
  };
}
