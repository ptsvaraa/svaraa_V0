import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';

const FILES = {
  light: require('../assets/brand/logo-light.png'),
  dark: require('../assets/brand/logo-dark.png'),
} as const;

/** Lotus mark with the svaraa wordmark. Picks the light or dark version from the theme. `height` is in dp. */
export function Logo({ height = 64 }: { height?: number }) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Image
      source={FILES[theme.scheme]}
      accessibilityRole="image"
      accessibilityLabel={t('auth.welcome.logo')}
      resizeMode="contain"
      style={{ height, width: height * (1399 / 430) }}
    />
  );
}
