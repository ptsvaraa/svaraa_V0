import { darkColors, lightColors, radius, space, typeScale, type ColorSet } from './tokens';

export type ThemeMode = 'caregiver' | 'wearer';
export type ColorScheme = 'light' | 'dark';

export type Theme = {
  mode: ThemeMode;
  scheme: ColorScheme;
  colors: ColorSet;
  space: typeof space;
  radius: typeof radius;
  /** Multiplies every font size and line height. Wearer = larger text. */
  fontScale: number;
  /** Smallest height of anything tappable, in dp. Same in both themes. */
  minTarget: number;
  /** Button heights by size. */
  buttonHeight: { sm: number; md: number; lg: number };
  typeScale: typeof typeScale;
};

/** Buttons and tap targets are the same size in both themes. Only text size differs. */
const TARGETS = { minTarget: 44, buttonHeight: { sm: 36, md: 44, lg: 52 } } as const;
const CAREGIVER = { fontScale: 1, ...TARGETS } as const;
const WEARER = { fontScale: 1.25, ...TARGETS } as const;

export function createTheme(mode: ThemeMode, scheme: ColorScheme): Theme {
  const sizes = mode === 'wearer' ? WEARER : CAREGIVER;
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
