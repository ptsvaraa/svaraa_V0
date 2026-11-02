import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { setAppLanguage } from '@/features/settings/language';
import type { Language } from '@/i18n';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

/** English / Hindi switch. Each option is written in its own language so it can always be found. */
export function LanguageSwitch() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const c = theme.colors;
  const options: { id: Language; label: string }[] = [
    { id: 'en', label: t('common.english') },
    { id: 'hi', label: t('common.hindi') },
  ];
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t('common.language')}
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        padding: 3,
        borderRadius: theme.radius.full,
        backgroundColor: c.sunken,
      }}
    >
      {options.map((o) => {
        const selected = i18n.language === o.id;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => void setAppLanguage(o.id)}
            style={{
              minHeight: theme.minTarget - 6,
              paddingHorizontal: theme.space[4],
              justifyContent: 'center',
              borderRadius: theme.radius.full,
              backgroundColor: selected ? c.action : 'transparent',
            }}
          >
            <Text variant="label" style={{ color: selected ? c.onAction : c.textSecondary }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
