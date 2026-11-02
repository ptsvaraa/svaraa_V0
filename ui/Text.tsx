import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontFamily } from './fonts';
import { useTheme } from './ThemeProvider';
import type { TypeVariant } from './tokens';

export type TextTone =
  'primary' | 'secondary' | 'tertiary' | 'heading' | 'accent' | 'spirit' | 'onAction' | 'safety';

export type TextProps = RNTextProps & {
  variant?: TypeVariant;
  tone?: TextTone;
  italic?: boolean;
};

/** All text goes through this component so size, font and Hindi glyphs follow the theme and language. */
export function Text({ variant = 'body', tone = 'primary', italic, style, ...rest }: TextProps) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const t = theme.typeScale[variant];
  const c = theme.colors;
  const color = {
    primary: c.textPrimary,
    secondary: c.textSecondary,
    tertiary: c.textTertiary,
    heading: c.heading,
    accent: c.accentItalic,
    spirit: c.accentSpirit,
    onAction: c.onAction,
    safety: c.safety,
  }[tone];
  const hindi = i18n.language === 'hi';
  return (
    <RNText
      {...rest}
      style={[
        {
          color,
          fontFamily: fontFamily(i18n.language, t, italic),
          fontSize: t.size * theme.fontScale,
          // Devanagari needs more line height for its matras.
          lineHeight: t.line * theme.fontScale * (hindi ? 1.12 : 1),
          letterSpacing: hindi ? 0 : t.tracking,
          textTransform: t.uppercase && !hindi ? 'uppercase' : undefined,
        },
        style,
      ]}
    />
  );
}
